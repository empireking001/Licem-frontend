import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Icon, Spinner } from '../components/UI';
import API, { sermonsAPI, eventsAPI } from '../api';

export default function HomePage() {
  const { pageTopPadding } = useApp();
  const { setPage, settings } = useApp();
  const [sermons, setSermons]   = useState([]);
  const [events,  setEvents]    = useState([]);
  const [email,   setEmail]     = useState('');
  const [subDone, setSubDone]   = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      sermonsAPI.getAll({ limit: 3 }),
      eventsAPI.getAll({ upcoming: true }),
    ]).then(([s, e]) => {
      setSermons(s.data.sermons || []);
      setEvents((e.data || []).slice(0, 4));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${settings?.heroImageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt8QaD-VbBOC8ojk5BPYdNBfKOw-sZlVie5CMgE8NtlQ&s=10"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(27,67,50,0.5) 0%, rgba(10,10,20,0.4) 100%)",
          }}
        />

        {/* Floating orbs */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,149,58,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "5%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(64,145,108,0.2) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        <div
          className="container animate-up"
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            paddingTop: 100,
          }}
        >
          {/* Live chip */}
          {settings?.liveIsActive && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(239,68,68,0.2)",
                border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: 40,
                padding: "8px 20px",
                marginBottom: 28,
              }}
            >
              <span className="live-dot" />
              <span
                style={{
                  color: "#FCA5A5",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                }}
              >
                WE ARE LIVE NOW
              </span>
            </div>
          )}
          {!settings?.liveIsActive && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(201,149,58,0.18)",
                border: "1px solid rgba(201,149,58,0.35)",
                borderRadius: 40,
                padding: "8px 20px",
                marginBottom: 28,
              }}
            >
              <Icon name="calendar" size={13} color="var(--gold-light)" />
              <span
                style={{
                  color: "var(--gold-light)",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                SUNDAYS · 9AM & 11AM
              </span>
            </div>
          )}

          <h1
            style={{
              color: "white",
              fontStyle: "italic",
              letterSpacing: "-0.5px",
              marginBottom: 22,
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            Where Faith Meets
            <br />
            <span style={{ color: "var(--gold-light)", fontStyle: "normal" }}>
              Community
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.78)",
              maxWidth: 540,
              margin: "0 auto 44px",
              fontSize: 18,
              lineHeight: 1.75,
            }}
          >
            {settings?.tagline || "Licem Church"} — a place of worship, growth,
            and belonging. Join thousands experiencing God's grace every week.
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn btn-gold btn-xl"
              onClick={() =>
                window.open(
                  settings?.liveStreamUrl || "https://youtube.com",
                  "_blank",
                )
              }
            >
              <Icon name="play" size={19} /> Join Us Live
            </button>
            <button
              className="btn btn-outline-white btn-xl"
              onClick={() => setPage("about")}
            >
              Our Story <Icon name="arrowRight" size={17} />
            </button>
          </div>

          {/* Service Times Banner */}
          <div
            style={{
              marginTop: 64,
              paddingTop: 40,
              borderTop: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {[
              {
                icon: "⛪",
                label: "Sunday Service",
                time: "9:00 AM & 11:00 AM",
              },
              {
                icon: "📖",
                label: "Midweek Service",
                time: "Wednesday 6:30 PM",
              },
              { icon: "🙏", label: "Prayer Meeting", time: "Friday 6:00 AM" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 24px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 40,
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.6)",
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "white",
                      fontWeight: 600,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {s.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            animation: "bounce 2s infinite",
          }}
        >
          <Icon name="chevDown" size={22} color="rgba(255,255,255,0.4)" />
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }`}</style>
      </section>

      {/* ── UPCOMING EVENTS ──────────────────────── */}
      <section className="section" style={{ background: "var(--cream)" }}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">WHAT'S COMING</span>
            <h2>Upcoming Events</h2>
            <p>Don't miss what God is doing in our community</p>
          </div>
          {loading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 48 }}
            >
              <Spinner size={36} />
            </div>
          ) : (
            <div className="grid-2">
              {events.map((ev, i) => (
                <div
                  key={ev._id}
                  className="card card-lift animate-up"
                  style={{
                    display: "flex",
                    overflow: "hidden",
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div
                    style={{
                      width: 130,
                      minWidth: 130,
                      backgroundImage: `url(${ev.image || "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{ padding: 22, flex: 1 }}>
                    <span
                      className="badge badge-green"
                      style={{ marginBottom: 10 }}
                    >
                      {ev.category}
                    </span>
                    <h4 style={{ marginBottom: 10, lineHeight: 1.3 }}>
                      {ev.title}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          color: "var(--gray-mid)",
                        }}
                      >
                        <Icon name="calendar" size={13} />
                        {new Date(ev.date).toDateString()} · {ev.time}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          color: "var(--gray-mid)",
                        }}
                      >
                        <Icon name="map" size={13} />
                        {ev.location}
                      </span>
                    </div>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: 14 }}
                      onClick={() => setPage("events")}
                    >
                      RSVP <Icon name="arrowRight" size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: 48,
                    color: "var(--gray-mid)",
                  }}
                >
                  No upcoming events yet. Check back soon!
                </div>
              )}
            </div>
          )}
          <div className="text-center" style={{ marginTop: 36 }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setPage("events")}
            >
              All Events <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── LATEST SERMONS ───────────────────────── */}
      <section className="section" style={{ background: "var(--white)" }}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">WORD & WORSHIP</span>
            <h2>Latest Messages</h2>
            <p>Be transformed by the renewing of your mind</p>
          </div>
          {loading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 48 }}
            >
              <Spinner size={36} />
            </div>
          ) : (
            <div className="grid-3">
              {sermons.map((s, i) => (
                <div
                  key={s._id}
                  className="card card-lift animate-up"
                  style={{ cursor: "pointer", animationDelay: `${i * 0.12}s` }}
                  onClick={() => setPage("sermons")}
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
                        background: "rgba(0,0,0,0.28)",
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
                          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                        }}
                      >
                        <Icon name="play" size={20} color="var(--forest)" />
                      </div>
                    </div>
                    {s.pinned && (
                      <div style={{ position: "absolute", top: 12, right: 12 }}>
                        <span className="badge badge-gold">
                          <Icon name="pin" size={11} /> Featured
                        </span>
                      </div>
                    )}
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                      <span className="badge badge-green">{s.category}</span>
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
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
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Icon name="chat" size={13} />
                        {s.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center" style={{ marginTop: 36 }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setPage("sermons")}
            >
              All Messages <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────── */}
      <section
        className="section"
        style={{
          background:
            "linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 60%, var(--forest-mid) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(201,149,58,0.08)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="container text-center animate-up"
          style={{ position: "relative" }}
        >
          <span
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "var(--gold-light)",
              marginBottom: 16,
            }}
          >
            GET INVOLVED
          </span>
          <h2 style={{ color: "white", marginBottom: 16 }}>
            Take Your Next Step
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              maxWidth: 480,
              margin: "0 auto 44px",
              fontSize: 17,
            }}
          >
            Whether you're new here or have been attending for years, there's
            always a next step to take in your faith journey.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn btn-gold btn-lg"
              onClick={() => setPage("give")}
            >
              Give Today <Icon name="arrowRight" size={16} />
            </button>
            <button
              className="btn btn-outline-white btn-lg"
              onClick={() => setPage("contact")}
            >
              Connect With Us
            </button>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ──────────────────────── */}
      <section className="section" style={{ background: "var(--gray-ghost)" }}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">OUR MOMENTS</span>
            <h2>Photo Gallery</h2>
            <p>Glimpses of life and faith in our community</p>
          </div>
          <div className="gallery-4">
            {[
              "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&q=80",
              "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
              "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=400&q=80",
              "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80",
            ].map((src, i) => (
              <div
                key={i}
                className="card"
                style={{
                  aspectRatio: "1",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => setPage("gallery")}
              >
                <img
                  src={src}
                  alt=""
                  className="img-cover"
                  style={{ transition: "transform 0.4s var(--ease)" }}
                  onMouseOver={(e) =>
                    (e.target.style.transform = "scale(1.06)")
                  }
                  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                />
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 32 }}>
            <button
              className="btn btn-primary"
              onClick={() => setPage("gallery")}
            >
              <Icon name="images" size={16} /> View Full Gallery
            </button>
          </div>
        </div>
      </section>

      {/* ── FACE OF THE WEEK ────────────────── */}
      {settings?.faceOfWeekImage && (
        <section style={{ padding: "72px 0", background: "var(--white)" }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: "var(--gold-bright)",
                  display: "block",
                  marginBottom: 12,
                  fontFamily: "var(--font-body)",
                }}
              >
                SPOTLIGHT
              </span>
              <h2>Face of the Week</h2>
            </div>
            <div
              className="spotlight-grid"
              style={{
                background: "var(--gray-ghost)",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={settings.faceOfWeekImage}
                  alt={settings.faceOfWeekName}
                  style={{
                    width: "100%",
                    height: 320,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, transparent 60%, var(--gray-ghost))",
                  }}
                />
              </div>
              <div style={{ padding: "32px 32px 32px 0" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 14px",
                    borderRadius: 20,
                    background: "var(--gold-pale)",
                    color: "var(--gold)",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    marginBottom: 16,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  This Week
                </div>
                <h3
                  style={{
                    fontSize: "clamp(22px, 3vw, 34px)",
                    marginBottom: 8,
                  }}
                >
                  {settings.faceOfWeekName}
                </h3>
                {settings.faceOfWeekTitle && (
                  <p
                    style={{
                      color: "var(--gold)",
                      fontWeight: 600,
                      fontSize: 15,
                      marginBottom: 20,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {settings.faceOfWeekTitle}
                  </p>
                )}
                {settings.faceOfWeekQuote && (
                  <blockquote
                    style={{
                      borderLeft: "4px solid var(--gold)",
                      paddingLeft: 20,
                      color: "var(--gray-dark)",
                      fontSize: 16,
                      lineHeight: 1.8,
                      fontStyle: "italic",
                      margin: 0,
                    }}
                  >
                    "{settings.faceOfWeekQuote}"
                  </blockquote>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── BIRTHDAY CELEBRANTS ─────────────── */}
      <BirthdayCelebrantsSection />

      {/* ── NEWSLETTER ───────────────────────────── */}
      <section className="section-sm" style={{ background: "var(--white)" }}>
        <div className="container-sm text-center">
          <span className="eyebrow">STAY CONNECTED</span>
          <h2 style={{ marginBottom: 12 }}>Get Weekly Devotionals</h2>
          <p style={{ marginBottom: 36 }}>
            Receive sermons, events updates and encouragement straight to your
            inbox.
          </p>
          {subDone ? (
            <div
              style={{
                padding: "20px 32px",
                background: "var(--forest-pale)",
                borderRadius: 12,
                color: "var(--forest)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              ✓ You're subscribed! Welcome to the family.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 12,
                maxWidth: 480,
                margin: "0 auto",
                flexWrap: "wrap",
              }}
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                type="email"
                style={{ flex: 1, minWidth: 220 }}
              />
              <button
                className="btn btn-primary"
                onClick={() => email && setSubDone(true)}
              >
                Subscribe <Icon name="mail" size={15} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
  function BirthdayCelebrantsSection() {
    const [data, setData] = useState({
      today: [],
      thisWeek: [],
      thisMonth: [],
    });
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("today");

    useEffect(() => {
      API.get("/birthdays")
        .then((r) => setData(r.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, []);

    const hasAny =
      data.today.length > 0 ||
      data.thisWeek.length > 0 ||
      data.thisMonth.length > 0;
    if (!loading && !hasAny) return null;

    const TABS = [
      { key: "today", label: "🎂 Today", count: data.today.length },
      { key: "thisWeek", label: "📅 This Week", count: data.thisWeek.length },
      {
        key: "thisMonth",
        label: "🎉 This Month",
        count: data.thisMonth.length,
      },
    ];

    const current = data[tab] || [];

    return (
      <section
        style={{
          padding: "72px 0",
          background: "linear-gradient(135deg, #1a1a2e 0%, #2D2B6B 100%)",
        }}
      >
        <div className="container" style={{ maxWidth: 780 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "var(--gold-light)",
                display: "block",
                marginBottom: 12,
                fontFamily: "var(--font-body)",
              }}
            >
              CELEBRATING OUR FAMILY
            </span>
            <h2 style={{ color: "white", marginBottom: 8 }}>
              Birthday Celebrants
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>
              We celebrate every member of this family
            </p>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 24,
                  border: `1.5px solid ${tab === t.key ? "var(--gold-light)" : "rgba(255,255,255,0.2)"}`,
                  background:
                    tab === t.key ? "rgba(201,149,58,0.2)" : "transparent",
                  color:
                    tab === t.key
                      ? "var(--gold-light)"
                      : "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.2s",
                }}
              >
                {t.label}
                {t.count > 0 && (
                  <span
                    style={{
                      marginLeft: 8,
                      background: "var(--gold)",
                      color: "white",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.5)",
                padding: 32,
              }}
            >
              Loading...
            </div>
          ) : current.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 24px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 16,
                color: "rgba(255,255,255,0.5)",
                fontSize: 15,
              }}
            >
              {tab === "today"
                ? "No birthdays today — check back tomorrow! 🎈"
                : tab === "thisWeek"
                  ? "No birthdays this week."
                  : "No birthdays registered for this month yet."}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 14,
              }}
            >
              {current.map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 14,
                    padding: "18px 16px",
                    textAlign: "center",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🎂</div>
                  <div
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: 15,
                      marginBottom: 6,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {p.name || "Church Member"}
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: "rgba(201,149,58,0.25)",
                      color: "var(--gold-light)",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {p.day} {p.month}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
}
