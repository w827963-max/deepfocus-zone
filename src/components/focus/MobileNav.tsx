import { NavLink } from "react-router-dom";
import { LayoutDashboard, Timer, CalendarDays, ShieldCheck, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/focus", label: "Focus", icon: Timer },
  { to: "/planner", label: "Plan", icon: CalendarDays },
  { to: "/discipline", label: "Discipline", icon: ShieldCheck },
  { to: "/wellbeing", label: "You", icon: HeartPulse },
];

export const MobileNav = () => (
  <nav
    aria-label="Primary mobile"
    className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-surface/90 backdrop-blur-md border border-border rounded-2xl shadow-soft px-2 py-2 flex justify-between"
  >
    {items.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          cn(
            "flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl text-[10px] font-medium transition-colors",
            isActive ? "text-moss bg-moss-light" : "text-graphite-light"
          )
        }
      >
        <Icon className="size-5" />
        {label}
      </NavLink>
    ))}
  </nav>
);
