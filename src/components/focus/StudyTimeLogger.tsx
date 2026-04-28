import { useState } from "react";
import { SurfaceCard, SectionLabel } from "./Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const StudyTimeLogger = ({
  hoursToday,
  onLog,
}: {
  hoursToday: number;
  onLog: (hours: number) => void;
}) => {
  const [val, setVal] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseFloat(val);
    if (!Number.isFinite(n) || n <= 0) return;
    onLog(n);
    setVal("");
    toast.success(`Logged ${n}h of study`);
  };

  return (
    <SurfaceCard className="flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <SectionLabel>Study Time Today</SectionLabel>
        <span className="text-xs font-medium text-graphite bg-stone px-3 py-1 rounded-full tabular-nums">
          Goal · 5h
        </span>
      </div>
      <div className="mt-6">
        <div className="flex items-baseline gap-2">
          <span className="font-serif-display text-6xl leading-none text-graphite tabular-nums">
            {hoursToday.toFixed(1)}
          </span>
          <span className="text-graphite-light text-sm">hrs logged</span>
        </div>
        <div className="mt-4 h-2 bg-stone rounded-full overflow-hidden">
          <div
            className="h-full bg-moss rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, (hoursToday / 5) * 100)}%` }}
          />
        </div>
      </div>
      <form onSubmit={submit} className="mt-6 flex gap-2">
        <Input
          type="number"
          step="0.25"
          min="0"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Add hours…"
          className="rounded-full bg-stone border-transparent focus-visible:ring-moss"
        />
        <Button type="submit" size="icon" className="rounded-full bg-graphite hover:bg-graphite/90 shrink-0">
          <Plus className="size-4" />
        </Button>
      </form>
    </SurfaceCard>
  );
};
