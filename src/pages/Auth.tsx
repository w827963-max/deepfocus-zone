import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (!loading && user) return <Navigate to="/" replace />;

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate("/");
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: name },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email to verify your account");
  };

  const oauth = async (provider: "google" | "apple") => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      return toast.error("Sign-in failed");
    }
    if (result.redirected) return;
    navigate("/");
  };

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-[2rem] p-8 md:p-10 shadow-card border border-border/60 animate-fade-up">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="size-12 rounded-full bg-gradient-to-br from-moss to-clay mb-4" />
          <h1 className="font-serif-display text-3xl text-graphite">FocusHub</h1>
          <p className="text-graphite-light text-sm mt-2">Reclaim your focus. Build your streak.</p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-full h-11 border-border bg-surface hover:bg-stone"
            disabled={busy}
            onClick={() => oauth("google")}
          >
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full h-11 border-border bg-graphite hover:bg-graphite/90 text-primary-foreground"
            disabled={busy}
            onClick={() => oauth("apple")}
          >
            Continue with Apple
          </Button>
        </div>

        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px bg-border" />
          <span className="text-[10px] tracking-widest uppercase text-graphite-light">or</span>
          <span className="flex-1 h-px bg-border" />
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full bg-stone rounded-full p-1 h-11">
            <TabsTrigger value="signin" className="rounded-full data-[state=active]:bg-surface">Sign in</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-surface">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={signIn} className="flex flex-col gap-4 mt-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email-in">Email</Label>
                <Input id="email-in" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-full bg-stone border-transparent" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pw-in">Password</Label>
                <Input id="pw-in" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-full bg-stone border-transparent" />
              </div>
              <Button type="submit" disabled={busy} className="rounded-full h-11 bg-graphite hover:bg-graphite/90">
                {busy && <Loader2 className="size-4 animate-spin mr-2" />}
                Sign in
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signUp} className="flex flex-col gap-4 mt-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name-up">Name</Label>
                <Input id="name-up" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="rounded-full bg-stone border-transparent" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email-up">Email</Label>
                <Input id="email-up" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-full bg-stone border-transparent" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pw-up">Password</Label>
                <Input id="pw-up" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-full bg-stone border-transparent" />
              </div>
              <Button type="submit" disabled={busy} className="rounded-full h-11 bg-moss hover:bg-moss/90 text-primary-foreground">
                {busy && <Loader2 className="size-4 animate-spin mr-2" />}
                Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
