import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    interface CustomJwtPayload extends jwt.JwtPayload {
      userId: string;
      role: string;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as CustomJwtPayload;

    req.user = decoded.userId;
    req.role = decoded.role;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
