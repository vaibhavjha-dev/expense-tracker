"use client";

import Dashboard from "@/components/dashboard";
import Header from "@/components/layout/header";
import { useProfile } from "@/hooks/use-profile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { profile, loading } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile.name) {
      router.push("/settings");
    }
  }, [profile, loading, router]);

  if (loading || !profile.name) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <Header />
      <main className="flex-1 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <Dashboard />
        </div>
      </main>
    </div>
  );
}
