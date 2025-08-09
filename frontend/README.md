## Frontend — React App

### Overview
E-commerce frontend built with React and Vite, styled with Material UI, and integrated with the backend for authentication, products, cart, checkout, orders, and profile.

### Tech stack
- React 18
- Vite 5
- React Router 6
- Material UI 5 (+ emotion)
- jsPDF (export order confirmation)

### Features
- Authentication
  - Login (`POST /auth/login`), Signup (`POST /auth/signup`), Logout
  - JWT is stored in `localStorage.authToken`
- Products
  - Fetches from backend `GET /products` (backend proxies Strapi)
  - Normalizes Strapi shape to UI objects; uses default placeholder image when missing
- Cart
  - Local cart in `localStorage`
  - On checkout, syncs local items to backend via `POST /cart/items`
- Checkout
  - Places order via `POST /orders/checkout` (auth)
- Orders
  - Lists orders via `GET /orders` (auth)
  - Order Confirmation page with PDF export
- Profile
  - Updates name/phone via `PUT /profile` (auth)
- Navbar
  - Live cart count; navigation to Products, Cart, Orders, Profile

### Configuration
- Backend base URL is configurable with `VITE_API_BASE_URL` (defaults to `http://localhost:3000`).
- Default placeholder image used when product image is missing: `https://placehold.co/600x400`.

Create `.env.local` in the `frontend` folder to override defaults:
```sh
VITE_API_BASE_URL=http://localhost:3000
```

### Getting started
```sh
cd frontend
npm install
npm run dev
# App will be available at http://localhost:5173
```

Build & preview:
```sh
npm run build
npm run preview
# Preview at http://localhost:4173
```

### API integration (endpoints used by the frontend)
- Auth: `POST /auth/login`, `POST /auth/signup`, `POST /auth/logout`
- Products: `GET /products`
- Cart (auth): `POST /cart/items`
- Checkout (auth): `POST /orders/checkout`
- Orders (auth): `GET /orders`
- Profile (auth): `PUT /profile`

The frontend uses a centralized API helper at `src/api.js` that:
- Injects `Authorization: Bearer <token>` when available
- Reads `VITE_API_BASE_URL`
- Exposes a `DEFAULT_IMAGE_URL` for safe image fallback

### Project structure (selected)
```
src/
  App.jsx
  main.jsx
  api.js                # centralized API helper
  components/
    Navbar.jsx
  pages/
    Login.jsx
    Register.jsx
    Products.jsx
    Cart.jsx
    ReviewPage.jsx
    Orders.jsx
    OrderConfirmation.jsx
    Profile.jsx
```

### Notes
- Ensure backend CORS `CLIENT_ORIGIN` matches frontend origin (e.g., `http://localhost:5173`).
- For CMS-backed products, the backend proxies Strapi and returns Strapi format; the UI normalizes it.
- If images are missing or relative, the UI falls back to `https://placehold.co/600x400`.

