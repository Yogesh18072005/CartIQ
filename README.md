# CartIQ

CartIQ is an e-commerce application prototype focused on product discovery, shopping-cart interactions, multi-vendor storefront concepts, and camera-assisted item recognition.

> **Project status:** The repository contains a Next.js application and a browser-based object-detection component. Some seller, admin, and order screens currently use demo data or placeholder handlers. This README distinguishes implemented UI/prototype functionality from backend workflows that still require implementation and verification.

## Current technology

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Authentication UI/integration:** Clerk
- **Client state:** Redux Toolkit
- **Charts and UI:** Recharts, Lucide React, React Hot Toast
- **Camera-based recognition:** TensorFlow.js, COCO-SSD, React Webcam
- **Data-model draft:** Prisma schema for PostgreSQL (database integration must be completed and verified)

This repository is **not currently a conventional MERN stack application**: the checked-in frontend uses Next.js and a PostgreSQL-oriented Prisma schema, and no Express/MongoDB backend is present in the current tree.

## Features present in the codebase

- Customer storefront pages and product browsing UI
- Redux-based cart state and quantity controls
- Product detail, category, and shop page structure
- Seller and admin dashboard interfaces
- Store, product, order, address, coupon, and rating data models drafted in Prisma
- Browser camera component using COCO-SSD object detection
- Product, cart, address, and rating Redux slices

## Repository layout

```text
CartIQ/
├── frontend/
│   ├── app/             # Next.js routes and layouts
│   ├── components/      # Storefront, seller, admin and camera UI
│   ├── lib/             # Redux store and feature slices
│   ├── prisma/          # PostgreSQL data-model draft
│   └── utils/           # Prediction rendering helpers
└── object_detection/    # Separate Next.js starter workspace; review before use
```

## Run the main frontend

Requirements: Node.js 20.9+ and npm.

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The current `.env.example` only documents the public currency symbol. Clerk configuration and database credentials are not included; add valid values locally only after the corresponding integrations are configured. Never commit `.env.local` or production secrets.

## Important implementation notes

Before treating this as a production-ready commerce platform, the following work remains:

- Connect storefront, seller, and admin screens to persistent server-side data instead of demo fixtures.
- Implement and verify store application submission and approval.
- Implement secure product, order, address, coupon, and rating operations with server-side authorization.
- Complete Prisma client setup, migrations, and database connection.
- Implement and test checkout/payment handling before describing purchases as supported.
- Add tests for core cart and commerce workflows.
- Verify camera permissions, model loading, detection behavior, and cleanup on supported browsers.
- Replace placeholder pages and remove unrelated demo code before deployment.

## Attribution

The frontend README in this repository references the [GreatStackDev GoCart project](https://github.com/GreatStackDev/goCart). Preserve the original project's license and attribution notices when using or modifying its code. Clearly describe your own changes and contributions when presenting this project.

## Development checks

From `frontend/`:

```powershell
npm run build
```

The build command checks the Next.js production build. It does not prove that authentication, database operations, checkout, or camera workflows work end-to-end.
