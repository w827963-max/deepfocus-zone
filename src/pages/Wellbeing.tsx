import { useState } from "react";
import { AppShell } from "@/components/focus/AppShell";
import { PageHeader } from "@/components/focus/PageHeader";
import { SurfaceCard, SectionLabel } from "@/components/focus/Card";
import { Button } from "@/components/ui/button";
import { Sparkles, Coffee, Wind, BookOpen } from "lucide-react";

const quotes = [
  { q: "You don't have to be great to start, but you have to start to be great.", who: "Zig Ziglar" },
  { q: "The successful warrior is the average person, with laser-like focus.", who: "Bruce Lee" },
  { q: "Small daily improvements over time lead to stunning results.", who: "Robin Sharma" },
  { q: "It's not about having time. It's about making time.", who: "Anonymous" },
  { q: "Discipline is the bridge between goals and accomplishment.", who: "Jim Rohn" },
];

const tips = [
  { title: "Beat procrastination", body: "Set a 2-minute starter task. Just open the doc. Momentum follows action, not motivation." },
  { title: "Time-box ruthlessly", body: "Give every task a hard end time. Parkinson's Law — work expands to fill the time you give it." },
  { title: "Spot burnout early", body: "If you've felt foggy, irritable, or numb for 3+ days — that's a signal, not weakness. Rest is productive." },
];

const breakActivities = [
  { icon: Coffee, label: "Make a tea, no phone" },
  { icon: Wind, label: "5-minute walk outside" },
  { icon: BookOpen, label: "Read 2 pages of fiction" },
  { icon: Sparkles, label: "Stretch + 10 deep breaths" },
];

const Wellbeing = () => {
  const [i, setI] = useState(0);
  const quote = quotes[i];

  return (
    <AppShell>
      <PageHeader eyebrow="Mental health & motivation" title="You are not your output" description="A quieter corner: motivation, study tips, and gentle reminders." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        <SurfaceCard className="lg:col-span-7 bg-gradient-to-br from-moss-light to-clay-light min-h-[260px] flex flex-col justify-between">
          <SectionLabel>Today's quote</SectionLabel>
          <div>
            <p className="font-serif-display text-3xl md:text-4xl leading-tight text-graphite text-pretty">"{quote.q}"</p>
            <p className="text-graphite-light text-sm mt-4">— {quote.who}</p>
          </div>
          <Button onClick={() => setI((i + 1) % quotes.length)} variant="outline" className="rounded-full self-start mt-6 bg-surface/60">
            <Sparkles className="size-4 mr-2" /> Another one
          </Button>
        </SurfaceCard>

        <SurfaceCard className="lg:col-span-5">
          <SectionLabel>Healthy break ideas</SectionLabel>
          <ul className="mt-5 flex flex-col gap-2">
            {breakActivities.map((b, k) => (
              <li key={k} className="flex items-center gap-3 p-3 rounded-2xl bg-stone/60">
                <div className="size-9 rounded-full bg-surface flex items-center justify-center text-moss">
                  <b.icon className="size-4" />
                </div>
                <span className="text-sm">{b.label}</span>
              </li>
            ))}
          </ul>
        </SurfaceCard>

        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {tips.map((t) => (
            <SurfaceCard key={t.title}>
              <h3 className="font-serif-display text-2xl text-graphite">{t.title}</h3>
              <p className="text-sm text-graphite-light mt-3 leading-relaxed">{t.body}</p>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Wellbeing;
