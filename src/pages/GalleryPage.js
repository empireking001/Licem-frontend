import { useState, useEffect, useCallback } from "react";
import { galleryAPI } from "../api";
import { Icon, Spinner, PageBanner, EmptyState } from "../components/UI";
import { useApp } from '../context/AppContext';

const GROUPS = [
  "All",
  "Sunday Service",
  "Youth Ministry",
  "Women's Fellowship",
  "Men's Group",
  "Children's Church",
  "Outreach",
  "Special Events",
  "Conferences",
  "Choir & Worship",
  "Missions",
  "General",
];

export default function GalleryPage() {
  const { showToast, pageTopPadding } = useApp();
  const [albums, setAlbums] = useState([]);
  const [groups, setGroupStats] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // album
  const [lightbox, setLightbox] = useState(null); // { images[], index }

  const load = useCallback(() => {
    setLoading(true);
    galleryAPI
      .getAll({ group: filter !== "All" ? filter : undefined })
      .then((r) => {
        setAlbums(r.data.albums || []);
        setGroupStats(r.data.groups || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const openAlbum = async (album) => {
    try {
      const r = await galleryAPI.getOne(album._id);
      setSelected(r.data);
    } catch {
      setSelected(album);
    }
  };

  // Lightbox nav
  const lbPrev = () =>
    setLightbox((l) => ({
      ...l,
      index: (l.index - 1 + l.images.length) % l.images.length,
    }));
  const lbNext = () =>
    setLightbox((l) => ({ ...l, index: (l.index + 1) % l.images.length }));

  useEffect(() => {
    if (!lightbox) return;
    const h = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") lbPrev();
      if (e.key === "ArrowRight") lbNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightbox]);

  // Album detail view
  if (selected)
    return (
      <div style={{ paddingTop: 70 }}>
        <div
          style={{
            background: "var(--white)",
            borderBottom: "1px solid var(--gray-light)",
            padding: "16px 0",
          }}
        >
          <div
            className="container"
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSelected(null)}
            >
              <Icon name="chevLeft" size={14} /> All Albums
            </button>
            <div
              style={{ width: 1, height: 20, background: "var(--gray-light)" }}
            />
            <span className="badge badge-green">{selected.group}</span>
            <h3 style={{ fontSize: 20, margin: 0 }}>{selected.title}</h3>
            {selected.eventDate && (
              <span
                style={{
                  fontSize: 13,
                  color: "var(--gray-mid)",
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Icon name="calendar" size={13} />
                {new Date(selected.eventDate).toDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="container" style={{ padding: "40px 28px" }}>
          {selected.description && (
            <p
              style={{
                maxWidth: 680,
                marginBottom: 36,
                fontSize: 16,
                lineHeight: 1.8,
              }}
            >
              {selected.description}
            </p>
          )}

          {selected.images?.length === 0 ? (
            <EmptyState
              icon="photo"
              title="No photos yet"
              desc="Photos from this event will appear here soon."
            />
          ) : (
            <>
              <div
                style={{
                  marginBottom: 16,
                  color: "var(--gray-mid)",
                  fontSize: 14,
                }}
              >
                {selected.images?.length} photo
                {selected.images?.length !== 1 ? "s" : ""}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                {selected.images?.map((img, idx) => (
                  <div
                    key={img._id || idx}
                    className="card"
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="aspect-square"
                      style={{
                        backgroundImage: `url(${img.url.startsWith("/") ? `http://localhost:5000${img.url}` : img.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: "zoom-in",
                        position: "relative",
                        transition: "transform 0.4s var(--ease)",
                      }}
                      onClick={() =>
                        setLightbox({ images: selected.images, index: idx })
                      }
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.03)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                    <div
                      style={{
                        padding: "10px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--gray-mid)",
                          flex: 1,
                        }}
                        className="truncate"
                      >
                        {img.caption || "Tap to view"}
                      </span>

                      <a
                        href={
                          img.url.startsWith("/")
                            ? `http://localhost:5000${img.url}`
                            : img.url
                        }
                        download={img.filename || "photo.jpg"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Download photo"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "var(--forest-pale)",
                          color: "var(--forest)",
                          border: "1px solid var(--forest-pale)",
                          cursor: "pointer",
                          flexShrink: 0,
                          textDecoration: "none",
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "var(--forest)";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background =
                            "var(--forest-pale)";
                          e.currentTarget.style.color = "var(--forest)";
                        }}
                      >
                        ⬇
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                lbPrev();
              }}
              style={{
                position: "absolute",
                left: 24,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                width: 48,
                height: 48,
                cursor: "pointer",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <Icon name="chevLeft" size={22} color="white" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "88vw",
                maxHeight: "86vh",
                position: "relative",
              }}
            >
              <img
                src={
                  lightbox.images[lightbox.index].url.startsWith("/")
                    ? `http://localhost:5000${lightbox.images[lightbox.index].url}`
                    : lightbox.images[lightbox.index].url
                }
                alt={lightbox.images[lightbox.index].caption || ""}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: 12,
                  display: "block",
                }}
              />
              {lightbox.images[lightbox.index].caption && (
                <div
                  style={{
                    textAlign: "center",
                    color: "rgba(255,255,255,0.75)",
                    marginTop: 14,
                    fontSize: 14,
                  }}
                >
                  {lightbox.images[lightbox.index].caption}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  marginTop: 12,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                  {lightbox.index + 1} / {lightbox.images.length}
                </span>

                <a
                  href={
                    lightbox.images[lightbox.index].url.startsWith("/")
                      ? `http://localhost:5000${lightbox.images[lightbox.index].url}`
                      : lightbox.images[lightbox.index].url
                  }
                  download={
                    lightbox.images[lightbox.index].filename || "photo.jpg"
                  }
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 16px",
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.25)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.15)")
                  }
                >
                  ⬇ Download Photo
                </a>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                lbNext();
              }}
              style={{
                position: "absolute",
                right: 24,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                width: 48,
                height: 48,
                cursor: "pointer",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <Icon name="chevRight" size={22} color="white" />
            </button>

            <button
              onClick={() => setLightbox(null)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                width: 40,
                height: 40,
                cursor: "pointer",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="x" size={18} color="white" />
            </button>
          </div>
        )}
      </div>
    );

  // Album list
  return (
    <div style={{ paddingTop: 70 }}>
      <PageBanner
        eyebrow="OUR MOMENTS"
        title="Photo Gallery"
        subtitle="Browse photos from our services, programs, and community events."
      />

      {/* Group stats bar */}
      <div
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--gray-light)",
          padding: "16px 0",
          position: "sticky",
          top: 70,
          zIndex: 50,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {GROUPS.map((g) => {
            const stat = groups.find((s) => s._id === g);
            return (
              <button
                key={g}
                onClick={() => setFilter(g)}
                className={`btn btn-sm ${filter === g ? "btn-primary" : "btn-ghost"}`}
                style={{ whiteSpace: "nowrap", flexShrink: 0 }}
              >
                {g}
                {stat && (
                  <span style={{ opacity: 0.65, marginLeft: 4 }}>
                    ({stat.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="container" style={{ padding: "48px 28px" }}>
        {loading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 64 }}
          >
            <Spinner size={40} />
          </div>
        ) : albums.length === 0 ? (
          <EmptyState
            icon="images"
            title="No albums yet"
            desc="Gallery albums will appear here once they've been published."
          />
        ) : (
          <>
            <div
              style={{
                marginBottom: 24,
                color: "var(--gray-mid)",
                fontSize: 14,
              }}
            >
              {albums.length} album{albums.length !== 1 ? "s" : ""}{" "}
              {filter !== "All" ? `in ${filter}` : ""}
            </div>
            <div className="grid-auto">
              {albums.map((album, i) => (
                <div
                  key={album._id}
                  className="card card-lift animate-up"
                  style={{ cursor: "pointer", animationDelay: `${i * 0.07}s` }}
                  onClick={() => openAlbum(album)}
                >
                  <div
                    style={{
                      height: 200,
                      position: "relative",
                      overflow: "hidden",
                      background: "var(--gray-pale)",
                    }}
                  >
                    {album.coverImage ? (
                      <img
                        src={
                          album.coverImage.startsWith("/")
                            ? `http://localhost:5000${album.coverImage}`
                            : album.coverImage
                        }
                        alt={album.title}
                        className="img-cover"
                        style={{ transition: "transform 0.4s var(--ease)" }}
                        onMouseOver={(e) =>
                          (e.target.style.transform = "scale(1.06)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.transform = "scale(1)")
                        }
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          name="images"
                          size={40}
                          color="var(--gray-light)"
                        />
                      </div>
                    )}
                    {/* Photo count chip */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        background: "rgba(0,0,0,0.65)",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <Icon name="photo" size={12} color="white" />
                      {album.imageCount ?? album.images?.length ?? 0}
                    </div>
                  </div>
                  <div style={{ padding: "16px 18px 18px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <span className="badge badge-green">{album.group}</span>
                      {album.eventDate && (
                        <span
                          style={{ fontSize: 12, color: "var(--gray-soft)" }}
                        >
                          {new Date(album.eventDate).toDateString()}
                        </span>
                      )}
                    </div>
                    <h4
                      style={{
                        fontSize: 17,
                        marginBottom: 6,
                        lineHeight: 1.35,
                      }}
                    >
                      {album.title}
                    </h4>
                    {album.description && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--gray-mid)",
                          lineHeight: 1.6,
                        }}
                        className="truncate"
                      >
                        {album.description}
                      </p>
                    )}
                    <div
                      style={{
                        marginTop: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--forest)",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      View Photos <Icon name="arrowRight" size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
