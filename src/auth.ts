import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { db, prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import { isEmailConfigured } from "@/lib/mail";

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
        const cleanEmail = email.toLowerCase().trim();

        let user = null;
        try {
          user = await db.user.findUnique({
            where: { email: cleanEmail },
          });
        } catch {
          try {
            user = await prisma.user.findFirst({
              where: {
                OR: [
                  { email: cleanEmail },
                  cleanEmail === "info.sanjoy.bh@gmail.com" ? { email: "sanjoy@fasttask.app" } : undefined,
                  cleanEmail === "sanjoy@fasttask.app" ? { email: "info.sanjoy.bh@gmail.com" } : undefined,
                ].filter(Boolean) as { email: string }[],
              },
            });
          } catch {}
        }

        if (!user && (cleanEmail === "info.sanjoy.bh@gmail.com" || cleanEmail === "sanjoy@fasttask.app")) {
          user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: "info.sanjoy.bh@gmail.com" },
                { email: "sanjoy@fasttask.app" },
              ],
            },
          }).catch(() => null);
        }

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password).catch(() => false);

        if (!isPasswordValid) return null;

        const isEmailServiceActive = isEmailConfigured();

        // If email service is active and user is unverified, require verification
        if (isEmailServiceActive && !user.emailVerified) {
          throw new EmailNotVerifiedError("Please verify your email before logging in");
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

