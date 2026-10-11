import ApiError from "../../helpers/apiError.js";
import { generateInviteService, verifyInviteService, acceptInviteService } from "./invite.service.js";
import { FRONTEND_LIVE_URL, FRONTEND_URL, NODE_ENV } from "../../config/env.js";

// Generate invite link token,
export const generateInviteController = async (req, res, next) => {

    try {
        const { inviteToken } = await generateInviteService({
            userId: req.user._id,
        });

        let url;

        if (NODE_ENV === "production") {
            url = FRONTEND_LIVE_URL;
        } else {
            url = FRONTEND_URL;
        }

        const fullUrl = `${url}/invite/${inviteToken}`;

        res.status(200).json({
            success: true,
            message: "Invite url generated successfully!",
            data: {
                inviteToken,
                fullUrl,
            },
        });

    } catch (error) {
        next(error);
    }
};
export const verifyInviteController = async (req, res, next) => {
    try {

        const { token } = req.params;
        if (!token) {
            throw new ApiError(400, "Invite token missing", "INVITE_TOKEN_MISSING")
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

        const { conversation }  = await acceptInviteService({ token, userId });

        res.status(200).json({
            success: true,
            message: "Invitation accepted successfully!",
            conversationId: conversation._id
        })

    } catch (error) {
        next(error);
    }
}
