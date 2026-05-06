import { useEffect, useState } from "react";
import { Api } from "../services/api.js";
import { useAuth } from "../context/authContext.jsx";

function cents(n) {
  return `$${(n / 100).toFixed(2)}`;
}

export default function ProductList() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    Api.categories()
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    Api.products({ categoryId: filter || undefined })
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]));
  }, [filter]);

  async function add(productId) {
    if (!token) {
      setMsg("Login to add items.");
      return;
    }
    setMsg("");
    try {
      await Api.addCart(token, { productId, quantity: 1 });
      setMsg("Added to cart.");
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>Catalog</h2>
        <div className="row">
          <label>
            Category&nbsp;
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {msg ? <p className="muted">{msg}</p> : null}
      </div>
      {products.map((p) => (
        <div key={p.id} className="card">
          <strong>{p.name}</strong>
          <div className="muted">{p.category_name || "Uncategorized"}</div>
          <p>{p.description}</p>
          <div className="row">
            <span>{cents(p.price_cents)}</span>
            <span className="muted">stock {p.stock}</span>
            <button type="button" onClick={() => add(p.id)}>
              Add one
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
