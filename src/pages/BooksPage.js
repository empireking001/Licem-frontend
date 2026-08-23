import { useEffect, useState } from "react";
import { PageBanner, EmptyState, Spinner, Icon } from "../components/UI";
import { booksAPI } from "../api";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  useEffect(() => { booksAPI.getAll().then((r) => setBooks(r.data || [])).catch(() => setBooks([])).finally(() => setLoading(false)); }, []);
  const filtered = books.filter((book) => `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase()));
  const openBook = async (book) => {
    try { const r = await booksAPI.resolveDownload(book._id); window.open(r.data.url, "_blank", "noopener,noreferrer"); }
    catch { window.open(book.resourceUrl, "_blank", "noopener,noreferrer"); }
  };
  return <div><PageBanner eyebrow="READ & GROW" title="Book Library" subtitle="Download and explore resources from the LICEM family." /><section className="section"><div className="container"><div style={{ maxWidth: 520, margin: "0 auto 32px" }}><input aria-label="Search books" placeholder="Search books…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>{loading ? <div style={{ display: "flex", justifyContent: "center", padding: 56 }}><Spinner size={34} /></div> : filtered.length === 0 ? <EmptyState icon="bookOpen" title="No books available yet" desc="New resources will appear here when they are published." /> : <div className="grid-3">{filtered.map((book) => <article className="card card-lift" key={book._id} style={{ overflow: "hidden" }}>{book.coverUrl ? <img src={book.coverUrl} alt="" style={{ width: "100%", height: 180, objectFit: "cover" }} /> : <div style={{ height: 180, display: "grid", placeItems: "center", background: "var(--forest)", color: "var(--gold-light)", fontSize: 44 }}><Icon name="bookOpen" size={52} /></div>}<div style={{ padding: 22 }}><span className="badge badge-green">{book.category || book.resourceType?.toUpperCase()}</span><h3 style={{ fontSize: 20, margin: "12px 0 6px" }}>{book.title}</h3>{book.author && <div style={{ color: "var(--gray-mid)", fontSize: 13, marginBottom: 10 }}>By {book.author}</div>}<p style={{ color: "var(--gray-dark)", lineHeight: 1.6, fontSize: 14 }}>{book.description}</p><button className="btn btn-primary btn-sm" onClick={() => openBook(book)}><Icon name={book.resourceType === "link" ? "link" : "download"} size={14} /> {book.resourceType === "link" ? "Open Resource" : "Download Book"}</button></div></article>)}</div>}</div></section></div>;
}
