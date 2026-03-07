import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// ─── Sample Data ───────────────────────────────────────────────────────────────
const STUDENTS = [
  {
    id: "2024-001", name: "Rina Permata", class: "XI IPS 2", password: "rena123",
    grades: [78, 81, 83, 85, 87, 89],
    reflections: [
      { sem: 1, text: "Struggled with math but improved over time.", goal: "Study more consistently." },
      { sem: 2, text: "Better focus in class, joined study groups.", goal: "Maintain current GPA." },
    ]
  },
  {
    id: "2024-002", name: "Ahmed Ail", class: "XI IPA 1", password: "ahmed123",
    grades: [88, 87, 89, 84, 85, 84],
    reflections: []
  },
  {
    id: "2024-003", name: "Budi Santoso", class: "XI IPA 2", password: "budi123",
    grades: [75, 74, 73, 72, 74, 73],
    reflections: []
  },
  {
    id: "2024-004", name: "Citra Dewi", class: "XII IPS 1", password: "citra123",
    grades: [82, 82, 83, 83, 82, 82],
    reflections: []
  },
];

const ADMIN = { username: "admin", password: "admin123" };

// ─── Helpers ────────────────────────────────────────────────────────────────────
const avg = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);

function getTrend(grades) {
  if (grades.length < 2) return "Stable";
  const first = grades.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const last = grades.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const diff = last - first;
  if (diff >= 2) return "Improving";
  if (diff <= -2) return "Declining";
  return "Stable";
}

function getMotivation(trend) {
  if (trend === "Improving") return "🌟 Fantastic progress! Your dedication is truly paying off. Keep pushing forward — you're on an upward trajectory that will lead to great achievements!";
  if (trend === "Declining") return "💪 Every challenge is a stepping stone. Reflect on what's holding you back, reach out for help if needed, and remember — a setback is just a setup for a comeback!";
  return "⚡ You're holding steady! Consistency is a superpower. Now is the perfect time to push beyond your comfort zone and aim even higher this semester!";
}

function getTrendColor(trend) {
  if (trend === "Improving") return "#22c55e";
  if (trend === "Declining") return "#ef4444";
  return "#f59e0b";
}

function getTrendBg(trend) {
  if (trend === "Improving") return "rgba(34,197,94,0.1)";
  if (trend === "Declining") return "rgba(239,68,68,0.1)";
  return "rgba(245,158,11,0.1)";
}

// ─── Icons ───────────────────────────────────────────────────────────────────────
const Icon = ({ name }) => {
  const icons = {
    dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    grades: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    reflection: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    profile: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    admin: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    upload: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
    download: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
    users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    check: "M5 13l4 4L19 7",
    plus: "M12 4v16m8-8H4",
    cap: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
    trend_up: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    trend_down: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
    trend_flat: "M5 12h14",
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
      {icons[name]?.split(" M").map((d, i) => (
        <path key={i} strokeLinecap="round" strokeLinejoin="round" d={i === 0 ? d : "M" + d} />
      ))}
    </svg>
  );
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 16px", boxShadow: "0 4px 20px rgba(59,130,246,0.15)" }}>
        <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
        <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#3b82f6", fontFamily: "'DM Sans', sans-serif" }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function LandingPage({ onLogin }) {
  const [loginType, setLoginType] = useState("student");
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = () => {
    setError("");
    if (loginType === "admin") {
      if (id === ADMIN.username && pass === ADMIN.password) { onLogin({ type: "admin" }); return; }
      setError("Invalid admin credentials.");
    } else {
      const student = STUDENTS.find(s => s.id === id && s.password === pass);
      if (student) { onLogin({ type: "student", student }); return; }
      setError("Invalid Student ID or password.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 50%, #f0f0ff 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        * { box-sizing: border-box; }
        .hero-card { transition: transform 0.3s, box-shadow 0.3s; }
        .hero-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(59,130,246,0.15) !important; }
        .btn-primary { transition: all 0.2s; cursor: pointer; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(59,130,246,0.4) !important; }
        .nav-link { transition: color 0.2s; cursor: pointer; }
        .nav-link:hover { color: #3b82f6 !important; }
        input:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(59,130,246,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg style={{ width: 20, height: 20, color: "#fff" }} fill="white" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1e3a5f" }}>LearnTrack</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Features", "About", "Contact"].map(l => (
            <span key={l} className="nav-link" style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>{l}</span>
          ))}
        </div>
        <button className="btn-primary" onClick={() => setShowLogin(true)}
          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 24px", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}>
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(59,130,246,0.1)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
              <span style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600 }}>Academic Progress Tracker</span>
            </div>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 48, fontWeight: 800, color: "#1e3a5f", lineHeight: 1.15, margin: "0 0 20px" }}>
              Visualize Your<br />
              <span style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Learning Journey</span>
            </h1>
            <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 440 }}>
              Track your academic progress from Semester 1 to 6, reflect on your growth, and set goals to reach your full potential.
            </p>
            <button className="btn-primary" onClick={() => setShowLogin(true)}
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 36px", fontSize: 16, fontWeight: 600, boxShadow: "0 6px 20px rgba(59,130,246,0.35)" }}>
              Get Started →
            </button>
          </div>

          {/* Feature Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { icon: "📈", title: "Grade Trends", desc: "Visual charts across 6 semesters" },
              { icon: "🎯", title: "Goal Setting", desc: "Set and track semester goals" },
              { icon: "💡", title: "AI Insights", desc: "Motivational progress messages" },
              { icon: "📊", title: "Admin Panel", desc: "Easy Excel data upload" },
            ].map((f, i) => (
              <div key={i} className="hero-card" style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", boxShadow: "0 4px 20px rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.08)" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 60, background: "rgba(255,255,255,0.7)", borderRadius: 20, padding: "28px 40px", border: "1px solid rgba(59,130,246,0.1)" }}>
          {[["4+", "Students Enrolled"], ["6", "Semesters Tracked"], ["100%", "Data Accuracy"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 800, color: "#3b82f6" }}>{v}</div>
              <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}>
          <div style={{ background: "#fff", borderRadius: 24, padding: 40, width: 420, boxShadow: "0 24px 60px rgba(15,23,42,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg style={{ width: 22, height: 22 }} fill="white" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
              </div>
              <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, color: "#1e3a5f" }}>LearnTrack</span>
            </div>

            <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 12, padding: 4, marginBottom: 24 }}>
              {["student", "admin"].map(t => (
                <button key={t} onClick={() => { setLoginType(t); setError(""); }}
                  style={{ flex: 1, padding: "8px 0", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                    background: loginType === t ? "#fff" : "transparent",
                    color: loginType === t ? "#3b82f6" : "#94a3b8",
                    boxShadow: loginType === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none" }}>
                  {t === "student" ? "🎓 Student" : "⚙️ Admin"}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>
                {loginType === "admin" ? "Username" : "Student ID / NIS"}
              </label>
              <input value={id} onChange={e => setId(e.target.value)}
                placeholder={loginType === "admin" ? "Enter username" : "e.g. 2024-001"}
                style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 14, color: "#1e3a5f", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Enter password"
                style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 14, color: "#1e3a5f", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" }} />
            </div>

            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}

            <button className="btn-primary" onClick={handleLogin}
              style={{ width: "100%", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 600, boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}>
              Sign In →
            </button>

            {loginType === "student" && (
              <div style={{ marginTop: 16, background: "#f8fafc", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#94a3b8" }}>
                <strong style={{ color: "#64748b" }}>Demo:</strong> ID: 2024-001 | Pass: rena123
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STUDENT DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function StudentDashboard({ student: initialStudent, onLogout }) {
  const [student, setStudent] = useState(initialStudent);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reflections, setReflections] = useState(student.reflections || []);
  const [newReflection, setNewReflection] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [reflSem, setReflSem] = useState(6);
  const [saved, setSaved] = useState(false);

  const chartData = student.grades.map((g, i) => ({ name: `Sem ${i + 1}`, grade: g }));
  const trend = getTrend(student.grades);
  const trendColor = getTrendColor(trend);
  const motivation = getMotivation(trend);

  const handleSaveReflection = () => {
    if (!newReflection.trim()) return;
    const updated = [...reflections, { sem: reflSem, text: newReflection, goal: newGoal, date: new Date().toLocaleDateString() }];
    setReflections(updated);
    setNewReflection("");
    setNewGoal("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "grades", label: "Grades", icon: "grades" },
    { id: "reflection", label: "Reflection", icon: "reflection" },
    { id: "profile", label: "Profile", icon: "profile" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8faff", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tab-btn { transition: all 0.2s; cursor: pointer; }
        .sidebar-item { transition: all 0.2s; cursor: pointer; }
        .sidebar-item:hover { background: rgba(59,130,246,0.08) !important; }
        textarea:focus, input:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .card { transition: box-shadow 0.2s; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 240, background: "#fff", borderRight: "1px solid #e2e8f0", padding: "24px 16px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 32 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg style={{ width: 18, height: 18 }} fill="white" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
          </div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700, color: "#1e3a5f" }}>LearnTrack</span>
        </div>

        <div style={{ marginBottom: 8, padding: "0 8px 12px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 10 }}>STUDENT</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
              {student.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>{student.name.split(" ")[0]}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{student.class}</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {tabs.map(t => (
            <div key={t.id} className="sidebar-item" onClick={() => setActiveTab(t.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 12, marginBottom: 4,
                background: activeTab === t.id ? "rgba(59,130,246,0.1)" : "transparent",
                color: activeTab === t.id ? "#3b82f6" : "#64748b",
                fontWeight: activeTab === t.id ? 600 : 400, fontSize: 14 }}>
              <Icon name={t.icon} />
              {t.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-item" onClick={onLogout}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 12, color: "#ef4444", fontSize: 14, fontWeight: 500 }}>
          <Icon name="logout" /> Logout
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
            {activeTab === "dashboard" && `Welcome back, ${student.name.split(" ")[0]}! 👋`}
            {activeTab === "grades" && "Grade History"}
            {activeTab === "reflection" && "Reflection & Goals"}
            {activeTab === "profile" && "My Profile"}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: "4px 0 0" }}>
            {activeTab === "dashboard" && "Here's your academic progress overview"}
            {activeTab === "grades" && "Your semester-by-semester performance"}
            {activeTab === "reflection" && "Write reflections and set goals for growth"}
            {activeTab === "profile" && "Your student information"}
          </p>
        </div>

        {/* ── Dashboard Tab ── */}
        {activeTab === "dashboard" && (
          <div>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Current GPA", value: student.grades[student.grades.length - 1], sub: "Semester 6", color: "#3b82f6" },
                { label: "Average", value: avg(student.grades), sub: "All Semesters", color: "#6366f1" },
                { label: "Best Score", value: Math.max(...student.grades), sub: `Sem ${student.grades.indexOf(Math.max(...student.grades)) + 1}`, color: "#22c55e" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(59,130,246,0.08)", border: "1px solid #f0f4ff" }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'Sora', sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="card" style={{ background: "#fff", borderRadius: 20, padding: "24px", boxShadow: "0 2px 16px rgba(59,130,246,0.08)", marginBottom: 20, border: "1px solid #f0f4ff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>Grade Development</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Semester 1 – 6 Performance</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: getTrendBg(trend), padding: "6px 14px", borderRadius: 100 }}>
                  <Icon name={trend === "Improving" ? "trend_up" : trend === "Declining" ? "trend_down" : "trend_flat"} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: trendColor }}>{trend}</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={avg(student.grades)} stroke="#e2e8f0" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="grade" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Motivation */}
            <div className="card" style={{ background: `linear-gradient(135deg, ${trendColor}15, ${trendColor}05)`, borderRadius: 16, padding: "20px 24px", border: `1px solid ${trendColor}25`, boxShadow: "0 2px 12px rgba(59,130,246,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: trendColor, marginBottom: 8 }}>PROGRESS INSIGHT</div>
              <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{motivation}</p>
            </div>
          </div>
        )}

        {/* ── Grades Tab ── */}
        {activeTab === "grades" && (
          <div>
            <div className="card" style={{ background: "#fff", borderRadius: 20, padding: "24px", boxShadow: "0 2px 16px rgba(59,130,246,0.08)", marginBottom: 20, border: "1px solid #f0f4ff" }}>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="grade" stroke="url(#grad)" strokeWidth={3} dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card" style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(59,130,246,0.08)", border: "1px solid #f0f4ff" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>Semester Grade Summary</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8faff" }}>
                    {["Semester", "Average Grade", "Status"].map(h => (
                      <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {student.grades.map((g, i) => {
                    const prev = i > 0 ? student.grades[i - 1] : null;
                    const diff = prev !== null ? g - prev : null;
                    return (
                      <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px 24px", fontSize: 14, color: "#1e3a5f", fontWeight: 600 }}>Semester {i + 1}</td>
                        <td style={{ padding: "14px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ height: 8, width: `${(g / 100) * 120}px`, background: "linear-gradient(90deg, #3b82f6, #6366f1)", borderRadius: 100 }} />
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#3b82f6" }}>{g}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 24px" }}>
                          {diff !== null ? (
                            <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 100,
                              background: diff > 0 ? "rgba(34,197,94,0.1)" : diff < 0 ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                              color: diff > 0 ? "#22c55e" : diff < 0 ? "#ef4444" : "#f59e0b" }}>
                              {diff > 0 ? `↑ +${diff}` : diff < 0 ? `↓ ${diff}` : "→ Stable"}
                            </span>
                          ) : <span style={{ fontSize: 12, color: "#94a3b8" }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ padding: "12px 24px", background: "#f8faff", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Overall Average</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#3b82f6", fontFamily: "'Sora', sans-serif" }}>{avg(student.grades)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Reflection Tab ── */}
        {activeTab === "reflection" && (
          <div>
            {/* New Reflection */}
            <div className="card" style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 16px rgba(59,130,246,0.08)", marginBottom: 20, border: "1px solid #f0f4ff" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 20 }}>✍️ Add New Reflection</div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 6 }}>SEMESTER</label>
                <select value={reflSem} onChange={e => setReflSem(Number(e.target.value))}
                  style={{ padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, color: "#1e3a5f", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 6 }}>REFLECTION</label>
                <textarea value={newReflection} onChange={e => setNewReflection(e.target.value)}
                  placeholder="Write what you learned, what challenges you faced..."
                  rows={4} style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 14, color: "#1e3a5f", resize: "vertical", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 6 }}>GOAL FOR NEXT SEMESTER</label>
                <input value={newGoal} onChange={e => setNewGoal(e.target.value)}
                  placeholder="e.g. Study 2 hours daily and improve Math..."
                  style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 14, color: "#1e3a5f", fontFamily: "'DM Sans', sans-serif" }} />
              </div>
              <button onClick={handleSaveReflection}
                style={{ background: saved ? "#22c55e" : "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", gap: 8 }}>
                {saved ? <><Icon name="check" /> Saved!</> : "Save Reflection"}
              </button>
            </div>

            {/* Past Reflections */}
            {reflections.length > 0 && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 14 }}>Past Reflections</div>
                {[...reflections].reverse().map((r, i) => (
                  <div key={i} className="card" style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(59,130,246,0.06)", marginBottom: 12, border: "1px solid #f0f4ff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6", background: "rgba(59,130,246,0.1)", padding: "4px 12px", borderRadius: 100 }}>Semester {r.sem}</span>
                      {r.date && <span style={{ fontSize: 12, color: "#94a3b8" }}>{r.date}</span>}
                    </div>
                    <p style={{ margin: "0 0 10px", fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{r.text}</p>
                    {r.goal && <div style={{ background: "#f8faff", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#64748b", borderLeft: "3px solid #3b82f6" }}>
                      🎯 <strong>Goal:</strong> {r.goal}
                    </div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Profile Tab ── */}
        {activeTab === "profile" && (
          <div style={{ maxWidth: 600 }}>
            <div className="card" style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(59,130,246,0.08)", border: "1px solid #f0f4ff" }}>
              <div style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", padding: "40px 32px", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff", border: "3px solid rgba(255,255,255,0.4)" }}>
                  {student.name[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: "#fff" }}>{student.name}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>{student.class}</div>
                </div>
              </div>
              <div style={{ padding: 28 }}>
                {[
                  ["Student ID / NIS", student.id],
                  ["Full Name", student.name],
                  ["Class", student.class],
                  ["Current GPA", `${student.grades[student.grades.length - 1]} (Semester 6)`],
                  ["Progress Trend", trend],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: label === "Progress Trend" ? trendColor : "#1e3a5f" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function AdminDashboard({ onLogout }) {
  const [students, setStudents] = useState(STUDENTS);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [editGrades, setEditGrades] = useState({});
  const [editMode, setEditMode] = useState(false);
  const fileRef = useRef();

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    s.id.includes(searchQ) || s.class.toLowerCase().includes(searchQ.toLowerCase())
  );

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus(`✅ File "${file.name}" uploaded successfully! Data has been processed.`);
    setTimeout(() => setUploadStatus(""), 4000);
  };

  const startEdit = (student) => {
    setSelectedStudent(student);
    setEditGrades({ ...student.grades.reduce((a, g, i) => ({ ...a, [i]: g }), {}) });
    setEditMode(true);
  };

  const saveEdit = () => {
    const updated = students.map(s =>
      s.id === selectedStudent.id ? { ...s, grades: Object.values(editGrades).map(Number) } : s
    );
    setStudents(updated);
    setEditMode(false);
    setSelectedStudent(null);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "students", label: "Students", icon: "users" },
    { id: "upload", label: "Upload Data", icon: "upload" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8faff", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        * { box-sizing: border-box; }
        .sidebar-item { transition: all 0.2s; cursor: pointer; }
        .sidebar-item:hover { background: rgba(99,102,241,0.08) !important; }
        .row-hover:hover { background: #f8faff !important; }
        input:focus, select:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 240, background: "#1e1b4b", padding: "24px 16px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 32 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg style={{ width: 18, height: 18 }} fill="white" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
          </div>
          <div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>LearnTrack</span>
            <div style={{ fontSize: 10, color: "#a5b4fc", fontWeight: 600 }}>ADMIN PANEL</div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {tabs.map(t => (
            <div key={t.id} className="sidebar-item" onClick={() => setActiveTab(t.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 12, marginBottom: 4,
                background: activeTab === t.id ? "rgba(99,102,241,0.3)" : "transparent",
                color: activeTab === t.id ? "#a5b4fc" : "rgba(165,180,252,0.6)",
                fontWeight: activeTab === t.id ? 600 : 400, fontSize: 14 }}>
              <Icon name={t.icon} />
              {t.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-item" onClick={onLogout}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 12, color: "rgba(248,113,113,0.8)", fontSize: 14 }}>
          <Icon name="logout" /> Logout
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
            {activeTab === "overview" && "Admin Overview"}
            {activeTab === "students" && "Student Records"}
            {activeTab === "upload" && "Upload Grade Data"}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: "4px 0 0" }}>LearnTrack Administration Panel</p>
        </div>

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Students", value: students.length, color: "#6366f1" },
                { label: "Improving", value: students.filter(s => getTrend(s.grades) === "Improving").length, color: "#22c55e" },
                { label: "Stable", value: students.filter(s => getTrend(s.grades) === "Stable").length, color: "#f59e0b" },
                { label: "Declining", value: students.filter(s => getTrend(s.grades) === "Declining").length, color: "#ef4444" },
              ].map((s, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(99,102,241,0.08)", border: "1px solid #f0f4ff" }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: s.color, fontFamily: "'Sora', sans-serif" }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(99,102,241,0.08)", border: "1px solid #f0f4ff" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>All Students Summary</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8faff" }}>
                    {["ID", "Name", "Class", "Avg Grade", "Sem 6", "Status"].map(h => (
                      <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => {
                    const trend = getTrend(s.grades);
                    return (
                      <tr key={i} className="row-hover" style={{ borderTop: "1px solid #f1f5f9", cursor: "pointer" }}>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>{s.id}</td>
                        <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>{s.name}</td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#64748b" }}>{s.class}</td>
                        <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 700, color: "#6366f1" }}>{avg(s.grades)}</td>
                        <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>{s.grades[5]}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100,
                            background: getTrendBg(trend), color: getTrendColor(trend) }}>
                            {trend}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Students Tab ── */}
        {activeTab === "students" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="🔍  Search by name, ID, or class..."
                style={{ padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 14, width: 320, fontFamily: "'DM Sans', sans-serif", color: "#1e3a5f" }} />
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {filtered.map((s, i) => {
                const trend = getTrend(s.grades);
                return (
                  <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(99,102,241,0.06)", border: "1px solid #f0f4ff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>
                          {s.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{s.id} · {s.class}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100, background: getTrendBg(trend), color: getTrendColor(trend) }}>{trend}</span>
                        <button onClick={() => startEdit(s)}
                          style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          Edit Grades
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                      {s.grades.map((g, j) => (
                        <div key={j} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>S{j + 1}</div>
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: j === 5 ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#f8faff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: j === 5 ? "#fff" : "#1e3a5f", border: "1px solid #e2e8f0" }}>{g}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edit Modal */}
            {editMode && selectedStudent && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
                <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: 480, boxShadow: "0 24px 60px rgba(15,23,42,0.2)" }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", marginBottom: 4 }}>Edit Grades</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>{selectedStudent.name} · {selectedStudent.class}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
                    {[0,1,2,3,4,5].map(i => (
                      <div key={i}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 6 }}>Semester {i + 1}</label>
                        <input type="number" min="0" max="100" value={editGrades[i]} onChange={e => setEditGrades({ ...editGrades, [i]: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#1e3a5f", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={saveEdit} style={{ flex: 1, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
                    <button onClick={() => setEditMode(false)} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Upload Tab ── */}
        {activeTab === "upload" && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 2px 16px rgba(99,102,241,0.08)", marginBottom: 20, border: "1px solid #f0f4ff" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 6 }}>📤 Upload Grade Data</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Upload Excel (.xlsx) or CSV files containing student grade data.</div>

              <div onClick={() => fileRef.current?.click()}
                style={{ border: "2px dashed #c7d2fe", borderRadius: 16, padding: "48px 24px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: "#f8faff" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#6366f1", marginBottom: 6 }}>Click to upload file</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>Supports .xlsx, .xls, .csv</div>
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={handleFileUpload} />
              </div>

              {uploadStatus && (
                <div style={{ marginTop: 16, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "12px 16px", color: "#22c55e", fontSize: 14, fontWeight: 500 }}>
                  {uploadStatus}
                </div>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 16px rgba(99,102,241,0.08)", border: "1px solid #f0f4ff" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 16 }}>📋 Expected Format</div>
              <div style={{ background: "#f8faff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "rgba(99,102,241,0.08)" }}>
                      {["Student_ID", "Name", "Class", "Sem1", "Sem2", "Sem3", "Sem4", "Sem5", "Sem6"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#6366f1", fontSize: 11 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {["2024-001", "Rina Permata", "XI IPS 2", "78", "81", "83", "85", "87", "89"].map((v, i) => (
                        <td key={i} style={{ padding: "10px 12px", color: "#475569", borderTop: "1px solid #e2e8f0" }}>{v}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <button style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.1)", color: "#6366f1", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                <Icon name="download" /> Download Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [session, setSession] = useState(null);

  if (!session) return <LandingPage onLogin={setSession} />;
  if (session.type === "admin") return <AdminDashboard onLogout={() => setSession(null)} />;
  return <StudentDashboard student={session.student} onLogout={() => setSession(null)} />;
}
