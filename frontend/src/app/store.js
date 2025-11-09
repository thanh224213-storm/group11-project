import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Import reducer từ slice

export const store = configureStore({
  reducer: {
    // 'auth' là tên của state trong Redux
    auth: authReducer, 
    // (Bạn có thể thêm các reducer khác ở đây, vd: product: productReducer)
  },
});