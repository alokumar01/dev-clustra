import { getIO } from "../../socket.server.js";
import ApiError from "../../helpers/apiError.js";
import { generateInviteService, verifyInviteService, acceptInviteService } from "./invite.service.js";
import { FRONTEND_LIVE_URL, FRONTEND_URL, NODE_ENV } from "../../config/env.js";

// Generate invite link token,
export const generateInviteController = async (req, res, next) => {
    console.log("========== GENERATE INVITE ==========");
    console.log("1. Controller entered");

    try {
        console.log("2. User ID:", req.user?._id);

        console.log("3. Calling service...");

        const { inviteToken } = await generateInviteService({
            userId: req.user._id,
        });

        console.log("4. Service completed");
        console.log("5. Invite Token:", inviteToken);

        let url;

        if (NODE_ENV === "production") {
            url = FRONTEND_LIVE_URL;
        } else {
            url = FRONTEND_URL;
        }

        console.log("6. Frontend URL:", url);

        const fullUrl = `${url}/invite/${inviteToken}`;

        console.log("7. Full URL:", fullUrl);

        console.log("8. Sending response");

        res.status(200).json({
            success: true,
            message: "Invite url token generated successfully!",
            data: {
                inviteToken,
                fullUrl,
            },
        });

        console.log("9. Response sent");
    } catch (error) {
        console.error("XXXXXXXX CONTROLLER ERROR XXXXXXXX");
        console.error(error);
        console.error(error.stack);
        next(error);
    }
};
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

