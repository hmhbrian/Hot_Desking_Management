"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Monitor, 
  CalendarCheck, 
  TrendingUp, 
  ArrowUpRight 
} from "lucide-react";

const stats = [
  { title: "Tổng người dùng", value: "1,284", icon: Users, change: "+12%", color: "text-blue-400", bg: "bg-blue-500/10" },
  { title: "Số chỗ hiện có", value: "450", icon: Monitor, change: "85% occupancy", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { title: "Lượt đặt hôm nay", value: "156", icon: CalendarCheck, change: "+24%", color: "text-rose-400", bg: "bg-rose-500/10" },
  { title: "Doanh thu/Hiệu suất", value: "92%", icon: TrendingUp, change: "+3.2%", color: "text-amber-400", bg: "bg-amber-500/10" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Tổng quan hệ thống</h1>
        <p className="text-slate-400">Chào mừng trở lại, Admin. Dưới đây là tình hình hoạt động của văn phòng hôm nay.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-sm hover:border-rose-500/30 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3" />
                {stat.change}
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900/50 border border-white/5 h-96 flex items-center justify-center text-slate-500">
          <p>Biểu đồ hoạt động hệ thống (Chart Placeholder)</p>
        </div>
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 h-96 flex items-center justify-center text-slate-500">
          <p>Thông báo/Cảnh báo mới (List Placeholder)</p>
        </div>
      </div>
    </div>
  );
}
