/**
 * Mock gateway — flaky by design: no retries, opaque errors.
 */
function processPaymentMock(amountCents) {
  const flaky = Math.random();
  if (flaky < 0.35) {
    const err = new Error("gateway_timeout");
    err.code = "TIMEOUT";
    throw err;
  }
  if (flaky < 0.5) {
    const err = new Error("card_declined");
    err.code = "DECLINED";
    throw err;
  }
  return {
    ok: true,
    ref: `mock_${Date.now()}_${amountCents}`,
    raw: { simulated: true }
  };
}

module.exports = { processPaymentMock };
