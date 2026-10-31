import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/courses
 * Returns all active academic courses for the authenticated user,
 * along with task counts, completion progress, and nearest upcoming deadlines.
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

    const courses = await prisma.course.findMany({
      where: {
        userId: user.id,
      },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            completed: true,
            status: true,
            dueDate: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        code: "asc",
      },
    });

    const formattedCourses = courses.map((c, index: number) => {
      const totalTasks = c.tasks.length;
      const completedTasks = c.tasks.filter((t) => t.completed || t.status === "COMPLETED").length;
      const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Color cycling matching reference screenshot (Green, Purple, Blue)
      const colorPalette: Array<"green" | "purple" | "blue"> = ["green", "purple", "blue"];
      const color = colorPalette[index % colorPalette.length];

      // Find nearest upcoming deadline among incomplete tasks
      const incompleteWithDueDate = c.tasks
        .filter((t) => !t.completed && t.dueDate)
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

      let deadline = "Flexible";
      if (incompleteWithDueDate.length > 0 && incompleteWithDueDate[0].dueDate) {
        deadline = new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(incompleteWithDueDate[0].dueDate));
      }

      return {
        id: c.id,
        code: c.code,
        name: c.title,
        courseCode: c.code,
        instructor: c.instructor,
        credit: c.credit,
        color,
        tasksCount: totalTasks,
        completedTasksCount: completedTasks,
        progressPercent,
        deadline,
        avatars: user.image
          ? [{ name: user.name || "Student", src: user.image }]
          : [],
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedCourses,
    });
  } catch (err) {
    console.error("Failed to fetch courses:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch courses" } },
      { status: 500 }
    );
  }
}
