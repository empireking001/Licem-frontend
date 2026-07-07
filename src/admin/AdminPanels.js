// ── COMMENTS ─────────────────────────────────────────
import { useState, useEffect } from "react";
import {
  commentsAPI,
  donationsAPI,
  usersAPI,
  mediaAPI,
  settingsAPI,
} from "../api";
import {
  Icon,
  Spinner,
  Modal,
  ConfirmModal,
  EmptyState,
  Avatar,
  StatCard,
} from "../components/UI";
import { useApp } from "../context/AppContext";

export function AdminComments() {
  const { showToast } = useApp();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    commentsAPI
      .getAll()
      .then((r) => setComments(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const approve = async (id) => {
    try {
      const r = await commentsAPI.approve(id);
      setComments((c) => c.map((x) => (x._id === id ? r.data : x)));
      showToast("Comment approved!");
    } catch {
      showToast("Error.", "error");
    }
  };
  const spam = async (id) => {
    try {
      const r = await commentsAPI.spam(id);
      setComments((c) => c.map((x) => (x._id === id ? r.data : x)));
      showToast("Marked as spam.");
    } catch {
      showToast("Error.", "error");
    }
  };
  const del = async () => {
    try {
      await commentsAPI.delete(confirm.id);
      setComments((c) => c.filter((x) => x._id !== confirm.id));
      showToast("Comment deleted.");
    } catch {
      showToast("Error.", "error");
    }
    setConfirm(null);
  };

  const filtered = comments.filter((c) => {
    if (filter === "pending") return !c.approved && !c.spam;
    if (filter === "approved") return c.approved;
    if (filter === "spam") return c.spam;
    return true;
  });
  const pendingCount = comments.filter((c) => !c.approved && !c.spam).length;

  return (
    <div style={{ padding: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h3 style={{ fontSize: 20 }}>Comment Moderation</h3>
          {pendingCount > 0 && (
            <p style={{ color: "var(--danger)", fontSize: 14, marginTop: 4 }}>
              {pendingCount} comment(s) awaiting review
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            ["all", "All"],
            ["pending", "Pending"],
            ["approved", "Approved"],
            ["spam", "Spam"],
          ].map(([k, l]) => (
            <button
              key={k}
              className={`btn btn-sm ${filter === k ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilter(k)}
            >
              {l}{" "}
              {k === "pending" && pendingCount > 0 && (
                <span
                  style={{
                    background: "var(--danger)",
                    color: "white",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    marginLeft: 4,
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="card table-wrap">
        {loading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 48 }}
          >
            <Spinner size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="chat"
            title="No comments"
            desc="No comments match this filter."
          />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Author</th>
                <th>Comment</th>
                <th>Reference</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--gray-soft)" }}>
                      {c.email}
                    </div>
                  </td>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ fontSize: 13 }} className="truncate">
                      {c.text}
                    </div>
                  </td>
                  <td
                    style={{
                      fontSize: 12,
                      color: "var(--gray-mid)",
                      maxWidth: 150,
                    }}
                    className="truncate"
                  >
                    {c.refTitle}
                  </td>
                  <td>
                    <span className="badge badge-gray">{c.refType}</span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--gray-soft)" }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {c.spam ? (
                      <span className="badge badge-red">Spam</span>
                    ) : c.approved ? (
                      <span className="badge badge-green">Approved</span>
                    ) : (
                      <span className="badge badge-gold">Pending</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 5 }}>
                      {!c.approved && !c.spam && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => approve(c._id)}
                        >
                          <Icon name="check" size={12} />
                        </button>
                      )}
                      {!c.spam && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => spam(c._id)}
                          title="Mark spam"
                          style={{ fontSize: 12 }}
                        >
                          🚫
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setConfirm({ id: c._id })}
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {confirm && (
        <ConfirmModal
          title="Delete Comment?"
          message="This comment will be permanently removed."
          onConfirm={del}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ── DONATIONS ─────────────────────────────────────────
export function AdminDonations() {
  const { showToast } = useApp();
  const [data, setData] = useState({
    donations: [],
    total: 0,
    sum: 0,
    byType: [],
  });
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    donationsAPI
      .getAll({ limit: 100 })
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const del = async () => {
    try {
      await donationsAPI.delete(confirm.id);
      setData((d) => ({
        ...d,
        donations: d.donations.filter((x) => x._id !== confirm.id),
      }));
      showToast("Record removed.");
    } catch {
      showToast("Error.", "error");
    }
    setConfirm(null);
  };

  const exportCSV = () => {
    const rows = [
      ["Ref", "Name", "Email", "Amount", "Type", "Method", "Date", "Status"],
    ];
    data.donations.forEach((d) =>
      rows.push([
        d.reference,
        d.name,
        d.email,
        d.amount,
        d.type,
        d.method,
        new Date(d.createdAt).toLocaleDateString(),
        d.status,
      ]),
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv," + encodeURIComponent(csv);
    a.download = "donations.csv";
    a.click();
    showToast("CSV exported!");
  };

  return (
    <div style={{ padding: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h3 style={{ fontSize: 20 }}>Donations</h3>
          <p style={{ color: "var(--gray-mid)", fontSize: 14 }}>
            {data.total} transactions
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={exportCSV}>
          <Icon name="download" size={14} /> Export CSV
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard
          label="Total Received"
          value={`₦${(data.sum || 0).toLocaleString()}`}
          icon="dollar"
          color="var(--success)"
        />
        <StatCard
          label="Transactions"
          value={data.total}
          icon="activity"
          color="var(--forest)"
        />
        <StatCard
          label="Avg. Gift"
          value={`₦${data.total > 0 ? Math.round(data.sum / data.total).toLocaleString() : 0}`}
          icon="star"
          color="var(--gold)"
        />
      </div>
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 22 }}>
          <h4 style={{ fontSize: 16, marginBottom: 16 }}>By Type</h4>
          {(data.byType || []).map((bt, i) => {
            const max = Math.max(...(data.byType || []).map((x) => x.total));
            const pct = max > 0 ? (bt.total / max) * 100 : 0;
            const colors = [
              "var(--forest)",
              "var(--forest-mid)",
              "var(--gold)",
              "#7C3AED",
              "var(--danger)",
            ];
            return (
              <div key={bt._id} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 5,
                  }}
                >
                  <span>{bt._id}</span>
                  <span style={{ fontWeight: 600 }}>
                    ₦{bt.total?.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "var(--gray-light)",
                    borderRadius: 3,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: colors[i % colors.length],
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card table-wrap">
        {loading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 48 }}
          >
            <Spinner size={32} />
          </div>
        ) : data.donations.length === 0 ? (
          <EmptyState icon="dollar" title="No donations yet" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ref</th>
                <th>Donor</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.donations.map((d) => (
                <tr key={d._id}>
                  <td
                    style={{
                      fontSize: 12,
                      fontFamily: "monospace",
                      color: "var(--gray-soft)",
                    }}
                  >
                    {d.reference}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>
                      {d.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--gray-soft)" }}>
                      {d.email}
                    </div>
                  </td>
                  <td
                    style={{
                      fontWeight: 700,
                      color: "var(--forest)",
                      fontSize: 15,
                    }}
                  >
                    ₦{(d.amount || 0).toLocaleString()}
                  </td>
                  <td>
                    <span className="badge badge-gold">{d.type}</span>
                  </td>
                  <td>
                    <span className="badge badge-gray">{d.method}</span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--gray-mid)" }}>
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`badge ${d.status === "Confirmed" ? "badge-green" : d.status === "Failed" ? "badge-red" : "badge-gold"}`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirm({ id: d._id })}
                    >
                      <Icon name="trash" size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {confirm && (
        <ConfirmModal
          title="Remove Record?"
          message="This donation record will be deleted."
          onConfirm={del}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ── USERS ─────────────────────────────────────────────
export function AdminUsers() {
  const { showToast, user: me } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const blank = {
    name: "",
    email: "",
    password: "",
    role: "Editor",
    status: "Active",
  };
  const [form, setForm] = useState(blank);
  const S = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const load = () => {
    setLoading(true);
    usersAPI
      .getAll()
      .then((r) => setUsers(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async () => {
    try {
      if (modal === "new") {
        const r = await usersAPI.create(form);
        setUsers((u) => [...u, r.data]);
      } else {
        const r = await usersAPI.update(modal, form);
        setUsers((u) => u.map((x) => (x._id === modal ? r.data : x)));
      }
      setModal(null);
      showToast("User saved!");
    } catch (e) {
      showToast(e.response?.data?.message || "Error.", "error");
    }
  };

  const del = async () => {
    try {
      await usersAPI.delete(confirm.id);
      setUsers((u) => u.filter((x) => x._id !== confirm.id));
      showToast("User removed.");
    } catch (e) {
      showToast(e.response?.data?.message || "Error.", "error");
    }
    setConfirm(null);
  };

  return (
    <div style={{ padding: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h3 style={{ fontSize: 20 }}>Admin Users</h3>
          <p style={{ color: "var(--gray-mid)", fontSize: 14 }}>
            {users.length} members
          </p>
        </div>
        {me?.role === "Super Admin" && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setForm(blank);
              setModal("new");
            }}
          >
            <Icon name="plus" size={15} /> Add User
          </button>
        )}
      </div>
      <div className="card table-wrap">
        {loading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 48 }}
          >
            <Spinner size={32} />
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <Avatar name={u.name} size={34} />
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--gray-mid)" }}>
                    {u.email}
                  </td>
                  <td>
                    <span
                      className={`badge ${u.role === "Super Admin" ? "badge-red" : u.role === "Editor" ? "badge-green" : "badge-blue"}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${u.status === "Active" ? "badge-green" : "badge-gray"}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--gray-soft)" }}>
                    {u.lastLogin
                      ? new Date(u.lastLogin).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td>
                    {me?.role === "Super Admin" && me?._id !== u._id && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setForm({
                              name: u.name,
                              email: u.email,
                              password: "",
                              role: u.role,
                              status: u.status,
                            });
                            setModal(u._id);
                          }}
                        >
                          <Icon name="edit" size={13} />
                        </button>
                        {u.role !== "Super Admin" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setConfirm({ id: u._id })}
                          >
                            <Icon name="trash" size={13} />
                          </button>
                        )}
                      </div>
                    )}
                    {me?._id === u._id && (
                      <span style={{ fontSize: 12, color: "var(--gray-soft)" }}>
                        You
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal !== null && (
        <Modal
          title={modal === "new" ? "Add User" : "Edit User"}
          onClose={() => setModal(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                value={form.name}
                onChange={(e) => S("name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => S("email", e.target.value)}
              />
            </div>
            {modal === "new" && (
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => S("password", e.target.value)}
                />
              </div>
            )}
            <div className="form-group">
              <label>Role</label>
              <select
                value={form.role}
                onChange={(e) => S("role", e.target.value)}
              >
                <option>Super Admin</option>
                <option>Editor</option>
                <option>Moderator</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => S("status", e.target.value)}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                className="btn btn-ghost"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 2, justifyContent: "center" }}
                onClick={save}
                disabled={!form.name || !form.email}
              >
                Save User
              </button>
            </div>
          </div>
        </Modal>
      )}
      {confirm && (
        <ConfirmModal
          title="Remove User?"
          message="This user will lose admin access immediately."
          onConfirm={del}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ── MEDIA LIBRARY ─────────────────────────────────────
export function AdminMedia() {
  const { showToast } = useApp();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    mediaAPI
      .getAll()
      .then((r) => setFiles(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const uploadFiles = async (e) => {
    const fd = new FormData();
    Array.from(e.target.files).forEach((f) => fd.append("files", f));
    try {
      const r = await mediaAPI.upload(fd);
      setFiles((f) => [
        ...r.data.files.map((x) => ({
          ...x,
          size: x.size,
          uploadedAt: new Date(),
        })),
        ...f,
      ]);
      showToast(`${r.data.files.length} file(s) uploaded!`);
    } catch {
      showToast("Upload failed.", "error");
    }
  };

  const del = async () => {
    try {
      await mediaAPI.delete(confirm.filename);
      setFiles((f) => f.filter((x) => x.filename !== confirm.filename));
      showToast("File deleted.");
    } catch {
      showToast("Error.", "error");
    }
    setConfirm(null);
  };

  const copyUrl = (url) => {
    const full = url.startsWith("/") ? `http://localhost:5000${url}` : url;
    navigator.clipboard.writeText(full).then(() => showToast("URL copied!"));
  };

  return (
    <div style={{ padding: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h3 style={{ fontSize: 20 }}>Media Library</h3>
          <p style={{ color: "var(--gray-mid)", fontSize: 14 }}>
            {files.length} files
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              display: "flex",
              border: "1px solid var(--gray-light)",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setView("grid")}
              style={{
                padding: "8px 12px",
                background: view === "grid" ? "var(--forest)" : "white",
                color: view === "grid" ? "white" : "var(--gray-mid)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Icon name="grid" size={14} />
            </button>
            <button
              onClick={() => setView("list")}
              style={{
                padding: "8px 12px",
                background: view === "list" ? "var(--forest)" : "white",
                color: view === "list" ? "white" : "var(--gray-mid)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Icon name="list" size={14} />
            </button>
          </div>
          <label className="btn btn-primary" style={{ cursor: "pointer" }}>
            <Icon name="upload" size={15} /> Upload Files
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf"
              style={{ display: "none" }}
              onChange={uploadFiles}
            />
          </label>
        </div>
      </div>
      <label
        className="upload-zone"
        style={{ marginBottom: 24, display: "block" }}
      >
        <Icon name="upload" size={28} color="var(--gray-soft)" />
        <p style={{ color: "var(--gray-mid)", marginTop: 10, fontSize: 15 }}>
          Drag & drop files here, or click to browse
        </p>
        <p style={{ color: "var(--gray-soft)", fontSize: 12, marginTop: 4 }}>
          Images, Video, Audio, PDF — up to 50MB
        </p>
        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf"
          style={{ display: "none" }}
          onChange={uploadFiles}
        />
      </label>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spinner size={32} />
        </div>
      ) : files.length === 0 ? (
        <EmptyState
          icon="image"
          title="No files yet"
          desc="Upload your first file above."
        />
      ) : view === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          {files.map((f) => {
            const url = f.url?.startsWith("/")
              ? `http://localhost:5000${f.url}`
              : f.url;
            const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(f.filename);
            return (
              <div
                key={f.filename}
                className="card"
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    aspectRatio: "1",
                    background: "var(--gray-pale)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {isImg ? (
                    <img src={url} alt={f.filename} className="img-cover" />
                  ) : (
                    <Icon
                      name={
                        /\.mp4/i.test(f.filename)
                          ? "video"
                          : /\.mp3/i.test(f.filename)
                            ? "music"
                            : "file"
                      }
                      size={40}
                      color="var(--gray-soft)"
                    />
                  )}
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div
                    style={{ fontSize: 12, fontWeight: 500 }}
                    className="truncate"
                  >
                    {f.originalName || f.filename}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--gray-soft)",
                      marginTop: 2,
                    }}
                  >
                    {f.size ? `${Math.round(f.size / 1024)} KB` : ""}
                  </div>
                  <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        padding: "5px",
                      }}
                      onClick={() => copyUrl(f.url)}
                    >
                      <Icon name="copy" size={12} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: "5px 8px" }}
                      onClick={() => setConfirm({ filename: f.filename })}
                    >
                      <Icon name="trash" size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Preview</th>
                <th>Filename</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => {
                const url = f.url?.startsWith("/")
                  ? `http://localhost:5000${f.url}`
                  : f.url;
                const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(f.filename);
                return (
                  <tr key={f.filename}>
                    <td>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 6,
                          overflow: "hidden",
                          background: "var(--gray-pale)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isImg ? (
                          <img src={url} alt="" className="img-cover" />
                        ) : (
                          <Icon
                            name="file"
                            size={20}
                            color="var(--gray-soft)"
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>
                      {f.originalName || f.filename}
                    </td>
                    <td style={{ color: "var(--gray-mid)", fontSize: 13 }}>
                      {f.size ? `${Math.round(f.size / 1024)} KB` : "—"}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--gray-mid)" }}>
                      {f.uploadedAt
                        ? new Date(f.uploadedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => copyUrl(f.url)}
                        >
                          Copy URL
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setConfirm({ filename: f.filename })}
                        >
                          <Icon name="trash" size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {confirm && (
        <ConfirmModal
          title="Delete File?"
          message="This file will be permanently removed from the server."
          onConfirm={del}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────
export function AdminSettings() {
  const { showToast, setSettings: setGlobalSettings } = useApp();
  const [tab, setTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [s, setS] = useState(null);
  const U = (k, v) => setS((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {
    settingsAPI
      .get()
      .then((r) => setS(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const r = await settingsAPI.update(s);
      setS(r.data);
      setGlobalSettings(r.data);
      showToast("Settings saved successfully!");
    } catch {
      showToast("Error saving settings.", "error");
    }
    setSaving(false);
  };

  const TABS = [
    { key: "general", label: "General", icon: "settings" },
    { key: "branding", label: "Branding & Favicon", icon: "image" },
    { key: "social", label: "Social & Live", icon: "link" },
    { key: "seo", label: "SEO & Meta", icon: "globe" },
    { key: "payment", label: "Payment", icon: "dollar" },
    { key: "moderation", label: "Moderation", icon: "shield" },
    { key: "advanced", label: "Advanced", icon: "zap" },
  ];

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
        }}
      >
        <Spinner size={36} />
      </div>
    );

  return (
    <div style={{ padding: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <div>
          <h3 style={{ fontSize: 20 }}>Site Settings</h3>
          <p style={{ color: "var(--gray-mid)", fontSize: 14 }}>
            Manage all aspects of your church website
          </p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? (
            <Spinner size={16} color="white" />
          ) : (
            <>
              <Icon name="check" size={15} /> Save All Changes
            </>
          )}
        </button>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Sidebar tabs */}
        <div style={{ width: 210, minWidth: 210 }}>
          <div className="card" style={{ padding: 8 }}>
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "11px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  width: "100%",
                  background:
                    tab === t.key ? "var(--forest-pale)" : "transparent",
                  color: tab === t.key ? "var(--forest)" : "var(--gray-dark)",
                  fontWeight: tab === t.key ? 700 : 400,
                  fontSize: 14,
                  border: "none",
                  fontFamily: "var(--font-body)",
                  marginBottom: 2,
                  transition: "all 0.15s",
                }}
              >
                <Icon name={t.icon} size={15} color="currentColor" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div style={{ flex: 1 }}>
          <div className="card" style={{ padding: 28 }}>
            {/* {tab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <h4 style={{ fontSize: 18, borderBottom: '1px solid var(--gray-light)', paddingBottom: 12, marginBottom: 4 }}>General Information</h4>
                <div className="grid-2">
                  <div className="form-group"><label>Church Name</label><input value={s?.siteName || ''} onChange={e => U('siteName', e.target.value)} /></div>
                  <div className="form-group"><label>Tagline</label><input value={s?.tagline || ''} onChange={e => U('tagline', e.target.value)} /></div>
                  <div className="form-group"><label>Email</label><input type="email" value={s?.email || ''} onChange={e => U('email', e.target.value)} /></div>
                  <div className="form-group"><label>Phone</label><input value={s?.phone || ''} onChange={e => U('phone', e.target.value)} /></div>
                </div>
                <div className="form-group"><label>Physical Address</label><textarea rows={2} value={s?.address || ''} onChange={e => U('address', e.target.value)} /></div>
              </div>
            )} */}
            {tab === "general" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <h4
                  style={{
                    fontSize: 18,
                    borderBottom: "1px solid var(--gray-light)",
                    paddingBottom: 12,
                    marginBottom: 4,
                  }}
                >
                  General Information
                </h4>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Church Name</label>
                    <input
                      value={s?.siteName || ""}
                      onChange={(e) => U("siteName", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tagline</label>
                    <input
                      value={s?.tagline || ""}
                      onChange={(e) => U("tagline", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      value={s?.email || ""}
                      onChange={(e) => U("email", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      value={s?.phone || ""}
                      onChange={(e) => U("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Physical Address</label>
                  <textarea
                    rows={2}
                    value={s?.address || ""}
                    onChange={(e) => U("address", e.target.value)}
                  />
                </div>

                <div style={{ marginTop: 8 }}>
                  <h4
                    style={{
                      fontSize: 16,
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      marginBottom: 14,
                      paddingBottom: 10,
                      borderBottom: "1px solid var(--gray-light)",
                    }}
                  >
                    Footer Contact Details
                  </h4>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--gray-mid)",
                      marginBottom: 16,
                    }}
                  >
                    These details appear in the footer of your public website.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div className="form-group">
                      <label>Footer Address Line</label>
                      <input
                        value={s?.footerAddress || s?.address || ""}
                        onChange={(e) => U("footerAddress", e.target.value)}
                        placeholder="14 Grace Avenue, Victoria Island, Lagos, Nigeria"
                      />
                      <span style={{ fontSize: 12, color: "var(--gray-soft)" }}>
                        Shown in footer. Leave blank to use Physical Address
                        above.
                      </span>
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label>Footer Email</label>
                        <input
                          type="email"
                          value={s?.footerEmail || s?.email || ""}
                          onChange={(e) => U("footerEmail", e.target.value)}
                          placeholder="hello@gracelifechurch.org"
                        />
                      </div>
                      <div className="form-group">
                        <label>Footer Phone</label>
                        <input
                          value={s?.footerPhone || s?.phone || ""}
                          onChange={(e) => U("footerPhone", e.target.value)}
                          placeholder="+234 801 234 5678"
                        />
                      </div>
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label>Sunday Service Times</label>
                        <input
                          value={
                            s?.sundayTimes ||
                            "Every Sunday — 9:00 AM & 11:00 AM"
                          }
                          onChange={(e) => U("sundayTimes", e.target.value)}
                          placeholder="Every Sunday — 9:00 AM & 11:00 AM"
                        />
                      </div>
                      <div className="form-group">
                        <label>Midweek Service Time</label>
                        <input
                          value={s?.midweekTime || "Every Wednesday — 6:30 PM"}
                          onChange={(e) => U("midweekTime", e.target.value)}
                          placeholder="Every Wednesday — 6:30 PM"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Prayer Meeting Time</label>
                      <input
                        value={s?.prayerTime || "Every Friday — 6:00 AM"}
                        onChange={(e) => U("prayerTime", e.target.value)}
                        placeholder="Every Friday — 6:00 AM"
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <h4
                    style={{
                      fontSize: 16,
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      marginBottom: 4,
                      paddingTop: 16,
                      borderTop: "1px solid var(--gray-light)",
                    }}
                  >
                    Face of the Week
                  </h4>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--gray-mid)",
                      marginBottom: 16,
                    }}
                  >
                    Highlight a church member, minister, or worker on the
                    homepage each week.
                  </p>

                  {s?.faceOfWeekImage && (
                    <div
                      style={{
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 12,
                          overflow: "hidden",
                          border: "2px solid var(--gray-light)",
                        }}
                      >
                        <img
                          src={s.faceOfWeekImage}
                          alt="Face of week"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                        >
                          {s.faceOfWeekName || "No name set"}
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            U("faceOfWeekImage", "");
                            U("faceOfWeekName", "");
                            U("faceOfWeekTitle", "");
                            U("faceOfWeekQuote", "");
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        value={s?.faceOfWeekName || ""}
                        onChange={(e) => U("faceOfWeekName", e.target.value)}
                        placeholder="e.g. Sister Mary Johnson"
                      />
                    </div>
                    <div className="form-group">
                      <label>Title or Role</label>
                      <input
                        value={s?.faceOfWeekTitle || ""}
                        onChange={(e) => U("faceOfWeekTitle", e.target.value)}
                        placeholder="e.g. Head of Women's Fellowship"
                      />
                    </div>
                    <div className="form-group">
                      <label>Quote or Message</label>
                      <textarea
                        rows={3}
                        value={s?.faceOfWeekQuote || ""}
                        onChange={(e) => U("faceOfWeekQuote", e.target.value)}
                        placeholder="A short inspiring quote or message from them..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Photo — Upload from computer</label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 16px",
                          border: "2px dashed var(--gray-light)",
                          borderRadius: 10,
                          cursor: "pointer",
                          background: "var(--white)",
                        }}
                      >
                        <span style={{ fontSize: 24 }}>📸</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>
                            Click to choose photo
                          </div>
                          <div
                            style={{ fontSize: 12, color: "var(--gray-mid)" }}
                          >
                            JPG or PNG — clear face photo recommended
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append("files", file);
                            try {
                              const res = await fetch("/api/media/upload", {
                                method: "POST",
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("gl_token")}`,
                                },
                                body: fd,
                              });
                              const data = await res.json();
                              if (data.files && data.files[0]) {
                                const url = data.files[0].url.startsWith("/")
                                  ? `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${data.files[0].url}`
                                  : data.files[0].url;
                                U("faceOfWeekImage", url);
                              }
                            } catch {
                              alert("Upload failed. Try URL below.");
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Or paste photo URL</label>
                      <input
                        value={s?.faceOfWeekImage || ""}
                        onChange={(e) => U("faceOfWeekImage", e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "branding" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 22 }}
              >
                <h4
                  style={{
                    fontSize: 18,
                    borderBottom: "1px solid var(--gray-light)",
                    paddingBottom: 12,
                    marginBottom: 4,
                  }}
                >
                  Brand Colors
                </h4>
                <div style={{ display: "flex", gap: 24 }}>
                  {[
                    ["primaryColor", "Primary (Forest Green)"],
                    ["accentColor", "Accent (Gold)"],
                  ].map(([k, l]) => (
                    <div key={k}>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--gray-mid)",
                          marginBottom: 8,
                          fontWeight: 600,
                        }}
                      >
                        {l}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="color"
                          value={s?.[k] || "#000"}
                          onChange={(e) => U(k, e.target.value)}
                          style={{
                            width: 52,
                            height: 40,
                            padding: 3,
                            borderRadius: 8,
                            cursor: "pointer",
                            border: "1.5px solid var(--gray-light)",
                          }}
                        />
                        <input
                          value={s?.[k] || ""}
                          onChange={(e) => U(k, e.target.value)}
                          style={{
                            width: 120,
                            fontSize: 13,
                            fontFamily: "monospace",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="divider" />
                <h4 style={{ fontSize: 18 }}>Favicon Control</h4>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  {[
                    ["emoji", "Emoji"],
                    ["url", "Image URL"],
                    ["text", "Text/Letter"],
                  ].map(([v, l]) => (
                    <label
                      key={v}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        cursor: "pointer",
                        padding: "9px 16px",
                        background:
                          s?.faviconType === v
                            ? "var(--forest)"
                            : "var(--gray-pale)",
                        color:
                          s?.faviconType === v ? "white" : "var(--charcoal)",
                        borderRadius: 8,
                        border: `1.5px solid ${s?.faviconType === v ? "var(--forest)" : "var(--gray-light)"}`,
                        fontSize: 13,
                        fontWeight: 600,
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="radio"
                        name="fav"
                        value={v}
                        checked={s?.faviconType === v}
                        onChange={() => U("faviconType", v)}
                        style={{ display: "none" }}
                      />
                      {l}
                    </label>
                  ))}
                </div>
                {s?.faviconType === "emoji" && (
                  <div>
                    <div className="form-group">
                      <label>Favicon Emoji</label>
                      <input
                        value={s?.faviconEmoji || ""}
                        onChange={(e) => U("faviconEmoji", e.target.value)}
                        style={{
                          fontSize: 24,
                          textAlign: "center",
                          width: 120,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      {[
                        "✝️",
                        "🕊️",
                        "⛪",
                        "🙏",
                        "📖",
                        "⭐",
                        "🌿",
                        "🕯️",
                        "🎵",
                        "🌟",
                        "🔔",
                        "💒",
                      ].map((e) => (
                        <span
                          key={e}
                          onClick={() => U("faviconEmoji", e)}
                          style={{
                            fontSize: 24,
                            cursor: "pointer",
                            padding: 8,
                            borderRadius: 8,
                            background:
                              s?.faviconEmoji === e
                                ? "var(--forest-pale)"
                                : "var(--gray-ghost)",
                            border: `1.5px solid ${s?.faviconEmoji === e ? "var(--forest)" : "var(--gray-light)"}`,
                            transition: "all 0.15s",
                          }}
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {s?.faviconType === "url" && (
                  <div className="form-group">
                    <label>Favicon Image URL</label>
                    <input
                      value={s?.faviconUrl || ""}
                      onChange={(e) => U("faviconUrl", e.target.value)}
                      placeholder="https://yoursite.com/favicon.ico"
                    />
                  </div>
                )}
                {s?.faviconType === "text" && (
                  <div className="form-group">
                    <label>Favicon Text (1-2 chars)</label>
                    <input
                      value={s?.faviconEmoji || ""}
                      onChange={(e) =>
                        U("faviconEmoji", e.target.value.slice(0, 2))
                      }
                      maxLength={2}
                      style={{ fontSize: 20, textAlign: "center", width: 80 }}
                      placeholder="GL"
                    />
                  </div>
                )}
                {/* Preview */}
                <div
                  style={{
                    padding: "16px 20px",
                    background: "var(--gray-ghost)",
                    borderRadius: 10,
                    border: "1px solid var(--gray-light)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--gray-soft)",
                      marginBottom: 10,
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    BROWSER TAB PREVIEW
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#e0e0e0",
                      borderRadius: 8,
                      padding: "6px 16px",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontSize: 15 }}>
                      {s?.faviconEmoji || "✝️"}
                    </span>
                    <span style={{ fontWeight: 500 }}>
                      {s?.siteName || "Licem Church"}
                    </span>
                    <span style={{ color: "#999", marginLeft: 8 }}>×</span>
                  </div>
                </div>
                <div className="divider" />

                <h4
                  style={{
                    fontSize: 16,
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    marginBottom: 16,
                  }}
                >
                  Logo & Hero Image
                </h4>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label>Church Logo URL</label>
                  <input
                    value={s?.logoUrl || ""}
                    onChange={(e) => U("logoUrl", e.target.value)}
                    placeholder="https://res.cloudinary.com/yourcloud/image/upload/logo.png"
                  />
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--gray-soft)",
                      marginTop: 4,
                    }}
                  >
                    Paste a Cloudinary or direct image URL for your church logo.
                  </div>
                </div>

                {/* Hero image upload OR URL */}
                <div
                  style={{
                    background: "var(--gray-ghost)",
                    borderRadius: 12,
                    padding: 24,
                    border: "1px solid var(--gray-light)",
                  }}
                >
                  <div
                    style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}
                  >
                    Hero Background Image
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--gray-mid)",
                      marginBottom: 16,
                    }}
                  >
                    This is the large background image on the homepage.
                    Recommended size: 1920 x 1080px.
                  </div>

                  {/* Current preview */}
                  {s?.heroImageUrl && (
                    <div
                      style={{
                        marginBottom: 16,
                        borderRadius: 10,
                        overflow: "hidden",
                        height: 160,
                        position: "relative",
                      }}
                    >
                      <img
                        src={s.heroImageUrl}
                        alt="Hero preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div style={{ position: "absolute", top: 8, right: 8 }}>
                        <span
                          className="badge badge-green"
                          style={{ fontSize: 11 }}
                        >
                          Current Hero Image
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Option 1: Upload file */}
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--gray-dark)",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      Option 1 — Upload an image file
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        border: "2px dashed var(--gray-light)",
                        borderRadius: 10,
                        cursor: "pointer",
                        background: "var(--white)",
                        transition: "border-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--forest-mid)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--gray-light)")
                      }
                    >
                      <span style={{ fontSize: 24 }}>🖼️</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                          Click to choose image
                        </div>
                        <div style={{ fontSize: 12, color: "var(--gray-mid)" }}>
                          JPG, PNG, WEBP — max 10MB
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (file.size > 10 * 1024 * 1024) {
                            alert(
                              "File too large. Please choose an image under 10MB.",
                            );
                            return;
                          }
                          const fd = new FormData();
                          fd.append("files", file);
                          try {
                            const res = await fetch("/api/media/upload", {
                              method: "POST",
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("gl_token")}`,
                              },
                              body: fd,
                            });
                            const data = await res.json();
                            if (data.files && data.files[0]) {
                              const url = data.files[0].url.startsWith("/")
                                ? `http://localhost:5000${data.files[0].url}`
                                : data.files[0].url;
                              U("heroImageUrl", url);
                            }
                          } catch {
                            alert(
                              "Upload failed. Try pasting a URL below instead.",
                            );
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Option 2: Paste URL */}
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--gray-dark)",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      Option 2 — Paste an image URL
                    </label>
                    <input
                      value={s?.heroImageUrl || ""}
                      onChange={(e) => U("heroImageUrl", e.target.value)}
                      placeholder="https://images.unsplash.com/photo-xxxxx?w=1920&q=80"
                    />
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--gray-soft)",
                        marginTop: 4,
                      }}
                    >
                      Works with Unsplash, Cloudinary, or any direct image link
                      ending in .jpg or .png
                    </div>
                  </div>

                  {/* Quick Unsplash suggestions */}
                  <div style={{ marginTop: 16 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--gray-mid)",
                        marginBottom: 10,
                        letterSpacing: 0.5,
                      }}
                    >
                      QUICK PICKS — Click to use
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 8,
                      }}
                    >
                      {[
                        {
                          label: "Church Worship",
                          url: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&q=80",
                        },
                        {
                          label: "Congregation",
                          url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80",
                        },
                        {
                          label: "Prayer Hands",
                          url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920&q=80",
                        },
                        {
                          label: "Cross at Sunset",
                          url: "https://images.unsplash.com/photo-1601921004897-b7d582836990?w=1920&q=80",
                        },
                        {
                          label: "Open Bible",
                          url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1920&q=80",
                        },
                        {
                          label: "Candles & Light",
                          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80",
                        },
                      ].map((img) => (
                        <div
                          key={img.label}
                          onClick={() => U("heroImageUrl", img.url)}
                          style={{
                            cursor: "pointer",
                            borderRadius: 8,
                            overflow: "hidden",
                            border: `2px solid ${s?.heroImageUrl === img.url ? "var(--forest)" : "transparent"}`,
                            transition: "border-color 0.2s",
                            position: "relative",
                          }}
                        >
                          <img
                            src={img.url.replace("w=1920", "w=200")}
                            alt={img.label}
                            style={{
                              width: "100%",
                              height: 60,
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background:
                                s?.heroImageUrl === img.url
                                  ? "rgba(27,67,50,0.4)"
                                  : "rgba(0,0,0,0)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "background 0.2s",
                            }}
                          >
                            {s?.heroImageUrl === img.url && (
                              <span style={{ color: "white", fontSize: 18 }}>
                                ✓
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              padding: "5px 6px",
                              fontSize: 11,
                              color: "var(--gray-dark)",
                              background: "var(--white)",
                              fontWeight: 500,
                            }}
                          >
                            {img.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clear button */}
                  {s?.heroImageUrl && (
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ marginTop: 16 }}
                      onClick={() => U("heroImageUrl", "")}
                    >
                      Remove Hero Image
                    </button>
                  )}
                </div>
              </div>
            )}

            {tab === "social" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <h4
                  style={{
                    fontSize: 18,
                    borderBottom: "1px solid var(--gray-light)",
                    paddingBottom: 12,
                    marginBottom: 4,
                  }}
                >
                  Social Media
                </h4>
                {[
                  ["facebook", "Facebook URL"],
                  ["youtube", "YouTube Channel URL"],
                  ["instagram", "Instagram URL"],
                  ["twitter", "Twitter/X URL"],
                  [
                    "whatsappNumber",
                    "WhatsApp Number (with country code, e.g. 2348012345678)",
                  ],
                ].map(([k, l]) => (
                  <div key={k} className="form-group">
                    <label>{l}</label>
                    <input
                      value={s?.[k] || ""}
                      onChange={(e) => U(k, e.target.value)}
                      placeholder="https://…"
                    />
                  </div>
                ))}
                <div className="divider" />
                <h4 style={{ fontSize: 18 }}>🔴 Live Streaming</h4>
                <div className="form-group">
                  <label>YouTube Live Embed URL</label>
                  <input
                    value={s?.liveStreamUrl || ""}
                    onChange={(e) => U("liveStreamUrl", e.target.value)}
                    placeholder="https://www.youtube.com/embed/live_stream?channel=…"
                  />
                </div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    padding: "16px 18px",
                    background: s?.liveIsActive
                      ? "var(--danger-pale)"
                      : "var(--gray-ghost)",
                    borderRadius: 10,
                    border: `1px solid ${s?.liveIsActive ? "var(--danger)" : "var(--gray-light)"}`,
                  }}
                >
                  <div
                    className={`toggle ${s?.liveIsActive ? "on" : ""}`}
                    style={{
                      background: s?.liveIsActive ? "var(--danger)" : undefined,
                    }}
                    onClick={() => U("liveIsActive", !s?.liveIsActive)}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: s?.liveIsActive
                          ? "var(--danger)"
                          : "var(--charcoal)",
                      }}
                    >
                      Church is LIVE now
                    </div>
                    <div style={{ fontSize: 13, color: "var(--gray-mid)" }}>
                      Shows the live indicator on the homepage header and hero
                    </div>
                  </div>
                </label>
                <div className="divider" />
                <h5
                  style={{
                    fontSize: 16,
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    marginBottom: 16,
                  }}
                >
                  📻 Online Radio
                </h5>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label>Radio Station Name</label>
                  <input
                    value={s?.radioName || ""}
                    onChange={(e) => U("radioName", e.target.value)}
                    placeholder="LICEM Radio"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label>Stream URL</label>
                  <input
                    value={s?.radioStreamUrl || ""}
                    onChange={(e) => U("radioStreamUrl", e.target.value)}
                    placeholder="https://stream.zeno.fm/xxxxx or any .mp3 / .aac stream URL"
                  />
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--gray-soft)",
                      marginTop: 4,
                    }}
                  >
                    Works with: Zeno.fm, Radio.co, Shoutcast, Icecast, or any
                    direct stream URL ending in .mp3 or .aac
                  </div>
                </div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    padding: "14px 16px",
                    background: s?.radioIsLive
                      ? "var(--danger-pale)"
                      : "var(--gray-ghost)",
                    borderRadius: 10,
                  }}
                >
                  <div
                    className={`toggle ${s?.radioIsLive ? "on" : ""}`}
                    style={{
                      background: s?.radioIsLive ? "var(--danger)" : undefined,
                    }}
                    onClick={() => U("radioIsLive", !s?.radioIsLive)}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: s?.radioIsLive
                          ? "var(--danger)"
                          : "var(--charcoal)",
                      }}
                    >
                      Mark Radio as LIVE
                    </div>
                    <div style={{ fontSize: 12, color: "var(--gray-mid)" }}>
                      Shows a red LIVE badge on the radio page
                    </div>
                  </div>
                </label>
                <div
                  style={{
                    marginTop: 14,
                    padding: "14px 16px",
                    background: "var(--info-pale)",
                    borderRadius: 10,
                    fontSize: 13,
                    color: "var(--gray-dark)",
                    lineHeight: 1.7,
                  }}
                >
                  <strong>Free radio stream options:</strong>
                  <br />
                  1. <strong>Zeno.fm</strong> — free, sign up at zeno.fm, get
                  your stream URL
                  <br />
                  2. <strong>Mixlr</strong> — mixlr.com — easy mobile streaming
                  <br />
                  3. <strong>Radio.co</strong> — professional, paid
                  <br />
                  4. Any <strong>.mp3 direct link</strong> works as a stream URL
                </div>
              </div>
            )}

            {tab === "seo" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <h4
                  style={{
                    fontSize: 18,
                    borderBottom: "1px solid var(--gray-light)",
                    paddingBottom: 12,
                    marginBottom: 4,
                  }}
                >
                  SEO & Meta Tags
                </h4>
                <div className="form-group">
                  <label>Meta Title</label>
                  <input
                    value={s?.metaTitle || ""}
                    onChange={(e) => U("metaTitle", e.target.value)}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color:
                        (s?.metaTitle?.length || 0) > 60
                          ? "var(--danger)"
                          : "var(--gray-soft)",
                    }}
                  >
                    {s?.metaTitle?.length || 0} / 60 characters
                  </span>
                </div>
                <div className="form-group">
                  <label>Meta Description</label>
                  <textarea
                    rows={3}
                    value={s?.metaDesc || ""}
                    onChange={(e) => U("metaDesc", e.target.value)}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color:
                        (s?.metaDesc?.length || 0) > 160
                          ? "var(--danger)"
                          : "var(--gray-soft)",
                    }}
                  >
                    {s?.metaDesc?.length || 0} / 160 characters
                  </span>
                </div>
                <div className="form-group">
                  <label>Meta Keywords</label>
                  <input
                    value={s?.metaKeywords || ""}
                    onChange={(e) => U("metaKeywords", e.target.value)}
                    placeholder="church, Lagos, worship, faith"
                  />
                </div>
                <div className="form-group">
                  <label>Google Analytics ID</label>
                  <input
                    value={s?.googleAnalytics || ""}
                    onChange={(e) => U("googleAnalytics", e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div
                  style={{
                    padding: "18px 20px",
                    background: "var(--gray-ghost)",
                    borderRadius: 10,
                    border: "1px solid var(--gray-light)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--gray-soft)",
                      marginBottom: 10,
                      fontWeight: 700,
                      letterSpacing: 1,
                    }}
                  >
                    GOOGLE SEARCH PREVIEW
                  </div>
                  <div style={{ fontSize: 18, color: "#1a0dab" }}>
                    {s?.metaTitle || s?.siteName}
                  </div>
                  <div style={{ fontSize: 13, color: "#006621", marginTop: 2 }}>
                    licem.org
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#545454",
                      marginTop: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    {(s?.metaDesc || "").substring(0, 155)}
                    {(s?.metaDesc?.length || 0) > 155 ? "…" : ""}
                  </div>
                </div>
              </div>
            )}

            {tab === "payment" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <h4
                  style={{
                    fontSize: 18,
                    borderBottom: "1px solid var(--gray-light)",
                    paddingBottom: 12,
                    marginBottom: 4,
                  }}
                >
                  Payment Integration
                </h4>
                <div className="form-group">
                  <label>Payment Provider</label>
                  <select
                    value={s?.paymentProvider || "Paystack"}
                    onChange={(e) => U("paymentProvider", e.target.value)}
                  >
                    <option>Paystack</option>
                    <option>Flutterwave</option>
                    <option>Stripe</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Public API Key</label>
                  <input
                    value={s?.paymentKey || ""}
                    onChange={(e) => U("paymentKey", e.target.value)}
                    placeholder="pk_live_…"
                  />
                </div>
                <div className="form-group">
                  <label>Secret API Key</label>
                  <input
                    type="password"
                    placeholder="sk_live_… (stored securely in backend .env)"
                  />
                </div>
                <div
                  style={{
                    padding: "14px 16px",
                    background: "var(--warning-pale)",
                    borderRadius: 9,
                    fontSize: 13,
                    color: "var(--gray-dark)",
                    borderLeft: "3px solid var(--warning)",
                  }}
                >
                  ⚠️ Never expose your secret key here. Store it in backend{" "}
                  <code>.env</code> only.
                </div>
              </div>
            )}

            {tab === "moderation" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <h4
                  style={{
                    fontSize: 18,
                    borderBottom: "1px solid var(--gray-light)",
                    paddingBottom: 12,
                    marginBottom: 4,
                  }}
                >
                  Comment Moderation
                </h4>
                {[
                  [
                    "allowComments",
                    "Allow comments on sermons and posts",
                    "Enable or disable the comment system site-wide",
                  ],
                  [
                    "requireApproval",
                    "Require admin approval before comments appear",
                    "Prevents spam from going live immediately",
                  ],
                ].map(([k, l, d]) => (
                  <label
                    key={k}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      cursor: "pointer",
                      padding: "16px 18px",
                      background: "var(--gray-ghost)",
                      borderRadius: 10,
                    }}
                  >
                    <div
                      className={`toggle ${s?.[k] ? "on" : ""}`}
                      onClick={() => U(k, !s?.[k])}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{l}</div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--gray-mid)",
                          marginTop: 3,
                        }}
                      >
                        {d}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {tab === "advanced" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <h4
                  style={{
                    fontSize: 18,
                    borderBottom: "1px solid var(--gray-light)",
                    paddingBottom: 12,
                    marginBottom: 4,
                  }}
                >
                  Advanced Settings
                </h4>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    cursor: "pointer",
                    padding: "16px 18px",
                    background: s?.maintenanceMode
                      ? "var(--danger-pale)"
                      : "var(--gray-ghost)",
                    borderRadius: 10,
                    border: `1px solid ${s?.maintenanceMode ? "var(--danger)" : "var(--gray-light)"}`,
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    className={`toggle ${s?.maintenanceMode ? "on" : ""}`}
                    style={{
                      background: s?.maintenanceMode
                        ? "var(--danger)"
                        : undefined,
                    }}
                    onClick={() => U("maintenanceMode", !s?.maintenanceMode)}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: s?.maintenanceMode
                          ? "var(--danger)"
                          : "var(--charcoal)",
                      }}
                    >
                      Maintenance Mode
                    </div>
                    <div style={{ fontSize: 13, color: "var(--gray-mid)" }}>
                      Hides the public website — visitors see a maintenance page
                    </div>
                  </div>
                </label>
                <div className="divider" />
                <h4 style={{ fontSize: 16 }}>Danger Zone</h4>
                <div
                  style={{
                    padding: 20,
                    border: "1px solid var(--danger)",
                    borderRadius: 10,
                    background: "var(--danger-pale)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      marginBottom: 16,
                      color: "var(--gray-dark)",
                    }}
                  >
                    These actions are irreversible. Please proceed with extreme
                    caution.
                  </p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        alert("Feature available in production build.")
                      }
                    >
                      Export All Data
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => alert("Cache cleared!")}
                    >
                      Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// ── PRAYER WALL ADMIN ─────────────────────────────
export function AdminPrayerWall() {
  const { showToast } = useApp();
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const load = () => {
    setLoading(true);
    import("../api").then(({ default: API }) => {
      API.get("/prayers")
        .then((r) => setPrayers(r.data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  };
  useState(() => {
    load();
  }, []);

  const markAnswered = async (id) => {
    try {
      const { default: API } = await import("../api");
      await API.put(`/prayers/${id}/answered`);
      setPrayers((p) =>
        p.map((x) => (x._id === id ? { ...x, answered: true } : x)),
      );
      showToast("Marked as answered! 🙏");
    } catch {
      showToast("Error.", "error");
    }
  };

  const del = async (id) => {
    try {
      const { default: API } = await import("../api");
      await API.delete(`/prayers/${id}`);
      setPrayers((p) => p.filter((x) => x._id !== id));
      showToast("Prayer request deleted.");
    } catch {
      showToast("Error.", "error");
    }
  };

  const filtered =
    filter === "All"
      ? prayers
      : filter === "Answered"
        ? prayers.filter((p) => p.answered)
        : prayers.filter((p) => !p.answered);
  const totalPrayers = prayers.reduce((a, p) => a + (p.prayerCount || 0), 0);

  return (
    <div style={{ padding: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <h3 style={{ fontSize: 20 }}>Prayer Wall</h3>
          <p style={{ color: "var(--gray-mid)", fontSize: 14, marginTop: 4 }}>
            {prayers.length} requests · {totalPrayers} times prayed
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Pending", "Answered"].map((f) => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card table-wrap">
        {loading ? (
          <div style={{ padding: 48, textAlign: "center" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--gray-mid)",
            }}
          >
            No prayer requests.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Request</th>
                <th>Category</th>
                <th>Prayers</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>
                    {p.anonymous ? "Anonymous" : p.name || "Anonymous"}
                  </td>
                  <td style={{ maxWidth: 260 }}>
                    <div
                      style={{
                        fontSize: 13,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.request}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-gray">{p.category}</span>
                  </td>
                  <td
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--forest)",
                    }}
                  >
                    🙏 {p.prayerCount || 0}
                  </td>
                  <td style={{ fontSize: 12, color: "var(--gray-mid)" }}>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {p.answered ? (
                      <span className="badge badge-green">Answered</span>
                    ) : (
                      <span className="badge badge-gold">Active</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {!p.answered && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => markAnswered(p._id)}
                          title="Mark answered"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => del(p._id)}
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function AdminAnnouncements() {
  const { showToast } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ text: "", active: true, order: 0 });
  const S = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    import("../api").then((m) => {
      m.default
        .get("/announcements/admin/all")
        .then((r) => setItems(r.data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, []);

  const save = async () => {
    try {
      const { default: API } = await import("../api");
      const r = await API.post("/announcements", form);
      setItems((i) => [r.data, ...i]);
      setModal(false);
      setForm({ text: "", active: true, order: 0 });
      showToast("Announcement saved!");
    } catch {
      showToast("Error.", "error");
    }
  };

  const toggle = async (id, active) => {
    try {
      const { default: API } = await import("../api");
      const r = await API.put(`/announcements/${id}`, { active: !active });
      setItems((i) => i.map((x) => (x._id === id ? r.data : x)));
      showToast(
        r.data.active ? "Announcement active!" : "Announcement hidden.",
      );
    } catch {
      showToast("Error.", "error");
    }
  };

  const del = async (id) => {
    try {
      const { default: API } = await import("../api");
      await API.delete(`/announcements/${id}`);
      setItems((i) => i.filter((x) => x._id !== id));
      showToast("Deleted.");
    } catch {
      showToast("Error.", "error");
    }
  };

  return (
    <div style={{ padding: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h3 style={{ fontSize: 20 }}>Announcements</h3>
          <p style={{ color: "var(--gray-mid)", fontSize: 14 }}>
            Scrolling ticker shown at the top of your website
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <Icon name="plus" size={15} /> Add Announcement
        </button>
      </div>
      <div className="card table-wrap">
        {loading ? (
          <div style={{ padding: 48, textAlign: "center" }}>Loading...</div>
        ) : items.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--gray-mid)",
            }}
          >
            No announcements yet.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Announcement Text</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a._id}>
                  <td style={{ maxWidth: 400, fontWeight: 500 }}>{a.text}</td>
                  <td>
                    <span
                      className={`badge ${a.active ? "badge-green" : "badge-gray"}`}
                    >
                      {a.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--gray-mid)" }}>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className={`btn btn-sm ${a.active ? "btn-ghost" : "btn-success"}`}
                        onClick={() => toggle(a._id, a.active)}
                      >
                        {a.active ? "Hide" : "Show"}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => del(a._id)}
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Announcement</h3>
              <button className="modal-close" onClick={() => setModal(false)}>
                ×
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-group">
                <label>Announcement Text</label>
                <textarea
                  rows={3}
                  value={form.text}
                  onChange={(e) => S("text", e.target.value)}
                  placeholder="e.g. Sunday service starts at 9AM. All are welcome!"
                />
              </div>
              <div className="form-group">
                <label>Display Order (lower = first)</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => S("order", Number(e.target.value))}
                />
              </div>
              <label style={{ display: "flex", gap: 10, cursor: "pointer" }}>
                <div
                  className={`toggle ${form.active ? "on" : ""}`}
                  onClick={() => S("active", !form.active)}
                />
                <span style={{ fontSize: 14 }}>Active (visible on site)</span>
              </label>
              <button
                className="btn btn-primary"
                onClick={save}
                disabled={!form.text}
              >
                Save Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export function AdminContactMessages() {
  const { showToast } = useApp();
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirm,  setConfirm]  = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('gl_token')}`,
        },
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await fetch(`/api/contact/${id}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('gl_token')}`,
        },
      });
      setMessages(m => m.map(x => x._id === id ? { ...x, read: true } : x));
    } catch {
      showToast('Error.', 'error');
    }
  };

  const del = async () => {
    try {
      await fetch(`/api/contact/${confirm.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('gl_token')}`,
        },
      });
      setMessages(m => m.filter(x => x._id !== confirm.id));
      if (selected?._id === confirm.id) setSelected(null);
      showToast('Message deleted.');
    } catch {
      showToast('Error.', 'error');
    }
    setConfirm(null);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 20 }}>Contact Messages</h3>
          <p style={{ color: 'var(--gray-mid)', fontSize: 14, marginTop: 4 }}>
            {messages.length} total
            {unreadCount > 0 && (
              <span style={{ marginLeft: 10, background: 'var(--danger)', color: 'white', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.4fr' : '1fr', gap: 20 }}>

        {/* Message list */}
        <div className="card table-wrap">
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center' }}><Spinner size={32} /></div>
          ) : messages.length === 0 ? (
            <EmptyState icon="mail" title="No messages yet" desc="Contact form submissions will appear here." />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(m => (
                  <tr
                    key={m._id}
                    style={{ cursor: 'pointer', background: selected?._id === m._id ? 'var(--forest-ghost)' : undefined }}
                    onClick={() => { setSelected(m); markRead(m._id); }}
                  >
                    <td>
                      <div style={{ fontWeight: m.read ? 400 : 700, fontSize: 14 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-mid)' }}>{m.email}</div>
                    </td>
                    <td style={{ fontSize: 13, maxWidth: 160 }}>
                      <div style={{ fontWeight: m.read ? 400 : 600 }} className="truncate">
                        {m.subject || '(No subject)'}
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--gray-mid)', whiteSpace: 'nowrap' }}>
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${m.read ? 'badge-gray' : 'badge-green'}`}>
                        {m.read ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={e => { e.stopPropagation(); setConfirm({ id: m._id }); }}
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Message detail */}
        {selected && (
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--gray-light)' }}>
              <h4 style={{ fontSize: 18 }}>{selected.subject || '(No subject)'}</h4>
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--forest), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {selected.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-mid)' }}>{selected.email}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-soft)', marginTop: 2 }}>
                  {new Date(selected.createdAt).toDateString()} at {new Date(selected.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 20px', background: 'var(--gray-ghost)', borderRadius: 10, lineHeight: 1.85, fontSize: 15, color: 'var(--gray-dark)', whiteSpace: 'pre-wrap' }}>
              {selected.message}
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                className="btn btn-primary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                <Icon name="mail" size={13} /> Reply via Email
              </a>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => setConfirm({ id: selected._id })}
              >
                <Icon name="trash" size={13} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {confirm && (
        <ConfirmModal
          title="Delete Message?"
          message="This message will be permanently deleted."
          onConfirm={del}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
// export default AdminComments
