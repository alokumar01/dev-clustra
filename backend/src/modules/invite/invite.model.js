// Invite model
// model schema for invite
//  mongo id
// token
// inviterId
// status
// expiredAt; ttl

// createdAt
// updatedAt

import mongoose from "mongoose"

const inviteSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
    inviterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inviteStatus: {
        type: String,
        enum: ["pending", "accepted", "expired"],
        default: "pending"
    },
    //
    expiredAt: {
        type: Date,
        required: true,
        expires: 0, // ttl index
    }

}, {timestamps: true});


export default mongoose.model("Invite", inviteSchema);
