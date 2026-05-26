// src/App.jsx
import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import { Lock } from "lucide-react";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Cek sesi login di memori browser
  useEffect(() => {
    const session = localStorage.getItem("shaka_admin_session");
    if (session === "active") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // KREDENSIAL LOGIN ADMIN
    if (username === "adminshaka" && password === "shaka2026") {
      setIsAuthenticated(true);
      localStorage.setItem("shaka_admin_session", "active");
      setLoginError("");
    } else {
      setLoginError("Kombinasi sandi salah, akses ditolak bro!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("shaka_admin_session");
    window.location.href = "/";
  };

  // --- ROUTER & SECURITY GATE ---
  if (currentPath === "/admin") {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-white">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-900/30">
              <Lock size={28} />
            </div>
            <h2 className="text-2xl font-black text-center uppercase tracking-tight mb-2">Gate Security Access</h2>
            <p className="text-center text-slate-500 text-xs mb-8 uppercase tracking-widest font-bold">Shaka Production Suite</p>
            
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <input required type="text" placeholder="Admin Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-red-500 text-white" />
              <input required type="password" placeholder="Security Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-red-500 text-white" />
              {loginError && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2.5 rounded-xl">{loginError}</p>}
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold text-sm mt-2 transition-colors shadow-lg shadow-red-900/20">VERIFIKASI AKSES</button>
            </form>
          </div>
        </div>
      );
    }
    // Jika lolos login, render Dashboard Admin
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Jika bukan /admin, render Landing Page Utama
  return <LandingPage />;
}