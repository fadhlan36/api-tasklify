import { useState } from "react";
import { register } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(name, email, password);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* LEFT — branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-[#0f0f18] border-r border-slate-800 p-12">
        <Link to="/" className="text-lg font-bold text-white tracking-tight">
          Tasklify
        </Link>
        <div>
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <p className="text-2xl font-bold text-white leading-snug mb-3">
            Bergabung sekarang,<br />gratis selamanya.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            Tidak perlu kartu kredit. Mulai menggunakan semua fitur Tasklify tanpa batas waktu.
          </p>
        </div>
        <p className="text-slate-700 text-xs">© 2025 Tasklify</p>
      </div>

      {/* RIGHT — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="text-xl font-bold text-white">Tasklify</Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1.5">Buat akun baru</h1>
            <p className="text-slate-500 text-sm">Gratis, cepat, tanpa ribet.</p>
          </div>

          {error && (
            <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                required
                minLength={8}
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Buat Akun"}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
