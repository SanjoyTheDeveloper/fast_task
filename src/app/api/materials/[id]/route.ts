import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/materials/[id]
 * Deletes a course material belonging to the current user.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Material ID is required" } },
        { status: 400 }
      );
    }

    const existing = await db.courseMaterial.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Course material not found" } },
        { status: 404 }
      );
    }

    if (existing.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Access denied" } },
        { status: 403 }
      );
    }

    await db.courseMaterial.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/materials/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to delete material" } },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/materials/[id]
 * Updates a course material (e.g. toggle bookmark or edit fields)
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await db.courseMaterial.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Course material not found" } },
        { status: 404 }
      );
    }

    const updated = await db.courseMaterial.update({
      where: { id },
      data: {
        ...(typeof body.isBookmarked === "boolean" ? { isBookmarked: body.isBookmarked } : {}),
        ...(body.title ? { title: body.title.trim() } : {}),
        ...(body.courseCode ? { courseCode: body.courseCode.trim() } : {}),
        ...(body.courseName !== undefined ? { courseName: body.courseName?.trim() || null } : {}),
        ...(body.category ? { category: body.category.trim() } : {}),
        ...(body.tag !== undefined ? { tag: body.tag?.trim() || null } : {}),
        ...(body.schedule !== undefined ? { schedule: body.schedule?.trim() || null } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/materials/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to update material" } },
      { status: 500 }
    );
  }
}
