import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
} from "../controllers/booking.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getAllBookings);
router.get("/:id", verifyToken, getBookingById);
router.post("/", verifyToken, createBooking);
router.patch("/:id/status", verifyToken, updateBooking);
router.delete("/:id", verifyToken, deleteBooking);

export default router;
