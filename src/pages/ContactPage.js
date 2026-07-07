import { useState } from 'react';
import { Icon, PageBanner } from '../components/UI';
import { useApp } from '../context/AppContext';
import API from "../api";

export default function ContactPage() {
 const { showToast, pageTopPadding, settings } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
const [sent, setSent] = useState(false);
const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) {
      showToast("Please fill in name, email and message.", "error");
      return;
    }
    setLoading(true);
    try {
      await API.post("/contact", form);
      setSent(true);
    } catch (err) {
      showToast("Failed to send message. Please try again.", "error");
    }
    setLoading(false);
  };

  return (
    <div style={{ paddingTop: 70 }}>
      <PageBanner
        eyebrow="GET IN TOUCH"
        title="Contact Us"
        subtitle="We'd love to hear from you. Our team is here to help."
      />

      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 64, alignItems: "start" }}>
            {/* Info */}
            <div>
              <h2 style={{ marginBottom: 28 }}>Visit or Connect</h2>
              {[
                {
                  icon: "map",
                  label: "Address",
                  val:
                    settings?.address ||
                    "14 Grace Avenue, Victoria Island, Lagos, Nigeria",
                },
                {
                  icon: "mail",
                  label: "Email",
                  val: settings?.email || "hello@gracelifechurch.org",
                },
                {
                  icon: "activity",
                  label: "Sunday Services",
                  val: "Every Sunday — 9:00 AM & 11:00 AM",
                },
                {
                  icon: "calendar",
                  label: "Midweek Service",
                  val: "Every Wednesday — 6:30 PM",
                },
                {
                  icon: "users",
                  label: "Prayer Meeting",
                  val: "Every Friday — 6:00 AM",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", gap: 16, marginBottom: 24 }}
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
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={item.icon} size={20} color="var(--forest)" />
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        color: "var(--gray-soft)",
                        marginBottom: 5,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        color: "var(--charcoal)",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.val}
                    </div>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div style={{ marginTop: 36 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    color: "var(--gray-soft)",
                    marginBottom: 16,
                  }}
                >
                  FOLLOW US
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    ["F", "facebook", settings?.facebook],
                    ["Y", "youtube", settings?.youtube],
                    ["I", "instagram", settings?.instagram],
                    ["T", "twitter", settings?.twitter],
                  ]
                    .filter(([, , url]) => url)
                    .map(([l, , url]) => (
                      <a
                        key={l}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: "var(--forest-pale)",
                          border: "1px solid var(--forest-pale)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--forest)",
                          fontWeight: 700,
                          fontSize: 15,
                          textDecoration: "none",
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "var(--forest)";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background =
                            "var(--forest-pale)";
                          e.currentTarget.style.color = "var(--forest)";
                        }}
                      >
                        {l}
                      </a>
                    ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div
                style={{
                  marginTop: 36,
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--gray-light)",
                  height: 220,
                  background: "var(--gray-pale)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <Icon name="map" size={36} color="var(--gray-light)" />
                <p style={{ color: "var(--gray-soft)", fontSize: 14 }}>
                  Map embed — add Google Maps API key in settings
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="card" style={{ padding: 36 }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 64, marginBottom: 20 }}>✉️</div>
                  <h3 style={{ fontSize: 26, marginBottom: 12 }}>
                    Message Sent!
                  </h3>
                  <p
                    style={{
                      color: "var(--gray-mid)",
                      lineHeight: 1.8,
                      marginBottom: 28,
                    }}
                  >
                    We've received your message and will get back to you within
                    24 hours.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSent(false);
                      setForm({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: 22, marginBottom: 28 }}>
                    Send a Message
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <div className="grid-2">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                          placeholder="Your name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                          }
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Subject</label>
                      <input
                        value={form.subject}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, subject: e.target.value }))
                        }
                        placeholder="How can we help?"
                      />
                    </div>
                    <div className="form-group">
                      <label>Message *</label>
                      <textarea
                        rows={6}
                        value={form.message}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, message: e.target.value }))
                        }
                        placeholder="Write your message here…"
                      />
                    </div>
                    <button
                      className="btn btn-primary btn-lg btn-full"
                      style={{
                        justifyContent: "center",
                        opacity: loading ? 0.7 : 1,
                      }}
                      onClick={handleSend}
                      disabled={
                        !form.name || !form.email || !form.message || loading
                      }
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Icon name="mail" size={17} /> Send Message
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
