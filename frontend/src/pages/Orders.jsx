import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Api } from "../services/api.js";
import { useAuth } from "../context/authContext.jsx";

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) return;
    Api.myOrders(token)
      .then((d) => setOrders(d.orders || []))
      .catch(() => setOrders([]));
  }, [token]);

  if (!token) {
    return (
      <div className="card">
        <Link to="/login">Login</Link> to see orders.
      </div>
    );
  }

  return (
    <div className="card">
      <h2>My orders</h2>
      <ul style={{ paddingLeft: "1.2rem" }}>
        {orders.map((o) => (
          <li key={o.id}>
            {o.id.slice(0, 8)}… — {o.status} — ${(o.total_cents / 100).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
