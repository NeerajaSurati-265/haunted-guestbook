import { useEffect, useState } from "react";
import { addEntry, deleteEntry, listEntries } from "./api.js";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      setEntries(await listEntries());
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    try {
      await addEntry(name, message);
      setMessage("");
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function onDelete(id) {
    try {
      await deleteEntry(id);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main>
      <h1>🕯️ Haunted Guestbook</h1>
      <p className="sub">Leave a message for the spirits. They write back.</p>

      <form onSubmit={onSubmit}>
        <input placeholder="Your name (or what's left of it)" value={name}
          onChange={(e) => setName(e.target.value)} maxLength={40} />
        <textarea placeholder="Your message from beyond" value={message}
          onChange={(e) => setMessage(e.target.value)} maxLength={200} rows={3} />
        <button type="submit">Sign the book</button>
      </form>

      {error && <p className="error">👻 {error}</p>}
      {loading && <p className="sub">Summoning entries…</p>}

      <ul>
        {entries.map((e) => (
          <li key={e.id}>
            <div>
              <strong>{e.name}</strong>
              <p>{e.message}</p>
            </div>
            <button className="ghost" onClick={() => onDelete(e.id)} title="Banish">✕</button>
          </li>
        ))}
      </ul>
      {!loading && !error && entries.length === 0 && <p className="sub">The book is empty. Too quiet…</p>}
    </main>
  );
}
