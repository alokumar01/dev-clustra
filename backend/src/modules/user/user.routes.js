import { Router } from "express";
import useRoutes from "./user.routes.js";

const router = Router();

router.use("/users", useRoutes);





export default router;