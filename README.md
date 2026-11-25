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

The repository is being migrated from its original PostgreSQL/Prisma starter structure to a MERN architecture. The active commerce API uses MongoDB/Mongoose. The old Prisma schema is retained temporarily as a migration reference and is not used by the new Express API.

## Current implementation

- Customer storefront and product browsing UI
- Redux cart state and quantity controls
- MongoDB-backed product listing and product detail API
- Clerk-protected store application submission
- Public approved-store storefront API
- Product create, update, and delete API restricted to the owner's approved store
- Admin-only store approval endpoint guarded by a Clerk user ID allow-list
- Optional local demo-data seed command
- Browser camera component using COCO-SSD object detection
- Backend request validation and API security middleware
- GitHub Actions backend validation tests

**Still in progress:** order persistence and checkout, payment integration, address and coupon APIs, full seller/admin dashboard data integration, image upload/storage, and end-to-end verification. Do not describe these as production-ready features until implemented and tested.

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

Use two terminals.

### 1. Start MongoDB

Use a local MongoDB service or a MongoDB Atlas database. Keep the connection string private.

### 2. Start the backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Set `MONGODB_URI`, `FRONTEND_URL`, and both Clerk keys in `backend/.env`. To use the admin approval endpoint, add your own Clerk user ID to `ADMIN_CLERK_USER_IDS`. Never commit this file or share credentials.

```powershell
npm run dev
```

Optional local demonstration data:

```powershell
npm run seed:demo
```

### 3. Start the frontend

In a second terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set the Clerk frontend publishable key and the backend API URL in `frontend/.env.local`. Open [http://localhost:3000](http://localhost:3000).

## Tests

From `backend/`:

```powershell
npm test
```

The GitHub Actions workflow runs the backend validation tests on relevant pushes and pull requests. A passing validation workflow does not replace live MongoDB, Clerk, browser, or checkout testing.

## Attribution

The original frontend README references the [GreatStackDev GoCart project](https://github.com/GreatStackDev/goCart). Preserve its license and attribution notices when using or modifying that code. Clearly describe your own contributions when presenting CartIQ.
