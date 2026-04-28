import { NavLink } from "react-router-dom";
import { LayoutDashboard, Timer, BarChart3, CalendarDays, ShieldCheck, HeartPulse, Users, Telescope, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/focus", label: "Focus Tools", icon: Timer },
  { to: "/awareness", label: "Distractions", icon: BarChart3 },
  { to: "/planner", label: "Study Planner", icon: CalendarDays },
  { to: "/discipline", label: "Discipline", icon: ShieldCheck },
  { to: "/wellbeing", label: "Wellbeing", icon: HeartPulse },
  { to: "/community", label: "Community", icon: Users },
  { to: "/reality-check", label: "Reality Check", icon: Telescope },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const { profile, user, signOut } = useAuth();
  const name = profile?.display_name || user?.email?.split("@")[0] || "Student";
  const initial = name.charAt(0).toUpperCase();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-surface rounded-[2rem] p-7 shadow-card border border-border/60 flex-col justify-between">
      <div className="flex flex-col gap-10 min-h-0">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-to-br from-moss to-clay opacity-90" aria-hidden />
          <span className="font-serif-display text-2xl tracking-tight">FocusHub</span>
        </div>

        <nav aria-label="Primary" className="overflow-y-auto -mr-2 pr-2">
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

      <div className="flex flex-col gap-3 pt-6 border-t border-border/60">
        <NavLink to="/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="size-10 rounded-full object-cover" />
          ) : (
            <div className="size-10 rounded-full bg-gradient-to-br from-clay-light to-moss-light flex items-center justify-center font-serif-display text-lg text-graphite">
              {initial}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{name}</span>
            <span className="text-xs text-graphite-light truncate">{profile?.school || profile?.major || "Student"}</span>
          </div>
        </NavLink>
        <Button variant="ghost" size="sm" onClick={signOut} className="justify-start text-graphite-light hover:text-graphite rounded-xl">
          <LogOut className="size-4 mr-2" /> Sign out
        </Button>
      </div>
    </aside>
  );
};
