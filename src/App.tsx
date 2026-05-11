import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import BoardDetail from "./pages/BoardDetail";

export default function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/login", "/register"];
  const showNavbarRoutes = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbarRoutes && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        />

        <Route path="/board/:id" element={
          <ProtectedRoute>
            <BoardDetail />
          </ProtectedRoute>
        }
        />
      </Routes>
    </>
  );
}
