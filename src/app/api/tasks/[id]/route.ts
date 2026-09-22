import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { taskIdSchema, updateTaskApiSchema } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  serializeTask,
} from "@/lib/api-response";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/tasks/[id]
 * Retrieves a single task belonging to the authenticated user.
 */
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const { id } = await params;
    const idResult = taskIdSchema.safeParse(id);
    if (!idResult.success) {
      return errorResponse("INVALID_TASK_ID", "Invalid task ID", 400);
    }

    const task = await db.task.findUnique({ where: { id: idResult.data } });

    // Enforce ownership: Return 404 TASK_NOT_FOUND if not found or belongs to another user
    if (!task || task.userId !== user.id) {
      return errorResponse("TASK_NOT_FOUND", "Task not found", 404);
    }

    return successResponse(serializeTask(task), 200);
  } catch (error) {
    console.error("GET /api/tasks/[id] error:", error);
    return errorResponse(
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred",
      500
    );
  }
}

/**
 * PATCH /api/tasks/[id]
 * Updates an existing task belonging to the authenticated user.
 */
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const { id } = await params;
    const idResult = taskIdSchema.safeParse(id);
    if (!idResult.success) {
      return errorResponse("INVALID_TASK_ID", "Invalid task ID", 400);
    }

    // Verify task exists and belongs to current user
    const existingTask = await db.task.findUnique({
      where: { id: idResult.data },
    });
    if (!existingTask || existingTask.userId !== user.id) {
      return errorResponse("TASK_NOT_FOUND", "Task not found", 404);
    }

    // Parse JSON body safely
    let body: any;
    try {
      body = await req.json();
    } catch {
      return errorResponse(
        "VALIDATION_ERROR",
        "Invalid request data",
        400,
        { body: ["Invalid JSON payload"] }
      );
    }

    // Validate update payload
    const result = updateTaskApiSchema.safeParse(body);
    if (!result.success) {
      // Check if the issue was that no fields were provided
      const isRefineError = result.error.errors.some(
        (e) => e.message === "At least one field must be provided"
      );

      if (isRefineError) {
        return errorResponse(
          "VALIDATION_ERROR",
          "At least one field must be provided",
          400
        );
      }

      const fieldErrors = result.error.flatten().fieldErrors;
      const details: Record<string, string[]> = {};
      for (const [key, val] of Object.entries(fieldErrors)) {
        if (val && val.length > 0) {
          details[key] = val;
        }
      }

      return errorResponse(
        "VALIDATION_ERROR",
        "Invalid request data",
        400,
        details
      );
    }

    // Build update object only with fields supplied
    const updateData: {
      title?: string;
      description?: string | null;
      completed?: boolean;
      status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    } = {};

    if (result.data.title !== undefined) {
      updateData.title = result.data.title;
    }
    if (result.data.description !== undefined) {
      updateData.description = result.data.description;
    }
    if (result.data.completed !== undefined) {
      updateData.completed = result.data.completed;
      updateData.status = result.data.completed ? "COMPLETED" : "PENDING";
    }

    const updatedTask = await db.task.update({
      where: { id: idResult.data },
      data: updateData,
    });

    return successResponse(serializeTask(updatedTask), 200);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return errorResponse(
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred",
      500
    );
  }
}

/**
 * DELETE /api/tasks/[id]
 * Deletes an existing task belonging to the authenticated user.
 */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    const { id } = await params;
    const idResult = taskIdSchema.safeParse(id);
    if (!idResult.success) {
      return errorResponse("INVALID_TASK_ID", "Invalid task ID", 400);
    }

    // Enforce ownership: Return 404 if not found or belongs to another user
    const existingTask = await db.task.findUnique({
      where: { id: idResult.data },
    });
    if (!existingTask || existingTask.userId !== user.id) {
      return errorResponse("TASK_NOT_FOUND", "Task not found", 404);
    }

    await db.task.delete({ where: { id: idResult.data } });

    // Success: 204 No Content with empty body (do NOT return JSON)
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return errorResponse(
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred",
      500
    );
  }
}
