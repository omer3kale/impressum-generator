import dotenv from "dotenv";
import stripePackage from "stripe";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { storeDownloadLinkWithExpiration, retrieveExpiredDownloadLink } from "../utils/databaseService.js";

dotenv.config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate expiring download link
const generateDownloadLink = (email) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // Link expires in 24 hours
    
    storeDownloadLinkWithExpiration(token, email, expirationTime);
    
    return `${process.env.BASE_URL}/download?token=${token}`;
};

// Process payment
export const processPayment = async (req, res) => {
    try {
        const { amount, currency, paymentMethodId, email } = req.body;
        
        if (!amount || !currency || !paymentMethodId || !email) {
            return res.status(400).json({ success: false, message: "Alle Zahlungsinformationen sind erforderlich." });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true
        });

        // Generate expiring download link
        const downloadLink = generateDownloadLink(email);

        // Send payment confirmation email with download link
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Zahlungsbestätigung - Keys of Gabriel",
            html: `
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333; text-align: center;">Zahlungsbestätigung</h2>
                        <p>Hallo,</p>
                        <p>Ihre Zahlung wurde erfolgreich verarbeitet!</p>
                        <p><strong>Betrag:</strong> ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}</p>
                        <p>Hier ist Ihr Download-Link (gültig für 24 Stunden):</p>
                        <p><a href="${downloadLink}" target="_blank">Jetzt herunterladen</a></p>
                        <p>Falls der Link abläuft, können Sie einen neuen beantragen.</p>
                        <br>
                        <p style="text-align: center; font-size: 14px; color: #666;">Mit freundlichen Grüßen,<br><strong>Keys of Gabriel</strong></p>
                    </div>
                </body>
                </html>
            `
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Fehler beim Senden der Zahlungsbestätigungs-E-Mail:", err);
            } else {
                console.log("Zahlungsbestätigungs-E-Mail gesendet:", info.response);
            }
        });

        res.status(200).json({ success: true, message: "Zahlung erfolgreich! Eine Bestätigung wurde per E-Mail gesendet.", paymentIntent });
    } catch (error) {
        console.error("Fehler bei der Zahlung:", error);
        res.status(500).json({ success: false, message: "Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.", error: error.message });
    }
};

// Re-send expiring download link if requested
export const resendDownloadLink = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "E-Mail-Adresse erforderlich." });
        }

        const expiredLink = await retrieveExpiredDownloadLink(email);

        if (!expiredLink) {
            return res.status(404).json({ success: false, message: "Kein abgelaufener Link gefunden." });
        }

        const newDownloadLink = generateDownloadLink(email);

        // Send new download link via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Neuer Download-Link - Keys of Gabriel",
            html: `
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333; text-align: center;">Ihr neuer Download-Link</h2>
                        <p>Hallo,</p>
                        <p>Hier ist Ihr neuer Download-Link. Bitte beachten Sie, dass er nach 24 Stunden abläuft.</p>
                        <p><a href="${newDownloadLink}" target="_blank">Jetzt herunterladen</a></p>
                        <br>
                        <p style="text-align: center; font-size: 14px; color: #666;">Mit freundlichen Grüßen,<br><strong>Keys of Gabriel</strong></p>
                    </div>
                </body>
                </html>
            `
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Fehler beim Senden des neuen Download-Links:", err);
            } else {
                console.log("Neuer Download-Link gesendet:", info.response);
            }
        });

        res.status(200).json({ success: true, message: "Ein neuer Download-Link wurde per E-Mail gesendet." });
    } catch (error) {
        console.error("Fehler beim erneuten Senden des Download-Links:", error);
        res.status(500).json({ success: false, message: "Fehler beim erneuten Senden des Download-Links.", error: error.message });
    }
};