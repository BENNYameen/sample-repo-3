/**
 * Grab-bag helpers — includes dead code and inconsistent style on purpose.
 */

function centsToDisplay(cents) {
  if (typeof cents !== "number") return "$0.00";
  return `$${(cents / 100).toFixed(2)}`;
}

// Never referenced anywhere — mutation / dead-code bait
function legacyNormalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function truncate(str, n) {
  if (!str || str.length <= n) return str;
  return str.slice(0, n) + "...";
}

module.exports = {
  centsToDisplay,
  legacyNormalizeEmail,
  truncate
};
