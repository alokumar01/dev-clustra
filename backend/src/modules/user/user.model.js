// user model means who the user is
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength:5,
        maxlength: 15,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        default: "user",
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    accountStatus: {
        type: String,
        default: "active",
        enum: ["active", "blocked"],
    },  
}, {timestamps: true});

export default mongoose.model("User", userSchema);