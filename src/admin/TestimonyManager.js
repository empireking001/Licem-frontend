import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import API from "../api";

export default function TestimonyManager() {
  const { showToast } = useApp();
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const fetchTestimonies = async () => {
    try {
      const r = await API.get("/testimonies/admin/all");
      setTestimonies(r.data || []);
    } catch (err) {
      showToast("Could not load testimonies", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/testimonies/${id}/approve`, { note: notes[id] || "" });
      setTestimonies(
        testimonies.map((t) => (t._id === id ? { ...t, approved: true, moderationStatus: "approved", moderationNote: notes[id] || "", moderatedAt: new Date().toISOString() } : t)),
      );
      showToast("Testimony approved and live!");
    } catch (err) {
      showToast("Failed to approve", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/testimonies/${id}/reject`, { note: notes[id] || "Rejected during moderation review." });
      setTestimonies(testimonies.map((t) => (t._id === id ? { ...t, approved: false, moderationStatus: "rejected", moderationNote: notes[id] || "Rejected during moderation review.", moderatedAt: new Date().toISOString() } : t)));
      showToast("Testimony rejected and kept private");
    } catch (err) { showToast("Failed to reject", "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimony?"))
      return;
    try {
      await API.delete(`/testimonies/${id}`);
      setTestimonies(testimonies.filter((t) => t._id !== id));
      showToast("Testimony deleted");
    } catch (err) {
      showToast("Failed to delete", "error");
    }
  };

  if (loading) return <div className="p-4">Loading testimonies...</div>;

  return (
    <div className="admin-content">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 24 }}>Testimony Manager</h2>
        <div style={{ display: "flex", gap: 8 }}><div className="badge badge-gold">{testimonies.length} Total</div><div className="badge" style={{ background: "#ffeeee", color: "#cc0000" }}>{testimonies.filter((t) => !t.approved && t.moderationStatus !== "rejected").length} Pending</div></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {testimonies.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            No testimonies found in the database.
          </div>
        ) : (
          testimonies.map((t) => (
            <div
              key={t._id}
              className="card"
              style={{
                padding: 20,
                borderLeft: t.approved
                  ? "4px solid var(--gold)"
                  : "4px solid var(--gray-mid)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      className="badge badge-green"
                      style={{ fontSize: 11 }}
                    >
                      {t.category}
                    </span>
                    {!t.approved && (
                      <span
                        className="badge"
                        style={{
                          background: "#ffeeee",
                          color: "#cc0000",
                          fontSize: 11,
                        }}
                      >
                        {t.moderationStatus === "rejected" ? "Rejected · Private" : "Pending Approval"}
                      </span>
                    )}
                  </div>
                  <h4 style={{ margin: "0 0 4px 0" }}>{t.title}</h4>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--gray-mid)",
                      margin: 0,
                    }}
                  >
                    By: <strong>{t.name}</strong>{" "}
                    {t.anonymous && "(Anonymous requested)"} ·{" "}
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  {!t.approved && (
                    <button
                      className="btn btn-sm"
                      onClick={() => handleApprove(t._id)}
                      style={{ background: "var(--forest)", color: "#fff" }}
                    >
                      Approve
                    </button>
                  )}
                  {!t.approved && t.moderationStatus !== "rejected" && <button className="btn btn-sm" onClick={() => handleReject(t._id)} style={{ background: "#fff7ed", color: "#b45309", border: "1px solid #f59e0b" }}>Reject</button>}
                  <button
                    className="btn btn-sm"
                    onClick={() => handleDelete(t._id)}
                    style={{
                      background: "#fff",
                      border: "1px solid #ff4444",
                      color: "#ff4444",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {!t.approved && <textarea value={notes[t._id] || ""} onChange={(e) => setNotes((n) => ({ ...n, [t._id]: e.target.value }))} placeholder="Optional moderation note" rows={2} style={{ width: "100%", marginTop: 14, fontSize: 13 }} />}
              {t.moderationNote && <div style={{ marginTop: 10, fontSize: 12, color: "var(--gray-mid)" }}>Moderation note: {t.moderationNote} · {t.moderatedAt ? new Date(t.moderatedAt).toLocaleString() : ""}</div>}
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  background: "#f9f9f9",
                  borderRadius: 8,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#444",
                }}
              >
                {t.story}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
