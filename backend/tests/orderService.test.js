jest.mock("../models/db", () => ({
  query: jest.fn()
}));

const { query } = require("../models/db");
const orderService = require("../services/orderService");

describe("orderService", () => {
  beforeEach(() => query.mockReset());

  test("createOrderWithItems inserts order and lines", async () => {
    query
      .mockResolvedValueOnce({ rows: [{ id: "ord1", user_id: "u1", status: "PAID" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });
    const order = await orderService.createOrderWithItems(
      "u1",
      [{ product_id: "p1", quantity: 2, unit_price_cents: 100 }],
      200,
      "pay_ref",
      "PAID"
    );
    expect(order.id).toBe("ord1");
    expect(query.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  test("listAllOrders returns rows", async () => {
    query.mockResolvedValueOnce({ rows: [{ id: "1" }] });
    const rows = await orderService.listAllOrders();
    expect(rows).toHaveLength(1);
  });
});
