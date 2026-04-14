import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import API from "../api";

export default function AnnouncementBar() {
  const { settings, setAnnouncementVisible, setAnnouncementHeight } = useApp();
  const [announcements, setAnnouncements] = useState([]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const barRef = useRef(null);

  useEffect(() => {
    API.get("/announcements")
      .then((r) => {
        if (r.data?.length > 0) setAnnouncements(r.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % announcements.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [announcements]);

  useEffect(() => {
    if (barRef.current && setAnnouncementHeight) {
      setAnnouncementHeight(barRef.current.offsetHeight);
    }
  }, [announcements, visible]);

  if (!visible || announcements.length === 0) return null;

  return (
    // <div
    //   style={{
    //     background:
    //       "linear-gradient(90deg, var(--forest) 0%, var(--forest-mid) 100%)",
    //     color: "white",
    //     padding: "10px 0",
    //     position: "relative",
    //     zIndex: 300,
    //   }}
    // >
    <div
      ref={barRef}
      style={{
        background:
          "linear-gradient(90deg, var(--forest) 0%, var(--forest-mid) 100%)",
        color: "white",
        padding: "10px 0",
        position: "relative",
        zIndex: "auto",
        width: "100%",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", gap: 16 }}
      >
        <div
          style={{
            background: "var(--gold)",
            color: "white",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.5,
            padding: "4px 12px",
            borderRadius: 20,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          NOTICE
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div
            key={current}
            style={{
              fontSize: 14,
              animation: "fadeIn 0.5s ease",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {announcements[current]?.text}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {announcements.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                cursor: "pointer",
                background: i === current ? "white" : "rgba(255,255,255,0.4)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setAnnouncementVisible(false);
          }}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
