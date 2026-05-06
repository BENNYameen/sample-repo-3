const { processPaymentMock } = require("../services/paymentService");

describe("paymentService mock", () => {
  const realRandom = Math.random;

  afterEach(() => {
    Math.random = realRandom;
  });

  test("returns ref when random high", () => {
    Math.random = () => 0.99;
    const r = processPaymentMock(1000);
    expect(r.ok).toBe(true);
    expect(r.ref).toMatch(/^mock_/);
  });

  test("throws on simulated decline band", () => {
    Math.random = () => 0.45;
    expect(() => processPaymentMock(500)).toThrow("card_declined");
  });

  test("throws timeout band", () => {
    Math.random = () => 0.1;
    expect(() => processPaymentMock(500)).toThrow("gateway_timeout");
  });
});
