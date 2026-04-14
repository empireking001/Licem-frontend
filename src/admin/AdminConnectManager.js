import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import API from "../api";
import { Icon, Spinner, EmptyState } from "../components/UI";

export default function AdminConnectManager() {
  const { showToast } = useApp();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'followed'

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await API.get("/connect");
      setCards(res.data);
    } catch (err) {
      showToast("Failed to load connect cards", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleFollowUp = async (id) => {
    try {
      await API.put(`/connect/${id}/followup`);
      setCards((prev) =>
        prev.map((c) => (c._id === id ? { ...c, followedUp: true } : c)),
      );
      showToast("Marked as followed up!");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const filteredCards = cards.filter((c) => {
    if (filter === "pending") return !c.followedUp;
    if (filter === "followed") return c.followedUp;
    return true;
  });

  if (loading)
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <Spinner size={40} />
      </div>
    );

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 4 }}>Connect Cards</h2>
          <p style={{ color: "var(--gray-mid)", fontSize: 14 }}>
            Manage new visitors and ministry interests
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 8,
            background: "var(--gray-pale)",
            padding: 4,
            borderRadius: 8,
          }}
        >
          {["all", "pending", "followed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                border: "none",
                fontSize: 13,
                textTransform: "capitalize",
                cursor: "pointer",
                background: filter === f ? "var(--white)" : "transparent",
                boxShadow: filter === f ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                fontWeight: filter === f ? 600 : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <EmptyState
          icon="users"
          title="No cards found"
          desc="No connection cards match your current filter."
        />
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filteredCards.map((card) => (
            <div key={card._id} style={cardContainerStyle(card.followedUp)}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: 18 }}>
                    {card.firstName} {card.lastName}
                  </h4>
                  <span
                    className={`badge ${card.visitType === "First Time" ? "badge-gold" : "badge-blue"}`}
                  >
                    {card.visitType}
                  </span>
                  {card.followedUp && (
                    <span
                      style={{
                        color: "var(--forest)",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      ✓ FOLLOWED UP
                    </span>
                  )}
                </div>

                <div style={infoGridStyle}>
                  <span>
                    <Icon name="mail" size={14} /> {card.email}
                  </span>
                  <span>
                    <Icon name="phone" size={14} /> {card.phone || "N/A"}
                  </span>
                  <span>
                    <Icon name="calendar" size={14} />{" "}
                    {new Date(card.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {card.interests?.length > 0 && (
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {card.interests.map((i) => (
                      <span key={i} style={interestTagStyle}>
                        {i}
                      </span>
                    ))}
                  </div>
                )}

                {card.prayerNeeds && (
                  <div style={prayerBoxStyle}>
                    <strong>Prayer Needs:</strong> {card.prayerNeeds}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {!card.followedUp ? (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleFollowUp(card._id)}
                  >
                    Mark Followed Up
                  </button>
                ) : (
                  <div
                    style={{
                      color: "var(--gray-mid)",
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  >
                    Closed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Styles
const cardContainerStyle = (isDone) => ({
  background: "var(--white)",
  border: "1px solid var(--gray-light)",
  borderRadius: 12,
  padding: 20,
  display: "flex",
  gap: 20,
  opacity: isDone ? 0.8 : 1,
  transition: "all 0.2s",
});

const infoGridStyle = {
  display: "flex",
  gap: 20,
  fontSize: 13,
  color: "var(--gray-mid)",
};

const interestTagStyle = {
  fontSize: 11,
  background: "var(--forest-pale)",
  color: "var(--forest)",
  padding: "2px 8px",
  borderRadius: 4,
  fontWeight: 600,
};

const prayerBoxStyle = {
  marginTop: 12,
  padding: 12,
  background: "var(--cream)",
  borderRadius: 8,
  fontSize: 13,
  lineHeight: 1.5,
  borderLeft: "3px solid var(--gold)",
};
