"use client";

import SummaryCards from "./summaryCards";
import TransactionForm from "./transactionForm";
import TransactionList from "./transactionList";
import OverviewChart from "./overviewChart";

export default function Dashboard() {
  return (
    <div className="w-full space-y-6">
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
