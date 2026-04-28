import { useState } from "react";
import { AppShell } from "@/components/focus/AppShell";
import { FocusScoreCard } from "@/components/focus/FocusScoreCard";
import { StudyTimeLogger } from "@/components/focus/StudyTimeLogger";
import { ScreenTimeCard } from "@/components/focus/ScreenTimeCard";
import { StreakCard } from "@/components/focus/StreakCard";
import { ProgressChart } from "@/components/focus/ProgressChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFocusStore } from "@/hooks/useFocusStore";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const Index = () => {
  const { state, focusScore, todayDayIndex, logStudyHours, setScreenTime } = useFocusStore();
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell>
      <div className="flex flex-col gap-6 md:gap-8 animate-fade-up">
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 px-1">
          <div className="flex flex-col gap-1">
            <div className="lg:hidden flex items-center gap-2 mb-2">
              <div className="size-7 rounded-full bg-gradient-to-br from-moss to-clay" />
              <span className="font-serif-display text-xl">FocusHub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-graphite font-serif-display">
              {greeting()}, Elena.
            </h1>
            <p className="text-graphite-light text-sm">{date} — let's keep the streak alive.</p>
          </div>
          <Button className="bg-graphite hover:bg-graphite/90 text-primary-foreground rounded-full px-6 py-6 text-sm font-medium shadow-soft">
            <Sparkles className="size-4 mr-2" />
            Enter Deep Focus
          </Button>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
          <FocusScoreCard score={focusScore} delta={4} />
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            <StudyTimeLogger hoursToday={state.studyHoursToday} onLog={logStudyHours} />
            <ScreenTimeCard minutes={state.screenTimeMinutes} onChange={setScreenTime} />
          </div>

          <StreakCard streak={state.streak} todayIndex={todayDayIndex} completed={state.weekCompleted} />

          <div className="lg:col-span-5 bg-gradient-to-br from-moss-light to-clay-light rounded-[2rem] p-8 border border-border/60 shadow-card flex flex-col justify-between min-h-[200px]">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-graphite-light">
                Daily intention
              </p>
              <p className="font-serif-display text-2xl mt-3 leading-snug text-graphite text-pretty">
                "Discipline is choosing between what you want now and what you want most."
              </p>
            </div>
            <p className="text-xs text-graphite-light mt-6">— Abraham Lincoln</p>
          </div>

          <ProgressChart />
        </section>
      </div>
    </AppShell>
  );
};

export default Index;
