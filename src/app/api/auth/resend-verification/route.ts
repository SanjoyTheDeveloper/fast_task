import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

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

    // Generate new secure verification token and 24h expiration
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user record with new token & expiry
    await db.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpires,
      },
    });

    // Generate direct verification link
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const verificationUrl = `${baseUrl.replace(/\/$/, "")}/verify-email?token=${encodeURIComponent(
      verificationToken
    )}`;

    // Send verification email using Resend
    const emailResult = await sendVerificationEmail(user.email, verificationToken);

    console.log(`\n============================================================`);
    console.log(`[DEV] DIRECT VERIFICATION LINK FOR: ${user.email}`);
    console.log(`>>> ${verificationUrl} <<<`);
    console.log(`============================================================\n`);

    if (!emailResult.success) {
      console.warn("[Resend Warning] Could not deliver email via Resend:", emailResult.error);
      return NextResponse.json(
        {
          message: `Email could not be delivered to Gmail: ${emailResult.error}`,
          verificationUrl,
          emailSent: false,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "Verification email sent successfully. Please check your inbox.",
        verificationUrl,
        emailSent: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while resending verification email." },
      { status: 500 }
    );
  }
}
