import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendWelcomeEmail = async (to: string, name: string) => {
    try {
        const info = await transporter.sendMail({
            from: '"Takeoff" <no-reply@takeoff.com>', // sender address
            to, // list of receivers
            subject: "Welcome to Takeoff Event!", // Subject line
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for registering for the Takeoff event.</p>
          <p>We are excited to see you there.</p>
          <br>
          <p>Best regards,</p>
          <p>The Takeoff Team</p>
        </div>
      `,
        });
        console.log("Welcome email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return null;
    }
};
