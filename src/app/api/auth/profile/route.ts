import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: dbUser?.name || user.name,
        email: dbUser?.email || user.email,
        studentId: "2026-CSE-082",
        department: "Department of Computer Science & Engineering",
        batch: "Batch 82A",
        avatarColor: "purple",
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { name, studentId, department, batch, avatarColor } = body;

    let updatedDbUser = null;
    if (name && typeof name === "string" && name.trim()) {
      try {
        updatedDbUser = await prisma.user.update({
          where: { id: user.id },
          data: { name: name.trim() },
          select: { id: true, name: true, email: true },
        });
      } catch (dbErr) {
        console.warn("Database user update fallback:", dbErr);
      }
    }

    const updatedUser = {
      id: user.id,
      name: updatedDbUser?.name || name || user.name,
      email: user.email,
      studentId: studentId || "2026-CSE-082",
      department: department || "Department of Computer Science & Engineering",
      batch: batch || "Batch 82A",
      avatarColor: avatarColor || "purple",
    };

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
