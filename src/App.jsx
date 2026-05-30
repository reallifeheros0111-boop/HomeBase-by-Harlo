const SLIDES = [
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
  }
