import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Helper to process email verification
 */
async function processVerification(code?: string | null, email?: string | null) {
  if (!code || !code.trim()) {
    return NextResponse.json(
      { message: "Verification code is required" },
      { status: 400 }
    );
  }

  const cleanCode = code.trim();
  const cleanEmail = email ? email.trim().toLowerCase() : null;

  let user = null;

  // 1. If email is provided, look up by email first (more resilient)
  if (cleanEmail) {
    user = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email address" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        {
          message: "Email is already verified. You can log in directly.",
          alreadyVerified: true,
          email: user.email,
        },
        { status: 200 }
      );
    }

    if (!user.verificationToken || user.verificationToken !== cleanCode) {
      return NextResponse.json(
        { message: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }
  } else {
    // 2. Look up user directly by verification code / token
    user = await db.user.findUnique({
      where: { verificationToken: cleanCode },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }
  }

  // Check if code has expired
  if (user.verificationTokenExpires && new Date(user.verificationTokenExpires) < new Date()) {
    return NextResponse.json(
      { message: "Verification code has expired. Please request a new code." },
      { status: 400 }
    );
  }

  // Update user record: mark email as verified and clear verification code
  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
      verificationTokenExpires: null,
    },
  });

  console.log(`\n✅ [VERIFY EMAIL API] Email verified successfully for: ${user.email}\n`);

  return NextResponse.json(
    {
      message: "Email verified successfully! You can now log in.",
      email: user.email,
    },
    { status: 200 }
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code") || searchParams.get("token");
    const email = searchParams.get("email");

    return await processVerification(code, email);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during email verification" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let code: string | null = searchParams.get("code") || searchParams.get("token");
    let email: string | null = searchParams.get("email");

    try {
      const body = await req.json();
      if (body) {
        code = body.code || body.token || code;
        email = body.email || email;
      }
    } catch {
      // Body may not be JSON
    }

    return await processVerification(code, email);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during email verification" },
      { status: 500 }
    );
  }
}
