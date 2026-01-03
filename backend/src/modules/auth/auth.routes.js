import express from "express"
import { changePasswordController, forgotPasswordController, loginController, logoutController, refreshAccessTokenController, resendVerificationEmailController, resetPasswordController, signupController, updateProfileController, verifyEmailController } from "./auth.controller.js"
import limiter from "../../config/rateLimit.js"
import { protect } from "../../middleswares/auth.middleware.js";


const router = express.Router();

router.post("/signup", limiter, signupController);
router.get("/verify-email", limiter, verifyEmailController);
router.post("/resend-email", limiter, resendVerificationEmailController);
router.post("/login", limiter, loginController);
router.get("/me", protect, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
})

router.get("/logout", logoutController)
router.post("/refresh", refreshAccessTokenController)
router.patch("/update-profile", protect, limiter, updateProfileController);
router.post("/change-password", protect, limiter, changePasswordController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

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