import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Lấy token và user từ localStorage (nếu có) khi load ứng dụng
const token = localStorage.getItem('accessToken');
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user || null,
  token: token || null,
  isLoading: false,
  error: null,
};

// (SV2) TẠO THUNK GỌI API LOGIN
// createAsyncThunk sẽ tự động tạo các action types (pending, fulfilled, rejected)
export const loginUser = createAsyncThunk(
  'auth/loginUser', // Tên action
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Gọi API login
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // LƯU Ý: Backend của bạn phải trả về { user, accessToken, refreshToken }
      // Giả sử backend trả về accessToken và refreshToken
      // Chúng ta sẽ cần gọi thêm API /profile để lấy info user
      
      const { accessToken, refreshToken } = response.data;

      // Lưu token vào localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Gọi API /profile để lấy user info
      const profileRes = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${accessToken}` }
      });

      // Lưu user info vào localStorage
      localStorage.setItem('user', JSON.stringify(profileRes.data));

      // Return dữ liệu cho 'fulfilled'
      return { user: profileRes.data, token: accessToken };

    } catch (err) {
      // Dùng rejectWithValue để trả về lỗi một cách chuẩn
      return rejectWithValue(err.response.data.message || 'Đăng nhập thất bại');
    }
  }
);

// TẠO SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  // Reducers đồng bộ (chỉ thay đổi state)
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      // Xóa khỏi localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
  },
  // Reducers bất đồng bộ (gắn với createAsyncThunk)
  extraReducers: (builder) => {
    builder
      // Xử lý khi loginUser đang chạy
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Xử lý khi loginUser thành công
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      // Xử lý khi loginUser thất bại
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Lỗi từ rejectWithValue
        state.user = null;
        state.token = null;
      });
  },
});

// Export các action đồng bộ và reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;