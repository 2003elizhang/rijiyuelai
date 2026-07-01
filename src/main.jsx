import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const expensesSeed = [
  { id: 1, type: "expense", name: "早餐", note: "豆浆和包子", amount: 8, time: "08:16", icon: "🥣" },
  { id: 2, type: "expense", name: "通勤", note: "地铁", amount: 6, time: "09:02", icon: "🚇" },
  { id: 3, type: "expense", name: "午餐", note: "公司楼下", amount: 18, time: "12:27", icon: "🍱" },
];

const categories = [
  { name: "餐饮", icon: "🥣" },
  { name: "交通", icon: "🚇" },
  { name: "购物", icon: "🛍️" },
  { name: "娱乐", icon: "🎧" },
  { name: "其他", icon: "✨" },
];

const incomeCategories = [
  { name: "工资", icon: "💼" },
  { name: "兼职", icon: "🧾" },
  { name: "红包", icon: "🧧" },
  { name: "退款", icon: "↩️" },
  { name: "其他收入", icon: "✨" },
];

const DEFAULT_MEAL_BASELINE = 50;
const DEFAULT_MONTHLY_PLAN = {
  purpose: "大疆 Mavic 4",
  saveTarget: 3000,
  savedBase: 1280,
  spentBase: 820,
  daysInMonth: 30,
};
const DEFAULT_YEARLY_GOAL = {
  purpose: "年底前存下一笔安全感",
  saveTarget: 36000,
  savedBase: 12500,
};
const foodExpenseNames = new Set(["早餐", "午餐", "晚餐", "餐饮"]);

const teammates = [
  { name: "阿岚", initials: "岚", color: "#ffc978", percent: 42, streak: 7, status: "今天很稳", goal: "年底去看一次演唱会", goalPercent: 58, goalDelta: 2 },
  { name: "小禾", initials: "禾", color: "#a6d8b2", percent: 68, streak: 4, status: "快到提醒线", goal: "攒下考证报名费", goalPercent: 33, goalDelta: 1 },
  { name: "你", initials: "我", color: "#7fbea0", percent: 32, streak: 9, status: "守住了", goal: "", goalPercent: 42, goalDelta: 3 },
  { name: "石头", initials: "石", color: "#b8c7e8", percent: 83, streak: 2, status: "需要鼓励", goal: "减少点外卖", goalPercent: 71, goalDelta: 0 },
];

function Icon({ name, size = 22 }) {
  const paths = {
    home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10.5V20h13v-9.5M9 20v-6h6v6" /></>,
    add: <><path d="M12 5v14M5 12h14" /></>,
    team: <><path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 20v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.83 2.83-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.4 1.08V21h-4v-.08A1.65 1.65 0 0 0 8.6 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06-2.83-2.83.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.08-.4H3v-4h.08A1.65 1.65 0 0 0 4.6 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06 2.83-2.83.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .4-1.08V3h4v.08A1.65 1.65 0 0 0 15.4 4a1.65 1.65 0 0 0 1.82-.33l.06-.06 2.83 2.83-.06.06A1.65 1.65 0 0 0 19.4 9c.14.37.36.7.65.98.3.28.69.43 1.1.42H21v4h-.08a1.65 1.65 0 0 0-1.52.6Z" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    comment: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3v-7a4 4 0 0 1-1-2.6V7a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    backspace: <><path d="M21 4H8l-6 8 6 8h13a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z" /><path d="m10 9 6 6m0-6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Sprout({ compact = false }) {
  return (
    <div className={`sprout ${compact ? "compact" : ""}`} aria-hidden="true">
      <span className="leaf leaf-left" />
      <span className="leaf leaf-right" />
      <span className="stem" />
      <span className="soil" />
    </div>
  );
}

function ProgressRing({ percent, remaining }) {
  const clamped = Math.min(percent, 100);
  const tone = percent >= 100 ? "#ee755f" : percent >= 70 ? "#e7a54e" : "#2f9c70";
  return (
    <div className="ring-wrap">
      <div className="progress-ring" style={{ "--progress": `${clamped * 3.6}deg`, "--tone": tone }}>
        <div className="ring-inner">
          <span>今日还能花</span>
          <strong>¥{Math.max(remaining, 0).toFixed(0)}</strong>
          <small>{percent.toFixed(0)}% 已使用</small>
        </div>
      </div>
      <div className="ring-orbit orbit-one" />
      <div className="ring-orbit orbit-two" />
    </div>
  );
}

function MonthlyPlanCard({ plan, stats, onEdit }) {
  return (
    <section className="monthly-plan-card" onClick={onEdit} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onEdit()}>
      <div className="monthly-plan-head">
        <div>
          <p>本月个人计划</p>
          <h2>为了 {plan.purpose}</h2>
        </div>
        <button onClick={(event) => { event.stopPropagation(); onEdit(); }}>编辑</button>
      </div>
      <div className="monthly-progress-row">
        <strong>{stats.progress}%</strong>
        <span>已攒 ¥{stats.saved.toLocaleString()} / 预计攒 ¥{plan.saveTarget.toLocaleString()}</span>
      </div>
      <div className="monthly-progress-track"><i style={{ width: `${stats.progress}%` }} /></div>
      <div className="monthly-metrics">
        <div><span>本月已攒</span><strong>¥{stats.saved.toLocaleString()}</strong></div>
        <div><span>本月已花</span><strong>¥{stats.monthlySpent.toLocaleString()}</strong></div>
        <div><span>本月预算</span><strong>¥{stats.monthlyBudget.toLocaleString()}</strong></div>
      </div>
      <p className="monthly-plan-note">点这里改目标、预计攒多少、每天最多花多少。</p>
    </section>
  );
}

function YearlyGoalCard({ goal, stats, onEdit }) {
  return (
    <section className="yearly-goal-card" onClick={onEdit} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onEdit()}>
      <div className="yearly-goal-copy">
        <p>年度目标 · 可选</p>
        <h2>{goal.purpose || "今年想完成什么？"}</h2>
        <span>点这里设置每年的目标，也可以先不填。</span>
      </div>
      <div className="yearly-goal-progress">
        <strong>{stats.progress}%</strong>
        <small>已攒 ¥{stats.saved.toLocaleString()} / 目标 ¥{goal.saveTarget.toLocaleString()}</small>
        <div><i style={{ width: `${stats.progress}%` }} /></div>
      </div>
      <div className="yearly-goal-metrics">
        <div><span>今年已攒</span><strong>¥{stats.saved.toLocaleString()}</strong></div>
        <div><span>还差</span><strong>¥{stats.left.toLocaleString()}</strong></div>
        <div><span>本月贡献</span><strong>¥{stats.monthlySaved.toLocaleString()}</strong></div>
      </div>
    </section>
  );
}

function HomeScreen({ dailyLimit, mealBaseline, monthlyPlan, yearlyGoal, carryRatio, expenses, onAdd, onEndDay, onSettings, onMealSettings, onMonthlyPlanSettings, onYearlyGoalSettings }) {
  const spent = expenses.reduce((total, item) => item.type !== "income" ? total + item.amount : total, 0);
  const income = expenses.reduce((total, item) => item.type === "income" ? total + item.amount : total, 0);
  const countedIncome = expenses.reduce((total, item) => item.type === "income" && item.countsTowardGoal ? total + item.amount : total, 0);
  const mealSpend = expenses.reduce((total, item) => item.type !== "income" && foodExpenseNames.has(item.name) ? total + item.amount : total, 0);
  const remaining = dailyLimit - spent;
  const positiveRemaining = Math.max(remaining, 0);
  const saved = positiveRemaining * ((100 - carryRatio) / 100);
  const percent = (spent / dailyLimit) * 100;
  const mealPercent = Math.min((mealSpend / mealBaseline) * 100, 100);
  const monthlySaved = monthlyPlan.savedBase + countedIncome + saved;
  const monthlySpent = monthlyPlan.spentBase + spent;
  const monthlyBudget = dailyLimit * monthlyPlan.daysInMonth;
  const monthlyProgress = Math.min(Math.round((monthlySaved / monthlyPlan.saveTarget) * 100), 100);
  const monthlyStats = {
    saved: Math.round(monthlySaved),
    monthlySpent: Math.round(monthlySpent),
    monthlyBudget: Math.round(monthlyBudget),
    progress: Number.isFinite(monthlyProgress) ? monthlyProgress : 0,
  };
  const yearlySaved = yearlyGoal.savedBase + monthlySaved;
  const yearlyProgress = Math.min(Math.round((yearlySaved / yearlyGoal.saveTarget) * 100), 100);
  const yearlyStats = {
    saved: Math.round(yearlySaved),
    left: Math.max(Math.round(yearlyGoal.saveTarget - yearlySaved), 0),
    monthlySaved: Math.round(monthlySaved),
    progress: Number.isFinite(yearlyProgress) ? yearlyProgress : 0,
  };
  const mealCareText = mealSpend < mealBaseline
    ? "好好吃饭"
    : mealSpend === mealBaseline
      ? "吃饱了就好"
      : "多吃点没事";

  return (
    <main className="screen-content home-screen">
      <header className="topbar">
        <div>
          <p className="date-label">6月7日 · 星期日</p>
          <h1>记账·日记月累</h1>
        </div>
        <button className="icon-button" onClick={onSettings} aria-label="预算设置"><Icon name="settings" /></button>
      </header>

      <section className="budget-stage">
        <div className="budget-card">
          <div className="budget-main-copy">
            <p>今天还能花</p>
            <strong>¥{Math.max(remaining, 0).toFixed(0)}</strong>
            <span>预算 ¥{dailyLimit.toFixed(0)} · 已花 ¥{spent.toFixed(0)}</span>
          </div>
          <ProgressRing percent={percent} remaining={remaining} />
        </div>
        <div className="home-actions-row">
          <button className="primary-action" onClick={onAdd}><Icon name="add" />快速记一笔</button>
          <button className="end-day-action" onClick={onEndDay}>
            <b>今日结束</b>
            <span>计算明天额度</span>
          </button>
        </div>
      </section>

      <MonthlyPlanCard plan={monthlyPlan} stats={monthlyStats} onEdit={onMonthlyPlanSettings} />

      <section className={`meal-safety-card ${mealSpend >= mealBaseline ? "complete" : ""}`}>
        <div className="meal-safety-head">
          <div>
            <p>餐饮及格线 · 今日累计 ¥{mealSpend.toFixed(0)}</p>
            <h2>吃饭至少 ¥{mealBaseline.toFixed(0)} <span>可按你的饭量调整</span></h2>
          </div>
          <button className="meal-bowl" onClick={onMealSettings} aria-label="设置餐饮预算">
            <span>🥣</span>
            <small>预算</small>
          </button>
        </div>
        <div className="meal-progress"><i style={{ width: `${mealPercent}%` }} /></div>
        <div className="meal-amount-row"><span>已吃 ¥{mealSpend.toFixed(0)}</span><strong>基准线 ¥{mealBaseline.toFixed(0)}</strong></div>
        <p className="meal-care-title">{mealCareText}</p>
      </section>

      <YearlyGoalCard goal={yearlyGoal} stats={yearlyStats} onEdit={onYearlyGoalSettings} />

      <section className="section-block recent-block">
        <div className="section-title-row"><h2>今天的记录</h2><span>支出 ¥{spent.toFixed(0)} · 收入 ¥{income.toFixed(0)}</span></div>
        <div className="expense-list">
          {expenses.slice().reverse().map((item) => (
            <div className={`expense-row ${item.type === "income" ? "income" : ""}`} key={item.id}>
              <span className="expense-icon">{item.icon}</span>
              <div className="expense-copy"><strong>{item.name}</strong><small>{item.note} · {item.time}</small></div>
              <b>{item.type === "income" ? "+" : "-"}¥{item.amount.toFixed(0)}</b>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function AddScreen({ onSubmit }) {
  const [entryType, setEntryType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [note, setNote] = useState("");
  const [countsTowardGoal, setCountsTowardGoal] = useState(true);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"];
  const activeCategories = entryType === "expense" ? categories : incomeCategories;

  const switchType = (type) => {
    setEntryType(type);
    setCategory(type === "expense" ? categories[0] : incomeCategories[0]);
  };

  const pressKey = (key) => {
    if (key === "backspace") return setAmount((value) => value.slice(0, -1));
    if (key === "." && amount.includes(".")) return;
    if (amount.length < 7) setAmount((value) => value + key);
  };

  const submit = () => {
    const numeric = Number(amount);
    if (!numeric || numeric <= 0) return;
    onSubmit({ type: entryType, amount: numeric, category, note: note || category.name, countsTowardGoal });
    setAmount("");
    setNote("");
  };

  return (
    <main className="screen-content add-screen">
      <header className="simple-header">
        <div><p className="date-label">越快越容易坚持</p><h1>快速记一笔</h1></div>
        <span className="mini-sprout"><Sprout compact /></span>
      </header>

      <div className="entry-type-switch">
        <button className={entryType === "expense" ? "active" : ""} onClick={() => switchType("expense")}>支出</button>
        <button className={entryType === "income" ? "active income" : ""} onClick={() => switchType("income")}>收入</button>
      </div>

      <section className={`amount-entry ${entryType}`}>
        <p>{entryType === "income" ? "记录一笔真实收入" : "记录一笔真实支出"}</p>
        <span>¥</span>
        <strong className={amount ? "" : "placeholder"}>{amount || "0"}</strong>
      </section>

      <section className="category-picker" aria-label={entryType === "expense" ? "消费分类" : "收入分类"}>
        {activeCategories.map((item) => (
          <button className={category.name === item.name ? "selected" : ""} key={item.name} onClick={() => setCategory(item)}>
            <span>{item.icon}</span><small>{item.name}</small>
          </button>
        ))}
      </section>

      <label className="note-field">
        <span>{category.icon}</span>
        <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="写一句也行，不写也行" />
      </label>

      {entryType === "income" ? (
        <label className="goal-income-toggle">
          <input type="checkbox" checked={countsTowardGoal} onChange={(event) => setCountsTowardGoal(event.target.checked)} />
          <span><strong>计入我的储蓄目标</strong><small>只有你明确选择后，这笔收入才推动目标进度</small></span>
        </label>
      ) : null}

      <section className="keypad">
        {keys.map((key) => (
          <button key={key} onClick={() => pressKey(key)} aria-label={key === "backspace" ? "删除" : key}>
            {key === "backspace" ? <Icon name="backspace" size={24} /> : key}
          </button>
        ))}
      </section>

      <button className="submit-expense" disabled={!Number(amount)} onClick={submit}>
        <Icon name="check" />记下{entryType === "income" ? "收入" : "支出"} ¥{Number(amount || 0).toFixed(0)}
      </button>
      <p className="microcopy">{entryType === "income" ? "收入与支出分开记录，目标进度不会凭空增加。" : "只记金额也可以，别让分类成为负担。"}</p>
    </main>
  );
}

function TeamScreen() {
  const [teamGoal, setTeamGoal] = useState("暑假一起去看海");
  const [teamGoalDraft, setTeamGoalDraft] = useState(teamGoal);
  const [teamGoalTarget, setTeamGoalTarget] = useState(6000);
  const [teamGoalTargetDraft, setTeamGoalTargetDraft] = useState(teamGoalTarget);
  const [editingTeamGoal, setEditingTeamGoal] = useState(false);
  const [postDraft, setPostDraft] = useState("");
  const [commentDrafts, setCommentDrafts] = useState({});
  const [posts, setPosts] = useState([
    {
      id: "lan",
      author: "阿岚",
      initials: "岚",
      color: "#ffc978",
      time: "刚刚",
      badge: "连续守住 7 天",
      text: "差点想点夜宵，最后还是关掉了。今天又离演唱会近了 2%。",
      progress: 58,
      reactions: { like: 6, laugh: 2, dislike: 0 },
      comments: [
        { author: "小禾", text: "太强了，我刚刚也把奶茶购物车清空了。" },
        { author: "石头", text: "这不得奖励一首现场版先听着？" },
      ],
    },
    {
      id: "stone",
      author: "石头",
      initials: "石",
      color: "#b8c7e8",
      time: "18 分钟前",
      badge: "今天用了 83% 预算",
      text: "下午没忍住买了杯奶茶。今天先不装了，求队友骂醒。",
      progress: null,
      reactions: { like: 3, laugh: 1, dislike: 2 },
      comments: [
        { author: "阿岚", text: "一杯没关系，晚饭别再点贵的就行。" },
      ],
    },
    {
      id: "he",
      author: "小禾",
      initials: "禾",
      color: "#a6d8b2",
      time: "1 小时前",
      badge: "目标又近了 1%",
      text: "今天自己带饭，考证报名费进度到 33% 了。",
      progress: 33,
      reactions: { like: 8, laugh: 3, dislike: 0 },
      comments: [],
    },
  ]);
  const teamSaved = 2380;
  const teamGoalPercent = Math.min(Math.round((teamSaved / teamGoalTarget) * 100), 100);

  const saveTeamGoal = () => {
    setTeamGoal(teamGoalDraft.trim());
    setTeamGoalTarget(Math.max(Number(teamGoalTargetDraft), 1));
    setEditingTeamGoal(false);
  };

  const publishPost = () => {
    if (!postDraft.trim()) return;
    setPosts((items) => [{
      id: `mine-${Date.now()}`,
      author: "你",
      initials: "我",
      color: "#7fbea0",
      time: "刚刚",
      badge: "今天想和队友说",
      text: postDraft.trim(),
      progress: 42,
      reactions: { like: 0, laugh: 0, dislike: 0 },
      comments: [],
    }, ...items]);
    setPostDraft("");
  };

  const reactToPost = (id, type) => {
    setPosts((items) => items.map((post) => post.id === id
      ? { ...post, reactions: { ...post.reactions, [type]: post.reactions[type] + 1 } }
      : post));
  };

  const addComment = (id) => {
    const text = commentDrafts[id]?.trim();
    if (!text) return;
    setPosts((items) => items.map((post) => post.id === id
      ? { ...post, comments: [...post.comments, { author: "你", text }] }
      : post));
    setCommentDrafts((drafts) => ({ ...drafts, [id]: "" }));
  };

  return (
    <main className="screen-content team-screen social-team-screen">
      <header className="social-header">
        <div>
          <p className="date-label">四人小队 · 第 9 天</p>
          <h1>我们这次要做到什么</h1>
        </div>
        <button className="invite-button"><Icon name="add" size={17} />邀请</button>
      </header>

      <section className="shared-goal-card social-goal-card goal-first-card">
        <div className="goal-card-head">
          <div><p>本次小队共同目标</p><span>所有成员共同确认并推进</span></div>
          <button onClick={() => { setTeamGoalDraft(teamGoal); setTeamGoalTargetDraft(teamGoalTarget); setEditingTeamGoal((value) => !value); }}>{editingTeamGoal ? "取消" : "修改"}</button>
        </div>
        {editingTeamGoal ? (
          <div className="goal-editor stacked">
            <input value={teamGoalDraft} onChange={(event) => setTeamGoalDraft(event.target.value)} maxLength={30} placeholder="写下大家为什么一起攒钱" />
            <input type="number" min="1" value={teamGoalTargetDraft} onChange={(event) => setTeamGoalTargetDraft(event.target.value)} placeholder="目标金额" />
            <button onClick={saveTeamGoal}>保存</button>
          </div>
        ) : (
          <>
            <div className="goal-main-row">
              <div>
                <h2>{teamGoal || "还没有共同目标，写一个吧"}</h2>
                <p>离目标又近了一点，今天继续一起守住。</p>
              </div>
              <div className="goal-percent-badge"><strong>{teamGoalPercent}%</strong><span>已完成</span></div>
            </div>
            <div className="goal-progress-copy"><strong>又近了 3%</strong><span>还剩 {100 - teamGoalPercent}%</span></div>
            <div className="goal-progress-track"><i style={{ width: `${teamGoalPercent}%` }} /></div>
            <p className="goal-delta">这周又靠近 <strong>3%</strong> · 已明确计入 ¥{teamSaved.toLocaleString()} / ¥{teamGoalTarget.toLocaleString()}</p>
            <div className="goal-social-pulse">
              <span>最新评论</span>
              <p>阿岚回复石头：一杯没关系，晚饭别再点贵的就行。</p>
              <b>6 条</b>
            </div>
          </>
        )}
      </section>

      <section className="team-data-summary">
        <div><span>本周全队达标</span><strong>23<small>/28 天</small></strong><em>比上周 +5 天</em></div>
        <div><span>共同目标</span><strong>{teamGoalPercent}<small>%</small></strong><em>本周又近 3%</em></div>
        <div><span>需要拉一把</span><strong>1<small> 人</small></strong><em>石头用了 83%</em></div>
      </section>

      <section className="member-data-section">
        <div className="section-title-row"><h2>成员数据</h2><span>目标进度 + 今日预算</span></div>
        <div className="member-data-grid">
          {teammates.map((person) => (
            <article key={person.name}>
              <header><span style={{ background: person.color }}>{person.initials}</span><div><strong>{person.name}</strong><small>连续 {person.streak} 天</small></div></header>
              <p>{person.goal || "还没填写个人目标"}</p>
              <div className="member-metrics">
                <span className="goal-metric">目标 {person.goalPercent}%</span>
                <b className={`today-metric ${person.percent >= 70 ? "warm" : ""}`}>今日 {person.percent}%</b>
              </div>
              <div className="dual-progress"><i style={{ width: `${person.goalPercent}%` }} /><em style={{ width: `${Math.min(person.percent, 100)}%` }} className={person.percent >= 70 ? "warm" : ""} /></div>
            </article>
          ))}
        </div>
      </section>

      <div className="social-feed-heading"><h2>朋友动态与评论</h2><span>数据之后，看看大家在说什么</span></div>

      <section className="social-composer">
        <span className="avatar" style={{ background: "#7fbea0" }}>我</span>
        <div>
          <input value={postDraft} onChange={(event) => setPostDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && publishPost()} placeholder="今天想和队友说什么？" />
          <div className="quick-replies">
            {["今天守住了", "差点破功", "求夸夸", "谁来骂醒我"].map((reply) => <button key={reply} onClick={() => setPostDraft(reply)}>{reply}</button>)}
          </div>
        </div>
        <button className="send-post" disabled={!postDraft.trim()} onClick={publishPost}><Icon name="arrow" size={16} /></button>
      </section>

      <section className="social-feed">
        {posts.map((post) => (
          <article className="social-post" key={post.id}>
            <header>
              <span className="avatar" style={{ background: post.color }}>{post.initials}</span>
              <div><strong>{post.author}</strong><small>{post.time}</small></div>
              <em>{post.badge}</em>
            </header>
            <p className="post-text">{post.text}</p>
            {post.progress !== null ? (
              <div className="post-goal-progress">
                <div><span>个人目标进度</span><strong>{post.progress}%</strong></div>
                <div><i style={{ width: `${post.progress}%` }} /></div>
              </div>
            ) : null}
            <div className="post-actions">
              <div className="reaction-buttons" aria-label="动态反馈">
                <button className="like" onClick={() => reactToPost(post.id, "like")}><Icon name="heart" size={14} />赞 · {post.reactions.like}</button>
                <button className="laugh" onClick={() => reactToPost(post.id, "laugh")}><span aria-hidden="true">笑</span>乐 · {post.reactions.laugh}</button>
                <button className="dislike" onClick={() => reactToPost(post.id, "dislike")}><span aria-hidden="true">踩</span>踩 · {post.reactions.dislike}</button>
              </div>
              <span><Icon name="comment" size={15} />{post.comments.length} 条评论</span>
            </div>
            <div className="comment-thread">
              {post.comments.map((comment, index) => (
                <p key={`${post.id}-${index}`}><strong>{comment.author}</strong><span>{comment.text}</span></p>
              ))}
              <div className="comment-input">
                <input value={commentDrafts[post.id] || ""} onChange={(event) => setCommentDrafts((drafts) => ({ ...drafts, [post.id]: event.target.value }))} onKeyDown={(event) => event.key === "Enter" && addComment(post.id)} placeholder={`回复 ${post.author}…`} />
                <button disabled={!commentDrafts[post.id]?.trim()} onClick={() => addComment(post.id)}>发送</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function BudgetSettings({ dailyLimit, onClose, onSave }) {
  const [value, setValue] = useState(dailyLimit);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="bottom-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-handle" />
        <p className="date-label">预算设置</p>
        <h2>每天最多花多少？</h2>
        <div className="limit-input"><span>¥</span><input type="number" min="1" value={value} onChange={(event) => setValue(Number(event.target.value))} /></div>
        <div className="rule-preview">
          <div><span>50%</span><p>没花完的额度留到明天</p></div>
          <div><span>50%</span><p>直接算作真正攒下</p></div>
        </div>
        <button className="submit-expense" onClick={() => onSave(Math.max(Number(value), 1))}>保存今日额度</button>
      </section>
    </div>
  );
}

function MealSettings({ mealBaseline, onClose, onSave }) {
  const [value, setValue] = useState(mealBaseline);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="bottom-sheet meal-settings-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-handle" />
        <p className="date-label">餐饮及格线设置</p>
        <h2>每天吃饭至少留多少？</h2>
        <div className="limit-input meal-limit-input">
          <span>¥</span>
          <input
            type="number"
            min="1"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-label="餐饮及格线金额"
          />
        </div>
        <p className="sheet-helper">这个数字只用来提醒你别为了省钱吃太少，不会因为吃饭超过而责备你。</p>
        <button className="submit-expense" onClick={() => onSave(Math.max(Number(value), 1))}>保存餐饮及格线</button>
      </section>
    </div>
  );
}

function MonthlyPlanSettings({ plan, dailyLimit, onClose, onSave }) {
  const [purpose, setPurpose] = useState(plan.purpose);
  const [saveTarget, setSaveTarget] = useState(plan.saveTarget);
  const [savedBase, setSavedBase] = useState(plan.savedBase);
  const [nextDailyLimit, setNextDailyLimit] = useState(dailyLimit);

  const savePlan = () => {
    onSave({
      plan: {
        ...plan,
        purpose: purpose.trim() || "一个想买的东西",
        saveTarget: Math.max(Number(saveTarget), 1),
        savedBase: Math.max(Number(savedBase), 0),
      },
      dailyLimit: Math.max(Number(nextDailyLimit), 1),
    });
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="bottom-sheet monthly-plan-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-handle" />
        <p className="date-label">本月个人计划</p>
        <h2>这个月想为了什么攒钱？</h2>
        <label className="plan-text-field">
          <span>为了什么</span>
          <input value={purpose} onChange={(event) => setPurpose(event.target.value)} maxLength={24} placeholder="例如 大疆 Mavic 4" />
        </label>
        <div className="plan-input-grid">
          <label>
            <span>预计攒</span>
            <div><b>¥</b><input type="number" min="1" value={saveTarget} onChange={(event) => setSaveTarget(event.target.value)} /></div>
          </label>
          <label>
            <span>已攒</span>
            <div><b>¥</b><input type="number" min="0" value={savedBase} onChange={(event) => setSavedBase(event.target.value)} /></div>
          </label>
          <label>
            <span>每天最多花</span>
            <div><b>¥</b><input type="number" min="1" value={nextDailyLimit} onChange={(event) => setNextDailyLimit(event.target.value)} /></div>
          </label>
        </div>
        <p className="sheet-helper monthly-helper">首页会按这个计划展示本月已攒、预计攒、已花和预算进度。</p>
        <button className="submit-expense" onClick={savePlan}>保存本月计划</button>
      </section>
    </div>
  );
}

function YearlyGoalSettings({ goal, onClose, onSave }) {
  const [purpose, setPurpose] = useState(goal.purpose);
  const [saveTarget, setSaveTarget] = useState(goal.saveTarget);
  const [savedBase, setSavedBase] = useState(goal.savedBase);

  const saveGoal = () => {
    onSave({
      purpose: purpose.trim(),
      saveTarget: Math.max(Number(saveTarget), 1),
      savedBase: Math.max(Number(savedBase), 0),
    });
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="bottom-sheet yearly-goal-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-handle" />
        <p className="date-label">年度目标</p>
        <h2>今年想为了什么攒钱？</h2>
        <label className="plan-text-field">
          <span>年度目标</span>
          <input value={purpose} onChange={(event) => setPurpose(event.target.value)} maxLength={28} placeholder="例如 今年存下 3 万" />
        </label>
        <div className="plan-input-grid yearly-input-grid">
          <label>
            <span>目标金额</span>
            <div><b>¥</b><input type="number" min="1" value={saveTarget} onChange={(event) => setSaveTarget(event.target.value)} /></div>
          </label>
          <label>
            <span>今年已攒</span>
            <div><b>¥</b><input type="number" min="0" value={savedBase} onChange={(event) => setSavedBase(event.target.value)} /></div>
          </label>
        </div>
        <p className="sheet-helper monthly-helper">这是一个可选目标，只用来帮你看一年走到哪里了；不设置也不影响记账。</p>
        <button className="submit-expense" onClick={saveGoal}>保存年度目标</button>
      </section>
    </div>
  );
}

function EndDaySheet({ dailyLimit, spent, initialCarryRatio, onClose, onConfirm }) {
  const [carryRatio, setCarryRatio] = useState(initialCarryRatio);
  const remaining = Math.max(dailyLimit - spent, 0);
  const safeCarryRatio = Math.min(Math.max(Number(carryRatio) || 0, 0), 100);
  const tomorrowCarry = remaining * (safeCarryRatio / 100);
  const savedToday = remaining - tomorrowCarry;
  const tomorrowAllowance = dailyLimit + tomorrowCarry;
  const updateCarryRatio = (value) => setCarryRatio(Math.min(Math.max(Number(value) || 0, 0), 100));

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="bottom-sheet end-day-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-handle" />
        <p className="date-label">今日结束</p>
        <h2>今天不再记账，明天额度怎么算？</h2>
        <div className="end-day-result">
          <span>明天可用额度</span>
          <strong>¥{tomorrowAllowance.toFixed(0)}</strong>
          <small>基础 ¥{dailyLimit.toFixed(0)} + 今日结转 ¥{tomorrowCarry.toFixed(0)}</small>
        </div>
        <div className="carry-ratio-control">
          <div className="carry-ratio-head">
            <div>
              <strong>留到明天比例</strong>
              <span>你来决定剩下的钱怎么分</span>
            </div>
            <label>
              <input
                type="number"
                min="0"
                max="100"
                value={safeCarryRatio}
                onChange={(event) => updateCarryRatio(event.target.value)}
                aria-label="留到明天比例数字"
              />
              <b>%</b>
            </label>
          </div>
          <input
            className="carry-ratio-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            value={safeCarryRatio}
            onChange={(event) => updateCarryRatio(event.target.value)}
            aria-label="留到明天比例"
          />
          <div className="carry-ratio-copy">
            <span>留到明天 {safeCarryRatio.toFixed(0)}%</span>
            <span>真正攒下 {(100 - safeCarryRatio).toFixed(0)}%</span>
          </div>
        </div>
        <div className="end-day-breakdown">
          <div><span>今天剩余</span><strong>¥{remaining.toFixed(0)}</strong></div>
          <div><span>留到明天</span><strong>¥{tomorrowCarry.toFixed(0)}</strong></div>
          <div><span>真正攒下</span><strong>¥{savedToday.toFixed(0)}</strong></div>
        </div>
        <p className="sheet-helper end-day-helper">确认后今天就结束了，不再继续记今天的账；明天会按这个额度重新开始。</p>
        <button className="submit-expense" onClick={() => onConfirm({ tomorrowAllowance, tomorrowCarry, savedToday, carryRatio: safeCarryRatio })}>结束今天，明天 ¥{tomorrowAllowance.toFixed(0)}</button>
      </section>
    </div>
  );
}

function BottomNav({ active, onChange }) {
  const items = [
    { id: "home", label: "首页", icon: "home" },
    { id: "add", label: "记一笔", icon: "add" },
    { id: "team", label: "小队", icon: "team" },
  ];
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => onChange(item.id)}>
          <span><Icon name={item.icon} size={21} /></span><small>{item.label}</small>
        </button>
      ))}
    </nav>
  );
}

function App() {
  const [active, setActive] = useState("home");
  const [dailyLimit, setDailyLimit] = useState(100);
  const [mealBaseline, setMealBaseline] = useState(DEFAULT_MEAL_BASELINE);
  const [monthlyPlan, setMonthlyPlan] = useState(DEFAULT_MONTHLY_PLAN);
  const [yearlyGoal, setYearlyGoal] = useState(DEFAULT_YEARLY_GOAL);
  const [carryRatio, setCarryRatio] = useState(50);
  const [expenses, setExpenses] = useState(expensesSeed);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mealSettingsOpen, setMealSettingsOpen] = useState(false);
  const [monthlyPlanOpen, setMonthlyPlanOpen] = useState(false);
  const [yearlyGoalOpen, setYearlyGoalOpen] = useState(false);
  const [endDayOpen, setEndDayOpen] = useState(false);
  const [toast, setToast] = useState("");
  const viewportRef = useRef(null);

  const spent = useMemo(() => expenses.reduce((total, item) => item.type !== "income" ? total + item.amount : total, 0), [expenses]);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [active]);

  const addExpense = ({ type, amount, category, note, countsTowardGoal }) => {
    const now = new Date();
    setExpenses((items) => [...items, {
      id: Date.now(),
      type,
      name: category.name,
      note,
      amount,
      icon: category.icon,
      countsTowardGoal,
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
    }]);
    setToast(type === "income"
      ? `记下收入 ¥${amount.toFixed(0)}${countsTowardGoal ? "，已计入储蓄目标" : ""}`
      : `记下支出 ¥${amount.toFixed(0)}，今天还剩 ¥${Math.max(dailyLimit - spent - amount, 0).toFixed(0)}`);
    setActive("home");
    window.setTimeout(() => setToast(""), 2800);
  };

  return (
    <div className="app-page">
      <aside className="prototype-note">
        <p>交互原型 · 首版核心体验</p>
        <h2>把记账变成<br />每天守住钱包</h2>
        <span>点击底部导航体验：首页、快速记一笔、小队。</span>
        <div className="concept-rule"><b>今日结束</b><p>点一下结束今天，直接算出明天能花多少。</p></div>
        <div className="concept-preview" aria-label="日记月累功能概览">
          <span>每日预算</span>
          <span>快速记账</span>
          <span>小队目标</span>
        </div>
      </aside>

      <section className="phone-shell">
        <div className="phone-status"><span>9:41</span><span className="status-icons">● ᴡɪғɪ ▰</span></div>
        <div className="app-viewport" ref={viewportRef}>
          {active === "home" && <HomeScreen dailyLimit={dailyLimit} mealBaseline={mealBaseline} monthlyPlan={monthlyPlan} yearlyGoal={yearlyGoal} carryRatio={carryRatio} expenses={expenses} onAdd={() => setActive("add")} onEndDay={() => setEndDayOpen(true)} onSettings={() => setSettingsOpen(true)} onMealSettings={() => setMealSettingsOpen(true)} onMonthlyPlanSettings={() => setMonthlyPlanOpen(true)} onYearlyGoalSettings={() => setYearlyGoalOpen(true)} />}
          {active === "add" && <AddScreen onSubmit={addExpense} />}
          {active === "team" && <TeamScreen />}
        </div>
        <BottomNav active={active} onChange={setActive} />
        {settingsOpen && <BudgetSettings dailyLimit={dailyLimit} onClose={() => setSettingsOpen(false)} onSave={(value) => { setDailyLimit(value); setSettingsOpen(false); }} />}
        {mealSettingsOpen && <MealSettings mealBaseline={mealBaseline} onClose={() => setMealSettingsOpen(false)} onSave={(value) => { setMealBaseline(value); setMealSettingsOpen(false); }} />}
        {monthlyPlanOpen && <MonthlyPlanSettings monthlyPlan={monthlyPlan} plan={monthlyPlan} dailyLimit={dailyLimit} onClose={() => setMonthlyPlanOpen(false)} onSave={({ plan, dailyLimit: nextDailyLimit }) => { setMonthlyPlan(plan); setDailyLimit(nextDailyLimit); setMonthlyPlanOpen(false); }} />}
        {yearlyGoalOpen && <YearlyGoalSettings goal={yearlyGoal} onClose={() => setYearlyGoalOpen(false)} onSave={(goal) => { setYearlyGoal(goal); setYearlyGoalOpen(false); }} />}
        {endDayOpen && <EndDaySheet dailyLimit={dailyLimit} spent={spent} initialCarryRatio={carryRatio} onClose={() => setEndDayOpen(false)} onConfirm={({ tomorrowAllowance, savedToday, carryRatio: nextCarryRatio }) => {
          const countedIncomeToday = expenses.reduce((total, item) => item.type === "income" && item.countsTowardGoal ? total + item.amount : total, 0);
          setCarryRatio(nextCarryRatio);
          setDailyLimit(Math.max(tomorrowAllowance, 1));
          setMonthlyPlan((plan) => ({
            ...plan,
            savedBase: plan.savedBase + savedToday + countedIncomeToday,
            spentBase: plan.spentBase + spent,
          }));
          setExpenses([]);
          setEndDayOpen(false);
          setActive("home");
          setToast(`已更新明天额度 ¥${tomorrowAllowance.toFixed(0)}，可以继续记一笔`);
          window.setTimeout(() => setToast(""), 2800);
        }} />}
        {toast && <div className="toast">{toast}</div>}
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
