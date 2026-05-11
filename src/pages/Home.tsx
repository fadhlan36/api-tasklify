import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-white">
      {/* MINIMAL TOP BAR */}
      <div className="flex items-center justify-between px-8 py-6">
        <span className="text-lg font-bold tracking-tight text-white">Tasklify</span>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Mulai Gratis
          </Link>
        </div>
      </div>

      {/* HERO */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16">
        <div className="inline-flex items-center gap-2 border border-slate-700 text-slate-400 text-xs px-4 py-1.5 rounded-full mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block"></span>
          Manajemen tugas untuk tim modern
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 max-w-3xl">
          Kelola tugas
          <br />
          <span className="text-violet-400">lebih cerdas.</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-md mb-12 leading-relaxed">
          Tasklify membantu tim kamu tetap fokus, terorganisir, dan produktif — semuanya dalam satu papan kerja.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-24">
          <Link
            to="/register"
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors w-full sm:w-auto text-center"
          >
            Mulai Sekarang — Gratis
          </Link>
          <Link
            to="/login"
            className="text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-8 py-3.5 rounded-xl transition-colors w-full sm:w-auto text-center"
          >
            Sudah punya akun
          </Link>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
          {[
            {
              title: "Board Fleksibel",
              desc: "Buat board untuk setiap proyek. Atur kolom sesuai alur kerja tim kamu.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              ),
            },
            {
              title: "Drag & Drop",
              desc: "Pindahkan task antar kolom dengan gesture yang intuitif dan natural.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/>
                  <polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/>
                  <line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>
                </svg>
              ),
            },
            {
              title: "Realtime Sync",
              desc: "Semua perubahan langsung terlihat oleh seluruh anggota tim secara instan.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              ),
            },
          ].map((f) => (
            <div
              key={f.title}
              className="text-left p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-600 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-600">
        © 2025 Tasklify
      </footer>
    </div>
  );
}