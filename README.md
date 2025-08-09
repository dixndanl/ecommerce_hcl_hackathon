# ecommerce_hcl_hackathon

Project Design Document — E-commerce App

1. Project overview
   A e-commerce web application providing user registration/login, product listing & search, add-to-cart, checkout (payment submission), order confirmation and order history.
   Frontend: React + TypeScript + Material UI. Authentication via Auth0. Deploy frontend to Vercel.
   Backend: Node with Express. Database: PSQL. Deploy with docker.
   CMS: Strapi Cloud (To add/update products)
   Library Framework Version Details:
   React version : 19.1.1
   React Router : V7
   Material UI: 7.3.1
   Typescript: 5.9.2
   Node : 22.18
   Express: 5.1
   PSQL: 17.2
   Strapi Cloud: 5.21
   Helmet: 8.1

### Backend API Routes (implemented)

- Base URL: `http://localhost:3000`

- Health
  - GET `/health`

- Auth (`/auth`)
  - POST `/auth/login`
  - POST `/auth/logout`

- User (root)
  - GET `/profile` (auth): returns JWT claims and `cartId`
  - PUT `/profile` (auth)
  - GET `/addresses` (auth)
  - POST `/addresses` (auth)
  - PUT `/addresses/:id` (auth)
  - DELETE `/addresses/:id` (auth)
  - GET `/api/private` (auth)
  - GET `/api/admin` (auth, admin only)

- Products (`/products`)
  - GET `/products`
  - GET `/products/:id` (numeric)
  - GET `/products/slug/:slug`
  - [internal, commented out] GET `/products/structure`
  - [internal, commented out] POST `/products/bulk`

- Cart (`/cart`) (auth)
  - GET `/cart`
  - POST `/cart/items`
  - PUT `/cart/items/:id`
  - DELETE `/cart/items/:id`
  - DELETE `/cart`

- Orders (`/orders`) (auth)
  - POST `/orders/checkout`
  - GET `/orders`
  - GET `/orders/:id`

### Backend API request/response reference

Below are concise request and response shapes for the implemented backend.

- Health
  - GET `/health`
    - Response
      ```json
      { "status": "ok", "service": "ecommerce-backend", "timestamp": "ISO8601" }
      ```

- Auth
  - POST `/auth/login`
    - Request
      ```json
      { "email": "user@example.com", "password": "string" }
      ```
    - Response
      ```json
      {
        "token": "jwt",
        "user": { "id": "uuid", "email": "user@example.com", "role": "user", "name": "User Name" }
      }
      ```
  - POST `/auth/logout`
    - Response
      ```json
      { "message": "Logged out" }
      ```

- Profile
  - GET `/profile` (auth)
    - Response
      ```json
      {
        "user": { "sub": "uuid", "email": "user@example.com", "role": "user", "name": "User Name" },
        "cartId": "uuid"
      }
      ```
  - PUT `/profile` (auth)
    - Request (any subset)
      ```json
      { "name": "User Name", "phone": "+91-9000000000" }
      ```
    - Response
      ```json
      { "user": { "id": "uuid", "email": "user@example.com", "name": "User Name", "role": "user" } }
      ```

- Addresses (auth)
  - GET `/addresses`
    - Response: array of address objects
      ```json
      [
        {
          "id": "uuid", "userId": "uuid", "label": "Home", "type": "shipping",
          "line1": "123 MG Road", "line2": "Apt 4B", "city": "Bengaluru", "state": "KA",
          "postalCode": "560001", "country": "IN", "phone": "+91-9000000000", "isDefault": true,
          "createdAt": "ISO8601", "updatedAt": "ISO8601"
        }
      ]
      ```
  - POST `/addresses`
    - Request (required: `line1`, `city`, `postalCode`)
      ```json
      {
        "label": "Home", "type": "shipping",
        "line1": "123 MG Road", "line2": "Apt 4B", "city": "Bengaluru", "state": "KA",
        "postalCode": "560001", "country": "IN", "phone": "+91-9000000000", "isDefault": true
      }
      ```
    - Response: created address object (same shape as above)
  - PUT `/addresses/:id`
    - Request: partial update of any address fields
    - Response: updated address object
  - DELETE `/addresses/:id`
    - Response
      ```json
      { "deleted": true }
      ```

- Products (proxy to Strapi)
  - GET `/products`
  - GET `/products/:id`
  - GET `/products/slug/:slug`
  - Response shape: Strapi format (see section "Products API (backend proxy to Strapi — read-only)" below)

- Cart (auth)
  - GET `/cart`
    - Response
      ```json
      {
        "cart": { "id": "uuid", "userId": "uuid", "status": "active", "createdAt": "ISO8601", "updatedAt": "ISO8601" },
        "items": [
          { "id": "uuid", "cartId": "uuid", "productId": "string", "productTitle": "Cotton T-Shirt", "price": 899, "currency": "INR", "quantity": 2, "thumbnailUrl": null }
        ]
      }
      ```
  - POST `/cart/items`
    - Request (required: `productId`, `productTitle`, `price`, `currency`; optional: `quantity`, `thumbnailUrl`)
      ```json
      { "productId": "1", "productTitle": "Cotton T-Shirt", "price": 899, "currency": "INR", "quantity": 1 }
      ```
    - Response: created/updated cart item object
  - PUT `/cart/items/:id`
    - Request
      ```json
      { "quantity": 3 }
      ```
    - Response: updated cart item object
  - DELETE `/cart/items/:id`
    - Response
      ```json
      { "deleted": true }
      ```
  - DELETE `/cart`
    - Response
      ```json
      { "cleared": true }
      ```

- Orders (auth)
  - POST `/orders/checkout`
    - Request (cart must be non-empty)
      ```json
      { "shippingAddressId": "uuid", "paymentMethod": "cod", "metadata": { "note": "string" } }
      ```
    - Response: created order with items
      ```json
      {
        "id": "uuid", "userId": "uuid", "status": "created", "totalAmount": 1798, "currency": "INR",
        "shippingAddressId": "uuid", "shippingAddressSnapshot": { "line1": "...", "city": "..." },
        "paymentMethod": "cod", "metadata": null,
        "items": [
          { "id": "uuid", "orderId": "uuid", "productId": "1", "productTitle": "Cotton T-Shirt", "price": 899, "currency": "INR", "quantity": 2, "thumbnailUrl": null }
        ]
      }
      ```
  - GET `/orders`
    - Response: array of orders (each with `items`)
  - GET `/orders/:id`
    - Response: order object (with `items`)

- Error format (common)
  - When an error occurs, endpoints return a status code and body like:
    ```json
    { "error": "Message", "details": "Optional details or validation info" }
    ```

2. Modules (functional areas)
   • Registration
   • Login / Authentication
   • Landing / Product listing
   • Search
   • AddToCart / GetCartProducts / RemoveFromCart
   • Checkout (payment submission)
   • Order Confirmation
   • Order History
   • Profile Page

3. API contract (summary)
   Base path: /api/v1 (example)
   Endpoint
   HTTP
   Description
   /registration
   POST
   Create user
   /login
   POST
   User login (returns token)
   /me
   GET
   Get current user profile (auth)
   /products
   GET
   Get product list (supports filters, paging)
   /search
   GET
   Search products (query param)
   /orders
   GET
   Get user's past orders (auth)
   /cart
   POST
   Add products to user's cart (auth)
   /cart
   GET
   Get cart contents (auth)
   /cart
   DELETE
   Remove product(s) from cart (auth)
   /checkout
   POST
   Submit payment + place order (auth)
   /orderconfirmation
   GET
   Get order confirmation details (auth)

4. Functional requirements (selected / cleaned)
   Registration
   • Accept valid email.
   • Username (and name) validation: no repeated characters sequence, no jargon, no special profanity (business rule).
   • Minimum password length: 8 characters; must meet strong password rules .
   • Prevent duplicate registrations (unique email & username).
   Login
   • Accept username or email + password.
   • Passwords stored as secure hash (bcrypt/argon2).
   • Rate limit login attempts.
   Products & Search
   • getProducts returns paginated product lists (supports page, size, category filter, sort by price).
   • search by searchText (title, description, category).
   Cart & Checkout
   • Add to cart with productId(s) + quantity.
   • Get cart returns aggregated prices and availability.
   • Checkout accepts delivery + billing addresses, sameAsDelivery boolean, payment information object.
   • On success, create an Order and clear cart.
   OrderHistory & OrderConfirmation
   • orderHistory returns paged historical orders by user.
   • orderConfirmation returns final order details (orderId, deliveryDate/time window, deliveryAddress, expected delivery based on PIN code).
   ProfilePage
   • Read/update profile, manage addresses.

5. Non-functional requirements
   • Security
   ◦ Use Auth0 for authentication and authorization; backend validates JWTs.
   ◦ Passwords hashed with bcrypt/argon2 if storing locally (but with Auth0, passwords managed by Auth0).
   ◦ Input validation & sanitization to prevent injection (SQL/NoSQL/XSS).
   • Performance
   ◦ API response time < 300ms for typical product list requests (cache hot items).
   ◦ Use pagination and limit default page size (e.g., 20 items).

6. Data models (JSON / DB conceptual)
   4.1 User
   {
   "userId": "uuid",
   "username": "string", // unique
   "email": "string", // unique
   "passwordHash": "string",
   "fullName": "string",
   "addresses": [
   {
   "addressId": "uuid",
   "line1": "string",
   "line2": "string",
   "city": "string",
   "state": "string",
   "country": "string",
   "pinCode": "string",
   "isDefault": true
   }
   ],
   "createdAt": "ISO8601",
   "updatedAt": "ISO8601"
   }
   4.2 Product
   {
   "productId": "uuid",
   "title": "string",
   "description": "string",
   "category": "string",
   "price": 123.45,
   "imageUrl": "string",
   "availableQuantity": 100,
   "deliveryEstimates": {
   "baseDays": 3,
   "pinBasedAdjustments": { "560001": 1 } // optional
   },
   "createdAt": "ISO8601"
   }
   4.3 Cart (per user)
   {
   "cartId": "uuid",
   "userId": "uuid",
   "items": [
   { "productId": "uuid", "quantity": 2, "priceAtAdd": 123.45 }
   ],
   "updatedAt": "ISO8601"
   }
   4.4 Order
   {
   "orderId": "uuid",
   "userId": "uuid",
   "items": [
   { "productId": "uuid", "quantity": 2, "unitPrice": 123.45 }
   ],
   "billingAddress": { /_ address obj _/ },
   "deliveryAddress": { /_ address obj _/ },
   "paymentInfo": {
   "method": "card|upi|netbanking|wallet",
   "transactionId": "string",
   "amount": 246.9
   },
   "status": "PLACED|PAID|SHIPPED|DELIVERED|CANCELLED",
   "placedAt": "ISO8601",
   "deliveryDate": "ISO8601"
   }

7. API details (expanded) — key endpoints with sample payloads & responses
   POST /registration
   Request
   {
   "username":"john_doe",
   "email":"john@example.com",
   "password":"P@ssw0rd123",
   "fullName":"John Doe",
   "address": { "line1":"..", "city":"..", "pinCode":"560001" }
   }
   Responses
   • 201 Created -> { "userId":"uuid", "message":"Registration successful" }
   • 400 Bad Request -> validation errors
   • 409 Conflict -> email or username exists

POST /login
Request
{ "usernameOrEmail":"john@example.com", "password":"P@ssw0rd123" }
Response
• 200 OK -> { "token":"jwt-token", "expiresIn":3600 }
• 401 Unauthorized -> invalid credentials
(With Auth0, follow OAuth flows — frontend will redirect to Auth0 or use hosted login. Backend can accept & validate the Auth0 JWT.)

GET /getproducts
Query params: page, size, category, sort
Response
{ "items":[ { "productId":"...", "title":"...", "price":99.9, "imageUrl":"..." } ], "page":1, "size":20, "total":500 }

GET /search?q=phone&page=1
Response: same as getproducts, filtered by search term.

POST /addtocart (auth required)
Payload
{
"userId":"uuid",
"products":[ { "productId":"uuid", "quantity":2 } ]
}
Response
• 200 OK -> updated cart
• 400 -> insufficient stock or invalid product

GET /getcartproducts (auth)
Response
{ "userId":"uuid", "items":[ { "productId":"uuid","title":"..","quantity":2,"unitPrice":49.9 } ], "totals": { "subtotal":99.8, "tax":9.98, "shipping":20, "grandTotal":129.78 } }

POST /checkout (auth)
Request
{
"userId":"uuid",
"deliveryAddress": {/_ address _/},
"billingAddress": {/_ address _/},
"sameAsDelivery": true,
"payment": {
"method":"card",
"cardToken":"token-from-processor",
"amount": 129.78
}
}
Response
• 201 Created -> { "orderId":"uuid", "status":"PAID", "deliveryDate":"2025-08-12T16:00:00Z" }
• 402 Payment Required -> payment failed
• 409 -> inventory changed

GET /orderhistory (auth)
Response
{ "orders":[ {"orderId":"...", "placedAt":"...","status":"DELIVERED","total":123.45} ] }

### Products API (backend proxy to Strapi — read-only)

- **Base URL (backend)**: `http://localhost:3000`
- **Description**: These endpoints proxy to Strapi (`/api/products`) and return responses in Strapi format. All query params are forwarded (e.g., `filters`, `pagination`, `sort`, `populate`, `fields`).
- **Env**: Configure `STRAPI_BASE_URL` and optional `STRAPI_API_TOKEN` in `backend/.env`.

- **List products**
  - Endpoint: `GET /products`
  - Query params (forwarded to Strapi):
    - `filters[...]` — Strapi filters, e.g., `filters[catalogStatus][$eq]=active`
    - `pagination[page]`, `pagination[pageSize]`
    - `sort` — e.g., `title:asc` or `price:desc`
    - `populate` — relations or media, e.g., `images,thumbnail`
    - `fields` — select attributes, e.g., `title,price,slug`
  - Example
    ```
    GET /products?filters[catalogStatus][$eq]=active&pagination[page]=1&pagination[pageSize]=24&sort=title:asc&populate=images,thumbnail
    ```
  - Response (Strapi list shape)
    ```json
    {
      "data": [
        {
          "id": 1,
          "attributes": {
            "title": "Cotton T-Shirt",
            "slug": "cotton-t-shirt",
            "price": 899,
            "currency": "INR",
            "catalogStatus": "active",
            "createdAt": "2025-08-01T10:00:00.000Z",
            "updatedAt": "2025-08-05T10:00:00.000Z"
          }
        }
      ],
      "meta": {
        "pagination": { "page": 1, "pageSize": 24, "pageCount": 10, "total": 240 }
      }
    }
    ```

- **Get product by ID**
  - Endpoint: `GET /products/:id`
  - Query params: same passthrough as list (e.g., `populate`)
  - Example
    ```
    GET /products/1?populate=images,thumbnail
    ```
  - Response (Strapi single item shape)
    ```json
    {
      "data": {
        "id": 1,
        "attributes": {
          "title": "Cotton T-Shirt",
          "slug": "cotton-t-shirt",
          "price": 899,
          "currency": "INR"
        }
      },
      "meta": {}
    }
    ```

- **Get product by slug**
  - Endpoint: `GET /products/slug/:slug`
  - Behavior: Returns a Strapi list (0 or 1 items typically) filtered by slug
  - Example
    ```
    GET /products/slug/cotton-t-shirt?populate=images,thumbnail
    ```
  - Response (Strapi list shape)
    ```json
    {
      "data": [
        {
          "id": 1,
          "attributes": {
            "title": "Cotton T-Shirt",
            "slug": "cotton-t-shirt",
            "price": 899
          }
        }
      ],
      "meta": { "pagination": { "page": 1, "pageSize": 25, "pageCount": 1, "total": 1 } }
    }
    ```

- **Error responses**
  - On Strapi errors, backend responds with appropriate HTTP status and body:
    ```json
    { "error": "Failed to fetch products", "details": "<from Strapi>" }
    ```
