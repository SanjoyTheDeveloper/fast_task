import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations";

export class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified";

  constructor(message = "Please verify your email before logging in") {
    super(message);
    this.message = message;
    this.name = "EmailNotVerifiedError";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fast-task-auth-js-secure-production-secret-key-min-32-chars",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days persistent session across PC reboots
    updateAge: 24 * 60 * 60,
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        const isEmailServiceActive =
          (!!process.env.EMAIL_USER &&
            !process.env.EMAIL_USER.includes("your-email") &&
            !!process.env.EMAIL_PASS) ||
          (!!process.env.RESEND_API_KEY &&
            !process.env.RESEND_API_KEY.includes("xxxx") &&
            !process.env.RESEND_API_KEY.includes("placeholder"));

        // If email service is active and user is unverified, require verification
        if (isEmailServiceActive && !user.emailVerified) {
          throw new EmailNotVerifiedError("Please verify your email before logging in");
        } else if (!user.emailVerified) {
          // In local dev/fallback mode without active email delivery, auto-verify so users never get locked out
          try {
            await db.user.update({
              where: { id: user.id },
              data: { emailVerified: new Date() },
            });
          } catch (e) {
            console.warn("Could not auto-verify user in fallback mode:", e);
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});

