jest.mock("../models/db", () => ({
  query: jest.fn()
}));

const { query } = require("../models/db");
const productService = require("../services/productService");

describe("productService (mocked db)", () => {
  beforeEach(() => {
    query.mockReset();
  });

  test("listAllProducts maps rows", async () => {
    query.mockResolvedValueOnce({ rows: [{ id: "1", name: "P" }] });
    const rows = await productService.listAllProducts();
    expect(rows[0].name).toBe("P");
    expect(query).toHaveBeenCalled();
  });

  test("getProductById returns null when empty", async () => {
    query.mockResolvedValueOnce({ rows: [] });
    const row = await productService.getProductById("missing");
    expect(row).toBeNull();
  });
});
