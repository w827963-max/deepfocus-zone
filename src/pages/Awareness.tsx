import { AppShell } from "@/components/focus/AppShell";
import { PageHeader } from "@/components/focus/PageHeader";
import { SurfaceCard, SectionLabel } from "@/components/focus/Card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

const weekly = [
  { day: "Mon", hrs: 2.4 }, { day: "Tue", hrs: 3.1 }, { day: "Wed", hrs: 1.9 },
  { day: "Thu", hrs: 2.8 }, { day: "Fri", hrs: 3.6 }, { day: "Sat", hrs: 4.2 }, { day: "Sun", hrs: 3.0 },
];

const distribution = [
  { name: "TikTok", value: 38, color: "hsl(var(--clay))" },
  { name: "Instagram", value: 27, color: "hsl(var(--moss))" },
  { name: "YouTube Shorts", value: 18, color: "hsl(17 50% 60%)" },
  { name: "Snapchat", value: 10, color: "hsl(130 13% 45%)" },
  { name: "X / Twitter", value: 7, color: "hsl(40 4% 55%)" },
];

const quotes = [
  { q: "I lost an entire weekend to TikTok before midterms. I felt empty after.", who: "Anonymous · Year 2" },
  { q: "Instagram makes me compare my study habits to people who fake theirs.", who: "Anonymous · Year 3" },
  { q: "I deleted Snapchat for a week and my GPA literally went up.", who: "Anonymous · Year 1" },
  { q: "Reels stole 4 hours from me yesterday. I planned for 30 minutes.", who: "Anonymous · Year 4" },
];

const Awareness = () => (
  <AppShell>
    <PageHeader
      eyebrow="Distraction awareness"
      title="The cost of every scroll"
      description="A clear look at where your attention is leaking — and what your peers say about it."
    />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
      <SurfaceCard className="lg:col-span-7">
        <div className="flex justify-between items-end mb-6">
          <div>
            <SectionLabel>Average daily social usage</SectionLabel>
            <p className="font-serif-display text-3xl mt-2">3.0 hrs / day</p>
          </div>
          <span className="text-sm text-clay font-medium">≈ 21 hrs / week</span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--graphite-light))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--graphite-light))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="hrs" fill="hsl(var(--clay))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SurfaceCard>

      <SurfaceCard className="lg:col-span-5">
        <SectionLabel>Where it goes</SectionLabel>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={distribution} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {distribution.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </SurfaceCard>

      <SurfaceCard className="lg:col-span-12 bg-gradient-to-br from-clay-light to-stone">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-graphite-light text-xs uppercase tracking-widest">This week</p>
            <p className="font-serif-display text-4xl mt-2 text-clay">21 hrs</p>
            <p className="text-graphite-light text-sm mt-1">≈ a full work day, gone</p>
          </div>
          <div>
            <p className="text-graphite-light text-xs uppercase tracking-widest">This month</p>
            <p className="font-serif-display text-4xl mt-2 text-clay">90 hrs</p>
            <p className="text-graphite-light text-sm mt-1">≈ 3.7 days non-stop</p>
          </div>
          <div>
            <p className="text-graphite-light text-xs uppercase tracking-widest">This year</p>
            <p className="font-serif-display text-4xl mt-2 text-clay">1,095 hrs</p>
            <p className="text-graphite-light text-sm mt-1">≈ 45 days of your life</p>
          </div>
        </div>
      </SurfaceCard>

      <div className="lg:col-span-12">
        <SectionLabel>Voices from students</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {quotes.map((q, i) => (
            <SurfaceCard key={i} className="!p-6">
              <p className="font-serif-display text-xl leading-snug text-graphite text-pretty">"{q.q}"</p>
              <p className="text-xs text-graphite-light mt-4">{q.who}</p>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </div>
  </AppShell>
);

export default Awareness;
