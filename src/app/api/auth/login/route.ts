import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { db, prisma } from "@/lib/db";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { isEmailConfigured } from "@/lib/mail";

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
    const cleanEmail = email.toLowerCase().trim();

    // 1. Resilient user lookup with alias support (info.sanjoy.bh@gmail.com <-> sanjoy@fasttask.app)
    let user = null;
    try {
      user = await db.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch {
      // Fallback direct query if pooler had transient hiccup
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
      } catch (dbErr) {
        console.error("Database connection error during login:", dbErr);
      }
    }

    // If still not found, check student alias
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

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 2. Verify password
    let isPasswordValid = false;
    if (user.password) {
      isPasswordValid = await verifyPassword(password, user.password).catch(() => false);
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isEmailServiceActive = isEmailConfigured();

    // 3. Check email verification
    if (isEmailServiceActive && !user.emailVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in", code: "email_not_verified" },
        { status: 403 }
      );
    }

    const sessionUser = { id: user.id, email: user.email, name: user.name };

    return NextResponse.json(
      { message: "Credentials valid. Please use Auth.js session.", user: sessionUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
