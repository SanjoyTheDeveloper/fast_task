import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateTaskSchema } from "@/lib/validations";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const task = await db.task.findUnique({ where: { id } });

    // Strict ownership verification
    if (!task || task.userId !== user.id) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("Get task error:", error);
    return NextResponse.json({ message: "Failed to retrieve task" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingTask = await db.task.findUnique({ where: { id } });

    // Verify ownership before modification
    if (!existingTask || existingTask.userId !== user.id) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = updateTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (result.data.title !== undefined) updateData.title = result.data.title;
    if (result.data.description !== undefined) updateData.description = result.data.description;
    if (result.data.status !== undefined) updateData.status = result.data.status;
    if (result.data.priority !== undefined) updateData.priority = result.data.priority;
    if (result.data.dueDate !== undefined) {
      updateData.dueDate = result.data.dueDate ? new Date(result.data.dueDate) : null;
    }

    const updatedTask = await db.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json({ message: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingTask = await db.task.findUnique({ where: { id } });

    // Verify ownership before deletion
    if (!existingTask || existingTask.userId !== user.id) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    await db.task.delete({ where: { id } });

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json({ message: "Failed to delete task" }, { status: 500 });
  }
}
