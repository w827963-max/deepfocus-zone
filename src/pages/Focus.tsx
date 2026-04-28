import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/focus/AppShell";
import { PageHeader } from "@/components/focus/PageHeader";
import { SurfaceCard, SectionLabel } from "@/components/focus/Card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";

type Phase = "focus" | "break";
const sounds = [
  { id: "none", label: "Silence" },
  { id: "lofi", label: "Lo-fi" },
  { id: "rain", label: "Rain" },
  { id: "noise", label: "White noise" },
];

const Focus = () => {
  const [focusMin, setFocusMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [phase, setPhase] = useState<Phase>("focus");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [deepMode, setDeepMode] = useState(false);
  const [sound, setSound] = useState("none");
  const [muted, setMuted] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          const nextPhase: Phase = phase === "focus" ? "break" : "focus";
          const nextSec = (nextPhase === "focus" ? focusMin : breakMin) * 60;
          setPhase(nextPhase);
          toast.success(nextPhase === "break" ? "Take a break ☕" : "Back to focus");
          return nextSec;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, focusMin, breakMin]);

  const reset = () => {
    setRunning(false);
    setPhase("focus");
    setSecondsLeft(focusMin * 60);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const totalSec = (phase === "focus" ? focusMin : breakMin) * 60;
  const progress = 1 - secondsLeft / totalSec;

  const TimerCore = (
    <div className="flex flex-col items-center justify-center gap-8">
      <span className="text-[10px] tracking-[0.2em] uppercase text-graphite-light">
        {phase === "focus" ? "Focus session" : "Break"}
      </span>
      <div className="relative size-64 md:size-72">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(var(--stone))" strokeWidth="4" />
          <circle
            cx="50" cy="50" r="46" fill="none"
            stroke={phase === "focus" ? "hsl(var(--moss))" : "hsl(var(--clay))"}
            strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 46}`}
            strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif-display text-7xl tabular-nums text-graphite">{mm}:{ss}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button size="lg" onClick={() => setRunning((r) => !r)} className="rounded-full bg-graphite hover:bg-graphite/90 px-8">
          {running ? <Pause className="size-4 mr-2" /> : <Play className="size-4 mr-2" />}
          {running ? "Pause" : "Start"}
        </Button>
        <Button size="lg" variant="outline" onClick={reset} className="rounded-full">
          <RotateCcw className="size-4" />
        </Button>
      </div>
    </div>
  );

  if (deepMode) {
    return (
      <div className="fixed inset-0 z-50 bg-graphite text-primary-foreground flex flex-col items-center justify-center gap-12 p-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-primary-foreground/60">Deep Focus Mode</span>
        <div className="font-serif-display text-[10rem] md:text-[14rem] tabular-nums leading-none">
          {mm}:{ss}
        </div>
        <div className="flex gap-3">
          <Button size="lg" onClick={() => setRunning((r) => !r)} className="rounded-full bg-primary-foreground text-graphite hover:bg-primary-foreground/90 px-8">
            {running ? "Pause" : "Start"}
          </Button>
          <Button size="lg" variant="outline" onClick={() => setDeepMode(false)} className="rounded-full bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            <Minimize2 className="size-4 mr-2" /> Exit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Focus tools"
        title="Run a session"
        description="Pomodoro, deep focus mode, and ambient sounds to anchor your attention."
        action={
          <Button onClick={() => setDeepMode(true)} className="rounded-full bg-graphite hover:bg-graphite/90">
            <Maximize2 className="size-4 mr-2" /> Deep Focus Mode
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        <SurfaceCard className="lg:col-span-8 py-12">{TimerCore}</SurfaceCard>

        <div className="lg:col-span-4 flex flex-col gap-5 md:gap-6">
          <SurfaceCard>
            <SectionLabel>Customize</SectionLabel>
            <div className="mt-6 flex flex-col gap-6">
              <div>
                <div className="flex justify-between text-sm mb-2"><span>Focus length</span><span className="tabular-nums font-medium">{focusMin} min</span></div>
                <Slider value={[focusMin]} min={5} max={90} step={5} onValueChange={(v) => { setFocusMin(v[0]); if (phase === "focus" && !running) setSecondsLeft(v[0] * 60); }} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span>Break length</span><span className="tabular-nums font-medium">{breakMin} min</span></div>
                <Slider value={[breakMin]} min={1} max={30} step={1} onValueChange={(v) => { setBreakMin(v[0]); if (phase === "break" && !running) setSecondsLeft(v[0] * 60); }} />
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <div className="flex items-center justify-between">
              <SectionLabel>Background sound</SectionLabel>
              <Button size="icon" variant="ghost" onClick={() => setMuted((m) => !m)} className="rounded-full">
                {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </Button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {sounds.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSound(s.id)}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${sound === s.id ? "bg-moss-light text-moss" : "bg-stone text-graphite-light hover:text-graphite"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-graphite-light mt-4">Sounds are simulated in this preview.</p>
          </SurfaceCard>
        </div>
      </div>
    </AppShell>
  );
};

export default Focus;
