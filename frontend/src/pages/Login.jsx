import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Api } from "../services/api.js";
import { useAuth } from "../context/authContext.jsx";

export default function Login() {
  const nav = useNavigate();
  const { loginPayload } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await Api.login({ email, password });
      loginPayload(data);
      nav("/");
    } catch (ex) {
      setErr(ex.message || "login failed");
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
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
        {err ? <p className="error">{err}</p> : null}
        <button type="submit">Sign in</button>
      </form>
      <p className="muted">
        Need an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
