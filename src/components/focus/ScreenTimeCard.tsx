import { useState } from "react";
import { SurfaceCard, SectionLabel } from "./Card";
import { Input } from "@/components/ui/input";
import { Smartphone } from "lucide-react";

export const ScreenTimeCard = ({
  minutes,
  onChange,
}: {
  minutes: number;
  onChange: (m: number) => void;
}) => {
  const [val, setVal] = useState(String(minutes));
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return (
    <SurfaceCard>
      <div className="flex justify-between items-start">
        <SectionLabel>Screen Time</SectionLabel>
        <Smartphone className="size-4 text-graphite-light" />
      </div>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-serif-display text-5xl leading-none tabular-nums">{hrs}</span>
        <span className="text-graphite-light text-sm">h</span>
        <span className="font-serif-display text-5xl leading-none tabular-nums ml-1">{mins}</span>
        <span className="text-graphite-light text-sm">m</span>
      </div>
      <p className="text-graphite-light text-xs mt-3">on social apps today</p>
      <div className="mt-5">
        <label className="text-[10px] uppercase tracking-widest text-graphite-light">Adjust (minutes)</label>
        <Input
          type="number"
          min="0"
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            const n = parseInt(e.target.value, 10);
            if (Number.isFinite(n) && n >= 0) onChange(n);
          }}
          className="mt-2 rounded-full bg-stone border-transparent focus-visible:ring-clay"
        />
      </div>
    </SurfaceCard>
  );
};
