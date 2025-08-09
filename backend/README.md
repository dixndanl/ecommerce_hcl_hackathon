# Ecommerce Backend (Express + JWT)

Minimal Express backend with local login and JWT-based auth, using Sequelize + PostgreSQL for users.

## Quick start (inside a container shell)

1) Mount your workspace and enter the container shell:

```sh
docker run -it --rm -p 3000:3000 -v C:\Users\Administrator\Documents\ecommerce_hcl_hackathon\backend:/work -w /work node:22-alpine sh
```

2) Install dependencies and run:

```sh
npm install
cp env.sample .env
# edit .env with your JWT secret, port, origins
npm run dev
```

App listens on `PORT` (default 3000). Health: `GET /health`.

## Environment variables

- `PORT`: API port (default 3000)
- `BASE_URL`: Public base URL of this API (e.g., http://localhost:3000)
- `CLIENT_ORIGIN`: Allowed CORS origin (frontend URL)
- `JWT_SECRET`: random secret used to sign tokens (HS256)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (or `DATABASE_URL`)

## Routes

- `GET /health`: health probe
- `GET /`: public
- `POST /auth/login`: body `{ email, password }` returns `{ token, user }`
- `POST /auth/logout`: stateless; client discards token
- `GET /profile`: protected (JWT), returns authenticated user claims
- `GET /api/private`: protected (JWT)
- `GET /api/admin`: protected (JWT) + admin role only

## Notes

## Usage examples

Login:
```sh
curl -s -X POST http://localhost:3000/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"admin@example.com","password":"adminpass"}'
```

Request body
```json
{
  "email": "admin@example.com",
  "password": "adminpass"
}
```

Success response
```json
{
  "token": "<jwt>",
  "user": {
    "id": "d651dd1b-b51d-4b25-a71b-00c276fd4fba",
    "email": "admin@example.com",
    "role": "admin",
    "name": "Admin User"
  }
}
```

The first run seeds two users into the DB: `admin@example.com`/`adminpass`, `user@example.com`/`userpass`.

Call protected route:
```sh
TOKEN=... # token from login response
curl -s http://localhost:3000/api/private -H "authorization: Bearer $TOKEN"
```

Admin-only route:
```sh
curl -s http://localhost:3000/api/admin -H "authorization: Bearer $TOKEN"
```

Logout:
```sh
curl -s -X POST http://localhost:3000/auth/logout
```

Logout request
```http
POST /auth/logout
```

Logout response
```json
{ "message": "Logged out" }
```

### Get profile

Request
```http
GET /profile
Authorization: Bearer <token>
```

Response
```json
{
  "user": {
    "sub": "d651dd1b-b51d-4b25-a71b-00c276fd4fba",
    "email": "admin@example.com",
    "role": "admin",
    "name": "Admin User",
    "iat": 1754729957,
    "exp": 1754733557
  }
}
```

### Private API

Request
```http
GET /api/private
Authorization: Bearer <token>
```

Success response
```json
{
  "message": "This is a protected resource",
  "sub": "<user-id>"
}
```

Errors
```json
{ "error": "Missing bearer token" }
{ "error": "Invalid or expired token" }
```

### Admin API

Request
```http
GET /api/admin
Authorization: Bearer <token>
```

Success response
```json
{
  "message": "Admin-only data",
  "sub": "<user-id>"
}
```

Errors
```json
{ "error": "Forbidden" }
{ "error": "Missing bearer token" }
{ "error": "Invalid or expired token" }
```
