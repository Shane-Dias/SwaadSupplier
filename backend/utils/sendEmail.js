import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html, attachments }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use other services like SendGrid, Outlook, etc.
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"SwaadSupplier" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
};

export default sendEmail;
