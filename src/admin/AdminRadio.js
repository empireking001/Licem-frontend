import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon, Spinner } from "../components/UI";
import { settingsAPI, radioAnalyticsAPI } from "../api";

export default function AdminRadio() {
  const { showToast, setSettings: setGlobalSettings } = useApp();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    settingsAPI
      .get()
      .then((response) => setSettings(response.data))
      .catch(() => showToast("Could not load radio settings.", "error"))
      .finally(() => setLoading(false));
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [showToast]);

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    const loadAnalytics = () => radioAnalyticsAPI.summary().then((response) => setAnalytics(response.data)).catch(() => {});
    loadAnalytics();
    const timer = window.setInterval(loadAnalytics, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const save = async () => {
    if (!settings?.radioStreamUrl?.trim()) {
      showToast("Add a direct audio stream URL before saving the radio setup.", "error");
      return;
    }
    setSaving(true);
    try {
      const response = await settingsAPI.update({
        ...settings,
        radioName: settings.radioName?.trim() || "LICEM Radio",
        radioStreamUrl: settings.radioStreamUrl.trim(),
      });
      setSettings(response.data);
      setGlobalSettings(response.data);
      showToast("Radio settings saved successfully.");
    } catch (error) {
      showToast(error.response?.data?.message || "Could not save radio settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const testStream = async () => {
    const url = settings?.radioStreamUrl?.trim();
    if (!url) {
      showToast("Enter a stream URL before testing it.", "error");
      return;
    }
    if (!/^https:\/\//i.test(url)) {
      showToast("Use an HTTPS stream URL for production playback.", "error");
      return;
    }
    setTesting(true);
    audioRef.current?.pause();
    const audio = new Audio(url);
    audio.preload = "none";
    audio.volume = 0;
    audioRef.current = audio;
    try {
      await audio.play();
      await new Promise((resolve) => setTimeout(resolve, 1200));
      audio.pause();
      showToast("Stream connection succeeded. The test was stopped safely.");
    } catch {
      showToast("The stream could not be played. Check the direct URL and provider permissions.", "error");
    } finally {
      audio.pause();
      audioRef.current = null;
      setTesting(false);
    }
  };

  if (loading || !settings) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={36} /></div>;
  }

  return (
    <div style={{ padding: 28, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, marginBottom: 28, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: 22, marginBottom: 6 }}>Radio Management</h3>
          <p style={{ color: "var(--gray-mid)", fontSize: 14, margin: 0 }}>Configure and safely test the public LICEM Radio player.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={testStream} disabled={testing}>
            {testing ? <Spinner size={15} /> : <Icon name="play" size={15} />} {testing ? "Testing…" : "Test Stream"}
          </button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? <Spinner size={15} color="white" /> : <Icon name="check" size={15} />} Save Changes
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, display: "grid", placeItems: "center", background: "var(--forest-pale)", color: "var(--forest)", fontSize: 21 }}>📻</div>
          <div><h4 style={{ margin: 0, fontSize: 18 }}>Station Setup</h4><p style={{ margin: "4px 0 0", color: "var(--gray-mid)", fontSize: 13 }}>These values control the public <strong>/radio</strong> page.</p></div>
        </div>
        <div className="grid-2">
          <div className="form-group"><label>Radio Station Name</label><input value={settings.radioName || ""} onChange={(event) => update("radioName", event.target.value)} placeholder="LICEM Radio" /></div>
          <div className="form-group"><label>Direct Stream URL</label><input type="url" value={settings.radioStreamUrl || ""} onChange={(event) => update("radioStreamUrl", event.target.value)} placeholder="https://…/stream.mp3" /></div>
        </div>
        <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 10, background: settings.radioIsLive ? "var(--danger-pale)" : "var(--gray-ghost)", display: "flex", alignItems: "center", gap: 12 }}>
          <button type="button" aria-pressed={Boolean(settings.radioIsLive)} className={`toggle ${settings.radioIsLive ? "on" : ""}`} onClick={() => update("radioIsLive", !settings.radioIsLive)} />
          <div><div style={{ fontWeight: 700, color: settings.radioIsLive ? "var(--danger)" : "var(--charcoal)" }}>Mark Radio as LIVE</div><div style={{ fontSize: 12, color: "var(--gray-mid)" }}>Shows a red LIVE badge. This is a manual status switch.</div></div>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div><h4 style={{ marginBottom: 6 }}>Listener Analytics</h4><p style={{ margin: 0, color: "var(--gray-mid)", fontSize: 13 }}>Live estimate from visitors actively playing Radio on the LICEM website.</p></div>
          <div style={{ display: "flex", gap: 28 }}><div><strong style={{ display: "block", fontSize: 28, color: "var(--forest)" }}>{analytics?.activeListeners ?? "—"}</strong><span style={{ color: "var(--gray-mid)", fontSize: 12 }}>Active players</span></div><div><strong style={{ display: "block", fontSize: 28 }}>{analytics?.totalSessions24h ?? "—"}</strong><span style={{ color: "var(--gray-mid)", fontSize: 12 }}>Sessions / 24h</span></div></div>
        </div>
        <p style={{ margin: "16px 0 0", color: "var(--gray-soft)", fontSize: 12 }}>This is not the provider-wide concurrent listener count. Connect a provider or Icecast statistics endpoint for authoritative radio listener analytics.</p>
      </div>

      <div className="card" style={{ padding: 24, background: "var(--info-pale)" }}>
        <h4 style={{ marginBottom: 10 }}>How to use Radio</h4>
        <p style={{ margin: 0, color: "var(--gray-dark)", lineHeight: 1.7, fontSize: 14 }}>Paste the provider’s direct HTTPS audio stream URL, not its dashboard or station webpage. Click <strong>Test Stream</strong> to verify that the browser can connect without leaving the test playing. When the station is broadcasting, enable <strong>Mark Radio as LIVE</strong> and save. Supported providers may include Zeno.fm, Radio.co, Shoutcast, Icecast, or another service that provides a browser-playable MP3/AAC stream.</p>
      </div>
    </div>
  );
}
