import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { login } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#eef6ff]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#1e2a3a]/10 rounded-full blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/80 border border-slate-100">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1e2a3a] mb-4 shadow-lg"
            >
              <span className="text-[#f5bf23] font-black text-2xl">W</span>
            </motion.div>
            <h1 className="text-2xl font-black text-[#1e2a3a] mb-1">
              We<span className="text-[#f5bf23]">Build</span> Admin
            </h1>
            <p className="text-slate-400 text-sm">Sign in to manage your website</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1e2a3a]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@webuild.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#f0f4f8] border border-slate-200 text-[#1a202c] placeholder-slate-400 focus:outline-none focus:border-[#f5bf23] focus:ring-2 focus:ring-[#f5bf23]/30 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1e2a3a]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#f0f4f8] border border-slate-200 text-[#1a202c] placeholder-slate-400 focus:outline-none focus:border-[#f5bf23] focus:ring-2 focus:ring-[#f5bf23]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1e2a3a] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#eef6ff] text-[#1a202c] font-bold hover:bg-[#e6b020] hover:shadow-lg hover:shadow-yellow-300/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-base"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Signing in...</>
              ) : (
                <><LogIn className="w-5 h-5" />Sign In</>
              )}
            </button>
          </form>
          <p className="text-center text-slate-400 text-xs mt-6">WeBuild Construction · Admin Dashboard</p>
        </div>
      </motion.div>
    </div>
  );
}
