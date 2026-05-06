jest.mock("../services/productService", () => ({
  listProductsByCategory: jest.fn(),
  getProductById: jest.fn(),
  listCategories: jest.fn(),
  listAllProducts: jest.fn()
}));

jest.mock("../models/db", () => ({
  query: jest.fn()
}));

const productController = require("../controllers/productController");
const productService = require("../services/productService");
const { query } = require("../models/db");

describe("productController units", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("listProducts uses category service when categoryId present", async () => {
    productService.listProductsByCategory.mockResolvedValue([{ id: "1" }]);
    const req = { query: { categoryId: "cat" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await productController.listProducts(req, res);
    expect(productService.listProductsByCategory).toHaveBeenCalledWith("cat");
    expect(res.json).toHaveBeenCalledWith({ products: [{ id: "1" }] });
  });

  test("listProducts falls back to raw query (duplicated path)", async () => {
    query.mockResolvedValue({ rows: [{ id: "2" }] });
    const req = { query: {} };
    const res = { json: jest.fn() };
    await productController.listProducts(req, res);
    expect(query).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ products: [{ id: "2" }] });
  });

  test("getProduct 404", async () => {
    productService.getProductById.mockResolvedValue(null);
    const req = { params: { id: "x" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await productController.getProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
