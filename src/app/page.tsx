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
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Dashboard />
      </main>
    </div>
  );
}
