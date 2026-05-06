const { centsToDisplay, truncate } = require("../utils/helpers");

describe("helpers", () => {
  test("centsToDisplay formats", () => {
    expect(centsToDisplay(199)).toBe("$1.99");
    expect(centsToDisplay("x")).toBe("$0.00");
  });

  test("truncate short string", () => {
    expect(truncate("hi", 10)).toBe("hi");
    expect(truncate("abcdefghijk", 3)).toBe("abc...");
  });
});
