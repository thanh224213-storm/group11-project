import React, { useState } from "react";
import axios from "axios";

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🧠 Kiểm tra hợp lệ
    if (!name.trim()) {
      alert("⚠️ Tên không được để trống!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("⚠️ Email không hợp lệ!");
      return;
    }

    try {
      // ⚙️ Gửi request POST
      await axios.post("http://192.168.69.229:5000/users", { name, email });

      // ✅ Reset form + cập nhật danh sách
      setName("");
      setEmail("");
      if (onUserAdded) onUserAdded();

      alert("✅ Thêm người dùng thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi thêm user:", error);
      alert("Không thể thêm user. Kiểm tra lại backend!");
    }
  };

  return (
    <div style={styles.container}>
      <h3>Thêm người dùng</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Nhập tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          ➕ Thêm
        </button>
      </form>
    </div>
  );
};

// 💅 Style nội bộ (inline CSS)
const styles = {
  container: {
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    width: "300px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #aaa",
  },
  button: {
    padding: "7px",
    borderRadius: "5px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default AddUser;