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

// CLOSE SESSION VIA SOCKET EVENT NOT WITH HTTP STATE
export const closeSessionService = async (participantId, sessionId, role) => {
    const session = await Session.findById(sessionId);

    if (!session)
        throw new ApiError(400, "Session not found", "SESSION_NOT_FOUND");

    if (session.status === "CLOSED")
        throw new ApiError(400, "Session is no longer exists", "SESSION_CLOSED");

    if (session.expiresAt <= new Date()) {
        throw new ApiError(400, "Session has expired", "SESSION_EXPIRED");
    }

    const participant = await Participant.findById(participantId);
    if (!participant)
        throw new ApiError(400, "Participant not found.", "PARTICIPANT_NOT_FOUND.")

    if (participant.role !== role) {
        throw new ApiError(400, "Seesion only closed via host only.", "SESSION_CLOSED_ACCESS_DENIED");
    }

    session.status = "CLOSED";

    await session.save();

    return {
        success: true
    }
};

// RETURN THE PARTICIANT DETAILS WHO JOINED THE EVENT -> FOR UPDATE IN CHAT AND IN PARTICIAPNT LIST AUTO
export const newJoinParticipantService = async (participantId) => {
    const participant = await Participant.findById(participantId, {
        displayName: 1,
        role: 1,
    });

    if (!participant)
        throw new ApiError(400, "Participant not found.", "PARTICIPANT_NOT_FOUND");

    // const participantName = participant.displayName;

    return {
        success: true,
        participant
    }
}

// GET LIST OF ALL PARTICIPANTS IN A SESSION
export const getAllParticipant = async (code, participantId) => {
    if (!code)
        throw new ApiError(401, "Session code not found.", "SESSION_CODE_NOT_FOUND");

    if (!participantId)
        throw new ApiError(401, "Participant Not found", "PARTICIPANT_DETAILS_NOT_FOUND");

    const session = await Session.findOne({
        sessionCode:  code
    })

    if (!session)
        throw new ApiError(404, "Session does not exist.", "SESSION_NOT_FOUND");

    const participant = await Participant.findById(participantId);

    if (!participant)
        throw new ApiError(404, "Participant not found", "PARTICIAPNT_NOT_FOUND");

    if (participant.sessionId.toString() !== session._id.toString()) {
      throw new ApiError(
        403,
        "Participant does not belong to this session",
        "PARTICIPANT_SESSION_MISMATCH",
      );
    }

    const participants = await Participant.find(
        { sessionId: session._id },
        {
            displayName: 1,
            role: 1,
        }
    );

    const countParticipant = participants.length;

    return {participants, countParticipant }
}
