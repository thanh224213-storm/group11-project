Dự án này được xây dựng trong Buổi 4 – Thực hành nhóm với mục tiêu giúp sinh viên hiểu và thực hành kết nối toàn bộ quy trình phát triển web fullstack gồm:

Backend: Node.js + Express
Frontend: React
Database: MongoDB (Atlas)
Version Control: Git + GitHub
Ứng dụng cho phép quản lý người dùng (User Management) gồm các chức năng CRUD:
Xem danh sách người dùng
Thêm mới người dùng
Sửa thông tin người dùng
Xóa người dùng

Công nghệ sử dụng
Thành phần	Công nghệ	Ghi chú
Backend	Node.js + Express	Xây dựng REST API
Frontend	React + Axios	Giao diện web kết nối API
Database	MongoDB Atlas	Lưu trữ dữ liệu người dùng
Công cụ	Git, VS Code, Postman	Quản lý code và test API
⚙️ Cách chạy dự án
1️⃣ Clone repository
git clone https://github.com/thanh224213-storm/group11-project
cd group11-project

2️⃣ Cài đặt Backend
cd backend
npm install


Tạo file .env:

PORT=5000

Chạy server:
npm run dev


3️⃣ Cài đặt Frontend
cd ../frontend
npm install
npm start

Frontend sẽ chạy ở http://localhost:5000

🔗 Cấu trúc dự án
project/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── user.js
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserList.jsx
│   │   │   └── AddUser.jsx
│   │   └── App.js
│   └── package.json
│
└── README.md

👥 Phân công công việc
Thành viên	Vai trò	Nhiệm vụ chính
Quách Phú Thành	Backend Developer	Cài đặt Node.js, tạo REST API (GET, POST, PUT, DELETE), kết nối MongoDB
Trương Thành Đô	Frontend Developer	Tạo giao diện React, gọi API bằng Axios, quản lý state & validation
Lê Hải Đăng	Database Engineer	Cấu hình MongoDB Atlas, tạo Model, kiểm thử lưu trữ dữ liệu
🧪 Test & Sản phẩm nộp
Hoạt động	Sản phẩm
Hoạt động 1	Ảnh VS Code + README_<tên>.md mô tả vai trò
Hoạt động 2	File server.js, ảnh cấu trúc backend
Hoạt động 3	Ảnh test API GET/POST bằng Postman
Hoạt động 4	Ảnh giao diện React hiển thị & thêm user
Hoạt động 5	Ảnh dữ liệu MongoDB Atlas
Hoạt động 6	Ảnh giao diện hiển thị dữ liệu từ MongoDB
Hoạt động 7	Ảnh test PUT/DELETE + giao diện có nút Sửa/Xóa
Hoạt động 8	Ảnh giao diện có validation form
Hoạt động 9	Ảnh xung đột merge & squash commit
Hoạt động 10	Link PR merge cuối cùng vào main
🧭 Quy trình làm việc nhóm (Git Workflow)

Mỗi thành viên tạo nhánh riêng:

git checkout -b backend
git push origin backend


(Tương tự cho frontend & database)

Commit và push code theo vai trò.

Tạo Pull Request (PR) trên GitHub để merge vào develop hoặc main.

Khi có xung đột:

Mở file xung đột.

Giữ nội dung cần thiết và commit lại.

Dùng git rebase -i để squash commit trước khi merge.

💬 Ghi chú thêm

Frontend gọi API qua Axios:

axios.get("http://localhost:5000/users");
axios.post("http://localhost:5000/users", newUser);
axios.put(`http://localhost:5000/users/${id}`, updatedUser);
axios.delete(`http://localhost:5000/users/${id}`);


API Backend (ví dụ trong routes/user.js):

router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

Link repo: https://github.com/thanh224213-storm/group11-project
