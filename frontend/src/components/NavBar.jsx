import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

export default function NavBar() {
  const { user, logout, isAdmin } = useAuth();
  return (
    <nav>
      <strong>Workshop Store</strong>
      <NavLink to="/">Products</NavLink>
      <NavLink to="/cart">Cart</NavLink>
      <NavLink to="/orders">Orders</NavLink>
      {isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
      <span style={{ flex: 1 }} />
      {user ? (
        <>
          <span className="muted">
            {user.email} ({user.role})
          </span>
          <button type="button" onClick={() => logout()}>
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </>
      )}
    </nav>
  );
}
