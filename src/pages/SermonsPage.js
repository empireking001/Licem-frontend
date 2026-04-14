import { useState, useEffect } from "react";
import { sermonsAPI, commentsAPI } from "../api";
import { Icon, Spinner, PageBanner, EmptyState } from "../components/UI";
import { useApp } from "../context/AppContext";

const CATS = [
  "All",
  "Sunday Service",
  "Special Program",
  "Midweek",
  "Youth Service",
];

export default function SermonsPage() {
  const { showToast, pageTopPadding } = useApp();
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [liked, setLiked] = useState({});
  const [comments, setComments] = useState([]);
  const [newCmt, setNewCmt] = useState({ name: "", email: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const visitorId = () => {
    let id = localStorage.getItem("gl_vid");
    if (!id) {
      id = "v_" + Math.random().toString(36).slice(2);
      localStorage.setItem("gl_vid", id);
    }
    return id;
  };

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filter !== "All") params.category = filter;
    if (search) params.search = search;
    sermonsAPI
      .getAll(params)
      .then((r) => setSermons(r.data.sermons || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter, search]);

  const openSermon = async (s) => {
    setSelected(s);
    setComments([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const r = await commentsAPI.getFor("Sermon", s._id);
      setComments(r.data || []);
    } catch {}
  };

  const handleLike = async () => {
    if (!selected) return;
    try {
      const r = await sermonsAPI.like(selected._id, visitorId());
      setLiked((l) => ({ ...l, [selected._id]: r.data.liked }));
      setSelected((s) => ({ ...s, likes: r.data.likes }));
      setSermons((ss) =>
        ss.map((s) =>
          s._id === selected._id ? { ...s, likes: r.data.likes } : s,
        ),
      );
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
        refType: "Sermon",
        refId: selected._id,
        refTitle: selected.title,
      });
      setNewCmt({ name: "", email: "", text: "" });
      showToast("Comment submitted for review. Thank you!");
    } catch {
      showToast("Error submitting comment.", "error");
    }
    setSubmitting(false);
  };

  // ── Sermon detail view ──────────────────────────
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
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSelected(null)}
            >
              <Icon name="chevLeft" size={14} /> All Messages
            </button>
            <span className="badge badge-green">{selected.category}</span>
          </div>
        </div>

        <div
          className="container"
          style={{ padding: "48px 28px", maxWidth: 900 }}
        >
          <div className="animate-up">
            <h1
              style={{ fontSize: "clamp(24px, 4vw, 42px)", marginBottom: 12 }}
            >
              {selected.title}
            </h1>
            <div
              style={{
                display: "flex",
                gap: 20,
                color: "var(--gray-mid)",
                fontSize: 14,
                marginBottom: 32,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="users" size={14} />
                {selected.speaker}
              </span>
              <span>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="calendar" size={14} />
                {new Date(selected.date).toDateString()}
              </span>
              <span>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="eye" size={14} />
                {(selected.views || 0).toLocaleString()} views
              </span>
            </div>

            {/* Video */}
            <div
              style={{
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                aspectRatio: "16/9",
                background: "#000",
                boxShadow: "var(--shadow-lg)",
                marginBottom: 28,
              }}
            >
              {selected.videoUrl ? (
                <iframe
                  src={selected.videoUrl}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allowFullScreen
                  title={selected.title}
                />
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 14,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  <Icon name="video" size={48} color="rgba(255,255,255,0.3)" />
                  <span style={{ fontSize: 15 }}>Video coming soon</span>
                </div>
              )}
            </div>

            {/* Action row */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 32,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleLike}
                className="btn btn-sm"
                style={{
                  background: liked[selected._id]
                    ? "var(--danger-pale)"
                    : "var(--gray-pale)",
                  color: liked[selected._id]
                    ? "var(--danger)"
                    : "var(--gray-dark)",
                  border: `1.5px solid ${liked[selected._id] ? "var(--danger)" : "var(--gray-light)"}`,
                }}
              >
                <Icon
                  name="heart"
                  size={15}
                  color={liked[selected._id] ? "var(--danger)" : "currentColor"}
                />
                {selected.likes || 0} Likes
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  navigator.share?.({
                    title: selected.title,
                    url: window.location.href,
                  })
                }
              >
                <Icon name="share" size={15} /> Share
              </button>
              {selected.thumbnail && (
                <a
                  href={selected.thumbnail}
                  download={`${selected.title.replace(/\s+/g, "-")}-thumbnail.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  ⬇ Save Image
                </a>
              )}
              {selected.audioUrl && (
                <a
                  href={selected.audioUrl}
                  className="btn btn-ghost btn-sm"
                  download
                >
                  <Icon name="download" size={15} /> Audio
                </a>
              )}
            </div>

            {/* Description */}
            {selected.description && (
              <>
                <div className="divider" />
                <p style={{ fontSize: 16, lineHeight: 1.9, marginBottom: 40 }}>
                  {selected.description}
                </p>
              </>
            )}

            {/* Comments */}
            <div className="divider" />
            <h3 style={{ marginBottom: 24 }}>Comments ({comments.length})</h3>
            {comments.length === 0 ? (
              <p style={{ color: "var(--gray-mid)", marginBottom: 32 }}>
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              <div style={{ marginBottom: 40 }}>
                {comments.map((c) => (
                  <div
                    key={c._id}
                    style={{
                      padding: "16px 20px",
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
                        marginBottom: 8,
                      }}
                    >
                      <strong style={{ fontSize: 14 }}>{c.name}</strong>
                      <span style={{ fontSize: 12, color: "var(--gray-soft)" }}>
                        {new Date(c.createdAt).toDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Comment form */}
            <div
              style={{
                background: "var(--gray-ghost)",
                borderRadius: "var(--radius-lg)",
                padding: 28,
              }}
            >
              <h4 style={{ fontSize: 18, marginBottom: 20 }}>
                Leave a Comment
              </h4>
              <div className="grid-2" style={{ marginBottom: 14 }}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    value={newCmt.name}
                    onChange={(e) =>
                      setNewCmt((c) => ({ ...c, name: e.target.value }))
                    }
                    placeholder="John Doe"
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
                    placeholder="john@email.com"
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
                  placeholder="Share your thoughts, testimony, or questions…"
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
                  <>
                    <Icon name="chat" size={15} /> Post Comment
                  </>
                )}
              </button>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--gray-soft)",
                  marginTop: 10,
                }}
              >
                Comments are reviewed before appearing.
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  // ── Sermon list ─────────────────────────────────
  const pinned = sermons.filter((s) => s.pinned);
  const regular = sermons.filter((s) => !s.pinned);

  return (
    <div style={{ paddingTop: 70 }}>
      <PageBanner
        eyebrow="WORD & WORSHIP"
        title="Sermons & Messages"
        subtitle="Watch or listen to powerful messages that will transform your life and deepen your walk with God."
      />

      {/* Sticky filter bar */}
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
            alignItems: "center",
            flexWrap: "wrap",
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
              placeholder="Search messages…"
              style={{ paddingLeft: 38, fontSize: 14 }}
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
        ) : (
          <>
            {/* Featured */}
            {pinned.length > 0 && !search && filter === "All" && (
              <div style={{ marginBottom: 56 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: "var(--gold-bright)",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Icon name="pin" size={14} color="var(--gold-bright)" />{" "}
                  FEATURED MESSAGE
                </div>
                {pinned.map((s) => (
                  <div
                    key={s._id}
                    className="card"
                    style={{
                      display: "flex",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={() => openSermon(s)}
                  >
                    <div
                      style={{
                        flex: "0 0 40%",
                        backgroundImage: `url(${s.thumbnail || "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: 260,
                      }}
                    />
                    <div style={{ padding: "36px 40px", flex: 1 }}>
                      <span
                        className="badge badge-gold"
                        style={{ marginBottom: 16 }}
                      >
                        Featured
                      </span>
                      <h2 style={{ marginBottom: 12 }}>{s.title}</h2>
                      <p style={{ color: "var(--gray-mid)", marginBottom: 16 }}>
                        {s.speaker} · {new Date(s.date).toDateString()}
                      </p>
                      <p style={{ lineHeight: 1.8, marginBottom: 24 }}>
                        {s.description}
                      </p>
                      <button className="btn btn-primary btn-lg">
                        <Icon name="play" size={18} /> Watch Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid */}
            {regular.length === 0 && pinned.length === 0 ? (
              <EmptyState
                icon="video"
                title="No sermons found"
                desc="Try a different search or category filter."
              />
            ) : (
              <div className="grid-3">
                {regular.map((s, i) => (
                  <div
                    key={s._id}
                    className="card card-lift animate-up"
                    style={{
                      cursor: "pointer",
                      animationDelay: `${i * 0.08}s`,
                    }}
                    onClick={() => openSermon(s)}
                  >
                    <div style={{ position: "relative" }}>
                      <div
                        className="aspect-video"
                        style={{
                          backgroundImage: `url(${s.thumbnail || "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600"})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0,0,0,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            background: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                          }}
                        >
                          <Icon name="play" size={20} color="var(--forest)" />
                        </div>
                      </div>
                      <div style={{ position: "absolute", top: 10, left: 10 }}>
                        <span className="badge badge-green">{s.category}</span>
                      </div>
                    </div>
                    <div style={{ padding: "18px 20px" }}>
                      <h4 style={{ marginBottom: 8, lineHeight: 1.35 }}>
                        {s.title}
                      </h4>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--gray-mid)",
                          marginBottom: 14,
                        }}
                      >
                        {s.speaker} · {new Date(s.date).toDateString()}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          color: "var(--gray-soft)",
                          fontSize: 13,
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Icon name="eye" size={13} />
                          {(s.views || 0).toLocaleString()}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Icon name="heart" size={13} />
                          {s.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
