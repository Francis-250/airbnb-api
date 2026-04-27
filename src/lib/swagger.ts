import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Airbnb API",
      version: "1.0.0",
      description: "Airbnb API",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The auto-generated id of the user",
            },
            name: { type: "string", description: "The name of the user" },
            email: { type: "string", description: "The email of the user" },
            username: {
              type: "string",
              description: "The username of the user",
            },
            phone: {
              type: "string",
              nullable: true,
              description: "The phone number of the user",
            },
            role: {
              type: "string",
              enum: ["host", "guest"],
              description: "The role of the user",
            },
            avatar: {
              type: "string",
              nullable: true,
              description: "The avatar URL of the user",
            },
            bio: {
              type: "string",
              nullable: true,
              description: "The bio of the user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
          },
        },
        Listing: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The auto-generated id of the listing",
            },
            title: { type: "string", description: "The title of the listing" },
            description: {
              type: "string",
              description: "The description of the listing",
            },
            location: {
              type: "string",
              description: "The location of the listing",
            },
            pricePerNight: {
              type: "number",
              description: "The price per night",
            },
            guests: {
              type: "integer",
              description: "Maximum number of guests",
            },
            type: {
              type: "string",
              enum: ["apartment", "house", "villa", "cabin"],
              description: "The type of listing",
            },
            amenities: {
              type: "array",
              items: { type: "string" },
              description: "List of amenities",
            },
            photos: {
              type: "array",
              items: { type: "string" },
              description: "List of photo URLs",
            },
            rating: {
              type: "number",
              nullable: true,
              description: "The average rating",
            },
            hostId: { type: "string", description: "The ID of the host" },
            host: { $ref: "#/components/schemas/User" },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
          },
        },
        Booking: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The auto-generated id of the booking",
            },
            checkIn: {
              type: "string",
              format: "date-time",
              description: "Check-in date",
            },
            checkOut: {
              type: "string",
              format: "date-time",
              description: "Check-out date",
            },
            totalPrice: {
              type: "number",
              description: "Total price of the booking",
            },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled"],
              description: "Booking status",
            },
            guestId: { type: "string", description: "The ID of the guest" },
            listingId: { type: "string", description: "The ID of the listing" },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      swaggerOptions: {
        withCredentials: true,
      },
    }),
  );

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  console.log("Swagger docs available at http://localhost:4000/api-docs");
};
