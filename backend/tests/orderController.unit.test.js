jest.mock("../services/cartService");
jest.mock("../services/productService");
jest.mock("../services/orderService");
jest.mock("../services/paymentService", () => ({
  processPaymentMock: jest.fn()
}));

const { processPaymentMock } = require("../services/paymentService");
const orderController = require("../controllers/orderController");
const cartService = require("../services/cartService");
const orderService = require("../services/orderService");

describe("orderController placeOrder slice", () => {
  beforeEach(() => jest.clearAllMocks());

  test("400 when cart empty", async () => {
    cartService.getCartRowsForUser.mockResolvedValue([]);
    const req = { user: { id: "u1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await orderController.placeOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("402 when payment fails", async () => {
    cartService.getCartRowsForUser.mockResolvedValue([
      { product_id: "p1", quantity: 1, price_cents: 100 }
    ]);
    const productService = require("../services/productService");
    productService.getProductById.mockResolvedValue({
      id: "p1",
      price_cents: 100,
      stock: 5
    });
    processPaymentMock.mockImplementation(() => {
      const e = new Error("card_declined");
      e.code = "DECLINED";
      throw e;
    });
    const req = { user: { id: "u1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await orderController.placeOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(402);
  });

  test("201 creates order when payment ok", async () => {
    cartService.getCartRowsForUser.mockResolvedValue([
      { product_id: "p1", quantity: 1, price_cents: 100 }
    ]);
    const productService = require("../services/productService");
    productService.getProductById.mockResolvedValue({
      id: "p1",
      price_cents: 100,
      stock: 5
    });
    processPaymentMock.mockReturnValue({ ref: "pay1" });
    orderService.createOrderWithItems.mockResolvedValue({ id: "ord1" });
    productService.adjustStock.mockResolvedValue({});
    cartService.clearCart.mockResolvedValue();

    const req = { user: { id: "u1" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await orderController.placeOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(cartService.clearCart).toHaveBeenCalledWith("u1");
  });
});
