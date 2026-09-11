import express from "express"
import { generateSessionController, joinSessionController, verifySessionController } from "./session.controller.js";
import limiter from "../../../config/rateLimit.js";

const router = express.Router();

// GENERATE SESSION CODE
router.post('/', limiter, generateSessionController );
router.get('/:code', limiter, verifySessionController)
router.post('/:code/join', limiter, joinSessionController)

export default router;
