import express, { Request, Response } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import listingsRoutes from "./routes/listings.routes";
import usersRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";
import { setupSwagger } from "./lib/swagger";
import { generalLimiter } from "./middleware/ratelimiter";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);

setupSwagger(app);

app.use("/api/listings", listingsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Api is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
