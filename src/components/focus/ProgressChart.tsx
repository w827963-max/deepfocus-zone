import { SurfaceCard, SectionLabel } from "./Card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", focus: 3.2, distraction: 2.1 },
  { day: "Tue", focus: 4.0, distraction: 1.8 },
  { day: "Wed", focus: 2.5, distraction: 3.5 },
  { day: "Thu", focus: 5.1, distraction: 1.2 },
  { day: "Fri", focus: 3.8, distraction: 2.4 },
  { day: "Sat", focus: 1.5, distraction: 4.0 },
  { day: "Sun", focus: 4.2, distraction: 1.6 },
];

export const ProgressChart = () => (
  <SurfaceCard className="lg:col-span-12">
    <div className="flex justify-between items-end mb-6">
      <div>
        <SectionLabel>Weekly Progress</SectionLabel>
        <p className="text-graphite mt-2 font-serif-display text-2xl">
          24.3 hours of focused study
        </p>
      </div>
      <div className="hidden md:flex items-center gap-4 text-xs text-graphite-light">
        <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-moss" />Focus</span>
        <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-clay" />Distraction</span>
      </div>
    </div>

    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="g-focus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--moss))" stopOpacity={0.5} />
              <stop offset="100%" stopColor="hsl(var(--moss))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-dist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--clay))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(var(--clay))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="day" stroke="hsl(var(--graphite-light))" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--graphite-light))" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--surface))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          <Area type="monotone" dataKey="focus" stroke="hsl(var(--moss))" strokeWidth={2} fill="url(#g-focus)" />
          <Area type="monotone" dataKey="distraction" stroke="hsl(var(--clay))" strokeWidth={2} fill="url(#g-dist)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </SurfaceCard>
);
