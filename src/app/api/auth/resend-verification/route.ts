import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";

/**
 * Generate a 6-digit verification code (OTP)
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = body?.email;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { message: "A valid email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email address.", unverified: false },
        { status: 404 }
      );
    }

    // If checkOnly flag is passed, just return verification status
    if (body?.checkOnly) {
      return NextResponse.json({
        unverified: !user.emailVerified,
      });
    }

    // If user is already verified, return appropriate message
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "This email address is already verified. You can log in directly." },
        { status: 200 }
      );
    }

    // Generate new 6-digit OTP code and 10-minute expiration
    const verificationCode = generateOTP();
    const verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user record with new OTP & expiry
    await db.user.update({
      where: { id: user.id },
      data: {
        verificationToken: verificationCode,
        verificationTokenExpires,
      },
    });

    // Generate direct verification link
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const verificationUrl = `${baseUrl.replace(/\/$/, "")}/verify-email?code=${encodeURIComponent(
      verificationCode
    )}&email=${encodeURIComponent(user.email)}`;

    console.log(`\n============================================================`);
    console.log(`[RESEND OTP] NEW 6-DIGIT CODE FOR: ${user.email}`);
    console.log(`>>> OTP: ${verificationCode} <<<`);
    console.log(`>>> Link: ${verificationUrl} <<<`);
    console.log(`============================================================\n`);

    // Send verification email using Nodemailer Gmail SMTP
    const emailResult = await sendVerificationEmail(user.email, verificationCode);

    if (!emailResult.success) {
      console.warn("[Nodemailer Warning] Could not deliver email:", emailResult.error);
      return NextResponse.json(
        {
          message: `Email could not be delivered: ${emailResult.error}`,
          verificationUrl,
          verificationCode,
          emailSent: false,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "A new 6-digit verification code has been sent to your email.",
        verificationUrl,
        verificationCode,
        emailSent: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while resending verification code." },
      { status: 500 }
    );
  }
}
