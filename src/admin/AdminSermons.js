// ═══════════════════════════════════════════════════
// ADMIN SERMONS
// ═══════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { sermonsAPI } from '../api';
import { Icon, Spinner, Modal, ConfirmModal, EmptyState } from '../components/UI';
import { useApp } from '../context/AppContext';

const SERMON_CATS = ['Sunday Service', 'Special Program', 'Midweek', 'Youth Service', 'Prayer Service'];

export default function AdminSermons() {
  const { showToast } = useApp();
  const [sermons,  setSermons]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null);
  const [confirm,  setConfirm]  = useState(null);
  const [search,   setSearch]   = useState('');
  const blank = { title: '', speaker: '', date: '', category: 'Sunday Service', videoUrl: '', audioUrl: '', thumbnail: '', description: '', pinned: false, tags: '' };
  const [form, setForm] = useState(blank);
  const S = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const load = () => { setLoading(true); sermonsAPI.getAll({ limit: 100 }).then(r => setSermons(r.data.sermons || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const save = async () => {
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
      if (modal === 'new') { const r = await sermonsAPI.create(payload); setSermons(s => [r.data, ...s]); }
      else { const r = await sermonsAPI.update(modal, payload); setSermons(s => s.map(x => x._id === modal ? r.data : x)); }
      setModal(null); showToast('Sermon saved!');
    } catch (e) { showToast(e.response?.data?.message || 'Error saving.', 'error'); }
  };

  const del = async () => {
    try { await sermonsAPI.delete(confirm.id); setSermons(s => s.filter(x => x._id !== confirm.id)); showToast('Sermon deleted.'); }
    catch { showToast('Delete failed.', 'error'); }
    setConfirm(null);
  };

  const pin = async (s) => {
    try { const r = await sermonsAPI.update(s._id, { pinned: !s.pinned }); setSermons(ss => ss.map(x => x._id === s._id ? r.data : x)); showToast(r.data.pinned ? 'Sermon pinned!' : 'Sermon unpinned.'); }
    catch { showToast('Error.', 'error'); }
  };

  const filtered = sermons.filter(s => !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.speaker.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h3 style={{ fontSize: 20 }}>Sermons</h3><p style={{ color: 'var(--gray-mid)', fontSize: 14 }}>{sermons.length} total</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}><Icon name="search" size={14} color="var(--gray-soft)" /></div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ paddingLeft: 34, width: 220, fontSize: 13 }} />
          </div>
          <button className="btn btn-primary" onClick={() => { setForm(blank); setModal('new'); }}><Icon name="plus" size={15} /> Add Sermon</button>
        </div>
      </div>

      <div className="card table-wrap">
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner size={32} /></div> : filtered.length === 0 ? <EmptyState icon="video" title="No sermons yet" /> : (
          <table>
            <thead><tr><th>Title</th><th>Speaker</th><th>Category</th><th>Date</th><th>Views</th><th>Likes</th><th>Pinned</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s._id}>
                  <td><div style={{ fontWeight: 600, maxWidth: 220 }} className="truncate">{s.title}</div></td>
                  <td style={{ color: 'var(--gray-mid)', fontSize: 13 }}>{s.speaker}</td>
                  <td><span className="badge badge-green">{s.category}</span></td>
                  <td style={{ color: 'var(--gray-mid)', fontSize: 13 }}>{new Date(s.date).toLocaleDateString()}</td>
                  <td style={{ fontSize: 13 }}>{(s.views || 0).toLocaleString()}</td>
                  <td style={{ fontSize: 13 }}>{s.likes || 0}</td>
                  <td>
                    <button onClick={() => pin(s)} style={{ background: s.pinned ? 'var(--gold-pale)' : 'var(--gray-pale)', border: `1px solid ${s.pinned ? 'var(--gold)' : 'var(--gray-light)'}`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: s.pinned ? 'var(--gold)' : 'var(--gray-mid)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="pin" size={11} color={s.pinned ? 'var(--gold)' : 'currentColor'} />{s.pinned ? 'Pinned' : 'Pin'}
                    </button>
                  </td>
                  <td><div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setForm({ title: s.title, speaker: s.speaker, date: s.date?.slice(0,10) || '', category: s.category, videoUrl: s.videoUrl || '', audioUrl: s.audioUrl || '', thumbnail: s.thumbnail || '', description: s.description || '', pinned: s.pinned, tags: (s.tags || []).join(', ') }); setModal(s._id); }}><Icon name="edit" size={13} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ id: s._id })}><Icon name="trash" size={13} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal !== null && (
        <Modal title={modal === 'new' ? 'Add Sermon' : 'Edit Sermon'} onClose={() => setModal(null)} width={680}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[['title','Title *','1/-1'],['speaker','Speaker'],['date','Date','','date'],['thumbnail','Thumbnail URL','1/-1'],['videoUrl','YouTube Embed URL','1/-1'],['audioUrl','Audio URL (optional)','1/-1'],['description','Description','1/-1','textarea']].map(([k,l,col,t]) => (
              <div key={k} className="form-group" style={{ gridColumn: col || undefined }}>
                <label>{l}</label>
                {t === 'textarea' ? <textarea rows={3} value={form[k]} onChange={e => S(k, e.target.value)} /> : <input type={t || 'text'} value={form[k]} onChange={e => S(k, e.target.value)} />}
              </div>
            ))}
            <div className="form-group"><label>Category</label><select value={form.category} onChange={e => S('category', e.target.value)}>{SERMON_CATS.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label>Tags (comma-separated)</label><input value={form.tags} onChange={e => S('tags', e.target.value)} placeholder="faith, prayer, healing" /></div>
            <label style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 14px', background: 'var(--gray-ghost)', borderRadius: 9 }}>
              <div className={`toggle ${form.pinned ? 'on' : ''}`} onClick={() => S('pinned', !form.pinned)} />
              <span style={{ fontSize: 14 }}>Pin as featured sermon on homepage</span>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={save} disabled={!form.title}>Save Sermon</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal title="Delete Sermon?" message="This sermon will be permanently removed." onConfirm={del} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
