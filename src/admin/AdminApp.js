import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icon, Spinner, ToastDisplay } from '../components/UI';
import AdminOverview  from './AdminOverview';
import AdminSermons   from './AdminSermons';
import AdminEvents    from './AdminEvents';
import AdminBlog      from './AdminBlog';
import AdminGallery   from './AdminGallery';
import AdminConnectManager from './AdminConnectManager';
import TestimonyManager from './TestimonyManager';
import {
  AdminComments,
  AdminContactMessages
  AdminDonations,
  AdminUsers,
  AdminMedia,
  AdminSettings,
  AdminPrayerWall,
  AdminAnnouncements,
} from "./AdminPanels";

const MENU = [
  { key: "overview", label: "Overview", icon: "activity" },
  { key: "sermons", label: "Sermons", icon: "video" },
  { key: "events", label: "Events", icon: "calendar" },
  { key: "blog", label: "Blog Posts", icon: "file" },
  { key: "gallery", label: "Gallery", icon: "images" },
  { key: "media", label: "Media Library", icon: "image" },
  { key: "prayer", label: "Prayer Wall", icon: "heart" },
  { key: "announcements", label: "Announcements", icon: "bell" },
  { key: "comments", label: "Comments", icon: "chat" },
  { key: "messages", label: "Contact Messages", icon: "mail" },
  { key: "donations", label: "Donations", icon: "dollar" },
  { key: "users", label: "Users", icon: "users" },
  { key: "settings", label: "Site Settings", icon: "settings" },
  { key: "password", label: "Change Password", icon: "lock" },
  { key: "AdminConnectManager", label: "Connect Cards", icon: "globe" },
  { key: "testimonies", label: "Testimonies", icon: "heart" },
];

/* ── LOGIN ─────────────────────────────────────────── */
function AdminLogin() {
  const { login } = useApp();
  const [email,    setEmail]    = useState('pastor@gracelife.org');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    try { await login(email, password); }
    catch (e) { setError(e.response?.data?.message || 'Invalid credentials. Please try again.'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, var(--forest) 0%, var(--charcoal) 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(201,149,58,0.07)', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(64,145,108,0.1)', filter: 'blur(60px)' }} />
      <div style={{ width: '100%', maxWidth: 440, padding: '0 24px' }}>
        <div style={{ background: 'var(--white)', borderRadius: 24, padding: '44px 40px', boxShadow: '0 32px 80px rgba(0,0,0,0.35)' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 18px', background: 'linear-gradient(135deg, var(--forest), var(--forest-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-forest)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'white', fontWeight: 700 }}>G</span>
            </div>
            <h2 style={{ fontSize: 26, marginBottom: 6 }}>Admin Dashboard</h2>
            <p style={{ color: 'var(--gray-mid)', fontSize: 14 }}>LICEM Church CMS</p>
          </div>
          {error && <div style={{ padding: '12px 16px', background: 'var(--danger-pale)', color: 'var(--danger)', borderRadius: 9, fontSize: 14, marginBottom: 22, borderLeft: '3px solid var(--danger)' }}>{error}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            <div className="form-group"><label>Email Address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@church.org" onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
            <div className="form-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
          </div>
          <button className="btn btn-primary btn-full btn-lg" style={{ justifyContent: 'center' }} onClick={handleLogin} disabled={loading}>
            {loading ? <Spinner size={18} color="white" /> : <><Icon name="lock" size={17} /> Sign In to Dashboard</>}
          </button>
          <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--gray-ghost)', borderRadius: 9, fontSize: 13, color: 'var(--gray-mid)' }}>
            <strong>Demo:</strong> pastor@gracelife.org / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SIDEBAR ───────────────────────────────────────── */
function Sidebar({ active, setActive, collapsed, setCollapsed, onLogout, user }) {
  return (
    <aside style={{ width: collapsed ? 66 : 248, minWidth: collapsed ? 66 : 248, background: 'var(--charcoal)', minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'width 0.3s var(--ease)', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
      <div style={{ padding: collapsed ? '18px 16px' : '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'space-between', minHeight: 70 }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: 'linear-gradient(135deg, var(--forest), var(--forest-mid))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>G</div>
            <div>
              <div style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>LICEM</div>
              <div style={{ fontSize: 10, color: 'var(--gold-light)', letterSpacing: 2, textTransform: 'uppercase' }}>CMS</div>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', width: 28, height: 28, borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
          <Icon name={collapsed ? 'chevRight' : 'chevLeft'} size={13} color="currentColor" />
        </button>
      </div>
      <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {MENU.map(m => (
          <button key={m.key} onClick={() => setActive(m.key)} title={collapsed ? m.label : ''} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: collapsed ? '12px' : '11px 18px', background: active === m.key ? 'rgba(64,145,108,0.22)' : 'transparent', borderLeft: `3px solid ${active === m.key ? 'var(--forest-mid)' : 'transparent'}`, color: active === m.key ? 'var(--forest-pale)' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s', justifyContent: collapsed ? 'center' : 'flex-start', margin: '1px 0', fontSize: 14, fontWeight: active === m.key ? 600 : 400 }}
            onMouseOver={e => { if (active !== m.key) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseOut={e => { if (active !== m.key) e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon name={m.icon} size={17} color="currentColor" />
            {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{m.label}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding: collapsed ? '14px 12px' : '14px 18px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {!collapsed && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--forest), var(--gold-bright))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>
              {user.name?.split(' ').slice(0, 2).map(n => n[0]).join('') || 'AD'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--forest-mid)' }}>{user.role}</div>
            </div>
          </div>
        )}
        <button onClick={onLogout} title="Logout" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', padding: '8px', borderRadius: 8, width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', transition: 'color 0.2s', fontFamily: 'var(--font-body)' }}
          onMouseOver={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          <Icon name="logOut" size={15} color="currentColor" />
          {!collapsed && <span style={{ fontSize: 13 }}>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

/* ── HEADER ────────────────────────────────────────── */
function AdminHeader({ active, user, onViewSite }) {
  const { dark, setDark } = useApp();
  const label = MENU.find(m => m.key === active)?.label || 'Dashboard';
  return (
    <header
      style={{
        background: "var(--white)",
        borderBottom: "1px solid var(--gray-light)",
        padding: "0 28px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <div>
        <h2 style={{ fontSize: 19, margin: 0 }}>{label}</h2>
        <div style={{ fontSize: 12, color: "var(--gray-soft)", marginTop: 2 }}>
          LICEM Church Administration
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => (window.location.href = "/")}
        >
          <Icon name="globe" size={14} /> View Site
        </button>
        <button
          onClick={() => setDark(!dark)}
          style={{
            background: "var(--gray-pale)",
            border: "1px solid var(--gray-light)",
            borderRadius: 8,
            padding: "8px 10px",
            cursor: "pointer",
            color: "var(--gray-dark)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon name={dark ? "sun" : "moon"} size={15} />
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            paddingLeft: 10,
            borderLeft: "1px solid var(--gray-light)",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--forest), var(--gold-bright))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {user?.name
              ?.split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("") || "AD"}
          </div>
          <div className="desktop-only">
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--gray-soft)" }}>
              {user?.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── ROOT ADMIN ────────────────────────────────────── */
export default function AdminApp() {
  const { user, logout, setPage } = useApp();
  const [active,    setActive]    = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return <><AdminLogin /><ToastDisplay /></>;

  const PANELS = {
    overview: <AdminOverview setActive={setActive} />,
    sermons: <AdminSermons />,
    events: <AdminEvents />,
    blog: <AdminBlog />,
    gallery: <AdminGallery />,
    media: <AdminMedia />,
    comments: <AdminComments />,
    messages: <AdminContactMessages />,
    donations: <AdminDonations />,
    users: <AdminUsers />,
    prayer: <AdminPrayerWall />,
    announcements: <AdminAnnouncements />,
    settings: <AdminSettings />,
    AdminConnectManager: <AdminConnectManager />,
    testimonies: <TestimonyManager />,
    password: <AdminChangePassword />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-pale)' }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout} user={user} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <AdminHeader active={active} user={user} onViewSite={() => setPage('home')} />
        <main style={{ flex: 1, overflow: 'auto' }} className="animate-fade">
          {PANELS[active] || <AdminOverview setActive={setActive} />}
        </main>
      </div>
      <ToastDisplay />
    </div>
  );
}

function AdminChangePassword() {
  const { showToast } = useApp();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const S = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      showToast('Please fill in all fields.', 'error'); return;
    }
    if (form.newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error'); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      showToast('New passwords do not match.', 'error'); return;
    }
    setLoading(true);
    try {
      await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('gl_token')}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      }).then(r => r.json()).then(data => {
        if (data.message === 'Password updated successfully') {
          setDone(true);
          setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          showToast('Password changed successfully!');
        } else {
          showToast(data.message || 'Error changing password.', 'error');
        }
      });
    } catch {
      showToast('Network error. Please try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ maxWidth: 480 }}>
        <h3 style={{ fontSize: 20, marginBottom: 6 }}>Change Password</h3>
        <p style={{ color: 'var(--gray-mid)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          Update your admin account password. You will need to log in again after changing it.
        </p>

        {done && (
          <div style={{ padding: '14px 18px', background: 'var(--success-pale)', border: '1px solid var(--success)', borderRadius: 10, color: 'var(--success)', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
            ✓ Password changed successfully!
          </div>
        )}

        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={e => S('currentPassword', e.target.value)}
                placeholder="Enter your current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={e => S('newPassword', e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => S('confirmPassword', e.target.value)}
                placeholder="Repeat new password"
                onKeyDown={e => e.key === 'Enter' && submit()}
              />
            </div>

            {form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword && (
              <div style={{ fontSize: 13, color: 'var(--danger)', fontWeight: 600 }}>
                ✗ Passwords do not match
              </div>
            )}
            {form.newPassword && form.confirmPassword && form.newPassword === form.confirmPassword && (
              <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
                ✓ Passwords match
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ justifyContent: 'center', marginTop: 8 }}
              onClick={submit}
              disabled={loading}
            >
              {loading ? 'Updating...' : '🔐 Update Password'}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--warning-pale)', borderRadius: 10, fontSize: 13, color: 'var(--gray-dark)', lineHeight: 1.7, border: '1px solid var(--warning)' }}>
          <strong>⚠️ Security tips:</strong><br />
          Use at least 8 characters with a mix of letters, numbers and symbols.<br />
          Never share your admin password with anyone.
        </div>
      </div>
    </div>
  );
}
