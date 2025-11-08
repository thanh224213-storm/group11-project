// api.js (hoặc file cấu hình API của bạn)
import axios from 'axios';

// Hàm làm mới Access Token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return;

  try {
    const response = await axios.post('http://localhost:5000/api/auth/refresh', { refreshToken });
    localStorage.setItem('accessToken', response.data.accessToken); // Lưu access token mới
  } catch (error) {
    console.error('Không thể làm mới Access Token:', error);
    // Xử lý đăng xuất hoặc các hành động khác nếu làm mới token không thành công
  }
};

// Gọi API với Access Token mới khi có lỗi 401
const apiRequest = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get('http://localhost:5000/protected-endpoint', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await refreshAccessToken(); // Nếu token hết hạn, refresh lại
      return apiRequest(); // Thử lại yêu cầu sau khi làm mới token
    }
    throw error; // Nếu lỗi khác, ném lại lỗi
  }
};

export { apiRequest, refreshAccessToken };
