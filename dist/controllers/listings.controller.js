"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteListing = exports.updateListing = exports.createListing = exports.getListingById = exports.getAllListings = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllListings = async (req, res) => {
    const user = req.user;
    const role = req.role;
    if (!user)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const listings = await prisma_1.default.listing.findMany({
            where: role === "host" ? { hostId: user } : {},
        });
        res.status(200).json(listings);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllListings = getAllListings;
const getListingById = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const role = req.role;
    if (!user)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const listing = await prisma_1.default.listing.findUnique({
            where: role === "host"
                ? { id: id, hostId: user }
                : { id: id },
        });
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.status(200).json(listing);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getListingById = getListingById;
const createListing = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, description, location, pricePerNight, guests, type, amenities, rating, } = req.body;
    if (!title ||
        !description ||
        !location ||
        !pricePerNight ||
        !guests ||
        !type) {
        return res.status(400).json({
            message: "Title, description, location, price per night, guests and type are required",
        });
    }
    if (pricePerNight <= 0 || guests <= 0) {
        return res.status(400).json({
            message: "Price per night and guests must be not be less than or equal to zero ",
        });
    }
    try {
        const existingListing = await prisma_1.default.listing.findFirst({
            where: { title },
        });
        if (existingListing) {
            return res
                .status(400)
                .json({ message: "Listing with this title already exists" });
        }
        const listing = await prisma_1.default.listing.create({
            data: {
                title,
                description,
                location,
                pricePerNight,
                guests,
                type,
                amenities,
                rating,
                hostId: user,
            },
        });
        res.status(201).json(listing);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createListing = createListing;
const updateListing = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, description, location, pricePerNight, guests, type, amenities, rating, } = req.body;
    try {
        const isOwned = await prisma_1.default.listing.findFirst({
            where: { id: id, hostId: user },
        });
        if (!isOwned) {
            return res
                .status(403)
                .json({ message: "This property is not owned by you" });
        }
        const existingListing = await prisma_1.default.listing.findUnique({
            where: { id: id },
        });
        if (!existingListing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        const listing = await prisma_1.default.listing.update({
            where: { id: id },
            data: {
                title,
                description,
                location,
                pricePerNight,
                guests,
                type,
                amenities,
                rating,
            },
        });
        res.status(200).json(listing);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateListing = updateListing;
const deleteListing = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const isOwned = await prisma_1.default.listing.findFirst({
            where: { id: id, hostId: user },
        });
        if (!isOwned) {
            return res
                .status(403)
                .json({ message: "This property is not owned by you" });
        }
        const existingListing = await prisma_1.default.listing.findUnique({
            where: { id: id },
        });
        if (!existingListing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        await prisma_1.default.listing.delete({
            where: { id: id },
        });
        res.status(200).json({ message: "Listing deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteListing = deleteListing;
