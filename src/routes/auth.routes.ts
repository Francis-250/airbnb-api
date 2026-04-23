import { Router } from "express";
import { getCurrentUser, login, logout } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.post("/logout", verifyToken, logout);

export default router;
