# Known issues (intentional workshop defects)

This list is part of the **deliverable**. Tools and humans should treat these as expected flaws unless you are deliberately “fixing” the exercise.

## Security & authorization

1. **Self-service admin registration** — `POST /api/auth/register` accepts `role: "admin"` from the client with only shallow normalization. There is no invite-only admin flow.
2. **Broken admin authorization** — `PATCH /api/admin/orders/:id/status` uses `requireAuth` but **omits** `requireAdmin`. Any authenticated user who guesses an order UUID can attempt state transitions (transition rules still apply).
3. **Weak JWT configuration** — if `JWT_SECRET` is unset, a hard-coded development default is used (`utils/jwtUtil.js`).
4. **No rate limiting, lockout, or MFA** — brute-force surface on `/api/auth/login`.

## Data integrity & concurrency

5. **Cart races** — add/update cart lines do not use DB transactions or row-level locking. Concurrent updates can interleave oddly with checkout stock checks (TOCTOU).
6. **Checkout double-submit** — parallel `POST /api/orders` requests can both pass stock validation before inventory is decremented.
7. **Order creation not atomic** — `createOrderWithItems` issues multiple statements without `BEGIN/COMMIT`. A mid-flight failure can orphan partial data.
8. **Payment mock instability** — `paymentService.processPaymentMock` randomly fails; there is **no retry** and errors are mapped to coarse HTTP codes.

## Validation & API consistency

9. **Uneven input validation** — email format not validated; login allows odd `password` shapes that can surface as `500` errors; cart update uses weak `NaN` checks.
10. **Duplicate / divergent product listing** — `GET /api/products` sometimes calls `productService` and sometimes duplicates the SQL via `query` in the controller (drift risk).
11. **Inconsistent request body keys** — cart accepts `productId` / `product_id` / `qty` / `quantity` with different error payloads.

## Business logic

12. **Order lifecycle** — successful checkouts insert orders directly in `PAID` state (skips a durable `PENDING` payment record). Admin transitions are `PAID → SHIPPED → DELIVERED`.
13. **Stock decremented after order insert** — if stock adjustment fails late, inventory can disagree with `order_items` (partial failure handling is incomplete).

## Observability & maintenance

14. **Minimal logging** — errors often return opaque `{ error: "…" }` JSON without structured logs or correlation IDs.
15. **Dead / unused code** — e.g. `legacyNormalizeEmail` in `utils/helpers.js` is unused; some variables exist for historical flows.
16. **Naming inconsistency** — mix of camelCase and snake_case across layers mirrors “grown” codebases.

## Testing posture (weak by design)

17. **Coverage is incomplete** — only ~60% of backend statements under `collectCoverageFrom`; many branches (failure paths in controllers, full `cartController`, much of `productService`) are untested.
18. **Few integration tests** — most tests mock the database; regressions in SQL or wiring may not be caught.
19. **No frontend automated tests** — UI is manual.

## Metrics / static-analysis hooks

20. **Complexity hotspot** — `placeOrder` in `controllers/orderController.js` mixes validation, pricing, payment, persistence, and inventory.
21. **Natural churn targets** — duplicated SQL in `productController` vs `productService`; cart and order flows share no unified “unit of work” abstraction.

When building benchmarks (coverage, mutation, complexity), prefer labeling these items **in scope** rather than filing them as accidental bugs.
