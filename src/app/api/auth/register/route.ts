import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { registerSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

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

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      console.warn(`[Register API] Registration rejected: Email ${cleanEmail} already exists`);
      return NextResponse.json(
        { message: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    // Generate secure 32-byte verification token and 24h expiration
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Hash password using bcryptjs and store user
    const hashedPassword = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email: cleanEmail,
        password: hashedPassword,
        emailVerified: null,
        verificationToken,
        verificationTokenExpires,
      },
    });

    console.log(`[Register API] ✓ User created with ID: ${user.id} and emailVerified: null`);

    // Prepare verification URL
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const verificationUrl = `${baseUrl.replace(/\/$/, "")}/verify-email?token=${encodeURIComponent(
      verificationToken
    )}`;

    console.log(`\n============================================================`);
    console.log(`[REGISTER API] NEW USER REGISTRATION`);
    console.log(`  - Name:               ${user.name}`);
    console.log(`  - Recipient Email:    ${user.email}`);
    console.log(`  - DB emailVerified:   null (Account unverified pending email)`);
    console.log(`  - Verification URL:   ${verificationUrl}`);
    console.log(`============================================================`);

    // Immediately dispatch verification email via Resend
    const emailResult = await sendVerificationEmail(user.email, verificationToken);

    if (!emailResult.success) {
      console.warn(`\n⚠️  [REGISTER API] Verification email not delivered via Resend:`);
      console.warn(`   Reason: ${emailResult.error}`);
      console.warn(`   Direct URL to verify: ${verificationUrl}\n`);
    } else {
      console.log(`\n✅ [REGISTER API] Verification email dispatched successfully via Resend!`);
      console.log(`   Resend Message ID: ${emailResult.data?.id}\n`);
    }

    const registeredUser = { id: user.id, email: user.email, name: user.name };

    return NextResponse.json(
      {
        message: "Account created successfully! Please check your email and click the verification link.",
        user: registeredUser,
        emailSent: emailResult.success,
        verificationUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Register API Error]:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}
