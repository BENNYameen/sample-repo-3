const { assertTransition } = require("../controllers/orderController");

describe("order status transitions", () => {
  test("allows PAID -> SHIPPED", () => {
    expect(assertTransition("PAID", "SHIPPED")).toBe(true);
  });

  test("blocks DELIVERED -> anything in model", () => {
    expect(assertTransition("DELIVERED", "SHIPPED")).toBe(false);
  });
});
