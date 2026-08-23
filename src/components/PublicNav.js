import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "./UI";
import GlobalSearch from "./GlobalSearch";

const PRIMARY_LINKS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "sermons", label: "Sermons" },
  { key: "radio", label: "Radio" },
  { key: "prayer", label: "Prayer" },
  { key: "events", label: "Events" },
];
const RESOURCE_LINKS = [
  { key: "books", label: "Books" },
  { key: "devotionals", label: "Devotionals" },
  { key: "blog", label: "News & Articles" },
  { key: "gallery", label: "Gallery" },
  { key: "testimonies", label: "Testimonies" },
  { key: "connect", label: "Connect & Birthday Registration" },
];

export default function PublicNav() {
  const { page, setPage, dark, setDark, settings } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  useEffect(() => { const handler = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", handler, { passive: true }); return () => window.removeEventListener("scroll", handler); }, []);
  const navBg = scrolled || menuOpen || page !== "home";
  const go = (key) => { setPage(key); setMenuOpen(false); setResourcesOpen(false); };
  const activeResource = RESOURCE_LINKS.some((item) => item.key === page);
  const buttonStyle = (active) => ({ background: active ? (navBg ? "var(--forest-ghost)" : "rgba(255,255,255,0.12)") : "transparent", border: "none", cursor: "pointer", padding: "7px 11px", borderRadius: 7, fontSize: 14, fontWeight: active ? 700 : 500, color: active ? (navBg ? "var(--forest)" : "var(--gold-light)") : (navBg ? "var(--gray-dark)" : "rgba(255,255,255,0.88)"), fontFamily: "var(--font-body)" });
  return <header style={{ background: navBg ? "var(--white)" : "transparent", backdropFilter: navBg ? "blur(16px)" : "none", boxShadow: navBg ? "var(--shadow-sm)" : "none", borderBottom: navBg ? "1px solid var(--gray-light)" : "none", transition: "all 0.35s var(--ease)" }}>
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
      <button onClick={() => go("home")} style={{ background: "none", border: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 11 }}><img src="/assets/licem-logo.png" alt="LICEM logo" width="42" height="42" style={{ width: 42, height: 42, borderRadius: 10, objectFit: "contain", background: "#080808" }} /><span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, color: navBg ? "var(--charcoal)" : "white" }}>LICEM</span></button>
      <nav className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {PRIMARY_LINKS.map((item) => <button key={item.key} onClick={() => go(item.key)} style={buttonStyle(page === item.key)}>{item.label}</button>)}
        <div style={{ position: "relative" }}><button onClick={() => setResourcesOpen((value) => !value)} style={buttonStyle(activeResource || page === "resources")}>Resources <span style={{ fontSize: 10 }}>▾</span></button>{resourcesOpen && <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 190, padding: 8, background: "var(--white)", border: "1px solid var(--gray-light)", borderRadius: 12, boxShadow: "var(--shadow-md)", zIndex: 220 }}>{RESOURCE_LINKS.map((item) => <button key={item.key} onClick={() => go(item.key)} style={{ display: "block", width: "100%", textAlign: "left", border: 0, background: "none", padding: "10px 12px", borderRadius: 8, cursor: "pointer", color: "var(--gray-dark)", fontFamily: "var(--font-body)" }}>{item.label}</button>)}</div>}</div>
        <button onClick={() => go("give")} style={buttonStyle(page === "give")}>Give</button><button onClick={() => go("contact")} style={buttonStyle(page === "contact")}>Contact</button>
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span className="desktop-only">{settings?.radioIsLive && <span style={{ color: "var(--danger)", fontSize: 12, fontWeight: 700 }}>● LIVE</span>}</span><span className="desktop-only"><GlobalSearch /></span><button onClick={() => setDark(!dark)} className="btn-icon" aria-label="Toggle dark mode" style={{ background: navBg ? "var(--gray-pale)" : "rgba(255,255,255,0.15)", border: 0, borderRadius: 8, padding: 8, cursor: "pointer", color: navBg ? "var(--gray-dark)" : "white" }}><Icon name={dark ? "sun" : "moon"} size={16} /></button><button onClick={() => setMenuOpen(!menuOpen)} className="mobile-only" aria-label="Open menu" style={{ background: "none", border: 0, cursor: "pointer", color: navBg ? "var(--charcoal)" : "white", padding: 6 }}><Icon name={menuOpen ? "x" : "menu"} size={22} /></button></div>
    </div>
    {menuOpen && <div style={{ background: "var(--white)", borderTop: "1px solid var(--gray-light)", padding: "12px 24px 24px" }}>{[...PRIMARY_LINKS, { key: "resources", label: "Resources" }, { key: "give", label: "Give" }, { key: "contact", label: "Contact" }].map((item) => <button key={item.key} onClick={() => item.key === "resources" ? setResourcesOpen(!resourcesOpen) : go(item.key)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: 0, padding: "13px 0", fontSize: 15, fontWeight: page === item.key ? 700 : 400, color: page === item.key ? "var(--forest)" : "var(--gray-dark)", borderBottom: "1px solid var(--gray-light)", cursor: "pointer", fontFamily: "var(--font-body)" }}>{item.label}</button>)}{resourcesOpen && RESOURCE_LINKS.map((item) => <button key={item.key} onClick={() => go(item.key)} style={{ display: "block", width: "100%", textAlign: "left", background: "var(--gray-pale)", border: 0, padding: "11px 14px", fontSize: 14, color: "var(--gray-dark)", cursor: "pointer" }}>{item.label}</button>)}</div>}
  </header>;
}
