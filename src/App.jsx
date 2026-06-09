import { useState, useEffect } from "react";

const SUPABASE_URL = "https://yyyzaxaurrodagpzayaq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_EmOO9Xgwjftv4rSmtb8Lsw_IjGjmjxd";

const supaFetch = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return options.method === "DELETE" ? null : res.json();
};

const AVATARS = ["🦁","🐼","🦊","🐸","🐨","🦄","🐯","🐧","🦋","🐢","🦕","🐬"];
const TASK_ICONS = ["🧹","🍽️","🧺","🛏️","🪣","🌿","🐕","🗑️","🧼","📚","🍳","🪟"];

const getTask = (id, tasks) => tasks.find(t => t.id === id);
const getMember = (id, members) => members.find(m => m.id === id);
const getReward = (id, rewards) => rewards.find(r => r.id === id);const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Nunito:wght@400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --sun: #FFD166; --coral: #EF8A5B; --teal: #06D6A0; --sky: #4ECDC4;
    --navy: #1A1A2E; --purple: #A78BFA; --pink: #F472B6;
    --card: #ffffff; --bg: #F0F4FF; --text: #1A1A2E;
    --muted: #6B7280; --border: #E5E7EB; --radius: 20px;
    --shadow: 0 4px 24px rgba(26,26,46,0.10);
  }
  body { font-family: 'Nunito', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  h1, h2, h3, .brand { font-family: 'Baloo 2', cursive; }
  .app { max-width: 480px; margin: 0 auto; min-height: 100vh; background: var(--bg); position: relative; overflow-x: hidden; }
  .header { background: var(--navy); color: white; padding: 18px 20px 14px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .brand { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; }
  .brand span { color: var(--sun); }
  .header-right { display: flex; align-items: center; gap: 10px; }
  .avatar-pill { background: rgba(255,255,255,0.15); border-radius: 50px; padding: 4px 12px 4px 4px; display: flex; align-items: center; gap: 6px; font-size: 0.85rem; cursor: pointer; transition: background 0.2s; }
  .avatar-pill:hover { background: rgba(255,255,255,0.25); }
  .avatar-circle { width: 30px; height: 30px; background: var(--sun); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
  .nav { background: white; display: flex; border-bottom: 2px solid var(--border); position: sticky; top: 64px; z-index: 99; }
  .nav-tab { flex: 1; padding: 12px 6px 10px; text-align: center; font-size: 0.78rem; font-weight: 700; color: var(--muted); cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; font-family: 'Nunito', sans-serif; background: none; border-top: none; border-left: none; border-right: none; }
  .nav-tab.active { color: var(--navy); border-bottom-color: var(--sun); }
  .nav-tab .tab-icon { font-size: 1.2rem; display: block; margin-bottom: 2px; }
  .page { padding: 16px; }
  .card { background: white; border-radius: var(--radius); box-shadow: var(--shadow); padding: 16px; margin-bottom: 14px; }
  .card-title { font-family: 'Baloo 2', cursive; font-size: 1rem; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
  .btn { border: none; border-radius: 50px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.18s; display: inline-flex; align-items: center; gap: 6px; }
  .btn:hover { transform: translateY(-1px); }
  .btn-primary { background: var(--navy); color: white; padding: 10px 20px; font-size: 0.9rem; }
  .btn-sun { background: var(--sun); color: var(--navy); padding: 10px 20px; font-size: 0.9rem; }
  .btn-teal { background: var(--teal); color: white; padding: 8px 16px; font-size: 0.85rem; }
  .btn-coral { background: var(--coral); color: white; padding: 8px 16px; font-size: 0.85rem; }
  .btn-ghost { background: var(--border); color: var(--text); padding: 8px 16px; font-size: 0.85rem; }
  .btn-sm { padding: 6px 12px; font-size: 0.78rem; }
  .btn-full { width: 100%; justify-content: center; padding: 14px; font-size: 1rem; border-radius: var(--radius); }
  .input { width: 100%; border: 2px solid var(--border); border-radius: 12px; padding: 10px 14px; font-family: 'Nunito', sans-serif; font-size: 0.9rem; outline: none; transition: border 0.2s; color: var(--text); }
  .input:focus { border-color: var(--navy); }
  .input-group { margin-bottom: 12px; }
  .input-label { font-size: 0.8rem; font-weight: 700; color: var(--muted); margin-bottom: 4px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
  .chore-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 14px; margin-bottom: 8px; border: 2px solid var(--border); transition: all 0.2s; background: white; }
  .chore-item.pending-approval { border-color: var(--sun); background: #FFFBEB; }
  .chore-item.approved { border-color: var(--teal); background: #F0FDF8; opacity: 0.7; }
  .chore-icon { font-size: 1.5rem; width: 40px; text-align: center; flex-shrink: 0; }
  .chore-info { flex: 1; min-width: 0; }
  .chore-name { font-weight: 700; font-size: 0.95rem; }
  .chore-sub { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
  .chore-pts { font-family: 'Baloo 2', cursive; font-weight: 700; color: var(--coral); font-size: 0.85rem; }
  .status-badge { font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
  .badge-pending { background: var(--sun); color: var(--navy); }
  .badge-approved { background: var(--teal); color: white; }
  .badge-todo { background: var(--border); color: var(--muted); }
  .member-card { display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 16px; background: white; border: 2px solid var(--border); margin-bottom: 10px; cursor: pointer; transition: all 0.2s; }
  .member-card:hover { border-color: var(--navy); transform: translateY(-2px); box-shadow: var(--shadow); }
  .member-avatar { font-size: 2rem; width: 48px; height: 48px; background: var(--bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .member-info { flex: 1; }
  .member-name { font-family: 'Baloo 2', cursive; font-weight: 700; font-size: 1rem; }
  .member-stats { font-size: 0.78rem; color: var(--muted); margin-top: 2px; }
  .member-pts { font-family: 'Baloo 2', cursive; font-weight: 800; font-size: 1.3rem; color: var(--coral); }
  .progress-wrap { margin: 8px 0; }
  .progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: var(--muted); margin-bottom: 4px; }
  .progress-bar { height: 10px; background: var(--border); border-radius: 50px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 50px; background: linear-gradient(90deg, var(--teal), var(--sky)); transition: width 0.5s; }
  .goal-card { background: linear-gradient(135deg, #1A1A2E, #2D2D4E); color: white; border-radius: var(--radius); padding: 16px; margin-bottom: 14px; }
  .goal-label { font-size: 0.75rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .goal-name { font-family: 'Baloo 2', cursive; font-size: 1.2rem; font-weight: 800; margin-bottom: 10px; }
  .login-screen { min-height: 100vh; background: var(--navy); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; gap: 16px; }
  .login-title { font-family: 'Baloo 2', cursive; font-size: 2.2rem; font-weight: 800; color: white; text-align: center; }
  .login-title span { color: var(--sun); }
  .login-subtitle { color: rgba(255,255,255,0.5); text-align: center; font-size: 0.9rem; margin-bottom: 8px; }
  .member-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; max-width: 340px; }
  .login-card { background: rgba(255,255,255,0.08); border: 2px solid rgba(255,255,255,0.12); border-radius: 18px; padding: 18px 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .login-card:hover { background: rgba(255,255,255,0.16); border-color: var(--sun); transform: translateY(-2px); }
  .login-card .emoji { font-size: 2.5rem; margin-bottom: 6px; }
  .login-card .name { font-family: 'Baloo 2', cursive; font-weight: 700; color: white; font-size: 0.95rem; }
  .login-card .role { font-size: 0.7rem; color: rgba(255,255,255,0.4); }
  .parent-btn { margin-top: 8px; background: rgba(255,209,102,0.15); border: 2px solid var(--sun); color: var(--sun); border-radius: 50px; padding: 10px 28px; font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
  .parent-btn:hover { background: var(--sun); color: var(--navy); }
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .section-title { font-family: 'Baloo 2', cursive; font-size: 1.1rem; font-weight: 700; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
  .modal { background: white; border-radius: 28px 28px 0 0; padding: 24px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.3s ease; }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .modal-title { font-family: 'Baloo 2', cursive; font-size: 1.3rem; font-weight: 800; margin-bottom: 16px; }
  .modal-actions { display: flex; gap: 10px; margin-top: 16px; }
  .avatar-grid { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0; }
  .avatar-opt { width: 44px; height: 44px; border-radius: 50%; background: var(--bg); border: 3px solid transparent; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; }
  .avatar-opt.selected { border-color: var(--navy); background: var(--sun); }
  .qr-hint { font-size: 0.75rem; color: var(--muted); display: flex; align-items: center; gap: 4px; margin-top: 4px; }
  .empty { text-align: center; padding: 32px 16px; color: var(--muted); }
  .empty-icon { font-size: 3rem; margin-bottom: 8px; }
  .empty-text { font-size: 0.9rem; }
  .notif-dot { width: 8px; height: 8px; background: var(--coral); border-radius: 50%; display: inline-block; margin-left: 4px; }
  .reward-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; border: 2px solid var(--border); margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
  .reward-item.selected { border-color: var(--teal); background: #F0FDF8; }
  .reward-pts { font-family: 'Baloo 2', cursive; font-weight: 700; color: var(--coral); font-size: 0.85rem; margin-left: auto; }
  .divider { height: 1px; background: var(--border); margin: 12px 0; }
  .tag { display: inline-flex; align-items: center; gap: 4px; background: var(--bg); border-radius: 50px; padding: 3px 10px; font-size: 0.75rem; font-weight: 700; color: var(--muted); }
  select.input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
  .onboard-screen { min-height: 100vh; background: var(--navy); display: flex; flex-direction: column; overflow: hidden; position: relative; }
  .onboard-slides { display: flex; flex: 1; transition: transform 0.45s cubic-bezier(0.4,0,0.2,1); }
  .onboard-slide { min-width: 100vw; max-width: 480px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 36px 28px 24px; text-align: center; gap: 16px; }
  .onboard-emoji { font-size: 5rem; animation: floatBob 3s ease-in-out infinite; }
  @keyframes floatBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  .onboard-tag { background: rgba(255,209,102,0.18); color: var(--sun); border-radius: 50px; padding: 4px 14px; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
  .onboard-title { font-family: 'Baloo 2', cursive; font-size: 2rem; font-weight: 800; color: white; line-height: 1.15; }
  .onboard-title span { color: var(--sun); }
  .onboard-desc { color: rgba(255,255,255,0.65); font-size: 1rem; line-height: 1.6; max-width: 320px; }
  .feature-list { list-style: none; width: 100%; max-width: 340px; display: flex; flex-direction: column; gap: 10px; text-align: left; }
  .feature-list li { display: flex; align-items: flex-start; gap: 10px; background: rgba(255,255,255,0.07); border-radius: 14px; padding: 12px 14px; color: rgba(255,255,255,0.85); font-size: 0.9rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.08); }
  .feature-list li .fi { font-size: 1.3rem; flex-shrink: 0; }
  .onboard-dots { display: flex; gap: 8px; justify-content: center; padding: 12px 0 4px; }
  .onboard-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.25); transition: all 0.3s; }
  .onboard-dot.active { background: var(--sun); width: 24px; border-radius: 50px; }
  .onboard-footer { padding: 16px 28px 32px; display: flex; flex-direction: column; gap: 10px; align-items: center; }
  .onboard-next { width: 100%; max-width: 340px; background: var(--sun); color: var(--navy); border: none; border-radius: 50px; padding: 16px; font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 800; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .onboard-next:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,209,102,0.35); }
  .onboard-skip { background: none; border: none; color: rgba(255,255,255,0.35); font-family: 'Nunito', sans-serif; font-size: 0.85rem; cursor: pointer; padding: 4px 12px; }
  .confetti-row { display: flex; justify-content: center; gap: 8px; font-size: 1.8rem; animation: fadeInUp 0.6s ease both; }
  @keyframes fadeInUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
`;const SLIDES = [
  { emoji:"🏠", tag:"Welcome to HomeBase", title:<>The app that <span>runs your home</span> — so you don't have to</>, desc:"No more chasing kids down to ask what got done. HomeBase puts every task, every person, and every reward in one place the whole family can see." },
  { emoji:"📋", tag:"For the Kids", title:<>Everyone knows <span>exactly</span> what to do</>, desc:"Each family member logs in with their own emoji avatar — no passwords needed — and sees their personal task list.", features:[{icon:"✅",text:"Tap a task to mark it done"},{icon:"⏳",text:"Task goes to mom for approval automatically"},{icon:"⭐",text:"Points are awarded the moment mom approves"}] },
  { emoji:"👑", tag:"For the Parent", title:<><span>You verify.</span> The app handles the rest.</>, desc:"Your dashboard shows every task waiting for your approval. You check it was done right, tap Approve, and points are awarded instantly.", features:[{icon:"🔔",text:"See all pending tasks in one spot"},{icon:"✓",text:"Approve or send back for a redo"},{icon:"📊",text:"Track every family member's progress"}] },
  { emoji:"🎯", tag:"Rewards System", title:<>Kids earn toward <span>goals they choose</span></>, desc:"You build the reward menu. Each kid picks what they're working toward and watches their progress bar fill up.", features:[{icon:"🎁",text:"Parent sets the reward options"},{icon:"🏆",text:"Kid picks their personal goal"},{icon:"📈",text:"Progress bar shows how close they are"}] },
  { emoji:"📱", tag:"How-To Tutorials", title:<>Never hear <span>"I don't know how"</span> again</>, desc:"Attach a tutorial video link to any task. Kids can scan a QR code posted at the station in your home and watch exactly how to do it.", features:[{icon:"🔗",text:"Link any YouTube or video tutorial"},{icon:"📷",text:"QR code generated for each station"},{icon:"🧺",text:"Post it on the washer, sink, door — anywhere"}] },
  { emoji:"🎉", tag:"You're all set!", title:<>Let's get your <span>family started</span></>, desc:"Add your family members, create tasks, build your reward menu — and let HomeBase do the rest." },
];

function OnboardingScreen({ onDone }) {
  const [slide, setSlide] = useState(0);
  const total = SLIDES.length;
  const current = SLIDES[slide];
  const isLast = slide === total - 1;
  return (
    <>
      <style>{styles}</style>
      <div className="onboard-screen">
        <div style={{ flex:1, overflow:"hidden", position:"relative" }}>
          <div className="onboard-slides" style={{ transform:`translateX(calc(-${slide * 100}vw))`, maxWidth:`${total * 480}px` }}>
            {SLIDES.map((s,i) => (
              <div key={i} className="onboard-slide">
                <div className="onboard-emoji">{s.emoji}</div>
                <div className="onboard-tag">{s.tag}</div>
                <h1 className="onboard-title">{s.title}</h1>
                <p className="onboard-desc">{s.desc}</p>
                {s.features && <ul className="feature-list">{s.features.map((f,fi) => <li key={fi}><span className="fi">{f.icon}</span>{f.text}</li>)}</ul>}
                {isLast && i === total-1 && <div className="confetti-row">🧹🍽️🧺🛏️🌿📚</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="onboard-dots">{SLIDES.map((_,i) => <div key={i} className={`onboard-dot${slide===i?" active":""}`} onClick={() => setSlide(i)} />)}</div>
        <div className="onboard-footer">
          <button className="onboard-next" onClick={() => isLast ? onDone() : setSlide(s => s+1)}>{isLast ? "🚀 Get Started!" : "Next →"}</button>
          {!isLast && <button className="onboard-skip" onClick={onDone}>Skip intro</button>}
        </div>
      </div>
    </>
  );
}

function LoginScreen({ members, onLogin }) {
  const kids = members.filter(m => m.role !== "parent");
  const parent = members.find(m => m.role === "parent");
  return (
    <>
      <style>{styles}</style>
      <div className="login-screen">
        <div><div className="login-title">Home<span>Base</span> 🏠</div><div className="login-subtitle">Who's checking in?</div></div>
        <div className="member-grid">
          {kids.map(m => <div key={m.id} className="login-card" onClick={() => onLogin(m)}><div className="emoji">{m.avatar}</div><div className="name">{m.name}</div><div className="role">⭐ {m.points} pts</div></div>)}
        </div>
        {parent && <button className="parent-btn" onClick={() => onLogin(parent)}>👑 Parent Dashboard</button>}
      </div>
    </>
  );
}

function KidTasksView({ currentUser, assignments, tasks, onMarkDone }) {
  const myAssignments = assignments.filter(a => a.member_id === currentUser.id);
  const todo = myAssignments.filter(a => a.status === "todo");
  const pending = myAssignments.filter(a => a.status === "pending_approval");
  const done = myAssignments.filter(a => a.status === "approved");
  return (
    <>
      <div className="card" style={{ background:"linear-gradient(135deg, #1A1A2E, #2D2D4E)", color:"white" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:"2.5rem" }}>{currentUser.avatar}</div>
          <div><div style={{ fontFamily:"'Baloo 2',cursive", fontSize:"1.2rem", fontWeight:800 }}>Hey, {currentUser.name}! 👋</div><div style={{ fontSize:"0.85rem", opacity:0.7 }}>{currentUser.points} points earned</div></div>
        </div>
      </div>
      {todo.length > 0 && <><div className="section-header"><span className="section-title">📋 To Do</span><span className="tag">{todo.length} left</span></div>{todo.map(a => { const task = getTask(a.task_id, tasks); if(!task) return null; return <div key={a.id} className="chore-item"><div className="chore-icon">{task.icon}</div><div className="chore-info"><div className="chore-name">{task.name}</div><div className="chore-sub">{task.station} · <span className="chore-pts">+{task.points} pts</span></div></div><button className="btn btn-teal btn-sm" onClick={() => onMarkDone(a.id)}>Done ✓</button></div>; })}</>}
      {pending.length > 0 && <><div className="divider" /><div className="section-header"><span className="section-title">⏳ Waiting for Approval</span></div>{pending.map(a => { const task = getTask(a.task_id, tasks); if(!task) return null; return <div key={a.id} className="chore-item pending-approval"><div className="chore-icon">{task.icon}</div><div className="chore-info"><div className="chore-name">{task.name}</div><div className="chore-sub">{task.station}</div></div><span className="status-badge badge-pending">Pending</span></div>; })}</>}
      {done.length > 0 && <><div className="divider" /><div className="section-header"><span className="section-title">✅ Completed</span></div>{done.map(a => { const task = getTask(a.task_id, tasks); if(!task) return null; return <div key={a.id} className="chore-item approved"><div className="chore-icon">{task.icon}</div><div className="chore-info"><div className="chore-name">{task.name}</div><div className="chore-sub">Approved ✓ · <span className="chore-pts">+{task.points} pts</span></div></div><span className="status-badge badge-approved">Done</span></div>; })}</>}
      {myAssignments.length === 0 && <div className="empty"><div className="empty-icon">🎉</div><div className="empty-text">No tasks assigned yet. Ask Mom!</div></div>}
    </>
  );
}

function KidGoalView({ currentUser, rewards, members, onSetGoal }) {
  const member = members.find(m => m.id === currentUser.id);
  const currentGoal = member?.goal_id ? rewards.find(r => r.id === member.goal_id) : null;
  const progress = currentGoal ? Math.min(100, Math.round((member.points / currentGoal.points_needed) * 100)) : 0;
  const [picking, setPicking] = useState(false);
  return (
    <>
      {currentGoal ? (
        <div className="goal-card">
          <div className="goal-label">🎯 Working toward</div>
          <div className="goal-name">{currentGoal.name}</div>
          <div className="progress-wrap"><div className="progress-label"><span>{member.points} pts</span><span>{currentGoal.points_needed} pts needed</span></div><div className="progress-bar"><div className="progress-fill" style={{ width:`${progress}%` }} /></div></div>
          <div style={{ marginTop:8, fontSize:"0.85rem", opacity:0.7 }}>{progress}% of the way there! 🚀</div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop:12 }} onClick={() => setPicking(true)}>Change Goal</button>
        </div>
      ) : (
        <div className="card" style={{ textAlign:"center", padding:24 }}>
          <div style={{ fontSize:"3rem", marginBottom:8 }}>🎯</div>
          <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:"1.1rem", fontWeight:700, marginBottom:8 }}>Pick a Reward Goal!</div>
          <div style={{ color:"var(--muted)", fontSize:"0.85rem", marginBottom:16 }}>Choose what you're working toward and start earning!</div>
          <button className="btn btn-sun" onClick={() => setPicking(true)}>Choose a Goal →</button>
        </div>
      )}
      {picking && <><div className="section-header" style={{ marginTop:8 }}><span className="section-title">🎁 Available Rewards</span></div>{rewards.map(r => <div key={r.id} className={`reward-item${member?.goal_id===r.id?" selected":""}`} onClick={() => { onSetGoal(r.id); setPicking(false); }}><span style={{ fontSize:"1.2rem" }}>🎁</span><span style={{ fontWeight:700 }}>{r.name}</span><span className="reward-pts">{r.points_needed} pts</span></div>)}</>}
      <div className="card" style={{ marginTop:8 }}>
        <div className="card-title">⭐ Your Total Points</div>
        <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:"3rem", fontWeight:800, color:"var(--coral)", textAlign:"center" }}>{member?.points || 0}</div>
        <div style={{ textAlign:"center", color:"var(--muted)", fontSize:"0.85rem" }}>Keep it up!</div>
      </div>
    </>
  );
}

function TutorialsView({ tasks, assignments, currentUser }) {
  const myTaskIds = assignments.filter(a => a.member_id === currentUser.id).map(a => a.task_id);
  const myTasks = tasks.filter(t => myTaskIds.includes(t.id));
  return (
    <>
      <div className="card-title" style={{ padding:"0 0 8px" }}>📱 Task Tutorials</div>
      <div style={{ color:"var(--muted)", fontSize:"0.85rem", marginBottom:16 }}>Scan a QR code at the station or tap a link below</div>
      {myTasks.map(task => (
        <div key={task.id} className="card">
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ fontSize:"2rem" }}>{task.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:700, fontSize:"1rem" }}>{task.name}</div>
              <div style={{ fontSize:"0.8rem", color:"var(--muted)" }}>{task.station}</div>
              {task.tutorial_url ? <a href={task.tutorial_url} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:4, marginTop:8, color:"var(--sky)", fontWeight:700, fontSize:"0.85rem", textDecoration:"none" }}>▶ Watch Tutorial →</a> : <div style={{ marginTop:8, fontSize:"0.8rem", color:"var(--muted)" }}>No tutorial added yet</div>}
            </div>
          </div>
        </div>
      ))}
      {myTasks.length === 0 && <div className="empty"><div className="empty-icon">📱</div><div className="empty-text">No tasks assigned yet</div></div>}
    </>
  );
    }function ParentApproveView({ assignments, tasks, members, onApprove, onReject }) {
  const pending = assignments.filter(a => a.status === "pending_approval");
  return (
    <>
      <div className="card-title" style={{ padding:"0 0 12px" }}>✅ Pending Approval{pending.length > 0 && <span style={{ background:"var(--coral)", color:"white", borderRadius:"50px", padding:"2px 10px", fontSize:"0.8rem", marginLeft:8 }}>{pending.length}</span>}</div>
      {pending.length === 0 ? <div className="empty"><div className="empty-icon">🎉</div><div className="empty-text">All caught up! No tasks waiting.</div></div> : pending.map(a => { const task = getTask(a.task_id, tasks); const member = getMember(a.member_id, members); if(!task||!member) return null; return <div key={a.id} className="card" style={{ borderLeft:"4px solid var(--sun)" }}><div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}><div style={{ fontSize:"1.8rem" }}>{task.icon}</div><div><div style={{ fontWeight:700 }}>{task.name}</div><div style={{ fontSize:"0.8rem", color:"var(--muted)" }}>{member.avatar} {member.name} · {task.station} · <span style={{ color:"var(--coral)", fontWeight:700 }}>+{task.points} pts</span></div></div></div><div style={{ display:"flex", gap:8 }}><button className="btn btn-teal" style={{ flex:1, justifyContent:"center" }} onClick={() => onApprove(a.id)}>✓ Approve & Award Points</button><button className="btn btn-ghost" onClick={() => onReject(a.id)}>✗ Redo</button></div></div>; })}
      <div className="divider" />
      <div className="section-header"><span className="section-title">📊 Recent Activity</span></div>
      {assignments.filter(a => a.status === "approved").slice(-5).reverse().map(a => { const task = getTask(a.task_id, tasks); const member = getMember(a.member_id, members); if(!task||!member) return null; return <div key={a.id} className="chore-item approved"><div className="chore-icon">{task.icon}</div><div className="chore-info"><div className="chore-name">{task.name}</div><div className="chore-sub">{member.avatar} {member.name}</div></div><span className="status-badge badge-approved">+{task.points}</span></div>; })}
    </>
  );
}

function FamilyView({ members, tasks, assignments, rewards, onAddMember, onViewMember }) {
  const kids = members.filter(m => m.role !== "parent");
  return (
    <>
      <div className="section-header"><span className="section-title">👨‍👩‍👧‍👦 Family Members</span><button className="btn btn-sun btn-sm" onClick={onAddMember}>+ Add</button></div>
      {kids.map(m => { const myDone = assignments.filter(a => a.member_id === m.id && a.status === "approved").length; const myPending = assignments.filter(a => a.member_id === m.id && a.status === "pending_approval").length; const goal = m.goal_id ? rewards.find(r => r.id === m.goal_id) : null; const progress = goal ? Math.min(100, Math.round((m.points / goal.points_needed) * 100)) : 0; return <div key={m.id} className="member-card" onClick={() => onViewMember(m)}><div className="member-avatar">{m.avatar}</div><div className="member-info"><div className="member-name">{m.name}</div><div className="member-stats">✅ {myDone} done · {myPending > 0 ? `⏳ ${myPending} pending` : "none pending"}</div>{goal && <div className="progress-wrap" style={{ marginTop:6 }}><div className="progress-label"><span style={{ fontSize:"0.7rem" }}>🎯 {goal.name}</span><span style={{ fontSize:"0.7rem" }}>{progress}%</span></div><div className="progress-bar" style={{ height:6 }}><div className="progress-fill" style={{ width:`${progress}%` }} /></div></div>}</div><div className="member-pts">{m.points}<span style={{ fontSize:"0.6rem", color:"var(--muted)", display:"block", textAlign:"right" }}>pts</span></div></div>; })}
      {kids.length === 0 && <div className="empty"><div className="empty-icon">👪</div><div className="empty-text">No family members added yet</div></div>}
    </>
  );
}

function ManageView({ tasks, members, assignments, onAddTask, onAssign }) {
  return (
    <>
      <div className="section-header"><span className="section-title">🏠 Tasks & Stations</span><button className="btn btn-sun btn-sm" onClick={onAddTask}>+ Add Task</button></div>
      {tasks.map(task => { const assignedTo = assignments.filter(a => a.task_id === task.id).map(a => members.find(m => m.id === a.member_id)).filter(Boolean); return <div key={task.id} className="card"><div style={{ display:"flex", gap:10, alignItems:"flex-start" }}><div style={{ fontSize:"1.8rem" }}>{task.icon}</div><div style={{ flex:1 }}><div style={{ fontWeight:700 }}>{task.name}</div><div style={{ fontSize:"0.78rem", color:"var(--muted)", marginTop:2 }}>{task.station} · {task.frequency} · <span style={{ color:"var(--coral)", fontWeight:700 }}>+{task.points} pts</span></div>{assignedTo.length > 0 && <div style={{ marginTop:6, display:"flex", gap:4, flexWrap:"wrap" }}>{assignedTo.map(m => <span key={m.id} className="tag">{m.avatar} {m.name}</span>)}</div>}{task.tutorial_url && <div className="qr-hint">📱 Tutorial linked</div>}</div><button className="btn btn-ghost btn-sm" onClick={() => onAssign(task)}>Assign</button></div></div>; })}
    </>
  );
}

function RewardsView({ rewards, members, onAddReward }) {
  return (
    <>
      <div className="section-header"><span className="section-title">🎁 Reward Menu</span><button className="btn btn-sun btn-sm" onClick={onAddReward}>+ Add</button></div>
      <div style={{ color:"var(--muted)", fontSize:"0.85rem", marginBottom:12 }}>Kids pick what they want to earn toward from this list</div>
      {rewards.map(r => { const earningKids = members.filter(m => m.goal_id === r.id); return <div key={r.id} className="card"><div style={{ display:"flex", alignItems:"center", gap:10 }}><span style={{ fontSize:"1.5rem" }}>🎁</span><div style={{ flex:1 }}><div style={{ fontWeight:700 }}>{r.name}</div>{earningKids.length > 0 && <div style={{ marginTop:4, fontSize:"0.75rem", color:"var(--sky)" }}>🎯 {earningKids.map(k => k.name).join(", ")} working toward this</div>}</div><span className="reward-pts">{r.points_needed} pts</span></div></div>; })}
    </>
  );
}

function AddMemberModal({ onSave, onClose }) {
  const [name, setName] = useState(""); const [avatar, setAvatar] = useState(AVATARS[0]); const [ageGroup, setAgeGroup] = useState("kid");
  return <><div className="modal-title">👤 Add Family Member</div><div className="input-group"><label className="input-label">Name</label><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" /></div><div className="input-group"><label className="input-label">Age Group</label><select className="input" value={ageGroup} onChange={e => setAgeGroup(e.target.value)}><option value="little">Little (under 7)</option><option value="kid">Kid (7-12)</option><option value="teen">Teen (13+)</option></select></div><div className="input-group"><label className="input-label">Avatar</label><div className="avatar-grid">{AVATARS.map(a => <div key={a} className={`avatar-opt${avatar===a?" selected":""}`} onClick={() => setAvatar(a)}>{a}</div>)}</div></div><div className="modal-actions"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => name && onSave({ name, avatar, role:"child", age_group:ageGroup })}>Add Member</button></div></>;
}

function AddTaskModal({ onSave, onClose }) {
  const [name, setName] = useState(""); const [icon, setIcon] = useState(TASK_ICONS[0]); const [points, setPoints] = useState(20); const [frequency, setFrequency] = useState("daily"); const [station, setStation] = useState(""); const [tutorialUrl, setTutorialUrl] = useState("");
  return <><div className="modal-title">🏠 Add New Task</div><div className="input-group"><label className="input-label">Task Name</label><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vacuum Living Room" /></div><div className="input-group"><label className="input-label">Station / Location</label><input className="input" value={station} onChange={e => setStation(e.target.value)} placeholder="e.g. Living Room" /></div><div style={{ display:"flex", gap:10 }}><div className="input-group" style={{ flex:1 }}><label className="input-label">Points</label><input className="input" type="number" value={points} onChange={e => setPoints(Number(e.target.value))} /></div><div className="input-group" style={{ flex:1 }}><label className="input-label">Frequency</label><select className="input" value={frequency} onChange={e => setFrequency(e.target.value)}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></div></div><div className="input-group"><label className="input-label">Icon</label><div className="avatar-grid">{TASK_ICONS.map(i => <div key={i} className={`avatar-opt${icon===i?" selected":""}`} onClick={() => setIcon(i)}>{i}</div>)}</div></div><div className="input-group"><label className="input-label">Tutorial URL (optional)</label><input className="input" value={tutorialUrl} onChange={e => setTutorialUrl(e.target.value)} placeholder="https://youtube.com/..." /></div><div className="modal-actions"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => name && onSave({ name, icon, points, frequency, station, tutorial_url:tutorialUrl })}>Add Task</button></div></>;
}

function AssignTaskModal({ task, members, assignments, onAssign, onClose }) {
  return <><div className="modal-title">Assign: {task.icon} {task.name}</div><div style={{ color:"var(--muted)", fontSize:"0.85rem", marginBottom:14 }}>Tap a family member to assign this task</div>{members.map(m => { const already = assignments.find(a => a.member_id === m.id && a.task_id === task.id); return <div key={m.id} className={`reward-item${already?" selected":""}`} onClick={() => !already && onAssign(m.id, task.id)}><span style={{ fontSize:"1.3rem" }}>{m.avatar}</span><span style={{ fontWeight:700 }}>{m.name}</span>{already && <span style={{ marginLeft:"auto", color:"var(--teal)", fontWeight:700, fontSize:"0.8rem" }}>✓ Assigned</span>}</div>; })}<div className="modal-actions"><button className="btn btn-ghost btn-full" onClick={onClose}>Done</button></div></>;
}

function AddRewardModal({ onSave, onClose }) {
  const [name, setName] = useState(""); const [points, setPoints] = useState(100); const [ageGroup, setAgeGroup] = useState("all");
  return <><div className="modal-title">🎁 Add Reward</div><div className="input-group"><label className="input-label">Reward Name</label><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Extra Screen Time" /></div><div style={{ display:"flex", gap:10 }}><div className="input-group" style={{ flex:1 }}><label className="input-label">Points Needed</label><input className="input" type="number" value={points} onChange={e => setPoints(Number(e.target.value))} /></div><div className="input-group" style={{ flex:1 }}><label className="input-label">Age Group</label><select className="input" value={ageGroup} onChange={e => setAgeGroup(e.target.value)}><option value="all">All Ages</option><option value="little">Little</option><option value="kid">Kid</option><option value="teen">Teen</option></select></div></div><div className="modal-actions"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-sun" onClick={() => name && onSave({ name, points_needed:points, age_group:ageGroup })}>Add Reward</button></div></>;
}

function MemberDetailModal({ member, tasks, assignments, rewards, onClose }) {
  const myAssignments = assignments.filter(a => a.member_id === member.id);
  const goal = member.goal_id ? rewards.find(r => r.id === member.goal_id) : null;
  const progress = goal ? Math.min(100, Math.round((member.points / goal.points_needed) * 100)) : 0;
  return <><div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}><div style={{ fontSize:"3rem" }}>{member.avatar}</div><div><div className="modal-title" style={{ margin:0 }}>{member.name}</div><div style={{ color:"var(--muted)", fontSize:"0.85rem" }}>{member.age_group} · {member.points} points</div></div></div>{goal && <div style={{ marginBottom:16 }}><div style={{ fontWeight:700, fontSize:"0.85rem", marginBottom:4 }}>🎯 Goal: {goal.name}</div><div className="progress-bar"><div className="progress-fill" style={{ width:`${progress}%` }} /></div><div style={{ fontSize:"0.75rem", color:"var(--muted)", marginTop:4 }}>{progress}% complete</div></div>}<div style={{ fontWeight:700, marginBottom:8 }}>Assigned Tasks</div>{myAssignments.map(a => { const task = tasks.find(t => t.id === a.task_id); if(!task) return null; return <div key={a.id} className="chore-item" style={{ marginBottom:6 }}><div className="chore-icon" style={{ fontSize:"1.2rem", width:32 }}>{task.icon}</div><div className="chore-info"><div style={{ fontWeight:700, fontSize:"0.9rem" }}>{task.name}</div></div><span className={`status-badge ${a.status==="approved"?"badge-approved":a.status==="pending_approval"?"badge-pending":"badge-todo"}`}>{a.status==="approved"?"Done":a.status==="pending_approval"?"Pending":"To Do"}</span></div>; })}<div className="modal-actions"><button className="btn btn-ghost btn-full" onClick={onClose}>Close</button></div></>;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tab, setTab] = useState("tasks");
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem("homebase_onboarded") === "1");

  const finishOnboarding = () => { localStorage.setItem("homebase_onboarded","1"); setOnboarded(true); };

  const loadAll = async () => {
    try {
      setLoading(true);
      const [m,t,a,r] = await Promise.all([supaFetch("/members?order=created_at"),supaFetch("/tasks?order=created_at"),supaFetch("/assignments?order=created_at"),supaFetch("/rewards?order=created_at")]);
      setMembers(Array.isArray(m)?m:[]); setTasks(Array.isArray(t)?t:[]); setAssignments(Array.isArray(a)?a:[]); setRewards(Array.isArray(r)?r:[]);
      setError(null);
    } catch(e) { setError("Couldn't connect. Check your Supabase setup."); } finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const isParent = currentUser?.role === "parent";
  const pendingCount = assignments.filter(a => a.status === "pending_approval").length;

  const markDone = async (id) => { await supaFetch(`/assignments?id=eq.${id}`,{method:"PATCH",body:JSON.stringify({status:"pending_approval",completed_at:new Date().toISOString()})}); await loadAll(); };
  const approveTask = async (id) => { const a=assignments.find(x=>x.id===id); const task=getTask(a.task_id,tasks); const member=getMember(a.member_id,members); await supaFetch(`/assignments?id=eq.${id}`,{method:"PATCH",body:JSON.stringify({status:"approved"})}); await supaFetch(`/members?id=eq.${a.member_id}`,{method:"PATCH",body:JSON.stringify({points:(member.points||0)+task.points})}); await loadAll(); };
  const rejectTask = async (id) => { await supaFetch(`/assignments?id=eq.${id}`,{method:"PATCH",body:JSON.stringify({status:"todo",completed_at:null})}); await loadAll(); };
  const addMember = async (data) => { await supaFetch("/members",{method:"POST",body:JSON.stringify({...data,points:0,goal_id:null})}); await loadAll(); setModal(null); };
  const addTask = async (data) => { await supaFetch("/tasks",{method:"POST",body:JSON.stringify(data)}); await loadAll(); setModal(null); };
  const assignTask = async (memberId,taskId) => { const exists=assignments.find(a=>a.member_id===memberId&&a.task_id===taskId); if(!exists){await supaFetch("/assignments",{method:"POST",body:JSON.stringify({member_id:memberId,task_id:taskId,status:"todo"})}); await loadAll();} setModal(null); };
  const setGoal = async (memberId,rewardId) => { await supaFetch(`/members?id=eq.${memberId}`,{method:"PATCH",body:JSON.stringify({goal_id:rewardId})}); await loadAll(); setModal(null); };
  const addReward = async (data) => { await supaFetch("/rewards",{method:"POST",body:JSON.stringify(data)}); await loadAll(); setModal(null); };

  if(!onboarded) return <OnboardingScreen onDone={finishOnboarding} />;
  if(loading) return <><style>{styles}</style><div style={{minHeight:"100vh",background:"#1A1A2E",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}><div style={{fontSize:"3rem"}}>🏠</div><div style={{fontFamily:"'Baloo 2',cursive",color:"white",fontSize:"1.2rem"}}>Loading HomeBase…</div></div></>;
  if(error) return <><style>{styles}</style><div style={{minHeight:"100vh",background:"#1A1A2E",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:24,textAlign:"center"}}><div style={{fontSize:"3rem"}}>⚠️</div><div style={{fontFamily:"'Baloo 2',cursive",color:"white",fontSize:"1.1rem"}}>{error}</div><button className="btn btn-sun" onClick={loadAll}>Try Again</button></div></>;
  if(!currentUser) return <LoginScreen members={members} onLogin={setCurrentUser} />;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <span className="brand">Home<span>Base</span></span>
          <span style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.4)",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"Nunito,sans-serif",fontWeight:700}}>by Harlo</span>
          <div className="header-right"><div className="avatar-pill" onClick={() => setCurrentUser(null)}><div className="avatar-circle">{currentUser.avatar}</div><span>{currentUser.name}</span></div></div>
        </header>
        <nav className="nav">
          {isParent ? <>
            <button className={`nav-tab${tab==="approve"?" active":""}`} onClick={() => setTab("approve")}><span className="tab-icon">✅</span>Approve{pendingCount>0&&<span className="notif-dot"/>}</button>
            <button className={`nav-tab${tab==="family"?" active":""}`} onClick={() => setTab("family")}><span className="tab-icon">👨‍👩‍👧‍👦</span>Family</button>
            <button className={`nav-tab${tab==="manage"?" active":""}`} onClick={() => setTab("manage")}><span className="tab-icon">⚙️</span>Manage</button>
            <button className={`nav-tab${tab==="rewards"?" active":""}`} onClick={() => setTab("rewards")}><span className="tab-icon">🎁</span>Rewards</button>
          </> : <>
            <button className={`nav-tab${tab==="tasks"?" active":""}`} onClick={() => setTab("tasks")}><span className="tab-icon">📋</span>My Tasks</button>
            <button className={`nav-tab${tab==="goal"?" active":""}`} onClick={() => setTab("goal")}><span className="tab-icon">🎯</span>My Goal</button>
            <button className={`nav-tab${tab==="tutorials"?" active":""}`} onClick={() => setTab("tutorials")}><span className="tab-icon">📱</span>How-To</button>
          </>}
        </nav>
        <main className="page">
          {!isParent && tab==="tasks" && <KidTasksView currentUser={currentUser} assignments={assignments} tasks={tasks} members={members} onMarkDone={markDone}/>}
          {!isParent && tab==="goal" && <KidGoalView currentUser={currentUser} rewards={rewards} members={members} onSetGoal={(rid) => setGoal(currentUser.id,rid)}/>}
          {!isParent && tab==="tutorials" && <TutorialsView tasks={tasks} assignments={assignments} currentUser={currentUser}/>}
          {isParent && tab==="approve" && <ParentApproveView assignments={assignments} tasks={tasks} members={members} onApprove={approveTask} onReject={rejectTask}/>}
          {isParent && tab==="family" && <FamilyView members={members} tasks={tasks} assignments={assignments} rewards={rewards} onAddMember={() => setModal({type:"addMember"})} onViewMember={(m) => setModal({type:"memberDetail",data:m})}/>}
          {isParent && tab==="manage" && <ManageView tasks={tasks} members={members} assignments={assignments} onAddTask={() => setModal({type:"addTask"})} onAssign={(task) => setModal({type:"assignTask",data:task})}/>}
          {isParent && tab==="rewards" && <RewardsView rewards={rewards} members={members} onAddReward={() => setModal({type:"addReward"})}/>}
        </main>
        {modal && <div className="modal-overlay" onClick={() => setModal(null)}><div className="modal" onClick={e => e.stopPropagation()}>
          {modal.type==="addMember" && <AddMemberModal onSave={addMember} onClose={() => setModal(null)}/>}
          {modal.type==="addTask" && <AddTaskModal onSave={addTask} onClose={() => setModal(null)}/>}
          {modal.type==="assignTask" && <AssignTaskModal task={modal.data} members={members.filter(m=>m.role!=="parent")} assignments={assignments} onAssign={assignTask} onClose={() => setModal(null)}/>}
          {modal.type==="addReward" && <AddRewardModal onSave={addReward} onClose={() => setModal(null)}/>}
          {modal.type==="memberDetail" && <MemberDetailModal member={modal.data} tasks={tasks} assignments={assignments} rewards={rewards} onClose={() => setModal(null)}/>}
        </div></div>}
      </div>
    </>
  );
                                            }
