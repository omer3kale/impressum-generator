import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send an email
export const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return { success: false, message: "Error sending email", error };
    }
};

// Send Booking Confirmation Email
export const sendBookingConfirmation = async (email, date, time) => {
    const subject = "Buchungsbestätigung - Keys of Gabriel";
    const htmlContent = `
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333; text-align: center;">Buchungsbestätigung</h2>
                <p>Hallo,</p>
                <p>Ihre Buchung wurde erfolgreich bestätigt.</p>
                <p><strong>Datum:</strong> ${date}</p>
                <p><strong>Uhrzeit:</strong> ${time}</p>
                <p>Vielen Dank für Ihre Buchung!</p>
                <br>
                <p style="text-align: center; font-size: 14px; color: #666;">Mit freundlichen Grüßen,<br><strong>Keys of Gabriel</strong></p>
            </div>
        </body>
        </html>
    `;

    return await sendEmail(email, subject, htmlContent);
};

// Send Payment Confirmation Email with Download Link
export const sendPaymentConfirmation = async (email, amount, currency, downloadLink) => {
    const subject = "Zahlungsbestätigung - Keys of Gabriel";
    const htmlContent = `
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333; text-align: center;">Zahlungsbestätigung</h2>
                <p>Hallo,</p>
                <p>Ihre Zahlung wurde erfolgreich verarbeitet!</p>
                <p><strong>Betrag:</strong> ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}</p>
                <p>Hier ist Ihr Download-Link (gültig für 24 Stunden):</p>
                <p><a href="${downloadLink}" target="_blank">Jetzt herunterladen</a></p>
                <p>Vielen Dank für Ihre Unterstützung!</p>
                <br>
                <p style="text-align: center; font-size: 14px; color: #666;">Mit freundlichen Grüßen,<br><strong>Keys of Gabriel</strong></p>
            </div>
        </body>
        </html>
    `;

    return await sendEmail(email, subject, htmlContent);
};

// Send Email Verification Link
export const sendVerificationEmail = async (email, verificationLink) => {
    const subject = "E-Mail-Verifizierung - Keys of Gabriel";
    const htmlContent = `
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333; text-align: center;">E-Mail-Verifizierung</h2>
                <p>Hallo,</p>
                <p>Bitte klicken Sie auf den folgenden Link, um Ihre E-Mail-Adresse zu verifizieren:</p>
                <p><a href="${verificationLink}" target="_blank">Jetzt verifizieren</a></p>
                <p>Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie bitte diese E-Mail.</p>
                <br>
                <p style="text-align: center; font-size: 14px; color: #666;">Mit freundlichen Grüßen,<br><strong>Keys of Gabriel</strong></p>
            </div>
        </body>
        </html>
    `;

    return await sendEmail(email, subject, htmlContent);
};

export default transporter;