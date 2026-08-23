import { useEffect, useState } from "react";
import { booksAPI, sermonsAPI, postsAPI, eventsAPI, galleryAPI } from "../api";
import { Icon, Spinner } from "../components/UI";

export default function AdminContentHealth() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const load = async () => {
    setLoading(true);
    const checks = await Promise.allSettled([
      booksAPI.adminAll(), sermonsAPI.getAll(), postsAPI.adminAll(), eventsAPI.getAll(), galleryAPI.adminAll(),
    ]);
    const labels = ["Books", "Sermons", "Articles", "Events", "Gallery albums"];
    setItems(checks.map((result, index) => {
      const data = result.status === "fulfilled" ? result.value.data : [];
      const list = Array.isArray(data) ? data : (data?.items || data?.sermons || data?.posts || data?.events || data?.albums || []);
      return { label: labels[index], count: list.length, status: result.status === "fulfilled" ? (list.length ? "Healthy" : "Needs content") : "Unavailable" };
    }));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  return <div style={{ padding: 28, maxWidth: 1000 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 24 }}><div><h3 style={{ marginBottom: 6 }}>Content Health</h3><p style={{ margin: 0, color: "var(--gray-mid)", fontSize: 14 }}>A quick operational check for empty or unavailable public content.</p></div><button className="btn btn-outline btn-sm" onClick={load}><Icon name="refresh" size={14} /> Refresh</button></div>{loading ? <Spinner /> : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16 }}>{items.map((item) => <div className="card" key={item.label} style={{ padding: 20 }}><div style={{ fontSize: 13, color: "var(--gray-mid)", marginBottom: 10 }}>{item.label}</div><strong style={{ display: "block", fontSize: 30, color: item.status === "Healthy" ? "var(--forest)" : "var(--gold-dark)" }}>{item.count}</strong><span style={{ fontSize: 12, color: "var(--gray-mid)" }}>{item.status}</span></div>)}</div>}<div className="card" style={{ padding: 22, marginTop: 24, background: "var(--info-pale)" }}><strong>Publishing checklist</strong><p style={{ margin: "8px 0 0", color: "var(--gray-dark)", fontSize: 13, lineHeight: 1.7 }}>Before publishing a book, testimony, pastor message, or gallery item, confirm the media is owned or permission has been granted, the title and description are complete, and the item has a clear public destination.</p></div></div>;
}
