"use client";

import { useAuthStore } from "@/store/authStore";
import { Sparkles, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function BookingPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Hệ thống đặt chỗ</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Chào buổi sáng, {user?.fullName || "Bạn"}! 👋
        </h1>
        <p className="text-slate-400">
          Hôm nay bạn muốn làm việc ở đâu? Hãy chọn vị trí phù hợp nhất cho công việc của mình.
        </p>
      </header>

      {/* Placeholder for real booking UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Trạng thái hiện tại", value: "Chưa đặt chỗ", icon: Calendar, color: "text-amber-400" },
          { title: "Vị trí gần nhất", value: "Tầng 4 - Zone A", icon: MapPin, color: "text-blue-400" },
          { title: "Điểm chuyên cần", value: "150 pts", icon: CheckCircle2, color: "text-emerald-400" },
        ].map((item, idx) => (
          <motion.div 
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-slate-800 ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{item.title}</p>
            <p className="text-xl font-bold text-white">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950 p-12 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Sơ đồ văn phòng đang được tải...</h2>
          <p className="text-slate-500 mb-8">
            Chúng tôi đang cập nhật trạng thái các chỗ ngồi theo thời gian thực. 
            Bạn sẽ sớm có thể chọn chỗ trực tiếp trên bản đồ 2D/3D.
          </p>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              style={{ width: "30%" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
