import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

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

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    // Hash password and store user
    const hashedPassword = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    // Create session
    const sessionUser = { id: user.id, email: user.email, name: user.name };
    const token = await createSessionToken(sessionUser);
    await setSessionCookie(token);

    return NextResponse.json(
      { message: "Account created successfully", user: sessionUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}
