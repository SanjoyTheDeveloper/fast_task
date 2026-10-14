import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/materials
 * Returns all course materials belonging to the authenticated user.
 * Supports filtering by category, courseCode, and search query.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const courseCode = searchParams.get("courseCode");
    const search = searchParams.get("search")?.trim();

    const where: any = {
      userId: user.id,
    };

    if (category && category !== "All") {
      where.OR = [
        { category: { equals: category, mode: "insensitive" } },
        { courseCode: { equals: category, mode: "insensitive" } },
        { courseName: { equals: category, mode: "insensitive" } },
      ];
    }

    if (courseCode && courseCode !== "All") {
      where.courseCode = { contains: courseCode, mode: "insensitive" };
    }

    if (search && search.length > 0) {
      where.AND = [
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { courseCode: { contains: search, mode: "insensitive" } },
            { courseName: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
      ];
    }

    const materials = await db.courseMaterial.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: materials,
      count: materials.length,
    });
  } catch (error) {
    console.error("GET /api/materials error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch course materials" } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/materials
 * Saves a new user-uploaded course material / schedule item.
 * Fields: title, courseCode, courseName, category/tag, date/schedule, fileUrl, userId
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      courseCode,
      courseName,
      category,
      tag,
      schedule,
      date,
      fileUrl,
      fileSize,
      pages,
      description,
      materialType,
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Title is required" } },
        { status: 400 }
      );
    }

    const finalCourseCode = (courseCode || "General").trim();
    const finalCategory = (category || tag || "General").trim();
    const finalSchedule = (schedule || date || "").trim() || null;
    const finalTag = (tag || category || null)?.trim() || null;

    const newMaterial = await db.courseMaterial.create({
      data: {
        title: title.trim(),
        courseCode: finalCourseCode,
        courseName: courseName?.trim() || null,
        category: finalCategory,
        tag: finalTag,
        schedule: finalSchedule,
        fileUrl: fileUrl || null,
        fileSize: fileSize || null,
        pages: typeof pages === "number" ? pages : 1,
        description: description?.trim() || null,
        materialType: materialType?.trim() || null,
        isBookmarked: false,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newMaterial,
        message: "Course material uploaded successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/materials error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to create course material" } },
      { status: 500 }
    );
  }
}
