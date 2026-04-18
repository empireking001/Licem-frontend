import { useState } from "react";
import { useApp } from "../context/AppContext";
import { PageBanner } from "../components/UI";
import API from "../api";

const INTERESTS = [
  "Sunday Service",
  "Bible Study",
  "Youth Group",
  "Prayer Team",
  "Choir",
  "Children Ministry",
  "Ushering",
  "Media Team",
  "Outreach",
  "Welfare",
];

export default function ConnectPage() {
  const { showToast, pageTopPadding } = useApp();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  ageGroup: "",
  maritalStatus: "",
  birthday: "",
  birthMonth: "",
  visitType: "First Time",
  howHeard: "",
  interests: [],
  prayerNeeds: "",
});

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (item) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(item)
        ? prev.interests.filter((x) => x !== item)
        : [...prev.interests, item],
    }));
  };

  const goNext = () => {
    if (step === 1) {
      if (!form.firstName.trim()) {
        showToast("Please enter your first name.", "error");
        return;
      }
      if (!form.email.trim()) {
        showToast("Please enter your email address.", "error");
        return;
      }
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    setLoading(true);
    try {
      await API.post("/connect", form);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
        "error",
      );
    }
    setLoading(false);
  };

  const resetForm = () => {
    setDone(false);
    setStep(1);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      gender: "",
      ageGroup: "",
      maritalStatus: "",
      visitType: "First Time",
      howHeard: "",
      interests: [],
      prayerNeeds: "",
    });
  };

  const STEPS = ["Personal Info", "Church Info", "Interests"];

  const card = {
    background: "var(--white)",
    borderRadius: 16,
    padding: "36px 36px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    border: "1px solid var(--gray-light)",
  };

  const field = {
    marginBottom: 18,
  };

  const label = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--gray-dark)",
    marginBottom: 6,
    fontFamily: "var(--font-body)",
  };

  const btnRow = {
    display: "flex",
    gap: 12,
    marginTop: 28,
  };

  if (done) {
    return (
      <div style={{ paddingTop: 70 }}>
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            padding: "60px 24px",
            background: "var(--cream)",
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
          <h2 style={{ marginBottom: 14, fontSize: "clamp(24px,4vw,40px)" }}>
            Welcome to the Family!
          </h2>
          <p
            style={{
              color: "var(--gray-mid)",
              maxWidth: 500,
              lineHeight: 1.85,
              fontSize: 16,
              marginBottom: 32,
            }}
          >
            Thank you for connecting with us,{" "}
            <strong style={{ color: "var(--forest)" }}>{form.firstName}</strong>
            . Our pastoral team will reach out to you personally very soon. God
            bless you!
          </p>
          <button className="btn btn-primary btn-lg" onClick={resetForm}>
            Submit Another Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 70 }}>
      <PageBanner
        eyebrow="JOIN US"
        title="Connect With Us"
        subtitle="We would love to know you better. Fill this form and our team will reach out to you personally."
      />

      <section style={{ padding: "56px 0", background: "var(--cream)" }}>
        <div className="container" style={{ maxWidth: 660 }}>
          {/* Step progress */}
          <div
            style={{
              display: "flex",
              marginBottom: 36,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--gray-light)",
            }}
          >
            {STEPS.map((s, i) => {
              const isActive = step === i + 1;
              const isDone = step > i + 1;
              return (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    padding: "14px 10px",
                    textAlign: "center",
                    background: isActive
                      ? "var(--forest)"
                      : isDone
                        ? "var(--forest-pale)"
                        : "var(--white)",
                    color: isActive
                      ? "white"
                      : isDone
                        ? "var(--forest)"
                        : "var(--gray-mid)",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                    borderRight:
                      i < STEPS.length - 1
                        ? "1px solid var(--gray-light)"
                        : "none",
                    transition: "all 0.3s",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>
                    {isDone ? "✓" : i + 1}
                  </div>
                  {s}
                </div>
              );
            })}
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div style={card}>
              <h3 style={{ fontSize: 22, marginBottom: 6 }}>
                Personal Information
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--gray-mid)",
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                Tell us a little about yourself so we can serve you better.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div style={field}>
                  <label style={label}>First Name *</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div style={field}>
                  <label style={label}>Last Name</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div style={field}>
                  <label style={label}>Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="john@email.com"
                  />
                </div>
                <div style={field}>
                  <label style={label}>Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+234 801 234 5678"
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div style={field}>
                  <label style={label}>Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => update("gender", e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div style={field}>
                  <label style={label}>Age Group</label>
                  <select
                    value={form.ageGroup}
                    onChange={(e) => update("ageGroup", e.target.value)}
                  >
                    <option value="">Select age group</option>
                    <option>Under 18</option>
                    <option>18 to 25</option>
                    <option>26 to 35</option>
                    <option>36 to 45</option>
                    <option>46 to 60</option>
                    <option>60 and above</option>
                  </select>
                </div>
              </div>

              <div style={field}>
                <label style={label}>Home Address</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Your home address"
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div style={field}>
                  <label style={label}>Birthday Day</label>
                  <select
                    value={form.birthday}
                    onChange={(e) => update("birthday", e.target.value)}
                  >
                    <option value="">Select day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={field}>
                  <label style={label}>Birthday Month</label>
                  <select
                    value={form.birthMonth}
                    onChange={(e) => update("birthMonth", e.target.value)}
                  >
                    <option value="">Select month</option>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((m, i) => (
                      <option key={m} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={btnRow}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={goNext}
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div style={card}>
              <h3 style={{ fontSize: 22, marginBottom: 6 }}>
                Church Information
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--gray-mid)",
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                Help us understand your connection to our church family.
              </p>

              <div style={field}>
                <label style={label}>Visit Type</label>
                <select
                  value={form.visitType}
                  onChange={(e) => update("visitType", e.target.value)}
                >
                  <option>First Time</option>
                  <option>Occasional Visitor</option>
                  <option>Regular Attendee</option>
                  <option>Member</option>
                </select>
              </div>

              <div style={field}>
                <label style={label}>Marital Status</label>
                <select
                  value={form.maritalStatus}
                  onChange={(e) => update("maritalStatus", e.target.value)}
                >
                  <option value="">Select status</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Widowed</option>
                  <option>Divorced</option>
                </select>
              </div>

              <div style={field}>
                <label style={label}>How did you hear about us?</label>
                <select
                  value={form.howHeard}
                  onChange={(e) => update("howHeard", e.target.value)}
                >
                  <option value="">Select an option</option>
                  <option>Friend or Family</option>
                  <option>Social Media</option>
                  <option>Google Search</option>
                  <option>Evangelism or Outreach</option>
                  <option>Radio or TV</option>
                  <option>Other</option>
                </select>
              </div>

              <div style={field}>
                <label style={label}>Prayer Needs</label>
                <textarea
                  rows={4}
                  value={form.prayerNeeds}
                  onChange={(e) => update("prayerNeeds", e.target.value)}
                  placeholder="Share anything you would like us to pray about for you..."
                />
              </div>

              <div style={btnRow}>
                <button
                  className="btn btn-ghost"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={goBack}
                >
                  ← Back
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 2, justifyContent: "center" }}
                  onClick={goNext}
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div style={card}>
              <h3 style={{ fontSize: 22, marginBottom: 6 }}>
                Ministry Interests
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--gray-mid)",
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                Select all the areas you would love to get involved in. You can
                choose as many as you like.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 28,
                }}
              >
                {INTERESTS.map((item) => {
                  const selected = form.interests.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleInterest(item)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: 24,
                        border: `2px solid ${
                          selected ? "var(--forest)" : "var(--gray-light)"
                        }`,
                        background: selected
                          ? "var(--forest-pale)"
                          : "var(--white)",
                        color: selected ? "var(--forest)" : "var(--gray-dark)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {selected ? "✓ " : ""}
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* Summary box */}
              <div
                style={{
                  padding: "18px 20px",
                  background: "var(--gray-pale)",
                  borderRadius: 10,
                  marginBottom: 8,
                  fontSize: 14,
                  color: "var(--gray-dark)",
                  lineHeight: 1.7,
                }}
              >
                <div>
                  <strong>Name:</strong> {form.firstName} {form.lastName}
                </div>
                <div>
                  <strong>Email:</strong> {form.email}
                </div>
                {form.phone && (
                  <div>
                    <strong>Phone:</strong> {form.phone}
                  </div>
                )}
                {form.visitType && (
                  <div>
                    <strong>Visit Type:</strong> {form.visitType}
                  </div>
                )}
                {form.interests.length > 0 && (
                  <div
                    style={{
                      marginTop: 6,
                      color: "var(--forest)",
                      fontWeight: 600,
                    }}
                  >
                    <strong>Interests:</strong> {form.interests.join(", ")}
                  </div>
                )}
              </div>

              <div style={btnRow}>
                <button
                  className="btn btn-ghost"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={goBack}
                >
                  ← Back
                </button>
                <button
                  className="btn btn-gold"
                  style={{
                    flex: 2,
                    justifyContent: "center",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onClick={submit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "🙌 Submit Connect Card"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
