import { Request, Response } from "express";
import prisma from "../lib/prisma";
export const getAllListings = async (req: Request, res: Response) => {
  const user = req.user;
  const role = req.role;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const listings = await prisma.listing.findMany({
      where: role === "host" ? { hostId: user } : {},
    });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const role = req.role;

  if (!user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const listing = await prisma.listing.findUnique({
      where:
        role === "host"
          ? { id: id as string, hostId: user }
          : { id: id as string },
    });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createListing = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const {
    title,
    description,
    location,
    pricePerNight,
    guests,
    type,
    amenities,
    rating,
  } = req.body;
  if (
    !title ||
    !description ||
    !location ||
    !pricePerNight ||
    !guests ||
    !type
  ) {
    return res.status(400).json({
      message:
        "Title, description, location, price per night, guests and type are required",
    });
  }
  if (pricePerNight <= 0 || guests <= 0) {
    return res.status(400).json({
      message:
        "Price per night and guests must be not be less than or equal to zero ",
    });
  }
  try {
    const existingListing = await prisma.listing.findFirst({
      where: { title },
    });
    if (existingListing) {
      return res
        .status(400)
        .json({ message: "Listing with this title already exists" });
    }
    const listing = await prisma.listing.create({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const {
    title,
    description,
    location,
    pricePerNight,
    guests,
    type,
    amenities,
    rating,
  } = req.body;
  try {
    const isOwned = await prisma.listing.findFirst({
      where: { id: id as string, hostId: user },
    });
    if (!isOwned) {
      return res
        .status(403)
        .json({ message: "This property is not owned by you" });
    }
    const existingListing = await prisma.listing.findUnique({
      where: { id: id as string },
    });
    if (!existingListing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    const listing = await prisma.listing.update({
      where: { id: id as string },
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const isOwned = await prisma.listing.findFirst({
      where: { id: id as string, hostId: user },
    });
    if (!isOwned) {
      return res
        .status(403)
        .json({ message: "This property is not owned by you" });
    }
    const existingListing = await prisma.listing.findUnique({
      where: { id: id as string },
    });
    if (!existingListing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    await prisma.listing.delete({
      where: { id: id as string },
    });
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
