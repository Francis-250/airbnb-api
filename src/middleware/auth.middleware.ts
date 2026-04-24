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

export const isHost = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.role !== "host") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export const isGuest = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.role !== "guest") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
