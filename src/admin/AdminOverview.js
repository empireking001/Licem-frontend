import { useState, useEffect } from 'react';
import { sermonsAPI, eventsAPI, postsAPI, donationsAPI, commentsAPI, usersAPI } from '../api';
import { Icon, StatCard, Spinner } from '../components/UI';

export default function AdminOverview({ setActive }) {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent,  setRecent]  = useState([]);

  useEffect(() => {
    Promise.all([
      sermonsAPI.getAll({ limit: 100 }),
      eventsAPI.getAll(),
      postsAPI.adminAll(),
      donationsAPI.getAll({ limit: 200 }),
      commentsAPI.getAll(),
      usersAPI.getAll(),
    ]).then(([s, e, p, d, c, u]) => {
      const donationData = d.data;
      setStats({
        sermons:   s.data.total || 0,
        events:    (e.data || []).length,
        posts:     (p.data || []).length,
        donations: donationData.sum || 0,
        comments:  (c.data || []).length,
        pending:   (c.data || []).filter(x => !x.approved && !x.spam).length,
        users:     (u.data || []).length,
        views:     (s.data.sermons || []).reduce((a, s) => a + (s.views || 0), 0),
        byType:    donationData.byType || [],
      });
      // Build recent activity
      const acts = [];
      (s.data.sermons || []).slice(0, 2).forEach(x => acts.push({ type: 'Sermon',   title: x.title, time: x.createdAt, icon: 'video',    color: 'var(--forest)' }));
      (donationData.donations || []).slice(0, 2).forEach(x => acts.push({ type: 'Donation', title: `₦${x.amount?.toLocaleString()} — ${x.type}`, time: x.createdAt, icon: 'dollar',   color: 'var(--gold)' }));
      (c.data || []).slice(0, 2).forEach(x => acts.push({ type: 'Comment',  title: x.text?.substring(0, 50), time: x.createdAt, icon: 'chat',     color: '#7C3AED' }));
      acts.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecent(acts.slice(0, 8));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}><Spinner size={40} /></div>;

  const topCards = [
    { label: 'Total Sermons',       value: stats?.sermons,            icon: 'video',    color: 'var(--forest)',  trend: 'All published messages' },
    { label: 'Blog Posts',          value: stats?.posts,              icon: 'file',     color: 'var(--gold)',    trend: 'Published & drafts' },
    { label: 'Total Comments',      value: stats?.comments,           icon: 'chat',     color: '#7C3AED',        trend: `${stats?.pending || 0} awaiting review` },
    { label: 'Total Donations',     value: `₦${(stats?.donations || 0).toLocaleString()}`, icon: 'dollar', color: 'var(--success)', trend: 'All time' },
    { label: 'Sermon Views',        value: (stats?.views || 0).toLocaleString(), icon: 'eye', color: '#0891B2', trend: 'Total across all sermons' },
    { label: 'Upcoming Events',     value: stats?.events,             icon: 'calendar', color: '#D97706',        trend: 'Scheduled events' },
    { label: 'Admin Users',         value: stats?.users,              icon: 'users',    color: '#6366F1',        trend: 'Active team members' },
    { label: 'Pending Comments',    value: stats?.pending,            icon: 'bell',     color: stats?.pending > 0 ? 'var(--danger)' : 'var(--gray-mid)', trend: 'Need moderation', },
  ];

  return (
    <div style={{ padding: 28 }}>
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg, var(--forest), var(--forest-mid))', borderRadius: 'var(--radius-lg)', padding: '24px 32px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ color: 'white', fontSize: 24, marginBottom: 6 }}>Welcome back 🙏</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>Here's what's happening at GraceLife today.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => setActive('sermons')}>
            <Icon name="plus" size={14} /> Add Sermon
          </button>
          <button className="btn btn-gold btn-sm" onClick={() => setActive('gallery')}>
            <Icon name="images" size={14} /> Add Photos
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {topCards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      <div className="grid-2" style={{ gap: 24 }}>
        {/* Recent activity */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 18 }}>Recent Activity</h3>
          </div>
          {recent.length === 0 ? (
            <p style={{ color: 'var(--gray-mid)', fontSize: 14 }}>No recent activity yet.</p>
          ) : recent.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < recent.length - 1 ? '1px solid var(--gray-light)' : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: r.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={r.icon} size={17} color={r.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-soft)', marginTop: 2 }}>
                  {r.type} · {r.time ? new Date(r.time).toLocaleDateString() : 'Recent'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Donation breakdown */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 20 }}>Donation Breakdown</h3>
          {stats?.byType?.length === 0 ? (
            <p style={{ color: 'var(--gray-mid)', fontSize: 14 }}>No donation data yet.</p>
          ) : (
            <div>
              {(stats?.byType || []).map((bt, i) => {
                const maxVal = Math.max(...(stats?.byType || []).map(x => x.total));
                const pct = maxVal > 0 ? (bt.total / maxVal) * 100 : 0;
                const colors = ['var(--forest)', 'var(--forest-mid)', 'var(--gold)', '#7C3AED', 'var(--danger)', '#0891B2'];
                return (
                  <div key={bt._id} style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 8 }}>
                      <span style={{ fontWeight: 500 }}>{bt._id}</span>
                      <span style={{ fontWeight: 700, color: 'var(--charcoal)' }}>₦{bt.total?.toLocaleString()} <span style={{ color: 'var(--gray-soft)', fontWeight: 400 }}>({bt.count})</span></span>
                    </div>
                    <div style={{ height: 7, background: 'var(--gray-light)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: colors[i % colors.length], borderRadius: 4, transition: 'width 1.2s var(--ease)' }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '2px solid var(--gray-light)', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16 }}>
                <span>Total</span>
                <span style={{ color: 'var(--forest)' }}>₦{stats?.donations?.toLocaleString()}</span>
              </div>
            </div>
          )}
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={() => setActive('donations')}>
            View All Donations <Icon name="arrowRight" size={13} />
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16, color: 'var(--gray-mid)', fontFamily: 'var(--font-body)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 12 }}>QUICK ACTIONS</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'New Sermon',    icon: 'video',    key: 'sermons' },
            { label: 'New Event',     icon: 'calendar', key: 'events' },
            { label: 'New Blog Post', icon: 'file',     key: 'blog' },
            { label: 'Upload Photos', icon: 'images',   key: 'gallery' },
            { label: 'Review Comments', icon: 'chat',   key: 'comments' },
            { label: 'Site Settings', icon: 'settings', key: 'settings' },
          ].map(a => (
            <button key={a.key} className="btn btn-ghost" onClick={() => setActive(a.key)} style={{ gap: 8 }}>
              <Icon name={a.icon} size={15} color="var(--forest)" /> {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
