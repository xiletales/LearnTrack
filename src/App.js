import { useState, useRef, useEffect } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// ── CSS Animations ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.93); } to { opacity: 1; transform: scale(1); } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes pulseRing { 0% { transform: scale(0.8); opacity:1; } 100% { transform: scale(2.2); opacity:0; } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes gradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes waveFloat { 0%,100% { transform: translateX(0) translateY(0); } 33% { transform: translateX(12px) translateY(-10px); } 66% { transform: translateX(-10px) translateY(8px); } }
  @keyframes countUp { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }

  .fade-up   { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  .fade-up-1 { animation: fadeUp 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both; }
  .fade-up-2 { animation: fadeUp 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both; }
  .fade-up-3 { animation: fadeUp 0.6s 0.3s cubic-bezier(0.16,1,0.3,1) both; }
  .fade-up-4 { animation: fadeUp 0.6s 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .scale-in  { animation: scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .slide-right { animation: slideRight 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .float     { animation: float 4s ease-in-out infinite; }
  .float2    { animation: float 4s 1.2s ease-in-out infinite; }
  .page-enter { animation: scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }

  .hover-lift { transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease; }
  .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(59,130,246,0.16) !important; }

  .btn-glow { transition: all 0.22s ease; position: relative; overflow: hidden; cursor: pointer; }
  .btn-glow:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(99,102,241,0.45) !important; }
  .btn-glow:active { transform: translateY(0); }

  .shimmer-bg { background: linear-gradient(90deg,#3b82f6 0%,#6366f1 50%,#3b82f6 100%); background-size: 200% auto; animation: shimmer 2.5s linear infinite; }
  .gradient-text { background: linear-gradient(135deg,#3b82f6,#6366f1,#8b5cf6); background-size:200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation: gradientShift 4s ease infinite; }

  .sidebar-item { transition: all 0.2s cubic-bezier(0.16,1,0.3,1); cursor: pointer; }
  .sidebar-item:hover { background: rgba(59,130,246,0.08) !important; }
  .sidebar-item.active-item { background: rgba(59,130,246,0.12) !important; }

  .row-hover { transition: background 0.15s; cursor: default; }
  .row-hover:hover { background: rgba(59,130,246,0.03) !important; }

  input:focus,textarea:focus,select:focus { outline: none !important; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }

  .progress-fill { transition: width 1.2s cubic-bezier(0.16,1,0.3,1); }
  .num-anim { animation: countUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }

  .orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; animation: waveFloat 9s ease-in-out infinite; }
  .notification { animation: slideRight 0.4s cubic-bezier(0.16,1,0.3,1) both; }
`;

// ── Data ─────────────────────────────────────────────────────────────────────
const STUDENTS = [
  { id: "2024-001", name: "Rina Permata",  class: "XI IPS 2", password: "rena123",  avatar: "R", color: "#3b82f6", grades: [78,81,83,85,87,89], reflections: [{ sem:1, text:"Struggled with math but improved over time.", goal:"Study more consistently.", date:"Jan 2024" }] },
  { id: "2024-002", name: "Ahmed Ail",     class: "XI IPA 1", password: "ahmed123", avatar: "A", color: "#6366f1", grades: [88,87,89,84,85,84], reflections: [] },
  { id: "2024-003", name: "Budi Santoso",  class: "XI IPA 2", password: "budi123",  avatar: "B", color: "#ef4444", grades: [75,74,73,72,74,73], reflections: [] },
  { id: "2024-004", name: "Citra Dewi",    class: "XII IPS 1",password: "citra123", avatar: "C", color: "#22c55e", grades: [82,82,83,83,82,82], reflections: [] },
];
const ADMIN = { username: "admin", password: "admin123" };

// ── Helpers ──────────────────────────────────────────────────────────────────
const avg = arr => (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1);
function getTrend(g) {
  const f = g.slice(0,3).reduce((a,b)=>a+b)/3, l = g.slice(-3).reduce((a,b)=>a+b)/3, d = l-f;
  return d>=2?"Improving":d<=-2?"Declining":"Stable";
}
const TC = t => t==="Improving"?"#22c55e":t==="Declining"?"#ef4444":"#f59e0b";
const TB = t => t==="Improving"?"rgba(34,197,94,0.12)":t==="Declining"?"rgba(239,68,68,0.12)":"rgba(245,158,11,0.12)";
const TE = t => t==="Improving"?"📈":t==="Declining"?"📉":"📊";
const getMotivation = t => t==="Improving"
  ?"You're on fire! 🔥 Your grades have climbed consistently. Keep this momentum — greatness is just ahead!"
  :t==="Declining"
  ?"Every champion faces setbacks. 💪 Reflect, reset, and rise — you've absolutely got this!"
  :"Consistency is your superpower! ⚡ You're holding strong. Push past your comfort zone this semester!";

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimNum({ value, dur=900 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let s=0; const end=parseFloat(value), step=end/(dur/16);
    const t=setInterval(()=>{ s+=step; if(s>=end){setN(end);clearInterval(t);}else setN(parseFloat(s.toFixed(1))); },16);
    return ()=>clearInterval(t);
  }, [value]);
  return <span>{n}</span>;
}

// ── Progress Ring ─────────────────────────────────────────────────────────────
function Ring({ value, max=100, size=76, color="#3b82f6" }) {
  const r=(size-10)/2, c=2*Math.PI*r;
  const [p, setP] = useState(0);
  useEffect(()=>{ setTimeout(()=>setP(value/max),150); }, [value]);
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f4ff" strokeWidth={8}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={c} strokeDashoffset={c*(1-p)} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)"}}/>
    </svg>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(()=>{ const t=setTimeout(onClose,3000); return()=>clearTimeout(t); }, []);
  return (
    <div className="notification" style={{position:"fixed",bottom:24,right:24,zIndex:999,background:"#fff",border:"1px solid #dcfce7",borderLeft:"4px solid #22c55e",borderRadius:14,padding:"14px 20px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 30px rgba(0,0,0,0.12)",minWidth:260}}>
      <span style={{fontSize:18}}>✅</span>
      <span style={{fontSize:14,fontWeight:600,color:"#1e3a5f"}}>{msg}</span>
    </div>
  );
}

// ── Chart Tooltip ─────────────────────────────────────────────────────────────
function CTip({ active, payload, label }) {
  if (!active||!payload?.length) return null;
  return (
    <div className="scale-in" style={{background:"#1e3a5f",borderRadius:12,padding:"10px 16px",boxShadow:"0 8px 24px rgba(30,58,95,0.3)"}}>
      <p style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:4,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{label}</p>
      <p style={{fontSize:22,fontWeight:800,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{payload[0].value}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function LandingPage({ onLogin }) {
  const [type, setType] = useState("student");
  const [id, setId] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const doLogin = () => {
    setErr(""); setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      if(type==="admin"){
        if(id===ADMIN.username&&pw===ADMIN.password){onLogin({type:"admin"});return;}
        setErr("Invalid admin credentials.");
      } else {
        const s=STUDENTS.find(s=>s.id===id&&s.password===pw);
        if(s){onLogin({type:"student",student:s});return;}
        setErr("Invalid Student ID or password.");
      }
    },800);
  };

  return (
    <div style={{minHeight:"100vh",background:"#f4f7ff",fontFamily:"'Plus Jakarta Sans',sans-serif",overflow:"hidden",position:"relative"}}>
      <style>{GLOBAL_CSS}</style>

      {/* Orbs */}
      <div className="orb" style={{width:480,height:480,background:"rgba(59,130,246,0.25)",top:-120,right:-80,animationDelay:"0s"}}/>
      <div className="orb" style={{width:380,height:380,background:"rgba(99,102,241,0.2)",bottom:-60,left:-80,animationDelay:"3.5s"}}/>

      {/* Nav */}
      <nav className="fade-up" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 48px",background:"rgba(255,255,255,0.75)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(59,130,246,0.08)",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div className="float" style={{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#3b82f6,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(99,102,241,0.4)"}}>
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
          </div>
          <span style={{fontSize:20,fontWeight:800,color:"#1e3a5f",letterSpacing:"-0.3px"}}>LearnTrack</span>
        </div>
        <button className="btn-glow shimmer-bg" onClick={()=>setShow(true)}
          style={{color:"#fff",border:"none",borderRadius:12,padding:"11px 26px",fontSize:14,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
          Sign In →
        </button>
      </nav>

      {/* Hero */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"80px 48px 60px",position:"relative"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:60,alignItems:"center"}}>
          <div>
            <div className="fade-up" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(59,130,246,0.1)",borderRadius:100,padding:"7px 18px",marginBottom:28,border:"1px solid rgba(59,130,246,0.2)"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#3b82f6",position:"relative"}}>
                <div style={{position:"absolute",inset:-3,borderRadius:"50%",background:"#3b82f6",animation:"pulseRing 1.6s ease-out infinite"}}/>
              </div>
              <span style={{fontSize:13,color:"#3b82f6",fontWeight:700}}>Academic Progress Tracker ✨</span>
            </div>
            <h1 className="fade-up-1" style={{fontSize:52,fontWeight:800,color:"#1e3a5f",lineHeight:1.1,marginBottom:22,letterSpacing:"-1px"}}>
              Visualize Your<br/><span className="gradient-text">Learning Journey</span>
            </h1>
            <p className="fade-up-2" style={{fontSize:17,color:"#64748b",lineHeight:1.75,marginBottom:40,maxWidth:440,fontWeight:500}}>
              Track academic progress across 6 semesters, reflect on your growth, and unlock your full potential with data-driven insights.
            </p>
            <div className="fade-up-3" style={{display:"flex",gap:14}}>
              <button className="btn-glow shimmer-bg" onClick={()=>setShow(true)}
                style={{color:"#fff",border:"none",borderRadius:14,padding:"16px 34px",fontSize:15,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                Get Started →
              </button>
            </div>
            <div className="fade-up-4" style={{display:"flex",alignItems:"center",gap:14,marginTop:36}}>
              <div style={{display:"flex"}}>
                {STUDENTS.map((s,i)=>(
                  <div key={i} style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${s.color},${s.color}80)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",marginLeft:i>0?-8:0,border:"2px solid #f4f7ff"}}>{s.avatar}</div>
                ))}
              </div>
              <span style={{fontSize:13,color:"#94a3b8",fontWeight:500}}>4+ students tracking progress</span>
            </div>
          </div>

          {/* Cards */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[
              {icon:"📈",title:"Grade Trends",desc:"Visual charts across 6 semesters",bg:"linear-gradient(135deg,#eff6ff,#dbeafe)",d:"0s"},
              {icon:"🎯",title:"Goal Setting",desc:"Set and track semester goals",bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)",d:"0.1s"},
              {icon:"✨",title:"AI Insights",desc:"Smart motivational messages",bg:"linear-gradient(135deg,#faf5ff,#ede9fe)",d:"0.2s"},
              {icon:"📊",title:"Admin Panel",desc:"Excel data management",bg:"linear-gradient(135deg,#fff7ed,#fed7aa)",d:"0.3s"},
            ].map((f,i)=>(
              <div key={i} className="hover-lift" style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(12px)",borderRadius:20,padding:"22px 18px",boxShadow:"0 4px 20px rgba(59,130,246,0.08)",border:"1px solid rgba(255,255,255,0.7)",animation:`fadeUp 0.6s ${f.d} cubic-bezier(0.16,1,0.3,1) both`}}>
                <div style={{width:48,height:48,borderRadius:14,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14}}>{f.icon}</div>
                <div style={{fontSize:14,fontWeight:700,color:"#1e3a5f",marginBottom:5}}>{f.title}</div>
                <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.5}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="fade-up-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",marginTop:60,background:"rgba(255,255,255,0.8)",backdropFilter:"blur(16px)",borderRadius:24,overflow:"hidden",boxShadow:"0 8px 30px rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.08)"}}>
          {[["4+","Students","👥"],["6","Semesters","📅"],["100%","Accuracy","✅"],["Free","Forever","🎁"]].map(([v,l,e],i)=>(
            <div key={l} style={{textAlign:"center",padding:"28px 20px",borderRight:i<3?"1px solid rgba(59,130,246,0.08)":"none"}}>
              <div style={{fontSize:13,marginBottom:6}}>{e}</div>
              <div style={{fontSize:30,fontWeight:800,color:"#3b82f6",letterSpacing:"-0.5px"}}>{v}</div>
              <div style={{fontSize:13,color:"#94a3b8",marginTop:4,fontWeight:500}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {show && (
        <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(8px)",animation:"fadeIn 0.2s both"}}
          onClick={e=>e.target===e.currentTarget&&setShow(false)}>
          <div className="scale-in" style={{background:"rgba(255,255,255,0.95)",backdropFilter:"blur(20px)",borderRadius:28,padding:"40px 36px",width:440,boxShadow:"0 32px 80px rgba(15,23,42,0.22)",border:"1px solid rgba(255,255,255,0.8)"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:30}}>
              <div className="float2" style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#3b82f6,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 18px rgba(99,102,241,0.4)"}}>
                <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
              </div>
              <div>
                <div style={{fontSize:18,fontWeight:800,color:"#1e3a5f"}}>Welcome back!</div>
                <div style={{fontSize:13,color:"#94a3b8",fontWeight:500}}>Sign in to continue</div>
              </div>
            </div>

            {/* Toggle */}
            <div style={{display:"flex",background:"#f1f5f9",borderRadius:14,padding:4,marginBottom:26,position:"relative"}}>
              <div style={{position:"absolute",top:4,left:type==="student"?4:"calc(50% + 2px)",width:"calc(50% - 6px)",height:"calc(100% - 8px)",background:"#fff",borderRadius:10,boxShadow:"0 2px 8px rgba(0,0,0,0.08)",transition:"left 0.3s cubic-bezier(0.16,1,0.3,1)"}}/>
              {["student","admin"].map(t=>(
                <button key={t} onClick={()=>{setType(t);setErr("");}}
                  style={{flex:1,padding:"9px 0",border:"none",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700,background:"transparent",color:type===t?"#3b82f6":"#94a3b8",position:"relative",zIndex:1,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"color 0.2s"}}>
                  {t==="student"?"🎓 Student":"⚙️ Admin"}
                </button>
              ))}
            </div>

            {[
              {label:type==="admin"?"Username":"Student ID / NIS",val:id,set:setId,ph:type==="admin"?"admin":"e.g. 2024-001",tp:"text"},
              {label:"Password",val:pw,set:setPw,ph:"Enter your password",tp:"password"},
            ].map((f,i)=>(
              <div key={i} style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:7,letterSpacing:"0.06em"}}>{f.label.toUpperCase()}</label>
                <input type={f.tp} value={f.val} onChange={e=>f.set(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}
                  placeholder={f.ph}
                  style={{width:"100%",padding:"13px 16px",border:"1.5px solid #e8eeff",borderRadius:12,fontSize:14,color:"#1e3a5f",fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#f8faff",fontWeight:500,transition:"all 0.2s"}}/>
              </div>
            ))}

            {err&&<div className="slide-right" style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"11px 14px",color:"#ef4444",fontSize:13,marginBottom:14,display:"flex",alignItems:"center",gap:8,fontWeight:600}}>⚠️ {err}</div>}

            <button className="btn-glow" onClick={doLogin} disabled={loading}
              style={{width:"100%",background:loading?"#94a3b8":"linear-gradient(135deg,#3b82f6,#6366f1)",color:"#fff",border:"none",borderRadius:14,padding:"15px 0",fontSize:15,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:"0 6px 20px rgba(99,102,241,0.35)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {loading?<><div style={{width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/> Signing in...</>:"Sign In →"}
            </button>

            <div style={{marginTop:14,background:"#f8faff",borderRadius:12,padding:"11px 14px",fontSize:12,color:"#94a3b8",border:"1px solid #e8eeff"}}>
              <strong style={{color:"#64748b"}}>✨ Demo:</strong> ID: <code style={{background:"#e8eeff",padding:"2px 6px",borderRadius:4,color:"#3b82f6",fontWeight:700}}>2024-001</code> / Pass: <code style={{background:"#e8eeff",padding:"2px 6px",borderRadius:4,color:"#3b82f6",fontWeight:700}}>rena123</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STUDENT DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function StudentDashboard({ student, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [reflections, setReflections] = useState(student.reflections||[]);
  const [rText, setRText] = useState(""); const [rGoal, setRGoal] = useState(""); const [rSem, setRSem] = useState(6);
  const [toast, setToast] = useState(null);
  const [hovSem, setHovSem] = useState(null);

  const chartData = student.grades.map((g,i)=>({name:`Sem ${i+1}`,grade:g}));
  const trend = getTrend(student.grades);

  const saveRefl = () => {
    if (!rText.trim()) return;
    setReflections([...reflections,{sem:rSem,text:rText,goal:rGoal,date:new Date().toLocaleDateString("id-ID")}]);
    setRText(""); setRGoal("");
    setToast("Reflection saved! 🎉");
  };

  const TABS = [{id:"dashboard",label:"Dashboard",icon:"🏠"},{id:"grades",label:"Grades",icon:"📊"},{id:"reflection",label:"Reflection",icon:"✍️"},{id:"profile",label:"Profile",icon:"👤"}];

  return (
    <div style={{minHeight:"100vh",background:"#f4f7ff",fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex"}}>
      <style>{GLOBAL_CSS}</style>
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}

      {/* Sidebar */}
      <div style={{width:248,background:"#fff",borderRight:"1px solid #eef2ff",padding:"22px 14px",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",boxShadow:"4px 0 20px rgba(59,130,246,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"0 8px",marginBottom:24}}>
          <div className="float2" style={{width:36,height:36,borderRadius:11,background:"linear-gradient(135deg,#3b82f6,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(99,102,241,0.35)"}}>
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
          </div>
          <span style={{fontSize:17,fontWeight:800,color:"#1e3a5f",letterSpacing:"-0.3px"}}>LearnTrack</span>
        </div>

        {/* Student card */}
        <div style={{background:"linear-gradient(135deg,#eff6ff,#eef2ff)",borderRadius:16,padding:14,marginBottom:22,border:"1px solid rgba(99,102,241,0.15)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${student.color},${student.color}80)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"#fff",boxShadow:`0 4px 12px ${student.color}40`,flexShrink:0}}>{student.avatar}</div>
            <div style={{overflow:"hidden"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{student.name}</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{student.class}</div>
            </div>
          </div>
          <div style={{marginTop:10,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>GPA Sem 6</span>
            <span style={{fontSize:15,fontWeight:800,color:"#3b82f6"}}>{student.grades[5]}</span>
          </div>
        </div>

        <nav style={{flex:1}}>
          <div style={{fontSize:10,fontWeight:700,color:"#c7d2fe",letterSpacing:"0.1em",padding:"0 10px",marginBottom:8}}>NAVIGATION</div>
          {TABS.map(t=>(
            <div key={t.id} className={`sidebar-item ${tab===t.id?"active-item":""}`} onClick={()=>setTab(t.id)}
              style={{display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:12,marginBottom:3,color:tab===t.id?"#3b82f6":"#64748b",fontWeight:tab===t.id?700:500,fontSize:14}}>
              <span style={{fontSize:16}}>{t.icon}</span>{t.label}
              {tab===t.id&&<div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"#3b82f6"}}/>}
            </div>
          ))}
        </nav>
        <div className="sidebar-item" onClick={onLogout} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:12,color:"#ef4444",fontSize:14,fontWeight:600}}>
          <span>🚪</span> Logout
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,padding:"32px 36px",overflowY:"auto"}} key={tab}>
        <div className="page-enter">
          <div style={{marginBottom:26,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <h1 style={{fontSize:26,fontWeight:800,color:"#1e3a5f",letterSpacing:"-0.3px",margin:0}}>
                {tab==="dashboard"&&`Hey, ${student.name.split(" ")[0]}! 👋`}
                {tab==="grades"&&"Grade History 📊"}
                {tab==="reflection"&&"Reflection & Goals ✍️"}
                {tab==="profile"&&"My Profile 👤"}
              </h1>
              <p style={{color:"#94a3b8",fontSize:13,margin:"4px 0 0",fontWeight:500}}>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,background:TB(trend),padding:"9px 18px",borderRadius:100,border:`1px solid ${TC(trend)}30`}}>
              <span>{TE(trend)}</span>
              <span style={{fontSize:13,fontWeight:700,color:TC(trend)}}>{trend}</span>
            </div>
          </div>

          {/* ── DASHBOARD ── */}
          {tab==="dashboard"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:22}}>
                {[
                  {label:"Current GPA",value:student.grades[5],sub:"Semester 6",color:"#3b82f6",d:"0s"},
                  {label:"Average",value:avg(student.grades),sub:"All Semesters",color:"#6366f1",d:"0.1s"},
                  {label:"Best Score",value:Math.max(...student.grades),sub:`Sem ${student.grades.indexOf(Math.max(...student.grades))+1}`,color:"#22c55e",d:"0.2s"},
                ].map((s,i)=>(
                  <div key={i} className="hover-lift" style={{background:"#fff",borderRadius:20,padding:"22px",boxShadow:"0 2px 16px rgba(59,130,246,0.08)",border:"1px solid #eef2ff",animation:`fadeUp 0.6s ${s.d} cubic-bezier(0.16,1,0.3,1) both`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:11,color:"#94a3b8",fontWeight:700,marginBottom:8,letterSpacing:"0.06em"}}>{s.label.toUpperCase()}</div>
                      <div style={{fontSize:34,fontWeight:800,color:s.color,letterSpacing:"-1px"}} className="num-anim"><AnimNum value={s.value}/></div>
                      <div style={{fontSize:12,color:"#94a3b8",marginTop:4,fontWeight:500}}>{s.sub}</div>
                    </div>
                    <div style={{position:"relative"}}>
                      <Ring value={parseFloat(s.value)} color={s.color}/>
                      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:s.color}}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="hover-lift" style={{background:"#fff",borderRadius:24,padding:"26px",boxShadow:"0 4px 24px rgba(59,130,246,0.08)",marginBottom:18,border:"1px solid #eef2ff",animation:"fadeUp 0.6s 0.3s cubic-bezier(0.16,1,0.3,1) both"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
                  <div>
                    <div style={{fontSize:16,fontWeight:800,color:"#1e3a5f",letterSpacing:"-0.2px"}}>Grade Development</div>
                    <div style={{fontSize:12,color:"#94a3b8",marginTop:2,fontWeight:500}}>Semester 1 – 6 Performance</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={230}>
                  <AreaChart data={chartData} margin={{top:10,right:10,left:-22,bottom:0}}>
                    <defs>
                      <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6"/>
                        <stop offset="100%" stopColor="#6366f1"/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false}/>
                    <XAxis dataKey="name" tick={{fontSize:12,fill:"#94a3b8",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600}} axisLine={false} tickLine={false}/>
                    <YAxis domain={[60,100]} tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CTip/>}/>
                    <Area type="monotone" dataKey="grade" stroke="url(#lineG)" strokeWidth={3} fill="url(#areaG)" dot={{r:6,fill:"#3b82f6",strokeWidth:3,stroke:"#fff"}} activeDot={{r:8,fill:"#6366f1",strokeWidth:3,stroke:"#fff"}}/>
                  </AreaChart>
                </ResponsiveContainer>
                {/* Semester mini chips */}
                <div style={{display:"flex",gap:8,marginTop:14}}>
                  {student.grades.map((g,i)=>(
                    <div key={i} onMouseEnter={()=>setHovSem(i)} onMouseLeave={()=>setHovSem(null)}
                      style={{flex:1,background:hovSem===i?"linear-gradient(135deg,#3b82f6,#6366f1)":"#f8faff",borderRadius:12,padding:"10px 6px",textAlign:"center",cursor:"pointer",transition:"all 0.2s",border:"1px solid #eef2ff"}}>
                      <div style={{fontSize:10,color:hovSem===i?"rgba(255,255,255,0.7)":"#94a3b8",fontWeight:700,marginBottom:2}}>S{i+1}</div>
                      <div style={{fontSize:13,fontWeight:800,color:hovSem===i?"#fff":"#1e3a5f"}}>{g}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivation */}
              <div className="hover-lift" style={{background:`linear-gradient(135deg,${TC(trend)}14,${TC(trend)}05)`,borderRadius:20,padding:"22px 26px",border:`1px solid ${TC(trend)}22`,animation:"fadeUp 0.6s 0.4s cubic-bezier(0.16,1,0.3,1) both"}}>
                <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                  <span style={{fontSize:28}}>{TE(trend)}</span>
                  <div>
                    <div style={{fontSize:11,fontWeight:800,color:TC(trend),marginBottom:6,letterSpacing:"0.08em"}}>PROGRESS INSIGHT</div>
                    <p style={{margin:0,fontSize:14,color:"#475569",lineHeight:1.75,fontWeight:500}}>{getMotivation(trend)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── GRADES ── */}
          {tab==="grades"&&(
            <div>
              <div className="hover-lift" style={{background:"#fff",borderRadius:24,padding:"26px",boxShadow:"0 4px 24px rgba(59,130,246,0.08)",marginBottom:20,border:"1px solid #eef2ff",animation:"fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both"}}>
                <ResponsiveContainer width="100%" height={270}>
                  <AreaChart data={chartData} margin={{top:10,right:10,left:-22,bottom:0}}>
                    <defs>
                      <linearGradient id="areaG2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false}/>
                    <XAxis dataKey="name" tick={{fontSize:12,fill:"#94a3b8",fontWeight:600}} axisLine={false} tickLine={false}/>
                    <YAxis domain={[60,100]} tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CTip/>}/>
                    <Area type="monotone" dataKey="grade" stroke="#6366f1" strokeWidth={3} fill="url(#areaG2)" dot={{r:7,fill:"#6366f1",strokeWidth:3,stroke:"#fff"}} activeDot={{r:9}}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{background:"#fff",borderRadius:24,overflow:"hidden",boxShadow:"0 4px 24px rgba(59,130,246,0.08)",border:"1px solid #eef2ff",animation:"fadeUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both"}}>
                <div style={{padding:"18px 28px",borderBottom:"1px solid #f0f4ff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:15,fontWeight:800,color:"#1e3a5f"}}>Semester Summary</span>
                  <span style={{fontSize:13,color:"#94a3b8",fontWeight:500}}>Avg: <strong style={{color:"#3b82f6"}}>{avg(student.grades)}</strong></span>
                </div>
                {student.grades.map((g,i)=>{
                  const prev=i>0?student.grades[i-1]:null, diff=prev!==null?g-prev:null;
                  return (
                    <div key={i} className="row-hover" style={{padding:"16px 28px",borderBottom:i<5?"1px solid #f8faff":"none",animation:`fadeUp 0.5s ${i*0.06}s cubic-bezier(0.16,1,0.3,1) both`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#eff6ff,#dbeafe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#3b82f6"}}>{i+1}</div>
                          <span style={{fontSize:14,fontWeight:700,color:"#1e3a5f"}}>Semester {i+1}</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          {diff!==null&&<span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:100,background:diff>0?"rgba(34,197,94,0.1)":diff<0?"rgba(239,68,68,0.1)":"rgba(245,158,11,0.1)",color:diff>0?"#22c55e":diff<0?"#ef4444":"#f59e0b"}}>{diff>0?`↑ +${diff}`:diff<0?`↓ ${diff}`:"→ 0"}</span>}
                          <span style={{fontSize:20,fontWeight:800,color:"#1e3a5f"}}>{g}</span>
                        </div>
                      </div>
                      <div style={{height:8,background:"#f0f4ff",borderRadius:99,overflow:"hidden"}}>
                        <div className="progress-fill" style={{height:"100%",width:`${g}%`,background:"linear-gradient(90deg,#3b82f6,#6366f1)",borderRadius:99}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── REFLECTION ── */}
          {tab==="reflection"&&(
            <div>
              <div className="hover-lift" style={{background:"#fff",borderRadius:24,padding:"28px",boxShadow:"0 4px 24px rgba(59,130,246,0.08)",marginBottom:18,border:"1px solid #eef2ff",animation:"fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both"}}>
                <div style={{fontSize:16,fontWeight:800,color:"#1e3a5f",marginBottom:4}}>Add New Reflection</div>
                <div style={{fontSize:13,color:"#94a3b8",marginBottom:22,fontWeight:500}}>Document your journey and set goals for next semester</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#94a3b8",letterSpacing:"0.08em",display:"block",marginBottom:7}}>SEMESTER</label>
                    <select value={rSem} onChange={e=>setRSem(Number(e.target.value))} style={{width:"100%",padding:"12px 14px",border:"1.5px solid #eef2ff",borderRadius:12,fontSize:14,color:"#1e3a5f",fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#f8faff",cursor:"pointer",fontWeight:600}}>
                      {[1,2,3,4,5,6].map(s=><option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:11,fontWeight:700,color:"#94a3b8",letterSpacing:"0.08em",display:"block",marginBottom:7}}>GOAL FOR NEXT SEM</label>
                    <input value={rGoal} onChange={e=>setRGoal(e.target.value)} placeholder="e.g. Study 2h daily..." style={{width:"100%",padding:"12px 14px",border:"1.5px solid #eef2ff",borderRadius:12,fontSize:14,color:"#1e3a5f",fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#f8faff",fontWeight:500}}/>
                  </div>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#94a3b8",letterSpacing:"0.08em",display:"block",marginBottom:7}}>REFLECTION</label>
                  <textarea value={rText} onChange={e=>setRText(e.target.value)} placeholder="What did you learn? What challenges did you face?" rows={4} style={{width:"100%",padding:"14px 16px",border:"1.5px solid #eef2ff",borderRadius:14,fontSize:14,color:"#1e3a5f",resize:"vertical",fontFamily:"'Plus Jakarta Sans',sans-serif",lineHeight:1.7,background:"#f8faff",fontWeight:500}}/>
                </div>
                <button className="btn-glow" onClick={saveRefl} style={{background:"linear-gradient(135deg,#3b82f6,#6366f1)",color:"#fff",border:"none",borderRadius:12,padding:"13px 28px",fontSize:14,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:"0 4px 16px rgba(99,102,241,0.35)"}}>
                  Save Reflection ✨
                </button>
              </div>

              {reflections.length>0&&(
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:"#1e3a5f",marginBottom:14}}>Past Reflections ({reflections.length})</div>
                  {[...reflections].reverse().map((r,i)=>(
                    <div key={i} className="hover-lift" style={{background:"#fff",borderRadius:18,padding:"22px",boxShadow:"0 2px 14px rgba(59,130,246,0.06)",marginBottom:12,border:"1px solid #eef2ff",animation:`fadeUp 0.5s ${i*0.1}s cubic-bezier(0.16,1,0.3,1) both`}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                        <span style={{fontSize:13,fontWeight:700,color:"#3b82f6",background:"rgba(59,130,246,0.1)",padding:"5px 14px",borderRadius:100,border:"1px solid rgba(59,130,246,0.2)"}}>Semester {r.sem}</span>
                        {r.date&&<span style={{fontSize:12,color:"#94a3b8",fontWeight:500}}>{r.date}</span>}
                      </div>
                      <p style={{margin:"0 0 12px",fontSize:14,color:"#475569",lineHeight:1.75,fontWeight:500}}>{r.text}</p>
                      {r.goal&&<div style={{background:"linear-gradient(135deg,#f0f7ff,#eff6ff)",borderRadius:12,padding:"12px 16px",fontSize:13,color:"#475569",borderLeft:"3px solid #3b82f6",fontWeight:500}}>🎯 <strong style={{color:"#1e3a5f"}}>Goal:</strong> {r.goal}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab==="profile"&&(
            <div style={{maxWidth:560}}>
              <div className="hover-lift" style={{background:"#fff",borderRadius:24,overflow:"hidden",boxShadow:"0 4px 24px rgba(59,130,246,0.08)",border:"1px solid #eef2ff",animation:"fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both"}}>
                <div style={{background:`linear-gradient(135deg,${student.color},${student.color}80)`,padding:"44px 32px",display:"flex",alignItems:"center",gap:22,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)"}}/>
                  <div className="float" style={{width:76,height:76,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,color:"#fff",border:"3px solid rgba(255,255,255,0.5)",backdropFilter:"blur(10px)",position:"relative",zIndex:1}}>
                    {student.avatar}
                  </div>
                  <div style={{position:"relative",zIndex:1}}>
                    <div style={{fontSize:24,fontWeight:800,color:"#fff",letterSpacing:"-0.3px"}}>{student.name}</div>
                    <div style={{fontSize:14,color:"rgba(255,255,255,0.8)",marginTop:4,fontWeight:500}}>{student.class}</div>
                  </div>
                </div>
                <div style={{padding:"8px 28px 28px"}}>
                  {[["🆔","Student ID",student.id],["📚","Class",student.class],["⭐","GPA Sem 6",`${student.grades[5]} / 100`],["📈","Progress Trend",trend],["🏆","Best Score",`${Math.max(...student.grades)} (Sem ${student.grades.indexOf(Math.max(...student.grades))+1})`],["📊","All-Time Avg",avg(student.grades)]].map(([e,l,v],i)=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"15px 0",borderBottom:i<5?"1px solid #f0f4ff":"none",animation:`fadeUp 0.5s ${i*0.07+0.1}s cubic-bezier(0.16,1,0.3,1) both`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>{e}</span><span style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>{l}</span></div>
                      <span style={{fontSize:14,fontWeight:700,color:l==="Progress Trend"?TC(trend):"#1e3a5f"}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function AdminDashboard({ onLogout }) {
  const [students, setStudents] = useState(STUDENTS);
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editS, setEditS] = useState(null);
  const [editG, setEditG] = useState({});
  const [uploaded, setUploaded] = useState("");
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  const filtered = students.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.id.includes(search)||s.class.toLowerCase().includes(search.toLowerCase()));

  const doUpload = e => {
    const f=e.target.files[0]; if(!f) return;
    setUploaded(f.name);
    setToast(`"${f.name}" processed! ✅`);
  };

  const startEdit = s => { setEditS(s); setEditG(s.grades.reduce((a,g,i)=>({...a,[i]:g}),{})); setEditMode(true); };
  const saveEdit = () => {
    setStudents(students.map(s=>s.id===editS.id?{...s,grades:Object.values(editG).map(Number)}:s));
    setEditMode(false);
    setToast("Grades updated successfully! ✅");
  };

  const TABS = [{id:"overview",label:"Overview",icon:"🏠"},{id:"students",label:"Students",icon:"👥"},{id:"upload",label:"Upload",icon:"📤"}];

  return (
    <div style={{minHeight:"100vh",background:"#0f172a",fontFamily:"'Plus Jakarta Sans',sans-serif",display:"flex"}}>
      <style>{GLOBAL_CSS}</style>
      {toast&&<Toast msg={toast} onClose={()=>setToast(null)}/>}

      {/* Sidebar */}
      <div style={{width:248,background:"#1e293b",padding:"22px 14px",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",borderRight:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"0 8px",marginBottom:32}}>
          <div className="float" style={{width:36,height:36,borderRadius:11,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(99,102,241,0.5)"}}>
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:"#fff"}}>LearnTrack</div>
            <div style={{fontSize:10,color:"#a5b4fc",fontWeight:700,letterSpacing:"0.08em"}}>ADMIN PANEL</div>
          </div>
        </div>
        <nav style={{flex:1}}>
          {TABS.map(t=>(
            <div key={t.id} className={`sidebar-item ${tab===t.id?"active-item":""}`} onClick={()=>setTab(t.id)}
              style={{display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:12,marginBottom:3,background:tab===t.id?"rgba(99,102,241,0.2)":"transparent",color:tab===t.id?"#a5b4fc":"rgba(148,163,184,0.7)",fontWeight:tab===t.id?700:500,fontSize:14}}>
              <span style={{fontSize:16}}>{t.icon}</span>{t.label}
              {tab===t.id&&<div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"#a5b4fc"}}/>}
            </div>
          ))}
        </nav>
        <div className="sidebar-item" onClick={onLogout} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:12,color:"#f87171",fontSize:14,fontWeight:600}}>
          <span>🚪</span> Logout
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,padding:"32px 36px",overflowY:"auto"}} key={tab}>
        <div className="page-enter">
          <div style={{marginBottom:26}}>
            <h1 style={{fontSize:26,fontWeight:800,color:"#f1f5f9",letterSpacing:"-0.3px",margin:0}}>
              {tab==="overview"&&"Dashboard Overview 📊"}
              {tab==="students"&&"Student Records 👥"}
              {tab==="upload"&&"Upload Grade Data 📤"}
            </h1>
            <p style={{color:"#475569",fontSize:13,margin:"4px 0 0",fontWeight:500}}>LearnTrack Administration Panel</p>
          </div>

          {/* ── OVERVIEW ── */}
          {tab==="overview"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:22}}>
                {[
                  {label:"Total Students",value:students.length,icon:"👥",color:"#6366f1",d:"0s"},
                  {label:"Improving",value:students.filter(s=>getTrend(s.grades)==="Improving").length,icon:"📈",color:"#22c55e",d:"0.1s"},
                  {label:"Stable",value:students.filter(s=>getTrend(s.grades)==="Stable").length,icon:"📊",color:"#f59e0b",d:"0.2s"},
                  {label:"Declining",value:students.filter(s=>getTrend(s.grades)==="Declining").length,icon:"📉",color:"#ef4444",d:"0.3s"},
                ].map((s,i)=>(
                  <div key={i} className="hover-lift" style={{background:"#1e293b",borderRadius:20,padding:"22px",border:"1px solid rgba(255,255,255,0.06)",animation:`fadeUp 0.6s ${s.d} cubic-bezier(0.16,1,0.3,1) both`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                      <span style={{fontSize:22}}>{s.icon}</span>
                      <div style={{width:8,height:8,borderRadius:"50%",background:s.color,boxShadow:`0 0 8px ${s.color}`}}/>
                    </div>
                    <div style={{fontSize:34,fontWeight:800,color:s.color,letterSpacing:"-1px"}} className="num-anim"><AnimNum value={s.value} dur={600}/></div>
                    <div style={{fontSize:12,color:"#475569",marginTop:4,fontWeight:600}}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{background:"#1e293b",borderRadius:24,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)",animation:"fadeUp 0.6s 0.3s cubic-bezier(0.16,1,0.3,1) both"}}>
                <div style={{padding:"18px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <span style={{fontSize:15,fontWeight:800,color:"#f1f5f9"}}>All Students</span>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"rgba(255,255,255,0.03)"}}>
                      {["Student","Class","Sem 6","Average","Trend"].map(h=>(
                        <th key={h} style={{padding:"12px 24px",textAlign:"left",fontSize:11,fontWeight:700,color:"#475569",letterSpacing:"0.08em"}}>{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s,i)=>{
                      const t=getTrend(s.grades);
                      return (
                        <tr key={i} className="row-hover" style={{borderTop:"1px solid rgba(255,255,255,0.04)",animation:`fadeUp 0.5s ${i*0.07}s cubic-bezier(0.16,1,0.3,1) both`}}>
                          <td style={{padding:"14px 24px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${s.color},${s.color}70)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff",flexShrink:0}}>{s.avatar}</div>
                              <div>
                                <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9"}}>{s.name}</div>
                                <div style={{fontSize:11,color:"#475569",fontFamily:"monospace"}}>{s.id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{padding:"14px 24px",fontSize:13,color:"#64748b",fontWeight:500}}>{s.class}</td>
                          <td style={{padding:"14px 24px",fontSize:16,fontWeight:800,color:"#6366f1"}}>{s.grades[5]}</td>
                          <td style={{padding:"14px 24px",fontSize:14,fontWeight:700,color:"#94a3b8"}}>{avg(s.grades)}</td>
                          <td style={{padding:"14px 24px"}}><span style={{fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:100,background:TB(t),color:TC(t)}}>{t}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── STUDENTS ── */}
          {tab==="students"&&(
            <div>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search students..." style={{padding:"13px 18px",border:"1.5px solid rgba(255,255,255,0.08)",borderRadius:14,fontSize:14,width:300,fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#f1f5f9",background:"#1e293b",fontWeight:500,marginBottom:16,display:"block"}}/>
              <div style={{display:"grid",gap:12}}>
                {filtered.map((s,i)=>{
                  const t=getTrend(s.grades);
                  return (
                    <div key={i} style={{background:"#1e293b",borderRadius:20,padding:"22px 26px",border:"1px solid rgba(255,255,255,0.06)",animation:`fadeUp 0.5s ${i*0.07}s cubic-bezier(0.16,1,0.3,1) both`,transition:"border-color 0.2s"}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(99,102,241,0.3)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${s.color},${s.color}70)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"#fff",boxShadow:`0 4px 12px ${s.color}40`}}>{s.avatar}</div>
                          <div>
                            <div style={{fontSize:15,fontWeight:700,color:"#f1f5f9"}}>{s.name}</div>
                            <div style={{fontSize:12,color:"#475569"}}>{s.id} · {s.class}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <span style={{fontSize:12,fontWeight:700,padding:"5px 14px",borderRadius:100,background:TB(t),color:TC(t)}}>{t}</span>
                          <button onClick={()=>startEdit(s)} className="btn-glow" style={{background:"rgba(99,102,241,0.2)",color:"#a5b4fc",border:"1px solid rgba(99,102,241,0.3)",borderRadius:10,padding:"6px 16px",fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                            Edit Grades
                          </button>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        {s.grades.map((g,j)=>(
                          <div key={j} style={{flex:1,textAlign:"center",background:j===5?`linear-gradient(135deg,${s.color},${s.color}70)`:"rgba(255,255,255,0.04)",borderRadius:10,padding:"8px 4px",border:j===5?"none":"1px solid rgba(255,255,255,0.06)"}}>
                            <div style={{fontSize:9,color:j===5?"rgba(255,255,255,0.7)":"#475569",marginBottom:3,fontWeight:700}}>S{j+1}</div>
                            <div style={{fontSize:13,fontWeight:800,color:j===5?"#fff":"#94a3b8"}}>{g}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {editMode&&editS&&(
                <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(8px)",animation:"fadeIn 0.2s both"}}>
                  <div className="scale-in" style={{background:"#1e293b",borderRadius:24,padding:36,width:500,border:"1px solid rgba(255,255,255,0.1)",boxShadow:"0 32px 80px rgba(0,0,0,0.5)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
                      <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${editS.color},${editS.color}70)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"#fff"}}>{editS.avatar}</div>
                      <div>
                        <div style={{fontSize:16,fontWeight:800,color:"#f1f5f9"}}>Edit Grades</div>
                        <div style={{fontSize:12,color:"#64748b"}}>{editS.name} · {editS.class}</div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24}}>
                      {[0,1,2,3,4,5].map(i=>(
                        <div key={i}>
                          <label style={{fontSize:11,fontWeight:700,color:"#475569",display:"block",marginBottom:6,letterSpacing:"0.08em"}}>SEM {i+1}</label>
                          <input type="number" min="0" max="100" value={editG[i]} onChange={e=>setEditG({...editG,[i]:e.target.value})}
                            style={{width:"100%",padding:"11px 12px",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:12,fontSize:16,fontWeight:800,color:"#f1f5f9",textAlign:"center",fontFamily:"'Plus Jakarta Sans',sans-serif",background:"rgba(255,255,255,0.05)"}}/>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button onClick={saveEdit} className="btn-glow" style={{flex:1,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:12,padding:"13px 0",fontSize:14,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Save ✅</button>
                      <button onClick={()=>setEditMode(false)} style={{flex:1,background:"rgba(255,255,255,0.06)",color:"#94a3b8",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"13px 0",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── UPLOAD ── */}
          {tab==="upload"&&(
            <div style={{maxWidth:620}}>
              <div style={{background:"#1e293b",borderRadius:24,padding:32,border:"1px solid rgba(255,255,255,0.06)",marginBottom:18,animation:"fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both"}}>
                <div style={{fontSize:16,fontWeight:800,color:"#f1f5f9",marginBottom:4}}>Upload Grade Data</div>
                <div style={{fontSize:13,color:"#64748b",marginBottom:24,fontWeight:500}}>Bulk import student grades via Excel or CSV</div>
                <div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed rgba(99,102,241,0.35)",borderRadius:20,padding:"52px 24px",textAlign:"center",cursor:"pointer",transition:"all 0.22s",background:"rgba(99,102,241,0.04)"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(99,102,241,0.65)";e.currentTarget.style.background="rgba(99,102,241,0.08)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(99,102,241,0.35)";e.currentTarget.style.background="rgba(99,102,241,0.04)";}}>
                  <div style={{fontSize:44,marginBottom:12}}>📁</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#a5b4fc",marginBottom:6}}>Click to upload</div>
                  <div style={{fontSize:13,color:"#475569",fontWeight:500}}>Supports .xlsx, .xls, .csv</div>
                  <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={doUpload}/>
                </div>
                {uploaded&&<div className="slide-right" style={{marginTop:14,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:12,padding:"12px 16px",color:"#22c55e",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:8}}>✅ "{uploaded}" processed!</div>}
              </div>

              <div style={{background:"#1e293b",borderRadius:24,padding:28,border:"1px solid rgba(255,255,255,0.06)",animation:"fadeUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both"}}>
                <div style={{fontSize:15,fontWeight:800,color:"#f1f5f9",marginBottom:16}}>📋 Expected Format</div>
                <div style={{background:"rgba(0,0,0,0.3)",borderRadius:12,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead>
                      <tr style={{background:"rgba(99,102,241,0.15)"}}>
                        {["Student_ID","Name","Class","Sem1-6..."].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:700,color:"#a5b4fc"}}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{borderTop:"1px solid rgba(255,255,255,0.05)"}}>
                        {["2024-001","Rina Permata","XI IPS 2","78,81,83..."].map((v,i)=><td key={i} style={{padding:"10px 14px",color:"#64748b",fontWeight:500}}>{v}</td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button className="btn-glow" style={{marginTop:16,display:"flex",alignItems:"center",gap:8,background:"rgba(99,102,241,0.2)",color:"#a5b4fc",border:"1px solid rgba(99,102,241,0.3)",borderRadius:12,padding:"11px 20px",fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                  ⬇️ Download Template
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  if (!session) return <LandingPage onLogin={setSession}/>;
  if (session.type==="admin") return <AdminDashboard onLogout={()=>setSession(null)}/>;
  return <StudentDashboard student={session.student} onLogout={()=>setSession(null)}/>;
}