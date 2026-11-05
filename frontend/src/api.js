const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`The spirits refused (${res.status})`);
  return res.status === 204 ? null : res.json();
}

export const listEntries = () => request("/api/entries");
export const addEntry = (name, message) =>
  request("/api/entries", { method: "POST", body: JSON.stringify({ name, message }) });
export const deleteEntry = (id) => request(`/api/entries/${id}`, { method: "DELETE" });
