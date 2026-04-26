import { useEffect, useState } from "react";

const EQUIPMENT = [
  { id: 1, label: "Barbell", enabled: true },
  { id: 8, label: "Bench", enabled: true },
  { id: 3, label: "Dumbbell", enabled: true },
  { id: 4, label: "Gym mat", enabled: true },
  { id: 9, label: "Incline bench", enabled: false },
  { id: 10, label: "Kettlebell", enabled: false },
  { id: 6, label: "Pull-up bar", enabled: false },
  { id: 11, label: "Resistance band", enabled: false },
  { id: 2, label: "SZ-Bar", enabled: false },
  { id: 5, label: "Swiss Ball", enabled: false },
  { id: 7, label: "none (bodyweight exercise)", enabled: true },
];

const FOCUS_OPTIONS = [
  "Hypertrophy & Strength",
  "Fat Loss & Conditioning",
  "Endurance & Mobility",
  "Power & Explosiveness",
  "Recovery & Maintenance",
];

const EQUIPMENT_ICONS = {
  Barbell: "🏋️",
  Bench: "🪑",
  Dumbbell: "💪",
  "Gym mat": "🟩",
  "Incline bench": "📐",
  Kettlebell: "🫙",
  "Pull-up bar": "🧗",
  "Resistance band": "🤸",
  "SZ-Bar": "〰️",
  "Swiss Ball": "🔵",
  "none (bodyweight exercise)": "🙆",
};

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [focusPhase, setFocusPhase] = useState("Hypertrophy & Strength");
  const [trainingDays, setTrainingDays] = useState(4);
  const [specificTarget, setSpecificTarget] = useState("");
  const [equipment, setEquipment] = useState(EQUIPMENT);
  const [limitations, setLimitations] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/preferences");

        if (!res.ok) {
          throw new Error("Failed to load preferences");
        }

        const data = await res.json();

        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setAge(data.age ?? "");
        setHeight(data.height ?? "");
        setWeight(data.weight ?? "");
        setFocusPhase(data.focusPhase ?? "Hypertrophy & Strength");
        setTrainingDays(data.trainingDays ?? 4);
        setSpecificTarget(data.specificTarget ?? "");
        setLimitations(data.limitations ?? "");

        if (Array.isArray(data.equipment)) {
          setEquipment(data.equipment);
        } else {
          setEquipment(EQUIPMENT);
        }
      } catch (err) {
        console.error("Could not load preferences:", err);
        setEquipment(EQUIPMENT);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const toggleEquipment = (idx) => {
    setEquipment((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, enabled: !e.enabled } : e)),
    );
  };

  const handleSave = async () => {
    const payload = {
      firstName,
      lastName,
      age,
      height,
      weight,
      focusPhase,
      trainingDays,
      specificTarget,
      equipment,
      limitations,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/save-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save preferences");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Could not save preferences.");
    }
  };

  return (
    <div style={styles.root}>
      {/* Main */}
      <main className="main-container" style={styles.mainBase}>
        {/* Header */}
        <div className="header-container">
          <div>
            <h1 style={styles.pageTitle}>Profile &amp; Settings</h1>
            <p style={styles.pageSubtitle}>
              Configure your identity, goals, and training environment.
            </p>
          </div>
          <button style={styles.updateBtn}>
            <span style={{ marginRight: 6 }}>⟳</span> UPDATE AI CONTEXT
          </button>
        </div>

        <div className="layout-grid">
          {/* Left Column */}
          <div style={styles.leftCol}>
            {/* Personal Identity */}
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>🪪</span> Personal Identity
              </h2>
              <div style={styles.avatarRow}>
                <div style={styles.avatar}>
                  <svg width="64" height="64" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="32" fill="#2a2a2a" />
                    <circle cx="32" cy="24" r="12" fill="#555" />
                    <ellipse cx="32" cy="52" rx="18" ry="12" fill="#555" />
                    <circle cx="32" cy="24" r="10" fill="#c8a07a" />
                    <rect
                      x="24"
                      y="28"
                      width="16"
                      height="6"
                      rx="2"
                      fill="#3a5fa0"
                    />
                    <circle cx="27" cy="23" r="2.5" fill="#222" />
                    <circle cx="37" cy="23" r="2.5" fill="#222" />
                    <rect
                      x="26"
                      y="28"
                      width="4"
                      height="2"
                      rx="1"
                      fill="#888"
                    />
                    <rect
                      x="34"
                      y="28"
                      width="4"
                      height="2"
                      rx="1"
                      fill="#888"
                    />
                  </svg>
                </div>
              </div>
              <div className="form-row-2">
                <div style={styles.formGroup}>
                  <label style={styles.label}>FIRST NAME</label>
                  <input
                    style={styles.input}
                    value={loading ? "Loading..." : firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>LAST NAME</label>
                  <input
                    style={styles.input}
                    value={loading ? "Loading..." : lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="form-row-3">
                <div style={styles.formGroup}>
                  <label style={styles.label}>AGE</label>
                  <input
                    style={styles.input}
                    value={loading ? "Loading..." : age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>HEIGHT (CM)</label>
                  <input
                    style={styles.input}
                    value={loading ? "Loading..." : height}
                    onChange={(e) => setHeight(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>WEIGHT (KG)</label>
                  <input
                    style={styles.input}
                    value={loading ? "Loading..." : weight}
                    onChange={(e) => setWeight(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </section>

            {/* Primary Objectives */}
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>🚩</span> Primary Objectives
              </h2>
              <div style={styles.formGroup}>
                <label style={styles.label}>CURRENT FOCUS PHASE</label>
                <div style={styles.selectWrapper}>
                  <select
                    style={styles.select}
                    value={focusPhase}
                    onChange={(e) => setFocusPhase(e.target.value)}
                    disabled={loading}
                  >
                    {FOCUS_OPTIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <span style={styles.selectArrow}>▾</span>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  TRAINING DAYS PER WEEK:{" "}
                  <span style={{ color: "#c8f000" }}>{trainingDays}</span>
                </label>
                <div style={styles.sliderWrapper}>
                  <span style={styles.sliderLabel}>1</span>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={trainingDays}
                    onChange={(e) => setTrainingDays(Number(e.target.value))}
                    style={styles.slider}
                    disabled={loading}
                  />
                  <span style={styles.sliderLabel}>7</span>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>SPECIFIC TARGET</label>
                <textarea
                  style={styles.textarea}
                  value={loading ? "Loading..." : specificTarget}
                  onChange={(e) => setSpecificTarget(e.target.value)}
                  rows={3}
                  disabled={loading}
                />
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div style={styles.rightCol}>
            {/* Environment Setup */}
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>🏠</span> Environment Setup
              </h2>
              <p style={styles.cardDesc}>
                Select available gear to refine AI workout generation.
              </p>
              <div style={styles.equipmentList}>
                {equipment.map((eq, idx) => (
                  <div key={eq.id} style={styles.equipmentRow}>
                    <span style={styles.equipIcon}>
                      {EQUIPMENT_ICONS[eq.label]}
                    </span>
                    <span style={styles.equipLabel}>{eq.label}</span>
                    <button
                      onClick={() => toggleEquipment(idx)}
                      disabled={loading}
                      style={{
                        ...styles.toggle,
                        ...(eq.enabled ? styles.toggleOn : styles.toggleOff),
                        ...(loading ? styles.toggleDisabled : {}),
                      }}
                    >
                      <span
                        style={{
                          ...styles.toggleThumb,
                          transform: eq.enabled
                            ? "translateX(20px)"
                            : "translateX(2px)",
                        }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Physical Limitations */}
            <section style={{ ...styles.card, ...styles.limitationsCard }}>
              <h2 style={styles.cardTitle}>
                <span style={styles.cardTitleIcon}>⚠️</span> Physical
                Limitations
              </h2>
              <p style={styles.cardDesc}>
                Inform the AI of any injuries or movement restrictions to ensure
                safe programming.
              </p>
              <textarea
                style={{ ...styles.textarea, minHeight: 90 }}
                value={loading ? "Loading..." : limitations}
                onChange={(e) => setLimitations(e.target.value)}
                rows={4}
                disabled={loading}
              />
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  ...styles.saveBtn,
                  ...(saved ? styles.saveBtnSaved : {}),
                  ...(loading ? styles.saveBtnDisabled : {}),
                }}
              >
                {loading
                  ? "LOADING..."
                  : saved
                    ? "✓ SAVED!"
                    : "SAVE PREFERENCES"}
              </button>
            </section>
          </div>
        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Segoe UI', sans-serif; }
        
        .main-container {
          padding: 32px 40px;
        }
        .header-container {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .layout-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          align-items: start;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 768px) {
          .main-container {
            padding: 20px 16px;
          }
          .header-container {
            flex-direction: column;
            gap: 16px;
          }
          .layout-grid {
            grid-template-columns: 1fr;
          }
          .form-row-2, .form-row-3 {
            grid-template-columns: 1fr;
          }
        }

        input[type=range] {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(to right, #c8f000 0%, #c8f000 ${
            ((trainingDays - 1) / 6) * 100
          }%, #3a3a3a ${((trainingDays - 1) / 6) * 100}%, #3a3a3a 100%);
          outline: none;
          cursor: pointer;
          flex: 1;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #c8f000;
          cursor: pointer;
        }
        select option { background: #1e1e1e; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "#111",
    color: "#fff",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  mainBase: {
    flex: 1,
    overflowY: "auto",
  },
  pageTitle: {
    margin: 0,
    fontSize: 32,
    fontWeight: 700,
    color: "#fff",
  },
  pageSubtitle: {
    margin: "6px 0 0",
    fontSize: 14,
    color: "#666",
  },
  updateBtn: {
    padding: "10px 20px",
    background: "transparent",
    border: "1.5px solid #0e9cdc",
    borderRadius: 8,
    color: "#0e9cdc",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.06em",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  card: {
    background: "#1a1a1a",
    borderRadius: 12,
    padding: "24px",
    border: "1px solid #252525",
  },
  limitationsCard: {
    border: "1.5px solid #1a4a5a",
    background: "#141e22",
  },
  cardTitle: {
    margin: "0 0 16px",
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  cardTitleIcon: {
    fontSize: 18,
  },
  cardDesc: {
    margin: "-8px 0 16px",
    fontSize: 13,
    color: "#666",
    lineHeight: 1.5,
  },
  avatarRow: {
    display: "flex",
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    overflow: "hidden",
    background: "#2a2a2a",
    border: "2px solid #333",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: "#666",
    letterSpacing: "0.08em",
  },
  input: {
    background: "#111",
    border: "1px solid #2e2e2e",
    borderRadius: 8,
    color: "#fff",
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
    width: "100%",
  },
  selectWrapper: {
    position: "relative",
  },
  select: {
    width: "100%",
    background: "#111",
    border: "1px solid #2e2e2e",
    borderRadius: 8,
    color: "#fff",
    padding: "10px 36px 10px 14px",
    fontSize: 14,
    outline: "none",
    appearance: "none",
    cursor: "pointer",
  },
  selectArrow: {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#666",
    pointerEvents: "none",
    fontSize: 16,
  },
  sliderWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 13,
    color: "#666",
    minWidth: 8,
  },
  slider: {
    flex: 1,
  },
  textarea: {
    width: "100%",
    background: "#111",
    border: "1px solid #2e2e2e",
    borderRadius: 8,
    color: "#fff",
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.5,
  },
  equipmentList: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  equipmentRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    background: "#111",
    borderRadius: 8,
    border: "1px solid #222",
  },
  equipIcon: {
    fontSize: 18,
    width: 24,
    textAlign: "center",
  },
  equipLabel: {
    flex: 1,
    fontSize: 14,
    color: "#ddd",
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    position: "relative",
    transition: "background 0.2s",
    padding: 0,
    flexShrink: 0,
  },
  toggleOn: {
    background: "#c8f000",
  },
  toggleOff: {
    background: "#333",
  },
  toggleDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  toggleThumb: {
    position: "absolute",
    top: 3,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#fff",
    transition: "transform 0.2s",
    display: "block",
  },
  saveBtn: {
    width: "100%",
    marginTop: 14,
    padding: "14px 0",
    background: "#c8f000",
    color: "#111",
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: "0.1em",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  saveBtnSaved: {
    background: "#a0c800",
  },
  saveBtnDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
};

export default Profile;
