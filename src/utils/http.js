export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function postJSON(path, data, { withCredentials = false } = {}) {
  const resp = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: withCredentials ? "include" : "same-origin",
    body: JSON.stringify(data),
  });

  let payload = null;
  try { payload = await resp.json(); } catch { payload = null; }

  if (!resp.ok) {
    const msg = payload?.message || payload?.error || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return payload;
}
