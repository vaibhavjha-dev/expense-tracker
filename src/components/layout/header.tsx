"use client";

import { MoonIcon, SunIcon, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useProfile } from "@/hooks/use-profile";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { profile } = useProfile();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-2 lg:px-4">
        {profile.name ? (
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex w-8 items-center justify-center">
              {pathname === "/settings" ? (
                <>
                  <div className="hidden lg:block">
                    <Logo size={32} />
                  </div>
                  <motion.div
                    className="lg:hidden"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ x: -4 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </motion.div>
                </>
              ) : (
                <Logo size={32} />
              )}
            </div>
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
