import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token || !token.trim()) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    const cleanToken = token.trim();

    // Look up user by verification token
    const user = await db.user.findUnique({
      where: { verificationToken: cleanToken },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (user.verificationTokenExpires && new Date(user.verificationTokenExpires) < new Date()) {
      return NextResponse.json(
        { message: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Update user record: set emailVerified and clear verification token fields
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
        message: "Email verified successfully",
        email: user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during email verification" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Allow POST for convenience if called with body or query parameter
  try {
    let token: string | null = null;

    const { searchParams } = new URL(req.url);
    token = searchParams.get("token");

    if (!token) {
      try {
        const body = await req.json();
        token = body.token;
      } catch {
        // Body may not be valid JSON or empty
      }
    }

    if (!token || !token.trim()) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    const cleanToken = token.trim();

    const user = await db.user.findUnique({
      where: { verificationToken: cleanToken },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    if (user.verificationTokenExpires && new Date(user.verificationTokenExpires) < new Date()) {
      return NextResponse.json(
        { message: "Verification token has expired" },
        { status: 400 }
      );
    }

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
        message: "Email verified successfully",
        email: user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during email verification" },
      { status: 500 }
    );
  }
}
