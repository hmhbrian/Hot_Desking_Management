"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  CalendarRange, 
  Search, 
  Filter, 
  MoreVertical,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/custom-select";
import { Modal } from "@/components/ui/modal";
import { bookingAdminService } from "@/services/bookingAdminService";
import { AdminBookingResponse } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    CHECKED_IN: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    COMPLETED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    CANCELLED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    NO_SHOW: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    EXPIRED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${styles[status] || styles.CONFIRMED} uppercase tracking-wider`}>
      {status.replace("_", " ")}
    </span>
  );
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Force Cancel Modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const fetchData = async (page = 0) => {
    setLoading(true);
    try {
      const params: any = {
        page: page,
        size: 10,
        sort: "startTime,desc"
      };

      if (statusFilter !== "all") params.status = statusFilter;
      if (fromDate) params.fromDate = new Date(fromDate).toISOString();
      
      // If toDate is selected, set it to the end of that day
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        params.toDate = endOfDay.toISOString();
      }

      const response = await bookingAdminService.getAll(params);
      setBookings(response.data);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, [statusFilter, fromDate, toDate]);

  const handleForceCancel = async () => {
    if (!selectedBookingId) return;
    
    try {
      await bookingAdminService.forceCancel(selectedBookingId);
      setIsCancelModalOpen(false);
      setSelectedBookingId(null);
      fetchData(currentPage);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Không thể hủy booking này. Có thể do trạng thái không hợp lệ.");
    }
  };

  const openCancelConfirm = (id: string) => {
    setSelectedBookingId(id);
    setIsCancelModalOpen(true);
  };

  // Local search filter (since API doesn't have keyword search yet)
  const filteredBookings = bookings.filter(b => 
    b.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.seatNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Quản lý Đặt chỗ</h1>
          <p className="text-slate-400 text-sm">Theo dõi và quản lý tất cả các lượt đặt chỗ trên toàn hệ thống.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-2xl border border-white/5">
          <div className="text-center px-4 border-r border-white/5">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Tổng cộng</p>
            <p className="text-xl font-black text-white">{totalElements}</p>
          </div>
          <div className="text-center px-4">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Trang hiện tại</p>
            <p className="text-xl font-black text-rose-500">{currentPage + 1} <span className="text-sm text-slate-500">/ {totalPages || 1}</span></p>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5 bg-slate-900/40 rounded-3xl border border-white/5 backdrop-blur-md shadow-xl relative z-20">
        
        {/* Search */}
        <div className="lg:col-span-4 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
          <Input 
            placeholder="Tìm theo tên NV, email, số ghế..." 
            className="pl-12 h-12 rounded-2xl bg-slate-800/30 border-white/5 focus:border-rose-500/50 transition-all text-white" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>

        {/* Date Range */}
        <div className="lg:col-span-5 flex items-center gap-2">
          <div className="h-12 flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 uppercase">Từ</div>
            <Input 
              type="date" 
              className="pl-10 h-12 rounded-2xl bg-slate-800/30 border-white/5 text-white [&::-webkit-calendar-picker-indicator]:invert"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <span className="text-slate-500 font-bold">-</span>
          <div className="h-12 flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 uppercase">Đến</div>
            <Input 
              type="date" 
              className="pl-12 h-12 rounded-2xl bg-slate-800/30 border-white/5 text-white [&::-webkit-calendar-picker-indicator]:invert"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="lg:col-span-3 flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 shrink-0">
            <Filter className="h-5 w-5" />
          </div>
          <CustomSelect 
            className="flex-1"
            value={statusFilter} 
            onChange={(val) => setStatusFilter(val)}
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "CONFIRMED", label: "Đã xác nhận" },
              { value: "CHECKED_IN", label: "Đã Check-in" },
              { value: "COMPLETED", label: "Đã hoàn thành" },
              { value: "NO_SHOW", label: "Không đến" },
              { value: "CANCELLED", label: "Đã hủy" }
            ]}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900/40 rounded-[2rem] border border-white/5 overflow-hidden backdrop-blur-md shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Người dùng</TableHead>
              <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Vị trí</TableHead>
              <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Thời gian</TableHead>
              <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Trạng thái</TableHead>
              <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-slate-500">Đang tải dữ liệu...</TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-slate-500">Không tìm thấy lượt đặt chỗ nào.</TableCell>
              </TableRow>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredBookings.map((booking) => (
                  <motion.tr 
                    key={booking.id} 
                    layout 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="border-white/5 hover:bg-white/[0.02] group transition-colors"
                  >
                    <TableCell className="py-4">
                      <div>
                        <p className="font-bold text-white text-sm">{booking.userName}</p>
                        <p className="text-[11px] text-slate-400">{booking.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-rose-400 text-base">{booking.seatNumber}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase bg-white/5 px-2 py-0.5 rounded-md inline-block w-fit">
                          {booking.locationName} - {booking.zoneName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-slate-300">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="font-medium">
                          {format(parseISO(booking.startTime), "dd/MM/yyyy")}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {format(parseISO(booking.startTime), "HH:mm")} - {format(parseISO(booking.endTime), "HH:mm")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      {(booking.status === "CONFIRMED" || booking.status === "NO_SHOW") && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openCancelConfirm(booking.id)} 
                          className="h-8 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 font-bold text-xs px-3 transition-colors"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Hủy
                        </Button>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between bg-slate-900/50">
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === 0}
              onClick={() => fetchData(currentPage - 1)}
              className="bg-transparent border-white/10 text-slate-300 hover:bg-white/10"
            >
              Trang trước
            </Button>
            <span className="text-xs font-bold text-slate-500">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => fetchData(currentPage + 1)}
              className="bg-transparent border-white/10 text-slate-300 hover:bg-white/10"
            >
              Trang sau
            </Button>
          </div>
        )}
      </div>

      {/* Force Cancel Modal */}
      <Modal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        title="Xác nhận hủy đặt chỗ"
      >
        <div className="space-y-4">
          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
            <p className="text-sm text-orange-200">
              Bạn đang thực hiện thao tác <strong className="text-orange-400">Hủy bắt buộc (Force Cancel)</strong>. Lượt đặt chỗ này sẽ bị hủy ngay lập tức và người dùng sẽ mất chỗ ngồi. Hành động này không thể hoàn tác.
            </p>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsCancelModalOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Đóng
            </Button>
            <Button 
              type="button" 
              onClick={handleForceCancel}
              className="bg-rose-500 hover:bg-rose-600 px-6 font-bold shadow-lg shadow-rose-500/20"
            >
              Xác nhận Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
