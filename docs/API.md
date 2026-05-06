# HTTP API (v1, workshop)

Base URL: `http://localhost:3001` (or your deployed host).

Unless noted, JSON bodies and responses use `application/json`.

## Auth

### `POST /api/auth/register`

Body:

```json
{ "email": "you@example.com", "password": "secret", "role": "customer" }
```

Response `201`:

```json
{ "token": "<jwt>", "user": { "id": "…", "email": "…", "role": "…" } }
```

### `POST /api/auth/login`

Body:

```json
{ "email": "you@example.com", "password": "secret" }
```

Response `200`: same shape as register.

**Authorization header** (for protected routes):

`Authorization: Bearer <jwt>`

## Catalog (public)

### `GET /api/products`

Query: optional `categoryId` (UUID).

### `GET /api/products/categories`

### `GET /api/products/:id`

## Cart (customer)

All require JWT.

### `GET /api/cart`

### `POST /api/cart/items`

Body examples:

```json
{ "productId": "<uuid>", "quantity": 1 }
```

Alias keys `product_id` / `qty` are also accepted (inconsistent API surface).

### `PATCH /api/cart/items/:productId`

Body: `{ "quantity": number }` (`0` removes line).

### `DELETE /api/cart/items/:productId`

## Orders (customer)

### `POST /api/orders`

Places an order from the current cart. Invokes mock payment (random failures).

### `GET /api/orders`

### `GET /api/orders/:id`

## Admin

JWT required. **Note:** one status route is missing the admin guard — see `KNOWN_ISSUES.md`.

### `GET /api/admin/orders`

### `PATCH /api/admin/orders/:id/status`

Body: `{ "status": "SHIPPED" }` (must follow server-side transition rules).

### `POST /api/admin/products`

### `PATCH /api/admin/products/:id`

## Health

### `GET /health`

Returns `{ "ok": true, "service": "ecommerce-backend" }`.
