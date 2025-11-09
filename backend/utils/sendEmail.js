const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Cấu hình API key
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const sender = {
    email: process.env.BREVO_SENDER_EMAIL,
    name: 'Group 11 Project'
};

const sendEmail = async (options) => {
    try {
        await apiInstance.sendTransacEmail({
            sender: sender,
            to: [{ email: options.email }],
            subject: options.subject,
            htmlContent: options.html,
        });
        console.log('Email đã được gửi thành công qua Brevo.');
    } catch (error) {
        console.error('Lỗi khi gửi email (Brevo):', error);
        throw new Error('Không thể gửi email');
    }
};

module.exports = sendEmail;