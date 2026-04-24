import { Router } from "express";
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listings.controller";
import { isHost, verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getAllListings);
router.get("/:id", verifyToken, getListingById);
router.post("/", verifyToken, isHost, createListing);
router.put("/:id", verifyToken, isHost, updateListing);
router.delete("/:id", verifyToken, isHost, deleteListing);

export default router;
