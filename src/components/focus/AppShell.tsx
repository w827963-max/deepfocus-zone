import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-dvh bg-background flex p-3 md:p-6 gap-6">
    <Sidebar />
    <main className="flex-1 min-w-0 pb-24 lg:pb-2">{children}</main>
    <MobileNav />
  </div>
);
