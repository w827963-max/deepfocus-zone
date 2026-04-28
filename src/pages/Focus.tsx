import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/focus/AppShell";
import { PageHeader } from "@/components/focus/PageHeader";
import { SurfaceCard, SectionLabel } from "@/components/focus/Card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, X, Music2 } from "lucide-react";
import { toast } from "sonner";

type Phase = "focus" | "break";
type SoundKind = "none" | "lofi" | "rain" | "noise";
const sounds: { id: SoundKind; label: string }[] = [
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
  const [sound, setSound] = useState<SoundKind>("none");
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(50); // 0-100
  const [soundPaused, setSoundPaused] = useState(false);
  const [deepMode, setDeepMode] = useState(false);
  const deepRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<{ ctx: AudioContext; masterGain: GainNode; nodes: AudioScheduledSourceNode[]; timers: number[] } | null>(null);

  const effectiveGain = (vol: number) => (muted ? 0 : (vol / 100) * 0.4);

  const stopSound = () => {
    if (audioCtxRef.current) {
      const { ctx, nodes, timers } = audioCtxRef.current;
      timers.forEach((t) => clearInterval(t));
      nodes.forEach((n) => { try { n.stop(); } catch {} });
      ctx.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  const buildNoiseBuffer = (ctx: AudioContext, seconds = 2) => {
    const buf = ctx.createBuffer(1, seconds * ctx.sampleRate, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  };

  const playSound = (id: SoundKind) => {
    stopSound();
    setSound(id);
    setSoundPaused(false);
    if (id === "none") return;

    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = new Ctx();
    const masterGain = ctx.createGain();
    masterGain.gain.value = effectiveGain(volume);
    masterGain.connect(ctx.destination);
    const nodes: AudioScheduledSourceNode[] = [];

    if (id === "noise") {
      const src = ctx.createBufferSource();
      src.buffer = buildNoiseBuffer(ctx);
      src.loop = true;
      src.connect(masterGain);
      src.start();
      nodes.push(src);
    } else if (id === "rain") {
      // ===== Layer 1: continuous shower (filtered noise bed) =====
      const bed = ctx.createBufferSource();
      bed.buffer = buildNoiseBuffer(ctx, 4);
      bed.loop = true;
      const bedHp = ctx.createBiquadFilter();
      bedHp.type = "highpass";
      bedHp.frequency.value = 400;
      const bedLp = ctx.createBiquadFilter();
      bedLp.type = "lowpass";
      bedLp.frequency.value = 4500;
      const bedGain = ctx.createGain();
      bedGain.gain.value = 0.35;
      bed.connect(bedHp).connect(bedLp).connect(bedGain).connect(masterGain);
      bed.start();
      nodes.push(bed);

      // Subtle wind wobble
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.25;
      lfoGain.gain.value = 600;
      lfo.connect(lfoGain).connect(bedLp.frequency);
      lfo.start();
      nodes.push(lfo);

      // ===== Layer 2: distinct droplet impacts =====
      // Reusable short noise buffer for drop transients
      const dropBuf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const dropData = dropBuf.getChannelData(0);
      for (let i = 0; i < dropData.length; i++) dropData[i] = Math.random() * 2 - 1;

      const spawnDrop = () => {
        if (!audioCtxRef.current) return;
        const now = ctx.currentTime;
        const src = ctx.createBufferSource();
        src.buffer = dropBuf;
        // Vary pitch per drop for size variation
        src.playbackRate.value = 0.7 + Math.random() * 1.6;

        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 1500 + Math.random() * 3500;
        bp.Q.value = 4 + Math.random() * 6;

        const g = ctx.createGain();
        const peak = 0.25 + Math.random() * 0.55;
        const dur = 0.05 + Math.random() * 0.12;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(peak, now + 0.003);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        src.connect(bp).connect(g).connect(masterGain);
        src.start(now);
        src.stop(now + dur + 0.02);
      };

      // Schedule a burst of drops every ~120ms (≈8 drops/sec on average,
      // each tick spawns 0–3 to keep an organic patter)
      const dropTimer = window.setInterval(() => {
        const count = Math.random() < 0.85 ? 1 + Math.floor(Math.random() * 3) : 0;
        for (let i = 0; i < count; i++) {
          setTimeout(spawnDrop, Math.random() * 110);
        }
      }, 120);
      audioCtxRef.current = { ctx, masterGain, nodes, timers: [dropTimer] };
      return;
    } else if (id === "lofi") {
      // ===== Mellow lo-fi loop: chord progression + soft beat + vinyl crackle =====

      // Master lowpass to give that warm "tape" feel
      const warmth = ctx.createBiquadFilter();
      warmth.type = "lowpass";
      warmth.frequency.value = 3200;
      warmth.Q.value = 0.4;
      warmth.connect(masterGain);

      // --- Chord progression (Am7 - Fmaj7 - Cmaj7 - G) ---
      const chords = [
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 329.63, 392.00], // Cmaj7
        [196.00, 246.94, 293.66, 392.00], // G
      ];
      const chordGain = ctx.createGain();
      chordGain.gain.value = 0.0;
      chordGain.connect(warmth);

      // Persistent oscillators per voice; we just retune them each chord change
      const voices = chords[0].map((f) => {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = f;
        // light detune for warmth
        osc.detune.value = (Math.random() - 0.5) * 8;
        osc.connect(chordGain);
        osc.start();
        nodes.push(osc);
        return osc;
      });

      const beatSec = 2.0; // each chord lasts ~2s (slow, dreamy)
      let chordIdx = 0;
      const playChord = () => {
        if (!audioCtxRef.current) return;
        const now = ctx.currentTime;
        const freqs = chords[chordIdx % chords.length];
        voices.forEach((osc, i) => {
          osc.frequency.cancelScheduledValues(now);
          osc.frequency.linearRampToValueAtTime(freqs[i], now + 0.25);
        });
        // gentle envelope: swell in, hold, fade
        chordGain.gain.cancelScheduledValues(now);
        chordGain.gain.setValueAtTime(chordGain.gain.value, now);
        chordGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
        chordGain.gain.linearRampToValueAtTime(0.12, now + beatSec - 0.2);
        chordIdx++;
      };
      playChord();
      const chordTimer = window.setInterval(playChord, beatSec * 1000);

      // --- Soft kick on beat 1, hi-hat tick on every half-beat ---
      const kickBuf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const kickData = kickBuf.getChannelData(0);
      for (let i = 0; i < kickData.length; i++) kickData[i] = Math.random() * 2 - 1;

      const playKick = () => {
        if (!audioCtxRef.current) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.35, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        osc.connect(g).connect(warmth);
        osc.start(now);
        osc.stop(now + 0.3);
      };

      const playHat = () => {
        if (!audioCtxRef.current) return;
        const now = ctx.currentTime;
        const src = ctx.createBufferSource();
        src.buffer = kickBuf;
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 7000;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.06, now + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        src.connect(hp).connect(g).connect(masterGain);
        src.start(now);
        src.stop(now + 0.08);
      };

      // ~75 BPM feel: kick every 800ms, hat every 400ms
      const kickTimer = window.setInterval(playKick, 800);
      let hatStep = 0;
      const hatTimer = window.setInterval(() => {
        playHat();
        hatStep++;
      }, 400);

      // (Vinyl crackle removed — was reading as background hiss)

      audioCtxRef.current = { ctx, masterGain, nodes, timers: [chordTimer, kickTimer, hatTimer] };
      return;
    }

    audioCtxRef.current = { ctx, masterGain, nodes, timers: [] };
  };

  const togglePause = () => {
    if (sound === "none" || !audioCtxRef.current) return;
    const { ctx } = audioCtxRef.current;
    if (soundPaused) {
      ctx.resume();
      setSoundPaused(false);
    } else {
      ctx.suspend();
      setSoundPaused(true);
    }
  };

  const closeSoundPlayer = () => {
    stopSound();
    setSound("none");
    setSoundPaused(false);
  };

  // Apply volume / mute to active sound
  useEffect(() => {
    if (audioCtxRef.current) {
      audioCtxRef.current.masterGain.gain.value = effectiveGain(volume);
    }
  }, [muted, volume]);

  useEffect(() => () => stopSound(), []);

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

  

  const enterDeep = async () => {
    if (secondsLeft === 0) setSecondsLeft(focusMin * 60);
    setDeepMode(true);
    setRunning(true);
    // Wait for overlay to mount, then request fullscreen on it
    requestAnimationFrame(async () => {
      const el = deepRef.current;
      if (!el) return;
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if ((el as any).webkitRequestFullscreen) await (el as any).webkitRequestFullscreen();
      } catch (err) {
        console.warn("Fullscreen denied:", err);
      }
    });
  };

  const exitDeep = async () => {
    setDeepMode(false);
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch {}
    }
  };

  // Sync state if user presses Esc to leave fullscreen
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement && deepMode) setDeepMode(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [deepMode]);

  // Keyboard: Space to play/pause while in deep mode
  useEffect(() => {
    if (!deepMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); setRunning((r) => !r); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deepMode]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Focus tools"
        title="Run a session"
        description="Pomodoro, deep focus mode, and ambient sounds to anchor your attention."
        action={
          <Button onClick={enterDeep} className="rounded-full bg-graphite hover:bg-graphite/90">
            <Maximize2 className="size-4 mr-2" /> Deep Focus Mode
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        <div className="lg:col-span-8">
          <SurfaceCard className="py-12">{TimerCore}</SurfaceCard>
        </div>

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
                  onClick={() => playSound(s.id)}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${sound === s.id ? "bg-moss-light text-moss" : "bg-stone text-graphite-light hover:text-graphite"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-graphite-light mt-4">Tap a sound to play. Use the speaker icon to mute.</p>
          </SurfaceCard>
        </div>
      </div>

      {sound !== "none" && (
        <div className="fixed bottom-6 right-6 z-40 w-[300px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-moss-light text-moss flex items-center justify-center shrink-0">
              <Music2 className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-[0.2em] uppercase text-graphite-light">Now playing</div>
              <div className="text-sm font-medium text-foreground truncate">
                {sounds.find((s) => s.id === sound)?.label}
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={closeSoundPlayer} className="rounded-full size-8 shrink-0">
              <X className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button size="icon" onClick={togglePause} className="rounded-full bg-graphite hover:bg-graphite/90 size-9 shrink-0">
              {soundPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setMuted((m) => !m)} className="rounded-full size-9 shrink-0">
              {muted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </Button>
            <Slider
              value={[muted ? 0 : volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => { setVolume(v[0]); if (muted && v[0] > 0) setMuted(false); }}
              className="flex-1"
            />
          </div>
        </div>
      )}

      {/* Deep Focus full-screen overlay — themed via design tokens (follows light/dark) */}
      <div
        ref={deepRef}
        aria-hidden={!deepMode}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-12 p-6 bg-background text-foreground transition-all duration-500 ease-out ${
          deepMode
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-[1.04] pointer-events-none"
        }`}
      >
        <span className={`text-[10px] tracking-[0.3em] uppercase text-muted-foreground transition-all duration-700 delay-150 ${deepMode ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
          Deep Focus · {phase === "focus" ? "Focus" : "Break"} · Space to pause · Esc to exit
        </span>
        <div className={`relative transition-all duration-700 delay-200 ease-out ${deepMode ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <div className="font-serif-display text-[10rem] md:text-[14rem] tabular-nums leading-none text-foreground">
            {mm}:{ss}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={() => setRunning((r) => !r)}
            className="rounded-full px-8"
          >
            {running ? <Pause className="size-4 mr-2" /> : <Play className="size-4 mr-2" />}
            {running ? "Pause" : "Start"}
          </Button>
          <Button size="lg" variant="outline" onClick={reset} className="rounded-full">
            <RotateCcw className="size-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={exitDeep} className="rounded-full">
            <X className="size-4 mr-2" /> Exit
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default Focus;
