jest.mock("../services/cartService");
jest.mock("../services/productService");

const cartController = require("../controllers/cartController");
const cartService = require("../services/cartService");
const productService = require("../services/productService");

describe("cartController units", () => {
  beforeEach(() => jest.clearAllMocks());

  test("getCart returns subtotal", async () => {
    cartService.getCartRowsForUser.mockResolvedValue([
      { quantity: 2, price_cents: 100, product_id: "p" }
    ]);
    const req = { user: { id: "u1" } };
    const res = { json: jest.fn() };
    await cartController.getCart(req, res);
    expect(res.json).toHaveBeenCalledWith({
      items: expect.any(Array),
      subtotal_cents: 200
    });
  });

  test("addToCart rejects missing product id", async () => {
    const req = { user: { id: "u1" }, body: { quantity: 1 } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await cartController.addToCart(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
