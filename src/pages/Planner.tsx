import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/focus/AppShell";
import { PageHeader } from "@/components/focus/PageHeader";
import { SurfaceCard, SectionLabel } from "@/components/focus/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, BellOff, CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

type Priority = "high" | "medium" | "low";
type Subject = { id: string; name: string; tone: "moss" | "clay" };
type Todo = {
  id: string;
  text: string;
  subjectId: string | null;
  priority: Priority;
  done: boolean;
  dueDate: string | null; // ISO yyyy-mm-dd
  dueTime: string | null; // HH:mm
};
type Exam = {
  id: string;
  name: string;
  subjectId: string | null;
  type: "exam" | "quiz";
  dueAt: string; // ISO datetime
};

const STORAGE = "focushub-planner-v1";
const NOTIFIED = "focushub-planner-notified-v1";

const defaultSubjects: Subject[] = [
  { id: "s1", name: "Calculus", tone: "moss" },
  { id: "s2", name: "Cognitive Psych", tone: "clay" },
];

const priorityStyles: Record<Priority, string> = {
  high: "bg-clay-light text-clay",
  medium: "bg-moss-light text-moss",
  low: "bg-stone text-graphite-light",
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const startOfWeek = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day; // week starts Monday
  x.setDate(x.getDate() + diff);
  return x;
};

const fmtDayKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

const countdown = (iso: string) => {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return { label: "now", days: 0, urgent: true };
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  if (days === 0) return { label: `${hours}h`, days: 0, urgent: true };
  return { label: `${days}d`, days, urgent: days <= 3 };
};

const Planner = () => {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [, tick] = useState(0);

  // Form state
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [todoSubject, setTodoSubject] = useState<string>("none");
  const [todoDate, setTodoDate] = useState<Date | undefined>();
  const [todoTime, setTodoTime] = useState<string>("");

  const [newSubject, setNewSubject] = useState("");

  const [examName, setExamName] = useState("");
  const [examSubject, setExamSubject] = useState<string>("none");
  const [examType, setExamType] = useState<"exam" | "quiz">("exam");
  const [examDate, setExamDate] = useState<Date | undefined>();
  const [examTime, setExamTime] = useState<string>("09:00");

  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );

  // Load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.subjects?.length) setSubjects(parsed.subjects);
        if (parsed.todos) setTodos(parsed.todos);
        if (parsed.exams) setExams(parsed.exams);
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify({ subjects, todos, exams }));
    } catch {}
  }, [subjects, todos, exams]);

  // Re-render every minute so countdowns stay current
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  // Notification scheduler — checks every minute and fires at 7d/3d/1d/1h thresholds
  useEffect(() => {
    const check = () => {
      if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
      let notified: Record<string, number[]> = {};
      try { notified = JSON.parse(localStorage.getItem(NOTIFIED) || "{}"); } catch {}
      const thresholds = [7 * 24 * 60, 3 * 24 * 60, 24 * 60, 60]; // minutes before
      const now = Date.now();
      let changed = false;
      exams.forEach((ex) => {
        const minsLeft = Math.floor((new Date(ex.dueAt).getTime() - now) / 60000);
        if (minsLeft < 0) return;
        const fired = new Set(notified[ex.id] || []);
        thresholds.forEach((t) => {
          // Fire if we just crossed below threshold (within 1 minute window) and haven't fired yet
          if (minsLeft <= t && minsLeft > t - 2 && !fired.has(t)) {
            const subj = subjects.find((s) => s.id === ex.subjectId)?.name;
            const label =
              t >= 24 * 60 ? `${t / (24 * 60)} day${t === 24 * 60 ? "" : "s"}` : `${t / 60} hour${t === 60 ? "" : "s"}`;
            new Notification(`Upcoming ${ex.type}: ${ex.name}`, {
              body: `${subj ? subj + " — " : ""}in ${label}`,
              tag: `${ex.id}-${t}`,
            });
            fired.add(t);
            changed = true;
          }
        });
        notified[ex.id] = Array.from(fired);
      });
      if (changed) {
        try { localStorage.setItem(NOTIFIED, JSON.stringify(notified)); } catch {}
      }
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, [exams, subjects]);

  const requestNotifications = async () => {
    if (typeof Notification === "undefined") {
      toast.error("Notifications aren't supported in this browser");
      return;
    }
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === "granted") toast.success("Notifications enabled");
    else toast.error("Notifications blocked. Enable them in browser settings.");
  };

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    const tone: "moss" | "clay" = subjects.length % 2 === 0 ? "moss" : "clay";
    setSubjects([...subjects, { id: crypto.randomUUID(), name: newSubject.trim(), tone }]);
    setNewSubject("");
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    setTodos(todos.map((t) => (t.subjectId === id ? { ...t, subjectId: null } : t)));
    setExams(exams.map((e) => (e.subjectId === id ? { ...e, subjectId: null } : e)));
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos([
      {
        id: crypto.randomUUID(),
        text: text.trim(),
        subjectId: todoSubject === "none" ? null : todoSubject,
        priority,
        done: false,
        dueDate: todoDate ? fmtDayKey(todoDate) : null,
        dueTime: todoTime || null,
      },
      ...todos,
    ]);
    setText("");
    setTodoDate(undefined);
    setTodoTime("");
  };

  const addExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim() || !examDate) {
      toast.error("Add a name and a date");
      return;
    }
    const [h, m] = (examTime || "09:00").split(":").map(Number);
    const dt = new Date(examDate);
    dt.setHours(h || 9, m || 0, 0, 0);
    setExams([
      ...exams,
      {
        id: crypto.randomUUID(),
        name: examName.trim(),
        subjectId: examSubject === "none" ? null : examSubject,
        type: examType,
        dueAt: dt.toISOString(),
      },
    ]);
    setExamName("");
    setExamDate(undefined);
    setExamTime("09:00");
    if (notifPermission !== "granted") {
      toast("Enable notifications to get reminders", {
        action: { label: "Enable", onClick: requestNotifications },
      });
    }
  };

  // Build week view
  const weekStart = useMemo(() => startOfWeek(new Date()), []);
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    }),
    [weekStart]
  );

  const todoSubject_ = (id: string | null) => subjects.find((s) => s.id === id);

  type WeekItem = { kind: "todo" | "exam"; time: string; title: string; tone: "moss" | "clay"; sub?: string };
  const itemsByDay: Record<string, WeekItem[]> = {};
  weekDays.forEach((d) => (itemsByDay[fmtDayKey(d)] = []));

  todos.forEach((t) => {
    if (!t.dueDate || !itemsByDay[t.dueDate]) return;
    const subj = todoSubject_(t.subjectId);
    itemsByDay[t.dueDate].push({
      kind: "todo",
      time: t.dueTime || "—",
      title: t.text,
      tone: subj?.tone || (t.priority === "high" ? "clay" : "moss"),
      sub: subj?.name,
    });
  });
  exams.forEach((ex) => {
    const key = fmtDayKey(new Date(ex.dueAt));
    if (!itemsByDay[key]) return;
    const subj = todoSubject_(ex.subjectId);
    itemsByDay[key].push({
      kind: "exam",
      time: format(new Date(ex.dueAt), "HH:mm"),
      title: `${ex.type === "quiz" ? "Quiz" : "Exam"}: ${ex.name}`,
      tone: "clay",
      sub: subj?.name,
    });
  });
  Object.values(itemsByDay).forEach((arr) =>
    arr.sort((a, b) => (a.time < b.time ? -1 : 1))
  );

  const sortedExams = [...exams].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Study planner"
        title="Plan the week, win the week"
        description="Tasks, calendar, and deadlines in one quiet view."
        action={
          <Button
            variant="outline"
            onClick={requestNotifications}
            className="rounded-full"
          >
            {notifPermission === "granted" ? <Bell className="size-4 mr-2" /> : <BellOff className="size-4 mr-2" />}
            {notifPermission === "granted" ? "Notifications on" : "Enable notifications"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        {/* Subjects */}
        <SurfaceCard className="lg:col-span-12">
          <SectionLabel>Subjects</SectionLabel>
          <form onSubmit={addSubject} className="mt-4 flex gap-2 max-w-md">
            <Input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add a subject (e.g. Biology)"
              className="rounded-full bg-stone border-transparent"
            />
            <Button type="submit" size="icon" className="rounded-full bg-graphite text-primary-foreground shrink-0">
              <Plus className="size-4" />
            </Button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {subjects.length === 0 && (
              <p className="text-sm text-graphite-light">No subjects yet — add one above.</p>
            )}
            {subjects.map((s) => (
              <span
                key={s.id}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs",
                  s.tone === "moss" ? "bg-moss-light text-moss" : "bg-clay-light text-clay"
                )}
              >
                {s.name}
                <button
                  onClick={() => removeSubject(s.id)}
                  className="opacity-60 hover:opacity-100"
                  aria-label={`Remove ${s.name}`}
                >
                  <Trash2 className="size-3" />
                </button>
              </span>
            ))}
          </div>
        </SurfaceCard>

        {/* To-do */}
        <SurfaceCard className="lg:col-span-5">
          <SectionLabel>To-do list</SectionLabel>
          <form onSubmit={addTodo} className="mt-4 flex flex-col gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs doing?"
              className="rounded-full bg-stone border-transparent"
            />
            <div className="flex flex-wrap gap-2">
              <Select value={todoSubject} onValueChange={setTodoSubject}>
                <SelectTrigger className="rounded-full bg-stone border-transparent h-9 w-auto min-w-[130px]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No subject</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="rounded-full bg-stone border-transparent h-9 w-auto min-w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "rounded-full h-9 bg-stone border-transparent font-normal",
                      !todoDate && "text-graphite-light"
                    )}
                  >
                    <CalendarIcon className="size-4 mr-2" />
                    {todoDate ? format(todoDate, "MMM d") : "Due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={todoDate}
                    onSelect={setTodoDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Input
                type="time"
                value={todoTime}
                onChange={(e) => setTodoTime(e.target.value)}
                className="rounded-full bg-stone border-transparent h-9 w-[110px]"
              />

              <Button type="submit" size="icon" className="rounded-full bg-graphite text-primary-foreground shrink-0 ml-auto">
                <Plus className="size-4" />
              </Button>
            </div>
          </form>

          <ul className="mt-5 flex flex-col gap-2">
            {todos.length === 0 && (
              <li className="text-sm text-graphite-light px-1">Nothing yet — add your first task above.</li>
            )}
            {todos.map((t) => {
              const subj = todoSubject_(t.subjectId);
              return (
                <li
                  key={t.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl bg-stone/60 transition-opacity",
                    t.done && "opacity-50"
                  )}
                >
                  <Checkbox
                    checked={t.done}
                    onCheckedChange={(v) =>
                      setTodos(todos.map((x) => (x.id === t.id ? { ...x, done: !!v } : x)))
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-sm truncate", t.done && "line-through")}>{t.text}</div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-graphite-light mt-0.5">
                      {subj && (
                        <span className={cn("font-medium", subj.tone === "moss" ? "text-moss" : "text-clay")}>
                          {subj.name}
                        </span>
                      )}
                      {t.dueDate && (
                        <span>
                          {format(new Date(t.dueDate + "T00:00"), "MMM d")}
                          {t.dueTime ? ` · ${t.dueTime}` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider px-2 py-1 rounded-full",
                      priorityStyles[t.priority]
                    )}
                  >
                    {t.priority}
                  </span>
                  <button
                    onClick={() => setTodos(todos.filter((x) => x.id !== t.id))}
                    className="text-graphite-light hover:text-graphite"
                    aria-label="Delete task"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </SurfaceCard>

        {/* Week view */}
        <SurfaceCard className="lg:col-span-7">
          <SectionLabel>This week</SectionLabel>
          <div className="grid grid-cols-7 gap-2 mt-5">
            {weekDays.map((d) => {
              const key = fmtDayKey(d);
              const items = itemsByDay[key] || [];
              const isToday = fmtDayKey(new Date()) === key;
              return (
                <div key={key} className="flex flex-col gap-2 min-h-[180px]">
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-widest text-graphite-light">
                      {dayNames[d.getDay()]}
                    </div>
                    <div
                      className={cn(
                        "text-xs mt-0.5 inline-flex items-center justify-center size-6 rounded-full",
                        isToday ? "bg-graphite text-primary-foreground font-medium" : "text-graphite-light"
                      )}
                    >
                      {d.getDate()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    {items.map((it, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-2 rounded-xl text-[11px]",
                          it.tone === "moss" ? "bg-moss-light text-moss" : "bg-clay-light text-clay"
                        )}
                      >
                        <div className="font-medium tabular-nums">{it.time}</div>
                        <div className="truncate" title={it.title}>{it.title}</div>
                        {it.sub && <div className="opacity-70 truncate">{it.sub}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SurfaceCard>

        {/* Exams */}
        <SurfaceCard className="lg:col-span-12">
          <SectionLabel>Exams &amp; quizzes</SectionLabel>

          <form onSubmit={addExam} className="mt-4 flex flex-wrap gap-2 items-center">
            <Input
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="e.g. Calculus midterm"
              className="rounded-full bg-stone border-transparent flex-1 min-w-[180px]"
            />
            <Select value={examSubject} onValueChange={setExamSubject}>
              <SelectTrigger className="rounded-full bg-stone border-transparent h-10 w-auto min-w-[140px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No subject</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={examType} onValueChange={(v) => setExamType(v as "exam" | "quiz")}>
              <SelectTrigger className="rounded-full bg-stone border-transparent h-10 w-auto min-w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "rounded-full h-10 bg-stone border-transparent font-normal",
                    !examDate && "text-graphite-light"
                  )}
                >
                  <CalendarIcon className="size-4 mr-2" />
                  {examDate ? format(examDate, "PPP") : "Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={examDate}
                  onSelect={setExamDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
              className="rounded-full bg-stone border-transparent h-10 w-[120px]"
            />
            <Button type="submit" className="rounded-full bg-graphite text-primary-foreground">
              <Plus className="size-4 mr-2" /> Add
            </Button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {sortedExams.length === 0 && (
              <p className="text-sm text-graphite-light col-span-full">
                No upcoming exams or quizzes. Add one above to start a countdown.
              </p>
            )}
            {sortedExams.map((ex) => {
              const c = countdown(ex.dueAt);
              const subj = todoSubject_(ex.subjectId);
              return (
                <div key={ex.id} className="p-5 rounded-2xl bg-stone/60 flex flex-col gap-2 relative">
                  <button
                    onClick={() => setExams(exams.filter((e) => e.id !== ex.id))}
                    className="absolute top-3 right-3 text-graphite-light hover:text-graphite"
                    aria-label="Remove"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <span className="text-xs text-graphite-light">
                    {format(new Date(ex.dueAt), "EEE, MMM d · HH:mm")}
                  </span>
                  <span className="font-medium text-graphite">
                    {ex.type === "quiz" ? "Quiz" : "Exam"} — {ex.name}
                  </span>
                  {subj && (
                    <span className={cn("text-xs", subj.tone === "moss" ? "text-moss" : "text-clay")}>
                      {subj.name}
                    </span>
                  )}
                  <span
                    className={cn(
                      "font-serif-display text-3xl",
                      c.urgent ? "text-clay" : "text-graphite"
                    )}
                  >
                    {c.label}{" "}
                    <span className="text-base text-graphite-light">
                      {c.label.endsWith("d") ? "left" : "to go"}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
};

export default Planner;
