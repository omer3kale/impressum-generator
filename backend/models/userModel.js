import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpires: {
        type: Date
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare hashed passwords for authentication
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate email verification token
userSchema.methods.generateVerificationToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.verificationToken = token;
    this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24-hour expiration
    return token;
};

const User = mongoose.model("User", userSchema);

export default User;