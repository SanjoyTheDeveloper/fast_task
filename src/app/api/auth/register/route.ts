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

    const isEmailServiceActive =
      !!process.env.RESEND_API_KEY &&
      !process.env.RESEND_API_KEY.includes("xxxx") &&
      !process.env.RESEND_API_KEY.includes("placeholder");

    const initialEmailVerified = isEmailServiceActive ? null : new Date();

    // Hash password using bcryptjs and store user permanently
    const hashedPassword = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email: cleanEmail,
        password: hashedPassword,
        emailVerified: initialEmailVerified,
        verificationToken,
        verificationTokenExpires,
      },
    });

    console.log(
      `[Register API] ✓ User created with ID: ${user.id} and emailVerified: ${
        initialEmailVerified ? "Verified (Active)" : "Pending"
      }`
    );

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
    console.log(`  - DB emailVerified:   ${initialEmailVerified ? "ACTIVE" : "PENDING"}`);
    console.log(`  - Verification URL:   ${verificationUrl}`);
    console.log(`============================================================`);

    // Dispatch verification email if real service configured
    let emailSent = false;
    if (isEmailServiceActive) {
      const emailResult = await sendVerificationEmail(user.email, verificationToken);
      emailSent = emailResult.success;
    }

    const registeredUser = { id: user.id, email: user.email, name: user.name };
    const autoVerified = !isEmailServiceActive;

    return NextResponse.json(
      {
        message: autoVerified
          ? "Account created successfully! You can now log in immediately."
          : "Account created successfully! Please check your email and click the verification link.",
        user: registeredUser,
        emailSent,
        verificationUrl,
        autoVerified,
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
