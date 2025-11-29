import Dashboard from "@/components/dashboard";
import Header from "@/components/layout/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Dashboard />
      </main>
    </div>
  );
}
