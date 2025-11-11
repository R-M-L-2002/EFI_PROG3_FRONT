import { useEffect, useMemo, useState } from "react";

function saveAuth({ token, user }) {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}
function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
function readUser() {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
}

export default function useAuthClient() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => readUser());

  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
      setUser(readUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isLogged = useMemo(() => Boolean(token), [token]);

  const login = (data) => {
    saveAuth(data);
    setToken(localStorage.getItem("token"));
    setUser(readUser());
  };
  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  return { isLogged, user, login, logout };
}
