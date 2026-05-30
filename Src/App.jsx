function ParentApproveView({ assignments, tasks, members, onApprove, onReject }) {
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
