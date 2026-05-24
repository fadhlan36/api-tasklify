// frontend/src/components/TaskDetailModal.tsx
import { useState } from "react";
import { taskService } from "../services/taskService";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

const PRIORITY_OPTIONS: {
  value: Priority;
  label: string;
  idle: string;
  active: string;
  dot: string;
}[] = [
  {
    value: "LOW",
    label: "Low",
    idle: "text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-300",
    active: "bg-slate-700/60 text-slate-200 border-slate-500",
    dot: "bg-slate-400",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    idle: "text-slate-500 border-slate-700/50 hover:border-blue-500/40 hover:text-blue-400",
    active: "bg-blue-500/15 text-blue-300 border-blue-500/50",
    dot: "bg-blue-400",
  },
  {
    value: "HIGH",
    label: "High",
    idle: "text-slate-500 border-slate-700/50 hover:border-amber-500/40 hover:text-amber-400",
    active: "bg-amber-500/15 text-amber-300 border-amber-500/50",
    dot: "bg-amber-400",
  },
  {
    value: "URGENT",
    label: "Urgent",
    idle: "text-slate-500 border-slate-700/50 hover:border-red-500/40 hover:text-red-400",
    active: "bg-red-500/15 text-red-300 border-red-500/50",
    dot: "bg-red-400",
  },
];

export default function TaskDetailModal({ task, onClose, onUpdated }: any) {
  // Semua state diinisialisasi dari task prop
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState<string>(task?.title ?? "");
  const [description, setDescription] = useState<string>(
    task?.description ?? "",
  );
  // currentPriority: state lokal untuk optimistic update
  const [currentPriority, setCurrentPriority] = useState<Priority>(
    task?.priority ?? "MEDIUM",
  );
  const [editPriority, setEditPriority] = useState<Priority>(
    task?.priority ?? "MEDIUM",
  );
  const [loading, setLoading] = useState(false);
  const [priorityLoading, setPriorityLoading] = useState(false);

  // Guard: task harus ada dan punya id
  if (!task || !task.id) {
    console.error("[TaskDetailModal] task tidak valid:", task);
    return null;
  }

  const taskId: string = task.id;

  // ── Update judul + deskripsi + priority (dari edit mode) ──────────────────
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await taskService.updateTask(taskId, {
        title,
        description,
        priority: editPriority,
      });
      setCurrentPriority(editPriority);
      setIsEdit(false);
      onUpdated?.();
      onClose();
    } catch (err) {
      console.error("[TaskDetailModal] update error:", err);
      alert("Gagal menyimpan perubahan.");
    } finally {
      setLoading(false);
    }
  };

  // ── Ubah priority langsung dari view mode (tanpa buka edit) ───────────────
  const handlePriorityChange = async (newPriority: Priority) => {
    if (newPriority === currentPriority || priorityLoading) return;

    const prev = currentPriority;
    setCurrentPriority(newPriority); // optimistic
    setPriorityLoading(true);

    try {
      await taskService.updateTask(taskId, { priority: newPriority });
      onUpdated?.();
    } catch (err) {
      console.error("[TaskDetailModal] priority change error:", err);
      setCurrentPriority(prev); // rollback
      alert("Gagal mengubah prioritas.");
    } finally {
      setPriorityLoading(false);
    }
  };

  // ── Hapus ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus task ini?")) return;
    try {
      await taskService.deleteTask(taskId);
      onUpdated?.();
      onClose();
    } catch (err) {
      console.error("[TaskDetailModal] delete error:", err);
      alert("Gagal menghapus task.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0f0f18] border border-slate-700/60 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            <h2 className="text-base font-bold text-white">
              {isEdit ? "Edit Task" : "Detail Task"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          {isEdit ? (
            <>
              {/* Judul */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                  Judul
                </label>
                <input
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                  Deskripsi
                </label>
                <textarea
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tambahkan deskripsi..."
                />
              </div>

              {/* Priority (edit mode) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                  Prioritas
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setEditPriority(opt.value)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        editPriority === opt.value ? opt.active : opt.idle
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${opt.dot}`}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Judul */}
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Judul
                </p>
                <p className="text-base font-semibold text-white">
                  {task.title}
                </p>
              </div>

              {/* Deskripsi */}
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Deskripsi
                </p>
                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {task.description || (
                    <span className="text-slate-600 italic">
                      Tidak ada deskripsi
                    </span>
                  )}
                </p>
              </div>

              {/* Priority — inline changer */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Prioritas
                  </p>
                  {priorityLoading && (
                    <span className="text-[10px] text-slate-600 animate-pulse">
                      Menyimpan...
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handlePriorityChange(opt.value)}
                      disabled={priorityLoading}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 ${
                        currentPriority === opt.value ? opt.active : opt.idle
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${opt.dot}`}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-700 mt-1.5">
                  Klik untuk ubah prioritas langsung
                </p>
              </div>

              {/* Meta */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-700 font-mono truncate">
                  ID: {taskId}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-slate-600 flex items-center gap-1 flex-shrink-0">
                    <svg
                      width="11"
                      height="11"
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
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 pt-0">
          {isEdit ? (
            <>
              <button
                onClick={() => {
                  setIsEdit(false);
                  setTitle(task.title);
                  setDescription(task.description ?? "");
                  setEditPriority(currentPriority);
                }}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                ← Kembali
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-slate-400 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleDelete}
                className="text-sm font-medium text-slate-600 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
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
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Hapus
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-slate-400 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setEditPriority(currentPriority);
                    setIsEdit(true);
                  }}
                  className="px-5 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors cursor-pointer"
                >
                  Edit Task
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
