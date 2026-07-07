import { Icon, PageBanner, SectionHeader } from '../components/UI';
import { useApp } from '../context/AppContext';

const TEAM = [
  { name: 'Pastor James Adeyemi', role: 'Senior Pastor', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', bio: 'Leading GraceLife for over 20 years with a passion for biblical teaching and community transformation.' },
  { name: 'Pastor Grace Okonkwo', role: 'Associate Pastor', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', bio: 'Overseeing women\'s ministry and discipleship programs with warmth, wisdom and deep pastoral care.' },
  { name: 'Min. David Fashola',   role: 'Worship Director', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', bio: 'Crafting transformative worship experiences that usher congregations into God\'s presence every week.' },
  { name: 'Min. Sarah Eze',       role: 'Youth Pastor', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', bio: 'Passionate about raising a generation of young people who live boldly for Christ in every sphere.' },
];

const BELIEFS = [
  { title: 'The Holy Bible', body: 'We believe the Bible is the inspired, infallible Word of God — our supreme authority for faith and life in all matters.' },
  { title: 'The Holy Trinity', body: 'We believe in one God eternally existing in three persons: Father, Son, and Holy Spirit — co-equal and co-eternal.' },
  { title: 'Salvation by Grace', body: 'We believe salvation comes by grace alone through faith alone in Jesus Christ alone, not by any human merit or work.' },
  { title: 'The Holy Spirit', body: 'We believe in the present-day ministry of the Holy Spirit, including the gifts He bestows on believers for ministry.' },
  { title: 'The Church', body: 'We believe the local church is God\'s primary vehicle for mission, discipleship, community, and global transformation.' },
  { title: 'The Return of Christ', body: 'We believe in the literal, physical, and imminent return of Jesus Christ in glory to judge the living and the dead.' },
];

export default function AboutPage() {
  const { showToast, pageTopPadding, setPage } = useApp();

  return (
    <div style={{ paddingTop: 70 }}>
      <PageBanner eyebrow="OUR STORY" title="About GraceLife Church" subtitle="Founded in 2004, we are a multi-generational, multiethnic community of believers committed to the Great Commission." />

      {/* Mission & Vision */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="split-2">
            <div className="animate-left">
              <span className="eyebrow" style={{ display: 'block', marginBottom: 14 }}>MISSION & VISION</span>
              <h2 style={{ marginBottom: 20 }}>Why We Exist</h2>
              <p style={{ marginBottom: 20, fontSize: 16, lineHeight: 1.85 }}>
                Our mission is beautifully simple: <strong style={{ color: 'var(--forest)' }}>Love God. Love People. Make Disciples.</strong> We believe every person carries a unique calling and we exist to help you discover and walk fully in it.
              </p>
              <p style={{ marginBottom: 28, fontSize: 16, lineHeight: 1.85 }}>
                Our vision is to see transformed lives transforming communities — building a church that looks like heaven, where every tribe, tongue, and nation worships as one body.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <button className="btn btn-primary" onClick={() => setPage('sermons')}>Watch a Sermon</button>
                <button className="btn btn-outline" onClick={() => setPage('contact')}>Contact Us</button>
              </div>
            </div>
            <div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3', boxShadow: 'var(--shadow-lg)' }}>
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" alt="Church community" className="img-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <SectionHeader eyebrow="CORE VALUES" title="What Drives Us" subtitle="These values shape everything we do — from Sunday services to community outreach." />
          <div className="grid-3">
            {[
              { icon: 'bookOpen', title: 'Biblical Foundation', body: 'Every sermon, decision and ministry is rooted firmly in the truth of God\'s Word.' },
              { icon: 'heart',    title: 'Radical Love',       body: 'We love God with everything and extend that love unconditionally to every person.' },
              { icon: 'users',   title: 'Authentic Community', body: 'We do life together — celebrating, grieving, growing, and serving as one family.' },
              { icon: 'zap',     title: 'Spirit-Led Worship',  body: 'We create space for the Holy Spirit to move freely in every gathering.' },
              { icon: 'globe',   title: 'Global Mission',      body: 'We are called beyond our walls — reaching our city and the nations for Christ.' },
              { icon: 'shield',  title: 'Integrity',           body: 'We are committed to transparency, accountability, and excellence in all things.' },
            ].map(v => (
              <div key={v.title} className="card" style={{ padding: 28 }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: 'var(--forest-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon name={v.icon} size={24} color="var(--forest)" />
                </div>
                <h4 style={{ marginBottom: 10 }}>{v.title}</h4>
                <p style={{ fontSize: 14, lineHeight: 1.75 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <SectionHeader eyebrow="LEADERSHIP" title="Meet Our Team" subtitle="Passionate shepherds committed to guiding this community with wisdom and love." />
          <div className="grid-4">
            {TEAM.map((m, i) => (
              <div key={m.name} className="card card-lift animate-up" style={{ textAlign: 'center', padding: '32px 24px', animationDelay: `${i * 0.1}s` }}>
                <div style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 18px', border: '3px solid var(--gold-bright)', boxShadow: '0 4px 16px rgba(184,134,11,0.2)' }}>
                  <img src={m.img} alt={m.name} className="img-cover" />
                </div>
                <h4 style={{ marginBottom: 5, fontSize: 18 }}>{m.name}</h4>
                <p style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600, marginBottom: 14, letterSpacing: 0.3 }}>{m.role}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.7 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <SectionHeader eyebrow="DOCTRINE" title="What We Believe" subtitle="Our faith is grounded in the timeless truths of Scripture." />
          <div className="grid-2">
            {BELIEFS.map(b => (
              <div key={b.title} style={{ padding: '24px 28px', background: 'var(--white)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--gold-bright)', boxShadow: 'var(--shadow-xs)' }}>
                <h4 style={{ fontSize: 18, marginBottom: 10 }}>{b.title}</h4>
                <p style={{ fontSize: 14.5, lineHeight: 1.8 }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm" style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 100%)' }}>
        <div className="container">
          <div className="stats-4" style={{ textAlign: 'center' }}>
            {[['20+', 'Years of Ministry'], ['12K+', 'Church Members'], ['5', 'Campuses'], ['47', 'Nations Reached']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--gold-light)', fontWeight: 700, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 10, letterSpacing: 1, textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
