import { FRONTEND_URL } from "../../../config/env.js";
import ApiError from "../../../helpers/apiError.js";
import {
    createSession,
    getAllParticipant,
    joinSession,
    verifySession,
} from "./session.service.js";

// CREATE SESSION
export const generateSessionController = async (req, res, next) => {
  try {
    const { sessionCode } = await createSession();

    const url = `${FRONTEND_URL}/session/${sessionCode}`;

    res.status(200).json({
      success: true,
      message: "Session created successfully!",
      data: { sessionCode, url },
    });
  } catch (error) {
    next(error);
  }
};

// VERIFY SESSION
export const verifySessionController = async (req, res, next) => {
  try {
    const { code } = req.params;

    if (!code)
      throw new ApiError(
        400,
        "Session token is missing",
        "SESSION_TOKEN_MISSING",
      );

    const { participantCount, sessionStatus } = await verifySession(code);

    res.status(200).json({
      success: true,
      message: "Session code verfied successfully",
      data: {
        participantCount,
        sessionStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// JOIN SESSION
export const joinSessionController = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name } = req.body;

    if (!code)
      throw new ApiError(
        400,
        "Session Code is required",
        "SESSION_CODE_REQUIRED",
      );
    if (typeof name !== "string" || !name.trim())
      throw new ApiError(400, "Name is required", "NAME_REQUIRED");
    if (name.trim().length > 80)
      throw new ApiError(400, "Name cannot exceed 80 characters", "NAME_TOO_LONG");

    const { participant, token } = await joinSession(code, name.trim());

    res.status(201).json({
      success: true,
      message: "Session joined successfully",
      data: {
        user: participant,
        token: token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// CLOSE THE SESSION ALLOWED BY HOST ONLY
// CHOOSE HTTP MIDDLWARE Vs SOCKET MIDDLEWARE EVENT DIRECT TO CLOSE THE SESSION


// GET ALL PARTICIPANT LIST
export const getAllParticipantController = async (req, res, next) => {
  try {
    const { code } = req.params;
    const participantId = req.participant.participantId;

    if (!code)
      throw new ApiError(
        400,
        "Session Code is required",
        "SESSION_CODE_REQUIRED",
      );

    if (!participantId)
      throw new ApiError(
        400,
        "Participant id is not found.",
        "PARTITICPANT_NOT_FOUND",
      );

    const { participants, countParticipant } = await getAllParticipant(code, participantId);

    res.status(200).json({
      success: true,
      message: "List of All participant.",
      data: {
        count: countParticipant,
        participants,
      },
    });
  } catch (error) {
    next(error);
  }
};
