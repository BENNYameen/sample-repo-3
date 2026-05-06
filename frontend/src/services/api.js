import { authHeader } from "../context/authContext.jsx";

async function parseJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function apiFetch(path, { method = "GET", token, body, headers = {} } = {}) {
  const init = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
      ...headers
    }
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch(path, init);
  const data = await parseJson(res);
  if (!res.ok) {
    const err = new Error(data?.error || res.statusText || "request failed");
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

export const Api = {
  register: (body) => apiFetch("/api/auth/register", { method: "POST", body }),
  login: (body) => apiFetch("/api/auth/login", { method: "POST", body }),
  products: (q) => {
    const qs = q?.categoryId ? `?categoryId=${encodeURIComponent(q.categoryId)}` : "";
    return apiFetch(`/api/products${qs}`);
  },
  categories: () => apiFetch("/api/products/categories"),
  cart: (token) => apiFetch("/api/cart", { token }),
  addCart: (token, body) => apiFetch("/api/cart/items", { method: "POST", token, body }),
  updateCartLine: (token, productId, quantity) =>
    apiFetch(`/api/cart/items/${productId}`, { method: "PATCH", token, body: { quantity } }),
  placeOrder: (token) => apiFetch("/api/orders", { method: "POST", token, body: {} }),
  myOrders: (token) => apiFetch("/api/orders", { token }),
  adminOrders: (token) => apiFetch("/api/admin/orders", { token }),
  adminSetStatus: (token, id, status) =>
    apiFetch(`/api/admin/orders/${id}/status`, { method: "PATCH", token, body: { status } })
};
