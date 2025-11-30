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
    <div className="w-full space-y-6">
      <div className="space-y-1">
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
      <SummaryCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <OverviewChart />
          <TransactionList />
        </div>
        <div>
          <TransactionForm />
        </div>
      </div>
    </div>
  );
}
