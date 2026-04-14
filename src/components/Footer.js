import { useApp } from '../context/AppContext';

export default function Footer() {
  const { setPage, settings } = useApp();
  const name = settings?.siteName || 'Living Christ Evangelical Ministries';

  return (
    <footer style={{ background: '#1A1A2E', color: 'rgba(255,255,255,0.75)' }}>
      <div style={{ background: 'linear-gradient(90deg, #2D2B6B, #C0392B)', height: 4 }}  />
      <div className="container" style={{ padding: '72px 28px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--forest), var(--forest-mid))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
              }}>G</div>
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
            {['home','about','sermons','events','gallery','blog','give','contact'].map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                display: 'block', background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.6)', fontSize: 14, padding: '6px 0', textAlign: 'left',
                fontFamily: 'var(--font-body)', transition: 'color 0.2s', width: '100%',
                textTransform: 'capitalize',
              }}
                onMouseOver={e => e.target.style.color = 'var(--gold-light)'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >{p}</button>
            ))}
          </div>

          {/* Ministries */}
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18 }}>Ministries</div>
            {["Youth Ministry", "Women's Fellowship", "Men's Group", "Children's Church", "Choir & Worship", "Outreach"].map(m => (
              <div key={m} style={{ fontSize: 14, padding: '6px 0', color: 'rgba(255,255,255,0.6)' }}>{m}</div>
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
          <div style={{ fontSize: 13 }}>© {new Date().getFullYear()} {name}. All rights reserved.</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Built for the Kingdom 🙏</div>
        </div>
      </div>
    </footer>
  );
}
