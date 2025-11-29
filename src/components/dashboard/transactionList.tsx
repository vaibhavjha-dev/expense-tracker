"use client";

import { useTransactions } from "@/lib/context";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2Icon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TransactionList() {
    const { transactions, deleteTransaction } = useTransactions();

    if (transactions.length === 0) {
        return (
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <p>No transactions yet.</p>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto p-4 pt-0">
                    <AnimatePresence initial={false}>
                        {transactions.map((transaction) => (
                            <motion.div
                                key={transaction.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-3 flex items-center justify-between rounded-lg border p-3 last:mb-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${transaction.type === "income"
                                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500"
                                            : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500"
                                            }`}
                                    >
                                        {transaction.type === "income" ? (
                                            <TrendingUpIcon className="h-5 w-5" />
                                        ) : (
                                            <TrendingDownIcon className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {transaction.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)} •{" "}
                                            {format(new Date(transaction.date), "MMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`font-semibold ${transaction.type === "income"
                                            ? "text-emerald-600 dark:text-emerald-500"
                                            : "text-red-600 dark:text-red-500"
                                            }`}
                                    >
                                        {transaction.type === "income" ? "+" : "-"}$
                                        {transaction.amount.toFixed(2)}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteTransaction(transaction.id)}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2Icon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}
