import { useState } from "react";
import { login } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Email atau password salah.");
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
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <p className="text-2xl font-bold text-white leading-snug mb-3">
            Atur tugas,<br />capai tujuan.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed">
            Ribuan tim sudah menggunakan Tasklify untuk bekerja lebih terstruktur dan efisien.
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
            <h1 className="text-2xl font-bold text-white mb-1.5">Selamat datang</h1>
            <p className="text-slate-500 text-sm">Masuk untuk melanjutkan ke workspace kamu.</p>
          </div>

          {error && (
            <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                required
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Daftar gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}