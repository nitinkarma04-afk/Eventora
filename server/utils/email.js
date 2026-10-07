const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Eventora.</p>
      `
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to', userEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        let title = 'Verify your Eventora Account';
        let msg = 'Please use the following OTP to verify your new Eventora account.';

        if (type === 'password_reset') {
            title = 'Reset your Eventora Password';
            msg = 'We received a request to reset your Eventora account password. Use the verification code below to set a new password.';
        } else if (type === 'event_booking') {
            title = 'Eventora Booking Verification';
            msg = 'Please use the following OTP to verify and confirm your event booking.';
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 30px; background: #070A12; color: #ffffff; border-radius: 16px; max-width: 500px; margin: 0 auto;">
                    <div style="margin-bottom: 20px;">
                        <span style="font-size: 24px; font-weight: 900; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; color: #60a5fa; letter-spacing: -0.5px;">Eventora</span>
                    </div>
                    <h2 style="color: #ffffff; margin-bottom: 10px; font-size: 20px;">${title}</h2>
                    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">${msg}</p>
                    <div style="margin: 24px auto; padding: 16px 28px; font-size: 28px; font-weight: 800; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); width: max-content; letter-spacing: 6px; border-radius: 12px; color: #38bdf8;">
                        ${otp}
                    </div>
                    <p style="color: #64748b; font-size: 12px; margin-top: 24px;">This code expires in 5 minutes. If you did not request this, you can safely ignore this email.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };
