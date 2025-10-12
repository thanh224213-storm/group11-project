import React, { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleUserAdded = () => {
    // Đảo trạng thái để trigger reload danh sách
    setRefresh(!refresh);
  };

  return (
    <div>
      <h2>Quản lý người dùng</h2>
      <AddUser onUserAdded={handleUserAdded} />
      <UserList key={refresh} /> {/* key đổi -> tự render lại */}
    </div>
  );
}

export default App;
