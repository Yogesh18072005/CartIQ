# CartIQ API

Express and Node.js REST API for CartIQ. MongoDB is the persistence layer and Clerk is used to authenticate protected routes.

## Requirements

- Node.js 22 or newer
- MongoDB local instance or MongoDB Atlas database
- Clerk application credentials for authenticated endpoints

## Setup

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Set `MONGODB_URI`, `FRONTEND_URL`, and `CLERK_SECRET_KEY` in `.env`. Do not commit real credentials.

## Run

```powershell
npm run dev
```

The API listens on port 5000 by default.

## Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | /api/health | Public | API and database health |
| GET | /api/products | Public | Search and paginate in-stock products |
| GET | /api/products/:id | Public | Product details |
| POST | /api/products | Clerk user + approved store | Create product |
| PATCH | /api/products/:id | Clerk user + owning approved store | Update product |
| DELETE | /api/products/:id | Clerk user + owning approved store | Delete product |
| GET | /api/stores/me | Clerk user | Read own store |
| POST | /api/stores | Clerk user | Submit a store application |

Product list query parameters: `search`, `category`, `page`, and `limit` (maximum 50).

Store approval is intentionally not exposed as a public endpoint. An administrator workflow must be implemented before seller product management can be enabled in a deployed environment.

## Security notes

- Protected routes require a valid Clerk session token.
- Product writes are restricted to the authenticated user's approved, active store.
- Request bodies are validated with Zod.
- Helmet, CORS allow-listing, JSON size limits, and rate limiting are enabled.
- Never put MongoDB or Clerk secret keys in frontend environment variables.
