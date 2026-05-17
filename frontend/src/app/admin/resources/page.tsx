"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Monitor, 
  Zap, 
  Sun, 
  ArrowUpToLine, 
  Armchair, 
  Coffee, 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  MapPin, 
  MoreVertical,
  Settings,
  Cpu,
  Tv
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { seatService, zoneService, locationService } from "@/services/resourceService";
import { Seat, Zone, Location } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

// --- Helpers ---

const getFeatureIcon = (key: string) => {
  switch (key.toLowerCase()) {
    case "monitor": return <Tv className="h-3 w-3" />;
    case "dual_monitor": return <Monitor className="h-3 w-3" />;
    case "power": return <Zap className="h-3 w-3" />;
    case "standing": return <ArrowUpToLine className="h-3 w-3" />;
    case "window": return <Sun className="h-3 w-3" />;
    case "coffee": return <Coffee className="h-3 w-3" />;
    case "ergonomic": return <Armchair className="h-3 w-3" />;
    default: return <Cpu className="h-3 w-3" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    AVAILABLE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    LOCKED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    MAINTENANCE: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[status] || styles.AVAILABLE}`}>
      {status}
    </span>
  );
};

import { Sheet } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import { CustomSelect } from "@/components/ui/custom-select";

// --- Page Component ---

export default function ResourcesPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  // Locations state
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [currentLoc, setCurrentLoc] = useState<Partial<Location> | null>(null);

  // Zones state
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [currentZone, setCurrentZone] = useState<Partial<Zone> | null>(null);
  const [zoneFilterLoc, setZoneFilterLoc] = useState<string>("all");

  // Seats state
  const [isSeatSheetOpen, setIsSeatSheetOpen] = useState(false);
  const [currentSeat, setCurrentSeat] = useState<Partial<Seat> | null>(null);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkConfig, setBulkConfig] = useState({ prefix: "S", quantity: 1 });
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, number>>({});

  // Tabs state
  const [activeTab, setActiveTab] = useState("locations");

  // Seats Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [locData] = await Promise.all([
        locationService.getAll(),
      ]);
      setLocations(locData);

      const zoneData = await zoneService.getAll();
      setZones(zoneData);

      const seatParams: any = {
        size: 100,
        seatNumber: searchQuery,
        zoneId: selectedZone === "all" ? undefined : selectedZone
      };
      const seatData = await seatService.getAll(seatParams);
      setSeats(seatData.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredZones = useMemo(() => {
    if (zoneFilterLoc === "all") return zones;
    return zones.filter(z => z.locationId === Number(zoneFilterLoc));
  }, [zones, zoneFilterLoc]);

  useEffect(() => {
    fetchData();
  }, [selectedZone]); 

  useEffect(() => {
    const timeoutId = setTimeout(fetchData, searchQuery ? 500 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLoc?.name || !currentLoc?.address) return;
    try {
      if (currentLoc.id) await locationService.update(currentLoc.id, currentLoc);
      else await locationService.create(currentLoc);
      setIsLocModalOpen(false);
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm("Xóa văn phòng?")) return;
    try { await locationService.delete(id); fetchData(); } catch (error) { console.error(error); }
  };

  const handleSaveZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentZone?.name || !currentZone?.locationId) return;
    try {
      if (currentZone.id) await zoneService.update(currentZone.id, currentZone);
      else await zoneService.create(currentZone);
      setIsZoneModalOpen(false);
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleDeleteZone = async (id: number) => {
    if (!confirm("Xóa khu vực?")) return;
    try { await zoneService.delete(id); fetchData(); } catch (error) { console.error(error); }
  };

  const handleSaveSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeat?.zoneId) return;

    try {
      if (isBulkMode && !currentSeat.id) {
        await seatService.createBulk({
          zoneId: currentSeat.zoneId,
          prefix: bulkConfig.prefix,
          quantity: bulkConfig.quantity,
          features: selectedFeatures
        });
      } else {
        const payload = {
          ...currentSeat,
          features: selectedFeatures
        };
        if (currentSeat.id) await seatService.update(currentSeat.id, payload);
        else await seatService.create(payload);
      }
      setIsSeatSheetOpen(false);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi lưu chỗ ngồi:", error);
    }
  };

  const handleDeleteSeat = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chỗ ngồi này?")) return;
    try {
      await seatService.delete(id);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi xóa chỗ ngồi:", error);
    }
  };

  const toggleFeature = (key: string) => {
    setSelectedFeatures(prev => {
      const newFeatures = { ...prev };
      if (newFeatures[key]) delete newFeatures[key];
      else newFeatures[key] = 1;
      return newFeatures;
    });
  };

  const updateFeatureCount = (key: string, count: number) => {
    setSelectedFeatures(prev => ({ ...prev, [key]: count }));
  };

  const filteredSeats = seats;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Quản lý Tài nguyên</h1>
          <p className="text-slate-400 text-sm">Cấu hình văn phòng, các khu vực và sơ đồ chỗ ngồi toàn hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => {
              if (activeTab === 'locations') {
                setCurrentLoc({ name: "", address: "" });
                setIsLocModalOpen(true);
              } else if (activeTab === 'zones') {
                setCurrentZone({ name: "", locationId: locations[0]?.id });
                setIsZoneModalOpen(true);
              } else {
                setCurrentSeat({ seatNumber: "", zoneId: zones[0]?.id, status: "AVAILABLE" as any });
                setSelectedFeatures({});
                setIsBulkMode(false);
                setIsSeatSheetOpen(true);
              }
            }}
            className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 gap-2 rounded-2xl h-11 px-6 border-none transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            <span className="font-bold text-sm">
              {activeTab === 'locations' ? 'Thêm văn phòng' : activeTab === 'zones' ? 'Thêm khu vực' : 'Thêm chỗ ngồi'}
            </span>
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-900/50 p-1 border border-white/5 rounded-2xl mb-8">
          <TabsTrigger value="locations" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all">Locations</TabsTrigger>
          <TabsTrigger value="zones" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all">Zones</TabsTrigger>
          <TabsTrigger value="seats" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all">Seats</TabsTrigger>
        </TabsList>

        <TabsContent value="locations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {locations.map((loc) => (
                <motion.div 
                  key={loc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 rounded-[2rem] bg-slate-900/40 border border-white/5 backdrop-blur-md group hover:border-rose-500/30 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center gap-5 mb-8">
                      <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                        <Building2 className="h-7 w-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate text-xl mb-1">{loc.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate font-medium">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-500/70" />
                          {loc.address}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Khu vực</p>
                        <p className="text-2xl font-black text-white">{loc.totalZones || 0}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Chỗ ngồi</p>
                        <p className="text-2xl font-black text-rose-500">{loc.totalSeats || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-5 border-t border-white/5">
                    <Button variant="ghost" size="sm" onClick={() => { setCurrentLoc(loc); setIsLocModalOpen(true); }} className="text-xs font-bold text-slate-400 hover:text-white rounded-xl px-4">Chỉnh sửa</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteLocation(loc.id)} className="text-xs font-bold text-rose-500/60 hover:text-rose-500 rounded-xl px-4">Xóa</Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="zones">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/40 p-5 rounded-3xl border border-white/5 backdrop-blur-md gap-4 relative z-20">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20"><Filter className="h-5 w-5" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Bộ lọc</p>
                  <p className="text-sm font-bold text-white">Lọc theo văn phòng</p>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <CustomSelect 
                  className="w-full sm:w-64"
                  value={zoneFilterLoc} 
                  onChange={(val) => setZoneFilterLoc(val)}
                  options={[
                    { value: "all", label: "Tất cả văn phòng" },
                    ...locations.map(loc => ({ value: loc.id, label: loc.name }))
                  ]}
                />
              </div>
            </div>
            <div className="bg-slate-900/40 rounded-[2rem] border border-white/5 overflow-hidden backdrop-blur-md shadow-2xl">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Tên khu vực</TableHead>
                    <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Văn phòng</TableHead>
                    <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Chỗ ngồi</TableHead>
                    <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Mô tả</TableHead>
                    <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredZones.map((zone) => (
                      <motion.tr key={zone.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <TableCell className="py-5 font-bold text-white text-base">{zone.name}</TableCell>
                        <TableCell className="py-5"><span className="text-[11px] font-bold text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-xl border border-blue-400/20">{zone.locationName}</span></TableCell>
                        <TableCell className="py-5"><div className="flex items-center gap-2"><span className="font-black text-rose-500 text-lg">{zone.totalSeats || 0}</span><span className="text-[10px] font-bold text-slate-500 uppercase">ghế</span></div></TableCell>
                        <TableCell className="py-5 text-slate-400 text-sm max-w-[200px] truncate">{zone.description || "Chưa có mô tả"}</TableCell>
                        <TableCell className="py-5 text-right flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => { setCurrentZone(zone); setIsZoneModalOpen(true); }} className="h-9 w-9 rounded-xl text-slate-500 hover:text-white hover:bg-white/10"><Settings className="h-5 w-5" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteZone(zone.id)} className="h-9 w-9 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10"><MoreVertical className="h-5 w-5" /></Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seats">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-slate-900/40 rounded-3xl border border-white/5 backdrop-blur-md shadow-xl relative z-20">
              <div className="md:col-span-7 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                <Input placeholder="Tìm kiếm theo số hiệu ghế (VD: S-101)..." className="pl-12 h-12 rounded-2xl bg-slate-800/30 border-white/5 focus:border-rose-500/50 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="md:col-span-5 flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 shrink-0"><Filter className="h-5 w-5" /></div>
                <CustomSelect 
                  className="flex-1"
                  value={selectedZone} 
                  onChange={(val) => setSelectedZone(val)}
                  options={[
                    { value: "all", label: "Tất cả khu vực" },
                    ...zones.map(z => ({ 
                      value: z.id, 
                      label: z.name,
                      subLabel: z.locationName 
                    }))
                  ]}
                />
              </div>
            </div>
            <div className="bg-slate-900/40 rounded-[2rem] border border-white/5 overflow-hidden backdrop-blur-md shadow-2xl">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">ID</TableHead>
                    <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Số ghế</TableHead>
                    <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Khu vực</TableHead>
                    <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Tiện ích</TableHead>
                    <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Trạng thái</TableHead>
                    <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredSeats.map((seat) => (
                      <motion.tr key={seat.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-white/5 hover:bg-white/[0.02] group">
                        <TableCell className="py-5 text-[10px] font-mono text-slate-600">{seat.id.slice(0, 8)}</TableCell>
                        <TableCell className="py-5 font-bold text-white text-base">{seat.seatNumber}</TableCell>
                        <TableCell className="py-5 text-slate-400"><span className="px-3 py-1.5 rounded-xl bg-slate-800 text-[11px] font-bold border border-white/5">{seat.zoneName}</span></TableCell>
                        <TableCell className="py-5">
                          <div className="flex gap-1.5">
                            {seat.features && Object.entries(seat.features).map(([key, val]) => (
                              <div key={key} title={`${key}: ${val}`} className="p-2 rounded-xl bg-slate-800/50 text-slate-400 hover:text-rose-400 transition-colors border border-white/5">{getFeatureIcon(key)}</div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-5"><StatusBadge status={seat.status} /></TableCell>
                        <TableCell className="py-5 text-right flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => { setCurrentSeat(seat); setSelectedFeatures(seat.features || {}); setIsBulkMode(false); setIsSeatSheetOpen(true); }} className="h-9 w-9 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all"><Settings className="h-5 w-5" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteSeat(seat.id)} className="h-9 w-9 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10"><MoreVertical className="h-5 w-5" /></Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* --- MODALS & SHEETS --- */}
      <Modal isOpen={isLocModalOpen} onClose={() => setIsLocModalOpen(false)} title={currentLoc?.id ? "Chỉnh sửa văn phòng" : "Thêm văn phòng mới"}>
        <form onSubmit={handleSaveLocation} className="space-y-4">
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tên văn phòng</label><Input required placeholder="VD: Chi nhánh Quận 1" value={currentLoc?.name || ""} onChange={(e) => setCurrentLoc(prev => ({ ...prev, name: e.target.value }))} /></div>
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Địa chỉ</label><Input required placeholder="VD: 123 Lê Lợi, Bến Thành, Q.1" value={currentLoc?.address || ""} onChange={(e) => setCurrentLoc(prev => ({ ...prev, address: e.target.value }))} /></div>
          <div className="flex justify-end gap-3 pt-4"><Button type="button" variant="ghost" onClick={() => setIsLocModalOpen(false)}>Hủy</Button><Button type="submit" className="bg-rose-500 hover:bg-rose-600 px-8 font-bold">Lưu</Button></div>
        </form>
      </Modal>

      <Modal isOpen={isZoneModalOpen} onClose={() => setIsZoneModalOpen(false)} title={currentZone?.id ? "Chỉnh sửa khu vực" : "Thêm khu vực mới"}>
        <form onSubmit={handleSaveZone} className="space-y-4">
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tên khu vực</label><Input required placeholder="VD: Khu vực A - Tầng 2" value={currentZone?.name || ""} onChange={(e) => setCurrentZone(prev => ({ ...prev, name: e.target.value }))} /></div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Văn phòng</label>
            <CustomSelect 
              value={currentZone?.locationId || ""} 
              onChange={(val) => setCurrentZone(prev => ({ ...prev, locationId: Number(val) }))}
              options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
              placeholder="Chọn văn phòng"
            />
          </div>
          <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mô tả</label><Input placeholder="VD: Khu vực yên tĩnh, gần cửa sổ" value={currentZone?.description || ""} onChange={(e) => setCurrentZone(prev => ({ ...prev, description: e.target.value }))} /></div>
          <div className="flex justify-end gap-3 pt-4"><Button type="button" variant="ghost" onClick={() => setIsZoneModalOpen(false)}>Hủy</Button><Button type="submit" className="bg-rose-500 hover:bg-rose-600 px-8 font-bold">Lưu</Button></div>
        </form>
      </Modal>

      <Sheet isOpen={isSeatSheetOpen} onClose={() => setIsSeatSheetOpen(false)} title={currentSeat?.id ? "Chỉnh sửa chỗ ngồi" : "Quản lý chỗ ngồi"} description={currentSeat?.id ? "Cập nhật thông tin chi tiết cho chỗ ngồi hiện tại." : "Thêm một hoặc nhiều chỗ ngồi mới vào khu vực."}>
        <form onSubmit={handleSaveSeat} className="space-y-6">
          {!currentSeat?.id && (
            <div className="flex p-1 bg-slate-800/50 rounded-xl border border-white/5">
              <button type="button" onClick={() => setIsBulkMode(false)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isBulkMode ? "bg-rose-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}>Tạo đơn lẻ</button>
              <button type="button" onClick={() => setIsBulkMode(true)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isBulkMode ? "bg-rose-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}>Tạo hàng loạt</button>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Khu vực (Zone)</label>
              <CustomSelect 
                value={currentSeat?.zoneId || ""} 
                onChange={(val) => setCurrentSeat(prev => ({ ...prev, zoneId: Number(val) }))}
                options={zones.map(z => ({ 
                  value: z.id, 
                  label: z.name,
                  subLabel: z.locationName
                }))}
                placeholder="Chọn khu vực"
              />
            </div>

            {isBulkMode && !currentSeat?.id ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tiền tố (Prefix)</label>
                  <Input placeholder="VD: WS" value={bulkConfig.prefix} onChange={(e) => setBulkConfig(prev => ({ ...prev, prefix: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Số lượng</label>
                  <Input type="number" min={1} max={50} value={bulkConfig.quantity} onChange={(e) => setBulkConfig(prev => ({ ...prev, quantity: Number(e.target.value) }))} />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Số hiệu ghế</label>
                <Input required placeholder="VD: WS-01" value={currentSeat?.seatNumber || ""} onChange={(e) => setCurrentSeat(prev => ({ ...prev, seatNumber: e.target.value }))} />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trạng thái</label>
              <CustomSelect 
                value={currentSeat?.status || "AVAILABLE"} 
                onChange={(val) => setCurrentSeat(prev => ({ ...prev, status: val as any }))}
                options={[
                  { value: "AVAILABLE", label: "Sẵn sàng" },
                  { value: "LOCKED", label: "Đã khóa" },
                  { value: "MAINTENANCE", label: "Bảo trì" }
                ]}
              />
            </div>

            <div className="space-y-3 pt-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tiện ích (Features)</label>
              <div className="grid grid-cols-1 gap-3">
                {["monitor", "dual_monitor", "standing", "power", "window", "ergonomic"].map(feature => (
                  <div key={feature} className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/30 border border-white/5 hover:border-rose-500/30 transition-all">
                    <Checkbox id={`feat-${feature}`} label={feature.replace("_", " ").toUpperCase()} checked={!!selectedFeatures[feature]} onChange={() => toggleFeature(feature)} />
                    {selectedFeatures[feature] !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">SL:</span>
                        <input type="number" min={1} className="w-12 h-7 bg-slate-900 border border-white/10 rounded-lg text-center text-xs font-bold text-rose-500 focus:outline-none focus:border-rose-500/50" value={selectedFeatures[feature]} onChange={(e) => updateFeatureCount(feature, Number(e.target.value))} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-white/5">
            <Button type="button" variant="ghost" onClick={() => setIsSeatSheetOpen(false)} className="flex-1">Hủy</Button>
            <Button type="submit" className="flex-[2] bg-rose-500 hover:bg-rose-600 font-bold shadow-lg shadow-rose-500/20">Lưu chỗ ngồi</Button>
          </div>
        </form>
      </Sheet>
    </div>
  );
}
