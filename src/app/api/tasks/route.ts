import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTaskApiSchema, taskQuerySchema } from "@/lib/validations";
import {
  successResponse,
  paginatedSuccessResponse,
  errorResponse,
  serializeTask,
} from "@/lib/api-response";
import { serializeTaskDescription } from "@/lib/academic";

/**
 * GET /api/tasks
 * Returns paginated tasks belonging to the authenticated user.
 * Supports database-level search, status filter, priority filter, sorting, and pagination.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    // Extract query parameters from URL
    const { searchParams } = new URL(req.url);
    const rawParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      rawParams[key] = value;
    });

    // Validate query parameters using Zod
    const queryValidation = taskQuerySchema.safeParse(rawParams);
    if (!queryValidation.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Invalid query parameters",
        400
      );
    }

    const { search, status, priority, sortBy, sortOrder, page, limit } =
      queryValidation.data;

    // 1. Construct reusable Prisma WHERE condition scoped strictly to the authenticated user
    const where: any = {
      userId: user.id,
    };

    // Database-level search across title OR description
    const cleanSearch = search ? search.trim() : "";
    if (cleanSearch.length > 0) {
      where.OR = [
        {
          title: {
            contains: cleanSearch,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: cleanSearch,
            mode: "insensitive",
          },
        },
      ];
    }

    // Database-level status filter
    const statusNormalized = status?.toLowerCase();
    if (statusNormalized === "active") {
      where.completed = false;
    } else if (statusNormalized === "completed") {
      where.completed = true;
    }

    // Database-level priority filter (supported by existing Prisma Task model)
    const priorityNormalized = priority?.toLowerCase();
    if (priorityNormalized === "low") {
      where.priority = "LOW";
    } else if (priorityNormalized === "medium") {
      where.priority = "MEDIUM";
    } else if (priorityNormalized === "high") {
      where.priority = "HIGH";
    }

    // 2. Database-level sorting with safe whitelist and secondary stable sort
    const allowedSortFields: Record<string, string> = {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      title: "title",
      completed: "completed",
    };

    const sortField = allowedSortFields[sortBy] || "createdAt";
    const orderDirection = sortOrder?.toLowerCase() === "asc" ? "asc" : "desc";

    const orderBy: any = [{ [sortField]: orderDirection }];
    if (sortField !== "id") {
      orderBy.push({ id: "desc" });
    }

    // 3. Database-level pagination
    const skip = (page - 1) * limit;
    const take = limit;

    // 4. Execute findMany and count concurrently via Prisma transaction
    const [tasks, total] = await db.$transaction([
      db.task.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      db.task.count({
        where,
      }),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const pagination = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };

    const serialized = Array.isArray(tasks) ? tasks.map(serializeTask) : [];

    return paginatedSuccessResponse(serialized, pagination, 200);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return errorResponse(
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred",
      500
    );
  }
}

/**
 * POST /api/tasks
 * Creates a new task for the authenticated user.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return errorResponse("UNAUTHORIZED", "Authentication required", 401);
    }

    // Safely parse JSON body
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

    // Validate body using Zod schema
    const result = createTaskApiSchema.safeParse(body);
    if (!result.success) {
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

    const { title, description, completed, dueDate, course, category } = result.data;
    const isCompleted = Boolean(completed);

    const packedDescription = serializeTaskDescription(
      description,
      course,
      category
    );

    // Create task in database tied strictly to the authenticated user ID
    const task = await db.task.create({
      data: {
        title,
        description: packedDescription,
        completed: isCompleted,
        status: isCompleted ? "COMPLETED" : "PENDING",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: user.id,
      },
    });

    return successResponse(serializeTask(task), 201);
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return errorResponse(
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred",
      500
    );
  }
}
