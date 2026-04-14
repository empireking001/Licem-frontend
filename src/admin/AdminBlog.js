import { useState, useEffect } from 'react';
import { postsAPI } from '../api';
import { Icon, Spinner, Modal, ConfirmModal, EmptyState } from '../components/UI';
import { useApp } from '../context/AppContext';

const POST_CATS = ['Devotional', 'Teaching', 'Family', 'Prayer', 'Leadership', 'Testimony', 'News'];

export default function AdminBlog() {
  const { showToast } = useApp();
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);
  const blank = { title: '', author: '', category: 'Devotional', tags: '', image: '', excerpt: '', content: '', status: 'Draft' };
  const [form, setForm] = useState(blank);
  const S = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const load = () => { setLoading(true); postsAPI.adminAll().then(r => setPosts(r.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const save = async () => {
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
      if (modal === 'new') { const r = await postsAPI.create(payload); setPosts(p => [r.data, ...p]); }
      else { const r = await postsAPI.update(modal, payload); setPosts(p => p.map(x => x._id === modal ? r.data : x)); }
      setModal(null); showToast('Post saved!');
    } catch (e) { showToast(e.response?.data?.message || 'Error.', 'error'); }
  };

  const del = async () => {
    try { await postsAPI.delete(confirm.id); setPosts(p => p.filter(x => x._id !== confirm.id)); showToast('Post deleted.'); }
    catch { showToast('Error.', 'error'); }
    setConfirm(null);
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h3 style={{ fontSize: 20 }}>Blog Posts</h3><p style={{ color: 'var(--gray-mid)', fontSize: 14 }}>{posts.length} total</p></div>
        <button className="btn btn-primary" onClick={() => { setForm(blank); setModal('new'); }}><Icon name="plus" size={15} /> New Post</button>
      </div>
      <div className="card table-wrap">
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner size={32} /></div>
          : posts.length === 0 ? <EmptyState icon="file" title="No posts yet" />
          : (
            <table>
              <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Status</th><th>Views</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p._id}>
                    <td><div style={{ fontWeight: 600, maxWidth: 240 }} className="truncate">{p.title}</div></td>
                    <td style={{ fontSize: 13, color: 'var(--gray-mid)' }}>{p.author}</td>
                    <td><span className="badge badge-gold">{p.category}</span></td>
                    <td><span className={`badge ${p.status === 'Published' ? 'badge-green' : 'badge-gray'}`}>{p.status}</span></td>
                    <td style={{ fontSize: 13 }}>{p.views || 0}</td>
                    <td style={{ fontSize: 13, color: 'var(--gray-mid)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td><div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setForm({ title: p.title, author: p.author, category: p.category, tags: (p.tags || []).join(', '), image: p.image || '', excerpt: p.excerpt || '', content: p.content || '', status: p.status }); setModal(p._id); }}><Icon name="edit" size={13} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ id: p._id })}><Icon name="trash" size={13} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
      {modal !== null && (
        <Modal title={modal === 'new' ? 'New Blog Post' : 'Edit Post'} onClose={() => setModal(null)} width={720}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Title *</label><input value={form.title} onChange={e => S('title', e.target.value)} /></div>
            <div className="form-group"><label>Author</label><input value={form.author} onChange={e => S('author', e.target.value)} /></div>
            <div className="form-group"><label>Category</label><select value={form.category} onChange={e => S('category', e.target.value)}>{POST_CATS.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Featured Image URL</label><input value={form.image} onChange={e => S('image', e.target.value)} /></div>
            <div className="form-group"><label>Tags</label><input value={form.tags} onChange={e => S('tags', e.target.value)} placeholder="faith, prayer" /></div>
            <div className="form-group"><label>Status</label><select value={form.status} onChange={e => S('status', e.target.value)}><option>Draft</option><option>Published</option></select></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Excerpt</label><textarea rows={2} value={form.excerpt} onChange={e => S('excerpt', e.target.value)} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Content</label>
              <div style={{ border: '1.5px solid var(--gray-light)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', background: 'var(--gray-ghost)', borderBottom: '1px solid var(--gray-light)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['Bold', 'Italic', 'H2', 'H3', 'List', 'Quote', 'Link'].map(b => <button key={b} style={{ padding: '3px 9px', background: 'white', border: '1px solid var(--gray-light)', borderRadius: 5, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{b}</button>)}
                </div>
                <textarea rows={8} value={form.content} onChange={e => S('content', e.target.value)} placeholder="Write your article here…" style={{ borderRadius: 0, border: 'none' }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={save} disabled={!form.title}>Save Post</button>
          </div>
        </Modal>
      )}
      {confirm && <ConfirmModal title="Delete Post?" message="This post will be permanently removed." onConfirm={del} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
