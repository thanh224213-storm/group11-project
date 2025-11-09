const Log = require('../models/Log');

/**
 * Ghi lại hoạt động của người dùng vào database.
 * @param {String} userId - ID của người dùng
 * @param {String} action - Mô tả hành động (vd: 'login_success')
 */
const logActivity = async (userId, action) => {
    try {
        const newLog = new Log({
            user: userId,
            action: action,
            // 'timestamp' sẽ được tự động thêm vào
        });
        await newLog.save();
    } catch (error) {
        // Lỗi ghi log không nên làm crash server
        // Chỉ ghi ra console để biết
        console.error('Lỗi khi ghi log hoạt động:', error.message);
    }
};

module.exports = logActivity;