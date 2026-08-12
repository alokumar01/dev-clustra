import ApiError from '../../../helpers/apiError.js'
import { generateSessionCode } from "../../../helpers/crypto.js";
import Session from './session.model.js';
import Participant from './participants.model.js';
import { generateSessionToken } from '../../../helpers/jwt.js';

// CREATE SESSIION
export const createSession = async () => {
    //get session code
    let sessionCode = generateSessionCode();
    // let existingSession = await Session.findOne({ sessionCode });

    // while(existingSession) {
    //     sessionCode = generateSessionCode();
    //     existingSession = await Session.findOne({ sessionCode });
    // }

    //create session in db
    const session = await Session.create({
        sessionCode,
        status: 'ACTIVE',
        // participantLimit: 100,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hour from now
    })

    return { sessionCode: session.sessionCode };
}

// VERIFY SESSION
export const verifySession = async (code) => {
    const session = await Session.findOne({ sessionCode: code });

    if (!session)
        throw new ApiError(404, "Session not found", "SESSION_NOT_FOUND");

    if (session.status === 'CLOSED')
        throw new ApiError(400, 'Session no longer exists', 'SESSION_CLOSED');

    if (session.expiresAt <= new Date()) {
        throw new ApiError(400, "Session has expired", "SESSION_EXPIRED");
    }

    const participantCount = await Participant.countDocuments({
        sessionId: session._id
    })

    return { participantCount, sessionStatus: session.status, expiresAt: session.expiresAt }
}

// JOIN SESSION
export const joinSession = async (code, name) => {
    const session = await Session.findOne({ sessionCode: code });

    if (!session)
        throw new ApiError(400, "Session not found", "SESSION_NOT_FOUND");

    if (session.status === "CLOSED")
        throw new ApiError(400, "Session is no longer exists", "SESSION_CLOSED");

    if (session.expiresAt <= new Date()) {
        throw new ApiError(400, "Session has expired", "SESSION_EXPIRED");
    }

    const existingParticipant = await Participant.countDocuments({ sessionId: session._id });

    const assignRole = existingParticipant === 0 ? 'HOST' : 'PARTICIPANT';

    const participant = await Participant.create({
        sessionId: session._id,
        displayName: name,
        role: assignRole,
        expiresAt: session.expiresAt
    })

    const token = generateSessionToken(participant._id, session._id, assignRole);

    return { participant, token };
}


