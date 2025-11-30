"use client";

import SummaryCards from "./summaryCards";
import TransactionForm from "./transactionForm";
import TransactionList from "./transactionList";
import OverviewChart from "./overviewChart";
import { useTransactions } from "@/lib/context";
import { useProfile } from "@/hooks/use-profile";
import DownloadOptions from "./downloadOptions";

export default function Dashboard() {
  const { transactions } = useTransactions();
  const { profile } = useProfile();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex-shrink-0 space-y-1">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {profile.name || "User"}
          </h2>
          <DownloadOptions transactions={transactions} />
        </div>
        <p className="text-muted-foreground">
          Overview of your financial activities
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 md:flex-row">
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          <SummaryCards />
          <div className="grid gap-6 xl:grid-cols-2">
            <OverviewChart />
            <TransactionList />
          </div>
        </div>
        <div className="w-full flex-shrink-0 overflow-y-auto md:w-[380px] lg:w-[420px]">
          <TransactionForm />
        </div>
      </div>
    </div>
  );
}
