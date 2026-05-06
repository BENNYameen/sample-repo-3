import { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "workshop_jwt";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("workshop_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("workshop_user", JSON.stringify(user));
    else localStorage.removeItem("workshop_user");
  }, [user]);

  const value = useMemo(
    () => ({
      token,
      user,
      loginPayload(payload) {
        setToken(payload.token);
        setUser(payload.user);
      },
      logout() {
        setToken(null);
        setUser(null);
      },
      isAdmin: user?.role === "admin"
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
