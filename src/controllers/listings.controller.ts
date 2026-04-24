import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { uploadListingPhotos as uploadListingPhotosHelper } from "../lib/helpers";

export const getAllListings = async (req: Request, res: Response) => {
  try {
    const listings = await prisma.listing.findMany();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getListingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: id as string },
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

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    if (guests <= 0) {
      return res.status(400).json({ message: "Guests must be greater than 0" });
    }
    if (pricePerNight <= 0) {
      return res
        .status(400)
        .json({ message: "Price per night must be greater than 0" });
    }

    let photoUrls: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const results = await uploadListingPhotosHelper(req.files);
      photoUrls = results.map((result: any) => result.secure_url);
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
        photos: photoUrls,
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
    if (guests <= 0) {
      return res.status(400).json({ message: "Guests must be greater than 0" });
    }
    if (pricePerNight <= 0) {
      return res
        .status(400)
        .json({ message: "Price per night must be greater than 0" });
    }
    const isOwned = await prisma.listing.findFirst({
      where: { id: id as string, hostId: user },
    });
    if (!isOwned) {
      return res
        .status(403)
        .json({ message: "This property is not owned by you" });
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

  try {
    const isOwned = await prisma.listing.findFirst({
      where: { id: id as string, hostId: user },
    });
    if (!isOwned) {
      return res
        .status(403)
        .json({ message: "This property is not owned by you" });
    }

    await prisma.listing.delete({
      where: { id: id as string },
    });
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
