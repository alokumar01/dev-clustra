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
        default: "https://api.dicebear.com/9.x/glass/png" 
    },
    avatarPublicId: { 
        type: String, 
        default: null 
    },
    bio: {
        type: String,
        trim: true,
        default: "",
        maxLength: [160, "Bio can not be more than 160 characters"]
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
        enum: ["active", "suspended", "blocked"],
    },
    suspendedUntil: {
        type: Date,
        default: null
    },
    statusReason: {
        type: String,
        default: ""
    },
    emailVerifyHash: {
        type: String,
        default: null
    },
    emailVerifyExpires: {
        type: Date,
        default: null,
    },
    refreshToken: [
        {
            token: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    forgotPasswordHash: {
        type: String,
        default: null
    },
    forgotPasswordExpires: {
        type: Date,
        default: null,
    },
    lastUsernameChange: {
        type: Date,
        default: Date.now // new user will wait for 14 days 
    }

}, {timestamps: true});

//index
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });
userSchema.index({ accountStatus: 1 });
userSchema.index({ emailVerifyHash: 1 });

export default mongoose.model("User", userSchema);