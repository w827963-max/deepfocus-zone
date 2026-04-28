import { NavLink } from "react-router-dom";
import { LayoutDashboard, Timer, BarChart3, CalendarDays, ShieldCheck, HeartPulse, Users, Telescope } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/focus", label: "Focus Tools", icon: Timer },
  { to: "/awareness", label: "Distractions", icon: BarChart3 },
  { to: "/planner", label: "Study Planner", icon: CalendarDays },
  { to: "/discipline", label: "Discipline", icon: ShieldCheck },
  { to: "/wellbeing", label: "Wellbeing", icon: HeartPulse },
  { to: "/community", label: "Community", icon: Users },
  { to: "/reality-check", label: "Reality Check", icon: Telescope },
];

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-surface rounded-[2rem] p-7 shadow-card border border-border/60 flex-col justify-between">
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-to-br from-moss to-clay opacity-90" aria-hidden />
          <span className="font-serif-display text-2xl tracking-tight">FocusHub</span>
        </div>

        <nav aria-label="Primary">
          <ul className="flex flex-col gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-moss-light text-moss"
                        : "text-graphite-light hover:text-graphite hover:bg-stone"
                    )
                  }
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-3 pt-6 border-t border-border/60">
        <div className="size-10 rounded-full bg-gradient-to-br from-clay-light to-moss-light flex items-center justify-center font-serif-display text-lg text-graphite">
          E
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate">Elena Rostova</span>
          <span className="text-xs text-graphite-light truncate">Architecture, Sem 4</span>
        </div>
      </div>
    </aside>
  );
};
