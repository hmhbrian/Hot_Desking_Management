import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  ChartBar,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  MapPin,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────

const stats = [
  { value: "500+", label: "Chỗ ngồi được quản lý" },
  { value: "98%", label: "Tỷ lệ hài lòng" },
  { value: "3x", label: "Tối ưu không gian" },
  { value: "24/7", label: "Hỗ trợ liên tục" },
];

const features = [
  {
    icon: CalendarCheck,
    title: "Đặt chỗ thông minh",
    description:
      "Đặt chỗ ngồi theo ngày, giờ chỉ với vài thao tác. Xem trạng thái thực tế theo thời gian thực.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard quản trị",
    description:
      "Tổng quan toàn bộ văn phòng — tỷ lệ lấp đầy, thống kê theo khu vực, báo cáo chi tiết.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: MapPin,
    title: "Bản đồ tầng tương tác",
    description:
      "Xem sơ đồ mặt bằng trực quan, chọn chỗ ngồi yêu thích ngay trên bản đồ.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    title: "Quản lý nhóm",
    description:
      "Phân quyền theo phòng ban, đặt chỗ theo nhóm, theo dõi lịch làm việc của team.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: ChartBar,
    title: "Phân tích & Báo cáo",
    description:
      "Báo cáo sử dụng không gian theo tuần/tháng, tối ưu chi phí vận hành văn phòng.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Bảo mật doanh nghiệp",
    description:
      "Xác thực JWT, phân quyền theo vai trò (RBAC), bảo vệ dữ liệu theo tiêu chuẩn.",
    color: "from-slate-500 to-gray-500",
  },
];

const steps = [
  {
    step: "01",
    title: "Đăng nhập tài khoản",
    description: "Đăng nhập bằng tài khoản công ty được cấp bởi quản trị viên.",
  },
  {
    step: "02",
    title: "Chọn ngày & khu vực",
    description: "Chọn ngày làm việc, tầng, khu vực mong muốn trên bản đồ.",
  },
  {
    step: "03",
    title: "Đặt chỗ trong 1 click",
    description: "Xác nhận chỗ ngồi và nhận thông báo xác nhận ngay lập tức.",
  },
];

// ─── Components ────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">
            HotDesk<span className="text-blue-400">Pro</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Tính năng", "Cách hoạt động", "Liên hệ"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-slate-300 hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Đăng nhập
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
          >
            Bắt đầu ngay
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-16">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-2/3 left-1/4 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-600/10 blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300 mb-8 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          Hệ thống Hot Desking thế hệ mới
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 animate-fade-in">
          Quản lý không gian
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            làm việc linh hoạt
          </span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed mb-10 animate-fade-in">
          Tối ưu hóa không gian văn phòng, đặt chỗ thông minh, theo dõi thống
          kê thời gian thực. Giải pháp toàn diện cho doanh nghiệp hiện đại.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in">
          <Link
            href="/login"
            id="hero-cta-primary"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
          >
            Bắt đầu miễn phí
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            id="hero-cta-secondary"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            Xem tính năng
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/8 hover:border-white/20 transition-all duration-300"
            >
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-slate-900 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 mb-4">
            <Zap className="h-3.5 w-3.5" />
            Tính năng nổi bật
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Mọi thứ bạn cần để{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              quản lý văn phòng
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Bộ công cụ đầy đủ giúp HR, Admin và nhân viên vận hành không gian
            làm việc hiệu quả hơn.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-white/10 bg-slate-800/50 p-6 hover:border-white/20 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
              >
                {/* Icon */}
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300 mb-4">
            <Clock className="h-3.5 w-3.5" />
            Chỉ 3 bước đơn giản
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Cách hoạt động
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Đặt chỗ làm việc chưa bao giờ dễ dàng và nhanh chóng đến vậy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          {steps.map((step, index) => (
            <div key={step.step} className="relative text-center group">
              {/* Step number */}
              <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-slate-800 mb-6 mx-auto group-hover:border-blue-500/50 group-hover:bg-slate-700 transition-all duration-300">
                <span className="text-3xl font-black bg-gradient-to-br from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {step.step}
                </span>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-12 top-1/2 -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-slate-600" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {/* Check */}
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Nhanh & dễ dàng
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-slate-900 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/50 via-slate-900 to-violet-950/50 p-16 overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-80 bg-blue-600/20 blur-3xl rounded-full" />

          <h2 className="relative text-4xl font-bold text-white mb-4">
            Sẵn sàng tối ưu{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              văn phòng của bạn?
            </span>
          </h2>
          <p className="relative text-slate-400 mb-8 max-w-md mx-auto">
            Đăng nhập ngay để trải nghiệm hệ thống quản lý Hot Desking hiện đại
            nhất.
          </p>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              id="cta-login-btn"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
            >
              Đăng nhập ngay
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Building2 className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-sm">
            HotDesk<span className="text-blue-400">Pro</span>
          </span>
        </div>
        <p className="text-slate-500 text-sm">
          © 2026 HotDeskPro. Hệ thống quản lý chỗ ngồi linh hoạt.
        </p>
        <div className="flex gap-6">
          {["Chính sách", "Điều khoản", "Liên hệ"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
}
