import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Icon, Spinner } from '../components/UI';
import { sermonsAPI, eventsAPI } from '../api';

export default function HomePage() {
  const { pageTopPadding } = useApp();
  const { setPage, settings } = useApp();
  const [sermons, setSermons]   = useState([]);
  const [events,  setEvents]    = useState([]);
  const [email,   setEmail]     = useState('');
  const [subDone, setSubDone]   = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      sermonsAPI.getAll({ limit: 3 }),
      eventsAPI.getAll({ upcoming: true }),
    ]).then(([s, e]) => {
      setSermons(s.data.sermons || []);
      setEvents((e.data || []).slice(0, 4));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${settings?.heroImageUrl || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&q=80'})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.3)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(27,67,50,0.7) 0%, rgba(10,10,20,0.5) 100%)',
        }} />

        {/* Floating orbs */}
        <div style={{ position: 'absolute', top: '15%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,149,58,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(64,145,108,0.2) 0%, transparent 70%)', filter: 'blur(30px)' }} />

        <div className="container animate-up" style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: 100 }}>
          {/* Live chip */}
          {settings?.liveIsActive && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 40, padding: '8px 20px', marginBottom: 28,
            }}>
              <span className="live-dot" />
              <span style={{ color: '#FCA5A5', fontSize: 13, fontWeight: 700, letterSpacing: 1.5 }}>WE ARE LIVE NOW</span>
            </div>
          )}
          {!settings?.liveIsActive && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(201,149,58,0.18)', border: '1px solid rgba(201,149,58,0.35)',
              borderRadius: 40, padding: '8px 20px', marginBottom: 28,
            }}>
              <Icon name="calendar" size={13} color="var(--gold-light)" />
              <span style={{ color: 'var(--gold-light)', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>SUNDAYS · 9AM & 11AM</span>
            </div>
          )}

          <h1 style={{ color: 'white', fontStyle: 'italic', letterSpacing: '-0.5px', marginBottom: 22, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Where Faith Meets<br />
            <span style={{ color: 'var(--gold-light)', fontStyle: 'normal' }}>Community</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.78)', maxWidth: 540, margin: '0 auto 44px', fontSize: 18, lineHeight: 1.75 }}>
            {settings?.tagline || 'GraceLife Church'} — a place of worship, growth, and belonging. Join thousands experiencing God's grace every week.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-gold btn-xl" onClick={() => window.open(settings?.liveStreamUrl || 'https://youtube.com', '_blank')}>
              <Icon name="play" size={19} /> Join Us Live
            </button>
            <button className="btn btn-outline-white btn-xl" onClick={() => setPage('about')}>
              Our Story <Icon name="arrowRight" size={17} />
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 56, justifyContent: 'center', marginTop: 80,
            paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.12)',
            flexWrap: 'wrap',
          }}>
            {[['12K+','Members'],['5','Campuses'],['20+','Years of Grace'],['500+','Baptisms']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: 'var(--gold-light)', fontWeight: 700, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5, marginTop: 7, textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite' }}>
          <Icon name="chevDown" size={22} color="rgba(255,255,255,0.4)" />
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }`}</style>
      </section>

      {/* ── UPCOMING EVENTS ──────────────────────── */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">WHAT'S COMING</span>
            <h2>Upcoming Events</h2>
            <p>Don't miss what God is doing in our community</p>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner size={36} /></div>
          ) : (
            <div className="grid-2">
              {events.map((ev, i) => (
                <div key={ev._id} className="card card-lift animate-up" style={{ display: 'flex', overflow: 'hidden', animationDelay: `${i * 0.1}s` }}>
                  <div style={{
                    width: 130, minWidth: 130,
                    backgroundImage: `url(${ev.image || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400'})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                  }} />
                  <div style={{ padding: 22, flex: 1 }}>
                    <span className="badge badge-green" style={{ marginBottom: 10 }}>{ev.category}</span>
                    <h4 style={{ marginBottom: 10, lineHeight: 1.3 }}>{ev.title}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray-mid)' }}>
                        <Icon name="calendar" size={13} />{new Date(ev.date).toDateString()} · {ev.time}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray-mid)' }}>
                        <Icon name="map" size={13} />{ev.location}
                      </span>
                    </div>
                    <button className="btn btn-outline btn-sm" style={{ marginTop: 14 }} onClick={() => setPage('events')}>
                      RSVP <Icon name="arrowRight" size={13} />
                    </button>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 48, color: 'var(--gray-mid)' }}>
                  No upcoming events yet. Check back soon!
                </div>
              )}
            </div>
          )}
          <div className="text-center" style={{ marginTop: 36 }}>
            <button className="btn btn-primary btn-lg" onClick={() => setPage('events')}>
              All Events <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── LATEST SERMONS ───────────────────────── */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">WORD & WORSHIP</span>
            <h2>Latest Messages</h2>
            <p>Be transformed by the renewing of your mind</p>
          </div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner size={36} /></div>
          ) : (
            <div className="grid-3">
              {sermons.map((s, i) => (
                <div key={s._id} className="card card-lift animate-up" style={{ cursor: 'pointer', animationDelay: `${i * 0.12}s` }}
                  onClick={() => setPage('sermons')}>
                  <div style={{ position: 'relative' }}>
                    <div className="aspect-video" style={{
                      backgroundImage: `url(${s.thumbnail || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600'})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
                        <Icon name="play" size={20} color="var(--forest)" />
                      </div>
                    </div>
                    {s.pinned && (
                      <div style={{ position: 'absolute', top: 12, right: 12 }}>
                        <span className="badge badge-gold"><Icon name="pin" size={11} /> Featured</span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                      <span className="badge badge-green">{s.category}</span>
                    </div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <h4 style={{ marginBottom: 8, lineHeight: 1.35 }}>{s.title}</h4>
                    <p style={{ fontSize: 13, color: 'var(--gray-mid)', marginBottom: 14 }}>
                      {s.speaker} · {new Date(s.date).toDateString()}
                    </p>
                    <div style={{ display: 'flex', gap: 16, color: 'var(--gray-soft)', fontSize: 13 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="eye" size={13} />{(s.views || 0).toLocaleString()}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="heart" size={13} />{s.likes || 0}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="chat" size={13} />{s.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center" style={{ marginTop: 36 }}>
            <button className="btn btn-primary btn-lg" onClick={() => setPage('sermons')}>
              All Messages <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 60%, var(--forest-mid) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(201,149,58,0.08)', filter: 'blur(30px)' }} />
        <div className="container text-center animate-up" style={{ position: 'relative' }}>
          <span style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: 16 }}>GET INVOLVED</span>
          <h2 style={{ color: 'white', marginBottom: 16 }}>Take Your Next Step</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 auto 44px', fontSize: 17 }}>
            Whether you're new here or have been attending for years, there's always a next step to take in your faith journey.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-gold btn-lg" onClick={() => setPage('give')}>Give Today <Icon name="arrowRight" size={16} /></button>
            <button className="btn btn-outline-white btn-lg" onClick={() => setPage('contact')}>Connect With Us</button>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ──────────────────────── */}
      <section className="section" style={{ background: 'var(--gray-ghost)' }}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">OUR MOMENTS</span>
            <h2>Photo Gallery</h2>
            <p>Glimpses of life and faith in our community</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&q=80',
              'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
              'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=400&q=80',
              'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80',
            ].map((src, i) => (
              <div key={i} className="card" style={{ aspectRatio: '1', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setPage('gallery')}>
                <img src={src} alt="" className="img-cover" style={{ transition: 'transform 0.4s var(--ease)' }}
                  onMouseOver={e => e.target.style.transform = 'scale(1.06)'}
                  onMouseOut={e => e.target.style.transform = 'scale(1)'}
                />
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 32 }}>
            <button className="btn btn-primary" onClick={() => setPage('gallery')}>
              <Icon name="images" size={16} /> View Full Gallery
            </button>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────── */}
      <section className="section-sm" style={{ background: 'var(--white)' }}>
        <div className="container-sm text-center">
          <span className="eyebrow">STAY CONNECTED</span>
          <h2 style={{ marginBottom: 12 }}>Get Weekly Devotionals</h2>
          <p style={{ marginBottom: 36 }}>Receive sermons, events updates and encouragement straight to your inbox.</p>
          {subDone ? (
            <div style={{ padding: '20px 32px', background: 'var(--forest-pale)', borderRadius: 12, color: 'var(--forest)', fontWeight: 600, fontSize: 16 }}>
              ✓ You're subscribed! Welcome to the family.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto', flexWrap: 'wrap' }}>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address" type="email" style={{ flex: 1, minWidth: 220 }} />
              <button className="btn btn-primary" onClick={() => email && setSubDone(true)}>
                Subscribe <Icon name="mail" size={15} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
