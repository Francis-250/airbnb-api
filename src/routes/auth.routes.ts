import { Router } from "express";
import { getCurrentUser, login } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);

export default router;
