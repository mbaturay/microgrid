"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Leaf, Sparkles } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPractitioner = pathname?.startsWith("/practitioner");

  return (
    <div className="min-h-screen bg-cloud">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                Earth Finance
              </p>
              <p className="text-lg font-semibold">Microgrid ROI Studio</p>
            </div>
          </div>
          <nav className="flex items-center gap-2 rounded-full bg-mist p-1">
            <Link
              href="/"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium",
                !isPractitioner
                  ? "bg-white text-ink shadow"
                  : "text-ink/60"
              )}
            >
              Executive
            </Link>
            <Link
              href="/practitioner"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium",
                isPractitioner
                  ? "bg-white text-ink shadow"
                  : "text-ink/60"
              )}
            >
              Practitioner
            </Link>
          </nav>
          <Button size="sm" variant="outline" className="hidden md:inline-flex">
            <Sparkles className="h-4 w-4" />
            Demo Mode
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
