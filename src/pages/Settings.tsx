import { useEffect, useState } from "react";
import { AppShell } from "@/components/focus/AppShell";
import { PageHeader } from "@/components/focus/PageHeader";
import { SurfaceCard, SectionLabel } from "@/components/focus/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, LogOut, Trash2 } from "lucide-react";

const SettingsPage = () => {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    school: "",
    major: "",
    bio: "",
    avatar_url: "",
    daily_study_goal_hours: 4,
    daily_screen_time_limit_minutes: 120,
    notifications_enabled: true,
    quiet_hours_start: "",
    quiet_hours_end: "",
    theme: "light" as "light" | "dark",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      display_name: profile.display_name || "",
      school: profile.school || "",
      major: profile.major || "",
      bio: profile.bio || "",
      avatar_url: profile.avatar_url || "",
      daily_study_goal_hours: Number(profile.daily_study_goal_hours) || 4,
      daily_screen_time_limit_minutes: profile.daily_screen_time_limit_minutes || 120,
      notifications_enabled: profile.notifications_enabled,
      quiet_hours_start: profile.quiet_hours_start || "",
      quiet_hours_end: profile.quiet_hours_end || "",
      theme: (profile.theme === "dark" ? "dark" : "light"),
    });
    document.documentElement.classList.toggle("dark", profile.theme === "dark");
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      display_name: form.display_name,
      school: form.school || null,
      major: form.major || null,
      bio: form.bio || null,
      avatar_url: form.avatar_url || null,
      daily_study_goal_hours: form.daily_study_goal_hours,
      daily_screen_time_limit_minutes: form.daily_screen_time_limit_minutes,
      notifications_enabled: form.notifications_enabled,
      quiet_hours_start: form.quiet_hours_start || null,
      quiet_hours_end: form.quiet_hours_end || null,
      theme: form.theme,
    }).eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    document.documentElement.classList.toggle("dark", form.theme === "dark");
    await refreshProfile();
    toast.success("Settings saved");
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Settings"
        title="Your space, your rules"
        description="Tune your profile, goals, notifications, and look."
        action={
          <Button onClick={save} disabled={busy} className="rounded-full bg-graphite hover:bg-graphite/90">
            {busy && <Loader2 className="size-4 animate-spin mr-2" />} Save changes
          </Button>
        }
      />

      <Tabs defaultValue="profile" className="animate-fade-up">
        <TabsList className="bg-stone rounded-full p-1 h-11 grid grid-cols-4 max-w-2xl">
          <TabsTrigger value="profile" className="rounded-full data-[state=active]:bg-surface">Profile</TabsTrigger>
          <TabsTrigger value="goals" className="rounded-full data-[state=active]:bg-surface">Goals</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-full data-[state=active]:bg-surface">Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-full data-[state=active]:bg-surface">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <SurfaceCard>
            <SectionLabel>Profile</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div className="flex flex-col gap-2">
                <Label>Display name</Label>
                <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="rounded-full bg-stone border-transparent" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled className="rounded-full bg-stone border-transparent" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>School</Label>
                <Input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} className="rounded-full bg-stone border-transparent" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Major</Label>
                <Input value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} className="rounded-full bg-stone border-transparent" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label>Avatar URL</Label>
                <Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..." className="rounded-full bg-stone border-transparent" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label>Bio</Label>
                <Input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="rounded-full bg-stone border-transparent" />
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="mt-6">
            <SectionLabel>Account</SectionLabel>
            <div className="flex flex-wrap gap-3 mt-5">
              <Button variant="outline" onClick={signOut} className="rounded-full"><LogOut className="size-4 mr-2" /> Sign out</Button>
              <Button variant="outline" className="rounded-full text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => toast("Account deletion is disabled in this preview.")}>
                <Trash2 className="size-4 mr-2" /> Delete account
              </Button>
            </div>
          </SurfaceCard>
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <SurfaceCard>
            <SectionLabel>Goals</SectionLabel>
            <div className="mt-6 flex flex-col gap-8">
              <div>
                <div className="flex justify-between text-sm mb-2"><span>Daily study goal</span><span className="tabular-nums font-medium">{form.daily_study_goal_hours} hrs</span></div>
                <Slider value={[form.daily_study_goal_hours]} min={1} max={12} step={0.5} onValueChange={(v) => setForm({ ...form, daily_study_goal_hours: v[0] })} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span>Daily screen-time limit</span><span className="tabular-nums font-medium">{Math.floor(form.daily_screen_time_limit_minutes / 60)}h {form.daily_screen_time_limit_minutes % 60}m</span></div>
                <Slider value={[form.daily_screen_time_limit_minutes]} min={15} max={480} step={15} onValueChange={(v) => setForm({ ...form, daily_screen_time_limit_minutes: v[0] })} />
              </div>
            </div>
          </SurfaceCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <SurfaceCard>
            <SectionLabel>Notifications</SectionLabel>
            <div className="mt-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily reminders</p>
                  <p className="text-sm text-graphite-light">Nudge you to start your study session.</p>
                </div>
                <Switch checked={form.notifications_enabled} onCheckedChange={(v) => setForm({ ...form, notifications_enabled: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Quiet hours start</Label>
                  <Input type="time" value={form.quiet_hours_start} onChange={(e) => setForm({ ...form, quiet_hours_start: e.target.value })} className="rounded-full bg-stone border-transparent" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Quiet hours end</Label>
                  <Input type="time" value={form.quiet_hours_end} onChange={(e) => setForm({ ...form, quiet_hours_end: e.target.value })} className="rounded-full bg-stone border-transparent" />
                </div>
              </div>
            </div>
          </SurfaceCard>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <SurfaceCard>
            <SectionLabel>Appearance</SectionLabel>
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-md">
              {(["light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, theme: t })}
                  className={`p-5 rounded-2xl border-2 text-left transition-colors ${form.theme === t ? "border-moss bg-moss-light" : "border-border bg-stone"}`}
                >
                  <div className={`h-16 rounded-xl mb-3 ${t === "light" ? "bg-surface border border-border" : "bg-graphite"}`} />
                  <p className="font-medium capitalize">{t}</p>
                </button>
              ))}
            </div>
          </SurfaceCard>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
};

export default SettingsPage;
