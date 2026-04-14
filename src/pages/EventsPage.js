import { useState, useEffect } from 'react';
import { eventsAPI } from '../api';
import { Icon, Spinner, PageBanner, EmptyState, Modal } from '../components/UI';
import { useApp } from '../context/AppContext';

export default function EventsPage() {
  const { showToast, pageTopPadding } = useApp();
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [rsvpModal, setRsvpModal] = useState(null);
  const [rsvped,   setRsvped]   = useState({});
  const [form,     setForm]     = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    eventsAPI.getAll().then(r => setEvents(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleRsvp = async () => {
    if (!form.name || !form.email) { showToast('Name and email are required.', 'error'); return; }
    setSubmitting(true);
    try {
      await eventsAPI.rsvp(rsvpModal._id, form);
      setRsvped(r => ({ ...r, [rsvpModal._id]: true }));
      setEvents(ev => ev.map(e => e._id === rsvpModal._id ? { ...e, rsvps: [...(e.rsvps || []), form] } : e));
      showToast('RSVP confirmed! See you there 🎉');
      setRsvpModal(null);
      setForm({ name: '', email: '', phone: '' });
    } catch (e) {
      showToast(e.response?.data?.message || 'Error — please try again.', 'error');
    }
    setSubmitting(false);
  };

  const upcoming = events.filter(e => new Date(e.date) >= new Date());
  const past     = events.filter(e => new Date(e.date) < new Date());

  return (
    <div style={{ paddingTop: 70 }}>
      <PageBanner eyebrow="GATHERINGS" title="Events & Programs" subtitle="Connect, grow, and make memories with your church family. There's always something happening." />

      <div className="container" style={{ padding: '56px 28px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><Spinner size={40} /></div>
        ) : events.length === 0 ? (
          <EmptyState icon="calendar" title="No events yet" desc="Check back soon for upcoming programs and events." />
        ) : (
          <>
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div style={{ marginBottom: 64 }}>
                <h3 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold-bright)', marginBottom: 28 }}>UPCOMING EVENTS</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {upcoming.map((ev, i) => (
                    <div key={ev._id} className="card animate-up" style={{ display: 'flex', overflow: 'hidden', animationDelay: `${i * 0.08}s` }}>
                      <div style={{ flex: '0 0 300px', backgroundImage: `url(${ev.image || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600'})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 200 }} className="desktop-only" />
                      <div style={{ padding: '28px 32px', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                          <span className="badge badge-green">{ev.category}</span>
                          {ev.rsvps?.length > 0 && <span style={{ fontSize: 13, color: 'var(--gray-mid)' }}>{ev.rsvps.length} attending</span>}
                        </div>
                        <h3 style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', marginBottom: 14 }}>{ev.title}</h3>
                        <div style={{ display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--gray-mid)' }}>
                            <Icon name="calendar" size={14} color="var(--forest)" />
                            {new Date(ev.date).toDateString()} · {ev.time}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--gray-mid)' }}>
                            <Icon name="map" size={14} color="var(--forest)" />
                            {ev.location}
                          </span>
                        </div>
                        <p style={{ lineHeight: 1.8, marginBottom: 22, fontSize: 15 }}>{ev.description}</p>
                        {rsvped[ev._id] ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--success-pale)', borderRadius: 8, color: 'var(--success)', fontWeight: 600, fontSize: 14 }}>
                            <Icon name="check" size={16} color="var(--success)" /> You're registered!
                          </div>
                        ) : (
                          <button className="btn btn-primary" onClick={() => setRsvpModal(ev)}>
                            RSVP Now <Icon name="arrowRight" size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past events */}
            {past.length > 0 && (
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gray-soft)', marginBottom: 28 }}>PAST EVENTS</h3>
                <div className="grid-3">
                  {past.map(ev => (
                    <div key={ev._id} className="card" style={{ opacity: 0.75 }}>
                      <div style={{ height: 160, backgroundImage: `url(${ev.image || ''})`, backgroundSize: 'cover', backgroundPosition: 'center', background: ev.image ? undefined : 'var(--gray-pale)', filter: 'grayscale(30%)' }} />
                      <div style={{ padding: '16px 18px' }}>
                        <span className="badge badge-gray" style={{ marginBottom: 10 }}>{ev.category}</span>
                        <h4 style={{ fontSize: 16, marginBottom: 8 }}>{ev.title}</h4>
                        <p style={{ fontSize: 13, color: 'var(--gray-mid)' }}>{new Date(ev.date).toDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* RSVP Modal */}
      {rsvpModal && (
        <Modal title={`RSVP — ${rsvpModal.title}`} onClose={() => setRsvpModal(null)}>
          <div style={{ marginBottom: 20, padding: '14px 16px', background: 'var(--forest-ghost)', borderRadius: 10 }}>
            <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'var(--gray-dark)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="calendar" size={13} color="var(--forest)" />{new Date(rsvpModal.date).toDateString()} · {rsvpModal.time}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="map" size={13} color="var(--forest)" />{rsvpModal.location}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            <div className="form-group"><label>Full Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" /></div>
            <div className="form-group"><label>Email Address *</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" /></div>
            <div className="form-group"><label>Phone (optional)</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+234 …" /></div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setRsvpModal(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button className="btn btn-primary" onClick={handleRsvp} disabled={submitting} style={{ flex: 2, justifyContent: 'center' }}>
              {submitting ? <Spinner size={16} color="white" /> : <><Icon name="check" size={15} /> Confirm RSVP</>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
