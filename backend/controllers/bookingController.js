import Booking from "../models/bookingModel.js";
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

// Fetch available times
export const getAvailableTimes = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ success: false, message: "Datum erforderlich." });
        }

        // Dummy available times (this should be fetched dynamically)
        const availableTimes = ["10:00", "11:00", "14:00", "16:00", "18:00"];
        res.status(200).json({ success: true, times: availableTimes });
    } catch (error) {
        console.error("Fehler beim Abrufen der Zeiten:", error);
        res.status(500).json({ success: false, message: "Serverfehler." });
    }
};

// Create a booking
export const createBooking = async (req, res) => {
    try {
        const { email, date, time } = req.body;
        if (!email || !date || !time) {
            return res.status(400).json({ success: false, message: "Alle Felder sind erforderlich." });
        }

        const newBooking = new Booking({ email, date, time });
        await newBooking.save();

        // Send confirmation email with HTML formatting
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Buchungsbestätigung",
            html: `
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333; text-align: center;">Buchungsbestätigung</h2>
                        <p>Hallo,</p>
                        <p>Ihre Buchung wurde erfolgreich bestätigt!</p>
                        <p><strong>Datum:</strong> ${date}</p>
                        <p><strong>Zeit:</strong> ${time}</p>
                        <p>Vielen Dank für Ihre Buchung!</p>
                        <br>
                        <p style="text-align: center; font-size: 14px; color: #666;">Mit freundlichen Grüßen,<br><strong>Keys of Gabriel</strong></p>
                    </div>
                </body>
                </html>
            `
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Fehler beim Senden der Bestätigungs-E-Mail:", err);
            } else {
                console.log("Bestätigungs-E-Mail gesendet:", info.response);
            }
        });

        res.status(201).json({ success: true, message: "Buchung erfolgreich! Eine Bestätigung wurde per E-Mail gesendet." });
    } catch (error) {
        console.error("Fehler beim Erstellen der Buchung:", error);
        res.status(500).json({ success: false, message: "Serverfehler." });
    }
};