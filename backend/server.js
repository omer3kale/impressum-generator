import dotenv from "dotenv";
dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

import express from "express";
import connectDB from "./config/database.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// Connect to MongoDB Atlas
connectDB();

app.use(express.json());
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
