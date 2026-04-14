import { useState } from 'react';
import { donationsAPI } from '../api';
import { Icon, Spinner, PageBanner } from '../components/UI';
import { useApp } from '../context/AppContext';

const AMOUNTS  = [500, 1000, 2000, 5000, 10000, 20000];
const TYPES    = ['Tithe', 'Offering', 'Building Fund', 'Mission Support', 'Welfare', 'Other'];
const METHODS  = ['Card', 'Transfer', 'USSD'];

export default function GivePage() {
  const { showToast, pageTopPadding } = useApp();
  const [amount,  setAmount]  = useState('');
  const [type,    setType]    = useState('Tithe');
  const [method,  setMethod]  = useState('Card');
  const [form,    setForm]    = useState({ name: '', email: '' });
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGive = async () => {
    if (!amount || Number(amount) < 1) { showToast('Please enter a valid amount.', 'error'); return; }
    if (!form.name) { showToast('Please enter your name.', 'error'); return; }
    setLoading(true);
    try {
      await donationsAPI.create({ ...form, amount: Number(amount), type, method, status: 'Confirmed' });
      setDone(true);
    } catch (e) {
      showToast(e.response?.data?.message || 'Error processing donation.', 'error');
    }
    setLoading(false);
  };

  return (
    <div style={{ paddingTop: 70 }}>
      <PageBanner
        eyebrow="GENEROSITY"
        title="Give Generously"
        subtitle='"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Cor 9:7'
        bg="linear-gradient(135deg, #7B5E1A 0%, var(--gold) 60%, var(--gold-light) 100%)"
      />

      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 56, alignItems: 'start' }}>

            {/* Left: info */}
            <div>
              <h2 style={{ marginBottom: 18 }}>Your Giving Matters</h2>
              <p style={{ lineHeight: 1.9, marginBottom: 28, fontSize: 16 }}>
                Every gift you give directly funds our ministries — from Sunday worship to community outreach, youth programs, children's ministry, and global missions. Thank you for your faithful partnership.
              </p>

              {[
                { title: 'Tithe & Offering', icon: 'dollar',   desc: 'Support the general ministry operations of the church.' },
                { title: 'Building Fund',    icon: 'home',      desc: 'Help us expand facilities to accommodate our growing congregation.' },
                { title: 'Mission Support',  icon: 'globe',     desc: 'Support our missionaries serving across 12 nations worldwide.' },
                { title: 'Community Welfare',icon: 'heart',     desc: 'Feed the hungry and care for the vulnerable in our city.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--gray-light)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={item.icon} size={20} color="var(--gold)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: 'var(--gray-mid)', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}

              {/* Bank details */}
              <div style={{ marginTop: 32, padding: '22px 24px', background: 'var(--forest-ghost)', borderRadius: 'var(--radius)', border: '1px solid var(--forest-pale)' }}>
                <h4 style={{ fontSize: 16, marginBottom: 12, color: 'var(--forest)' }}>Direct Bank Transfer</h4>
                {[['Bank', 'First Bank of Nigeria'], ['Account Name', 'GraceLife Church'], ['Account Number', '3012345678'], ['Sort Code', '011']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0', borderBottom: '1px solid var(--forest-pale)' }}>
                    <span style={{ color: 'var(--gray-mid)' }}>{l}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="card" style={{ padding: 36 }}>
              {done ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 72, marginBottom: 20 }}>🙏</div>
                  <h3 style={{ fontSize: 28, marginBottom: 12 }}>God Bless You!</h3>
                  <p style={{ color: 'var(--gray-mid)', lineHeight: 1.8, marginBottom: 28 }}>
                    Your donation of <strong>₦{Number(amount).toLocaleString()}</strong> towards <strong>{type}</strong> has been received. A receipt has been sent to your email.
                  </p>
                  <button className="btn btn-primary" onClick={() => { setDone(false); setAmount(''); setForm({ name: '', email: '' }); }}>Give Again</button>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: 22, marginBottom: 28 }}>Make a Donation</h3>

                  {/* Giving type */}
                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label>Giving Type</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                      {TYPES.map(t => (
                        <button key={t} onClick={() => setType(t)} className={`btn btn-sm ${type === t ? 'btn-primary' : 'btn-ghost'}`}>{t}</button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label>Amount (₦)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                      {AMOUNTS.map(a => (
                        <button key={a} onClick={() => setAmount(String(a))} className={`btn btn-sm ${Number(amount) === a ? 'btn-gold' : 'btn-ghost'}`}>
                          ₦{a.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter custom amount" min="1" />
                  </div>

                  {/* Payment method */}
                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label>Payment Method</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {METHODS.map(m => (
                        <button key={m} onClick={() => setMethod(m)} className={`btn btn-sm ${method === m ? 'btn-primary' : 'btn-ghost'}`}>{m}</button>
                      ))}
                    </div>
                  </div>

                  <div className="grid-2" style={{ marginBottom: 20, gap: 14 }}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
                    </div>
                  </div>

                  <button className="btn btn-gold btn-full btn-lg" style={{ justifyContent: 'center', marginTop: 8 }} onClick={handleGive} disabled={loading}>
                    {loading ? <Spinner size={18} color="white" /> : <>Give ₦{amount ? Number(amount).toLocaleString() : '0'} <Icon name="arrowRight" size={17} /></>}
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--gray-soft)', textAlign: 'center', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Icon name="lock" size={12} color="var(--gray-soft)" /> Secured & encrypted · Powered by Paystack
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
