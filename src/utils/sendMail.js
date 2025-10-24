import nodemailer from "nodemailer";
import { getEnvVar } from './getEnvVar.js';

const transport = nodemailer.createTransport({
    host: getEnvVar("SMTP_HOST"),
    port: getEnvVar("SMTP_PORT"),
    secure: false,
    auth: {
        user: getEnvVar("SMTP_USER"),
        pass: getEnvVar("SMTP_PASSWORD")
    }
});

export async function sendMail(mail) { 
    mail.from = "art6000.7m@gmail.com";

    await transport.sendMail(mail);
}