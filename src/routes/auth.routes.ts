import { Router } from "express";
import {
  changePassword,
  deleteUserAvatar,
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  register,
  resetPassword,
  updateAvatar,
  updateProfile,
  verifyOtp,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.post("/logout", verifyToken, logout);
router.post("/change-password", verifyToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp);
router.put("/avatar", verifyToken, upload.single("avatar"), updateAvatar);
router.delete("/avatar", verifyToken, deleteUserAvatar);
router.patch(
  "/update-profile",
  verifyToken,
  upload.single("avatar"),
  updateProfile,
);

export default router;
