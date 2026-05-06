import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Api } from "../services/api.js";
import { useAuth } from "../context/authContext.jsx";

export default function CartPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");

  async function refresh() {
    if (!token) return;
    const d = await Api.cart(token);
    setData(d);
  }

  useEffect(() => {
    if (!token) return;
    refresh().catch((e) => setMsg(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function setQty(productId, quantity) {
    setMsg("");
    try {
      await Api.updateCartLine(token, productId, quantity);
      await refresh();
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function checkout() {
    setMsg("");
    try {
      await Api.placeOrder(token);
      await refresh();
      setMsg("Order placed (if payment mock succeeded).");
    } catch (e) {
      setMsg(e.message || "checkout failed");
    }
  }

  if (!token) {
    return (
      <div className="card">
        <p>
          <Link to="/login">Login</Link> to view your cart.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Cart</h2>
      {msg ? <p className="error">{msg}</p> : null}
      {!data ? (
        <p>Loading…</p>
      ) : (
        <>
          <p className="muted">Subtotal cents: {data.subtotal_cents}</p>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {(data.items || []).map((i) => (
              <li key={i.id} style={{ marginBottom: "0.5rem" }}>
                <div className="row">
                  <span>
                    {i.name} × {i.quantity}
                  </span>
                  <button type="button" onClick={() => setQty(i.product_id, i.quantity + 1)}>
                    +
                  </button>
                  <button type="button" onClick={() => setQty(i.product_id, i.quantity - 1)}>
                    −
                  </button>
                  <button type="button" onClick={() => setQty(i.product_id, 0)}>
                    remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button type="button" onClick={checkout}>
            Place order
          </button>
        </>
      )}
    </div>
  );
}
