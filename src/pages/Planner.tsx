import { useState } from "react";
import { AppShell } from "@/components/focus/AppShell";
import { PageHeader } from "@/components/focus/PageHeader";
import { SurfaceCard, SectionLabel } from "@/components/focus/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

type Priority = "high" | "medium" | "low";
type Todo = { id: string; text: string; priority: Priority; done: boolean };

const initialTodos: Todo[] = [
  { id: "1", text: "Calculus problem set 4", priority: "high", done: false },
  { id: "2", text: "Read chapter 7 — Cognitive Psych", priority: "medium", done: false },
  { id: "3", text: "Outline studio presentation", priority: "high", done: true },
  { id: "4", text: "Buy index cards", priority: "low", done: false },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const week: { day: string; items: { time: string; title: string; tone: string }[] }[] = [
  { day: "Mon", items: [{ time: "09:00", title: "Calculus", tone: "moss" }, { time: "14:00", title: "Studio", tone: "clay" }] },
  { day: "Tue", items: [{ time: "10:00", title: "Lit reading", tone: "moss" }] },
  { day: "Wed", items: [{ time: "08:00", title: "Lab prep", tone: "clay" }, { time: "16:00", title: "Group study", tone: "moss" }] },
  { day: "Thu", items: [{ time: "11:00", title: "Studio crit", tone: "clay" }] },
  { day: "Fri", items: [{ time: "09:00", title: "Review week", tone: "moss" }] },
  { day: "Sat", items: [] },
  { day: "Sun", items: [{ time: "18:00", title: "Plan next week", tone: "moss" }] },
];

const exams = [
  { name: "Calculus II midterm", date: "Nov 04", days: 7 },
  { name: "Cognitive Psych quiz", date: "Nov 11", days: 14 },
  { name: "Studio final review", date: "Dec 12", days: 45 },
];

const priorityStyles: Record<Priority, string> = {
  high: "bg-clay-light text-clay",
  medium: "bg-moss-light text-moss",
  low: "bg-stone text-graphite-light",
};

const Planner = () => {
  const [todos, setTodos] = useState(initialTodos);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos([{ id: crypto.randomUUID(), text, priority, done: false }, ...todos]);
    setText("");
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Study planner" title="Plan the week, win the week" description="Tasks, calendar, and deadlines in one quiet view." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        <SurfaceCard className="lg:col-span-5">
          <SectionLabel>To-do list</SectionLabel>
          <form onSubmit={add} className="mt-4 flex gap-2">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="What needs doing?" className="rounded-full bg-stone border-transparent" />
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="bg-stone rounded-full px-3 text-sm">
              <option value="high">High</option>
              <option value="medium">Med</option>
              <option value="low">Low</option>
            </select>
            <Button type="submit" size="icon" className="rounded-full bg-graphite shrink-0"><Plus className="size-4" /></Button>
          </form>
          <ul className="mt-5 flex flex-col gap-2">
            {todos.map((t) => (
              <li key={t.id} className={`flex items-center gap-3 p-3 rounded-2xl bg-stone/60 transition-opacity ${t.done ? "opacity-50" : ""}`}>
                <Checkbox checked={t.done} onCheckedChange={(v) => setTodos(todos.map((x) => x.id === t.id ? { ...x, done: !!v } : x))} />
                <span className={`flex-1 text-sm ${t.done ? "line-through" : ""}`}>{t.text}</span>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${priorityStyles[t.priority]}`}>{t.priority}</span>
                <button onClick={() => setTodos(todos.filter((x) => x.id !== t.id))} className="text-graphite-light hover:text-graphite">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </SurfaceCard>

        <SurfaceCard className="lg:col-span-7">
          <SectionLabel>This week</SectionLabel>
          <div className="grid grid-cols-7 gap-2 mt-5">
            {week.map((d) => (
              <div key={d.day} className="flex flex-col gap-2 min-h-[160px]">
                <span className="text-[10px] uppercase tracking-widest text-graphite-light text-center">{d.day}</span>
                <div className="flex flex-col gap-1.5 flex-1">
                  {d.items.map((it, i) => (
                    <div key={i} className={`p-2 rounded-xl text-[11px] ${it.tone === "moss" ? "bg-moss-light text-moss" : "bg-clay-light text-clay"}`}>
                      <div className="font-medium tabular-nums">{it.time}</div>
                      <div className="truncate">{it.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="lg:col-span-12">
          <SectionLabel>Exam countdowns</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {exams.map((e) => (
              <div key={e.name} className="p-5 rounded-2xl bg-stone/60 flex flex-col gap-2">
                <span className="text-xs text-graphite-light">{e.date}</span>
                <span className="font-medium text-graphite">{e.name}</span>
                <span className="font-serif-display text-3xl text-clay">{e.days} <span className="text-base text-graphite-light">days</span></span>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
};

export default Planner;
