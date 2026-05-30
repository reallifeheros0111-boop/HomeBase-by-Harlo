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
const getReward = (id, rewards) => rewards.find(r => r.id === id);
const styles = `
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
`;
