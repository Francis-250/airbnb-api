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

/**
 * @swagger
 * /api/ai/search:
 *   post:
 *     summary: Smart listing search using AI
 *     tags: [AI]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query: { type: string, example: "villa in Ruhango over $20 for 2 guests" }
 *     responses:
 *       200:
 *         description: Search results with extracted filters and pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filters:
 *                   type: object
 *                   properties:
 *                     location: { type: string, nullable: true }
 *                     type: { type: string, nullable: true }
 *                     minPrice: { type: number, nullable: true }
 *                     maxPrice: { type: number, nullable: true }
 *                     guests: { type: number, nullable: true }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Listing' } }
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *       400: { description: "Query missing or too vague to extract filters" }
 *       500: { description: "AI returned invalid response" }
 */
router.post("/search", smartSearch);

/**
 * @swagger
 * /api/ai/listings/{id}/generate-description:
 *   post:
 *     summary: Generate an AI description for a listing
 *     tags: [AI]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Listing ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tone:
 *                 type: string
 *                 enum: [professional, casual, luxury]
 *                 default: professional
 *     responses:
 *       200:
 *         description: Generated description saved to the listing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description: { type: string }
 *                 listing: { $ref: '#/components/schemas/Listing' }
 *       400: { description: Invalid tone value }
 *       401: { description: Unauthorized }
 *       403: { description: You do not own this listing }
 *       404: { description: Listing not found }
 */
router.post(
  "/listings/:id/generate-description",
  verifyToken,
  generateDescription,
);

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Guest support chatbot with optional listing context
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - message
 *             properties:
 *               sessionId: { type: string, example: "session-001" }
 *               message: { type: string, example: "Does this place have WiFi?" }
 *               listingId: { type: string, nullable: true, description: "Optional — injects listing details into context" }
 *     responses:
 *       200:
 *         description: AI response with session info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response: { type: string }
 *                 sessionId: { type: string }
 *                 messageCount: { type: integer }
 *       400: { description: sessionId or message missing }
 */
router.post("/chat", chatbot);

/**
 * @swagger
 * /api/ai/recommend:
 *   post:
 *     summary: AI listing recommendations based on booking history
 *     tags: [AI]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Recommended listings based on user preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 preferences: { type: string }
 *                 reason: { type: string }
 *                 searchFilters:
 *                   type: object
 *                   properties:
 *                     location: { type: string, nullable: true }
 *                     type: { type: string, nullable: true }
 *                     minPrice: { type: number, nullable: true }
 *                     maxPrice: { type: number, nullable: true }
 *                     guests: { type: number, nullable: true }
 *                 recommendations:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Listing' }
 *       400: { description: No booking history found }
 *       401: { description: Unauthorized }
 */
router.post("/recommend", verifyToken, recommend);

/**
 * @swagger
 * /api/ai/listings/{id}/review-summary:
 *   get:
 *     summary: AI-generated summary of listing reviews
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: AI summary of guest reviews (cached for 10 minutes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary: { type: string }
 *                 positives:
 *                   type: array
 *                   items: { type: string }
 *                 negatives:
 *                   type: array
 *                   items: { type: string }
 *                 averageRating: { type: number }
 *                 totalReviews: { type: integer }
 *       400: { description: Not enough reviews (minimum 3 required) }
 *       404: { description: Listing not found }
 */
router.get("/listings/:id/review-summary", reviewSummary);

export default router;
