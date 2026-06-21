import { redirect } from "next/navigation";

/**
 * Trang /my-bookings — placeholder, sẽ được phát triển ở bước tiếp theo.
 * Đây là "Home" của Employee sau khi đăng nhập.
 */
export default function MyBookingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Đặt chỗ của tôi</h1>
        <p className="text-sm text-slate-400 mt-1">
          Xem lịch sử và quản lý các booking hiện tại của bạn.
        </p>
      </div>

      {/* Placeholder content */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 text-center">
        <p className="text-slate-500 text-sm">
          🚧 Trang đang được phát triển — Coming soon!
        </p>
      </div>
    </div>
  );
}
