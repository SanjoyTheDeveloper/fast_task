import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password with bcryptjs
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isEmailServiceActive =
      !!process.env.RESEND_API_KEY &&
      !process.env.RESEND_API_KEY.includes("xxxx") &&
      !process.env.RESEND_API_KEY.includes("placeholder");

    // Check if user email is verified
    if (isEmailServiceActive && !user.emailVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in", code: "email_not_verified" },
        { status: 403 }
      );
    } else if (!user.emailVerified) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      } catch {}
    }

    const sessionUser = { id: user.id, email: user.email, name: user.name };

    return NextResponse.json(
      { message: "Credentials valid. Please use Auth.js session.", user: sessionUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
