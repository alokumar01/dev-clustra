import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    sessionCode: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'CLOSED'],
        default: 'ACTIVE',
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0, // ttl index
    },
    lastActiveAt: {
        type: Date,
        default: Date.now,
    },
}, {timestamps: true} );

sessionSchema.index({ sessionCode: 1 }, { unique: true });
export default mongoose.model('Session', sessionSchema);
