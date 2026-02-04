import express from 'express';
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js"
import messageRoutes from "../modules/message/message.routes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/messages", messageRoutes);


export default router;
















