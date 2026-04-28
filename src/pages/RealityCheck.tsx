import { useState } from "react";
import { AppShell } from "@/components/focus/AppShell";
import { PageHeader } from "@/components/focus/PageHeader";
import { SurfaceCard, SectionLabel } from "@/components/focus/Card";
import { Slider } from "@/components/ui/slider";

const RealityCheck = () => {
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const perWeek = hoursPerDay * 7;
  const perMonth = hoursPerDay * 30;
  const perYear = hoursPerDay * 365;
  const daysLost = Math.round(perYear / 24);
  const booksRead = Math.round(perYear / 8);          // ~8h per book
  const languageHours = perYear;                       // hours toward fluency
  const courses = Math.round(perYear / 50);            // ~50h per online course

  return (
    <AppShell>
      <PageHeader eyebrow="Reality check" title="What scrolling actually costs" description="Move the slider. See your year." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        <SurfaceCard className="lg:col-span-12 bg-gradient-to-br from-clay-light via-stone to-moss-light">
          <SectionLabel>Your daily social media use</SectionLabel>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif-display text-7xl md:text-8xl tabular-nums text-graphite">{hoursPerDay}</span>
            <span className="text-graphite-light text-lg">hours / day</span>
          </div>
          <div className="mt-6 max-w-xl">
            <Slider value={[hoursPerDay]} min={0} max={10} step={0.5} onValueChange={(v) => setHoursPerDay(v[0])} />
            <div className="flex justify-between text-xs text-graphite-light mt-2 tabular-nums">
              <span>0h</span><span>5h</span><span>10h</span>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="lg:col-span-4 text-center">
          <SectionLabel>Per week</SectionLabel>
          <p className="font-serif-display text-5xl mt-4 text-clay tabular-nums">{perWeek}</p>
          <p className="text-graphite-light text-sm mt-2">hours gone</p>
        </SurfaceCard>
        <SurfaceCard className="lg:col-span-4 text-center">
          <SectionLabel>Per month</SectionLabel>
          <p className="font-serif-display text-5xl mt-4 text-clay tabular-nums">{perMonth}</p>
          <p className="text-graphite-light text-sm mt-2">hours gone</p>
        </SurfaceCard>
        <SurfaceCard className="lg:col-span-4 text-center">
          <SectionLabel>Per year</SectionLabel>
          <p className="font-serif-display text-5xl mt-4 text-clay tabular-nums">{perYear}</p>
          <p className="text-graphite-light text-sm mt-2">≈ {daysLost} full days</p>
        </SurfaceCard>

        <SurfaceCard className="lg:col-span-12">
          <SectionLabel>What that year could become instead</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <div className="p-6 rounded-2xl bg-moss-light">
              <p className="font-serif-display text-5xl text-moss tabular-nums">{booksRead}</p>
              <p className="text-graphite mt-2 font-medium">books read</p>
              <p className="text-xs text-graphite-light mt-1">~8 hours each</p>
            </div>
            <div className="p-6 rounded-2xl bg-clay-light">
              <p className="font-serif-display text-5xl text-clay tabular-nums">{languageHours}</p>
              <p className="text-graphite mt-2 font-medium">hrs toward fluency</p>
              <p className="text-xs text-graphite-light mt-1">a new language is realistic</p>
            </div>
            <div className="p-6 rounded-2xl bg-stone">
              <p className="font-serif-display text-5xl text-graphite tabular-nums">{courses}</p>
              <p className="text-graphite mt-2 font-medium">full online courses</p>
              <p className="text-xs text-graphite-light mt-1">~50 hours each</p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
};

export default RealityCheck;
