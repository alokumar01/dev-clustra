import { Router } from "express";
import { checkUsernameController, searchUsersController, updateAvatarController } from "./user.controller.js";
import { protect } from "../../middleswares/auth.middleware.js";
import {upload, uploadToCloudinary} from "../media/upload.middleware.js"
import limiter from "../../config/rateLimit.js";

const router = Router();

router.patch("/update-avatar",
    protect,
    upload.single('avatar'),
    uploadToCloudinary,
    updateAvatarController
)

router.get("/search", protect, searchUsersController)

router.get("/check-username", limiter, checkUsernameController)

export default router;
