import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { taskSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    const where: any = { userId: user.id };
    if (status && ["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      where.status = status;
    }
    if (priority && ["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      where.priority = priority;
    }

    let tasks = await db.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    if (search && search.trim() !== "") {
      const q = search.toLowerCase();
      tasks = tasks.filter(
        (t: any) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return NextResponse.json({ message: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const result = taskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, status, priority, dueDate } = result.data;

    // Securely tie the task directly to the authenticated user ID
    const task = await db.task.create({
      data: {
        title,
        description: description || null,
        status: status as any,
        priority: priority as any,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Task created successfully", task }, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ message: "Failed to create task" }, { status: 500 });
  }
}
