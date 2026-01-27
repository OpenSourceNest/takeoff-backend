import * as nodemailer from "nodemailer";
import Mail, { Attachment } from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface ISendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
  cc?: string[];
  bcc?: string[];
}

export const SendMail = async ({
  to,
  subject,
  text,
  html,
  attachments,
  cc,
  bcc,
}: ISendMailOptions) => {
  const { MAIL_USERNAME, MAIL_PASSWORD, MAIL_HOST, MAIL_SENDER } = process.env;

  const transporter = nodemailer?.createTransport({
    host: MAIL_HOST,
    port: 465, // or 587 for TLS
    secure: true, // true for 465, false for 587
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  } as SMTPTransport["options"]);

  const mailOptions: Mail["options"] = {
    from: `Team OSN <${MAIL_SENDER || MAIL_USERNAME}>`,
    to,
    subject,
    html,
    text,
    attachments,
    cc,
    bcc,
  };
  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

