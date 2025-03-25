import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;