import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { PageBanner } from "../components/UI";
import API from "../api";

const CATS = [
  "Healing",
  "Salvation",
  "Financial Breakthrough",
  "Marriage & Family",
  "Career",
  "General Testimony",
];

export default function TestimoniesPage() {
 const { showToast, pageTopPadding } = useApp();
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    title: "",
    story: "",
    category: "General Testimony",
    anonymous: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const S = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    API.get("/testimonies")
      .then((r) => setTestimonies(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!form.story.trim() || !form.title.trim()) {
      showToast("Please fill in your title and story.", "error");
      return;
    }
    try {
      const payload = {
        ...form,
        name: form.anonymous ? "Anonymous" : form.name || "Anonymous",
      };
      const r = await API.post("/testimonies", payload);
      setTestimonies((t) => [r.data, ...t]);
      setSubmitted(true);
      setForm({
        name: "",
        title: "",
        story: "",
        category: "General Testimony",
        anonymous: false,
      });
      showToast("Testimony submitted! Glory to God 🙌");
    } catch {
      showToast("Error. Please try again.", "error");
    }
  };

  const EMOJIS = {
    Healing: "💊",
    Salvation: "✝️",
    "Financial Breakthrough": "💰",
    "Marriage & Family": "👨‍👩‍👧",
    Career: "💼",
    "General Testimony": "🙌",
  };

  return (
    <div style={{ paddingTop: 70 }}>
      <PageBanner
        eyebrow="GLORY TO GOD"
        title="Testimonies"
        subtitle='"They overcame by the blood of the Lamb and by the word of their testimony." — Revelation 12:11'
      />

      <section style={{ padding: "56px 0", background: "var(--cream)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.6fr",
              gap: 40,
              alignItems: "start",
            }}
          >
            {/* SUBMIT FORM */}
            <div style={{ position: "sticky", top: 90 }}>
              <div className="card" style={{ padding: 28 }}>
                {submitted ? (
                  <div style={{ textAlign: "center", padding: "32px 0" }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🙌</div>
                    <h3 style={{ fontSize: 22, marginBottom: 10 }}>
                      Glory to God!
                    </h3>
                    <p
                      style={{
                        color: "var(--gray-mid)",
                        lineHeight: 1.7,
                        marginBottom: 24,
                      }}
                    >
                      Thank you for sharing. Your testimony will be reviewed and
                      published shortly.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setSubmitted(false)}
                    >
                      Share Another
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 style={{ fontSize: 20, marginBottom: 6 }}>
                      Share Your Testimony
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--gray-mid)",
                        marginBottom: 20,
                        lineHeight: 1.6,
                      }}
                    >
                      Your story can strengthen someone else's faith.
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
                          placeholder="Your name"
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
                        Share anonymously
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
                        <label>Title *</label>
                        <input
                          value={form.title}
                          onChange={(e) => S("title", e.target.value)}
                          placeholder="e.g. God healed my daughter"
                        />
                      </div>
                      <div className="form-group">
                        <label>Your Story *</label>
                        <textarea
                          rows={6}
                          value={form.story}
                          onChange={(e) => S("story", e.target.value)}
                          placeholder="Share what God did for you..."
                        />
                      </div>
                      <button
                        className="btn btn-gold"
                        onClick={submit}
                        style={{ justifyContent: "center" }}
                      >
                        🙌 Submit Testimony
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* TESTIMONIES LIST */}
            <div>
              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: 48,
                    color: "var(--gray-mid)",
                  }}
                >
                  Loading testimonies...
                </div>
              ) : testimonies.length === 0 ? (
                <div style={{ textAlign: "center", padding: 48 }}>
                  <div style={{ fontSize: 56, marginBottom: 12 }}>🙌</div>
                  <p style={{ color: "var(--gray-mid)" }}>
                    No testimonies yet. Be the first to share!
                  </p>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 20 }}
                >
                  {testimonies.map((t) => (
                    <div key={t._id} className="card" style={{ padding: 26 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 14,
                          alignItems: "flex-start",
                          marginBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "var(--forest-pale)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 22,
                            flexShrink: 0,
                          }}
                        >
                          {EMOJIS[t.category] || "🙌"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: 18, marginBottom: 4 }}>
                            {t.title}
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              fontSize: 13,
                              color: "var(--gray-mid)",
                              flexWrap: "wrap",
                            }}
                          >
                            <span>{t.anonymous ? "Anonymous" : t.name}</span>
                            <span>·</span>
                            <span>{new Date(t.createdAt).toDateString()}</span>
                            <span className="badge badge-green">
                              {t.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p
                        style={{
                          fontSize: 15,
                          lineHeight: 1.85,
                          color: "var(--gray-dark)",
                        }}
                      >
                        {t.story}
                      </p>
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
