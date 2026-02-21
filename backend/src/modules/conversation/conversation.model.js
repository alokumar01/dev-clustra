// this model is build connection between user and message
import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema ({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    type: {
        type: String,
        enum: ["private", "group"],
        default: "private"
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId, // actual message ko pin point karna
        ref: 'Message'
    },
    lastMessageAt: {
        type: Date,
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    }
}, {timestamps: true});

conversationSchema.index({ participants: 1 }); // indexing for faster access 

export default mongoose.model("Conversation", conversationSchema);
