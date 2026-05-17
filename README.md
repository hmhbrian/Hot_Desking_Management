# 🏢 Hot Desking Management System (Monorepo)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.13-brightgreen)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red)](https://redis.io/)

Hot Desking Management System là một giải pháp quản lý không gian làm việc hiện đại, giúp tối ưu hóa việc sử dụng tài nguyên văn phòng trong môi trường làm việc hybrid. Hệ thống giải quyết các bài toán về xử lý tranh chấp tài nguyên (Concurrency), bảo mật doanh nghiệp và quản lý phân cấp hạ tầng văn phòng.

Dự án này được tổ chức theo mô hình **Monorepo**, chứa cả Backend (Java/Spring Boot) và Frontend (Next.js/React) trong cùng một repository để dễ dàng quản lý và đồng bộ mã nguồn.

---

## 📂 Cấu trúc thư mục (Project Structure)

```text
hot_desking_management_sy/
├── backend/                # Server-side (Java, Spring Boot)
│   ├── src/                # Mã nguồn Backend
│   ├── pom.xml             # Cấu hình Maven & Dependencies
│   └── README.md           # Tài liệu chi tiết của Backend
├── frontend/               # Client-side (Next.js, React, Tailwind)
│   ├── src/                # Mã nguồn Frontend
│   ├── package.json        # Cấu hình NPM & Dependencies
│   └── ...                 
└── README.md               # Tài liệu tổng quan (File này)
```

---

## 🛠 Tech Stack Tổng hợp

| Lớp (Layer) | Công nghệ / Công cụ | Phiên bản / Chi tiết |
| :--- | :--- | :--- |
| **Frontend** | **Next.js** / React | `14.2.35` / `18.x` |
| | Ngôn ngữ | TypeScript `5.x` |
| | Giao diện (UI) | Tailwind CSS `3.4.1`, shadcn/ui `4.7.0`, Framer Motion, Lucide React |
| | Quản lý trạng thái (State) | Zustand `5.0.x`, TanStack React Query `5.100.x` |
| | Giao tiếp API & Khác | Axios `1.16.0`, Recharts `3.8.1` |
| **Backend** | **Spring Boot** / Java | `3.5.13` / `17` |
| | Database Access | Spring Data JPA, Hibernate, PostgreSQL Driver |
| | Security & Auth | Spring Security, OAuth2 Client (Google), JWT (jjwt) |
| | Caching & Concurrency | Redis (Spring Data Redis) |
| | Utilities | MapStruct `1.5.5`, Lombok, Springdoc OpenAPI (Swagger) |
| **Infrastructure** | **Database** | PostgreSQL `15` |
| | **Cache & Queue** | Redis `7` |
| | **DevOps** | Docker, Docker Compose |

---

## 🚀 Tính năng cốt lõi (Core Features)

- **Real-time Seat Reservation**: Tìm kiếm và đặt chỗ ngồi dựa trên sơ đồ văn phòng theo thời gian thực.
- **Hierarchical Resource Management**: Quản lý cấu trúc văn phòng linh hoạt: `Office` ➔ `Zone` ➔ `Desk`.
- **Social Authentication**: Tích hợp **Google OAuth2** giúp quy trình truy cập nhanh chóng, an toàn và chuyên nghiệp.
- **Check-in & Trạng thái thực tế**: 
  - Tích hợp quét mã QR tại bàn để xác nhận (Occupied).
  - Tự động hủy (Auto-release) nếu không check-in sau 30-60 phút để giải phóng tài nguyên.
- **Quy tắc doanh nghiệp (Business Rules)**: Hạn mức (1 người/chỗ), đặt trước (tối đa 7 ngày), ưu tiên theo Team.
- **Báo cáo & Thống kê**: Theo dõi tỷ lệ lấp đầy (Occupancy Rate) và các trường hợp không đến (No-show).

---

## 🏗 Kiến trúc nổi bật: Xử lý Concurrency

Hệ thống được thiết kế để xử lý hàng ngàn yêu cầu đặt chỗ cùng lúc (High-Concurrency Seat Locking) với 2 lớp bảo vệ tính toàn vẹn dữ liệu:
1. **Distributed Lock (Redis)**: Khi người dùng chọn chỗ, một lock tạm thời được tạo trong Redis với TTL (Time To Live). Các yêu cầu khác cho cùng một `desk_id` sẽ bị chặn ngay lập tức, ngăn chặn tình trạng _double-booking_.
2. **Optimistic Locking (JPA `@Version`)**: Đảm bảo ở tầng Database (PostgreSQL) không có transaction nào ghi đè dữ liệu cũ nếu có xung đột xảy ra ngoài ý muốn.

---

## 🏁 Hướng dẫn khởi chạy nhanh (Quick Start)

### Yêu cầu tiên quyết
- **Node.js** (v20+ khuyến nghị) & npm/yarn.
- **Java 17** & Maven 3.8+.
- **Docker** & Docker Compose.

### 1. Khởi chạy Hạ tầng & Backend

Cấu hình môi trường cho backend:
Tạo file `backend/.env` (dựa trên mẫu `.env`):
```env
DB_URL=jdbc:postgresql://localhost:5432/hotdesking_db
DB_USER=your_user
DB_PASS=your_password
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
app.jwtSecret=your_secret_key
app.jwtExpirationInMs=86400000
```

Khởi chạy PostgreSQL & Redis qua Docker (chạy tại thư mục `backend/`):
```bash
cd backend
docker-compose up -d
```

Chạy Backend Spring Boot:
```bash
mvn clean spring-boot:run
```
👉 **API Documentation (Swagger)**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### 2. Cài đặt & Khởi chạy Frontend

Mở một Terminal mới, đi tới thư mục `frontend`:
```bash
cd frontend
```

Cài đặt các gói phụ thuộc (Dependencies):
```bash
npm install
```

Khởi chạy môi trường phát triển (Development):
```bash
npm run dev
```
👉 **Ứng dụng Frontend sẽ chạy tại**: [http://localhost:3000](http://localhost:3000)

---

## 📅 Lộ trình phát triển (Roadmap)

- [x] Hoàn thiện Core API cho đặt chỗ.
- [x] Tích hợp Distributed Lock với Redis.
- [x] Khởi tạo Frontend Monorepo với Next.js & Tailwind CSS.
- [ ] Xây dựng hệ thống Check-in qua QR Code & Auto-release.
- [ ] Áp dụng các Business Rules (Quota, Team Priority, Max Days).
- [ ] Dashboard thống kê (Occupancy Rate, No-show reports) cho Admin (Sử dụng Recharts).
- [ ] Tích hợp Push Notification (Websocket/Firebase).
- [ ] Triển khai Interactive Floor Map (Frontend Integration với Framer Motion).
