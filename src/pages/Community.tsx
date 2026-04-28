import { AppShell } from "@/components/focus/AppShell";
import { PageHeader } from "@/components/focus/PageHeader";
import { SurfaceCard, SectionLabel } from "@/components/focus/Card";
import { Button } from "@/components/ui/button";
import { Users, Trophy } from "lucide-react";

const groups = [
  { name: "Med School Grind", members: 124, focus: "Anatomy & Physiology", tone: "moss" },
  { name: "Code & Coffee", members: 86, focus: "CS & Algorithms", tone: "clay" },
  { name: "Studio Architects", members: 41, focus: "Design + Crit prep", tone: "moss" },
  { name: "Pre-Law Quiet Hours", members: 67, focus: "Reading-heavy work", tone: "clay" },
];

const leaderboard = [
  { rank: 1, name: "Mira K.", school: "TU Delft", score: 94, hours: 38 },
  { rank: 2, name: "Jonas R.", school: "ETH Zurich", score: 91, hours: 35 },
  { rank: 3, name: "Elena R.", school: "Politecnico", score: 86, hours: 32, you: true },
  { rank: 4, name: "Aiko M.", school: "U Tokyo", score: 84, hours: 30 },
  { rank: 5, name: "Sam P.", school: "NYU", score: 81, hours: 28 },
];

const sessions = [
  { title: "Quiet study · 50 min", host: "Mira K.", inSession: 12 },
  { title: "Pomodoro sprint · 25/5", host: "Jonas R.", inSession: 7 },
  { title: "Deep work · 90 min", host: "Aiko M.", inSession: 4 },
];

const Community = () => (
  <AppShell>
    <PageHeader eyebrow="Community" title="Study with people who get it" description="Groups, leaderboards, and shared sessions to keep you in motion." />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
      <SurfaceCard className="lg:col-span-7">
        <SectionLabel>Study groups</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {groups.map((g) => (
            <div key={g.name} className="p-5 rounded-2xl bg-stone/60 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`size-10 rounded-full ${g.tone === "moss" ? "bg-moss-light text-moss" : "bg-clay-light text-clay"} flex items-center justify-center`}>
                  <Users className="size-4" />
                </span>
                <span className="text-xs text-graphite-light">{g.members} members</span>
              </div>
              <div>
                <h3 className="font-medium text-graphite">{g.name}</h3>
                <p className="text-sm text-graphite-light">{g.focus}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full self-start">Join</Button>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard className="lg:col-span-5">
        <div className="flex items-center justify-between">
          <SectionLabel>Leaderboard · this week</SectionLabel>
          <Trophy className="size-4 text-clay" />
        </div>
        <ul className="mt-5 flex flex-col gap-1.5">
          {leaderboard.map((u) => (
            <li key={u.rank} className={`flex items-center gap-3 p-3 rounded-2xl ${u.you ? "bg-moss-light" : "hover:bg-stone/60"}`}>
              <span className="font-serif-display text-2xl w-6 text-center text-graphite-light tabular-nums">{u.rank}</span>
              <div className="size-9 rounded-full bg-gradient-to-br from-clay-light to-moss-light flex items-center justify-center font-medium text-sm">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{u.name} {u.you && <span className="text-moss text-xs">(you)</span>}</p>
                <p className="text-xs text-graphite-light truncate">{u.school}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">{u.score}</p>
                <p className="text-[10px] text-graphite-light tabular-nums">{u.hours}h</p>
              </div>
            </li>
          ))}
        </ul>
      </SurfaceCard>

      <SurfaceCard className="lg:col-span-12">
        <SectionLabel>Live "study with me" sessions</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {sessions.map((s) => (
            <div key={s.title} className="p-5 rounded-2xl bg-stone/60 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-moss">
                <span className="size-2 rounded-full bg-moss animate-pulse" />
                <span className="text-xs uppercase tracking-widest font-medium">Live · {s.inSession} studying</span>
              </div>
              <div>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-sm text-graphite-light">Hosted by {s.host}</p>
              </div>
              <Button size="sm" className="rounded-full self-start bg-graphite hover:bg-graphite/90">Join session</Button>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  </AppShell>
);

export default Community;
