import express from "express"
import { generateSessionController, getAllParticipantController, joinSessionController, verifySessionController } from "./session.controller.js";
import limiter from "../../../config/rateLimit.js";
import {sessionAuth} from "./middleware/session.middleware.js";

const router = express.Router();

// GENERATE SESSION CODE
router.post('/', limiter, generateSessionController );
router.get('/:code', limiter, verifySessionController)
router.post('/:code/join', limiter, joinSessionController)
router.get('/:code/participants', sessionAuth, limiter, getAllParticipantController)

export default router;
