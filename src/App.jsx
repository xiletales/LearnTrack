import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, TrendingUp, Activity, BookOpen, User, Users,
  Upload, MessageSquare, LogOut, Menu, X, ChevronRight, ChevronDown,
  Star, Award, Target, Bell, Settings, FileText, BarChart2,
  CheckCircle, AlertCircle, ArrowUp, ArrowDown, Minus, Eye, EyeOff,
  Edit3, Save, GraduationCap, BookMarked, ClipboardList, PieChart,
  School, Calendar, BookCheck, Info, Layers, Zap
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart
} from "recharts";

const C = {
  primary: "#2d7a35",
  dark: "#236228",
  darker: "#1a4d1f",
  heroGreen: "#2a7030",
  light: "#eef6f0",
  lighter: "#f5faf6",
  accent: "#5aad6a",
  accent2: "#7dd98f",
  text: "#1c2e20",
  textMuted: "#5a7a60",
  border: "#cde5d2",
  white: "#ffffff",
  danger: "#c0616a",
  warning: "#c98a3e",
  info: "#4a7dab",
  successBg: "#eef6f0",
  dangerBg: "#fdf0f1",
  warningBg: "#fdf5ec",
};

const mockStudents = [
  {
    id: 1, nisn: "0012345678", password: "siswa123",
    name: "Adi Nugroho", gender: "Male", birthDate: "2008-03-15",
    class: "10A", schoolYear: "2024/2025", school: "SMA Negeri 1 Sragen",
    address: "Jl. Merdeka No. 12, Sragen",
    photo: null,
    grades: [
      { semester: "Sem 1 (Grade 10)", math: 78, science: 82, indonesian: 85, english: 80, avg: 81.25 },
      { semester: "Sem 2 (Grade 10)", math: 81, science: 84, indonesian: 87, english: 83, avg: 83.75 },
      { semester: "Sem 1 (Grade 11)", math: 79, science: 86, indonesian: 88, english: 85, avg: 84.50 },
      { semester: "Sem 2 (Grade 11)", math: 85, science: 88, indonesian: 90, english: 87, avg: 87.50 },
      { semester: "Sem 1 (Grade 12)", math: 87, science: 89, indonesian: 91, english: 88, avg: 88.75 },
      { semester: "Sem 2 (Grade 12)", math: 90, science: 91, indonesian: 93, english: 90, avg: 91.00 },
    ],
    reflections: [
      { semester: "Sem 1 (Grade 10)", text: "I need to improve my math skills. Will study harder next semester.", target: "Reach 85 in math.", teacherNote: "Keep up the good work, Adi! Focus on algebra." },
      { semester: "Sem 2 (Grade 10)", text: "Math improved but science needs more attention.", target: "Improve science to 87.", teacherNote: "" },
    ]
  },
  {
    id: 2, nisn: "0087654321", password: "siswa123",
    name: "Siti Rahayu", gender: "Female", birthDate: "2008-07-22",
    class: "10B", schoolYear: "2024/2025", school: "SMA Negeri 1 Sragen",
    address: "Jl. Sudirman No. 45, Sragen",
    photo: null,
    grades: [
      { semester: "Sem 1 (Grade 10)", math: 90, science: 88, indonesian: 92, english: 91, avg: 90.25 },
      { semester: "Sem 2 (Grade 10)", math: 88, science: 87, indonesian: 91, english: 90, avg: 89.00 },
      { semester: "Sem 1 (Grade 11)", math: 86, science: 85, indonesian: 89, english: 88, avg: 87.00 },
      { semester: "Sem 2 (Grade 11)", math: 87, science: 86, indonesian: 90, english: 89, avg: 88.00 },
      { semester: "Sem 1 (Grade 12)", math: 89, science: 88, indonesian: 91, english: 90, avg: 89.50 },
      { semester: "Sem 2 (Grade 12)", math: 91, science: 90, indonesian: 93, english: 92, avg: 91.50 },
    ],
    reflections: [
      { semester: "Sem 1 (Grade 10)", text: "Good semester overall. Need to maintain consistency.", target: "Stay above 88 in all subjects.", teacherNote: "Excellent performance! Keep it up." },
    ]
  },
  {
    id: 3, nisn: "0099887766", password: "siswa123",
    name: "Bima Saputra", gender: "Male", birthDate: "2008-11-05",
    class: "11A", schoolYear: "2024/2025", school: "SMA Negeri 1 Sragen",
    address: "Jl. Gatot Subroto No. 8, Sragen",
    photo: null,
    grades: [
      { semester: "Sem 1 (Grade 10)", math: 70, science: 72, indonesian: 75, english: 71, avg: 72.00 },
      { semester: "Sem 2 (Grade 10)", math: 68, science: 70, indonesian: 73, english: 69, avg: 70.00 },
      { semester: "Sem 1 (Grade 11)", math: 65, science: 67, indonesian: 70, english: 66, avg: 67.00 },
      { semester: "Sem 2 (Grade 11)", math: 72, science: 74, indonesian: 76, english: 73, avg: 73.75 },
      { semester: "Sem 1 (Grade 12)", math: 75, science: 76, indonesian: 78, english: 76, avg: 76.25 },
      { semester: "Sem 2 (Grade 12)", math: 78, science: 79, indonesian: 80, english: 78, avg: 78.75 },
    ],
    reflections: []
  }
];

const mockTeachers = [
  {
    id: 1, username: "budi.santoso", password: "guru123",
    name: "Budi Santoso, S.Pd.", gender: "Male",
    nip: "198503152010011001",
    classHandled: "10A", schoolYear: "2024/2025",
    subject: "Mathematics",
    school: "SMA Negeri 1 Sragen",
    phone: "081234567890",
    email: "budi.santoso@sman1sragen.sch.id",
    photo: null,
  },
  {
    id: 2, username: "ani.widyastuti", password: "guru123",
    name: "Ani Widyastuti, M.Pd.", gender: "Female",
    nip: "198907122015042001",
    classHandled: "10B", schoolYear: "2024/2025",
    subject: "Indonesian Language",
    school: "SMA Negeri 1 Sragen",
    phone: "082345678901",
    email: "ani.widyastuti@sman1sragen.sch.id",
    photo: null,
  }
];

const classOptions = ["10A","10B","10C","11A","11B","11C","12A","12B","12C"];
const schoolYearOptions = ["2022/2023","2023/2024","2024/2025","2025/2026"];
const subjectOptions = ["Mathematics","Science","Indonesian Language","English","Social Studies","Arts","Physical Education","Religious Studies","Computer Science"];

// ── Logo SVG ──────────────────────────────────────────────────────────────────
function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="capTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4caf50"/>
          <stop offset="100%" stopColor="#1b5e20"/>
        </linearGradient>
        <linearGradient id="capBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#388e3c"/>
          <stop offset="100%" stopColor="#1b5e20"/>
        </linearGradient>
      </defs>
      {/* Cap top board */}
      <polygon points="50,12 90,32 50,48 10,32" fill="url(#capTop)" />
      <line x1="10" y1="32" x2="90" y2="32" stroke="white" strokeWidth="1.5" opacity="0.4"/>
      {/* Cap body */}
      <path d="M28,38 Q28,62 50,68 Q72,62 72,38" fill="url(#capBody)"/>
      {/* Tassel string */}
      <line x1="84" y1="32" x2="84" y2="58" stroke="#2d7a2f" strokeWidth="2.5"/>
      {/* Tassel knot */}
      <circle cx="84" cy="60" r="4" fill="#1b5e20"/>
      {/* Tassel fringe */}
      <line x1="81" y1="60" x2="79" y2="70" stroke="#2d7a2f" strokeWidth="1.5"/>
      <line x1="84" y1="60" x2="84" y2="71" stroke="#2d7a2f" strokeWidth="1.5"/>
      <line x1="87" y1="60" x2="89" y2="70" stroke="#2d7a2f" strokeWidth="1.5"/>
      {/* Chart line */}
      <polyline points="18,82 34,72 50,76 66,64 82,58" fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
      <circle cx="18" cy="82" r="3" fill="white" stroke="#2d7a2f" strokeWidth="1.5"/>
      <circle cx="34" cy="72" r="3" fill="white" stroke="#2d7a2f" strokeWidth="1.5"/>
      <circle cx="50" cy="76" r="3" fill="white" stroke="#2d7a2f" strokeWidth="1.5"/>
      <circle cx="66" cy="64" r="3" fill="white" stroke="#2d7a2f" strokeWidth="1.5"/>
      <circle cx="82" cy="58" r="3" fill="white" stroke="#2d7a2f" strokeWidth="1.5"/>
    </svg>
  );
}

// ── Icon Button ───────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", style = {}, disabled }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "9px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer", border: "none",
    transition: "all 0.2s", opacity: disabled ? 0.6 : 1, ...style
  };
  const variants = {
    primary: { background: C.primary, color: "white" },
    outline: { background: "transparent", color: C.primary, border: `1.5px solid ${C.primary}` },
    danger: { background: C.danger, color: "white" },
    ghost: { background: "transparent", color: C.textMuted, border: "none", padding: "6px 10px" },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
}

// ── Input ─────────────────────────────────────────────────────────────────────
function Input({ label, value, onChange, type = "text", placeholder, readOnly, as = "input", options, required }) {
  const style = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none",
    background: readOnly ? C.lighter : C.white, color: C.text,
    boxSizing: "border-box", fontFamily: "inherit",
  };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
      {as === "select" ? (
        <select style={style} value={value} onChange={onChange} disabled={readOnly}>
          <option value="">-- Select --</option>
          {options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : as === "textarea" ? (
        <textarea style={{ ...style, minHeight: 90, resize: "vertical" }} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly} />
      ) : (
        <input style={style} type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly} />
      )}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    improving: { label: "Improving", color: "#1b5e20", bg: "#e8f5e9", icon: <ArrowUp size={13}/> },
    stable: { label: "Stable", color: "#b5622a", bg: "#fdf5ec", icon: <Minus size={13}/> },
    declining: { label: "Declining", color: "#a04a52", bg: "#fdf0f1", icon: <ArrowDown size={13}/> },
  };
  const s = map[status] || map.stable;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: s.color, background: s.bg }}>
      {s.icon} {s.label}
    </span>
  );
}

function getStatus(grades) {
  if (!grades || grades.length < 2) return "stable";
  const recent = grades.slice(-3).map(g => g.avg);
  const diff = recent[recent.length - 1] - recent[0];
  if (diff >= 2) return "improving";
  if (diff <= -2) return "declining";
  return "stable";
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "20px 24px", ...style }}>
      {children}
    </div>
  );
}

function StatCard({ icon, label, value, color = C.primary }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: C.light, display: "flex", alignItems: "center", justifyContent: "center", color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{value}</div>
        <div style={{ fontSize: 12, color: C.textMuted }}>{label}</div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ items, active, onNav, user, onLogout, collapsed, onToggle }) {
  return (
    <div style={{
      width: collapsed ? 64 : 230, minHeight: "100vh", background: "#1a4d1f",
      display: "flex", flexDirection: "column", transition: "width 0.3s",
      position: "fixed", left: 0, top: 0, zIndex: 100, overflow: "hidden"
    }}>
      {/* Logo area */}
      <div style={{ padding: "18px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
        <Logo size={36} />
        {!collapsed && <span style={{ color: "white", fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px" }}>LearnTrack</span>}
        <button onClick={onToggle} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: 4 }}>
          {collapsed ? <ChevronRight size={16}/> : <Menu size={16}/>}
        </button>
      </div>
      {/* User */}
      {!collapsed && (
        <div style={{ padding: "14px 16px", borderBottom: `1px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14, flexShrink: 0, overflow: "hidden" }}>
            {user?.photo
              ? <img src={user.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : user?.name?.charAt(0)
            }
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "white", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ color: C.accent2, fontSize: 11 }}>{user?.role === "student" ? `NISN: ${user?.nisn}` : user?.subject}</div>
          </div>
        </div>
      )}
      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {items.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: collapsed ? "10px 14px" : "10px 12px", borderRadius: 10, marginBottom: 2,
              background: active === item.id ? "rgba(255,255,255,0.15)" : "transparent",
              border: "none", cursor: "pointer", color: active === item.id ? "white" : "rgba(255,255,255,0.65)",
              fontSize: 13, fontWeight: active === item.id ? 600 : 400, textAlign: "left",
              transition: "all 0.15s",
            }}
            title={collapsed ? item.label : ""}
          >
            <span style={{ flexShrink: 0, display: "flex", alignItems: "center", color: active === item.id ? C.accent2 : "rgba(255,255,255,0.55)" }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && active === item.id && <ChevronRight size={13} style={{ marginLeft: "auto" }} />}
          </button>
        ))}
      </nav>
      {/* Logout */}
      <div style={{ padding: "10px 8px", borderTop: `1px solid rgba(255,255,255,0.08)` }}>
        <button onClick={onLogout}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 14px" : "10px 12px", borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", fontSize: 13 }}
          title={collapsed ? "Logout" : ""}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}

// ── Public Nav ────────────────────────────────────────────────────────────────
function PublicNav({ page, onNav }) {
  return (
    <nav style={{ background: C.white, position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", height: 64 }}>
        <button onClick={() => onNav("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
          <Logo size={32} />
          <span style={{ color: C.dark, fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>LearnTrack</span>
        </button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}>
          {["home","about"].map(p => (
            <button key={p} onClick={() => onNav(p)}
              style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: page === p ? C.light : "transparent", color: page === p ? C.primary : C.textMuted, transition: "all 0.15s" }}>
              {p === "home" ? "Home" : "About"}
            </button>
          ))}
          <button onClick={() => onNav("login")}
            style={{ padding: "9px 22px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, background: C.primary, color: "white", marginLeft: 8, transition: "all 0.15s" }}>
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Animated Counter Component ────────────────────────────────────────────────
function useCounter(target, duration = 1600, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = null;
    let raf;
    const timer = setTimeout(() => {
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return count;
}

function AnimatedStats() {
  const semesters = useCounter(6, 1400, 200);
  const statuses  = useCounter(3, 1000, 500);
  const percent   = useCounter(100, 1800, 300);

  const stats = [
    { value: semesters, suffix: "",  label: "Semesters Tracked" },
    { value: statuses,  suffix: "",  label: "Progress Statuses" },
    { value: percent,   suffix: "%", label: "Data Driven" },
  ];

  return (
    <div style={{ display: "flex", gap: 52, flexWrap: "wrap" }}>
      {stats.map(({ value, suffix, label }) => (
        <div key={label}>
          <div style={{ color: "white", fontSize: 40, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1, fontVariantNumeric: "tabular-nums", minWidth: 72 }}>
            {value}{suffix}
          </div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 4 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC PAGES
// ══════════════════════════════════════════════════════════════════════════════
function HomePage({ onNav }) {
  const [activeFeature, setActiveFeature] = useState(null);
  const [animating, setAnimating] = useState(null);

  const features = [
    { id: "track", icon: <TrendingUp size={26}/>, title: "Track Progress", desc: "Visualize learning growth across all 6 semesters with beautiful grade charts that show exactly where you stand.", color: "#2d7a35" },
    { id: "status", icon: <Activity size={26}/>, title: "Smart Status", desc: "LearnTrack automatically determines if a student is Improving, Stable, or Declining based on real grade data.", color: "#2a6e7a" },
    { id: "reflect", icon: <BookOpen size={26}/>, title: "Reflections", desc: "Students write semester reflections and set goals. Teachers respond with personalized guidance and encouragement.", color: "#6a5aad" },
    { id: "class", icon: <Users size={26}/>, title: "Class Management", desc: "Teachers upload grade data by class and semester, monitor all students, and manage the whole class from one place.", color: "#ad5a5a" },
    { id: "analytics", icon: <BarChart2 size={26}/>, title: "Visual Analytics", desc: "Rich, interactive charts transform raw grade numbers into clear visual stories about every student's journey.", color: "#7a6a2d" },
    { id: "achieve", icon: <Award size={26}/>, title: "Achievement Focus", desc: "Set clear targets each semester and celebrate milestones that keep students motivated and on track to succeed.", color: "#2d6a7a" },
  ];

  const handleFeatureClick = (id) => {
    setAnimating(id);
    setActiveFeature(activeFeature === id ? null : id);
    setTimeout(() => setAnimating(null), 350);
  };

  const crosshatchStyle = {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
  };

  const plusPatternStyle = {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
    backgroundPosition: "20px 20px",
  };

  return (
    <div style={{ fontFamily: "inherit" }}>
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.85) translateY(8px); opacity: 0; }
          60% { transform: scale(1.03) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes featurePress {
          0% { transform: scale(1); }
          40% { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        .feat-card { transition: transform 0.18s ease, box-shadow 0.18s ease; cursor: pointer; }
        .feat-card:hover { transform: translateY(-3px); }
        .feat-pressing { animation: featurePress 0.32s ease forwards; }
        .feat-detail {
          animation: popIn 0.32s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .pill-btn { transition: all 0.18s ease; }
        .pill-btn:hover { transform: translateY(-1px); opacity: 0.92; }
        .pill-btn:active { transform: scale(0.97); }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background: C.heroGreen, minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={crosshatchStyle} />
        <div style={plusPatternStyle} />
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "10%", right: "8%", width: 340, height: 340, borderRadius: "50%", background: "rgba(90,173,106,0.18)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "25%", width: 200, height: 200, borderRadius: "50%", background: "rgba(125,217,143,0.10)", filter: "blur(40px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px", position: "relative", zIndex: 1, width: "100%" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "6px 16px 6px 8px", marginBottom: 32 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent2 }} />
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600, letterSpacing: "0.02em" }}>Academic Progress Visualization Platform</span>
          </div>

          {/* Headline */}
          <h1 style={{ color: "white", fontSize: 64, fontWeight: 900, lineHeight: 1.05, margin: "0 0 10px", letterSpacing: "-2px", maxWidth: 700 }}>
            Track Every Step of Your
          </h1>
          <h1 style={{ color: C.accent2, fontSize: 64, fontWeight: 900, lineHeight: 1.05, margin: "0 0 28px", letterSpacing: "-2px" }}>
            Learning Journey
          </h1>

          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 18, lineHeight: 1.7, maxWidth: 520, marginBottom: 44 }}>
            LearnTrack helps students visualize their academic progress across all semesters, identify growth patterns, and reflect on their learning journey.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button className="pill-btn" onClick={() => onNav("login")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 999, border: "none", background: C.white, color: C.primary, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Get Started <ChevronRight size={16}/>
            </button>
            <button className="pill-btn" onClick={() => onNav("about")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 999, border: "2px solid rgba(255,255,255,0.4)", background: "transparent", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Learn More
            </button>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", margin: "52px 0 36px", maxWidth: 860 }} />

          {/* Stats — animated counters */}
          <AnimatedStats />
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ background: C.lighter, padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: C.light, color: C.primary, borderRadius: 999, padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>Features</div>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: C.text, margin: "0 0 12px", letterSpacing: "-1px" }}>Everything You Need</h2>
            <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 480, margin: 0 }}>Click any feature to learn more about how LearnTrack works for you.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {features.map(f => (
              <div key={f.id}>
                <div
                  className={`feat-card${animating === f.id ? " feat-pressing" : ""}`}
                  onClick={() => handleFeatureClick(f.id)}
                  style={{
                    background: activeFeature === f.id ? C.white : C.white,
                    borderRadius: 16, border: `2px solid ${activeFeature === f.id ? f.color : C.border}`,
                    padding: "24px 22px", position: "relative",
                    boxShadow: activeFeature === f.id ? `0 8px 32px ${f.color}22` : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: activeFeature === f.id ? 0 : 0 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, flexShrink: 0 }}>
                      {f.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{f.title}</div>
                      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Click to explore</div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${activeFeature === f.id ? f.color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: activeFeature === f.id ? f.color : C.border, transition: "all 0.2s", transform: activeFeature === f.id ? "rotate(90deg)" : "rotate(0deg)" }}>
                      <ChevronRight size={13}/>
                    </div>
                  </div>
                </div>

                {/* Pop-up detail panel */}
                {activeFeature === f.id && (
                  <div className="feat-detail" style={{ background: C.white, borderRadius: 14, border: `2px solid ${f.color}`, borderTop: "none", borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: "18px 22px 22px", marginTop: -2, boxShadow: `0 8px 32px ${f.color}18` }}>
                    <div style={{ width: 32, height: 3, borderRadius: 2, background: `${f.color}40`, marginBottom: 14 }} />
                    <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>{f.desc}</p>
                    <button onClick={(e) => { e.stopPropagation(); onNav("login"); }}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 999, border: "none", background: f.color, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      Try it now <ChevronRight size={13}/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: C.heroGreen, position: "relative", overflow: "hidden", padding: "80px 48px", textAlign: "center" }}>
        <div style={crosshatchStyle} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ color: "white", fontSize: 40, fontWeight: 900, letterSpacing: "-1px", marginBottom: 14 }}>Ready to Start Tracking?</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>Join students and teachers already using LearnTrack to visualize academic growth.</p>
          <button className="pill-btn" onClick={() => onNav("login")}
            style={{ padding: "14px 36px", borderRadius: 999, border: "none", background: C.white, color: C.primary, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Login Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: C.darker, color: "rgba(255,255,255,0.45)", textAlign: "center", padding: "22px", fontSize: 13 }}>
        © 2025 LearnTrack — Empowering every learner.
      </footer>
    </div>
  );
}

function AboutPage({ onNav }) {
  const [activeRole, setActiveRole] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [animRole, setAnimRole] = useState(null);
  const [animStep, setAnimStep] = useState(null);

  const crosshatchStyle = {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
  };

  const roles = [
    {
      id: "students", label: "For Students", icon: <GraduationCap size={26}/>, color: "#2d7a35",
      summary: "Your personal academic progress dashboard.",
      details: [
        { icon: <TrendingUp size={16}/>, text: "View grade progress charts across all 6 semesters" },
        { icon: <Activity size={16}/>, text: "See your auto-calculated status: Improving, Stable, or Declining" },
        { icon: <BookOpen size={16}/>, text: "Write semester reflections and set goals for next semester" },
        { icon: <Target size={16}/>, text: "Receive teacher notes and personalized feedback" },
        { icon: <User size={16}/>, text: "Manage your student profile and personal information" },
      ]
    },
    {
      id: "teachers", label: "For Teachers", icon: <BookCheck size={26}/>, color: "#2a6e7a",
      summary: "Full class management and monitoring tools.",
      details: [
        { icon: <Upload size={16}/>, text: "Upload grade data by class and semester via Excel or manual entry" },
        { icon: <Users size={16}/>, text: "Monitor all students' progress from a single dashboard" },
        { icon: <BarChart2 size={16}/>, text: "View individual student grade charts when needed" },
        { icon: <MessageSquare size={16}/>, text: "Read student reflections and respond with guidance" },
        { icon: <User size={16}/>, text: "Manage your teacher profile and class information" },
      ]
    },
  ];

  const steps = [
    { n: "01", title: "Upload Grade Data", desc: "Teacher uploads semester grades for their class via an Excel file or by entering them manually in the system.", color: "#2d7a35" },
    { n: "02", title: "Auto-Calculate Averages", desc: "LearnTrack instantly calculates subject averages and plots them on a 6-semester line chart for clear visualization.", color: "#2a6e7a" },
    { n: "03", title: "Determine Progress Status", desc: "The system automatically labels each student's trend as Improving, Stable, or Declining based on real grade data.", color: "#6a5aad" },
    { n: "04", title: "Students View & Reflect", desc: "Students log in to view their charts, write semester reflections, and set clear goals for the next semester.", color: "#ad7a2d" },
    { n: "05", title: "Teachers Respond", desc: "Teachers review student reflections and add personalized notes, encouragement, and guidance to each student.", color: "#ad5a5a" },
  ];

  const handleRoleClick = (id) => {
    setAnimRole(id);
    setActiveRole(prev => prev === id ? null : id);
    setTimeout(() => setAnimRole(null), 320);
  };

  const handleStepClick = (n) => {
    setAnimStep(n);
    setActiveStep(prev => prev === n ? null : n);
    setTimeout(() => setAnimStep(null), 320);
  };

  return (
    <div>
      <style>{`
        @keyframes popInAbout {
          0% { transform: scale(0.88) translateY(6px); opacity: 0; }
          60% { transform: scale(1.02) translateY(-1px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes pressAnim { 0%{transform:scale(1)} 40%{transform:scale(0.96)} 100%{transform:scale(1)} }
        .about-card { transition: transform 0.18s ease; cursor: pointer; }
        .about-card:hover { transform: translateY(-2px); }
        .about-pressing { animation: pressAnim 0.3s ease forwards; }
        .about-detail { animation: popInAbout 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .step-card { transition: transform 0.18s ease; cursor: pointer; }
        .step-card:hover { transform: translateY(-2px); }
      `}</style>

      {/* Hero banner */}
      <div style={{ background: C.heroGreen, position: "relative", overflow: "hidden", padding: "72px 48px" }}>
        <div style={crosshatchStyle} />
        <div style={{ position: "absolute", top: "20%", right: "10%", width: 280, height: 280, borderRadius: "50%", background: "rgba(90,173,106,0.15)", filter: "blur(50px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "5px 16px 5px 8px", marginBottom: 24 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent2 }} />
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>About LearnTrack</span>
          </div>
          <h1 style={{ color: "white", fontSize: 52, fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.05, margin: "0 0 16px", maxWidth: 640 }}>
            Built to visualize every student's journey
          </h1>
          <p style={{ color: "rgba(255,255,255,0.70)", fontSize: 17, lineHeight: 1.7, maxWidth: 520, margin: 0 }}>
            LearnTrack is a digital platform designed to monitor and visualize academic progress across every semester of a student's school life.
          </p>
        </div>
      </div>

      <div style={{ background: C.lighter, padding: "72px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>

          {/* ── WHO IS IT FOR ── */}
          <div style={{ marginBottom: 72 }}>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: C.light, color: C.primary, borderRadius: 999, padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>Who It's For</div>
              <h2 style={{ fontSize: 36, fontWeight: 900, color: C.text, margin: 0, letterSpacing: "-0.8px" }}>Click a role to explore</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {roles.map(r => (
                <div key={r.id}>
                  <div
                    className={`about-card${animRole === r.id ? " about-pressing" : ""}`}
                    onClick={() => handleRoleClick(r.id)}
                    style={{ background: C.white, borderRadius: 16, border: `2px solid ${activeRole === r.id ? r.color : C.border}`, padding: "22px 24px", boxShadow: activeRole === r.id ? `0 8px 28px ${r.color}20` : "none" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${r.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: r.color, flexShrink: 0 }}>{r.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{r.label}</div>
                        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{r.summary}</div>
                      </div>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${activeRole === r.id ? r.color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: activeRole === r.id ? r.color : C.border, transition: "all 0.2s", transform: activeRole === r.id ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}>
                        <ChevronRight size={13}/>
                      </div>
                    </div>
                  </div>

                  {activeRole === r.id && (
                    <div className="about-detail" style={{ background: C.white, borderRadius: 14, border: `2px solid ${r.color}`, borderTop: "none", borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: "20px 24px 24px", marginTop: -2, boxShadow: `0 10px 30px ${r.color}15` }}>
                      <div style={{ width: 28, height: 3, borderRadius: 2, background: `${r.color}35`, marginBottom: 16 }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {r.details.map((d, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${r.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: r.color, flexShrink: 0, marginTop: 1 }}>{d.icon}</div>
                            <span style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, paddingTop: 4 }}>{d.text}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); onNav && onNav("login"); }}
                        style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 999, border: "none", background: r.color, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                        Get started <ChevronRight size={13}/>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── HOW IT WORKS ── */}
          <div>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: C.light, color: C.primary, borderRadius: 999, padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>How It Works</div>
              <h2 style={{ fontSize: 36, fontWeight: 900, color: C.text, margin: 0, letterSpacing: "-0.8px" }}>Five simple steps</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {steps.map(s => (
                <div key={s.n}>
                  <div
                    className={`step-card${animStep === s.n ? " about-pressing" : ""}`}
                    onClick={() => handleStepClick(s.n)}
                    style={{ background: C.white, borderRadius: 16, border: `2px solid ${activeStep === s.n ? s.color : C.border}`, padding: "18px 24px", display: "flex", alignItems: "center", gap: 18, boxShadow: activeStep === s.n ? `0 6px 24px ${s.color}18` : "none" }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: activeStep === s.n ? s.color : `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: activeStep === s.n ? "white" : s.color, fontSize: 14, fontWeight: 800, flexShrink: 0, transition: "all 0.22s" }}>{s.n}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Click to learn more</div>
                    </div>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${activeStep === s.n ? s.color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: activeStep === s.n ? s.color : C.border, transition: "all 0.2s", transform: activeStep === s.n ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}>
                      <ChevronRight size={13}/>
                    </div>
                  </div>

                  {activeStep === s.n && (
                    <div className="about-detail" style={{ background: C.white, borderRadius: 14, border: `2px solid ${s.color}`, borderTop: "none", borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: "18px 24px 22px", marginTop: -2, boxShadow: `0 8px 24px ${s.color}12` }}>
                      <div style={{ width: 28, height: 3, borderRadius: 2, background: `${s.color}35`, marginBottom: 14 }} />
                      <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: C.darker, color: "rgba(255,255,255,0.45)", textAlign: "center", padding: "22px", fontSize: 13 }}>
        © 2025 LearnTrack — Empowering every learner.
      </footer>
    </div>
  );
}

// ── Login Page ─────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [nisn, setNisn] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [savedInfo, setSavedInfo] = useState(null);
  const [showSavedBanner, setShowSavedBanner] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("learntrack_saved_login");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedInfo(parsed);
        setRole(parsed.role || "student");
        if (parsed.role === "student") setNisn(parsed.identifier || "");
        else setUsername(parsed.identifier || "");
        setPassword(parsed.password || "");
        setRememberMe(true);
      }
    } catch (e) {}
  }, []);

  const handleLogin = () => {
    setError("");
    let found = null;
    if (role === "student") {
      found = mockStudents.find(s => s.nisn === nisn && s.password === password);
      if (!found) { setError("Invalid NISN or password. Try: 0012345678 / siswa123"); return; }
    } else {
      found = mockTeachers.find(t => t.username === username && t.password === password);
      if (!found) { setError("Invalid username or password. Try: budi.santoso / guru123"); return; }
    }
    if (rememberMe) {
      localStorage.setItem("learntrack_saved_login", JSON.stringify({
        role, identifier: role === "student" ? nisn : username, password
      }));
      setShowSavedBanner(true);
      setTimeout(() => setShowSavedBanner(false), 2000);
    } else {
      localStorage.removeItem("learntrack_saved_login");
    }
    onLogin({ ...found, role });
  };

  const clearSaved = () => {
    localStorage.removeItem("learntrack_saved_login");
    setSavedInfo(null);
    setNisn(""); setUsername(""); setPassword("");
    setRememberMe(false);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none",
    background: C.white, color: C.text, boxSizing: "border-box", fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, #eef6f0 0%, #d4e9d8 100%)`, padding: 24, position: "relative", overflow: "hidden" }}>
      {/* bg crosshatch */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "40px 40px", opacity: 0.35, pointerEvents: "none" }} />

      <div style={{ background: "white", borderRadius: 22, border: `1px solid ${C.border}`, padding: "40px 40px", width: "100%", maxWidth: 420, boxShadow: "0 12px 48px rgba(27,77,30,0.10)", position: "relative" }}>

        {/* Saved credential banner */}
        {savedInfo && (
          <div style={{ background: C.light, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle size={15} style={{ color: C.primary, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>
              Saved login found for <strong style={{ color: C.dark }}>{savedInfo.role === "student" ? savedInfo.identifier : savedInfo.identifier}</strong>
            </div>
            <button onClick={clearSaved} style={{ background: "none", border: "none", cursor: "pointer", color: C.danger, fontSize: 11, fontWeight: 600, flexShrink: 0, padding: "2px 6px" }}>Clear</button>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <Logo size={52} />
          <h2 style={{ fontSize: 26, fontWeight: 800, color: C.dark, margin: "12px 0 4px" }}>Welcome Back</h2>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Sign in to your LearnTrack account</p>
        </div>

        {/* Role Toggle */}
        <div style={{ display: "flex", background: C.light, borderRadius: 12, padding: 4, marginBottom: 22 }}>
          {["student","teacher"].map(r => (
            <button key={r} onClick={() => { setRole(r); setError(""); }}
              style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: role === r ? C.primary : "transparent", color: role === r ? "white" : C.textMuted, transition: "all 0.2s" }}>
              {r === "student" ? "Student" : "Teacher"}
            </button>
          ))}
        </div>

        {/* ID Field */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {role === "student" ? "NISN" : "Username"}
          </label>
          <input
            style={inputStyle}
            value={role === "student" ? nisn : username}
            onChange={e => role === "student" ? setNisn(e.target.value) : setUsername(e.target.value)}
            placeholder={role === "student" ? "Enter your NISN" : "Enter your username"}
          />
        </div>

        {/* Password Field with show/hide */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              style={{ ...inputStyle, paddingRight: 42 }}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter your password"
            />
            <button
              onClick={() => setShowPassword(p => !p)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.textMuted, display: "flex", alignItems: "center", padding: 2 }}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div
            onClick={() => setRememberMe(p => !p)}
            style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${rememberMe ? C.primary : C.border}`, background: rememberMe ? C.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.18s" }}
          >
            {rememberMe && <CheckCircle size={11} style={{ color: "white" }} />}
          </div>
          <span style={{ fontSize: 13, color: C.textMuted, cursor: "pointer", userSelect: "none" }} onClick={() => setRememberMe(p => !p)}>
            Remember my login info
          </span>
          {savedInfo && (
            <span style={{ marginLeft: "auto", fontSize: 11, color: C.primary, fontWeight: 600 }}>Saved</span>
          )}
        </div>

        {error && (
          <div style={{ background: "#fdf0f1", color: C.danger, padding: "10px 14px", borderRadius: 9, fontSize: 13, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }}/> {error}
          </div>
        )}

        <button onClick={handleLogin}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 12, border: "none", background: C.primary, color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.18s" }}>
          Sign In <ChevronRight size={16}/>
        </button>

        <div style={{ textAlign: "center", marginTop: 18, padding: "14px", background: C.lighter, borderRadius: 10, fontSize: 12, color: C.textMuted, lineHeight: 1.9 }}>
          <strong style={{ color: C.dark }}>Demo Credentials</strong><br/>
          Student: <code style={{ background: C.light, padding: "1px 5px", borderRadius: 4 }}>0012345678</code> / <code style={{ background: C.light, padding: "1px 5px", borderRadius: 4 }}>siswa123</code><br/>
          Teacher: <code style={{ background: C.light, padding: "1px 5px", borderRadius: 4 }}>budi.santoso</code> / <code style={{ background: C.light, padding: "1px 5px", borderRadius: 4 }}>guru123</code>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT PAGES
// ══════════════════════════════════════════════════════════════════════════════
function StudentDashboard({ user }) {
  const status = getStatus(user.grades);
  const lastGrade = user.grades[user.grades.length - 1];
  const prevGrade = user.grades[user.grades.length - 2];
  const change = lastGrade && prevGrade ? (lastGrade.avg - prevGrade.avg).toFixed(1) : 0;
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, marginBottom: 6 }}>Dashboard</h1>
      <p style={{ color: C.textMuted, marginBottom: 28 }}>Welcome back, {user.name.split(" ")[0]}! Here's your learning summary.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon={<TrendingUp size={22}/>} label="Latest Average" value={lastGrade?.avg?.toFixed(1) || "—"} />
        <StatCard icon={<Activity size={22}/>} label="Semesters Tracked" value={user.grades.length} />
        <StatCard icon={<Target size={22}/>} label="Reflections" value={user.reflections.length} />
        <StatCard icon={<Award size={22}/>} label="Progress Status" value={<StatusBadge status={status}/>} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16 }}>Grade Trend (All Semesters)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={user.grades}>
              <defs>
                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.primary} stopOpacity={0.18}/>
                  <stop offset="95%" stopColor={C.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="semester" tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="avg" stroke={C.primary} strokeWidth={2.5} fill="url(#colorAvg)" dot={{ r: 4, fill: C.primary }} name="Average" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16 }}>This Semester</h3>
          {lastGrade && Object.entries({ Math: lastGrade.math, Science: lastGrade.science, Indonesian: lastGrade.indonesian, English: lastGrade.english }).map(([k, v]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: C.textMuted }}>{k}</span>
                <span style={{ fontWeight: 700, color: C.text }}>{v}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: C.light }}>
                <div style={{ height: "100%", borderRadius: 3, width: `${v}%`, background: v >= 85 ? C.primary : v >= 75 ? C.accent : C.warning }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function StudentGradeChart({ user }) {
  const [view, setView] = useState("avg");
  const subjects = { avg: "Average", math: "Mathematics", science: "Science", indonesian: "Indonesian", english: "English" };
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, marginBottom: 6 }}>Grade Progress Chart</h1>
      <p style={{ color: C.textMuted, marginBottom: 24 }}>Your academic performance across all semesters.</p>
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {Object.entries(subjects).map(([k, v]) => (
            <button key={k} onClick={() => setView(k)}
              style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${view === k ? C.primary : C.border}`, background: view === k ? C.primary : "white", color: view === k ? "white" : C.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {v}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={user.grades}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            {view === "avg" ? (
              <Line type="monotone" dataKey="avg" stroke={C.primary} strokeWidth={3} dot={{ r: 6, fill: C.primary }} name="Average" />
            ) : (
              <Line type="monotone" dataKey={view} stroke={C.accent} strokeWidth={3} dot={{ r: 6, fill: C.accent }} name={subjects[view]} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16 }}>All Subjects Overview</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={user.grades}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="semester" tick={{ fontSize: 10 }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="math" stroke="#2d7a2f" strokeWidth={2} dot={{ r: 3 }} name="Math" />
            <Line type="monotone" dataKey="science" stroke="#43a047" strokeWidth={2} dot={{ r: 3 }} name="Science" />
            <Line type="monotone" dataKey="indonesian" stroke="#66bb6a" strokeWidth={2} dot={{ r: 3 }} name="Indonesian" />
            <Line type="monotone" dataKey="english" stroke="#a5d6a7" strokeWidth={2} dot={{ r: 3 }} name="English" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function StudentStatus({ user }) {
  const status = getStatus(user.grades);
  const last = user.grades[user.grades.length - 1];
  const first = user.grades[0];
  const overallChange = last && first ? (last.avg - first.avg).toFixed(1) : 0;
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, marginBottom: 6 }}>Learning Status</h1>
      <p style={{ color: C.textMuted, marginBottom: 24 }}>Auto-calculated based on your recent grade trend.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card style={{ textAlign: "center", padding: "36px 24px" }}>
          <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Status</div>
          <div style={{ fontSize: 36 }}><StatusBadge status={status} /></div>
          <p style={{ color: C.textMuted, fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
            {status === "improving" && "Your grades show a consistent upward trend. Keep up the great work!"}
            {status === "stable" && "Your grades are consistent. Try to push for more improvement!"}
            {status === "declining" && "Your grades show a downward trend. Let's work on a study plan!"}
          </p>
        </Card>
        <Card style={{ textAlign: "center", padding: "36px 24px" }}>
          <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Overall Change</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: Number(overallChange) >= 0 ? C.primary : C.danger }}>
            {Number(overallChange) >= 0 ? "+" : ""}{overallChange}
          </div>
          <p style={{ color: C.textMuted, fontSize: 13, marginTop: 8 }}>Points from Semester 1 to latest</p>
        </Card>
      </div>
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16 }}>Semester-by-Semester Analysis</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {user.grades.map((g, i) => {
            const prev = user.grades[i - 1];
            const diff = prev ? (g.avg - prev.avg).toFixed(1) : null;
            const st = !prev ? null : Number(diff) >= 2 ? "improving" : Number(diff) <= -2 ? "declining" : "stable";
            return (
              <div key={g.semester} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", borderRadius: 10, background: C.lighter, border: `1px solid ${C.border}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.primary }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{g.semester}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Average: {g.avg.toFixed(1)}</div>
                </div>
                {diff !== null && <div style={{ fontSize: 13, fontWeight: 700, color: Number(diff) >= 0 ? C.primary : C.danger }}>{Number(diff) >= 0 ? "+" : ""}{diff}</div>}
                {st && <StatusBadge status={st} />}
                {!st && <span style={{ fontSize: 12, color: C.textMuted }}>Baseline</span>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function StudentReflection({ user, onUpdate }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ semester: "", text: "", target: "" });
  const [showForm, setShowForm] = useState(false);

  const semOptions = user.grades.map(g => g.semester);

  const save = () => {
    if (!form.semester || !form.text) return;
    const updated = [...user.reflections];
    const idx = updated.findIndex(r => r.semester === form.semester);
    if (idx >= 0) updated[idx] = { ...updated[idx], text: form.text, target: form.target };
    else updated.push({ semester: form.semester, text: form.text, target: form.target, teacherNote: "" });
    onUpdate({ ...user, reflections: updated });
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, marginBottom: 6 }}>Learning Reflections</h1>
          <p style={{ color: C.textMuted }}>Write your learning reflection and set targets for each semester.</p>
        </div>
        <Btn onClick={() => { setForm({ semester: "", text: "", target: "" }); setShowForm(true); setEditing(null); }}>
          + Add Reflection
        </Btn>
      </div>
      {showForm && (
        <Card style={{ marginBottom: 20, border: `2px solid ${C.primary}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16 }}>New Reflection</h3>
          <Input label="Semester" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} as="select" options={semOptions} />
          <Input label="Reflection" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} as="textarea" placeholder="Write your reflection on this semester's learning..." />
          <Input label="Target for Next Semester" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} placeholder="What do you want to achieve next semester?" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={save}><Save size={15}/> Save</Btn>
            <Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}
      {user.reflections.length === 0 && !showForm && (
        <Card style={{ textAlign: "center", padding: "50px 24px" }}>
          <BookOpen size={48} style={{ color: C.border, marginBottom: 14 }} />
          <p style={{ color: C.textMuted }}>No reflections yet. Start by adding your first reflection!</p>
        </Card>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {user.reflections.map((r, i) => (
          <Card key={r.semester}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ background: C.light, color: C.dark, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{r.semester}</span>
              <Btn variant="ghost" onClick={() => { setForm({ semester: r.semester, text: r.text, target: r.target }); setEditing(i); setShowForm(true); }}>
                <Edit3 size={14}/> Edit
              </Btn>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>My Reflection</div>
              <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{r.text}</p>
            </div>
            {r.target && (
              <div style={{ marginBottom: 14, padding: "12px 14px", background: C.lighter, borderRadius: 8, borderLeft: `3px solid ${C.primary}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 4 }}>Target</div>
                <p style={{ color: C.text, fontSize: 13, margin: 0 }}>{r.target}</p>
              </div>
            )}
            {r.teacherNote && (
              <div style={{ padding: "12px 14px", background: "#edf3fb", borderRadius: 8, borderLeft: "3px solid #4a7dab" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#4a7dab", marginBottom: 4 }}>Teacher's Note</div>
                <p style={{ color: "#2d4a6b", fontSize: 13, margin: 0 }}>{r.teacherNote}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ user, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [photoPreview, setPhotoPreview] = useState(user.photo || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handlePhotoFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPhotoPreview(dataUrl);
      setForm(prev => ({ ...prev, photo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoChange = (e) => handlePhotoFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handlePhotoFile(e.dataTransfer.files[0]);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setForm(prev => ({ ...prev, photo: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const save = () => { onUpdate(form); setEditing(false); };

  const isStudent = user.role === "student";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, marginBottom: 6 }}>{isStudent ? "Student" : "Teacher"} Profile</h1>
          <p style={{ color: C.textMuted }}>View and edit your profile information.</p>
        </div>
        {!editing ? (
          <Btn onClick={() => setEditing(true)}><Edit3 size={15}/> Edit Profile</Btn>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={save}><Save size={15}/> Save Changes</Btn>
            <Btn variant="outline" onClick={() => { setForm({ ...user }); setPhotoPreview(user.photo || null); setEditing(false); }}>Cancel</Btn>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        {/* ── Photo Card ── */}
        <Card style={{ textAlign: "center", padding: "28px 20px" }}>
          {/* Avatar */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.border}`, display: "block" }}
              />
            ) : (
              <div style={{ width: 100, height: 100, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, color: "white", margin: "0 auto" }}>
                {form.name?.charAt(0)}
              </div>
            )}
            {/* Camera button overlay — only in edit mode */}
            {editing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ position: "absolute", bottom: 2, right: 2, width: 30, height: 30, borderRadius: "50%", background: C.primary, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}
                title="Change photo"
              >
                <Edit3 size={13}/>
              </button>
            )}
          </div>

          <div style={{ fontSize: 17, fontWeight: 700, color: C.dark }}>{form.name}</div>
          {isStudent ? (
            <>
              <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>NISN: {form.nisn}</div>
              <div style={{ marginTop: 10 }}><StatusBadge status={getStatus(user.grades)} /></div>
            </>
          ) : (
            <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>NIP: {form.nip}</div>
          )}

          {/* Photo upload area — only in edit mode */}
          {editing && (
            <div style={{ marginTop: 20 }}>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? C.primary : C.border}`,
                  borderRadius: 12, padding: "16px 12px", cursor: "pointer",
                  background: dragOver ? C.light : C.lighter,
                  transition: "all 0.18s",
                }}
              >
                <Upload size={20} style={{ color: C.textMuted, marginBottom: 6 }} />
                <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
                  Click or drag photo here<br/>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>JPG, PNG — max 5MB</span>
                </div>
              </div>
              {photoPreview && (
                <button
                  onClick={removePhoto}
                  style={{ marginTop: 10, background: "none", border: `1px solid ${C.danger}`, color: C.danger, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%" }}
                >
                  Remove photo
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
            </div>
          )}
        </Card>

        {/* ── Info Card ── */}
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 18 }}>Personal Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Full Name" value={form.name || ""} onChange={f("name")} readOnly={!editing} />
            <Input label="Gender" value={form.gender || ""} onChange={f("gender")} as={editing ? "select" : "input"} options={["Male","Female"]} readOnly={!editing} />
            {isStudent ? (
              <>
                <Input label="Date of Birth" value={form.birthDate || ""} onChange={f("birthDate")} type="date" readOnly={!editing} />
                <Input label="NISN" value={form.nisn || ""} readOnly />
                <Input label="Class" value={form.class || ""} onChange={f("class")} as={editing ? "select" : "input"} options={classOptions} readOnly={!editing} />
                <Input label="School Year" value={form.schoolYear || ""} onChange={f("schoolYear")} as={editing ? "select" : "input"} options={schoolYearOptions} readOnly={!editing} />
              </>
            ) : (
              <>
                <Input label="NIP" value={form.nip || ""} readOnly />
                <Input label="Subject" value={form.subject || ""} onChange={f("subject")} as={editing ? "select" : "input"} options={subjectOptions} readOnly={!editing} />
                <Input label="Class Handled" value={form.classHandled || ""} onChange={f("classHandled")} as={editing ? "select" : "input"} options={classOptions} readOnly={!editing} />
                <Input label="School Year" value={form.schoolYear || ""} onChange={f("schoolYear")} as={editing ? "select" : "input"} options={schoolYearOptions} readOnly={!editing} />
              </>
            )}
            <Input label="School" value={form.school || ""} onChange={f("school")} readOnly={!editing} />
            {!isStudent && <Input label="Email" value={form.email || ""} onChange={f("email")} readOnly={!editing} />}
            {!isStudent && <Input label="Phone" value={form.phone || ""} onChange={f("phone")} readOnly={!editing} />}
            <div style={{ gridColumn: "1/-1" }}>
              <Input label="Address" value={form.address || ""} onChange={f("address")} readOnly={!editing} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEACHER PAGES
// ══════════════════════════════════════════════════════════════════════════════
function TeacherDashboard({ user, students }) {
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, marginBottom: 6 }}>Teacher Dashboard</h1>
      <p style={{ color: C.textMuted, marginBottom: 28 }}>Welcome, {user.name.split(",")[0]}! Here's your class overview.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon={<Users size={22}/>} label="Total Students" value={students.length} />
        <StatCard icon={<TrendingUp size={22}/>} label="Improving" value={students.filter(s => getStatus(s.grades) === "improving").length} />
        <StatCard icon={<Activity size={22}/>} label="Stable" value={students.filter(s => getStatus(s.grades) === "stable").length} />
        <StatCard icon={<AlertCircle size={22}/>} label="Needs Attention" value={students.filter(s => getStatus(s.grades) === "declining").length} />
      </div>
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 16 }}>Class Overview</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {students.map(s => {
            const last = s.grades[s.grades.length - 1];
            const status = getStatus(s.grades);
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, background: C.lighter, border: `1px solid ${C.border}` }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.primary, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{s.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>Class {s.class} • {s.schoolYear}</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.primary }}>{last?.avg?.toFixed(1)}</div>
                <StatusBadge status={status} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function TeacherStudentData({ students }) {
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, marginBottom: 6 }}>Student Data</h1>
      <p style={{ color: C.textMuted, marginBottom: 24 }}>View all student information and academic records.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {students.map(s => {
          const last = s.grades[s.grades.length - 1];
          return (
            <Card key={s.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>{s.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>NISN: {s.nisn} • Class {s.class} • {s.schoolYear}</div>
                </div>
                <StatusBadge status={getStatus(s.grades)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10 }}>
                {last && Object.entries({ Math: last.math, Science: last.science, Indonesian: last.indonesian, English: last.english }).map(([k, v]) => (
                  <div key={k} style={{ textAlign: "center", padding: "10px", background: C.lighter, borderRadius: 8 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.primary }}>{v}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{k}</div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TeacherUpload({ students, onUpdate }) {
  const [form, setForm] = useState({ studentId: "", class: "", schoolYear: "", semester: "", math: "", science: "", indonesian: "", english: "" });
  const [success, setSuccess] = useState("");
  const f = k => e => setForm({ ...form, [k]: e.target.value });
  const semesterOptions = ["Sem 1 (Grade 10)","Sem 2 (Grade 10)","Sem 1 (Grade 11)","Sem 2 (Grade 11)","Sem 1 (Grade 12)","Sem 2 (Grade 12)"];

  const handleSave = () => {
    if (!form.studentId || !form.semester || !form.math) return;
    const student = students.find(s => s.id === Number(form.studentId));
    if (!student) return;
    const avg = ((Number(form.math) + Number(form.science) + Number(form.indonesian) + Number(form.english)) / 4);
    const newGrade = { semester: form.semester, math: Number(form.math), science: Number(form.science), indonesian: Number(form.indonesian), english: Number(form.english), avg };
    const updated = [...student.grades];
    const idx = updated.findIndex(g => g.semester === form.semester);
    if (idx >= 0) updated[idx] = newGrade;
    else updated.push(newGrade);
    onUpdate(student.id, { ...student, grades: updated });
    setSuccess(`Grades uploaded for ${student.name} — ${form.semester}!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, marginBottom: 6 }}>Upload Grades</h1>
      <p style={{ color: C.textMuted, marginBottom: 24 }}>Enter or update student grade data by class and semester.</p>
      {success && <div style={{ background: C.light, color: C.dark, padding: "12px 16px", borderRadius: 10, marginBottom: 20, fontWeight: 600, fontSize: 14 }}>{success}</div>}
      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 18 }}>Grade Entry</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div style={{ gridColumn: "1/-1", marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Student <span style={{ color: C.danger }}>*</span></label>
            <select value={form.studentId} onChange={f("studentId")} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, background: C.white, color: C.text, fontFamily: "inherit", boxSizing: "border-box" }}>
              <option value="">-- Select Student --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} (Class {s.class})</option>)}
            </select>
          </div>
          <Input label="Class" value={form.class} onChange={f("class")} as="select" options={classOptions} />
          <Input label="School Year" value={form.schoolYear} onChange={f("schoolYear")} as="select" options={schoolYearOptions} />
          <div style={{ gridColumn: "1/-1" }}>
            <Input label="Semester" value={form.semester} onChange={f("semester")} as="select" options={semesterOptions} />
          </div>
          <Input label="Mathematics" value={form.math} onChange={f("math")} type="number" placeholder="0–100" />
          <Input label="Science" value={form.science} onChange={f("science")} type="number" placeholder="0–100" />
          <Input label="Indonesian Language" value={form.indonesian} onChange={f("indonesian")} type="number" placeholder="0–100" />
          <Input label="English" value={form.english} onChange={f("english")} type="number" placeholder="0–100" />
        </div>
        {form.math && form.science && form.indonesian && form.english && (
          <div style={{ padding: "12px 14px", background: C.light, borderRadius: 8, marginBottom: 14, fontSize: 14, fontWeight: 600, color: C.dark }}>
            Calculated Average: {(( Number(form.math) + Number(form.science) + Number(form.indonesian) + Number(form.english)) / 4).toFixed(2)}
          </div>
        )}
        <Btn onClick={handleSave}><Upload size={15}/> Upload Grades</Btn>
      </Card>
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 14 }}>Bulk Upload via Excel</h3>
        <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>Upload an Excel file (.xlsx) with columns: NISN, Name, Class, School Year, Semester, Math, Science, Indonesian, English.</p>
        <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: "30px 20px", textAlign: "center" }}>
          <Upload size={36} style={{ color: C.border, marginBottom: 10 }} />
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>Drag & drop your Excel file here, or</p>
          <Btn style={{ marginTop: 12 }} variant="outline">Browse Files</Btn>
        </div>
      </Card>
    </div>
  );
}

function TeacherProgress({ students }) {
  const [selected, setSelected] = useState(null);
  const student = selected ? students.find(s => s.id === selected) : null;
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, marginBottom: 6 }}>Student Progress</h1>
      <p style={{ color: C.textMuted, marginBottom: 24 }}>View individual student grade progress charts.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        {students.map(s => (
          <button key={s.id} onClick={() => setSelected(selected === s.id ? null : s.id)}
            style={{ padding: "9px 18px", borderRadius: 10, border: `1.5px solid ${selected === s.id ? C.primary : C.border}`, background: selected === s.id ? C.primary : "white", color: selected === s.id ? "white" : C.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {s.name}
          </button>
        ))}
      </div>
      {student ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: C.light, borderRadius: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.primary, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>{student.name.charAt(0)}</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.dark }}>{student.name}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>Class {student.class} • {student.schoolYear}</div>
            </div>
            <StatusBadge status={getStatus(student.grades)} />
          </div>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 16 }}>Grade Progress — {student.name}</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={student.grades}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="semester" tick={{ fontSize: 10 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avg" stroke={C.primary} strokeWidth={3} dot={{ r: 5 }} name="Average" />
                <Line type="monotone" dataKey="math" stroke="#81c784" strokeWidth={1.5} dot={{ r: 3 }} name="Math" strokeDasharray="4 2" />
                <Line type="monotone" dataKey="science" stroke="#4caf50" strokeWidth={1.5} dot={{ r: 3 }} name="Science" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      ) : (
        <Card style={{ textAlign: "center", padding: "50px" }}>
          <BarChart2 size={48} style={{ color: C.border, marginBottom: 14 }} />
          <p style={{ color: C.textMuted }}>Select a student above to view their progress chart.</p>
        </Card>
      )}
    </div>
  );
}

function TeacherReflections({ students, onUpdate }) {
  const [selected, setSelected] = useState(null);
  const [noteForm, setNoteForm] = useState({ semester: "", note: "" });
  const [showNote, setShowNote] = useState(false);
  const student = selected ? students.find(s => s.id === selected) : null;
  const semOptions = student ? student.grades.map(g => g.semester) : [];

  const saveNote = () => {
    if (!noteForm.semester || !noteForm.note || !student) return;
    const updated = [...student.reflections];
    const idx = updated.findIndex(r => r.semester === noteForm.semester);
    if (idx >= 0) updated[idx] = { ...updated[idx], teacherNote: noteForm.note };
    else updated.push({ semester: noteForm.semester, text: "", target: "", teacherNote: noteForm.note });
    onUpdate(student.id, { ...student, reflections: updated });
    setShowNote(false);
    setNoteForm({ semester: "", note: "" });
  };

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: C.dark, marginBottom: 6 }}>Student Reflections</h1>
      <p style={{ color: C.textMuted, marginBottom: 24 }}>View student reflections and add teacher notes.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        {students.map(s => (
          <button key={s.id} onClick={() => { setSelected(selected === s.id ? null : s.id); setShowNote(false); }}
            style={{ padding: "9px 18px", borderRadius: 10, border: `1.5px solid ${selected === s.id ? C.primary : C.border}`, background: selected === s.id ? C.primary : "white", color: selected === s.id ? "white" : C.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {s.name} {s.reflections.length > 0 && <span style={{ background: "rgba(255,255,255,0.3)", borderRadius: 10, padding: "1px 6px", fontSize: 11 }}>{s.reflections.length}</span>}
          </button>
        ))}
      </div>
      {student && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>Reflections — {student.name}</h3>
            <Btn onClick={() => setShowNote(true)}><MessageSquare size={15}/> Add Note</Btn>
          </div>
          {showNote && (
            <Card style={{ marginBottom: 16, border: `2px solid ${C.primary}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 14 }}>Add Teacher Note</h4>
              <Input label="Semester" value={noteForm.semester} onChange={e => setNoteForm({ ...noteForm, semester: e.target.value })} as="select" options={semOptions} />
              <Input label="Message to Student" value={noteForm.note} onChange={e => setNoteForm({ ...noteForm, note: e.target.value })} as="textarea" placeholder="Write your encouragement, feedback, or guidance..." />
              <div style={{ display: "flex", gap: 10 }}>
                <Btn onClick={saveNote}><Save size={14}/> Save Note</Btn>
                <Btn variant="outline" onClick={() => setShowNote(false)}>Cancel</Btn>
              </div>
            </Card>
          )}
          {student.reflections.length === 0 ? (
            <Card style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: C.textMuted }}>This student has no reflections yet.</p>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {student.reflections.map(r => (
                <Card key={r.semester}>
                  <span style={{ background: C.light, color: C.dark, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{r.semester}</span>
                  {r.text && <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Student's Reflection</div>
                    <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{r.text}</p>
                  </div>}
                  {r.target && <div style={{ marginTop: 12, padding: "10px 12px", background: C.lighter, borderRadius: 8, borderLeft: `3px solid ${C.primary}` }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>Target: </span>
                    <span style={{ fontSize: 13, color: C.text }}>{r.target}</span>
                  </div>}
                  {r.teacherNote && <div style={{ marginTop: 12, padding: "10px 12px", background: "#edf3fb", borderRadius: 8, borderLeft: "3px solid #4a7dab" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#4a7dab" }}>Teacher: </span>
                    <span style={{ fontSize: 13, color: "#2d4a6b" }}>{r.teacherNote}</span>
                  </div>}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      {!student && (
        <Card style={{ textAlign: "center", padding: "50px" }}>
          <MessageSquare size={48} style={{ color: C.border, marginBottom: 14 }} />
          <p style={{ color: C.textMuted }}>Select a student above to view their reflections.</p>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [studentsData, setStudentsData] = useState(mockStudents);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogin = (u) => {
    setUser(u);
    setActivePage(u.role === "student" ? "s-dashboard" : "t-dashboard");
  };

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    setUser(null);
    setPage("home");
    setActivePage(null);
    setShowLogoutModal(false);
  };

  const updateStudent = (id, updated) => {
    setStudentsData(prev => prev.map(s => s.id === id ? updated : s));
    if (user?.role === "student" && user.id === id) setUser({ ...updated, role: "student" });
  };

  const updateCurrentUser = (updated) => {
    setUser({ ...updated, role: user.role });
    if (user.role === "student") updateStudent(user.id, updated);
  };

  const studentMenuItems = [
    { id: "s-dashboard", label: "Dashboard", icon: <LayoutDashboard size={18}/> },
    { id: "s-grades", label: "Grade Progress", icon: <TrendingUp size={18}/> },
    { id: "s-status", label: "Learning Status", icon: <Activity size={18}/> },
    { id: "s-reflections", label: "Reflections", icon: <BookOpen size={18}/> },
    { id: "s-profile", label: "My Profile", icon: <User size={18}/> },
  ];

  const teacherMenuItems = [
    { id: "t-dashboard", label: "Dashboard", icon: <LayoutDashboard size={18}/> },
    { id: "t-students", label: "Student Data", icon: <Users size={18}/> },
    { id: "t-upload", label: "Upload Grades", icon: <Upload size={18}/> },
    { id: "t-progress", label: "Student Progress", icon: <TrendingUp size={18}/> },
    { id: "t-reflections", label: "Reflections", icon: <MessageSquare size={18}/> },
    { id: "t-profile", label: "My Profile", icon: <User size={18}/> },
  ];

  if (user) {
    const menuItems = user.role === "student" ? studentMenuItems : teacherMenuItems;
    const sideW = sidebarCollapsed ? 64 : 230;
    const currentStudents = user.role === "teacher" ? studentsData : [];
    const currentUser = user.role === "student" ? (studentsData.find(s => s.id === user.id) || user) : user;

    const renderStudentPage = () => {
      switch (activePage) {
        case "s-dashboard": return <StudentDashboard user={currentUser} />;
        case "s-grades": return <StudentGradeChart user={currentUser} />;
        case "s-status": return <StudentStatus user={currentUser} />;
        case "s-reflections": return <StudentReflection user={currentUser} onUpdate={(u) => updateStudent(u.id, u)} />;
        case "s-profile": return <ProfilePage user={currentUser} onUpdate={updateCurrentUser} />;
        default: return <StudentDashboard user={currentUser} />;
      }
    };

    const renderTeacherPage = () => {
      switch (activePage) {
        case "t-dashboard": return <TeacherDashboard user={user} students={currentStudents} />;
        case "t-students": return <TeacherStudentData students={currentStudents} />;
        case "t-upload": return <TeacherUpload students={currentStudents} onUpdate={updateStudent} />;
        case "t-progress": return <TeacherProgress students={currentStudents} />;
        case "t-reflections": return <TeacherReflections students={currentStudents} onUpdate={updateStudent} />;
        case "t-profile": return <ProfilePage user={user} onUpdate={updateCurrentUser} />;
        default: return <TeacherDashboard user={user} students={currentStudents} />;
      }
    };

    return (
      <div style={{ display: "flex", minHeight: "100vh", background: C.lighter, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <Sidebar
          items={menuItems}
          active={activePage}
          onNav={setActivePage}
          user={currentUser}
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
        />
        <main style={{ marginLeft: sideW, flex: 1, padding: "32px 36px", transition: "margin-left 0.3s", minHeight: "100vh" }}>
          {user.role === "student" ? renderStudentPage() : renderTeacherPage()}
        </main>

        {showLogoutModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(44,80,56,0.35)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.border}`, padding: "36px 40px", width: 360, boxShadow: "0 12px 48px rgba(44,80,56,0.15)", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fdf0f1", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <LogOut size={26} style={{ color: C.danger }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 8 }}>Sign Out</h3>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
                Are you sure you want to sign out of your LearnTrack account?
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setShowLogoutModal(false)}
                  style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.white, color: C.textMuted, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={confirmLogout}
                  style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: C.danger, color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.lighter, minHeight: "100vh" }}>
      <PublicNav page={page} onNav={setPage} />
      {page === "home" && <HomePage onNav={setPage} />}
      {page === "about" && <AboutPage onNav={setPage} />}
      {page === "login" && <LoginPage onLogin={handleLogin} />}
    </div>
  );
}