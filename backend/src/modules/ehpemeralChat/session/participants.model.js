import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://api.dicebear.com/9.x/glass/png"
    },
    role: {
        type: String,
        enum: ['HOST', 'PARTICIPANT'],
        default: 'PARTICIPANT',
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    lastSeenAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

participantSchema.index({ sessionId: 1 });
participantSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Participant', participantSchema);
