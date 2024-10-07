import { ENV } from "#config/env.js";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: ENV.SMTP.HOST,
  port: ENV.SMTP.PORT,
  secure: ENV.SMTP.SECURE,
  auth: {
    user: ENV.SMTP.USER,
    pass: ENV.SMTP.PASSWORD,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Ready to send emails");
  })
  .catch(console.error);
