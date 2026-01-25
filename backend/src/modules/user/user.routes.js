import { Router } from "express";
import { searchUsersController, updateAvatarController } from "./user.controller.js";
import { protect } from "../../middleswares/auth.middleware.js";
import {upload, uploadToCloudinary} from "../media/upload.middleware.js"
const router = Router();

router.patch("/update-avatar", 
    protect,
    upload.single('avatar'),
    uploadToCloudinary,
    updateAvatarController
)

router.get("/search", protect, searchUsersController)

export default router;