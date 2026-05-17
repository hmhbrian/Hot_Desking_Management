"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  UserCircle, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  ShieldCheck,
  Building,
  CheckCircle2,
  XCircle,
  Settings2,
  Activity,
  User as UserIcon
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userService, UserSearchParams } from "@/services/userService";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomSelect } from "@/components/ui/custom-select";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types";

const ROLE_OPTIONS = [
  { value: "all", label: "Tất cả vai trò" },
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "MANAGER", label: "Quản lý" },
  { value: "EMPLOYEE", label: "Nhân viên" },
];

const RoleBadge = ({ role }: { role: string }) => {
  switch (role) {
    case "ADMIN":
      return (
        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    case "MANAGER":
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
          <UserCircle className="h-3 w-3 mr-1" />
          Manager
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
          Employee
        </Badge>
      );
  }
};

const StatusBadge = ({ enabled }: { enabled: boolean }) => {
  return enabled ? (
    <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
      <CheckCircle2 className="h-3.5 w-3.5" />
      <span>Đang hoạt động</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
      <XCircle className="h-3.5 w-3.5" />
      <span>Ngừng kích hoạt</span>
    </div>
  );
};

export default function UserManagementPage() {
  const [params, setParams] = useState<UserSearchParams>({
    page: 1,
    size: 10,
    query: "",
    role: "all",
    departmentId: undefined,
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<User> }) => 
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDialogOpen(false);
      setEditingUser(null);
    },
  });

  const { data: usersData, isLoading, isFetching } = useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.searchUsers({
        ...params,
        role: params.role === "all" ? undefined : params.role,
    }),
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => userService.getDepartments(),
  });

  const departmentOptions = useMemo(() => {
    if (!departments) return [{ value: "all", label: "Tất cả phòng ban" }];
    return [
      { value: "all", label: "Tất cả phòng ban" },
      { value: "none", label: "Chưa phân bổ" },
      ...departments.map(d => ({ value: d.id.toString(), label: d.name }))
    ];
  }, [departments]);

  const handleSearch = (val: string) => {
    setParams(prev => ({ ...prev, query: val, page: 1 }));
  };

  const handleRoleChange = (val: string) => {
    setParams(prev => ({ ...prev, role: val, page: 1 }));
  };

  const handleDeptChange = (val: string) => {
    setParams(prev => ({ 
      ...prev, 
      departmentId: val === "all" ? undefined : Number(val), 
      page: 1 
    }));
  };

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Quản lý Nhân viên</h1>
          <p className="text-slate-400 text-sm">Danh sách toàn bộ nhân sự và phân quyền hệ thống.</p>
        </div>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-slate-900/40 rounded-3xl border border-white/5 backdrop-blur-md shadow-xl relative z-20">
        <div className="md:col-span-6 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
          <Input 
            placeholder="Tìm kiếm theo tên hoặc email..." 
            className="pl-12 h-12 rounded-2xl bg-slate-800/30 border-white/5 focus:border-rose-500/50 transition-all text-white" 
            value={params.query} 
            onChange={(e) => handleSearch(e.target.value)} 
          />
        </div>
        <div className="md:col-span-3">
          <CustomSelect 
            value={params.role || "all"} 
            onChange={handleRoleChange}
            options={ROLE_OPTIONS}
            placeholder="Lọc vai trò"
          />
        </div>
        <div className="md:col-span-3">
          <CustomSelect 
            value={params.departmentId?.toString() || "all"} 
            onChange={handleDeptChange}
            options={departmentOptions}
            placeholder="Lọc phòng ban"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/40 rounded-[2rem] border border-white/5 overflow-hidden backdrop-blur-md shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="py-5 pl-8 font-black text-slate-500 uppercase tracking-widest text-[10px]">Nhân viên</TableHead>
              <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Email</TableHead>
              <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Phòng ban</TableHead>
              <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Vai trò</TableHead>
              <TableHead className="py-5 font-black text-slate-500 uppercase tracking-widest text-[10px]">Trạng thái</TableHead>
              <TableHead className="py-5 pr-8 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell className="py-5 pl-8"><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div></div></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="pr-8 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
                </TableRow>
              ))
            ) : usersData?.data?.length === 0 ? (
                <TableRow className="border-none">
                    <TableCell colSpan={6} className="py-20 text-center text-slate-500 font-medium">
                        Không tìm thấy người dùng nào phù hợp.
                    </TableCell>
                </TableRow>
            ) : (
              <AnimatePresence mode="popLayout">
                {usersData?.data.map((user) => (
                  <motion.tr 
                    key={user.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="border-white/5 hover:bg-white/[0.02] group transition-colors"
                  >
                    <TableCell className="py-5 pl-8">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-11 w-11 border-2 border-white/5 shadow-inner">
                          <AvatarImage src={user.pictureUrl} />
                          <AvatarFallback className="bg-rose-500/10 text-rose-500 font-bold text-xs">
                            {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-base leading-tight">{user.fullName}</span>
                          <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">ID: {user.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Mail className="h-3.5 w-3.5 text-slate-600" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500/40" />
                        <span className="text-slate-300 font-medium text-sm">{user.departmentName || "Chưa phân bổ"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell className="py-5">
                      <StatusBadge enabled={user.enabled} />
                    </TableCell>
                    <TableCell className="py-5 pr-8 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setIsDialogOpen(true);
                        }}
                        className="h-9 px-4 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 gap-2 font-bold text-xs"
                      >
                        <Settings2 className="h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Hiển thị <span className="text-slate-300 font-bold">{usersData?.data?.length || 0}</span> / {usersData?.totalElements || 0} nhân viên
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 rounded-xl border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5"
              onClick={() => handlePageChange(params.page! - 1)}
              disabled={params.page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: usersData?.totalPages || 1 }).map((_, i) => {
                  const pageNum = i + 1;
                  // Show only first, last, and around current page
                  if (
                      pageNum === 1 || 
                      pageNum === usersData?.totalPages || 
                      (pageNum >= params.page! - 1 && pageNum <= params.page! + 1)
                  ) {
                      return (
                          <Button
                            key={pageNum}
                            variant={params.page === pageNum ? "default" : "ghost"}
                            className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                                params.page === pageNum 
                                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isLoading}
                          >
                            {pageNum}
                          </Button>
                      );
                  } else if (
                      pageNum === params.page! - 2 || 
                      pageNum === params.page! + 2
                  ) {
                      return <span key={pageNum} className="text-slate-600 px-1 text-xs font-bold">...</span>;
                  }
                  return null;
              })}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 rounded-xl border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5"
              onClick={() => handlePageChange(params.page! + 1)}
              disabled={params.page === usersData?.totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900/95 border-white/10 text-white rounded-[2rem] max-w-[440px] shadow-[0_0_50px_-12px_rgba(244,63,94,0.2)] backdrop-blur-xl p-0 overflow-hidden border-none outline-none">
          <div className="bg-gradient-to-br from-rose-500/10 via-transparent to-blue-500/5 p-6 pt-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Chỉnh sửa thông tin</DialogTitle>
              <DialogDescription className="text-slate-400 font-medium text-xs">
                Cấu hình lại quyền hạn và trạng thái cho nhân viên.
              </DialogDescription>
            </DialogHeader>

            {editingUser && (
              <div className="space-y-6">
                {/* User Info Summary */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-blue-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                  <div className="relative flex items-center gap-4 p-4 rounded-2xl bg-slate-950/50 border border-white/5 backdrop-blur-sm">
                    <Avatar className="h-12 w-12 border-2 border-rose-500/20 shadow-xl">
                      <AvatarImage src={editingUser.pictureUrl} />
                      <AvatarFallback className="bg-rose-500/10 text-rose-500 font-black text-sm">
                        {editingUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-base text-white truncate mb-0.5">{editingUser.fullName}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
                        <Mail className="h-3 w-3 text-rose-500/70" />
                        <span className="truncate">{editingUser.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Sections */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2.5">
                      <Label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-rose-500" />
                        Vai trò hệ thống
                      </Label>
                      <CustomSelect 
                        value={editingUser.role} 
                        onChange={(val) => setEditingUser(prev => prev ? { ...prev, role: val as any } : null)}
                        options={ROLE_OPTIONS.filter(o => o.value !== "all")}
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                        <Building className="h-3.5 w-3.5 text-blue-500" />
                        Phòng ban trực thuộc
                      </Label>
                      <CustomSelect 
                        value={editingUser.departmentId?.toString() || "none"} 
                        onChange={(val) => setEditingUser(prev => prev ? { 
                          ...prev, 
                          departmentId: val === "none" ? undefined : Number(val), 
                          departmentName: val === "none" ? "Chưa phân bổ" : departments?.find(d => d.id === Number(val))?.name 
                        } : null)}
                        options={departmentOptions.filter(o => o.value !== "all")}
                        placeholder="Chọn phòng ban"
                      />
                    </div>
                  </div>

                  {/* Status Toggle Card */}
                  <div className={`p-4 rounded-2xl border transition-all duration-500 flex items-center justify-between ${editingUser.enabled ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/20 border-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors duration-500 ${editingUser.enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="text-sm font-black text-white">Trạng thái hoạt động</Label>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${editingUser.enabled ? 'text-emerald-500/70' : 'text-slate-500'}`}>
                          {editingUser.enabled ? "Đang hoạt động" : "Bị khóa"}
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={editingUser.enabled} 
                      onCheckedChange={(checked) => setEditingUser(prev => prev ? { ...prev, enabled: checked } : null)} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="bg-slate-950/50 p-5 px-6 flex sm:justify-between items-center border-t border-white/5">
            <Button 
              variant="ghost" 
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl hover:bg-white/5 text-slate-500 hover:text-white font-bold text-xs px-4"
            >
              Hủy bỏ
            </Button>
            <Button 
              onClick={() => updateMutation.mutate({ 
                id: editingUser!.id, 
                data: {
                  role: editingUser!.role,
                  departmentId: editingUser!.departmentId,
                  enabled: editingUser!.enabled
                }
              })}
              disabled={updateMutation.isPending}
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-6 h-10 text-xs font-black shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
            >
              {updateMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang lưu...</span>
                </div>
              ) : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
