"use client";

import { useTransactions } from "@/lib/context";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { CheckIcon, PencilIcon, Trash2Icon, TrendingDownIcon, TrendingUpIcon, X } from "lucide-react";
import EditTransactionDialog from "./editTransactionDialog";
import { Transaction } from "@/lib/types";

export default function TransactionList() {
    const t = useTranslations('Dashboard');
    const { transactions, deleteTransaction } = useTransactions();
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleEditClick = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsEditDialogOpen(true);
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
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="text-muted-foreground hover:text-primary"
                >
                    {isEditMode ? <CheckIcon className="h-5 w-5" /> : <PencilIcon className="h-5 w-5" />}
                </Button>
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
                                className="mb-3 flex items-center justify-between rounded-lg border p-3 last:mb-0"
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
                                            ? "text-emerald-600 dark:text-emerald-500"
                                            : "text-red-600 dark:text-red-500"
                                            }`}
                                    >
                                        {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                                    </span>
                                    {isEditMode && (
                                        <div className="flex items-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditClick(transaction)}
                                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteTransaction(transaction.id)}
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </CardContent>
            <EditTransactionDialog
                transaction={editingTransaction}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
            />
        </Card >
    );
}
