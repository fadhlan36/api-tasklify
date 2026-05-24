import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { boardService } from "../services/boardService";
import { taskService } from "../services/taskService";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import ColumnDropZone from "../components/ColumnDropZone";
import TaskCard from "../components/TaskCard";
import TaskDetailModal from "../components/TaskDetailModal";
import CreateTaskModal from "../components/CreateTaskModal";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  order: number;
  dueDate?: string;
  columnId: string;
}

interface Column {
  id: string;
  title: string;
  order: number;
  color: string;
  tasks: Task[];
}

interface Board {
  id: string;
  title: string;
  description?: string;
  color: string;
  columns: Column[];
}

type SortField = "order" | "priority" | "title" | "dueDate";
type FilterPriority = "ALL" | "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type ColumnFilter = "ALL" | string;

export default function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [columnFilter, setColumnFilter] = useState<ColumnFilter>("ALL");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("ALL");
  const [sortField, setSortField] = useState<SortField>("order");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const fetchBoard = async () => {
    if (!id) return;
    try {
      const res = await boardService.getBoardDetail(id);
      const data: Board = res.data;
      setBoard(data);
      const sorted = (data.columns || [])
        .sort((a, b) => a.order - b.order)
        .map((col) => ({
          ...col,
          tasks: (col.tasks || []).sort((a, b) => a.order - b.order),
        }));
      setColumns(sorted);
    } catch (err) {
      console.error("fetchBoard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const processedColumns = useMemo(() => {
    let cols = columns;

    if (columnFilter !== "ALL") {
      cols = cols.filter((col) => col.id === columnFilter);
    }

    return cols.map((col) => {
      let tasks = [...col.tasks];

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        tasks = tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q),
        );
      }

      if (filterPriority !== "ALL") {
        tasks = tasks.filter((t) => t.priority === filterPriority);
      }

      tasks.sort((a, b) => {
        switch (sortField) {
          case "priority": {
            const w: Record<string, number> = {
              URGENT: 4,
              HIGH: 3,
              MEDIUM: 2,
              LOW: 1,
            };
            return (w[b.priority] || 0) - (w[a.priority] || 0);
          }
          case "title":
            return a.title.localeCompare(b.title);
          case "dueDate":
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return (
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );
          default:
            return a.order - b.order;
        }
      });

      return { ...col, tasks };
    });
  }, [columns, columnFilter, searchQuery, filterPriority, sortField]);

  const findColumnOfTask = (taskId: string) =>
    columns.find((col) => col.tasks.some((t) => t.id === taskId));

  const handleDragStart = (event: DragStartEvent) => {
    const col = findColumnOfTask(String(event.active.id));
    setActiveTask(col?.tasks.find((t) => t.id === event.active.id) ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeColId = findColumnOfTask(String(active.id))?.id;
    const overTask = columns
      .flatMap((c) => c.tasks)
      .find((t) => t.id === over.id);
    const overColId = overTask
      ? findColumnOfTask(String(over.id))?.id
      : String(over.id);

    if (!activeColId || !overColId || activeColId === overColId) return;

    setColumns((prev) => {
      const task = prev
        .find((c) => c.id === activeColId)
        ?.tasks.find((t) => t.id === active.id);
      if (!task) return prev;
      return prev.map((col) => {
        if (col.id === activeColId)
          return { ...col, tasks: col.tasks.filter((t) => t.id !== active.id) };
        if (col.id === overColId) {
          const overIdx = overTask
            ? col.tasks.findIndex((t) => t.id === over.id)
            : col.tasks.length;
          const newTasks = [...col.tasks];
          newTasks.splice(overIdx, 0, { ...task, columnId: overColId });
          return { ...col, tasks: newTasks };
        }
        return col;
      });
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || !id) return;

    const activeTaskObj = columns
      .flatMap((c) => c.tasks)
      .find((t) => t.id === active.id);
    if (!activeTaskObj) return;

    const overTask = columns
      .flatMap((c) => c.tasks)
      .find((t) => t.id === over.id);
    const targetColId = overTask
      ? findColumnOfTask(String(over.id))?.id
      : String(over.id);
    if (!targetColId) return;

    const targetCol = columns.find((c) => c.id === targetColId);
    if (!targetCol) return;

    if (activeTaskObj.columnId === targetColId) {
      const oldIdx = targetCol.tasks.findIndex((t) => t.id === active.id);
      const newIdx = targetCol.tasks.findIndex((t) => t.id === over.id);
      if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return;

      const reordered = arrayMove(targetCol.tasks, oldIdx, newIdx).map(
        (t, i) => ({ ...t, order: i }),
      );
      setColumns((prev) =>
        prev.map((col) =>
          col.id === targetColId ? { ...col, tasks: reordered } : col,
        ),
      );

      try {
        await Promise.all(
          reordered.map((t) =>
            taskService.updateTask(t.id, { order: t.order }),
          ),
        );
      } catch {
        fetchBoard();
      }
    } else {
      const order = targetCol.tasks.findIndex((t) => t.id === active.id);
      try {
        await taskService.moveTask({
          taskId: String(active.id),
          columnId: targetColId,
          order: order === -1 ? 0 : order,
        });
      } catch {
        fetchBoard();
      }
    }
  };

  const totalTasks = columns.reduce((s, c) => s + c.tasks.length, 0);
  const isFiltered =
    columnFilter !== "ALL" ||
    filterPriority !== "ALL" ||
    searchQuery.trim() !== "" ||
    sortField !== "order";

  const resetFilters = () => {
    setColumnFilter("ALL");
    setFilterPriority("ALL");
    setSortField("order");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <div className="w-7 h-7 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Memuat board...</span>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-red-400">Board tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* SUB HEADER */}
      <div className="bg-[#0f0f18] border-b border-slate-800/60 px-4 sm:px-6 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: board.color || "#7c3aed" }}
            />
            <div className="min-w-0">
              <h1 className="font-bold text-white text-sm sm:text-base truncate">
                {board.title}
              </h1>
              {board.description && (
                <p className="text-xs text-slate-500 truncate hidden sm:block">
                  {board.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-800/70 px-2.5 py-1.5 rounded-lg">
              {totalTasks} task
            </span>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                showFilters || isFiltered
                  ? "bg-violet-600/20 text-violet-400 border-violet-500/30"
                  : "bg-slate-800/70 text-slate-400 hover:text-white border-transparent"
              }`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span className="hidden sm:inline">Filter</span>
              {isFiltered && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="hidden sm:inline">Buat Task</span>
              <span className="sm:hidden">Task</span>
            </button>
          </div>
        </div>

        {/* FILTER BAR */}
        {showFilters && (
          <div className="max-w-screen-xl mx-auto mt-3 pt-3 border-t border-slate-800/60 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-600 flex-shrink-0">
                Tampilkan:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setColumnFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer border ${
                    columnFilter === "ALL"
                      ? "bg-slate-700 text-white border-slate-500"
                      : "bg-slate-800/60 text-slate-500 hover:text-slate-300 border-transparent"
                  }`}
                >
                  Semua Kolom
                </button>
                {columns.map((col) => {
                  const isActive = columnFilter === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => setColumnFilter(isActive ? "ALL" : col.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer border ${
                        isActive
                          ? "text-white border-current"
                          : "bg-slate-800/60 text-slate-500 hover:text-slate-300 border-transparent"
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: col.color + "22",
                              borderColor: col.color + "66",
                              color: col.color,
                            }
                          : {}
                      }
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: col.color }}
                      />
                      {col.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[160px] max-w-xs">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari task..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700/50 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-violet-500/50 placeholder-slate-600"
                />
              </div>

              <div className="flex items-center gap-1">
                {(
                  ["ALL", "URGENT", "HIGH", "MEDIUM", "LOW"] as FilterPriority[]
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilterPriority(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                      filterPriority === p
                        ? PRIORITY_ACTIVE[p]
                        : "bg-slate-800/60 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {p === "ALL" ? "Semua" : p}
                  </button>
                ))}
              </div>

              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors cursor-pointer underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* KANBAN BOARD */}
      <div className="flex-1 overflow-x-auto px-4 sm:px-6 py-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full items-start min-w-max pb-6">
            {processedColumns.map((col) => (
              <ColumnDropZone
                key={col.id}
                column={col}
                onDetail={(task: Task) => {
                  setSelectedTask(task);
                  setDetailOpen(true);
                }}
              >
                <SortableContext
                  items={col.tasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {col.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDetail={() => {
                        setSelectedTask(task);
                        setDetailOpen(true);
                      }}
                    />
                  ))}
                </SortableContext>
              </ColumnDropZone>
            ))}
          </div>

          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeTask ? (
              <TaskCard task={activeTask} isDragging onDetail={() => {}} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* MODALS */}
      {detailOpen && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => {
            setDetailOpen(false);
            setSelectedTask(null);
          }}
          onUpdated={fetchBoard}
        />
      )}

      {createOpen && (
        <CreateTaskModal
          board={board}
          onClose={() => setCreateOpen(false)}
          onCreated={fetchBoard}
        />
      )}
    </div>
  );
}

const PRIORITY_ACTIVE: Record<FilterPriority, string> = {
  ALL: "bg-slate-700 text-slate-200",
  URGENT: "bg-red-500/20 text-red-400 border border-red-500/30",
  HIGH: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  MEDIUM: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  LOW: "bg-slate-600/40 text-slate-300 border border-slate-500/30",
};
