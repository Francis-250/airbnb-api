"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const helpers_1 = require("../lib/helpers");
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                name: true,
                email: true,
                username: true,
                phone: true,
                role: true,
                avatar: true,
                bio: true,
            },
        });
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: id },
            select: {
                name: true,
                email: true,
                username: true,
                phone: true,
                role: true,
                avatar: true,
                bio: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    const { name, email, username, phone, role, avatar, bio, password } = req.body;
    if (!name || !email || !username || !password) {
        return res
            .status(400)
            .json({ message: "Name, email, username and password are required" });
    }
    try {
        const existingUser = await prisma_1.default.user.findFirst({
            where: {
                OR: [{ email }, { phone }, { username }],
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedpassword = await (0, helpers_1.hashPassword)(password);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                username,
                phone,
                role,
                avatar,
                bio,
                password: hashedpassword,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, username, phone, role, avatar, bio } = req.body;
    try {
        const existingUser = await prisma_1.default.user.findUnique({
            where: { id: id },
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = await prisma_1.default.user.update({
            where: { id: id },
            data: {
                name,
                email,
                username,
                phone,
                role,
                avatar,
                bio,
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await prisma_1.default.user.delete({
            where: { id: id },
        });
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteUser = deleteUser;
