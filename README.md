## Ecommerce App — Backend, Frontend, and CMS

This repository contains a complete e-commerce stack:
- Backend (Node/Express + Postgres) that also proxies product data from Strapi
- Frontend (React + Vite + MUI) integrated with the backend’s auth/cart/orders
- CMS (Strapi) hosted on Strapi Cloud

### CMS (Strapi)
- Hosted CMS base URL: `https://worthy-beauty-fe2c83a475.strapiapp.com/`
- Products API lives at: `https://worthy-beauty-fe2c83a475.strapiapp.com/api/products`
- The backend reads from Strapi using `STRAPI_BASE_URL` and optional `STRAPI_API_TOKEN`.

### Backend
- Base URL: `http://localhost:3000`
- Health: GET `/health`
- Auth: POST `/auth/signup`, `/auth/login`, `/auth/logout`
- User: GET `/profile`, PUT `/profile`, Address CRUD under `/addresses` (all auth required)
- Products: GET `/products`, `/products/:id`, `/products/slug/:slug` (proxies Strapi, returns Strapi shape)
- Cart (auth): `GET /cart`, `POST /cart/items`, `PUT /cart/items/:id`, `DELETE /cart/items/:id`, `DELETE /cart`
- Orders (auth): `POST /orders/checkout`, `GET /orders`, `GET /orders/:id`

Setup
1) Prereqs: Node >= 20, Postgres
2) Configure env
```
cd backend
cp env.sample .env
# set DB_*, JWT_SECRET, CLIENT_ORIGIN (e.g., http://localhost:5173),
# STRAPI_BASE_URL=https://worthy-beauty-fe2c83a475.strapiapp.com
# STRAPI_API_TOKEN=<if your Strapi requires read token>
```
3) Install & run
```
npm install
npm run dev
# server at http://localhost:3000
```

Useful cURL
- Signup
```
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"User","password":"P@ssw0rd123"}'
```
- Login → returns `{ token, user }`
```
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"P@ssw0rd123"}'
```
- Products (public, Strapi proxy)
```
curl "http://localhost:3000/products?populate=thumbnail,images"
```
- Add to cart (auth)
```
curl -X POST http://localhost:3000/cart/items \
  -H "Authorization: Bearer <jwt>" -H "Content-Type: application/json" \
  -d '{"productId":"1","productTitle":"Cotton T-Shirt","price":899,"currency":"INR","quantity":1}'
```
- Checkout (auth)
```
curl -X POST http://localhost:3000/orders/checkout \
  -H "Authorization: Bearer <jwt>" -H "Content-Type: application/json" \
  -d '{"paymentMethod":"cod"}'
```

Notes
- CORS: set `CLIENT_ORIGIN` to your frontend origin
- Rate limiting: only on `POST /auth/login`
- Error shape: `{ "error": "Message", "details": "Optional" }`

### Frontend
- Dev server: Vite (default `http://localhost:5173`)
- Configure backend base URL via env `VITE_API_BASE_URL` (defaults to `http://localhost:3000`)

Setup
```
cd frontend
npm install
echo VITE_API_BASE_URL=http://localhost:3000 > .env.local
npm run dev
```

Implemented features and integrations
- Centralized API helper `frontend/src/api.js`
  - Auto-injects `Authorization: Bearer <token>` from `localStorage.authToken`
  - Default placeholder image: `https://placehold.co/600x400` (used when image missing)
- Auth
  - `Login.jsx` → POST `/auth/login`, stores `{ token, user }`
  - `Register.jsx` → POST `/auth/signup`, stores `{ token, user }`
  - `Navbar.jsx` → clears `authToken` and `user` on logout
- Products
  - `Products.jsx` → GET `/products` and normalizes Strapi shape `{ data: [...] }` into UI list
  - Uses placeholder image when none provided
- Cart & Checkout
  - `Cart.jsx` → on checkout, syncs local items to backend via `POST /cart/items`
  - `ReviewPage.jsx` → `POST /orders/checkout` with `{ paymentMethod: 'cod', metadata: {...} }`
- Orders
  - `Orders.jsx` → GET `/orders` (auth), displays `createdAt` and items (`productTitle`, `price`)
  - `OrderConfirmation.jsx` → displays `paymentMethod`, totals, and item details from backend
- Profile
  - `Profile.jsx` → PUT `/profile` (auth) for name/phone update

### Products API (Strapi proxy details)
- Backend forwards query params to Strapi and returns Strapi’s response shape.
- Configure Strapi env in `backend/.env`:
  - `STRAPI_BASE_URL=https://worthy-beauty-fe2c83a475.strapiapp.com`
  - `STRAPI_API_TOKEN` if the CMS requires an access token

Example
```
GET /products?filters[catalogStatus][$eq]=active&pagination[page]=1&pagination[pageSize]=24&sort=title:asc&populate=images,thumbnail
```

### Tech stack / versions
- Frontend: React, Vite, MUI, jsPDF
- Backend: Node/Express, Helmet, Zod, Postgres (Sequelize)
- CMS: Strapi Cloud

### Image placeholder
- Default image used in the UI: `https://placehold.co/600x400`

