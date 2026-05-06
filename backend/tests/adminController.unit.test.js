jest.mock("../services/orderService");
jest.mock("../services/productService");

const adminController = require("../controllers/adminController");
const orderService = require("../services/orderService");
const productService = require("../services/productService");

describe("adminController units", () => {
  beforeEach(() => jest.clearAllMocks());

  test("listAllOrders success", async () => {
    orderService.listAllOrders.mockResolvedValue([]);
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await adminController.listAllOrders({}, res);
    expect(res.json).toHaveBeenCalledWith({ orders: [] });
  });

  test("patchOrderStatus rejects bad transition", async () => {
    orderService.getOrderById.mockResolvedValue({ id: "1", status: "DELIVERED" });
    const req = { params: { id: "1" }, body: { status: "PAID" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await adminController.patchOrderStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("admin_createProduct validates", async () => {
    const req = { body: { description: "x" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await adminController.admin_createProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("admin_updateProduct 404", async () => {
    productService.updateProduct.mockResolvedValue(null);
    const req = { params: { id: "nope" }, body: {} };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await adminController.admin_updateProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
