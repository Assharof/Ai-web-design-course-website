"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Archive,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MoreHorizontal,
  PanelLeftClose,
  PenLine,
  Play,
  Save,
  Send,
  Sparkles,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { courseLessons, courseStats, type CourseLesson } from "@/lib/course";

type User = {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  createdAt: string;
};

type ProgressItem = {
  id: number;
  userId: string;
  lessonNumber: number;
  completed: boolean;
  completedAt: string | null;
  notes: string;
  updatedAt: string;
};

type View = "dashboard" | "course" | "progress" | "bonuses" | "profile" | "lesson";
type AuthMode = "login" | "signup" | "forgot";

const colors = ["#0f766e", "#0e7490", "#7c3aed", "#be185d", "#b45309"];

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(body.error || "Something went wrong. Please try again.");
  return body;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function progressPercent(completed: number) {
  return Math.round((completed / courseStats.totalLessons) * 100);
}

function Avatar({ user, size = "md" }: { user: User; size?: "sm" | "md" | "lg" }) {
  const className = size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-sm";
  return (
    <span className={`grid shrink-0 place-items-center rounded-2xl font-bold text-white shadow-sm ${className}`} style={{ backgroundColor: user.avatarColor }}>
      {initials(user.name)}
    </span>
  );
}

function ProgressLine({ value, light = false, className = "" }: { value: number; light?: boolean; className?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full ${light ? "bg-white/20" : "bg-slate-100"} ${className}`}>
      <div className={`h-full rounded-full transition-all duration-700 ${light ? "bg-[#8ef1d8]" : "bg-[#0f766e]"}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function AuthScreen({
  mode,
  setMode,
  onSubmit,
  busy,
  error,
}: {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  onSubmit: (values: { name?: string; email: string; password?: string }) => Promise<void>;
  busy: boolean;
  error: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isForgot = mode === "forgot";
  const isSignup = mode === "signup";

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-[#f5fbfa] px-5 py-8 lg:grid-cols-[1.1fr_.9fr] lg:p-7">
      <div className="auth-orb left-[4%] top-[12%]" />
      <div className="auth-orb bottom-[-8%] right-[38%] h-80 w-80 bg-[#d5faf0]" />
      <section className="relative mx-auto flex w-full max-w-xl flex-col justify-between py-2 lg:mx-0 lg:px-[clamp(1rem,8vw,9rem)] lg:py-8">
        <div>
          <Brand />
          <div className="mt-16 max-w-md lg:mt-28">
            <p className="eyebrow">ASSHAROF ONLINE ACADEMY</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-slate-900 sm:text-5xl">
              Learn the skill.<br />
              <span className="text-[#0f766e]">Build the future.</span>
            </h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-slate-500">
              A focused, hands-on course for turning your best ideas into websites you are proud to launch.
            </p>
          </div>
        </div>
        <div className="mt-12 hidden items-center gap-3 text-sm font-medium text-slate-500 lg:flex">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#0f766e] shadow-sm"><Sparkles size={17} /></span>
          Practical lessons. Clear guidance. Real momentum.
        </div>
      </section>

      <section className="relative my-9 flex items-center justify-center lg:my-0">
        <div className="w-full max-w-[440px] rounded-[30px] border border-white bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,118,110,0.12)] backdrop-blur sm:p-9">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <p className="eyebrow">STUDENT PORTAL</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                {isForgot ? "Reset your password" : isSignup ? "Create your account" : "Welcome back"}
              </h2>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ecfdf7] text-[#0f766e]"><GraduationCap size={22} /></span>
          </div>
          <p className="mb-6 text-sm leading-6 text-slate-500">
            {isForgot
              ? "Enter your email and we’ll send you recovery instructions if an account is registered."
              : isSignup
                ? "Start learning in minutes. Your lesson space is ready."
                : "Sign in to pick up exactly where you left off."}
          </p>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void onSubmit({ name, email, password });
            }}
          >
            {isSignup && <Field label="Your name" value={name} onChange={setName} placeholder="e.g. Sherif Ahmed" autoComplete="name" />}
            <Field label="Email address" value={email} onChange={setEmail} type="email" placeholder="you@example.com" autoComplete="email" />
            {!isForgot && <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" autoComplete={isSignup ? "new-password" : "current-password"} />}
            {!isSignup && !isForgot && (
              <button type="button" className="-mt-1 block text-sm font-semibold text-[#0f766e] transition hover:text-[#115e59]" onClick={() => setMode("forgot")}>
                Forgot your password?
              </button>
            )}
            {error && <p className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700">{error}</p>}
            <button className="button-primary mt-2 w-full" disabled={busy} type="submit">
              {busy ? <LoaderCircle className="animate-spin" size={18} /> : isForgot ? <Mail size={18} /> : <ArrowRight size={18} />}
              {busy ? "Please wait..." : isForgot ? "Send recovery instructions" : isSignup ? "Create account" : "Sign in to my course"}
            </button>
          </form>
          
          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
            {isForgot ? (
              <button className="font-semibold text-[#0f766e] hover:underline" onClick={() => setMode("login")}>Back to sign in</button>
            ) : isSignup ? (
              <>Already enrolled? <button className="font-semibold text-[#0f766e] hover:underline" onClick={() => setMode("login")}>Sign in</button></>
            ) : (
              <>New to Assharof? <button className="font-semibold text-[#0f766e] hover:underline" onClick={() => setMode("signup")}>Create an account</button></>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, autoComplete }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder: string; autoComplete: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      <input className="input-base" value={value} onChange={(event) => onChange(event.target.value)} type={type} placeholder={placeholder} autoComplete={autoComplete} required />
    </label>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#0f766e] text-white shadow-[0_8px_18px_rgba(15,118,110,.22)]"><BrainCircuit size={22} strokeWidth={2.3} /></span>
      <span className="leading-tight">
        <span className="block text-[15px] font-bold tracking-[-0.035em] text-slate-900">Assharof</span>
        {!compact && <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Online Academy</span>}
      </span>
    </div>
  );
}

function Sidebar({
  view,
  completed,
  mobileOpen,
  onClose,
  onNavigate,
  onLogout,
}: {
  view: View;
  completed: number;
  mobileOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}) {
  const main = [
    { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
    { id: "course" as View, label: "My course", icon: BookOpen },
    { id: "progress" as View, label: "My progress", icon: BarChart3 },
    { id: "bonuses" as View, label: "Bonus vault", icon: Sparkles },
  ];
  const active = view === "lesson" ? "course" : view;
  return (
    <>
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[265px] flex-col border-r border-slate-200/80 bg-white px-4 py-6 shadow-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-2">
          <Brand compact />
          <button className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 lg:hidden" onClick={onClose} aria-label="Close navigation"><X size={20} /></button>
        </div>
        <div className="mt-9 px-2">
          <p className="nav-label">LEARNING SPACE</p>
          <nav className="mt-3 space-y-1">
            {main.map((item) => {
              const Icon = item.icon;
              const selected = active === item.id;
              return <button key={item.id} onClick={() => onNavigate(item.id)} className={`nav-item w-full ${selected ? "nav-item-active" : ""}`}><Icon size={19} strokeWidth={selected ? 2.3 : 2} />{item.label}{item.id === "bonuses" && <span className="ml-auto rounded-full bg-[#e7faf5] px-2 py-0.5 text-[10px] font-bold text-[#0f766e]">NEW</span>}</button>;
            })}
</nav>
        </div>
        <div className="mx-2 mt-8 rounded-2xl border border-[#d6f2ea] bg-[#f2fcf8] p-4">
          <div className="flex items-center gap-2 text-[#0f766e]"><Trophy size={17} /><span className="text-xs font-bold uppercase tracking-[.08em]">Course progress</span></div>
          <p className="mt-3 text-2xl font-bold tracking-[-.04em] text-slate-900">{completed}<span className="text-sm font-semibold text-slate-400"> / 9</span></p>
          <ProgressLine value={progressPercent(completed)} className="mt-2" />
          <button onClick={() => onNavigate("progress")} className="mt-3 text-xs font-bold text-[#0f766e] hover:underline">View learning plan</button>
        </div>
        
          <a href="https://chat.whatsapp.com/IQyZugTiXJ83M9KQnd9VTJ"
          target="_blank"
          rel="noreferrer"
          className="mx-2 mt-4 flex items-center gap-3 rounded-2xl bg-[#18b779] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_22px_rgba(24,183,121,.28)] transition hover:-translate-y-0.5 hover:bg-[#109667]"
        >
          <MessageCircle size={19} />
          Join the community
        </a>
        <div className="mt-auto border-t border-slate-100 pt-4">
          <button className={`nav-item w-full ${active === "profile" ? "nav-item-active" : ""}`} onClick={() => onNavigate("profile")}><UserRound size={19} />Profile</button>
          <button className="nav-item mt-1 w-full text-slate-500 hover:text-rose-600" onClick={onLogout}><LogOut size={19} />Log out</button>
        </div>
      </aside>
    </>
  );
}
function Header({ user, onMenu, onProfile }: { user: User; onMenu: () => void; onProfile: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-[#f8fbfa]/85 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <button className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-600 shadow-sm lg:hidden" aria-label="Open navigation" onClick={onMenu}><Menu size={20} /></button>
        <div><p className="hidden text-[11px] font-bold uppercase tracking-[.12em] text-[#0f766e] sm:block">ASSHAROF ONLINE ACADEMY</p><p className="text-sm font-semibold text-slate-700 sm:mt-0.5">{courseStats.title}</p></div>
      </div>
      <div className="flex items-center gap-2.5">
        <button className="relative grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-500 shadow-sm transition hover:text-[#0f766e]" aria-label="Notifications"><Bell size={19} /><span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#10b981] ring-2 ring-white" /></button>
        <button onClick={onProfile} className="flex items-center gap-2 rounded-xl bg-white py-1.5 pl-1.5 pr-2 shadow-sm transition hover:shadow-md"><Avatar user={user} size="sm" /><span className="hidden max-w-28 truncate text-sm font-bold text-slate-700 sm:block">{user.name.split(" ")[0]}</span></button>
      </div>
    </header>
  );
}

function Dashboard({ user, completed, onContinue, onOpenLesson, progress }: { user: User; completed: number; onContinue: () => void; onOpenLesson: (lesson: CourseLesson) => void; progress: Record<number, ProgressItem> }) {
  const percent = progressPercent(completed);
  const next = courseLessons.find((lesson) => !progress[lesson.number]?.completed) ?? courseLessons[courseLessons.length - 1];
  return (
    <div className="page-enter mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="eyebrow">YOUR LEARNING SPACE</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-slate-900 sm:text-4xl">Welcome back, {user.name.split(" ")[0]} <span className="inline-block origin-bottom-right animate-[wave_2.5s_ease-in-out_infinite]">👋</span></h1><p className="mt-2 text-sm text-slate-500 sm:text-base">Small, consistent steps are adding up. Let&apos;s keep building.</p></div>
        <div className="flex items-center gap-2 self-start rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm sm:self-auto"><span className="h-2 w-2 rounded-full bg-[#10b981]" /> Your learning space is active</div>
      </div>

      <section className="relative overflow-hidden rounded-[28px] bg-[#0f766e] p-6 text-white shadow-[0_18px_42px_rgba(15,118,110,.2)] sm:p-8 lg:p-10">
        <div className="hero-grid absolute inset-0 opacity-20" /><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#51d4c2]/30 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_290px] lg:items-end">
          <div><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold"><Sparkles size={14} /> AI WEBSITE BUILDING COURSE</span><h2 className="mt-5 max-w-xl text-2xl font-semibold tracking-[-.04em] sm:text-3xl">You&apos;re making meaningful progress.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-white/75">Complete your next lesson to unlock the next chapter of your AI-powered build.</p><button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#0f766e] shadow-sm transition hover:-translate-y-0.5" onClick={onContinue}>Continue learning <ArrowRight size={17} /></button></div>
          <div className="rounded-2xl border border-white/15 bg-slate-950/10 p-5 backdrop-blur-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-white/80">Course progress</p><p className="text-lg font-bold">{percent}%</p></div><ProgressLine value={percent} light className="mt-4" /><div className="mt-3 flex justify-between text-xs font-medium text-white/65"><span>{completed} of 9 lessons</span><span>{9 - completed} remaining</span></div></div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={<CheckCircle2 size={19} />} iconClass="bg-emerald-50 text-emerald-600" label="Lessons completed" value={`${completed} / 9`} detail={completed ? "Momentum looks good" : "Your journey starts here"} />
        <StatCard icon={<Clock3 size={19} />} iconClass="bg-sky-50 text-sky-600" label="Learning time" value={`${Math.max(0, Math.round(completed * 16.5))} min`} detail="Focused work pays off" />
        <StatCard icon={<Trophy size={19} />} iconClass="bg-amber-50 text-amber-600" label="Next milestone" value={completed === 9 ? "Complete!" : `Lesson ${next.number}`} detail={completed === 9 ? "You did something big" : next.title} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <section className="card-base p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2 className="mt-1 text-xl font-bold tracking-[-.03em] text-slate-900">Up next</h2></div><button onClick={onContinue} className="rounded-xl p-2 text-[#0f766e] hover:bg-[#effbf7]" aria-label="Open next lesson"><ArrowRight size={20} /></button></div><button onClick={onContinue} className="mt-5 flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-[#f9fdfc] p-3 text-left transition hover:border-[#cbece3] hover:shadow-sm"><div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#1b9185] to-[#0f766e] text-white shadow-sm"><Play size={22} fill="currentColor" /></div><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[.11em] text-[#0f766e]">Lesson {next.number} · {next.duration}</p><p className="mt-1 truncate text-base font-bold text-slate-800">{next.title}</p><p className="mt-1 truncate text-sm text-slate-500">{next.description}</p></div><ChevronRight className="mr-1 text-slate-300" size={20} /></button></section>
        <section className="card-base p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">COURSE MAP</p><h2 className="mt-1 text-xl font-bold tracking-[-.03em] text-slate-900">Your path</h2></div><span className="text-xs font-bold text-slate-400">{completed}/9</span></div><div className="mt-4 space-y-1.5">{courseLessons.slice(0, 4).map((lesson) => { const done = progress[lesson.number]?.completed; return <button key={lesson.number} onClick={() => onOpenLesson(lesson)} className="flex w-full items-center gap-3 rounded-lg px-1.5 py-1.5 text-left hover:bg-slate-50"><span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${done ? "bg-[#dcf8ef] text-[#0f766e]" : "bg-slate-100 text-slate-400"}`}>{done ? <Check size={13} strokeWidth={3} /> : lesson.number}</span><span className={`flex-1 text-sm font-medium ${done ? "text-slate-400 line-through" : "text-slate-700"}`}>{lesson.title}</span>{done && <CheckCircle2 size={15} className="text-[#10b981]" />}</button>})}</div></section>
      </div>
    </div>
  );
}

function StatCard({ icon, iconClass, label, value, detail }: { icon: ReactNode; iconClass: string; label: string; value: string; detail: string }) {
  return <article className="card-base p-4 sm:p-5"><div className={`grid h-10 w-10 place-items-center rounded-xl ${iconClass}`}>{icon}</div><p className="mt-4 text-xs font-bold uppercase tracking-[.1em] text-slate-400">{label}</p><p className="mt-1 text-2xl font-bold tracking-[-.04em] text-slate-900">{value}</p><p className="mt-1 text-xs font-medium text-slate-500">{detail}</p></article>;
}

function CourseView({ progress, onOpenLesson }: { progress: Record<number, ProgressItem>; onOpenLesson: (lesson: CourseLesson) => void }) {
  const completed = Object.values(progress).filter((item) => item.completed).length;
  return <div className="page-enter mx-auto max-w-7xl"><p className="eyebrow">YOUR CURRICULUM</p><div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-semibold tracking-[-.045em] text-slate-900 sm:text-4xl">AI Website Building Course</h1><p className="mt-2 text-sm text-slate-500">9 practical lessons · {courseStats.totalRuntime} of focused learning</p></div><span className="inline-flex self-start rounded-full bg-[#e8f8f3] px-3 py-1.5 text-xs font-bold text-[#0f766e]">{completed}/9 complete</span></div><div className="mt-7 grid gap-4">{courseLessons.map((lesson) => { const done = Boolean(progress[lesson.number]?.completed); const unlocked = lesson.number === 1 || Boolean(progress[lesson.number - 1]?.completed); return <button key={lesson.number} onClick={() => onOpenLesson(lesson)} className={`group flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition sm:p-5 ${unlocked || done ? "border-slate-100 hover:-translate-y-0.5 hover:border-[#bfe7dc] hover:shadow-md" : "border-slate-100 opacity-70"}`}><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-bold ${done ? "bg-[#dcf8ef] text-[#0f766e]" : unlocked ? "bg-[#e8f6f3] text-[#0f766e]" : "bg-slate-100 text-slate-400"}`}>{done ? <CheckCircle2 size={21} /> : unlocked ? String(lesson.number).padStart(2, "0") : <LockKeyhole size={18} />}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-xs font-bold uppercase tracking-[.1em] text-[#0f766e]">{lesson.eyebrow}</p>{lesson.number === 9 && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">BONUS</span>}</div><h2 className={`mt-1 text-base font-bold sm:text-lg ${done ? "text-slate-500" : "text-slate-800"}`}>Lesson {lesson.number}: {lesson.title}</h2><p className="mt-1 hidden text-sm text-slate-500 sm:block">{lesson.description}</p></div><div className="hidden items-center gap-4 sm:flex"><span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Clock3 size={14} />{lesson.duration}</span>{unlocked || done ? <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-[#0f766e] group-hover:bg-[#0f766e] group-hover:text-white"><ChevronRight size={18} /></span> : <LockKeyhole className="text-slate-300" size={18} />}</div></button>})}</div></div>;
}

function ProgressView({ progress, onOpenLesson }: { progress: Record<number, ProgressItem>; onOpenLesson: (lesson: CourseLesson) => void }) {
  const completed = Object.values(progress).filter((item) => item.completed).length;
  const percent = progressPercent(completed);
  const next = courseLessons.find((lesson) => !progress[lesson.number]?.completed);
  return <div className="page-enter mx-auto max-w-6xl"><p className="eyebrow">LEARNING ANALYTICS</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-slate-900 sm:text-4xl">Your progress</h1><div className="mt-7 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><section className="card-base overflow-hidden p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-700">Overall completion</p><p className="mt-3 text-5xl font-bold tracking-[-.07em] text-[#0f766e]">{percent}%</p></div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e6f9f3] text-[#0f766e]"><Trophy size={23} /></span></div><ProgressLine value={percent} className="mt-7" /><div className="mt-4 flex justify-between text-sm"><span className="font-semibold text-slate-700">{completed} lessons finished</span><span className="text-slate-400">{9 - completed} to go</span></div>{next && <button onClick={() => onOpenLesson(next)} className="mt-6 flex w-full items-center justify-between rounded-xl bg-[#f0faf7] px-4 py-3 text-left text-sm font-bold text-[#0f766e] transition hover:bg-[#e0f5ee]"><span>Continue with Lesson {next.number}</span><ArrowRight size={17} /></button>}</section><section className="card-base p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-slate-700">Lesson tracker</p><p className="mt-1 text-sm text-slate-500">One lesson at a time, one real skill at a time.</p></div><MoreHorizontal className="text-slate-300" /></div><div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">{courseLessons.map((lesson) => { const done = progress[lesson.number]?.completed; const unlocked = lesson.number === 1 || Boolean(progress[lesson.number - 1]?.completed); return <button onClick={() => onOpenLesson(lesson)} key={lesson.number} className={`group flex aspect-square flex-col items-center justify-center rounded-2xl border text-center transition ${done ? "border-[#bcebdd] bg-[#effbf7] text-[#0f766e]" : unlocked ? "border-slate-200 bg-white text-slate-700 hover:border-[#0f766e]" : "border-slate-100 bg-slate-50 text-slate-300"}`}>{done ? <CheckCircle2 size={20} /> : unlocked ? <Play size={17} fill="currentColor" /> : <LockKeyhole size={16} />}<span className="mt-1.5 text-[10px] font-bold">LESSON {lesson.number}</span></button>})}</div></section></div><section className="mt-5 rounded-2xl border border-[#d7eee7] bg-[#f5fcfa] p-5"><div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#0f766e] shadow-sm"><Sparkles size={19} /></span><div><p className="font-bold text-slate-800">Keep your streak gentle and sustainable.</p><p className="mt-1 text-sm leading-6 text-slate-500">You do not need a perfect schedule. A single focused lesson today is enough to move the whole project forward.</p></div></div></section></div>;
}

function BonusesView({ onOpenLesson }: { onOpenLesson: (lesson: CourseLesson) => void }) {
  const items = [
    ["Prompt library", "50+ copy-ready prompts for strategy, design, code, and launch.", FileText],
    ["Website templates", "Three flexible visual directions to make your own.", Archive],
    ["Useful AI tools", "A focused stack of tools worth knowing in 2025.", Sparkles],
    ["Deployment checklist", "A calm, step-by-step list for your next launch.", CheckCircle2],
    ["GitHub repository", "A clean reference project with practical comments.", BookOpen],
    ["Bonus videos", "Short deep-dives to keep your momentum going.", Play],
  ] as const;
  return <div className="page-enter mx-auto max-w-7xl"><section className="relative overflow-hidden rounded-[28px] bg-[#152e2c] p-7 text-white sm:p-10"><div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#10b981]/20 blur-3xl" /><div className="relative max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#8ef1d8]"><Sparkles size={14} /> YOUR CREATIVE VAULT</span><h1 className="mt-5 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">More than lessons. A complete launch kit.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-white/70">Use these resources whenever you need a spark, a shortcut, or a little more confidence to ship the next idea.</p><button onClick={() => onOpenLesson(courseLessons[8])} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8ef1d8] px-4 py-3 text-sm font-bold text-[#12483f] transition hover:bg-white">Open bonus lesson <ArrowRight size={17} /></button></div></section><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(([title, detail, Icon], index) => <article key={title} className="card-base group p-5 transition hover:-translate-y-1 hover:shadow-md"><span className={`grid h-11 w-11 place-items-center rounded-xl ${index % 2 ? "bg-amber-50 text-amber-600" : "bg-[#e9faf5] text-[#0f766e]"}`}><Icon size={21} /></span><h2 className="mt-5 text-lg font-bold tracking-[-.03em] text-slate-800">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p><button onClick={() => onOpenLesson(courseLessons[8])} className="mt-5 flex items-center gap-1.5 text-sm font-bold text-[#0f766e] hover:underline">Explore resource <ArrowRight size={15} /></button></article>)}</div></div>;
}

function ProfileView({ user, onSave }: { user: User; onSave: (name: string, avatarColor: string) => Promise<void> }) {
  const [name, setName] = useState(user.name);
  const [color, setColor] = useState(user.avatarColor);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  return <div className="page-enter mx-auto max-w-4xl"><p className="eyebrow">YOUR ACCOUNT</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-slate-900 sm:text-4xl">Profile settings</h1><div className="mt-7 grid gap-6 md:grid-cols-[.7fr_1.3fr]"><section className="card-base p-6"><p className="text-sm font-bold text-slate-700">Your student profile</p><div className="mt-6 flex flex-col items-center text-center"><Avatar user={{ ...user, name, avatarColor: color }} size="lg" /><p className="mt-3 text-lg font-bold text-slate-800">{name || "Your name"}</p><p className="mt-1 text-sm text-slate-500">{user.email}</p><span className="mt-5 rounded-full bg-[#ebfaf5] px-3 py-1.5 text-xs font-bold text-[#0f766e]">Active student</span></div></section><section className="card-base p-6"><h2 className="text-lg font-bold text-slate-800">Personal details</h2><p className="mt-1 text-sm text-slate-500">Make this space feel like yours.</p><label className="mt-6 block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Display name</span><input className="input-base" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} /></label><div className="mt-5"><p className="mb-2 text-sm font-semibold text-slate-700">Avatar color</p><div className="flex flex-wrap gap-2.5">{colors.map((item) => <button aria-label={`Select color ${item}`} key={item} onClick={() => setColor(item)} className={`h-9 w-9 rounded-xl ring-offset-2 transition ${color === item ? "ring-2 ring-slate-700" : "hover:scale-110"}`} style={{ backgroundColor: item }}>{color === item && <Check className="mx-auto text-white" size={17} strokeWidth={3} />}</button>)}</div></div>{message && <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">{message}</p>}<button className="button-primary mt-7" disabled={saving || !name.trim()} onClick={async () => { setSaving(true); setMessage(""); try { await onSave(name, color); setMessage("Profile saved successfully."); } finally { setSaving(false); } }}><Save size={17} />{saving ? "Saving..." : "Save changes"}</button></section></div></div>;
}

function LessonView({
  lesson,
  progress,
  onBack,
  onOpenLesson,
  onComplete,
  onSaveNote,
  onClearNote,
  onDownload,
}: {
  lesson: CourseLesson;
  progress: Record<number, ProgressItem>;
  onBack: () => void;
  onOpenLesson: (lesson: CourseLesson) => void;
  onComplete: (number: number, completed: boolean) => Promise<void>;
  onSaveNote: (number: number, note: string) => Promise<void>;
  onClearNote: (number: number) => Promise<void>;
  onDownload: (name: string, detail: string) => void;
}) {
  const current = progress[lesson.number];
  const complete = Boolean(current?.completed);
  const prev = courseLessons[lesson.number - 2];
  const next = courseLessons[lesson.number];
  const nextUnlocked = !next || Boolean(progress[lesson.number]?.completed);
  return <div className="page-enter mx-auto max-w-6xl"><button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#0f766e]"><ChevronLeft size={18} /> Back to course</button><div className="flex flex-col gap-4 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">LESSON {lesson.number} · {lesson.eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-slate-900 sm:text-4xl">{lesson.title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">{lesson.description}</p></div><span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm"><Clock3 size={14} className="text-[#0f766e]" /> {lesson.duration}</span></div><div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_260px]"><div className="space-y-7"><VideoPlayer lesson={lesson} /><section><h2 className="text-xl font-bold tracking-[-.03em] text-slate-800">What you&apos;ll learn</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{lesson.learn.map((item, index) => <div key={item} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#e8f8f3] text-xs font-bold text-[#0f766e]">0{index + 1}</span><p className="mt-3 text-sm font-semibold leading-5 text-slate-700">{item}</p></div>)}</div></section><NotesPanel key={lesson.number} initialNotes={current?.notes ?? ""} lessonNumber={lesson.number} onSave={onSaveNote} onClear={onClearNote} /></div><aside className="space-y-5"><section className="card-base p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">RESOURCES</p><h2 className="mt-1 text-lg font-bold text-slate-800">Downloads</h2></div><FileText className="text-[#0f766e]" size={21} /></div><div className="mt-4 space-y-2">{lesson.resources.map((resource) => <button onClick={() => onDownload(resource.name, resource.detail)} key={resource.name} className="group flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-[#bfe7dc] hover:bg-[#f5fcfa]"><span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-50 text-[#0f766e]"><Download size={16} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-slate-700">{resource.name}</span><span className="mt-0.5 block text-[10px] font-bold tracking-[.08em] text-slate-400">{resource.type}</span></span></button>)}</div></section><section className={`rounded-2xl p-5 ${complete ? "border border-[#c5eddf] bg-[#f2fcf8]" : "bg-[#0f766e] text-white"}`}><span className={`grid h-10 w-10 place-items-center rounded-xl ${complete ? "bg-[#d7f6ea] text-[#0f766e]" : "bg-white/15 text-white"}`}>{complete ? <CheckCircle2 size={20} /> : <Trophy size={20} />}</span><p className={`mt-4 text-base font-bold ${complete ? "text-slate-800" : "text-white"}`}>{complete ? "Lesson complete" : "Ready to make progress?"}</p><p className={`mt-1 text-sm leading-6 ${complete ? "text-slate-500" : "text-white/70"}`}>{complete ? "Great work — your course map has been updated." : "Mark this lesson done when you have worked through the material."}</p><button disabled={complete} onClick={() => void onComplete(lesson.number, true)} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${complete ? "cursor-default bg-white text-[#0f766e]" : "bg-white text-[#0f766e] hover:-translate-y-0.5"}`}>{complete ? <><Check size={17} /> Completed</> : <><CheckCircle2 size={17} /> Mark lesson complete</>}</button></section></aside></div><div className="mt-9 flex items-center justify-between border-t border-slate-200 pt-5"><button disabled={!prev} onClick={() => prev && onOpenLesson(prev)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#0f766e] disabled:cursor-not-allowed disabled:opacity-30"><ChevronLeft size={18} /> Previous lesson</button><button disabled={!next || !nextUnlocked} onClick={() => next && onOpenLesson(next)} className="inline-flex items-center gap-2 text-sm font-bold text-[#0f766e] transition hover:text-[#115e59] disabled:cursor-not-allowed disabled:opacity-30">Next lesson <ChevronRight size={18} /></button></div></div>;
}

function VideoPlayer({ lesson }: { lesson: CourseLesson }) {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="overflow-hidden rounded-[22px] bg-[#152e2c] shadow-[0_16px_32px_rgba(15,23,42,.15)]">
      <div className="relative aspect-video">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(45,212,191,.36),transparent_32%),linear-gradient(135deg,#173f3a,#102827)]" />
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?autoplay=1&rel=0`}
            title={`${lesson.title} lesson video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-[#0f766e] shadow-[0_9px_30px_rgba(0,0,0,.25)]"><Play size={26} fill="currentColor" /></span>
              <p className="mt-5 text-lg font-bold text-white">Lesson {lesson.number}: {lesson.title}</p>
              <p className="mt-1 text-sm text-white/65">A focused {lesson.duration} session</p>
            </div>
            <button onClick={() => setPlaying(true)} className="absolute inset-0 z-10" aria-label={`Play ${lesson.title}`} />
          </>
        )}
      </div>
      <div className="flex items-center justify-between bg-[#102523] px-4 py-3 text-xs font-semibold text-white/70"><span className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-[#8ef1d8]" /> HD lesson video</span><span>Assharof Academy</span></div>
    </section>
  );
}

function NotesPanel({ initialNotes, lessonNumber, onSave, onClear }: { initialNotes: string; lessonNumber: number; onSave: (number: number, notes: string) => Promise<void>; onClear: (number: number) => Promise<void> }) {
  const [note, setNote] = useState(initialNotes);
  const [state, setState] = useState<"saved" | "saving" | "error">(initialNotes ? "saved" : "saved");
  const skipRef = useRef(false);
  useEffect(() => {
    if (note === initialNotes || skipRef.current) { skipRef.current = false; return; }
    setState("saving");
    const timer = window.setTimeout(() => { void onSave(lessonNumber, note).then(() => setState("saved")).catch(() => setState("error")); }, 750);
    return () => window.clearTimeout(timer);
  }, [note, lessonNumber, onSave, initialNotes]);
  return <section className="card-base p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">PERSONAL WORKSPACE</p><h2 className="mt-1 text-xl font-bold tracking-[-.03em] text-slate-800">Your lesson notes</h2></div><div className="flex items-center gap-3"><span className={`text-xs font-semibold ${state === "error" ? "text-rose-600" : state === "saving" ? "text-amber-600" : "text-[#0f766e]"}`}>{state === "saving" ? "Saving..." : state === "error" ? "Couldn’t save" : "Auto-saved"}</span>{note && <button onClick={async () => { skipRef.current = true; setNote(""); await onClear(lessonNumber); setState("saved"); }} className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-rose-600"><X size={14} /> Clear</button>}</div></div><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Capture the ideas, prompts, and next steps you want to remember..." className="mt-5 min-h-36 w-full resize-y rounded-2xl border border-slate-200 bg-[#fbfdfd] px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#65bfae] focus:ring-4 focus:ring-[#dff5ee]" /><p className="mt-2 text-xs text-slate-400">Notes are private to you and save automatically as you write.</p></section>;
}

function WhatsAppButton() {
  const message = encodeURIComponent("Hello Assharof, I am enrolled in your AI Website Building Course and I need your assistance.");
  return <a href={`https://wa.me/?text=${message}`} target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 z-30 flex h-14 items-center gap-2 rounded-full bg-[#18b779] px-4 text-sm font-bold text-white shadow-[0_12px_28px_rgba(24,183,121,.35)] transition hover:-translate-y-1 hover:bg-[#109667] sm:right-7 sm:px-5" aria-label="Contact WhatsApp support"><Send size={20} fill="currentColor" /><span className="hidden sm:block">Need help?</span></a>;
}

export function AcademyApp() {
  const [status, setStatus] = useState<"loading" | "signedOut" | "ready">("loading");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [view, setView] = useState<View>("dashboard");
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson>(courseLessons[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");

  const loadProgress = useCallback(async () => {
    const data = await api<{ progress: ProgressItem[] }>("/api/progress");
    setProgressItems(data.progress);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const me = await api<{ user: User }>("/api/auth/me");
        setUser(me.user);
        await loadProgress();
        setStatus("ready");
      } catch {
        setStatus("signedOut");
      }
    })();
  }, [loadProgress]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const progress = useMemo(() => Object.fromEntries(progressItems.map((item) => [item.lessonNumber, item])) as Record<number, ProgressItem>, [progressItems]);
  const completed = useMemo(() => progressItems.filter((item) => item.completed).length, [progressItems]);

  const navigate = useCallback((nextView: View) => {
    setView(nextView); setMobileOpen(false);
    if (typeof window !== "undefined") window.history.pushState({}, "", nextView === "dashboard" ? "/" : `/#${nextView}`);
  }, []);

  const openLesson = useCallback((lesson: CourseLesson) => {
    const unlocked = lesson.number === 1 || Boolean(progress[lesson.number - 1]?.completed) || Boolean(progress[lesson.number]?.completed);
    if (!unlocked) { setToast(`Complete Lesson ${lesson.number - 1} to unlock this step.`); return; }
    setSelectedLesson(lesson); setView("lesson"); setMobileOpen(false);
    if (typeof window !== "undefined") window.history.pushState({}, "", `/#lesson-${lesson.number}`);
  }, [progress]);

  const handleAuth = async (values: { name?: string; email: string; password?: string }) => {
    setAuthBusy(true); setAuthError("");
    try {
      if (authMode === "forgot") {
        await api("/api/auth/reset", { method: "POST", body: JSON.stringify(values) });
        setAuthError("Check your inbox if an account is registered with this email.");
        return;
      }
      const endpoint = authMode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const data = await api<{ user: User }>(endpoint, { method: "POST", body: JSON.stringify(values) });
      setUser(data.user); await loadProgress(); setStatus("ready"); setView("dashboard");
    } catch (error) { setAuthError(error instanceof Error ? error.message : "Unable to continue."); } finally { setAuthBusy(false); }
  };

  const completeLesson = async (lessonNumber: number, completedState: boolean) => {
    if (!user) return;
    const existing = progress[lessonNumber];
    const optimistic: ProgressItem = { id: existing?.id ?? -lessonNumber, userId: user.id, lessonNumber, completed: completedState, completedAt: completedState ? new Date().toISOString() : null, notes: existing?.notes ?? "", updatedAt: new Date().toISOString() };
    setProgressItems((items) => [...items.filter((item) => item.lessonNumber !== lessonNumber), optimistic].sort((a, b) => a.lessonNumber - b.lessonNumber));
    try { const data = await api<{ progress: ProgressItem }>("/api/progress", { method: "POST", body: JSON.stringify({ lessonNumber, completed: completedState }) }); setProgressItems((items) => [...items.filter((item) => item.lessonNumber !== lessonNumber), data.progress].sort((a, b) => a.lessonNumber - b.lessonNumber)); setToast(completedState ? "Lesson completed — beautiful work!" : "Lesson marked as incomplete."); } catch (error) { setProgressItems((items) => [...items.filter((item) => item.lessonNumber !== lessonNumber), ...(existing ? [existing] : [])].sort((a, b) => a.lessonNumber - b.lessonNumber)); setToast(error instanceof Error ? error.message : "Could not update the lesson."); }
  };

  const saveNote = useCallback(async (lessonNumber: number, notes: string) => {
    if (!user) return;
    const data = await api<{ progress: ProgressItem }>("/api/notes", { method: "PUT", body: JSON.stringify({ lessonNumber, notes }) });
    setProgressItems((items) => [...items.filter((item) => item.lessonNumber !== lessonNumber), data.progress].sort((a, b) => a.lessonNumber - b.lessonNumber));
  }, [user]);

  const clearNote = useCallback(async (lessonNumber: number) => {
    await api("/api/notes", { method: "DELETE", body: JSON.stringify({ lessonNumber }) });
    setProgressItems((items) => items.map((item) => item.lessonNumber === lessonNumber ? { ...item, notes: "" } : item));
    setToast("Your note has been cleared.");
  }, []);

  const saveProfile = async (name: string, avatarColor: string) => {
    const data = await api<{ user: User }>("/api/profile", { method: "PATCH", body: JSON.stringify({ name, avatarColor }) });
    setUser(data.user);
  };

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null); setProgressItems([]); setStatus("signedOut"); setAuthMode("login"); setView("dashboard");
  };

  const downloadResource = (name: string, detail: string) => {
    const content = `${name}\n\n${detail}\n\nAssharof Online Academy · AI Website Building Course\n\nThis resource is included with your course enrollment.`;
    const blob = new Blob([content], { type: "text/plain" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`; anchor.click(); URL.revokeObjectURL(url); setToast(`${name} is downloading.`);
  };

  if (status === "loading") return <main className="grid min-h-screen place-items-center bg-[#f5fbfa]"><div className="flex flex-col items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0f766e] text-white shadow-lg"><BrainCircuit size={27} /></span><LoaderCircle className="animate-spin text-[#0f766e]" size={23} /><p className="text-sm font-semibold text-slate-500">Preparing your learning space...</p></div></main>;
  if (status === "signedOut") return <AuthScreen mode={authMode} setMode={(mode) => { setAuthMode(mode); setAuthError(""); }} onSubmit={handleAuth} busy={authBusy} error={authError} />;
  if (!user) return null;

  const continueLearning = () => openLesson(courseLessons.find((lesson) => !progress[lesson.number]?.completed) ?? courseLessons[8]);
  return <div className="min-h-screen bg-[#f8fbfa] text-slate-900"><Sidebar view={view} completed={completed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onNavigate={navigate} onLogout={() => void logout()} /><div className="min-h-screen lg:pl-[265px]"><Header user={user} onMenu={() => setMobileOpen(true)} onProfile={() => navigate("profile")} /><main className="px-5 py-7 sm:px-8 lg:px-10 lg:py-9">{view === "dashboard" && <Dashboard user={user} completed={completed} onContinue={continueLearning} onOpenLesson={openLesson} progress={progress} />}{view === "course" && <CourseView progress={progress} onOpenLesson={openLesson} />}{view === "progress" && <ProgressView progress={progress} onOpenLesson={openLesson} />}{view === "bonuses" && <BonusesView onOpenLesson={openLesson} />}{view === "profile" && <ProfileView user={user} onSave={saveProfile} />}{view === "lesson" && <LessonView lesson={selectedLesson} progress={progress} onBack={() => navigate("course")} onOpenLesson={openLesson} onComplete={completeLesson} onSaveNote={saveNote} onClearNote={clearNote} onDownload={downloadResource} />}</main></div><WhatsAppButton />{toast && <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl"><CheckCircle2 size={17} className="text-[#8ef1d8]" />{toast}</div>}</div>;
}