import React from "react";
import { useApp } from "../context/AppContext";

export default function PrivacyPage() {
  const { pageTopPadding } = useApp();
  return (
    <section style={{ padding: `${pageTopPadding + 48}px 20px 80px`, maxWidth: 900, margin: "0 auto" }}>
      <div className="eyebrow">LICEM · Privacy & Consent</div>
      <h1 style={{ margin: "12px 0 18px" }}>Your information, handled with care</h1>
      <p style={{ color: "var(--gray-mid)", lineHeight: 1.8, maxWidth: 720 }}>LICEM collects only the information needed to serve our church community. Prayer requests, contact messages, birthday details, testimonies, newsletter emails, donation details, and uploaded media are used for ministry communication, moderation, administration, and improving the website.</p>
      <div className="card" style={{ padding: 26, marginTop: 24, lineHeight: 1.8 }}>
        <h3>What you should know</h3>
        <p>Prayer requests and testimonies are reviewed before public display. You may ask us to keep a submission anonymous or request its removal. Please do not submit passwords, payment card numbers, or unnecessary sensitive personal information in public forms.</p>
        <p>Donation and payment information is processed by the selected payment provider; LICEM does not intentionally store complete card details. Newsletter subscribers receive LICEM updates and may unsubscribe at any time. We do not sell personal information.</p>
        <p>By submitting a testimony, photograph, birthday message, or other media, you confirm that you have permission to share it and allow LICEM to review and publish it for ministry purposes. Contact the church through the Contact page to correct, withdraw, or ask about your information.</p>
        <p style={{ marginBottom: 0, color: "var(--gray-mid)", fontSize: 13 }}>This short notice is a practical summary, not a substitute for advice specific to your jurisdiction. Last updated: {new Date().toLocaleDateString()}.</p>
      </div>
    </section>
  );
}
