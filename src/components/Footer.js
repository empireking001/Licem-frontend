import { useApp } from '../context/AppContext';

export default function Footer() {
  const { setPage, settings } = useApp();
  const name = 'LICEM';

  return (
    <footer style={{ background: '#1A1A2E', color: 'rgba(255,255,255,0.75)' }}>
      <div style={{ background: 'linear-gradient(90deg, #2D2B6B, #C0392B)', height: 4 }}  />
      <div className="container" style={{ padding: '72px 28px 40px' }}>
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <img
                src="/assets/licem-logo.png"
                alt="LICEM logo"
                width="46"
                height="46"
                style={{
                  width: 46, height: 46, borderRadius: 10,
                  objectFit: 'contain', background: '#080808', flexShrink: 0,
                }}
              />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 700 }}>{name}</div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 24, color: 'rgba(255,255,255,0.6)' }}>
              {settings?.tagline || 'Where Faith Meets Community'}. Join us every Sunday as we worship, grow, and serve together.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['F', 'facebook'], ['Y', 'youtube'], ['I', 'instagram'], ['T', 'twitter']].map(([l, key]) => (
                settings?.[key] ? (
                  <a key={key} href={settings[key]} target="_blank" rel="noreferrer" style={{
                    width: 38, height: 38, borderRadius: 9,
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700,
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  >{l}</a>
                ) : null
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18 }}>Navigation</div>
            {[['home','Home'],['about','About'],['sermons','Sermons'],['radio','Radio'],['prayer','Prayer'],['events','Events'],['give','Give'],['contact','Contact']].map(([p,label]) => (
              <button key={p} onClick={() => setPage(p)} style={{
                display: 'block', background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.6)', fontSize: 14, padding: '6px 0', textAlign: 'left',
                fontFamily: 'var(--font-body)', transition: 'color 0.2s', width: '100%',
                textTransform: 'capitalize',
              }}
                onMouseOver={e => e.target.style.color = 'var(--gold-light)'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >{label}</button>
            ))}
          </div>

          {/* Resources */}
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18 }}>Resources</div>
            {[['books','Books'],['blog','Blog & Articles'],['gallery','Gallery'],['testimonies','Testimonies'],['connect','Connect & Birthday Registration']].map(([p,label]) => (
              <button key={p} onClick={() => setPage(p)} style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 14, padding: '6px 0', textAlign: 'left', fontFamily: 'var(--font-body)', width: '100%' }}>{label}</button>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18 }}>Contact</div>
            {[
                settings?.footerAddress || settings?.address || '14 Grace Avenue, Victoria Island, Lagos',
                settings?.footerEmail   || settings?.email   || 'hello@gracelifechurch.org',
                settings?.footerPhone   || settings?.phone   || '+234 801 234 5678',
                settings?.sundayTimes   || 'Sunday: 9AM & 11AM',  
                settings?.midweekTime   || 'Wednesday: 6:30PM',
                ...(settings?.prayerTime ? [settings.prayerTime] : []),
              ].map((v, i) => (
              <div key={i} style={{ fontSize: 13, padding: '5px 0', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{v}</div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 13 }}><span>© {new Date().getFullYear()} {name}. All rights reserved.</span><button onClick={() => setPage('privacy')} style={{ background: 'none', border: 0, padding: 0, color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: 13 }}>Privacy & Consent</button></div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>LICEM · Living Christ Evangelical Ministries</div>
        </div>
      </div>
    </footer>
  );
}
