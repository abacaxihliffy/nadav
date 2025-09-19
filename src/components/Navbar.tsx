// src/components/Navbar.tsx
import { Link, NavLink } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { loadTracks } from "../utils/loadCurriculum";
import { Menu, X } from "lucide-react";
import { useMountLog, useRenderLog } from "../debugMount";

declare global {
  interface Window {
    __dc_navbar_mounted?: boolean;
  }
}

const base =
  "px-3 py-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60";
const cls = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? `${base} bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 font-semibold`
    : `${base} text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900
        dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white`;

export default function Navbar() {
  // logs de diagnóstico (safe)
  useMountLog("Navbar");
  useRenderLog("Navbar");

  const [open, setOpen] = useState(false);
  const [allowed, setAllowed] = useState(false);

  // Guard de singleton — sem cleanup para não “liberar a vaga” em HMR
  useEffect(() => {
    if (window.__dc_navbar_mounted) return;
    window.__dc_navbar_mounted = true;
    setAllowed(true);
  }, []);

  // Calcule SEMPRE os hooks antes de decidir renderizar ou não
  const firstTrackId = useMemo(() => {
    const tracks = loadTracks();
    return tracks[0]?.id ?? "responsive-web-design";
  }, []);
  const startHref = firstTrackId ? `/learn/${firstTrackId}` : "/curriculum";

  // Só aqui decida não renderizar (ordem de hooks preservada)
  if (!allowed) return null;

  return (
    <header
      id="app-navbar"
      className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/80"
    >
      <div className="container-lg h-16 flex items-center justify-between">
        {/* logo + marca */}
        <Link
          to="/"
          className="flex items-center gap-3 font-bold text-lg text-zinc-800 dark:text-white"
          aria-label="DevCodeHub - Home"
        >
          <img
            src="/devcodehub.svg"
            alt="DevCodeHub"
            className="w-8 h-8 rounded-lg"
          />
          DevCodeHub
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/curriculum" className={cls}>
            Curriculum
          </NavLink>
          <NavLink to="/forum" className={cls}>
            Forum
          </NavLink>
          <NavLink to="/news" className={cls}>
            News
          </NavLink>
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:block">
          <Link
            to={startHref}
            className="btn-primary bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Start Learning
          </Link>
        </div>

        {/* botão mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* menu mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <nav className="flex flex-col px-4 py-3 space-y-2">
            <NavLink to="/curriculum" className={cls} onClick={() => setOpen(false)}>
              Curriculum
            </NavLink>
            <NavLink to="/forum" className={cls} onClick={() => setOpen(false)}>
              Forum
            </NavLink>
            <NavLink to="/news" className={cls} onClick={() => setOpen(false)}>
              News
            </NavLink>
            <Link
              to={startHref}
              onClick={() => setOpen(false)}
              className="btn-primary text-center bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
            >
              Start Learning
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
