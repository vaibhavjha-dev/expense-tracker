"use client";

import SummaryCards from "./summaryCards";
import TransactionForm from "./transactionForm";
import TransactionList from "./transactionList";
import OverviewChart from "./overviewChart";
import { useTransactions } from "@/lib/context";
import { useProfile } from "@/hooks/use-profile";
import DownloadOptions from "./downloadOptions";

import { useTranslations } from "next-intl";

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  const { transactions } = useTransactions();
  const { profile } = useProfile();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greeting.morning');
    if (hour < 18) return t('greeting.afternoon');
    return t('greeting.evening');
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex-shrink-0 space-y-1">
        <div className="flex items-start justify-between gap-4 sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, <span className="block sm:inline">{profile.name || t('defaultUser')}</span>
          </h2>
          <DownloadOptions transactions={transactions} />
        </div>
        <p className="text-muted-foreground">
          {t('overview')}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <SummaryCards />
          <div className="grid gap-6 xl:grid-cols-2">
            <OverviewChart />
            <TransactionList />
          </div>
        </div>
        <div className="w-full flex-shrink-0 lg:w-[380px] xl:w-[420px]">
          <TransactionForm />
        </div>
      </div>
    </div>
  );
}
