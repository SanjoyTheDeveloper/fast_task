import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";

/**
 * Generate a 6-digit verification code (OTP)
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;
    const cleanEmail = email.toLowerCase().trim();

    console.log("\n[Register API] ========== NEW REGISTRATION ATTEMPT ==========");
    console.log(`[Register API] Processing signup for email: ${cleanEmail}`);

    const isEmailServiceActive =
      (!!process.env.EMAIL_USER &&
        !process.env.EMAIL_USER.includes("your-email") &&
        !!process.env.EMAIL_PASS) ||
      (!!process.env.RESEND_API_KEY &&
        !process.env.RESEND_API_KEY.includes("xxxx") &&
        !process.env.RESEND_API_KEY.includes("placeholder"));

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    // 6-digit OTP code and 10-minute expiration
    const verificationCode = generateOTP();
    const verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const initialEmailVerified = isEmailServiceActive ? null : new Date();

    let user;

    if (existingUser) {
      if (existingUser.emailVerified) {
        console.warn(`[Register API] Registration rejected: Email ${cleanEmail} already exists`);
        return NextResponse.json(
          { message: "An account with this email address already exists" },
          { status: 409 }
        );
      }

      // Existing unverified user: update with new password and fresh 6-digit OTP
      const hashedPassword = await hashPassword(password);
      user = await db.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          password: hashedPassword,
          verificationToken: verificationCode,
          verificationTokenExpires,
          emailVerified: initialEmailVerified,
        },
      });

      console.log(`[Register API] Re-issued verification OTP for unverified user: ${user.id}`);
    } else {
      // Create new user with 6-digit OTP code
      const hashedPassword = await hashPassword(password);
      user = await db.user.create({
        data: {
          name,
          email: cleanEmail,
          password: hashedPassword,
          emailVerified: initialEmailVerified,
          verificationToken: verificationCode,
          verificationTokenExpires,
        },
      });

      console.log(
        `[Register API] ✓ User created with ID: ${user.id} and emailVerified: ${
          initialEmailVerified ? "Verified (Active)" : "Pending"
        }`
      );
    }

    // Prepare verification URL (with both code and email)
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const verificationUrl = `${baseUrl.replace(/\/$/, "")}/verify-email?code=${encodeURIComponent(
      verificationCode
    )}&email=${encodeURIComponent(user.email)}`;

    console.log(`\n============================================================`);
    console.log(`[REGISTER API] NEW USER REGISTRATION`);
    console.log(`  - Name:               ${user.name}`);
    console.log(`  - Recipient Email:    ${user.email}`);
    console.log(`  - DB emailVerified:   ${initialEmailVerified ? "ACTIVE" : "PENDING"}`);
    console.log(`  - 6-Digit OTP:        ${verificationCode}`);
    console.log(`  - Verification URL:   ${verificationUrl}`);
    console.log(`============================================================\n`);

    // Dispatch verification email with 6-digit OTP via Gmail SMTP (Nodemailer)
    let emailSent = false;
    if (isEmailServiceActive) {
      const emailResult = await sendVerificationEmail(user.email, verificationCode);
      emailSent = emailResult.success;
    }

    const registeredUser = { id: user.id, email: user.email, name: user.name };
    const autoVerified = !isEmailServiceActive;

    return NextResponse.json(
      {
        message: autoVerified
          ? "Account created successfully! You can now log in immediately."
          : "Account created successfully! A 6-digit verification code has been sent to your email.",
        user: registeredUser,
        emailSent,
        verificationUrl,
        verificationCode: autoVerified ? undefined : verificationCode, // Available in dev
        autoVerified,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[Register API Error]:", error);
    const err = error as { code?: string; message?: string };
    if (
      err?.code === "P2002" ||
      err?.message?.includes("already exists") ||
      err?.message?.includes("unique")
    ) {
      return NextResponse.json(
        { message: "An account with this email address already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}
