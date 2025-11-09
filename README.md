Group 11 Project (group11-project)
Ứng dụng quản lý người dùng MERN stack đầy đủ, bao gồm xác thực, phân quyền, và các tính năng nâng cao.

Backend: Node.js + Express + Mongoose

Frontend: React + Redux Toolkit + Axios

Database: MongoDB Atlas

1. Chuẩn bị
Cài đặt Node.js LTS và Git.

Tạo cluster MongoDB Atlas, lấy chuỗi kết nối (connection string).

Tạo tài khoản Cloudinary (lấy Cloud Name, API Key, API Secret).

Tạo tài khoản dịch vụ Email (ví dụ: Brevo, SendGrid, hoặc Gmail App Password) để lấy API Key/Password.

2. Chạy Backend
Mở terminal, đi đến thư mục backend:

Bash

cd backend
Cài đặt các gói:

Bash

npm install
Tạo file .env ở thư mục backend và điền các biến:

Đoạn mã

# Database MongoDB
MONGODB_URI=<chuỗi-kết-nối-MongoDB-Atlas-của-bạn>

# Server Port (Backend chạy ở cổng 5000)
PORT=5000

# JWT Secrets
ACCESS_TOKEN_SECRET=<chuỗi-bí-mật-cho-access-token>
REFRESH_TOKEN_SECRET=<chuỗi-bí-mật-cho-refresh-token>

# Email Service (Chọn MỘT trong các cách)

# Cách 1: Dùng Brevo (Giống bạn đã làm)
BREVO_API_KEY=<key-v3-của-brevo>
BREVO_SENDER_EMAIL=<email-đã-xác-thực-trên-brevo>

# Cách 2: Dùng Gmail (Nếu có App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<gmail-dùng-gửi-mail>
EMAIL_PASSWORD=<app-password-16-ký-tự-của-gmail>

# Cloudinary (Upload Avatar)
CLOUDINARY_CLOUD_NAME=<tên-cloud-của-bạn>
CLOUDINARY_API_KEY=<api-key-của-bạn>
CLOUDINARY_API_SECRET=<api-secret-của-bạn>
Khởi động server:

Bash

npm start
Server sẽ lắng nghe tại http://localhost:5000.

3. Chạy Frontend
Mở một terminal mới, đi đến thư mục frontend:

Bash

cd frontend
Cài đặt các gói:

Bash

npm install
(Không bắt buộc, nhưng nên có) Tạo file .env ở thư mục frontend:

Đoạn mã

# Trỏ đến địa chỉ server backend (đang chạy ở cổng 5000)
REACT_APP_API_URL=http://localhost:5000

# Đặt port cho React (Frontend chạy ở cổng 3000)
PORT=3000
Khởi động ứng dụng:

Bash

npm start
Ứng dụng sẽ tự động mở tại http://localhost:3000.

4. Tính năng chính
Đăng ký / Đăng nhập (JWT & Refresh Token).

Quản lý State tập trung (Redux Toolkit).

Bảo vệ Route (Protected Routes) cho /profile, /admin.

Quên mật khẩu qua email (Dùng Brevo/Nodemailer).

Upload Avatar (Lên Cloudinary).

Ghi log hoạt động của user (Xem ở trang Admin).

Giới hạn đăng nhập (Rate Limiting) chống brute force.

Phân quyền (Admin có thể xem/xóa user, xem logs).

5. Deploy (Tùy chọn)
Backend: Deploy lên Render hoặc Railway.

Trỏ đến thư mục backend.

Đặt các biến môi trường (Environment Variables) giống hệt file .env ở Bước 2.

Frontend: Deploy lên Vercel hoặc Netlify.

Trỏ đến thư mục frontend.

Thêm biến môi trường REACT_APP_API_URL trỏ tới URL của backend (sau khi đã deploy).

Database: Sử dụng MONGO_URI của MongoDB Atlas cho cả môi trường local và deploy.
