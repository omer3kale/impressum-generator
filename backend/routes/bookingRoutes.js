import express from "express";
import { fetchAvailableTimes, createBooking, confirmBooking } from "../controllers/bookingController.js";

const router = express.Router();

// Route to fetch available booking times
router.get("/available-times", fetchAvailableTimes);

// Route to create a new booking
router.post("/book", createBooking);

// Route to confirm a booking (admin approval)
router.post("/confirm", confirmBooking);

export default router; // ✅ Ensure it uses default export
