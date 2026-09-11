import ApiError from "../../../helpers/apiError.js";
import { createSession, joinSession, verifySession } from './session.service.js';
import { FRONTEND_URL } from '../../../config/env.js';

// CREATE SESSION
export const generateSessionController = async (req, res, next) => {
    try {
        const { sessionCode } =  await createSession();

        const url = `${FRONTEND_URL}/session/${sessionCode}`;

        res.status(200).json({
            success: true,
            message: "Session created successfully!",
            data: { sessionCode, url }
        });
    } catch (error) {
        next(error);
    }
}

// VERIFY SESSION
export const verifySessionController = async (req, res, next) => {
    try {
        const { code } = req.params;

        if (!code)
            throw new ApiError(400, "Session token is missing", "SESSION_TOKEN_MISSING");

        const { participantCount, sessionStatus } = await verifySession(code);

        res.status(200).json({
            success: true,
            message: "Session code verfied successfully",
            data: {
                participantCount, sessionStatus
            }
        });
    } catch (error) {
        next(error);
    }
}

// JOIN SESSION
export const joinSessionController = async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name } = req.body;

        if (!code)
            throw new ApiError(400, "Session token is required", "SESSION_CODE_REQUIRED");
        if  (!name)
            throw new ApiError(400, "Name is required", "NAME_REQUIRED");

        const { participant, token } = await joinSession(code, name);

        res.status(201).json({
            success: true,
            message: "Session joined successfully",
            data: {
                user: participant,
                token: token
            }
        })
    } catch (error) {
        next(error);
    }
}
