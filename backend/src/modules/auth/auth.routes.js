import express from "express"
import { signupController } from "./auth.controller.js"

const router = express.Router();

router.post("/signup", signupController);


export default router;






//FOR LEARNING PURPOSE

// POST /api/v1/auth/signup
//  ↓
// app.js
//  ↓
// v1.routes.js
//  ↓
// auth.routes.js
//  ↓
// auth.controller.js
//  ↓
// auth.service.js
//  ↓
// User model (DB)
//  ↑
// Response / ApiError
//  ↑
// Error middleware (if error)

// aisa flow mujche ache se batwo just 