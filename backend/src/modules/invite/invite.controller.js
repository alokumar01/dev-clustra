import ApiError from "../../helpers/apiError.js";
import { generateInviteService, verifyInviteService, acceptInviteService } from "./invite.service.js";

// Generate invite link token,
export const generateInviteController = async (req, res, next) => {
    try {

        const { token } = await generateInviteService({
            userId: req.user._id,
        })

        res.status(200).json({
            success: true,
            message: "Invite token generated successfully!",
            data: token
        })

    } catch (error) {
        next(error);
    }
}

export const verifyInviteController = async (req, res, next) => {
    try {

        const { token } = req.params;
        const userId = req.user._id;

        const result = await verifyInviteService({ token, userId });

        res.status(200).json({
            success: true,
            message: "Token verification successfull!"
        });

    } catch (error) {
        next(error);
    }
}

export const acceptInviteController = async (req, res, next) => {
    try {



    } catch (error) {
        next(error);
    }
}

