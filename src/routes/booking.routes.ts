import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
} from "../controllers/booking.controller";
import { isGuest, verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getAllBookings);
router.get("/:id", verifyToken, getBookingById);
router.post("/", verifyToken, isGuest, createBooking);
router.patch("/:id/status", verifyToken, updateBooking);
router.delete("/:id", verifyToken, isGuest, deleteBooking);

export default router;
