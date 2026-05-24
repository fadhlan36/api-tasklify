// frontend/src/components/TaskCard.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  order: number;
  dueDate?: string;
  columnId: string;
}

interface Props {
  task: Task;
  onDetail: () => void;
  isDragging?: boolean;
}

const PRIORITY_CONFIG: Record<
  string,
  { label: string; class: string; dot: string }
> = {
  URGENT: {
    label: "URGENT",
    class: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
  HIGH: {
    label: "HIGH",
    class: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  MEDIUM: {
    label: "MEDIUM",
    class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400",
  },
  LOW: {
    label: "LOW",
    class: "bg-slate-700/40 text-slate-400 border-slate-600/30",
    dot: "bg-slate-500",
  },
};

export default function TaskCard({ task, onDetail, isDragging }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;

  // Overlay card saat sedang di-drag
  if (isDragging) {
    return (
      <div className="bg-slate-800 border border-violet-500/50 rounded-xl p-3 shadow-2xl rotate-1 scale-[1.02] opacity-95 pointer-events-none ring-1 ring-violet-500/20">
        <p className="text-[13px] font-medium text-white line-clamp-2">
          {task.title}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${priority.class}`}
          >
            <span className={`w-1 h-1 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-[#13131f] hover:bg-[#16162a] border rounded-xl p-3 transition-all duration-150 ${
        isSortableDragging
          ? "opacity-0 pointer-events-none"
          : "border-slate-800/60 hover:border-slate-700/60 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 flex-shrink-0 text-slate-700 hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none transition-colors"
          aria-label="Drag"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="3.5" cy="3" r="1.2" />
            <circle cx="8.5" cy="3" r="1.2" />
            <circle cx="3.5" cy="7.5" r="1.2" />
            <circle cx="8.5" cy="7.5" r="1.2" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-slate-200 line-clamp-2 leading-snug">
            {task.title}
          </p>

          {task.description && (
            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${priority.class}`}
            >
              <span className={`w-1 h-1 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>

            {task.dueDate && (
              <span className="text-[10px] text-slate-600 flex items-center gap-1">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {new Date(task.dueDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Detail button */}
        <button
          onClick={onDetail}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-600 hover:text-violet-400 hover:bg-violet-500/10 transition-all cursor-pointer"
          title="Lihat detail"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
