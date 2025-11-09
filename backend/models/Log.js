const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    // Dùng 'user' thay vì 'userId' để dùng ref
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến model 'User'
        required: true
    },
    action: {
        type: String,
        required: true,
        // Ví dụ: 'login_success', 'update_profile', 'upload_avatar'
    },
    timestamp: {
        type: Date,
        default: Date.now // Tự động lấy thời gian hiện tại
    }
});

// Tạo index để truy vấn nhanh hơn
logSchema.index({ user: 1 });
logSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);