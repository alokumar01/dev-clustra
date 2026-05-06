// this model is the user's actual message content
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messageType: {
        type: String,
        enum: ["text", "image", "link", "code"],
        default: "text"
    },
    content: {
        type: String,
        required: true,    
    },
    deliveredAt: {
        type: Date,
        required: null
    },
    readAt: {
        type: Date,
    }

}, {timestamps: true});

//indexing is must here for faster retrival of message 
messageSchema.index({ conversationId: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);