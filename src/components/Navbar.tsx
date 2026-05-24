import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isDashboard =
    location.pathname === "/dashboard" || location.pathname.startsWith("/board");

  return (
    <nav className="w-full h-14 bg-[#0f0f18] border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* LOGO */}
      <button
        onClick={() => navigate("/dashboard")}
        className="text-base font-bold text-white hover:text-violet-300 transition-colors tracking-tight"
      >
        Tasklify
      </button>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate("/dashboard")}
          className={`text-sm px-4 py-2 rounded-lg transition-colors font-medium ${
            isDashboard
              ? "text-violet-400 bg-violet-500/10"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          Boards
        </button>

        <button
          onClick={handleLogout}
          className="text-sm text-slate-500 hover:text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors font-medium ml-1"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}