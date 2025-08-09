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
