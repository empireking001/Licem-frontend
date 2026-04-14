import { useState, useEffect } from "react";
import { postsAPI, commentsAPI } from "../api";
import { Icon, Spinner, PageBanner, EmptyState } from "../components/UI";
import { useApp } from "../context/AppContext";

const CATS = [
  "All",
  "Devotional",
  "Teaching",
  "Family",
  "Prayer",
  "Leadership",
  "Testimony",
  "News",
];

export default function BlogPage() {
  const { showToast, pageTopPadding } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCmt, setNewCmt] = useState({ name: "", email: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = { status: "Published" };
    if (filter !== "All") params.category = filter;
    if (search) params.search = search;
    postsAPI
      .getAll(params)
      .then((r) => setPosts(r.data.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter, search]);

  const openPost = async (p) => {
    setSelected(p);
    setComments([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const r = await commentsAPI.getFor("Post", p._id);
      setComments(r.data || []);
    } catch {}
  };

  const submitComment = async () => {
    if (!newCmt.name || !newCmt.email || !newCmt.text) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await commentsAPI.create({
        ...newCmt,
        refType: "Post",
        refId: selected._id,
        refTitle: selected.title,
      });
      setNewCmt({ name: "", email: "", text: "" });
      showToast("Comment submitted for review!");
    } catch {
      showToast("Error submitting.", "error");
    }
    setSubmitting(false);
  };

  // ── Article detail ──────────────────────────────
  if (selected)
    return (
      <div style={{ paddingTop: 70 }}>
        <div
          style={{
            background: "var(--white)",
            borderBottom: "1px solid var(--gray-light)",
            padding: "14px 0",
          }}
        >
          <div
            className="container"
            style={{ display: "flex", gap: 12, alignItems: "center" }}
          >
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSelected(null)}
            >
              <Icon name="chevLeft" size={14} /> Back to Blog
            </button>
            <span className="badge badge-gold">{selected.category}</span>
          </div>
        </div>
        <div className="container-sm" style={{ padding: "48px 28px" }}>
          <div className="animate-up">
            {selected.image && (
              <div
                style={{
                  aspectRatio: "16/7",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  marginBottom: 36,
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="img-cover"
                />
              </div>
            )}
            <h1 style={{ marginBottom: 16 }}>{selected.title}</h1>
            <div
              style={{
                display: "flex",
                gap: 20,
                color: "var(--gray-mid)",
                fontSize: 14,
                marginBottom: 32,
                flexWrap: "wrap",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="users" size={14} />
                {selected.author}
              </span>
              <span>·</span>
              <span>
                {new Date(selected.createdAt || selected.date).toDateString()}
              </span>
              <span>·</span>
              <span>{selected.views} views</span>
            </div>
            {selected.tags?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 32,
                }}
              >
                {selected.tags.map((t) => (
                  <span key={t} className="badge badge-gray">
                    #{t}
                  </span>
                ))}
              </div>
            )}
            {selected.image && (
              <div style={{ marginBottom: 24 }}>
                <a
                  href={selected.image}
                  download={`${selected.title.replace(/\s+/g, "-")}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 18px",
                    borderRadius: 8,
                    background: "var(--forest-pale)",
                    color: "var(--forest)",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "1px solid var(--forest-pale)",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "var(--forest)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "var(--forest-pale)";
                    e.currentTarget.style.color = "var(--forest)";
                  }}
                >
                  ⬇ Download Article Image
                </a>
              </div>
            )}
            <div className="divider" />
            <div
              style={{
                fontSize: 16.5,
                lineHeight: 2,
                color: "var(--gray-dark)",
                marginBottom: 48,
              }}
            >
              <p
                style={{
                  marginBottom: 20,
                  fontSize: 18,
                  fontStyle: "italic",
                  color: "var(--forest)",
                  lineHeight: 1.8,
                }}
              >
                {selected.excerpt}
              </p>
              {selected.content && <p>{selected.content}</p>}
            </div>
            <div className="divider" />
            <h3 style={{ marginBottom: 24 }}>Comments ({comments.length})</h3>
            {comments.map((c) => (
              <div
                key={c._id}
                style={{
                  padding: "14px 18px",
                  background: "var(--gray-ghost)",
                  borderRadius: "var(--radius)",
                  marginBottom: 12,
                  borderLeft: "3px solid var(--forest-pale)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <strong style={{ fontSize: 14 }}>{c.name}</strong>
                  <span style={{ fontSize: 12, color: "var(--gray-soft)" }}>
                    {new Date(c.createdAt).toDateString()}
                  </span>
                </div>
                <p style={{ fontSize: 14, margin: 0 }}>{c.text}</p>
              </div>
            ))}
            <div
              style={{
                background: "var(--gray-ghost)",
                borderRadius: "var(--radius-lg)",
                padding: 28,
                marginTop: 32,
              }}
            >
              <h4 style={{ fontSize: 18, marginBottom: 20 }}>
                Leave a Comment
              </h4>
              <div className="grid-2" style={{ marginBottom: 14 }}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    value={newCmt.name}
                    onChange={(e) =>
                      setNewCmt((c) => ({ ...c, name: e.target.value }))
                    }
                    placeholder="Your name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newCmt.email}
                    onChange={(e) =>
                      setNewCmt((c) => ({ ...c, email: e.target.value }))
                    }
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 18 }}>
                <label>Comment</label>
                <textarea
                  rows={4}
                  value={newCmt.text}
                  onChange={(e) =>
                    setNewCmt((c) => ({ ...c, text: e.target.value }))
                  }
                  placeholder="Share your thoughts…"
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={submitComment}
                disabled={submitting}
              >
                {submitting ? (
                  <Spinner size={16} color="white" />
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  // ── Post grid ───────────────────────────────────
  return (
    <div style={{ paddingTop: 70 }}>
      <PageBanner
        eyebrow="INSIGHTS & INSPIRATION"
        title="Blog & Articles"
        subtitle="Teachings, devotionals, and stories of faith from our pastoral team."
      />
      <div
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--gray-light)",
          padding: "14px 0",
          position: "sticky",
          top: 70,
          zIndex: 50,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <div
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <Icon name="search" size={15} color="var(--gray-soft)" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              style={{ paddingLeft: 38 }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`btn btn-sm ${filter === c ? "btn-primary" : "btn-ghost"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container" style={{ padding: "48px 28px" }}>
        {loading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 64 }}
          >
            <Spinner size={40} />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon="file"
            title="No articles found"
            desc="Try adjusting your search or category."
          />
        ) : (
          <div className="grid-3">
            {posts.map((p, i) => (
              <div
                key={p._id}
                className="card card-lift animate-up"
                style={{ cursor: "pointer", animationDelay: `${i * 0.08}s` }}
                onClick={() => openPost(p)}
              >
                {p.image && (
                  <div
                    style={{
                      height: 200,
                      backgroundImage: `url(${p.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}
                <div style={{ padding: "20px 22px" }}>
                  <span
                    className="badge badge-gold"
                    style={{ marginBottom: 12 }}
                  >
                    {p.category}
                  </span>
                  <h4 style={{ marginBottom: 10, lineHeight: 1.35 }}>
                    {p.title}
                  </h4>
                  <p
                    style={{
                      fontSize: 13.5,
                      lineHeight: 1.7,
                      marginBottom: 16,
                      color: "var(--gray-mid)",
                    }}
                  >
                    {p.excerpt?.substring(0, 110)}…
                  </p>
                  {p.tags?.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        marginBottom: 16,
                      }}
                    >
                      {p.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="badge badge-gray"
                          style={{ fontSize: 11 }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "var(--gray-soft)",
                      borderTop: "1px solid var(--gray-light)",
                      paddingTop: 14,
                    }}
                  >
                    <span>{p.author}</span>
                    <span>
                      {new Date(p.createdAt || p.date).toDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
