import { useEffect, useState } from "react";
import { booksAPI, postsAPI, sermonsAPI } from "../api";
import { useApp } from "../context/AppContext";

export default function GlobalSearch() {
  const { setPage } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  useEffect(() => {
    if (!open || query.trim().length < 2) { setResults([]); return undefined; }
    const timer = setTimeout(async () => {
      try {
        const [sermons, books, posts] = await Promise.all([sermonsAPI.getAll({ search: query }), booksAPI.getAll({ search: query }), postsAPI.getAll({ search: query })]);
        setResults([...(sermons.data?.sermons || sermons.data || []).slice(0, 4).map((x) => ({ ...x, type: "sermons", title: x.title })), ...(books.data?.books || books.data || []).slice(0, 4).map((x) => ({ ...x, type: "books", title: x.title })), ...(posts.data?.posts || posts.data || []).slice(0, 4).map((x) => ({ ...x, type: "blog", title: x.title }))].slice(0, 8));
      } catch { setResults([]); }
    }, 280);
    return () => clearTimeout(timer);
  }, [open, query]);
  return <div style={{ position: "relative" }}><button aria-label="Search LICEM content" onClick={() => setOpen((v) => !v)} style={{ border: 0, background: "none", cursor: "pointer", color: "inherit", padding: 8 }}>⌕</button>{open && <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 290, background: "var(--white)", color: "var(--gray-dark)", border: "1px solid var(--gray-light)", borderRadius: 12, boxShadow: "var(--shadow-md)", padding: 12, zIndex: 230 }}><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sermons, books, articles…" style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--gray-light)", borderRadius: 8 }} />{query.trim().length >= 2 && results.length === 0 && <div style={{ padding: "14px 4px", fontSize: 13, color: "var(--gray-mid)" }}>No matching resources found.</div>}{results.map((item) => <button key={`${item.type}-${item._id}`} onClick={() => { setPage(item.type); setOpen(false); }} style={{ display: "block", width: "100%", border: 0, background: "none", textAlign: "left", padding: "10px 4px", cursor: "pointer", borderBottom: "1px solid var(--gray-light)" }}><strong style={{ display: "block", fontSize: 13 }}>{item.title}</strong><span style={{ fontSize: 11, color: "var(--gray-mid)" }}>{item.type}</span></button>)}</div>}</div>;
}
