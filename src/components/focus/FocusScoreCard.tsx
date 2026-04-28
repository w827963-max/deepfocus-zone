import { SurfaceCard, SectionLabel } from "./Card";

export const FocusScoreCard = ({ score = 86, delta = 4 }: { score?: number; delta?: number }) => (
  <SurfaceCard className="lg:col-span-5 flex flex-col justify-between min-h-[300px]">
    <div className="flex justify-between items-start">
      <SectionLabel>Focus Score</SectionLabel>
      <span className="text-moss text-xs font-medium bg-moss-light px-3 py-1 rounded-full">Optimal</span>
    </div>

    <div className="flex flex-col gap-3 mt-6">
      <div className="flex items-baseline gap-3">
        <span className="font-serif-display text-[7rem] md:text-[8rem] leading-none tracking-tighter text-graphite tabular-nums">
          {score}
        </span>
        <span className="text-moss font-medium text-base">+{delta}</span>
      </div>
      <p className="text-graphite-light text-pretty max-w-[28ch] leading-relaxed text-sm">
        You hit deep flow during your morning session. Your cognitive load looks balanced.
      </p>
    </div>
  </SurfaceCard>
);
