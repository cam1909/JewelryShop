# 💎 VELMORA - Dịch Vụ Mua Sắm Trang Sức Trực Tuyến Đẳng Cấp 💎

Chào mừng bạn đến với **VELMORA Jewelry House**, ứng dụng mua sắm trang sức trực tuyến được thiết kế để mang lại trải nghiệm mua sắm tinh tế, tiện lợi và đẳng cấp ngay trên thiết bị di động của bạn. Dự án này là nền tảng thương mại điện tử hoàn chỉnh, tích hợp hệ thống thanh toán tự động thông minh.

![Velmora Preview](https://img.shields.io/badge/React%20Native-Expo-blue?logo=react) ![NodeJS](https://img.shields.io/badge/Node.js-Express-success?logo=nodedotjs) ![MySQL](https://img.shields.io/badge/MySQL-Sequelize-orange?logo=mysql) ![Firebase](https://img.shields.io/badge/Firebase-Auth-yellow?logo=firebase) ![PayOS](https://img.shields.io/badge/Payment-PayOS-green)

---

## ✨ Các Tính Năng Nổi Bật

- **Giao Diện Hiện Đại & Sang Trọng**: Thiết kế Dark Mode tối giản, sử dụng hoạt ảnh mượt mà, tập trung vào việc tôn vinh vẻ đẹp của trang sức.
- **Tài Khoản & Bảo Mật**: Kiểm soát người dùng hoàn toàn bằng Firebase Auth. Hỗ trợ **Khôi phục mật khẩu thông minh** qua gửi liên kết về hộp thư email.
- **Quản Lý Bằng Giỏ Hàng**: Chỉnh sửa số lượng, giá tiền, kích thước trang sức linh hoạt.
- **Tích Hợp Thanh Toán PayOS Tự Động**: 
  - Khởi tạo Link thanh toán PayOS in-app ngay lập tức.
  - Sử dụng Webhook để **đối soát giao dịch tự động 100%**. Tiền chuyển khoản tự động "Gạch nợ" và cập nhật thông báo về thiết bị khách hàng ngay tại thời gian thực (Real-time).
- **Hệ Thống Đơn Hàng Hoàn Thiện**: Quản trị 3 trạng thái lớn (Chờ thanh toán, Đang vận chuyển, Hoàn thành), cùng với lịch sử mua hàng, chi tiết đơn và tính năng Bơm đánh giá sản phẩm.

---

## 🚀 Kiến Trúc & Công Nghệ Sử Dụng

1. **Frontend (Mobile App)**
   - **Framework**: React Native & Expo Router
   - **Ngôn Ngữ**: TypeScript
   - **Trạng Thái & Giao Diện**: Context API, Expo WebBrowser, StyleSheet.
2. **Backend (Server & Webhook)**
   - **Môi Trường**: Node.js & Express.js
   - **Database**: MySQL với công cụ ORM Sequelize
   - **Webhook**: smee.io (cho phép bypass Localhost Webhook API)
3. **Third-party Services**
   - **Firebase Authentication**: Đăng ký, đăng nhập & Khôi phục mật khẩu.
   - **PayOS**: Cổng dịch vụ Thanh toán VietQR Động hiện đại.

---

## 🛠️ Hướng Dẫn Cài Đặt Khởi Chạy (Local)

Để chạy trọn vẹn dự án này trong môi trường Localhost, hãy làm theo tuần tự các bước dưới đây để kết nối CSDL và App.

### BƯỚC 1: Xây Dựng Cơ Sở Dữ Liệu MySQL

1. Cài đặt và khởi chạy bảng điều khiển **XAMPP** (Bật Apache & MySQL).
2. Truy cập `http://localhost/phpmyadmin` và tạo một Database mới có tên: `jewelry_shop`
3. Tìm file CSDL gốc của dự án được nén sẵn tại địa chỉ: `backend/database.sql`
4. Ấn **Import**, chọn file kia để nạp toàn bộ Dữ liệu 24 Sản phẩm, 6 Bộ sưu tập và Bảng cấu trúc Data.
5. Server sẽ tự động móc tới cơ sở dữ liệu `root` không mật khẩu này!

### BƯỚC 2: Khởi Khảo Backend Server & Webhook

1. Mở Terminal mới, trỏ đường dẫn tới thư mục Backend:
   ```bash
   cd backend
   ```
2. Cài đặt thư viện Node:
   ```bash
   npm install
   ```
3. Chạy Server Backend (Mặc định ở `http://localhost:3001`):
   ```bash
   node server.js
   ```

### BƯỚC 3: Cấu Hình Webhook Cho Thanh Toán PayOS (Dành cho Admin)

1. Để máy chủ của bạn nhận thông báo Ting Ting từ cổng VietQR tự động, hãy mở thêm một cửa sổ Terminal (giữ Backend vẫn chạy).
2. Chạy lệnh tạo cầu nối Webhook SMEE xuyên qua Localhost:
   ```bash
   npx smee-client -u https://smee.io/velmora_payos_webhook -t http://localhost:3001/api/payos/webhook
   ```
3. Copy đường link `https://smee.io/velmora_payos_webhook` dán vào phần cài đặt Webhook URL ở trang quản trị PayOS của bạn.

### BƯỚC 4: Chạy Frontend App

1. Mở một cửa sổ Terminal mới, chuyển hướng vào thư mục Front-end:
   ```bash
   cd myApp
   ```
2. Cài đặt package của React-Native:
   ```bash
   npm install
   ```
3. Khởi xướng máy chủ Expo:
   ```bash
   npx expo start -c
   ```
4. Mở ứng dụng **Expo Go** trên thiết bị thật, quét mã QR hiển thị ở Terminal để trải nghiệm toàn bộ sức mạnh của dự án! (Lưu ý điện thoại và máy tính cần kết nối chung 1 mạng Wifi).

---

## 👥 Đội Ngũ Phát Triển

Dự án được lên ý tưởng và hiện thực hóa bởi nhóm sinh viên tài năng và nhiệt huyết:

| STT | Họ và Tên             | MSSV            |
|:---:|-----------------------|-----------------|
| 1   | **Trần Quỳnh Anh**    | `23810310147`   |
| 2   | **Lê Minh Quân**      | `23810310115`   |
| 3   | **Trần Minh Nguyệt**  | `23810310081`   |

---
🤍 Xin chân thành cảm ơn bạn đã ghé thăm dự án **VELMORA**. Chúc bạn có một phiên bản triển khai mượt mà và tận hưởng công nghệ!
