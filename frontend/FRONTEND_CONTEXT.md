1.Tech stack

- Framework chính: Next.js 14+ (App Router) - Chuẩn công nghiệp, tối ưu SEO và tốc độ.
- Styling: Tailwind CSS - Giúp tùy chỉnh giao diện cực nhanh và nhẹ.
- UI Component Library: Shadcn/UI - Đây là bộ UI "hot" nhất hiện nay, thiết kế cực kỳ tinh tế, hiện đại (dùng bởi các cty lớn như Vercel).
- Icons: Lucide React - Bộ icon thanh mảnh, đồng bộ.
- State Management & Data Fetching: TanStack Query (React Query) - Giúp đồng bộ dữ liệu từ Backend Spring Boot lên Web một cách mượt mà (tự động load lại dữ liệu, xoay vòng loading...).
- Biểu đồ (Charts): Tremor hoặc Recharts - Chuyên dùng cho Dashboard quản trị, nhìn rất "Data-driven".
- Hiệu ứng: Framer Motion - Giúp các bảng biểu, menu xuất hiện mượt mà, chuyên nghiệp.

  2.Folder Structure
  src/
  ├── app/ # Next.js App Router (Pages & Layouts)
  ├── components/ # Các thành phần giao diện tái sử dụng
  │ ├── ui/ # Shadcn components (Button, Input, Card...)
  │ ├── shared/ # Navbar, Sidebar, Footer
  │ └── dashboard/ # Các component dành riêng cho trang Admin
  ├── hooks/ # Custom hooks (ví dụ: useSeats, useBookings)
  ├── services/ # Nơi gọi API (Sử dụng Axios hoặc Fetch)
  ├── lib/ # Các hàm tiện ích (utils, format date)
  ├── store/ # Quản lý trạng thái (Zustand - nếu cần)
  └── types/ # Định nghĩa TypeScript (Interface cho Seat, User, Booking)
