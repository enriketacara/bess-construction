import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { apiJson } from "../lib/api";
import { motion } from "motion/react";
import {
  TrendingUp,
  FolderKanban,
  Briefcase,
  Images,
  ArrowUpRight,
  Activity,
  Sparkles,
} from "lucide-react";

type Overview = {
  stats: {
    totalProjects: string;
    activeServices: string;
    sliderItems: string;
    totalViews: string;
  };
  recentActivity: Array<{ action: string; item: string; time: string }>;
};

type StatCard = {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string; // tailwind gradient like "from-sky-400 to-blue-300"
};

export default function Dashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);

  useEffect(() => {
    apiJson<Overview>("/dashboard/overview")
        .then(setOverview)
        .catch((e) => console.error(e));
  }, []);

  const stats: StatCard[] = useMemo(
      () => [
        {
          label: "Total Projects",
          value: overview?.stats.totalProjects ?? "—",
          change: "",
          icon: FolderKanban,
          color: "from-sky-400 to-blue-300",
        },
        {
          label: "Active Services",
          value: overview?.stats.activeServices ?? "—",
          change: "",
          icon: Briefcase,
          color: "from-amber-400 to-yellow-300",
        },
        {
          label: "Slider Items",
          value: overview?.stats.sliderItems ?? "—",
          change: "",
          icon: Images,
          color: "from-orange-500 to-rose-500",
        },
        {
          label: "Total Views",
          value: overview?.stats.totalViews ?? "—",
          change: "",
          icon: Sparkles,
          color: "from-emerald-500 to-teal-500",
        },
      ],
      [overview]
  );

  const recentActivity = overview?.recentActivity ?? [];

  return (
      <Layout>
        <div className="p-4 md:p-8 space-y-8">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e2a3a] mb-2">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Welcome back! Here&apos;s what&apos;s happening with your content.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                  <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6 group hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {stat.change ? (
                          <span className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                      <TrendingUp className="w-4 h-4" />
                            {stat.change}
                    </span>
                      ) : null}
                    </div>

                    <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </p>

                    {/* Gradient overlay on hover */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                    />
                  </motion.div>
              );
            })}
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="lg:col-span-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#b07d10]" />
                Recent Activity
              </h2>

              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      No activity yet
                    </div>
                ) : (
                    recentActivity.map((activity, index) => (
                        <motion.div
                            key={`${activity.action}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#eef6ff]" />
                          <div className="flex-1">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {activity.item}
                            </p>
                          </div>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                      {activity.time}
                    </span>
                        </motion.div>
                    ))
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-2xl bg-[#1e2a3a] p-6 text-white"
            >
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { label: "Add Project", path: "/projects" },
                  { label: "Add Service", path: "/services" },
                  { label: "Add Slider", path: "/sliders" },
                  { label: "Edit About", path: "/about" },
                ].map((action, index) => (
                    <motion.a
                        key={action.label}
                        href={action.path}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors group"
                    >
                      <span className="font-medium">{action.label}</span>
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
  );
}