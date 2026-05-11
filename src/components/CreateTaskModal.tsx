import { useState } from "react";
import { taskService } from "../services/taskService";

export default function CreateTaskModal({ board, onClose, onCreated }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState(
    board.columns.find((c: any) => c.title.toLowerCase() === "to do")?.id ||
      board.columns[0]?.id
  );
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return alert("Judul task wajib diisi.");
    setLoading(true);
    try {
      await taskService.createTask({ title, description, columnId: selectedColumnId, order: 0 });
      onCreated();
      onClose();
    } catch {
      alert("Gagal membuat task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f0f18] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Buat Task Baru</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Judul Task <span className="text-violet-500">*</span>
            </label>
            <input
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              placeholder="Apa yang perlu dikerjakan?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Deskripsi <span className="text-slate-600 font-normal normal-case">(opsional)</span>
            </label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
              rows={3}
              placeholder="Tambahkan detail lebih lanjut..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Kolom
            </label>
            <select
              value={selectedColumnId}
              onChange={(e) => setSelectedColumnId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            >
              {board.columns.map((col: any) => (
                <option key={col.id} value={col.id} className="bg-slate-900">
                  {col.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-400 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Membuat..." : "Buat Task"}
          </button>
        </div>
      </div>
    </div>
  );
}