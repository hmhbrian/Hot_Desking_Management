# 🏢 Hot Desking Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.13-brightgreen)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red)](https://redis.io/)

Hot Desking Management System là một giải pháp quản lý không gian làm việc hiện đại, giúp tối ưu hóa việc sử dụng tài nguyên văn phòng trong môi trường làm việc hybrid. Hệ thống giải quyết các bài toán về xử lý tranh chấp tài nguyên (Concurrency), bảo mật doanh nghiệp và quản lý phân cấp hạ tầng văn phòng.

---

## 🚀 Tính năng cốt lõi (Core Features)

- **Real-time Seat Reservation**: Tìm kiếm và đặt chỗ ngồi dựa trên sơ đồ văn phòng theo thời gian thực.
- **High-Concurrency Seat Locking**: Sử dụng **Distributed Locking (Redis)** để ngăn chặn tình trạng _double-booking_ khi có hàng ngàn yêu cầu cùng lúc.
- **Social Authentication**: Tích hợp **Google OAuth2** giúp quy trình truy cập nhanh chóng, an toàn và chuyên nghiệp.
- **Hierarchical Resource Management**: Quản lý cấu trúc văn phòng linh hoạt: `Office` ➔ `Zone` ➔ `Desk`.
- **System Auditing**: Tự động lưu vết (logging) mọi thay đổi dữ liệu để phục vụ việc giám sát và báo cáo xu hướng sử dụng.

---

## 🛠 Chi tiết các chức năng hệ thống

### A. Quản lý Tài nguyên (Resource Management)
- **Quản lý Sơ đồ (Floor Plan)**: Định nghĩa các Khu vực (Zones) theo tính chất công việc: *Khu yên tĩnh, Khu kỹ thuật, Khu sáng tạo.*
- **Quản lý Chỗ ngồi (Seat/Desk)**: Mỗi chỗ ngồi bao gồm các thông tin:
  - Số bàn, loại bàn (đứng/ngồi).
  - Thiết bị hỗ trợ: Màn hình rời, docking station, v.v.
  - Trạng thái thời gian thực: *Available, Reserved, Occupied.*

### B. Quy trình Đặt chỗ (Booking Workflow)
- **Tìm kiếm thông minh**: Lọc chỗ ngồi theo ngày, theo tầng hoặc theo tiện ích (VD: "Tìm bàn có 2 màn hình").
- **Cơ chế Giữ chỗ (Locking)**: Khi nhân viên đang chọn bàn, hệ thống sẽ tạm khóa bàn đó trong **5-10 phút** (sử dụng Redis TTL) để tránh xung đột.
- **Xác nhận**: Ghi nhận lịch sử và gửi thông báo xác nhận qua Email/Hệ thống.

### C. Check-in & Trạng thái thực tế
- **Xác thực qua QR Code**: Nhân viên quét mã QR tại bàn bằng Mobile App để chuyển trạng thái sang *Occupied*.
- **Tự động hủy (Auto-release)**: Nếu không check-in sau **30-60 phút** kể từ giờ bắt đầu, hệ thống tự động giải phóng bàn.
- **Check-out sớm**: Cho phép giải phóng bàn trước thời hạn để tối ưu hóa không gian cho người khác.

### D. Quy tắc doanh nghiệp (Business Rules)
- **Hạn mức (Quota)**: Tối đa 1 chỗ ngồi/người trong cùng một khung giờ.
- **Thời gian đặt trước**: Chỉ cho phép đặt trước tối đa **7 ngày**.
- **Ưu tiên khu vực**: Phân quyền Zone theo Team (VD: Zone A dành riêng cho Team Dev).

### E. Báo cáo & Thống kê (Reporting)
- **Tỷ lệ lấp đầy (Occupancy Rate)**: Theo dõi hiệu suất sử dụng theo ngày/khu vực.
- **Báo cáo vi phạm (No-show report)**: Thống kê các trường hợp đặt nhưng không đến để xử lý.

---

## 🛠 Tech Stack

- **Backend**: Java 17, Spring Boot 3.5.x
- **Persistence**: Spring Data JPA, Hibernate, PostgreSQL 15
- **Security**: Spring Security, OAuth2 Client, JWT (JSON Web Token)
- **Caching & Concurrency**: Redis 7 (Distributed Lock with Redisson/Jedis)
- **Mapping & Utils**: MapStruct, Lombok
- **Documentation**: Springdoc OpenAPI (Swagger UI)
- **Infrastructure**: Docker, Docker Compose

---

## 🏗 Kiến trúc hệ thống & Xử lý Concurrency

Hệ thống tập trung vào tính toàn vẹn dữ liệu (Data Integrity) thông qua 2 lớp bảo vệ:

1. **Distributed Lock (Redis)**: Khi người dùng chọn chỗ, một lock tạm thời được tạo trong Redis với TTL (Time To Live). Các yêu cầu khác cho cùng một `desk_id` sẽ bị chặn ngay lập tức.
2. **Optimistic Locking (JPA @Version)**: Đảm bảo ở tầng Database không có transaction nào ghi đè dữ liệu cũ nếu có xung đột xảy ra ngoài ý muốn.

---

## 🏁 Bắt đầu (Getting Started)

### 1. Yêu cầu hệ thống

- **Java 17** trở lên.
- **Maven 3.8+**.
- **Docker & Docker Compose**.

### 2. Cấu hình môi trường

Tạo file `.env` tại thư mục gốc của dự án (dựa trên mẫu `.env` có sẵn):

```env
DB_URL=jdbc:postgresql://localhost:5432/hotdesking_db
DB_USER=your_user
DB_PASS=your_password

GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

app.jwtSecret=your_secret_key
app.jwtExpirationInMs=86400000
```

### 3. Chạy hạ tầng (PostgreSQL & Redis)

Sử dụng Docker Compose để khởi chạy Database và Cache:

```bash
docker-compose up -d
```

### 4. Chạy ứng dụng

```bash
mvn clean spring-boot:run
```

---

## 📖 API Documentation

Sau khi ứng dụng khởi chạy, bạn có thể truy cập tài liệu API tại:
👉 [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 📅 Lộ trình phát triển (Roadmap)

- [x] Hoàn thiện Core API cho đặt chỗ.
- [x] Tích hợp Distributed Lock với Redis.
- [ ] Xây dựng hệ thống Check-in qua QR Code & Auto-release.
- [ ] Áp dụng các Business Rules (Quota, Team Priority, Max Days).
- [ ] Dashboard thống kê (Occupancy Rate, No-show reports) cho Admin.
- [ ] Tích hợp Push Notification (Websocket/Firebase).
- [ ] Triển khai Interactive Floor Map (Frontend Integration).

---
