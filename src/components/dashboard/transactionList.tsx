"use client";

import { useTransactions } from "@/lib/context";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import EditTransactionDialog from "./editTransactionDialog";
import ViewTransactionDialog from "./viewTransactionDialog";
import { Transaction } from "@/lib/types";

export default function TransactionList() {
    const t = useTranslations('Dashboard');
    const { transactions, deleteTransaction } = useTransactions();

    // Edit Dialog State
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // View Dialog State
    const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const handleRowClick = (transaction: Transaction) => {
        setViewingTransaction(transaction);
        setIsViewDialogOpen(true);
    };

    const handleEditFromView = (transaction: Transaction) => {
        setIsViewDialogOpen(false);
        setEditingTransaction(transaction);
        setIsEditDialogOpen(true);
    };

    const handleDeleteFromView = (id: string) => {
        deleteTransaction(id);
        setIsViewDialogOpen(false);
    };

    if (transactions.length === 0) {
        return (
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <p>{t('noTransactions')}</p>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('recentTransactions')}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto p-4 pt-0 scrollbar-thin">
                    <AnimatePresence initial={false}>
                        {transactions.map((transaction) => (
                            <motion.div
                                key={transaction.id}
                                initial={{ opacity: 0, height: 0 }}
                                whileInView={{ opacity: 1, height: "auto" }}
                                viewport={{ once: true }}
                                exit={{ opacity: 0, height: 0 }}
                                onClick={() => handleRowClick(transaction)}
                                className="mb-3 flex items-center justify-between rounded-lg border p-3 last:mb-0 cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                        }}
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${transaction.type === "income"
                                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500"
                                            : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500"
                                            }`}
                                    >
                                        {transaction.type === "income" ? (
                                            <TrendingUpIcon className="h-5 w-5" />
                                        ) : (
                                            <TrendingDownIcon className="h-5 w-5" />
                                        )}
                                    </motion.div>
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
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`font-semibold ${transaction.type === "income"
                                            ? "text-[#009966] dark:text-[#009966]"
                                            : "text-[#e8000c] dark:text-[#e8000c]"
                                            }`}
                                    >
                                        {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </CardContent>

            <ViewTransactionDialog
                transaction={viewingTransaction}
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                onEdit={handleEditFromView}
                onDelete={handleDeleteFromView}
            />

            <EditTransactionDialog
                transaction={editingTransaction}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
            />
        </Card >
    );
}
