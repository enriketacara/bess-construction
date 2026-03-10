import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Images,
  Info,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import AnimatedBackground from "./AnimatedBackground";
import { logout } from "../lib/api";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/",         label: "Dashboard", icon: LayoutDashboard },
  { path: "/projects", label: "Projects",  icon: FolderKanban    },
  { path: "/services", label: "Services",  icon: Briefcase       },
  { path: "/sliders",  label: "Sliders",   icon: Images          },
  { path: "/about",    label: "About Us",  icon: Info            },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Default to light mode on first load
  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      setTheme("light");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    navigate("/login");
    toast.success("Logged out");
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] dark:bg-[#0f1923]">
      <AnimatedBackground />

      {/* Subtle page tint */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-500/3 via-transparent to-yellow-400/3 pointer-events-none" />

      {/* ── Sidebar Desktop ──────────────────────────────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50 z-40 shadow-2xl">

        {/* Logo */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f5bf23] flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <span className="text-[#1a202c] font-black text-lg">W</span>
            </div>
            <div>
              <h1 className="font-black text-lg text-[#1e2a3a] tracking-tight">
                We<span className="text-[#f5bf23]">Build</span>
              </h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                  isActive
                    ? "text-[#1a202c]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-[#f5bf23] rounded-xl shadow-lg shadow-yellow-500/25"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10 flex-shrink-0" />
                <span className="font-semibold relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 space-y-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <><Sun className="w-5 h-5 text-[#f5bf23]" /><span className="font-medium">Light Mode</span></>
            ) : (
              <><Moon className="w-5 h-5 text-[#f5bf23]" /><span className="font-medium">Dark Mode</span></>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ────────────────────────────────────────────────── */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 z-50 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f5bf23] flex items-center justify-center">
            <span className="text-[#1a202c] font-black text-sm">W</span>
          </div>
          <h1 className="font-black text-[#1e2a3a]">
            We<span className="text-[#f5bf23]">Build</span>
          </h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* ── Mobile Menu ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 22 }}
              className="md:hidden fixed inset-y-0 right-0 w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700/50 z-40 pt-20 flex flex-col shadow-2xl"
            >
              <nav className="p-4 space-y-1 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-[#f5bf23] text-[#1a202c] font-bold shadow-lg shadow-yellow-500/25"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 space-y-2">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {theme === "dark" ? (
                    <><Sun className="w-5 h-5 text-[#f5bf23]" /><span>Light Mode</span></>
                  ) : (
                    <><Moon className="w-5 h-5 text-[#f5bf23]" /><span>Dark Mode</span></>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 hover:text-red-500 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="md:ml-64 min-h-screen relative z-10 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
