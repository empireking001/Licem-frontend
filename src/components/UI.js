import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

/* ── Icon ──────────────────────────────────────────── */
export const Icon = ({ name, size = 18, color = 'currentColor', style }) => {
  const paths = {
    home:          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>,
    menu:          <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x:             <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    play:          <polygon points="5 3 19 12 5 21 5 3"/>,
    heart:         <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>,
    chat:          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>,
    share:         <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    calendar:      <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    map:           <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    mail:          <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    search:        <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    settings:      <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    users:         <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    dollar:        <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    image:         <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    images:        <><path d="M18 22H4a2 2 0 01-2-2V6"/><path d="M22 16V4a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2z"/><circle cx="14" cy="9" r="2"/><polyline points="22 16 17 11 11 16"/></>,
    video:         <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>,
    file:          <><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></>,
    plus:          <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit:          <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:         <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></>,
    check:         <polyline points="20 6 9 17 4 12"/>,
    eye:           <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    sun:           <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon:          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>,
    chevDown:      <polyline points="6 9 12 15 18 9"/>,
    chevRight:     <polyline points="9 18 15 12 9 6"/>,
    chevLeft:      <polyline points="15 18 9 12 15 6"/>,
    pin:           <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    link:          <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
    bell:          <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    upload:        <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
    download:      <><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
    globe:         <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    layout:        <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></>,
    activity:      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
    logOut:        <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    lock:          <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    tag:           <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    star:          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    arrowRight:    <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    photo:         <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></>,
    grid:          <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    list:          <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    copy:          <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    shield:        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    zap:           <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    bookOpen:      <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></>,
    music:         <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    church:        <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths[name]}
    </svg>
  );
};

/* ── Spinner ───────────────────────────────────────── */
export const Spinner = ({ size = 24, color = 'var(--forest)' }) => (
  <div style={{
    width: size, height: size, border: `2.5px solid ${color}20`,
    borderTopColor: color, borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ── Toast ─────────────────────────────────────────── */
export const ToastDisplay = () => {
  const { toast } = useApp();
  if (!toast) return null;
  const icons = { success: 'check', error: 'x', info: 'bell' };
  const colors = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--info)' };
  return (
    <div className={`toast toast-${toast.type}`} key={toast.id}>
      <Icon name={icons[toast.type] || 'check'} size={16} color={colors[toast.type] || 'var(--success)'} />
      {toast.msg}
    </div>
  );
};

/* ── Modal ─────────────────────────────────────────── */
export const Modal = ({ title, onClose, children, width = 620 }) => {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: width }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

/* ── Confirm modal ─────────────────────────────────── */
export const ConfirmModal = ({ title, message, onConfirm, onCancel, danger = true }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
      <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: danger ? 'var(--danger-pale)' : 'var(--warning-pale)',
          margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon name="trash" size={24} color={danger ? 'var(--danger)' : 'var(--warning)'} />
        </div>
        <h3 style={{ fontSize: 22, marginBottom: 10 }}>{title}</h3>
        <p style={{ color: 'var(--gray-mid)', fontSize: 15 }}>{message}</p>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-gold'}`} onClick={onConfirm}>
          {danger ? 'Delete' : 'Confirm'}
        </button>
      </div>
    </div>
  </div>
);

/* ── Empty state ───────────────────────────────────── */
export const EmptyState = ({ icon = 'file', title = 'Nothing here yet', desc = '', action }) => (
  <div style={{
    textAlign: 'center', padding: '64px 24px',
    color: 'var(--gray-mid)',
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: 'var(--gray-pale)', margin: '0 auto 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Icon name={icon} size={32} color="var(--gray-soft)" />
    </div>
    <h4 style={{ fontSize: 20, color: 'var(--charcoal)', marginBottom: 8 }}>{title}</h4>
    {desc && <p style={{ fontSize: 15, maxWidth: 340, margin: '0 auto 24px' }}>{desc}</p>}
    {action}
  </div>
);

/* ── Page banner ───────────────────────────────────── */
export const PageBanner = ({ eyebrow, title, subtitle, bg }) => (
  <div style={{
    background: bg || 'linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 60%, var(--forest-mid) 100%)',
    padding: '100px 0 64px', textAlign: 'center', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: -80, right: -80, width: 320, height: 320,
      borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
    }} />
    <div style={{
      position: 'absolute', bottom: -60, left: -60, width: 220, height: 220,
      borderRadius: '50%', background: 'rgba(201,149,58,0.08)',
    }} />
    <div className="container animate-up" style={{ position: 'relative' }}>
      {eyebrow && <span className="eyebrow" style={{ color: 'var(--gold-light)', display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 14 }}>{eyebrow}</span>}
      <h1 style={{ color: 'white', marginBottom: 16 }}>{title}</h1>
      {subtitle && <p style={{ color: 'rgba(255,255,255,0.72)', maxWidth: 520, margin: '0 auto', fontSize: 17, lineHeight: 1.7 }}>{subtitle}</p>}
    </div>
  </div>
);

/* ── Avatar ────────────────────────────────────────── */
export const Avatar = ({ name = '', size = 36 }) => {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, var(--forest), var(--gold-bright))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontSize: size * 0.36, fontWeight: 700,
      fontFamily: 'var(--font-body)',
    }}>{initials || '?'}</div>
  );
};

/* ── Stat card ─────────────────────────────────────── */
export const StatCard = ({ label, value, icon, color = 'var(--forest)', trend, sub }) => (
  <div className="card" style={{ padding: 22 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={21} color={color} />
      </div>
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 13, color: 'var(--gray-dark)', marginTop: 5 }}>{label}</div>
    {trend && <div style={{ fontSize: 12, color: 'var(--forest-mid)', marginTop: 7, fontWeight: 600 }}>{trend}</div>}
    {sub   && <div style={{ fontSize: 12, color: 'var(--gray-soft)', marginTop: 4 }}>{sub}</div>}
  </div>
);

/* ── Section heading ───────────────────────────────── */
export const SectionHeader = ({ eyebrow, title, subtitle, center = true }) => (
  <div className="section-header" style={{ textAlign: center ? 'center' : 'left' }}>
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2>{title}</h2>
    {subtitle && <p>{subtitle}</p>}
  </div>
);
