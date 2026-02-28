import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html, attachments, replyTo }) => {
    try {
        // Check for environment variables
        let transporter;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            console.log(`[DEBUG] Attempting to send email via ${process.env.EMAIL_USER}`);
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        } else {
            console.log('⚠️ Gmail credentials missing. Using Ethereal Email (Test Mode).');
            // Generate test SMTP service account from ethereal.email
            const testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER ? `"SwaadSupplier" <${process.env.EMAIL_USER}>` : '"SwaadSupplier Test" <test@swaadsupplier.com>',
            to,
            subject,
            html,
            attachments,
            replyTo, // Allow vendors to reply directly to the supplier
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: %s', info.messageId);

        // Preview only available when sending through an Ethereal account
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('📬 Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
};

export default sendEmail;
