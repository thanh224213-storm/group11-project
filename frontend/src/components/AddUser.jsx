import React, { useState } from "react";
import axios from "axios";

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await axios.post("http://192.168.69.229:5000/users", { name, email });
      setName("");
      setEmail("");
      alert("Thêm thành công!");
      onUserAdded(); // Gọi lại danh sách
    } catch (error) {
      console.error("Lỗi POST:", error);
      alert("Không thể thêm user (kiểm tra backend)");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Thêm</button>
    </form>
  );
};

export default AddUser;