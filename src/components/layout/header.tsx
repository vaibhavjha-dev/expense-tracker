"use client";

import { MoonIcon, SunIcon, Settings } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useProfile } from "@/hooks/use-profile";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { profile } = useProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {profile.name ? (
          <Link href="/" className="flex items-center gap-2">
            <Logo size={32} />
            <h1 className="text-xl font-bold">
              Expense Tracker
            </h1>
          </Link>
        ) : (
          <div className="flex items-center gap-2 cursor-not-allowed opacity-70">
            <Logo size={32} />
            <h1 className="text-xl font-bold">
              Expense Tracker
            </h1>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
