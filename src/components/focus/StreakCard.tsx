import { SurfaceCard, SectionLabel } from "./Card";
import { Flame } from "lucide-react";

const days = ["M", "T", "W", "T", "F", "S", "S"];

export const StreakCard = ({ streak, todayIndex, completed }: { streak: number; todayIndex: number; completed: boolean[] }) => (
  <SurfaceCard className="lg:col-span-7">
    <div className="flex justify-between items-center">
      <SectionLabel>Study Streak</SectionLabel>
      <div className="flex items-center gap-1.5 text-clay">
        <Flame className="size-4 fill-clay/30" />
        <span className="text-sm font-semibold tabular-nums">{streak} days</span>
      </div>
    </div>

    <div className="flex justify-between items-end mt-8">
      {days.map((d, i) => {
        const isToday = i === todayIndex;
        const done = completed[i];
        return (
          <div key={i} className="flex flex-col items-center gap-3 relative">
            {isToday && (
              <span className="absolute -top-6 text-[10px] font-medium text-clay">Today</span>
            )}
            <div
              className={
                isToday
                  ? "size-11 md:size-12 rounded-full bg-clay-light border-[3px] border-surface shadow-[0_0_0_2px_hsl(var(--clay))] flex items-center justify-center animate-pulse-ring"
                  : done
                  ? "size-11 md:size-12 rounded-full bg-moss"
                  : "size-11 md:size-12 rounded-full bg-stone"
              }
            >
              {isToday && <div className="size-3.5 rounded-full bg-clay" />}
            </div>
            <span className={`text-xs font-medium ${isToday ? "text-graphite" : done ? "text-graphite-light" : "text-graphite-light/50"}`}>
              {d}
            </span>
          </div>
        );
      })}
    </div>
  </SurfaceCard>
);
