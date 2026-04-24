import { Router } from "express";
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listings.controller";
import { isHost, verifyToken } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", getAllListings);
router.get("/:id", getListingById);
router.post("/", verifyToken, isHost, upload.array("photos", 5), createListing);
router.put("/:id", verifyToken, isHost, updateListing);
router.delete("/:id", verifyToken, isHost, deleteListing);

export default router;
