# Ecommerce Backend — Node/Express

### Overview
Production-ready Express backend using JWT auth, Sequelize + Postgres, Zod validation, Helmet security, and CORS. It proxies products from Strapi and exposes authenticated endpoints for cart, checkout, orders, and profile/addresses.

### Tech stack
- Node.js (Express)
- Sequelize (Postgres)
- Zod (validation)
- Helmet, CORS, rate limiting
- JWT (HS256)

### Features
- Authentication: signup, login, logout; JWT issuance and verification
- Products proxy (read-only): forwards to Strapi and returns Strapi response shape
- Cart (auth): add/update/remove items; get cart with items
- Orders (auth): create order from cart (checkout), get orders and order by id
- Profile & Addresses (auth): read/update profile; address CRUD

### Configuration
Create `backend/.env` (copy from `env.sample`) and set:
- `PORT=3000`
- `CLIENT_ORIGIN=http://localhost:5173` (frontend origin)
- `JWT_SECRET=<strong-random-secret>`
- `STRAPI_BASE_URL=https://worthy-beauty-fe2c83a475.strapiapp.com` (CMS base)
- `STRAPI_API_TOKEN=<optional if Strapi requires token>`
- Database: either `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL` or `DATABASE_URL`

### Getting started
```sh
cd backend
npm install
cp env.sample .env
# edit .env as per Configuration above
npm run dev
# server: http://localhost:3000  | health: http://localhost:3000/health
```

Docker (optional)
```sh
docker run -it --rm -p 3000:3000 -v %cd%:/work -w /work node:22-alpine sh
# inside container
npm install && npm run dev
```

### API endpoints
- Health: `GET /health`
- Auth: `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`
- User (auth): `GET /profile`, `PUT /profile`, addresses `GET/POST/PUT/DELETE /addresses`
- Products: `GET /products`, `GET /products/:id`, `GET /products/slug/:slug` (Strapi proxy)
- Cart (auth): `GET /cart`, `POST /cart/items`, `PUT /cart/items/:id`, `DELETE /cart/items/:id`, `DELETE /cart`
- Orders (auth): `POST /orders/checkout`, `GET /orders`, `GET /orders/:id`

### Example usage
- Signup
```sh
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"User","password":"P@ssw0rd123"}'
```
- Login (returns `{ token, user }`)
```sh
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"P@ssw0rd123"}'
```
- Add to cart (auth)
```sh
curl -X POST http://localhost:3000/cart/items \
  -H "Authorization: Bearer <jwt>" -H "Content-Type: application/json" \
  -d '{"productId":"1","productTitle":"Cotton T-Shirt","price":899,"currency":"INR","quantity":1}'
```
- Checkout (auth)
```sh
curl -X POST http://localhost:3000/orders/checkout \
  -H "Authorization: Bearer <jwt>" -H "Content-Type: application/json" \
  -d '{"paymentMethod":"cod"}'
```

### Error format
```json
{ "error": "Message", "details": "Optional details or validation info" }
```

### Notes
- CORS controlled by `CLIENT_ORIGIN`
- Login rate limited (per-IP)
- Strongly set `JWT_SECRET` in production
