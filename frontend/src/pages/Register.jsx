import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Api } from "../services/api.js";
import { useAuth } from "../context/authContext.jsx";

export default function Register() {
  const nav = useNavigate();
  const { loginPayload } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await Api.register({ email, password, role });
      loginPayload(data);
      nav("/");
    } catch (ex) {
      setErr(ex.message || "register failed");
    }
  }

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div className="row" style={{ marginBottom: "0.5rem" }}>
          <label>
            Email&nbsp;
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>
        <div className="row" style={{ marginBottom: "0.5rem" }}>
          <label>
            Password&nbsp;
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div className="row" style={{ marginBottom: "0.5rem" }}>
          <label>
            Role&nbsp;
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="customer">customer</option>
              <option value="admin">admin</option>
            </select>
          </label>
        </div>
        <p className="muted">
          The API allows promoting yourself to admin — that is intentional workshop debt.
        </p>
        {err ? <p className="error">{err}</p> : null}
        <button type="submit">Create account</button>
      </form>
      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
