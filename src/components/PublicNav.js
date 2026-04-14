import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "./UI";

const NAV_LINKS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "sermons", label: "Sermons" },
  { key: "events", label: "Events" },
  { key: "gallery", label: "Gallery" },
  { key: "prayer", label: "Prayer Wall" },
  { key: "blog", label: "Blog" },
  { key: "give", label: "Give" },
  { key: "contact", label: "Contact" },
  { key: "testimonies", label: "Testimonies" },
  { key: "connect", label: "Connect" },
];

export default function PublicNav() {
  const { page, setPage, dark, setDark, settings } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isHome = page === "home";
  const navBg = scrolled || menuOpen || !isHome;
  const siteName =
    settings?.siteName || "Living Christ Evangelical Ministries";

  return (
    // <header style={{
    //   position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
    //   background: navBg ? 'var(--white)' : 'transparent',
    //   backdropFilter: navBg ? 'blur(16px)' : 'none',
    //   boxShadow: navBg ? 'var(--shadow-sm)' : 'none',
    //   borderBottom: navBg ? '1px solid var(--gray-light)' : 'none',
    //   transition: 'all 0.35s var(--ease)',
    // }}>
    <header
      style={{
        position: "relative",
        top: "auto",
        left: "auto",
        right: "auto",
        zIndex: "auto",
        background: navBg ? "var(--white)" : "transparent",
        backdropFilter: navBg ? "blur(16px)" : "none",
        boxShadow: navBg ? "var(--shadow-sm)" : "none",
        borderBottom: navBg ? "1px solid var(--gray-light)" : "none",
        transition: "all 0.35s var(--ease)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 70,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => {
            setPage("home");
            setMenuOpen(false);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 11,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              flexShrink: 0,
              background:
                "linear-gradient(135deg, var(--forest), var(--forest-mid))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(27,67,50,0.3)",
            }}
          >
            G
          </div>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 19,
                lineHeight: 1.1,
                color: navBg ? "var(--charcoal)" : "white",
                transition: "color 0.3s",
              }}
            >
              {siteName}
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav
          className="desktop-only"
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          {NAV_LINKS.map((l) => (
            <button
              key={l.key}
              onClick={() => setPage(l.key)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "7px 13px",
                borderRadius: 7,
                fontSize: 14,
                fontWeight: 500,
                color:
                  page === l.key
                    ? navBg
                      ? "var(--forest)"
                      : "var(--gold-light)"
                    : navBg
                      ? "var(--gray-dark)"
                      : "rgba(255,255,255,0.88)",
                background:
                  page === l.key
                    ? navBg
                      ? "var(--forest-ghost)"
                      : "rgba(255,255,255,0.12)"
                    : "transparent",
                transition: "all 0.2s",
                fontFamily: "var(--font-body)",
              }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {settings?.liveIsActive && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 12,
                fontWeight: 700,
                color: "var(--danger)",
                background: "var(--danger-pale)",
                padding: "5px 12px",
                borderRadius: 20,
                letterSpacing: 0.5,
              }}
              className="desktop-only"
            >
              <span className="live-dot" /> LIVE
            </div>
          )}
          <button
            onClick={() => setDark(!dark)}
            className="btn-icon"
            style={{
              background: navBg ? "var(--gray-pale)" : "rgba(255,255,255,0.15)",
              border: navBg
                ? "1px solid var(--gray-light)"
                : "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              padding: 8,
              cursor: "pointer",
              color: navBg ? "var(--gray-dark)" : "white",
              transition: "all 0.2s",
            }}
          >
            <Icon name={dark ? "sun" : "moon"} size={16} />
          </button>
          <button
            className="btn btn-gold btn-sm desktop-only"
            onClick={() => setPage("admin")}
          >
            Admin Portal
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-only"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: navBg ? "var(--charcoal)" : "white",
              padding: 6,
            }}
          >
            <Icon name={menuOpen ? "x" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "var(--white)",
            borderTop: "1px solid var(--gray-light)",
            padding: "12px 24px 24px",
          }}
        >
          {NAV_LINKS.map((l) => (
            <button
              key={l.key}
              onClick={() => {
                setPage(l.key);
                setMenuOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "13px 0",
                fontSize: 15,
                fontWeight: page === l.key ? 700 : 400,
                color: page === l.key ? "var(--forest)" : "var(--gray-dark)",
                borderBottom: "1px solid var(--gray-light)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              {l.label}
            </button>
          ))}
          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: 16 }}
            onClick={() => {
              setPage("admin");
              setMenuOpen(false);
            }}
          >
            Admin Portal
          </button>
        </div>
      )}
    </header>
  );
}
