import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { PageBanner } from "../components/UI";
import API from "../api";

const CATS = [
  "General",
  "Health & Healing",
  "Family",
  "Finance",
  "Salvation",
  "Relationships",
  "Career",
  "Thanksgiving",
];

const CAT_COLORS = {
  "Health & Healing": "#DC2626",
  Family: "#7C3AED",
  Finance: "#059669",
  Salvation: "#2D2B6B",
  Relationships: "#DB2777",
  Career: "#D97706",
  Thanksgiving: "#F59E0B",
  General: "#6B7280",
};

export default function PrayerWallPage() {
  const { showToast, pageTopPadding } = useApp();
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [prayedFor, setPrayedFor] = useState({});
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    name: "",
    request: "",
    category: "General",
    anonymous: false,
  });
  const S = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    API.get("/prayers")
      .then((r) => setPrayers(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getVisitorId = () => {
    let id = localStorage.getItem("gl_vid");
    if (!id) {
      id = "v_" + Math.random().toString(36).slice(2);
      localStorage.setItem("gl_vid", id);
    }
    return id;
  };

  const submit = async () => {
    if (!form.request.trim()) {
      showToast("Please enter your prayer request.", "error");
      return;
    }
    try {
      const payload = {
        ...form,
        name: form.anonymous ? "Anonymous" : form.name || "Anonymous",
      };
      const r = await API.post("/prayers", payload);
      setPrayers((p) => [r.data, ...p]);
      setSubmitted(true);
      setForm({ name: "", request: "", category: "General", anonymous: false });
      showToast("Prayer request submitted 🙏");
    } catch {
      showToast("Error. Please try again.", "error");
    }
  };

  const prayFor = async (id) => {
    if (prayedFor[id]) return;
    try {
      const r = await API.post(`/prayers/${id}/pray`, {
        visitorId: getVisitorId(),
      });
      setPrayers((p) =>
        p.map((x) =>
          x._id === id ? { ...x, prayerCount: r.data.prayerCount } : x,
        ),
      );
      setPrayedFor((p) => ({ ...p, [id]: true }));
      showToast("You prayed for this request 🙏");
    } catch {}
  };

  const filtered =
    filter === "All" ? prayers : prayers.filter((p) => p.category === filter);

  return (
    <div style={{ paddingTop: 70 }}>
      <PageBanner
        eyebrow="COMMUNITY PRAYER"
        title="Prayer Wall"
        subtitle='"Where two or three gather in my name, there am I." — Matthew 18:20'
      />

      <section style={{ padding: "56px 0", background: "var(--cream)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.7fr",
              gap: 40,
              alignItems: "start",
            }}
          >
            {/* FORM */}
            <div style={{ position: "sticky", top: 90 }}>
              <div className="card" style={{ padding: 28 }}>
                {submitted ? (
                  <div style={{ textAlign: "center", padding: "32px 0" }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🙏</div>
                    <h3 style={{ fontSize: 22, marginBottom: 10 }}>
                      Request Submitted!
                    </h3>
                    <p
                      style={{
                        color: "var(--gray-mid)",
                        lineHeight: 1.7,
                        marginBottom: 24,
                      }}
                    >
                      Our community is standing in prayer for you.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setSubmitted(false)}
                    >
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 style={{ fontSize: 20, marginBottom: 6 }}>
                      Share Your Request
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--gray-mid)",
                        marginBottom: 20,
                        lineHeight: 1.6,
                      }}
                    >
                      Your request is safe and will be prayed over by our
                      community.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      <div className="form-group">
                        <label>Your Name</label>
                        <input
                          value={form.name}
                          onChange={(e) => S("name", e.target.value)}
                          placeholder="Leave blank to stay anonymous"
                          disabled={form.anonymous}
                        />
                      </div>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          cursor: "pointer",
                          fontSize: 14,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={form.anonymous}
                          onChange={(e) => S("anonymous", e.target.checked)}
                          style={{ width: "auto" }}
                        />
                        Post anonymously
                      </label>
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          value={form.category}
                          onChange={(e) => S("category", e.target.value)}
                        >
                          {CATS.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Prayer Request *</label>
                        <textarea
                          rows={5}
                          value={form.request}
                          onChange={(e) => S("request", e.target.value)}
                          placeholder="Share what you would like the church to pray for..."
                        />
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={submit}
                        style={{ justifyContent: "center" }}
                      >
                        🙏 Submit Prayer Request
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Stats */}
              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div
                  className="card"
                  style={{ padding: "16px", textAlign: "center" }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "var(--forest)",
                    }}
                  >
                    {prayers.length}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--gray-mid)",
                      marginTop: 4,
                    }}
                  >
                    Prayer Requests
                  </div>
                </div>
                <div
                  className="card"
                  style={{ padding: "16px", textAlign: "center" }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "var(--gold)",
                    }}
                  >
                    {prayers.reduce((a, p) => a + (p.prayerCount || 0), 0)}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--gray-mid)",
                      marginTop: 4,
                    }}
                  >
                    Times Prayed
                  </div>
                </div>
              </div>
            </div>

            {/* PRAYER LIST */}
            <div>
              {/* Filter tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 24,
                }}
              >
                {["All", ...CATS].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`btn btn-sm ${filter === c ? "btn-primary" : "btn-ghost"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: 48,
                    color: "var(--gray-mid)",
                  }}
                >
                  Loading prayers...
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: 48 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🙏</div>
                  <p style={{ color: "var(--gray-mid)" }}>
                    No prayer requests yet. Be the first to share.
                  </p>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {filtered.map((p) => (
                    <div
                      key={p._id}
                      className="card"
                      style={{
                        padding: 22,
                        borderLeft: `4px solid ${CAT_COLORS[p.category] || "#6B7280"}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 10,
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: CAT_COLORS[p.category] + "22",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 16,
                            }}
                          >
                            🙏
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                              {p.anonymous
                                ? "Anonymous"
                                : p.name || "Anonymous"}
                            </div>
                            <div
                              style={{ fontSize: 12, color: "var(--gray-mid)" }}
                            >
                              {new Date(p.createdAt).toDateString()}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <span
                            className="badge"
                            style={{
                              background: CAT_COLORS[p.category] + "18",
                              color: CAT_COLORS[p.category],
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "3px 10px",
                              borderRadius: 20,
                            }}
                          >
                            {p.category}
                          </span>
                          {p.answered && (
                            <span className="badge badge-green">
                              ✓ Answered
                            </span>
                          )}
                        </div>
                      </div>
                      <p
                        style={{
                          fontSize: 15,
                          lineHeight: 1.75,
                          color: "var(--gray-dark)",
                          marginBottom: 14,
                        }}
                      >
                        {p.request}
                      </p>
                      <button
                        onClick={() => prayFor(p._id)}
                        style={{
                          background: prayedFor[p._id]
                            ? "var(--forest-pale)"
                            : "var(--gray-pale)",
                          color: prayedFor[p._id]
                            ? "var(--forest)"
                            : "var(--gray-mid)",
                          border: `1.5px solid ${prayedFor[p._id] ? "var(--forest-mid)" : "var(--gray-light)"}`,
                          borderRadius: 8,
                          padding: "7px 16px",
                          cursor: prayedFor[p._id] ? "default" : "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          transition: "all 0.2s",
                        }}
                      >
                        🙏 {prayedFor[p._id] ? "Prayed!" : "I Prayed"} ·{" "}
                        {p.prayerCount || 0}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
