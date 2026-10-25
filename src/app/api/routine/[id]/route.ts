import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/routine/[id]
 * Deletes a routine class slot for the authenticated user.
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
        { success: false, error: { code: "VALIDATION_ERROR", message: "Slot ID is required" } },
        { status: 400 }
      );
    }

    const existing = await db.routineSchedule.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Class routine slot not found" } },
        { status: 404 }
      );
    }

    if (existing.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Access denied" } },
        { status: 403 }
      );
    }

    await db.routineSchedule.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Class routine slot deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/routine/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to delete routine slot" } },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/routine/[id]
 * Updates an existing routine class slot for the authenticated user.
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

    const existing = await db.routineSchedule.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Class routine slot not found" } },
        { status: 404 }
      );
    }

    const updated = await db.routineSchedule.update({
      where: { id },
      data: {
        ...(body.courseTitle || body.title ? { courseTitle: (body.courseTitle || body.title).trim() } : {}),
        ...(body.courseCode || body.code ? { courseCode: (body.courseCode || body.code).trim().toUpperCase() } : {}),
        ...(body.dayOfWeek || body.day ? { dayOfWeek: (body.dayOfWeek || body.day).trim() } : {}),
        ...(body.startTime ? { startTime: body.startTime.trim() } : {}),
        ...(body.endTime ? { endTime: body.endTime.trim() } : {}),
        ...(body.roomNo !== undefined || body.roomNumber !== undefined
          ? { roomNo: (body.roomNo || body.roomNumber)?.trim() || null }
          : {}),
        ...(body.instructor !== undefined || body.teacherName !== undefined
          ? { instructor: (body.instructor || body.teacherName)?.trim() || null }
          : {}),
        ...(body.semester !== undefined || body.batch !== undefined
          ? { semester: (body.semester || body.batch)?.trim() || null }
          : {}),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Class routine slot updated successfully",
    });
  } catch (error) {
    console.error("PATCH /api/routine/[id] error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to update routine slot" } },
      { status: 500 }
    );
  }
}
