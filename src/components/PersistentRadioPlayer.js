import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "./UI";

export default function PersistentRadioPlayer() {
  const { settings, page, setPage, radioPlaying, radioLoading, radioError, startRadio, stopRadio, setRadioVolume } = useApp();
  const [volume, setVolume] = useState(() => Number(localStorage.getItem("licem_radio_volume") || 0.8));
  const [dismissed, setDismissed] = useState(false);
  const name = settings?.radioName || "LICEM Radio";
  const active = Boolean(settings?.radioStreamUrl) && !dismissed;

  useEffect(() => {
    if (page === "radio") setDismissed(false);
  }, [page]);

  if (!active) return null;
  const toggle = () => (radioPlaying ? stopRadio() : startRadio());
  const changeVolume = (value) => { setVolume(value); setRadioVolume(value); };

  return (
    <div style={{ position: "fixed", left: 16, right: 16, bottom: 16, zIndex: 180, maxWidth: 720, margin: "0 auto", background: "#17162b", color: "white", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 16, padding: "10px 14px", boxShadow: "0 18px 45px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 12 }}>
      <button aria-label={radioPlaying ? "Pause LICEM Radio" : "Play LICEM Radio"} onClick={toggle} disabled={radioLoading} style={{ width: 40, height: 40, borderRadius: "50%", border: 0, background: "var(--gold)", color: "#17162b", cursor: "pointer", fontSize: 16 }}>{radioLoading ? "…" : radioPlaying ? "⏸" : "▶"}</button>
      <button onClick={() => setPage("radio")} style={{ flex: 1, minWidth: 0, textAlign: "left", background: "none", border: 0, color: "white", cursor: "pointer" }}>
        <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: radioPlaying ? "#ffcf67" : "rgba(255,255,255,0.55)" }}>{radioPlaying ? "Now playing" : "Listen live"}</div>
        <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{settings?.radioNowPlaying || name}</div>
        {radioError && <div style={{ fontSize: 11, color: "#fca5a5", marginTop: 2 }}>{radioError}</div>}
      </button>
      <label className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="volume" size={15} color="rgba(255,255,255,0.7)" /><input aria-label="Radio volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => changeVolume(Number(e.target.value))} style={{ width: 80, accentColor: "var(--gold)" }} /></label>
      <button aria-label="Dismiss radio player" onClick={() => setDismissed(true)} style={{ background: "none", border: 0, color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: 20 }}>×</button>
    </div>
  );
}
