import React, { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleUserAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <h2>Quản lý người dùng</h2>
      <AddUser onUserAdded={handleUserAdded} />
      <UserList key={refresh} /> {/* key thay đổi sẽ reload danh sách */}
    </div>
  );
}

export default App;