import { useState, useEffect, useRef } from 'react';
import { galleryAPI } from '../api';
import { Icon, Spinner, Modal, ConfirmModal, EmptyState } from '../components/UI';
import { useApp } from '../context/AppContext';

const GROUPS = [
  'Sunday Service', 'Youth Ministry', "Women's Fellowship",
  "Men's Group", "Children's Church", 'Outreach',
  'Special Events', 'Conferences', 'Weddings & Dedications',
  'Missions', 'Choir & Worship', 'General'
];

export default function AdminGallery() {
  const { showToast } = useApp();
  const [albums,    setAlbums]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null); // album being managed
  const [modal,     setModal]     = useState(null); // 'new' | 'edit'
  const [confirm,   setConfirm]   = useState(null); // { type, id, imgId? }
  const [uploading, setUploading] = useState(false);
  const [dragOver,  setDragOver]  = useState(false);
  const [editCaption, setEditCaption] = useState(null); // { imgId, val }
  const fileRef = useRef();

  const [form, setForm] = useState({
    title: '', description: '', group: 'General', eventDate: '', published: true,
  });

  const load = () => {
    setLoading(true);
    galleryAPI.adminAll().then(r => setAlbums(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setForm({ title: '', description: '', group: 'General', eventDate: '', published: true }); setModal('new'); };
  const openEdit = (a) => { setForm({ title: a.title, description: a.description || '', group: a.group, eventDate: a.eventDate?.slice(0,10) || '', published: a.published }); setModal(a._id); };

  const saveAlbum = async () => {
    try {
      if (modal === 'new') {
        const r = await galleryAPI.create(form);
        setAlbums(a => [r.data, ...a]);
        showToast('Album created!');
      } else {
        const r = await galleryAPI.update(modal, form);
        setAlbums(a => a.map(x => x._id === modal ? r.data : x));
        if (selected?._id === modal) setSelected(r.data);
        showToast('Album updated!');
      }
      setModal(null);
    } catch (e) { showToast(e.response?.data?.message || 'Error saving', 'error'); }
  };

  const deleteAlbum = async () => {
    try {
      await galleryAPI.delete(confirm.id);
      setAlbums(a => a.filter(x => x._id !== confirm.id));
      if (selected?._id === confirm.id) setSelected(null);
      showToast('Album deleted.');
    } catch { showToast('Delete failed.', 'error'); }
    setConfirm(null);
  };

  const deleteImage = async () => {
    try {
      const r = await galleryAPI.deleteImage(confirm.albumId, confirm.imgId);
      setSelected(r.data);
      setAlbums(a => a.map(x => x._id === r.data._id ? { ...x, images: r.data.images } : x));
      showToast('Image deleted.');
    } catch { showToast('Delete failed.', 'error'); }
    setConfirm(null);
  };

  const handleFiles = async (files) => {
    if (!selected || !files?.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('images', f));
    try {
      const r = await galleryAPI.uploadImages(selected._id, fd);
      setSelected(r.data.album);
      setAlbums(a => a.map(x => x._id === r.data.album._id ? { ...x, coverImage: r.data.album.coverImage } : x));
      showToast(`${r.data.images.length} photo(s) uploaded!`);
    } catch (e) { showToast(e.response?.data?.message || 'Upload failed.', 'error'); }
    setUploading(false);
  };

  const saveCaption = async (imgId, caption) => {
    try {
      const r = await galleryAPI.updateImage(selected._id, imgId, { caption });
      setSelected(r.data);
      setEditCaption(null);
      showToast('Caption saved!');
    } catch { showToast('Error saving caption.', 'error'); }
  };

  const setCover = async (imgId) => {
    try {
      const r = await galleryAPI.updateImage(selected._id, imgId, { setCover: true });
      setSelected(r.data);
      setAlbums(a => a.map(x => x._id === r.data._id ? { ...x, coverImage: r.data.coverImage } : x));
      showToast('Cover image set!');
    } catch { showToast('Error.', 'error'); }
  };

  const imgSrc = url => url?.startsWith('/') ? `http://localhost:5000${url}` : url;

  /* ── Album detail ──────────────────────────────── */
  if (selected) return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>
          <Icon name="chevLeft" size={14} /> Back to Albums
        </button>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 20 }}>{selected.title}</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <span className="badge badge-green">{selected.group}</span>
            <span style={{ fontSize: 13, color: 'var(--gray-mid)' }}>{selected.images?.length || 0} photos</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(selected)}>
          <Icon name="edit" size={14} /> Edit Album
        </button>
        <button className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Spinner size={16} color="white" /> : <><Icon name="upload" size={15} /> Upload Photos</>}
        </button>
      </div>

      {/* Upload zone */}
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        style={{ marginBottom: 28 }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
      >
        <Icon name="upload" size={32} color="var(--gray-soft)" />
        <p style={{ color: 'var(--gray-mid)', marginTop: 12, fontSize: 15 }}>
          {uploading ? 'Uploading…' : 'Drag & drop photos here, or click to browse'}
        </p>
        <p style={{ color: 'var(--gray-soft)', fontSize: 12, marginTop: 6 }}>JPG, PNG, WEBP — up to 50MB each · Multiple files supported</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)} />

      {/* Photos grid */}
      {selected.images?.length === 0 ? (
        <EmptyState icon="photo" title="No photos yet" desc="Upload the first photos to this album using the button above." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {selected.images.map((img, idx) => (
            <div key={img._id || idx} className="card" style={{ overflow: 'visible' }}>
              <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: 'var(--radius) var(--radius) 0 0' }}>
                <img src={imgSrc(img.url)} alt={img.caption || ''} className="img-cover" />
                {/* Overlay buttons */}
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: 0, transition: 'all 0.2s',
                }}
                  onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = 'rgba(0,0,0,0.45)'; }}
                  onMouseOut={e => { e.currentTarget.style.opacity = 0; e.currentTarget.style.background = 'rgba(0,0,0,0)'; }}
                >
                  <button onClick={() => setCover(img._id)} title="Set as cover" style={{
                    background: 'white', border: 'none', borderRadius: 8, padding: '7px 10px',
                    cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
                    color: selected.coverImage === img.url ? 'var(--gold)' : 'var(--charcoal)',
                  }}>
                    <Icon name="star" size={13} color={selected.coverImage === img.url ? 'var(--gold)' : 'currentColor'} />
                    Cover
                  </button>
                  <button onClick={() => setConfirm({ type: 'image', albumId: selected._id, imgId: img._id })} style={{
                    background: 'var(--danger)', border: 'none', borderRadius: 8, padding: '7px 10px',
                    cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <Icon name="trash" size={13} color="white" />
                  </button>
                </div>
                {selected.coverImage === img.url && (
                  <div style={{ position: 'absolute', top: 8, left: 8 }}>
                    <span className="badge badge-gold"><Icon name="star" size={10} /> Cover</span>
                  </div>
                )}
              </div>
              {/* Caption */}
              <div style={{ padding: '10px 12px' }}>
                {editCaption?.imgId === img._id ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input value={editCaption.val} onChange={e => setEditCaption(c => ({ ...c, val: e.target.value }))}
                      style={{ fontSize: 12, padding: '5px 8px' }} placeholder="Caption…"
                      onKeyDown={e => e.key === 'Enter' && saveCaption(img._id, editCaption.val)} autoFocus />
                    <button className="btn btn-primary btn-sm" onClick={() => saveCaption(img._id, editCaption.val)} style={{ padding: '5px 9px' }}>
                      <Icon name="check" size={12} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    onClick={() => setEditCaption({ imgId: img._id, val: img.caption || '' })}>
                    <span style={{ fontSize: 12, color: img.caption ? 'var(--gray-dark)' : 'var(--gray-soft)', flex: 1 }} className="truncate">
                      {img.caption || 'Add caption…'}
                    </span>
                    <Icon name="edit" size={12} color="var(--gray-soft)" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm delete image */}
      {confirm?.type === 'image' && (
        <ConfirmModal title="Delete Photo?" message="This photo will be permanently removed." onConfirm={deleteImage} onCancel={() => setConfirm(null)} />
      )}

      {/* Edit album modal */}
      {modal && modal !== 'new' && (
        <Modal title="Edit Album" onClose={() => setModal(null)}>
          <AlbumForm form={form} setForm={setForm} onSave={saveAlbum} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );

  /* ── Albums list ───────────────────────────────── */
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h3 style={{ fontSize: 20 }}>Gallery Albums</h3>
          <p style={{ color: 'var(--gray-mid)', fontSize: 14, marginTop: 4 }}>Manage photo albums by ministry group or event</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Icon name="plus" size={15} /> New Album
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}><Spinner size={36} /></div>
      ) : albums.length === 0 ? (
        <EmptyState icon="images" title="No albums yet" desc="Create your first gallery album to get started." action={<button className="btn btn-primary" onClick={openNew}><Icon name="plus" size={15} /> Create Album</button>} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {albums.map(album => (
            <div key={album._id} className="card" style={{ overflow: 'hidden' }}>
              {/* Cover image */}
              <div style={{ height: 180, position: 'relative', background: 'var(--gray-pale)', cursor: 'pointer' }}
                onClick={() => setSelected(album)}>
                {album.coverImage ? (
                  <img src={imgSrc(album.coverImage)} alt={album.title} className="img-cover" />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
                    <Icon name="images" size={36} color="var(--gray-light)" />
                    <span style={{ fontSize: 13, color: 'var(--gray-soft)' }}>No photos yet</span>
                  </div>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.25)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                />
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <span className="badge badge-green">{album.group}</span>
                </div>
                {!album.published && (
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <span className="badge badge-gray">Draft</span>
                  </div>
                )}
                <div style={{
                  position: 'absolute', bottom: 10, right: 10,
                  background: 'rgba(0,0,0,0.6)', color: 'white',
                  padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <Icon name="photo" size={11} color="white" />
                  {album.images?.length || 0}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '16px 18px' }}>
                <h4 style={{ fontSize: 16, marginBottom: 5 }}>{album.title}</h4>
                {album.description && <p style={{ fontSize: 13, color: 'var(--gray-mid)', marginBottom: 10 }} className="truncate">{album.description}</p>}
                {album.eventDate && (
                  <div style={{ fontSize: 12, color: 'var(--gray-soft)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="calendar" size={12} />{new Date(album.eventDate).toDateString()}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setSelected(album)} style={{ flex: 1, justifyContent: 'center' }}>
                    <Icon name="images" size={13} /> Manage Photos
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(album)}>
                    <Icon name="edit" size={13} />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type: 'album', id: album._id })}>
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New album modal */}
      {modal === 'new' && (
        <Modal title="Create New Album" onClose={() => setModal(null)}>
          <AlbumForm form={form} setForm={setForm} onSave={saveAlbum} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {/* Confirm delete album */}
      {confirm?.type === 'album' && (
        <ConfirmModal title="Delete Album?" message="All photos in this album will be permanently deleted. This cannot be undone." onConfirm={deleteAlbum} onCancel={() => setConfirm(null)} />
      )}
    </div>
  );
}

function AlbumForm({ form, setForm, onSave, onCancel }) {
  const S = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="form-group">
        <label>Album Title *</label>
        <input value={form.title} onChange={e => S('title', e.target.value)} placeholder="e.g. Easter Sunday 2026" />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea rows={3} value={form.description} onChange={e => S('description', e.target.value)} placeholder="Brief description of this album…" />
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label>Ministry Group *</label>
          <select value={form.group} onChange={e => S('group', e.target.value)}>
            {['Sunday Service', 'Youth Ministry', "Women's Fellowship", "Men's Group", "Children's Church", 'Outreach', 'Special Events', 'Conferences', 'Weddings & Dedications', 'Missions', 'Choir & Worship', 'General'].map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Event Date</label>
          <input type="date" value={form.eventDate} onChange={e => S('eventDate', e.target.value)} />
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '14px 16px', background: 'var(--gray-ghost)', borderRadius: 10 }}>
        <div className={`toggle ${form.published ? 'on' : ''}`} onClick={() => S('published', !form.published)} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Published</div>
          <div style={{ fontSize: 12, color: 'var(--gray-mid)' }}>Visible to website visitors</div>
        </div>
      </label>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn btn-ghost" onClick={onCancel} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
        <button className="btn btn-primary" onClick={onSave} style={{ flex: 1, justifyContent: 'center' }} disabled={!form.title}>
          Save Album
        </button>
      </div>
    </div>
  );
}
