// AdminEvents.js
import { useState, useEffect } from 'react';
import { eventsAPI } from '../api';
import { Icon, Spinner, Modal, ConfirmModal, EmptyState } from '../components/UI';
import { useApp } from '../context/AppContext';

const EVENT_CATS = ['Special Service', 'Youth', 'Prayer', 'Outreach', 'Conference', 'Fellowship', 'Other'];

export function AdminEvents() {
  const { showToast } = useApp();
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);
  const blank = { title: '', date: '', time: '', location: '', description: '', category: 'Special Service', image: '' };
  const [form, setForm] = useState(blank);
  const S = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const load = () => { setLoading(true); eventsAPI.getAll().then(r => setEvents(r.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const save = async () => {
    try {
      if (modal === 'new') { const r = await eventsAPI.create(form); setEvents(e => [r.data, ...e]); }
      else { const r = await eventsAPI.update(modal, form); setEvents(e => e.map(x => x._id === modal ? r.data : x)); }
      setModal(null); showToast('Event saved!');
    } catch (e) { showToast(e.response?.data?.message || 'Error.', 'error'); }
  };

  const del = async () => {
    try { await eventsAPI.delete(confirm.id); setEvents(e => e.filter(x => x._id !== confirm.id)); showToast('Event deleted.'); }
    catch { showToast('Error.', 'error'); }
    setConfirm(null);
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h3 style={{ fontSize: 20 }}>Events</h3><p style={{ color: 'var(--gray-mid)', fontSize: 14 }}>{events.length} total</p></div>
        <button className="btn btn-primary" onClick={() => { setForm(blank); setModal('new'); }}><Icon name="plus" size={15} /> Add Event</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 18 }}>
        {loading ? <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner size={32} /></div>
          : events.length === 0 ? <div style={{ gridColumn: '1/-1' }}><EmptyState icon="calendar" title="No events yet" /></div>
          : events.map(ev => (
            <div key={ev._id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 140, backgroundImage: `url(${ev.image || ''})`, backgroundSize: 'cover', backgroundPosition: 'center', background: ev.image ? undefined : 'var(--gray-pale)' }}>
                {!ev.image && <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="calendar" size={40} color="var(--gray-light)" /></div>}
              </div>
              <div style={{ padding: '16px 18px' }}>
                <span className="badge badge-green" style={{ marginBottom: 10 }}>{ev.category}</span>
                <h4 style={{ fontSize: 16, marginBottom: 6 }}>{ev.title}</h4>
                <div style={{ fontSize: 13, color: 'var(--gray-mid)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="calendar" size={12} />{new Date(ev.date).toLocaleDateString()} · {ev.time}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-mid)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="users" size={12} />{ev.rsvps?.length || 0} RSVPs</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setForm({ title: ev.title, date: ev.date?.slice(0,10) || '', time: ev.time, location: ev.location, description: ev.description || '', category: ev.category, image: ev.image || '' }); setModal(ev._id); }}><Icon name="edit" size={13} /> Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ id: ev._id })}><Icon name="trash" size={13} /></button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {modal !== null && (
        <Modal title={modal === 'new' ? 'Add Event' : 'Edit Event'} onClose={() => setModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group"><label>Title *</label><input value={form.title} onChange={e => S('title', e.target.value)} /></div>
            <div className="grid-2">
              <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => S('date', e.target.value)} /></div>
              <div className="form-group"><label>Time</label><input type="time" value={form.time} onChange={e => S('time', e.target.value)} /></div>
            </div>
            <div className="form-group"><label>Location</label><input value={form.location} onChange={e => S('location', e.target.value)} /></div>
            <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => S('image', e.target.value)} /></div>
            <div className="form-group"><label>Category</label><select value={form.category} onChange={e => S('category', e.target.value)}>{EVENT_CATS.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label>Description</label><textarea rows={4} value={form.description} onChange={e => S('description', e.target.value)} /></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={save} disabled={!form.title}>Save Event</button>
            </div>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal title="Delete Event?" message="This event will be permanently removed." onConfirm={del} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
export default AdminEvents;
