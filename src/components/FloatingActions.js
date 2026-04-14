import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function FloatingActions() {
  const { settings } = useApp();
  const [open, setOpen] = useState(false);

  const phone = settings?.whatsappNumber || "";
  const message = encodeURIComponent(
    `Hello! I found your church website and would like to connect with ${settings?.siteName || "your church"}.`,
  );
  const waUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`;

  const actions = [
    {
      icon: "💬",
      label: "WhatsApp",
      color: "#25D366",
      action: () => window.open(waUrl, "_blank"),
    },
    {
      icon: "📘",
      label: "Facebook",
      color: "#1877F2",
      action: () =>
        settings?.facebook && window.open(settings.facebook, "_blank"),
    },
    {
      icon: "▶️",
      label: "YouTube",
      color: "#FF0000",
      action: () =>
        settings?.youtube && window.open(settings.youtube, "_blank"),
    },
    {
      icon: "📸",
      label: "Instagram",
      color: "#E1306C",
      action: () =>
        settings?.instagram && window.open(settings.instagram, "_blank"),
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 24,
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 10,
      }}
    >
      {/* Action buttons */}
      {open &&
        actions.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              animation: "slideUp 0.3s ease",
              animationDelay: `${i * 0.05}s`,
              animationFillMode: "both",
            }}
          >
            <div
              style={{
                background: "var(--white)",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--charcoal)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                whiteSpace: "nowrap",
              }}
            >
              {a.label}
            </div>
            <button
              onClick={a.action}
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: a.color,
                border: "none",
                cursor: "pointer",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 16px ${a.color}55`,
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {a.icon}
            </button>
          </div>
        ))}

      {/* Main toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, var(--forest), var(--forest-mid))",
          border: "none",
          cursor: "pointer",
          fontSize: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(45,43,107,0.4)",
          transform: open ? "rotate(45deg)" : "rotate(0)",
          transition: "transform 0.3s ease",
          color: "white",
        }}
      >
        {open ? "×" : "💬"}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
