# CartIQ

CartIQ is a multi-vendor e-commerce application prototype with product discovery, shopping-cart interactions, seller storefronts, and camera-assisted item recognition.

## Technology stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Backend:** Node.js, Express 5 REST API
- **Database:** MongoDB with Mongoose
- **Authentication:** Clerk
- **Client state:** Redux Toolkit
- **Validation and security:** Zod, Helmet, CORS allow-listing, rate limiting
- **Camera-based recognition:** TensorFlow.js, COCO-SSD, React Webcam

The repository is being migrated from its original PostgreSQL/Prisma starter structure to a MERN architecture. The active commerce API uses MongoDB/Mongoose. The old Prisma schema is retained temporarily as a migration reference and is not used by the Express API.

## Implemented so far

- Customer storefront and product browsing UI connected to the Express product API
- Redux cart state and quantity controls
- MongoDB-backed product listing, product detail, and seller product CRUD APIs
- Clerk-protected store application submission
- Public approved-store storefront API
- Admin-only store approval and activation endpoints guarded by a Clerk user ID allow-list
- Admin store review screens connected to the protected API
- Customer address creation and retrieval
- Cash-on-delivery order creation and customer order history API
- Seller order listing and per-store fulfillment status updates
- Seller product creation, listing, and stock-availability controls
- Cart checkout and order-history pages connected to the backend
- Optional local demo-data seed command
- Camera-based object detection mapped to current MongoDB product IDs
- Backend request validation and API security middleware
- GitHub Actions backend validation tests

## Still in progress / not production-ready

- Stripe or other online payment integration (currently COD only)
- Stock quantity management and transactional order inventory updates
- Seller/admin dashboard metrics connected to MongoDB
- Product image upload and managed storage
- Ratings and reviews API
- Full end-to-end testing with MongoDB, Clerk, and browser camera permissions
- Deployment configuration and production environment verification

Do not describe unfinished workflows as production-ready.

## Repository layout

```text
CartIQ/
├── backend/
│   ├── src/
│   │   ├── config/       # Environment and MongoDB connection
│   │   ├── controllers/  # API request handlers
│   │   ├── middleware/   # Authentication, authorization and errors
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # Express REST routes
│   │   ├── scripts/      # Explicit local demo seed
│   │   └── validators/   # Zod request schemas
│   └── tests/
├── frontend/
│   ├── app/              # Next.js routes and layouts
│   ├── components/       # Storefront, seller, admin and camera UI
│   └── lib/              # Redux store and feature slices
└── object_detection/     # Separate experimental Next.js workspace
```

## Run locally

Use two terminals and have MongoDB running locally or through Atlas.

### 1. Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Set `MONGODB_URI`, `FRONTEND_URL`, and both Clerk keys in `backend/.env`. To enable store approval, add your own Clerk user ID to `ADMIN_CLERK_USER_IDS`. Keep all secret values private and never commit `.env`.

```powershell
npm run dev
```

Optional local demonstration data:

```powershell
npm run seed:demo
```

### 2. Frontend

In a second PowerShell terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set the Clerk frontend publishable key and `NEXT_PUBLIC_API_URL=http://localhost:5000` in `frontend/.env.local`. Open [http://localhost:3000](http://localhost:3000).

## Tests

From `backend/`:

```powershell
npm test
```

GitHub Actions runs backend validation tests on relevant pushes and pull requests. A passing CI run does not replace live MongoDB, Clerk, browser, or checkout testing.

## Attribution

The original frontend README references the [GreatStackDev GoCart project](https://github.com/GreatStackDev/goCart). Preserve its license and attribution notices when using or modifying that code. Clearly describe your own contributions when presenting CartIQ.
