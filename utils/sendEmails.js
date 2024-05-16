const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT*1,
        secureConnection: true, // Use SSL
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_APP_PASS,
        },
        authMethod: 'LOGIN', // Specify the authentication method
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.to,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;