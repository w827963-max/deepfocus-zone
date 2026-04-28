import { useEffect, useState } from "react";
import { AppShell } from "@/components/focus/AppShell";
import { PageHeader } from "@/components/focus/PageHeader";
import { SurfaceCard, SectionLabel } from "@/components/focus/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Flame, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Discipline = () => {
  const [socialMin, setSocialMin] = useState(85);
  const [goalHours, setGoalHours] = useState(3);
  const [challengeStart, setChallengeStart] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const elapsed = challengeStart ? Math.min(goalHours * 3600, Math.floor((now - challengeStart) / 1000)) : 0;
  const total = goalHours * 3600;
  const progress = challengeStart ? elapsed / total : 0;
  const completed = challengeStart && elapsed >= total;

  const hh = Math.floor(elapsed / 3600);
  const mm = Math.floor((elapsed % 3600) / 60);
  const ss = elapsed % 60;

  return (
    <AppShell>
      <PageHeader eyebrow="Digital discipline" title="Make distraction visible" description="Track your social usage, set focus challenges, and stay accountable." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        <SurfaceCard className="lg:col-span-5">
          <SectionLabel>Social media today</SectionLabel>
          <div className="mt-4">
            <span className="font-serif-display text-6xl tabular-nums">{Math.floor(socialMin / 60)}h {socialMin % 60}m</span>
          </div>
          <div className="mt-4">
            <Input type="number" value={socialMin} min={0} onChange={(e) => setSocialMin(Math.max(0, parseInt(e.target.value || "0", 10)))} className="rounded-full bg-stone border-transparent" />
            <p className="text-xs text-graphite-light mt-2">Manually log how much time you spent scrolling.</p>
          </div>
        </SurfaceCard>

        <SurfaceCard className="lg:col-span-7">
          <div className="flex items-center justify-between">
            <SectionLabel>Focus Challenge</SectionLabel>
            <div className="flex items-center gap-2 text-clay">
              <Flame className="size-4" />
              <span className="text-sm font-semibold tabular-nums">{streak} day streak</span>
            </div>
          </div>

          <p className="mt-4 text-graphite text-pretty">
            Stay off social media for{" "}
            <span className="font-semibold">{goalHours} hour{goalHours > 1 ? "s" : ""}</span>.
          </p>
          <div className="mt-3">
            <Slider value={[goalHours]} min={1} max={8} step={1} onValueChange={(v) => setGoalHours(v[0])} disabled={!!challengeStart} />
          </div>

          <div className="mt-6 h-3 bg-stone rounded-full overflow-hidden">
            <div className="h-full bg-moss rounded-full transition-all duration-500" style={{ width: `${progress * 100}%` }} />
          </div>
          {challengeStart && (
            <p className="text-sm text-graphite-light mt-3 tabular-nums">
              {String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")} elapsed
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-5">
            {!challengeStart && !completed && (
              <Button onClick={() => setChallengeStart(Date.now())} className="rounded-full bg-graphite hover:bg-graphite/90">
                Start challenge
              </Button>
            )}
            {challengeStart && !completed && (
              <Button variant="outline" onClick={() => { setChallengeStart(null); setStreak(0); toast.error("Streak reset. Try again tomorrow."); }} className="rounded-full">
                I gave in
              </Button>
            )}
            {completed && (
              <Button onClick={() => { setChallengeStart(null); setStreak((s) => s + 1); toast.success("Challenge complete! Streak +1"); }} className="rounded-full bg-moss hover:bg-moss/90">
                <CheckCircle2 className="size-4 mr-2" /> Claim win
              </Button>
            )}
            <Button variant="outline" className="rounded-full" onClick={() => toast.success("Check-in logged. Stay strong.")}>
              <ShieldCheck className="size-4 mr-2" /> Accountability check-in
            </Button>
          </div>
        </SurfaceCard>

        <SurfaceCard className="lg:col-span-12 bg-gradient-to-br from-moss-light to-clay-light">
          <SectionLabel>Daily goal reminder</SectionLabel>
          <p className="font-serif-display text-2xl mt-3 text-pretty max-w-2xl">
            "Every time you choose to put the phone down, your future self gets a little louder."
          </p>
        </SurfaceCard>
      </div>
    </AppShell>
  );
};

export default Discipline;
