import React, { useState, useEffect } from "react";
import API from "../api"; // Ensure this path correctly points to your API configuration

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    API.get("/announcements/admin/all")
      .then((res) => setAnnouncements(res.data))
      .catch((err) => console.error("Error fetching announcements:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
      >
        Admin: Manage Announcements
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {announcements.map((a) => (
          <div
            key={a._id}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <p>{a.text}</p>
            <small>Status: {a.active ? "Active" : "Inactive"}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
