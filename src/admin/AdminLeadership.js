import { useEffect, useState } from 'react';
import { Icon, Spinner } from '../components/UI';
import { resolveMediaUrl, teamMembersAPI, API_BASE_URL } from '../api';
import { useApp } from '../context/AppContext';

const EMPTY = { name: '', role: '', bio: '', image: '', sortOrder: 0, published: true, consentConfirmed: false };

export default function AdminLeadership() {
  const { showToast } = useApp();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await teamMembersAPI.getAll();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to load leadership roster.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const reset = () => { setEditingId(null); setForm(EMPTY); };

  const edit = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name || '', role: member.role || '', bio: member.bio || '', image: member.image || '',
      sortOrder: member.sortOrder || 0, published: member.published !== false, consentConfirmed: member.consentConfirmed === true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.role.trim()) return showToast('Name and role are required.', 'error');
    if (!form.consentConfirmed) return showToast('Confirm publication consent before saving.', 'error');
    setSaving(true);
    try {
      if (editingId) await teamMembersAPI.update(editingId, form);
      else await teamMembersAPI.create(form);
      showToast(editingId ? 'Leadership profile updated.' : 'Leadership profile added.');
      reset();
      await load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Unable to save leadership profile.', 'error');
    } finally { setSaving(false); }
  };

  const remove = async (member) => {
    if (!window.confirm(`Remove ${member.name} from the leadership roster?`)) return;
    try {
      await teamMembersAPI.delete(member._id);
      showToast('Leadership profile removed.');
      if (editingId === member._id) reset();
      await load();
    } catch (err) { showToast(err.response?.data?.message || 'Unable to remove profile.', 'error'); }
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('files', file);
    try {
      const response = await fetch(`${API_BASE_URL}/media/upload`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('gl_token')}` }, body: data });
      const raw = await response.text();
      let result = {};
      try { result = raw ? JSON.parse(raw) : {}; } catch { result = { message: `Upload service returned an invalid response (${response.status}).` }; }
      const url = result.files?.[0]?.url;
      if (!response.ok || !url) throw new Error(result.message || `Upload failed (${response.status})`);
      setField('image', url.startsWith('/') ? resolveMediaUrl(url) : url);
    } catch (err) { showToast(err.message || 'Image upload failed.', 'error'); }
    event.target.value = '';
  };

  return <div style={{ padding: 28, maxWidth: 1180, margin: '0 auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 26 }}>
      <div><h3 style={{ fontSize: 22, marginBottom: 6 }}>Leadership Management</h3><p style={{ color: 'var(--gray-mid)', fontSize: 14, lineHeight: 1.6, maxWidth: 700 }}>Manage the ministers and leaders shown in the public “Meet Our Senior Ministers” section on the About page. Only published profiles with confirmed consent appear publicly.</p></div>
      {editingId && <button className="btn btn-ghost" onClick={reset}><Icon name="x" size={15} /> Cancel editing</button>}
    </div>

    <form className="card" style={{ padding: 24, marginBottom: 28 }} onSubmit={save}>
      <h4 style={{ fontSize: 17, marginBottom: 18 }}>{editingId ? 'Edit Leadership Profile' : 'Add Leadership Profile'}</h4>
      <div className="grid-2" style={{ gap: 16 }}>
        <div className="form-group"><label>Full Name *</label><input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="e.g. Rev. Name Surname" /></div>
        <div className="form-group"><label>Role or Title *</label><input value={form.role} onChange={(e) => setField('role', e.target.value)} placeholder="e.g. District Head Minister" /></div>
        <div className="form-group"><label>Display Order</label><input type="number" min="0" value={form.sortOrder} onChange={(e) => setField('sortOrder', e.target.value)} /></div>
        <div className="form-group"><label>Photo URL</label><input value={form.image} onChange={(e) => setField('image', e.target.value)} placeholder="Paste an approved image URL or upload below" /></div>
      </div>
      <div className="form-group" style={{ marginTop: 16 }}><label>Short Biography or Ministry Write-up</label><textarea rows={4} value={form.bio} onChange={(e) => setField('bio', e.target.value)} placeholder="A concise introduction to this leader and their ministry service." /></div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 14 }}>
        <label className="btn btn-outline" style={{ cursor: 'pointer' }}><Icon name="upload" size={15} /> Upload Photo<input type="file" accept="image/*" onChange={upload} style={{ display: 'none' }} /></label>
        {form.image && <img src={resolveMediaUrl(form.image)} alt="Selected leadership profile" style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--gold)' }} />}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}><input type="checkbox" checked={form.published} onChange={(e) => setField('published', e.target.checked)} /> Publish on About page</label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}><input type="checkbox" checked={form.consentConfirmed} onChange={(e) => setField('consentConfirmed', e.target.checked)} /> Publication consent confirmed</label>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}><button type="button" className="btn btn-ghost" onClick={reset}>Clear</button><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <Spinner size={16} color="white" /> : <Icon name="save" size={15} />}{editingId ? 'Save Changes' : 'Add Leader'}</button></div>
    </form>

    <div className="card" style={{ padding: 24 }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}><h4 style={{ fontSize: 17, margin: 0 }}>Current Leadership Roster <span style={{ color: 'var(--gray-mid)', fontWeight: 400 }}>({members.length})</span></h4><button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}><Icon name="refresh" size={14} /> Refresh</button></div>
      {loading ? <div style={{ padding: 36, textAlign: 'center' }}><Spinner /></div> : members.length === 0 ? <div style={{ padding: 34, textAlign: 'center', color: 'var(--gray-mid)' }}>No leadership profiles yet. Add the first leader above.</div> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>{members.map((member) => <div key={member._id} style={{ border: '1px solid var(--gray-light)', borderRadius: 12, padding: 16, opacity: member.published ? 1 : .65 }}><div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>{member.image ? <img src={resolveMediaUrl(member.image)} alt={member.name} style={{ width: 62, height: 62, objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--gold)' }} /> : <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'var(--gray-pale)', display: 'grid', placeItems: 'center', color: 'var(--gray-mid)' }}><Icon name="user" size={22} /></div>}<div><div style={{ fontWeight: 700 }}>{member.name}</div><div style={{ fontSize: 12, color: 'var(--gold)', marginTop: 4 }}>{member.role}</div></div></div><p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--gray-mid)', minHeight: 40 }}>{member.bio || 'No biography added.'}</p><div style={{ fontSize: 11, color: 'var(--gray-soft)', marginBottom: 12 }}>{member.published ? 'Published' : 'Draft'} · Order {member.sortOrder || 0} · Consent confirmed</div><div style={{ display: 'flex', gap: 8 }}><button className="btn btn-outline btn-sm" onClick={() => edit(member)}><Icon name="edit" size={13} /> Edit</button><button className="btn btn-danger btn-sm" onClick={() => remove(member)}><Icon name="trash" size={13} /> Remove</button></div></div>)}</div>}
    </div>
  </div>;
}
