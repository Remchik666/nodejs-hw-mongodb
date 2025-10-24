import nodemailer from "nodemailer";
import { getEnvVar } from './getEnvVar.js';

const transporter = nodemailer.createTransport({
    host: getEnvVar("SMTP_HOST"),
    port: getEnvVar("SMTP_PORT"),
    secure: false,
    auth: {
        user: getEnvVar("SMTP_USER"),
        pass: getEnvVar("SMTP_PASSWORD")
    }
});

export async function sendEmail(options) { 
    return await transporter.sendMail(options);
}