import { getIO } from "../../socket.server.js";
import ApiError from "../../helpers/apiError.js";
import { generateInviteService, verifyInviteService, acceptInviteService } from "./invite.service.js";
import { FRONTEND_URL } from "../../config/env.js";

// Generate invite link token,
export const generateInviteController = async (req, res, next) => {
    try {

        const { inviteToken } = await generateInviteService({
            userId: req.user._id,
        })

        //generate full url
        const fullUrl = `${FRONTEND_URL}/invite/${inviteToken}`

        res.status(200).json({
            success: true,
            message: "Invite url token generated successfully!",
            data: {
                inviteToken,
                fullUrl
            }
        })

    } catch (error) {
        next(error);
    }
}

export const verifyInviteController = async (req, res, next) => {
    try {

        const { token } = req.params;
        // const userId = req.user._id;
        if (!token) {
            throw new ApiError(400, "Invite token missng", "INVITE_TOKEN_MISSING")
        }

        const { user } = await verifyInviteService({ token });

        res.status(200).json({
            success: true,
            message: "Link verification successfull!",
            data: user
        });

    } catch (error) {
        next(error);
    }
}

export const acceptInviteController = async (req, res, next) => {
    try {

        const { token } = req.params;
        const userId = req.user._id;

        const { conversation, inviter }  = await acceptInviteService({ token, userId });

            // Socker event for inviter, inform to inviter that someone accepte your invitation
            // const io =  getIO();
            // io.to(`user:${inviter.toString()}`).emit("new_conversation", conversation);

        res.status(200).json({
            success: true,
            message: "Invitation accepted successfully!",
            conversationId: conversation._id
        })

    } catch (error) {
        next(error);
    }
}

