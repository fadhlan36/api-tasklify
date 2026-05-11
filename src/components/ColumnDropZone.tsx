// frontend/src/components/ColumnDropZone.tsx
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

const COL_META: Record<string, { dot: string; badge: string; glow: string }> = {
  "to do": {
    dot: "bg-slate-500",
    badge: "bg-slate-800 text-slate-400",
    glow: "border-slate-700/40",
  },
  doing: {
    dot: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-500",
    glow: "border-amber-500/20",
  },
  done: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-500",
    glow: "border-emerald-500/20",
  },
};

export default function ColumnDropZone({ column, onDetail }: any) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const key = column.title.toLowerCase();
  const meta = COL_META[key] || {
    dot: "bg-violet-500",
    badge: "bg-violet-500/10 text-violet-400",
    glow: "border-violet-500/20",
  };

  const taskIds = column.tasks?.map((t: any) => t.id) || [];

  return (
    <div className="flex-shrink-0 w-72 sm:w-80 flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
        <h2 className="text-sm font-semibold text-slate-300 flex-1">
          {column.title}
        </h2>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
          {column.tasks?.length || 0}
        </span>
      </div>

      {/* DROP ZONE */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[240px] rounded-2xl p-3 flex flex-col gap-2 transition-all duration-150 border-2 ${
          isOver
            ? "bg-violet-500/10 border-dashed border-violet-500/50 shadow-[0_0_16px_rgba(124,58,237,0.08)]"
            : `bg-[#0f0f18] border-transparent ${meta.glow}`
        }`}
      >
        {/* Empty state */}
        {taskIds.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 py-8">
            <div className="w-8 h-8 border border-dashed border-slate-700 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <p className="text-xs text-slate-700">
              {isOver ? "Lepaskan di sini" : "Belum ada task"}
            </p>
          </div>
        )}

        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {column.tasks?.map((task: any) => (
            <TaskCard
              key={task.id}
              task={task}
              onDetail={() => onDetail(task)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}