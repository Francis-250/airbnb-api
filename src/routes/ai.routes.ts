import { Router } from "express";
import {
  smartSearch,
  generateDescription,
  chatbot,
  recommend,
  reviewSummary,
} from "../controllers/ai.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/search", smartSearch);
router.post(
  "/listings/:id/generate-description",
  verifyToken,
  generateDescription,
);
router.post("/chat", chatbot);
router.post("/recommend", verifyToken, recommend);
router.get("/listings/:id/review-summary", reviewSummary);

export default router;
