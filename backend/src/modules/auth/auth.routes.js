import express from "express"
import { changePasswordController, forgotPasswordController, loginController, logoutController, refreshAccessTokenController, resendVerificationEmailController, resetPasswordController, signupController, updateProfileController, verifyEmailController } from "./auth.controller.js"
import limiter from "../../config/rateLimit.js"
import { protect } from "../../middleswares/auth.middleware.js";
import { validate } from "../../middleswares/validation.middleware.js";
import { loginSchema, registerSchema, verifyEmailSchema, resendEmailSchema, updateProfileSchema,
    changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.validation.js";


const router = express.Router();

router.post("/signup", limiter, validate(registerSchema), signupController);
router.get("/verify-email", limiter, validate(verifyEmailSchema, "query"), verifyEmailController);
router.post("/resend-email", limiter, validate(resendEmailSchema), resendVerificationEmailController);
router.post("/login", limiter, validate(loginSchema), loginController);
router.get("/me", protect, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
})

router.get("/logout", logoutController)
router.post("/refresh", refreshAccessTokenController)
router.patch("/update-profile", limiter, protect, validate(updateProfileSchema), updateProfileController);
router.post("/change-password", limiter, protect, validate(changePasswordSchema), changePasswordController);
router.post("/forgot-password", limiter, validate(forgotPasswordSchema), forgotPasswordController);
router.post("/reset-password", limiter, validate(resetPasswordSchema), resetPasswordController);

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
