import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { settingsAPI, resolveMediaUrl, API_BASE_URL } from "../api";
import { Spinner } from "../components/UI";

const empty = { faceOfWeekName: "", faceOfWeekTitle: "", faceOfWeekBio: "", faceOfWeekQuote: "", faceOfWeekImage: "" };

export default function AdminFaceOfWeek() {
  const { showToast } = useApp();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    settingsAPI.get().then((response) => setForm({ ...empty, ...response.data })).catch(() => showToast("Face of the Week could not load.", "error")).finally(() => setLoading(false));
  }, [showToast]);

  const save = async () => {
    setSaving(true);
    try { await settingsAPI.update(form); showToast("Face of the Week saved."); }
    catch (error) { showToast(error.response?.data?.message || "Could not save Face of the Week.", "error"); }
    finally { setSaving(false); }
  };

  const upload = async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const body = new FormData(); body.append("files", file);
      const response = await fetch(`${API_BASE_URL}/media/upload`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("gl_token")}` }, body });
      const raw = await response.text();
      let data = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch { data = { message: `Upload service returned an invalid response (${response.status}).` }; }
      if (!response.ok || !data.files?.[0]) throw new Error(data.message || `Upload failed (${response.status})`);
      update("faceOfWeekImage", resolveMediaUrl(data.files[0].url)); showToast("Photo uploaded. Save to publish it.");
    } catch (error) { showToast(error.message || "Photo upload failed.", "error"); }
    finally { setUploading(false); }
  };

  if (loading) return <div style={{ padding: 48, display: "flex", justifyContent: "center" }}><Spinner size={32} /></div>;

  return <div style={{ padding: 28, maxWidth: 980 }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start", marginBottom: 24 }}>
      <div><h3 style={{ fontSize: 22, marginBottom: 6 }}>Face of the Week</h3><p style={{ color: "var(--gray-mid)", fontSize: 14, lineHeight: 1.6 }}>Publish a weekly appreciation spotlight for a member, minister, or worker.</p></div>
      <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Spotlight"}</button>
    </div>
    <div className="card" style={{ padding: 24 }}>
      <div className="form-group"><label>Full Name</label><input value={form.faceOfWeekName} onChange={(e) => update("faceOfWeekName", e.target.value)} placeholder="e.g. Sister Mary Johnson" /></div>
      <div className="form-group"><label>Title or Role</label><input value={form.faceOfWeekTitle} onChange={(e) => update("faceOfWeekTitle", e.target.value)} placeholder="e.g. Head of Women's Fellowship" /></div>
      <div className="form-group"><label>Short Biography or Ministry Write-up</label><textarea rows={5} value={form.faceOfWeekBio} onChange={(e) => update("faceOfWeekBio", e.target.value)} placeholder="Write two to four sentences about this person's service and contribution." /></div>
      <div className="form-group"><label>Quote or Message</label><textarea rows={3} value={form.faceOfWeekQuote} onChange={(e) => update("faceOfWeekQuote", e.target.value)} placeholder="A short encouraging message." /></div>
      <div className="form-group"><label>Photo</label><input type="file" accept="image/*" onChange={upload} disabled={uploading} />{uploading && <p style={{ color: "var(--gray-mid)", fontSize: 13, marginTop: 8 }}>Uploading photo…</p>}</div>
      <div className="form-group"><label>Or paste photo URL</label><input value={form.faceOfWeekImage} onChange={(e) => update("faceOfWeekImage", e.target.value)} placeholder="https://..." /></div>
      {form.faceOfWeekImage && <div style={{ display: "flex", gap: 18, alignItems: "center", padding: 16, borderRadius: 14, background: "var(--gray-ghost)", border: "1px solid var(--gray-light)" }}><img src={form.faceOfWeekImage} alt="Face of the Week preview" style={{ width: 120, height: 120, borderRadius: 12, objectFit: "cover", border: "3px solid var(--gold)", background: "#111" }} /><div><strong>{form.faceOfWeekName || "Unnamed spotlight"}</strong><p style={{ color: "var(--gray-mid)", fontSize: 13, marginTop: 6 }}>Preview image. Save Spotlight to publish.</p></div></div>}
    </div>
  </div>;
}
