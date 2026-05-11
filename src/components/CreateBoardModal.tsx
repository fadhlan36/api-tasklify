import { useState } from "react";
import { boardService } from "@/services/boardService";

const COLORS = [
  "#7c3aed", "#6d28d9", "#a21caf", "#be185d",
  "#0d9488", "#0284c7", "#b45309", "#15803d",
];

export default function CreateBoardModal({ onClose, onSuccess }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#7c3aed");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return alert("Judul board wajib diisi.");
    setLoading(true);
    try {
      await boardService.createBoard({ title, description, color });
      onSuccess();
      onClose();
    } catch {
      alert("Gagal membuat board.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f0f18] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Buat Board Baru</h2>
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
              Judul <span className="text-violet-500">*</span>
            </label>
            <input
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              placeholder="Contoh: Sprint Q2, Marketing Plan..."
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
              placeholder="Jelaskan tujuan board ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2.5 uppercase tracking-wider">
              Warna Label
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-lg transition-all hover:scale-110 active:scale-95"
                  style={{
                    backgroundColor: c,
                    outline: color === c ? `2px solid ${c}` : "2px solid transparent",
                    outlineOffset: "2px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* PREVIEW */}
          <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-900/40">
            <div className="h-1 w-full" style={{ backgroundColor: color }} />
            <div className="p-3 flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold opacity-90"
                style={{ backgroundColor: color }}
              >
                {title ? title.slice(0, 2).toUpperCase() : "BD"}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title || "Nama Board"}</p>
                <p className="text-xs text-slate-500">{description || "Deskripsi board"}</p>
              </div>
            </div>
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
            {loading ? "Membuat..." : "Buat Board"}
          </button>
        </div>
      </div>
    </div>
  );
}