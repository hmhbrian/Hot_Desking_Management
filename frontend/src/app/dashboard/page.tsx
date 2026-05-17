"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard/booking");
    }
  }, [user, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-slate-950">
      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
    </div>
  );
}
