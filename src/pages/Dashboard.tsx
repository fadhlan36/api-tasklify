import { useEffect, useState } from "react";
import { boardService } from "../services/boardService";
import CreateBoardModal from "../components/CreateBoardModal";
import { useNavigate } from "react-router-dom";

const ACCENT_COLORS = [
  "#7c3aed", "#6d28d9", "#a21caf", "#be185d",
  "#0d9488", "#0284c7", "#b45309", "#15803d",
];

function getInitials(title: string) {
  return title.slice(0, 2).toUpperCase();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#7c3aed");

  const fetchBoards = async () => {
    const res = await boardService.getBoards();
    setBoards(res.data);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus board ini?")) return;
    try {
      await boardService.deleteBoard(id);
      fetchBoards();
    } catch {
      alert("Gagal menghapus board");
    }
  };

  const openEdit = (board: any) => {
    setSelectedBoard(board);
    setTitle(board.title);
    setDescription(board.description || "");
    setColor(board.color || "#7c3aed");
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await boardService.updateBoard(selectedBoard.id, { title, description, color });
      setIsEditOpen(false);
      fetchBoards();
    } catch {
      alert("Gagal update board");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">Boards</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {boards.length} board aktif
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Buat Board
          </button>
        </div>

        {/* EMPTY STATE */}
        {boards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">Belum ada board</h2>
            <p className="text-sm text-slate-500 mb-7 max-w-xs">
              Buat board pertama kamu untuk mulai mengatur tugas tim.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              Buat Board Pertama
            </button>
          </div>
        )}

        {/* BOARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => navigate(`/board/${board.id}`)}
              className="group relative bg-[#0f0f18] border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-slate-600 transition-all"
            >
              {/* TOP COLOR BAR */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: board.color || "#7c3aed" }}
              />

              <div className="p-5">
                {/* AVATAR + TITLE */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 opacity-90"
                    style={{ backgroundColor: board.color || "#7c3aed" }}
                  >
                    {getInitials(board.title)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-white text-sm truncate group-hover:text-violet-300 transition-colors">
                      {board.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {board.description || "Tidak ada deskripsi"}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div
                  className="flex gap-2 pt-4 border-t border-slate-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEdit(board)}
                    className="flex-1 text-xs font-medium text-slate-400 hover:text-white py-2 rounded-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(board.id)}
                    className="flex-1 text-xs font-medium text-slate-500 hover:text-red-400 py-2 rounded-lg border border-slate-700 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchBoards}
        />
      )}

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f18] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Edit Board</h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Judul</label>
                <input
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nama board"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Deskripsi</label>
                <textarea
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2.5 uppercase tracking-wider">Warna</label>
                <div className="flex gap-2 flex-wrap">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-7 h-7 rounded-lg transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c,
                        outline: color === c ? `2px solid ${c}` : "2px solid transparent",
                        outlineOffset: "2px",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 pt-0">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-slate-400 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}