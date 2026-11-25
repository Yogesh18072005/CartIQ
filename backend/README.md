# CartIQ API

Express and Node.js REST API for CartIQ. MongoDB is the persistence layer and Clerk authenticates protected routes.

## Requirements

- Node.js 22 or newer
- MongoDB local instance or MongoDB Atlas
- Clerk application credentials for authenticated endpoints

## Setup

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Set `MONGODB_URI`, `FRONTEND_URL`, `CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY` in `.env`. Keep the Clerk secret and MongoDB URI on the server only. Never commit real credentials.

## Run

```powershell
npm run dev
```

The API listens on port 5000 by default.

To add clearly labelled local demonstration products:

```powershell
npm run seed:demo
```

The seed command creates or updates one demo store and six demo products. It does not run automatically.

## Endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | /api/health | Public | API and database health |
| GET | /api/products | Public | Search and paginate approved-store products |
| GET | /api/products/:id | Public | Product details |
| GET | /api/products/mine | Clerk user | List own store products |
| POST | /api/products | Clerk user + approved store | Create product |
| PATCH | /api/products/:id | Clerk user + owning approved store | Update product |
| DELETE | /api/products/:id | Clerk user + owning approved store | Delete product |
| GET | /api/stores/:username | Public | Approved storefront and products |
| GET | /api/stores/me | Clerk user | Read own store application |
| POST | /api/stores | Clerk user | Submit a store application |
| GET | /api/admin/stores | Allow-listed admin | List store applications |
| PATCH | /api/admin/stores/:storeId/status | Allow-listed admin | Approve or reject a store |
| PATCH | /api/admin/stores/:storeId/active | Allow-listed admin | Activate or deactivate an approved store |
| GET | /api/addresses | Clerk user | List own saved addresses |
| POST | /api/addresses | Clerk user | Save a delivery address |
| DELETE | /api/addresses/:id | Clerk user | Delete own address |
| GET | /api/orders | Clerk user | List own orders |
| POST | /api/orders | Clerk user | Place a COD order using server-side product prices |
| GET | /api/orders/store | Approved seller | List orders containing the seller's products |
| PATCH | /api/orders/store/:orderId/status | Approved seller | Update own items' fulfillment status |

Product list query parameters: `search`, `category`, `page`, and `limit` (maximum 50).

Set `ADMIN_CLERK_USER_IDS` to a comma-separated list of trusted Clerk user IDs to enable admin routes. No public admin route exists.

## Important scope

- Only Cash on Delivery is enabled. Online payment is not implemented.
- Product images are URL-based; managed uploads are not implemented.
- Order placement snapshots product prices and the delivery address on the server.
- Stock quantity reservation/decrement and transaction-based inventory handling remain future work.

## Security and validation

- Protected routes validate Clerk session tokens.
- Product writes are restricted to the authenticated user's approved, active store.
- Admin actions require an explicit Clerk user ID allow-list.
- Users can only read and delete their own addresses and read their own orders.
- Request bodies are validated with Zod.
- Helmet, CORS allow-listing, JSON size limits, and rate limiting are enabled.
- Duplicate database keys return a conflict response.

## Tests

```powershell
npm test
```
