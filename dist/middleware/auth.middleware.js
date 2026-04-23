import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        req.role = decoded.role;
        return next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
