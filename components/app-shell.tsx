"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Leaf, Sparkles } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lens, setLens] = useState<"executive" | "practitioner">("executive");

  useEffect(() => {
    const param = searchParams?.get("lens");
    if (param === "practitioner" || param === "executive") {
      setLens(param);
      return;
    }
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("microgrid:lens");
      if (stored === "practitioner" || stored === "executive") {
        setLens(stored);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams) return;
    const hasLens = searchParams.get("lens");
    if (!hasLens) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("lens", lens);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, lens, pathname, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("microgrid:lens", lens);
    }
  }, [lens]);

  const isPractitioner = lens === "practitioner";

  const handleSwitch = (nextLens: "executive" | "practitioner") => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("lens", nextLens);
    setLens(nextLens);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-cloud">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href={`/?lens=${lens}`}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
                Earth Finance
              </p>
              <p className="text-lg font-semibold">Microgrid ROI Studio</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2 rounded-full bg-mist p-1">
            <button
              type="button"
              onClick={() => handleSwitch("executive")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium",
                !isPractitioner
                  ? "bg-white text-ink shadow"
                  : "text-ink/60"
              )}
            >
              Executive
            </button>
            <button
              type="button"
              onClick={() => handleSwitch("practitioner")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium",
                isPractitioner
                  ? "bg-white text-ink shadow"
                  : "text-ink/60"
              )}
            >
              Practitioner
            </button>
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
