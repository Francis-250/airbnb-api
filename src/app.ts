import express, { Request, Response } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import listingsRoutes from "./routes/listings.routes";
import usersRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/listings", listingsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Api is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
