# Airbnb API

A RESTful API built with Express, TypeScript, and Prisma — modeled after Airbnb's core features. Supports authentication, listings, bookings, search, stats, image uploads, and email notifications.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express v5
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT (httpOnly cookies)
- **Storage**: Cloudinary (avatars & listing photos)
- **Email**: Nodemailer (Gmail)
- **Docs**: Swagger UI

## Features

- JWT authentication with httpOnly cookies
- Role-based access control (host / guest)
- Full CRUD for listings and bookings
- Search & filter listings by location, type, price, guests
- Listing and user stats with aggregations
- Avatar & listing photo uploads via Cloudinary
- Password reset via OTP email flow
- In-memory caching for stats and listings
- Rate limiting per route type
- Gzip compression
- Swagger docs at `/api/docs`

## Project Structure

airbnb-api/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── listings.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── users.controller.ts
│   │   └── stats.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── listings.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── users.routes.ts
│   │   └── stats.routes.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── ratelimiter.ts
│   │   ├── upload.middleware.ts
│   │   └── mailer.ts
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── cache.ts
│   │   ├── helpers.ts
│   │   └── swagger.ts
│   ├── templates/
│   │   └── mail.temp.ts
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env
├── package.json
└── tsconfig.json
## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account
- Gmail account (for email)

### Installation

git clone https://github.com/your-username/airbnb-api.git
cd airbnb-api
pnpm install
### Environment Variables

Create a `.env` file in the root:

DATABASE_URL=postgresql://user:password@localhost:5432/airbnb
JWT_SECRET=your_jwt_secret
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
### Database Setup

pnpm migrate        # run migrations
pnpm generate       # generate Prisma client
pnpm seed           # seed with sample data
### Run

pnpm dev            # development with hot reload
pnpm build          # compile TypeScript
pnpm start          # run production build
## API Reference

Base URL: `http://localhost:4000/api`

Swagger UI: `http://localhost:4000/api/docs`

### Auth


| Method | Endpoint                | Description       | Auth |
| ------ | ----------------------- | ----------------- | ---- |
| POST   | `/auth/register`        | Register new user | ❌   |
| POST   | `/auth/login`           | Login             | ❌   |
| GET    | `/auth/me`              | Get current user  | ✅   |
| POST   | `/auth/logout`          | Logout            | ✅   |
| POST   | `/auth/change-password` | Change password   | ✅   |
| POST   | `/auth/forgot-password` | Request OTP       | ❌   |
| POST   | `/auth/verify-otp`      | Verify OTP        | ❌   |
| POST   | `/auth/reset-password`  | Reset password    | ❌   |
| PUT    | `/auth/avatar`          | Update avatar     | ✅   |
| DELETE | `/auth/avatar`          | Delete avatar     | ✅   |
| PATCH  | `/auth/update-profile`  | Update profile    | ✅   |

### Listings


| Method | Endpoint           | Description                  | Auth    |
| ------ | ------------------ | ---------------------------- | ------- |
| GET    | `/listings`        | Get all listings (paginated) | ❌      |
| GET    | `/listings/search` | Search & filter listings     | ❌      |
| GET    | `/listings/stats`  | Listing statistics           | ❌      |
| GET    | `/listings/:id`    | Get listing by ID            | ❌      |
| POST   | `/listings`        | Create listing               | ✅ Host |
| PUT    | `/listings/:id`    | Update listing               | ✅ Host |
| DELETE | `/listings/:id`    | Delete listing               | ✅ Host |

### Bookings


| Method | Endpoint               | Description           | Auth     |
| ------ | ---------------------- | --------------------- | -------- |
| GET    | `/bookings`            | Get my bookings       | ✅       |
| GET    | `/bookings/:id`        | Get booking by ID     | ✅       |
| POST   | `/bookings`            | Create booking        | ✅ Guest |
| PATCH  | `/bookings/:id/status` | Update booking status | ✅ Host  |
| DELETE | `/bookings/:id`        | Cancel booking        | ✅ Guest |

### Users


| Method | Endpoint     | Description    | Auth |
| ------ | ------------ | -------------- | ---- |
| GET    | `/users`     | Get all users  | ✅   |
| GET    | `/users/:id` | Get user by ID | ✅   |
| PUT    | `/users/:id` | Update user    | ✅   |
| DELETE | `/users/:id` | Delete user    | ✅   |

### Stats


| Method | Endpoint          | Description        | Auth |
| ------ | ----------------- | ------------------ | ---- |
| GET    | `/stats/users`    | User statistics    | ❌   |
| GET    | `/listings/stats` | Listing statistics | ❌   |

## Search Query Params

GET /api/listings/search?location=New York&type=apartment&minPrice=50&maxPrice=200&guests=2&page=1&limit=10

| Param      | Type    | Description                     |
| ---------- | ------- | ------------------------------- |
| `location` | string  | Partial, case-insensitive match |
| `type`     | string  | apartment, house, villa, cabin  |
| `minPrice` | number  | Min price per night             |
| `maxPrice` | number  | Max price per night             |
| `guests`   | integer | Minimum guest capacity          |
| `page`     | integer | Page number (default: 1)        |
| `limit`    | integer | Results per page (default: 10)  |

## Rate Limits


| Limiter         | Limit            | Applied to              |
| --------------- | ---------------- | ----------------------- |
| General         | 100 req / 15 min | All routes              |
| Strict          | 10 req / 15 min  | DELETE routes           |
| Register        | 5 req / 1 hour   | `/auth/register`        |
| Login           | 5 req / 15 min   | `/auth/login`           |
| Forgot password | 3 req / 1 hour   | `/auth/forgot-password` |
| OTP             | 5 req / 15 min   | `/auth/verify-otp`      |

## Caching


| Endpoint              | TTL        |
| --------------------- | ---------- |
| `GET /listings`       | 60 seconds |
| `GET /listings/stats` | 5 minutes  |
| `GET /stats/users`    | 5 minutes  |

Cache is invalidated automatically on any create, update, or delete operation.

## License

MIT


## Author

**MUNYANKINDI Francois**
