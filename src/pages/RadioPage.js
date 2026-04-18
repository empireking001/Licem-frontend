import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { PageBanner } from "../components/UI";

export default function RadioPage() {
  const { settings } = useApp();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const streamUrl = settings?.radioStreamUrl || "";
  const radioName = settings?.radioName || "LICEM Radio";

  const togglePlay = () => {
    if (!streamUrl) {
      setError("Radio stream not configured yet. Check back soon.");
      return;
    }
    setError("");
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      setLoading(true);
      if (audioRef.current) {
        audioRef.current.src = streamUrl;
        audioRef.current.volume = volume;
        audioRef.current
          .play()
          .then(() => {
            setPlaying(true);
            setLoading(false);
          })
          .catch(() => {
            setError("Could not connect to stream. Please try again.");
            setLoading(false);
          });
      }
    }
  };

  const handleVolume = (v) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div style={{ paddingTop: 70 }}>
      <PageBanner
        eyebrow="LISTEN LIVE"
        title={radioName}
        subtitle="Worship, teaching, and encouragement — available wherever you are."
      />

      <section
        style={{
          padding: "64px 0",
          background: "var(--cream)",
          minHeight: "50vh",
        }}
      >
        <div className="container" style={{ maxWidth: 700 }}>
          {/* Main player card */}
          <div
            style={{
              background: "linear-gradient(135deg, #1a1a2e 0%, #2D2B6B 100%)",
              borderRadius: 24,
              padding: "48px 40px",
              textAlign: "center",
              boxShadow: "0 24px 64px rgba(45,43,107,0.35)",
              marginBottom: 32,
            }}
          >
            {/* Animated waves when playing */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                marginBottom: 32,
                height: 48,
                alignItems: "flex-end",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    borderRadius: 3,
                    background: playing
                      ? "var(--gold-light)"
                      : "rgba(255,255,255,0.2)",
                    height: playing ? `${20 + Math.random() * 28}px` : "8px",
                    animation: playing
                      ? `wave ${0.5 + i * 0.1}s ease-in-out infinite alternate`
                      : "none",
                    transition: "height 0.3s",
                  }}
                />
              ))}
            </div>

            <div
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 12,
                fontFamily: "var(--font-body)",
              }}
            >
              {settings?.radioIsLive ? "🔴 LIVE" : "📻 STREAM"}
            </div>
            <h2
              style={{
                color: "white",
                marginBottom: 8,
                fontSize: "clamp(20px,3vw,32px)",
              }}
            >
              {radioName}
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                marginBottom: 36,
                fontFamily: "var(--font-body)",
                fontSize: 15,
              }}
            >
              {playing ? "Now streaming..." : "Click play to start listening"}
            </p>

            {error && (
              <div
                style={{
                  background: "rgba(220,38,38,0.2)",
                  border: "1px solid rgba(220,38,38,0.4)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  color: "#FCA5A5",
                  fontSize: 14,
                  marginBottom: 24,
                  fontFamily: "var(--font-body)",
                }}
              >
                {error}
              </div>
            )}

            {/* Play button */}
            <button
              onClick={togglePlay}
              disabled={loading}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: playing ? "rgba(220,38,38,0.8)" : "var(--gold)",
                border: "none",
                cursor: "pointer",
                fontSize: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                boxShadow: playing
                  ? "0 0 32px rgba(220,38,38,0.4)"
                  : "0 8px 32px rgba(201,149,58,0.4)",
                transition: "all 0.3s",
              }}
            >
              {loading ? "⏳" : playing ? "⏸" : "▶"}
            </button>

            {/* Volume */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 18 }}>🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolume(Number(e.target.value))}
                style={{ width: 160, accentColor: "var(--gold-light)" }}
              />
              <span style={{ fontSize: 18 }}>🔊</span>
            </div>
          </div>

          {/* Info cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                icon: "📖",
                title: "Bible Teaching",
                desc: "Sound doctrine daily",
              },
              {
                icon: "🎵",
                title: "Worship Music",
                desc: "Spirit-filled praise",
              },
              {
                icon: "🙏",
                title: "Prayer Sessions",
                desc: "Intercession live",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="card"
                style={{ padding: "20px 18px", textAlign: "center" }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--gray-mid)" }}>
                  {c.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <audio ref={audioRef} preload="none" />

      <style>{`
        @keyframes wave {
          from { height: 8px; }
          to { height: 40px; }
        }
      `}</style>
    </div>
  );
}
