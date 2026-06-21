"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { Search, MapPin, Monitor, Coffee, Armchair, ShieldCheck, Loader2 } from "lucide-react";

import { bookingEmployeeService } from "@/services/bookingEmployeeService";
import { locationService, zoneService } from "@/services/resourceService";
import { SearchSeatRequest, SeatStatus } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/custom-select";
import { Sheet } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export default function BookSeatPage() {
  const router = useRouter();
  
  // -- State Form --
  const today = format(new Date(), "yyyy-MM-dd");
  const maxDate = format(addDays(new Date(), 7), "yyyy-MM-dd");
  
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [locationId, setLocationId] = useState<string>("all");
  const [zoneId, setZoneId] = useState<string>("all");
  
  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // -- Queries --
  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: locationService.getAll,
  });

  const { data: zones } = useQuery({
    queryKey: ["zones", locationId],
    queryFn: () =>
      zoneService.getAll(locationId !== "all" ? { locationId: Number(locationId) } : undefined),
    enabled: true,
  });

  // Gộp date + time -> ISO LocalDateTime (Backend expected format: YYYY-MM-DDTHH:mm:ss)
  const formatDateTime = (d: string, t: string) => `${d}T${t}:00`;

  const searchParams: SearchSeatRequest = {
    locationId: locationId !== "all" ? Number(locationId) : undefined,
    zoneId: zoneId !== "all" ? Number(zoneId) : undefined,
    startTime: formatDateTime(date, startTime),
    endTime: formatDateTime(date, endTime),
  };

  const { data: seats, isLoading: isSearching, refetch } = useQuery({
    queryKey: ["searchSeats", searchParams],
    queryFn: () => bookingEmployeeService.searchSeats(searchParams),
    enabled: !!date && !!startTime && !!endTime,
  });

  // -- Mutations --
  const holdMutation = useMutation({
    mutationFn: bookingEmployeeService.holdSeat,
    onSuccess: () => {
      // Giữ chỗ thành công -> mở Sheet
      setIsSheetOpen(true);
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });

  const releaseHoldMutation = useMutation({
    mutationFn: bookingEmployeeService.releaseHold,
    onError: (error: any) => {
      console.error("Lỗi khi giải phóng ghế:", error);
    },
  });

  const confirmMutation = useMutation({
    mutationFn: () => 
      bookingEmployeeService.confirmBooking({
        seatId: selectedSeat.id,
        startTime: formatDateTime(date, startTime),
        endTime: formatDateTime(date, endTime),
      }),
    onSuccess: () => {
      setIsConfirmed(true);
      toast.success("🎉 Đặt chỗ thành công!");
      setIsSheetOpen(false);
      router.push("/my-bookings");
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });

  const handleApiError = (error: any) => {
    const code = error?.response?.data?.status;
    switch (code) {
      case 4002:
        toast.error("Ghế này vừa có người đặt! Vui lòng chọn ghế khác.");
        break;
      case 4003:
        toast.error("Ghế đang được xử lý bởi người khác (Giữ chỗ).");
        break;
      case 4004:
        toast.error("Vi phạm hạn mức: Bạn chỉ được đặt tối đa 1 chỗ trong khung giờ này.");
        break;
      case 4005:
        toast.error("Chỉ được đặt trước tối đa 7 ngày.");
        break;
      default:
        toast.error(error?.response?.data?.message || "Đã xảy ra lỗi khi đặt chỗ.");
    }
    // Refetch danh sách ghế để cập nhật trạng thái mới nhất
    refetch();
  };

  const handleSeatClick = (seat: any) => {
    setSelectedSeat(seat);
    setIsConfirmed(false);
    // Vừa click vào ghế là gọi giữ chỗ luôn trên Backend
    holdMutation.mutate(seat.id);
  };

  const handleConfirm = () => {
    if (!selectedSeat) return;
    confirmMutation.mutate();
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    // Nếu đóng Modal mà chưa confirm thì gọi API giải phóng ghế
    if (!open && !isConfirmed && selectedSeat) {
      releaseHoldMutation.mutate(selectedSeat.id);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Đặt chỗ mới</h1>
        <p className="text-sm text-slate-400 mt-1">
          Tìm kiếm và đặt chỗ ngồi phù hợp cho ngày làm việc của bạn.
        </p>
      </div>

      {/* Form Tìm Kiếm */}
      <div className="relative z-20 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-slate-400">Ngày</Label>
            <Input 
              type="date" 
              value={date} 
              min={today} 
              max={maxDate} 
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-900 border-white/10 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-slate-400">Từ</Label>
              <Input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-slate-900 border-white/10 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-400">Đến</Label>
              <Input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-slate-900 border-white/10 text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <CustomSelect
              label="Văn phòng"
              value={locationId}
              onChange={(val) => { setLocationId(val); setZoneId("all"); }}
              options={[
                { value: "all", label: "Tất cả văn phòng" },
                ...(locations?.map((loc) => ({ value: loc.id.toString(), label: loc.name })) || []),
              ]}
              placeholder="Chọn văn phòng..."
            />
          </div>
          <div className="space-y-1.5">
            <CustomSelect
              label="Khu vực"
              value={zoneId}
              onChange={setZoneId}
              options={[
                { value: "all", label: "Tất cả khu vực" },
                ...(zones?.map((z) => ({ value: z.id.toString(), label: z.name })) || []),
              ]}
              placeholder="Chọn khu vực..."
            />
          </div>
        </div>
      </div>

      {/* Danh sách Ghế */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Ghế trống khả dụng</h2>
          {isSearching && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
        </div>

        {!seats ? (
          <div className="py-10 text-center">
             <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
             <p className="text-slate-400">Đang tìm kiếm ghế...</p>
          </div>
        ) : seats.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl bg-slate-900/30">
            <Search className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-50" />
            <p className="text-slate-400">Không tìm thấy ghế nào phù hợp.</p>
            <p className="text-xs text-slate-500 mt-1">Hãy thử thay đổi thời gian hoặc khu vực.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {seats.map((seat) => (
              <div 
                key={seat.id} 
                onClick={() => handleSeatClick(seat)}
                className="group relative bg-slate-900 border border-white/5 hover:border-indigo-500/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Sẵn sàng
                  </Badge>
                  <Armchair className="w-5 h-5 text-indigo-400" />
                </div>
                
                <h3 className="text-xl font-bold text-white relative z-10">{seat.seatNumber}</h3>
                <p className="text-xs text-slate-400 mt-1 truncate relative z-10">
                  {seat.zoneName || "Khu vực chung"} • {seat.locationName || "Văn phòng"}
                </p>

                {/* Features Icons */}
                {seat.features && Object.keys(seat.features).length > 0 && (
                  <div className="flex gap-2 mt-3 relative z-10">
                    {seat.features.monitor && <Monitor className="w-4 h-4 text-slate-400" />}
                    {seat.features.standing && <Coffee className="w-4 h-4 text-slate-400" />}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Sheet Xác Nhận Đặt Chỗ */}
      <Sheet 
        isOpen={isSheetOpen} 
        onClose={() => handleSheetOpenChange(false)}
        title={`Xác nhận đặt ghế ${selectedSeat?.seatNumber || ""}`}
        description="Bạn đang yêu cầu đặt chỗ. Vui lòng kiểm tra lại thông tin trước khi xác nhận."
      >
        {selectedSeat && (
          <div className="my-6 space-y-4">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Vị trí</span>
                <span className="text-white font-medium text-right">
                  {selectedSeat.locationName}<br/>
                  <span className="text-slate-400 text-xs">{selectedSeat.zoneName}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Thời gian</span>
                <span className="text-indigo-300 font-medium text-right">
                  {date}<br/>
                  {startTime} - {endTime}
                </span>
              </div>
            </div>

            {/* Thông tin thêm nếu có features */}
             {selectedSeat.features && (
               <div className="flex gap-2 flex-wrap">
                  {selectedSeat.features.monitor && (
                     <Badge variant="secondary" className="bg-slate-800 text-slate-300 border border-white/5">
                        🖥️ Màn hình rời
                     </Badge>
                  )}
                  {selectedSeat.features.standing && (
                     <Badge variant="secondary" className="bg-slate-800 text-slate-300 border border-white/5">
                        ⚡ Bàn đứng
                     </Badge>
                  )}
               </div>
             )}
          </div>
        )}

        <div className="flex flex-col gap-3 mt-auto pt-4">
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 text-base font-semibold shadow-lg shadow-indigo-500/20 transition-all"
            onClick={handleConfirm}
            disabled={holdMutation.isPending || confirmMutation.isPending}
          >
            {(holdMutation.isPending || confirmMutation.isPending) ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 
                Đang xử lý...
              </>
            ) : (
              "Xác nhận đặt ngay"
            )}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleSheetOpenChange(false)} 
            className="w-full text-slate-400 hover:text-white rounded-xl h-12"
          >
            Hủy bỏ
          </Button>
        </div>
      </Sheet>

    </div>
  );
}
