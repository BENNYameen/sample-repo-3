jest.mock("../models/db", () => ({
  query: jest.fn()
}));

const { query } = require("../models/db");
const cartService = require("../services/cartService");

describe("cartService", () => {
  beforeEach(() => query.mockReset());

  test("getCartRowsForUser", async () => {
    query.mockResolvedValueOnce({ rows: [{ quantity: 1 }] });
    const rows = await cartService.getCartRowsForUser("u1");
    expect(rows[0].quantity).toBe(1);
  });

  test("clearCart runs delete", async () => {
    query.mockResolvedValueOnce({ rowCount: 1 });
    await cartService.clearCart("u1");
    expect(query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM cart_items"), ["u1"]);
  });
});
