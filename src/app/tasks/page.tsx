"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  TopHeader,
} from "@/components/dashboard";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Inbox,
  Filter,
  ArrowUpDown,
  GraduationCap,
  X,
  RotateCcw,
  Loader2,
} from "@/components/ui/GoogleIcon";
import { toast, Toaster } from "sonner";
import type { Task } from "@/types/task";
import { COURSES } from "@/lib/academic";

const COURSE_LABELS: Record<string, string> = {
  "0611CSE321": "0611CSE321 • AIES",
  "0613CSE333": "0613CSE333 • AP",
  "0541MAT337": "0541MAT337 • MACS",
  "0612CSE315": "0612CSE315 • CN",
  "0031CSE320": "0031CSE320 • TWRM",
  "0612CSE316": "0612CSE316 • CN Sess.",
  "0611CSE322": "0611CSE322 • AIES Sess.",
  "0613CSE334": "0613CSE334 • AP Sess.",
  General: "General Routine",
};

const COURSE_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  "0611CSE321": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200/80" },
  "0613CSE333": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200/80" },
  "0541MAT337": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200/80" },
  "0612CSE315": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/80" },
  "0031CSE320": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200/80" },
  "0612CSE316": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200/80" },
  "0611CSE322": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200/80" },
  "0613CSE334": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200/80" },
  General: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
};

function formatDueDate(dueDateStr?: string | null) {
  if (!dueDateStr) return null;
  try {
    const due = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(due);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { label: "Due Today", isToday: true, isOverdue: false };
    if (diffDays === 1) return { label: "Due Tomorrow", isTomorrow: true, isOverdue: false };
    if (diffDays < 0) return { label: `Overdue (${Math.abs(diffDays)}d ago)`, isOverdue: true };

    return {
      label: `Due ${due.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      isOverdue: false,
    };
  } catch {
    return { label: dueDateStr, isOverdue: false };
  }
}

export default function MyTasksPage() {
  const router = useRouter();

  // Core Data
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  // Layout State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // Dialog States
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(null);

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusChip, setStatusChip] = React.useState<"ALL" | "ACTIVE" | "COMPLETED" | "OVERDUE">("ALL");
  const [selectedCourse, setSelectedCourse] = React.useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = React.useState<string>("ALL");
  const [sortBy, setSortBy] = React.useState<"newest" | "due-date" | "priority">("newest");

  // 1. Load User
  React.useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else if (res.status === 401) {
          router.push("/login");
        }
      } catch (err) {
        console.error("User check failed:", err);
      }
    }
    loadUser();
  }, [router]);

  // 2. Fetch Tasks
  const fetchTasks = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/tasks?limit=50&sortBy=createdAt&sortOrder=desc");
      if (res.ok) {
        const json = await res.json();
        setTasks(json.data || []);
      } else if (res.status === 401) {
        router.push("/login");
      } else {
        setLoadError("Failed to fetch tasks");
      }
    } catch {
      setLoadError("Network error while connecting to server");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 3. Status Toggle Handler
  const handleToggleCompleted = async (task: Task) => {
    const nextCompleted = !task.completed;
    setUpdatingTaskId(task.id);

    // Optimistic Update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextCompleted }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? json.data : t))
          );
        }
        toast.success(
          nextCompleted ? "Task completed! Nice work 🎉" : "Task marked active"
        );
      } else {
        fetchTasks();
        toast.error("Failed to update task");
      }
    } catch {
      fetchTasks();
      toast.error("Network error");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // 4. Delete Handler
  const handleConfirmDelete = async (taskId: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setDeletingTask(null);
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    } catch {
      toast.error("Network error while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  // 5. Success Callback for Create/Edit
  const handleFormSuccess = (savedTask: Task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === savedTask.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTask.id ? savedTask : t));
      }
      return [savedTask, ...prev];
    });
    setIsCreateModalOpen(false);
    setEditingTask(null);
    toast.success(editingTask ? "Task updated successfully!" : "New task created successfully!");
  };

  // Helper to determine resolved priority
  const getTaskPriority = (task: Task): "High" | "Medium" | "Low" => {
    if (task.priority) {
      const p = task.priority.toUpperCase();
      if (p === "HIGH") return "High";
      if (p === "LOW") return "Low";
      return "Medium";
    }
    // Intelligent academic heuristic if not explicit in DB:
    if (task.dueDate && !task.completed) {
      const due = new Date(task.dueDate);
      const diffHours = (due.getTime() - Date.now()) / (1000 * 60 * 60);
      if (diffHours <= 48) return "High";
      if (diffHours <= 168) return "Medium";
    }
    return "Medium";
  };

  // Helper to determine status badge
  const getTaskStatus = (task: Task): { label: string; badgeClass: string } => {
    if (task.completed) {
      return {
        label: "Completed",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      };
    }
    if (task.dueDate) {
      const due = new Date(task.dueDate);
      if (due < new Date()) {
        return {
          label: "Overdue",
          badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80",
        };
      }
    }
    return {
      label: "Pending",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200/80",
    };
  };

  // 6. Filter & Sort Tasks in Memory
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesCourse = task.course?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCourse) return false;
      }

      // Status Chip
      if (statusChip === "ACTIVE" && task.completed) return false;
      if (statusChip === "COMPLETED" && !task.completed) return false;
      if (statusChip === "OVERDUE") {
        if (task.completed || !task.dueDate) return false;
        const due = new Date(task.dueDate);
        if (due >= new Date()) return false;
      }

      // Course Filter
      if (selectedCourse !== "ALL") {
        if ((task.course || "General") !== selectedCourse) return false;
      }

      // Priority Filter
      if (selectedPriority !== "ALL") {
        const taskP = getTaskPriority(task);
        if (taskP.toUpperCase() !== selectedPriority.toUpperCase()) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "due-date") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === "priority") {
        const weight: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
        return weight[getTaskPriority(b)] - weight[getTaskPriority(a)];
      }
      return 0;
    });
  }, [tasks, searchQuery, statusChip, selectedCourse, selectedPriority, sortBy]);

  // Overall Task Counts
  const totalTasksCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const overdueCount = tasks.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] selection:bg-[#315BFF] selection:text-white">
      <Toaster position="top-right" richColors />

      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 2. Main Wrapper */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Top Header */}
        <TopHeader
          user={currentUser}
          searchQuery=""
          onSearchChange={(q) => setSearchQuery(q)}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Page Main Content */}
        <main className="flex-1 w-full max-w-[1300px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Header: Title & "+ Add New Task" Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  My Tasks
                </h1>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#315BFF] border border-blue-200/80 shadow-2xs">
                  {totalTasksCount} {totalTasksCount === 1 ? "Task" : "Tasks"}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Manage, track, and complete your academic coursework and routine deadlines.
              </p>
            </div>

            <Button
              onClick={() => {
                setEditingTask(null);
                setIsCreateModalOpen(true);
              }}
              className="bg-[#315BFF] hover:bg-[#254BE3] text-white font-semibold rounded-xl h-11 px-5 shadow-sm shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition active:scale-[0.99] self-start sm:self-auto shrink-0"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add New Task</span>
            </Button>
          </div>

          {/* Filter & Search Bar Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            {/* Search and Sort row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search input field */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10.5 pl-10 pr-9 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-[#315BFF] focus:ring-4 focus:ring-[#315BFF]/10 text-slate-900 placeholder:text-slate-400 transition outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Dropdowns row (Course, Priority, Sort) */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                {/* Course Dropdown */}
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full sm:w-auto h-10.5 pl-3.5 pr-8 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:border-[#315BFF] focus:ring-2 focus:ring-[#315BFF]/15 transition cursor-pointer appearance-none"
                  >
                    <option value="ALL">All Courses</option>
                    {COURSES.map((c) => (
                      <option key={c} value={c}>
                        {COURSE_LABELS[c] || c}
                      </option>
                    ))}
                  </select>
                  <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* Priority Dropdown */}
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full sm:w-auto h-10.5 pl-3.5 pr-8 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:border-[#315BFF] focus:ring-2 focus:ring-[#315BFF]/15 transition cursor-pointer appearance-none"
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                  <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full sm:w-auto h-10.5 pl-3.5 pr-8 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:border-[#315BFF] focus:ring-2 focus:ring-[#315BFF]/15 transition cursor-pointer appearance-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="due-date">Due Date</option>
                    <option value="priority">Priority</option>
                  </select>
                  <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Filter chips: All, Active, Completed, Overdue */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusChip("ALL")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusChip === "ALL"
                    ? "bg-[#315BFF] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200"
                }`}
              >
                All ({totalTasksCount})
              </button>

              <button
                type="button"
                onClick={() => setStatusChip("ACTIVE")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusChip === "ACTIVE"
                    ? "bg-[#315BFF] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200"
                }`}
              >
                Active ({activeCount})
              </button>

              <button
                type="button"
                onClick={() => setStatusChip("COMPLETED")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusChip === "COMPLETED"
                    ? "bg-[#315BFF] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200"
                }`}
              >
                Completed ({completedCount})
              </button>

              <button
                type="button"
                onClick={() => setStatusChip("OVERDUE")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusChip === "OVERDUE"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-white text-rose-600 hover:bg-rose-50 border border-rose-200/80"
                }`}
              >
                Overdue ({overdueCount})
              </button>

              {/* Reset filter button if any active filter */}
              {(searchQuery || statusChip !== "ALL" || selectedCourse !== "ALL" || selectedPriority !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusChip("ALL");
                    setSelectedCourse("ALL");
                    setSelectedPriority("ALL");
                  }}
                  className="ml-auto text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Task List Section */}
          <div className="space-y-3.5">
            {/* Loading Skeleton */}
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white border border-slate-200/80 animate-pulse flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-5 w-5 rounded-md bg-slate-200" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/3 rounded-md bg-slate-200" />
                        <div className="h-3 w-1/4 rounded-md bg-slate-100" />
                      </div>
                    </div>
                    <div className="h-8 w-20 rounded-lg bg-slate-100" />
                  </div>
                ))}
              </div>
            )}

            {/* Error Message */}
            {!isLoading && loadError && (
              <div className="p-8 text-center rounded-2xl bg-red-50/70 border border-red-200 text-red-700 space-y-3">
                <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
                <h3 className="font-bold text-base">Failed to load tasks</h3>
                <p className="text-xs text-red-600 max-w-sm mx-auto">{loadError}</p>
                <Button
                  onClick={fetchTasks}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-red-200 bg-white hover:bg-red-50 text-red-700"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !loadError && filteredTasks.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-slate-200 bg-white shadow-2xs animate-fade-in-up">
                <div className="h-16 w-16 rounded-2xl bg-blue-50 text-[#315BFF] flex items-center justify-center mb-4 shadow-2xs">
                  <Inbox className="h-8 w-8 stroke-[1.8]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  No tasks yet
                </h3>
                <p className="text-sm text-slate-500 max-w-md mt-1 mb-6 leading-relaxed">
                  {searchQuery || statusChip !== "ALL" || selectedCourse !== "ALL" || selectedPriority !== "ALL"
                    ? "No tasks match your current search and filter criteria. Try adjusting your filters."
                    : "Fill your workspace with your first task to stay ahead of upcoming classes, deadlines, and exams."}
                </p>
                <Button
                  onClick={() => {
                    setEditingTask(null);
                    setIsCreateModalOpen(true);
                  }}
                  className="h-11 px-6 gap-2 bg-[#315BFF] hover:bg-[#254BE3] text-white font-semibold rounded-xl shadow-md shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>Create your first task</span>
                </Button>
              </div>
            )}

            {/* Vertical List of Task Cards */}
            {!isLoading && !loadError && filteredTasks.length > 0 && (
              <div className="space-y-3 animate-fade-in-up">
                {filteredTasks.map((task) => {
                  const priority = getTaskPriority(task);
                  const status = getTaskStatus(task);
                  const dueDateInfo = formatDueDate(task.dueDate);
                  const isUpdating = updatingTaskId === task.id;

                  const courseStyle =
                    COURSE_BADGES[task.course || ""] ||
                    COURSE_BADGES["General"];

                  return (
                    <div
                      key={task.id}
                      className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 bg-white hover:border-slate-300 hover:shadow-md ${
                        task.completed
                          ? "border-slate-200/80 bg-slate-50/40"
                          : "border-slate-200/90 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start sm:items-center justify-between gap-3.5">
                        {/* Left Side: Checkbox & Info */}
                        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                          {/* Checkbox */}
                          <div className="mt-0.5 sm:mt-0 flex items-center justify-center shrink-0">
                            {isUpdating ? (
                              <Loader2 className="h-5 w-5 text-[#315BFF] animate-spin" />
                            ) : (
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => handleToggleCompleted(task)}
                                disabled={isUpdating}
                                className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-[#315BFF] data-[state=checked]:border-[#315BFF] cursor-pointer transition-transform group-hover:scale-105 active:scale-95"
                                aria-label={task.completed ? "Mark incomplete" : "Mark completed"}
                              />
                            )}
                          </div>

                          {/* Task Content */}
                          <div className="space-y-1.5 flex-1 min-w-0">
                            {/* Title & Description */}
                            <div className="flex flex-col">
                              <span
                                onClick={() => {
                                  setEditingTask(task);
                                  setIsCreateModalOpen(true);
                                }}
                                className={`text-base font-bold tracking-tight block hover:text-[#315BFF] transition-colors cursor-pointer truncate ${
                                  task.completed
                                    ? "line-through text-slate-400"
                                    : "text-slate-900"
                                }`}
                              >
                                {task.title}
                              </span>
                              {task.description && (
                                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 leading-relaxed">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            {/* Metadata Badges: Course, Due Date, Priority, Status */}
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              {/* Course Code & Name */}
                              {task.course && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${courseStyle.bg} ${courseStyle.text} ${courseStyle.border}`}
                                >
                                  <GraduationCap className="h-3 w-3" />
                                  <span>{COURSE_LABELS[task.course] || task.course}</span>
                                </span>
                              )}

                              {/* Due Date with Calendar Icon */}
                              {dueDateInfo && (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium border ${
                                    dueDateInfo.isOverdue
                                      ? "bg-rose-50 text-rose-700 border-rose-200/80 font-semibold"
                                      : dueDateInfo.isToday
                                      ? "bg-blue-50 text-blue-700 border-blue-200/80 font-semibold"
                                      : "bg-slate-50 text-slate-700 border-slate-200/80"
                                  }`}
                                >
                                  <Calendar className="h-3 w-3" />
                                  <span>{dueDateInfo.label}</span>
                                </span>
                              )}

                              {/* Priority Badge */}
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                                  priority === "High"
                                    ? "bg-rose-50 text-rose-700 border-rose-200/80"
                                    : priority === "Medium"
                                    ? "bg-amber-50 text-amber-700 border-amber-200/80"
                                    : "bg-blue-50 text-blue-700 border-blue-200/80"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    priority === "High"
                                      ? "bg-rose-500"
                                      : priority === "Medium"
                                      ? "bg-amber-500"
                                      : "bg-blue-500"
                                  }`}
                                />
                                <span>{priority}</span>
                              </span>

                              {/* Status Badge */}
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${status.badgeClass}`}
                              >
                                {status.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Three-dot Action Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 shrink-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                              aria-label="Task options"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-slate-200 p-1">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingTask(task);
                                setIsCreateModalOpen(true);
                              }}
                              className="rounded-lg text-xs font-medium cursor-pointer"
                            >
                              <Pencil className="mr-2 h-3.5 w-3.5 text-slate-500" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg text-xs font-medium cursor-pointer">
                              <Link href={`/task/${task.id}`}>
                                <ExternalLink className="mr-2 h-3.5 w-3.5 text-slate-500" />
                                <span>View Details</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100 my-1" />
                            <DropdownMenuItem
                              onClick={() => setDeletingTask(task)}
                              className="rounded-lg text-xs font-medium text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5 text-rose-500" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create / Edit Task Modal */}
      <TaskDialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) setEditingTask(null);
        }}
        initialData={editingTask}
        onSuccess={handleFormSuccess}
        mode="form"
      />

      {/* Delete Confirmation Modal */}
      <TaskDialog
        open={!!deletingTask}
        onOpenChange={(open) => {
          if (!open) setDeletingTask(null);
        }}
        mode="delete"
        taskToDelete={deletingTask}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
