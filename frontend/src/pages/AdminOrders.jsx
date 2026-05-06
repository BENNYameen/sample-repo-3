import { useEffect, useState } from "react";
import { Api } from "../services/api.js";
import { useAuth } from "../context/authContext.jsx";

const NEXT = {
  PAID: "SHIPPED",
  SHIPPED: "DELIVERED"
};

export default function AdminOrders() {
  const { token, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    const d = await Api.adminOrders(token);
    setOrders(d.orders || []);
  }

  useEffect(() => {
    if (!token || !isAdmin) return;
    load().catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAdmin]);

  async function advance(id, status) {
    const n = NEXT[status];
    if (!n) return;
    setErr("");
    try {
      await Api.adminSetStatus(token, id, n);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  if (!token || !isAdmin) {
    return (
      <div className="card">
        <p className="muted">Admin only (use seeded admin user).</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Admin — orders</h2>
      {err ? <p className="error">{err}</p> : null}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Order</th>
            <th style={{ textAlign: "left" }}>Status</th>
            <th style={{ textAlign: "left" }}>Total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id.slice(0, 8)}…</td>
              <td>{o.status}</td>
              <td>${(o.total_cents / 100).toFixed(2)}</td>
              <td>
                {NEXT[o.status] ? (
                  <button type="button" onClick={() => advance(o.id, o.status)}>
                    Mark {NEXT[o.status]}
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
