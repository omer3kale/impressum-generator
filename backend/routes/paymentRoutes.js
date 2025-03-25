import express from "express";
import { processPayment, resendDownloadLink } from "../controllers/paymentController.js";

const router = express.Router();

// Route to process a payment
router.post("/process", processPayment);

// Route to resend an expiring download link
router.post("/resend-download", resendDownloadLink);

export default router;