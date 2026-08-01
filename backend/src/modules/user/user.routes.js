import { Router } from "express";
import { checkUsernameController, searchUsersController, updateAvatarController } from "./user.controller.js";
import { protect } from "../../middleswares/auth.middleware.js";
import {upload, uploadToCloudinary} from "../media/upload.middleware.js"
import limiter from "../../config/rateLimit.js";
import { validate } from "../../middleswares/validation.middleware.js";
import { usernameSchema } from "./user.validation.js"

const router = Router();

router.patch("/update-avatar",
    protect,
    upload.single('avatar'),
    uploadToCloudinary,
    updateAvatarController
)

// search users in conversation
router.get("/search", protect, searchUsersController)

// check username availability
router.get("/check-username", limiter, validate(usernameSchema, "query"), checkUsernameController)

export default router;
