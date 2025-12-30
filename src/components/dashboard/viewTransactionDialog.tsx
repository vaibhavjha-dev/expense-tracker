"use client";

import { Transaction } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { CalendarIcon, TagIcon, FileTextIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ViewTransactionDialogProps {
    transaction: Transaction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}

export default function ViewTransactionDialog({
    transaction,
    open,
    onOpenChange,
    onEdit,
    onDelete,
}: ViewTransactionDialogProps) {
    const t = useTranslations('Dashboard');

    if (!transaction) return null;

    const isIncome = transaction.type === 'income';
    const colorClass = isIncome ? "text-emerald-500" : "text-red-500";
    const bgColorClass = isIncome ? "bg-emerald-500/10" : "bg-red-500/10";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('viewTransaction.title')}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    {/* Amount Header */}
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className={`text-4xl font-bold ${colorClass}`}>
                            {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${bgColorClass} ${colorClass}`}>
                            {transaction.type === 'income' ? t('addTransaction.income') : t('addTransaction.expense')}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('addTransaction.date')}</p>
                                <p className="text-sm font-medium">
                                    {format(new Date(transaction.date), "EEEE, MMMM d, yyyy")}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <TagIcon className="w-5 h-5 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('addTransaction.category')}</p>
                                <p className="text-sm font-medium capitalize">
                                    {transaction.category}
                                </p>
                            </div>
                        </div>

                        {transaction.description && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <FileTextIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('addTransaction.description')}</p>
                                    <p className="text-sm font-medium break-words">
                                        {transaction.description}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex gap-2 sm:gap-0">
                    <div className="flex w-full gap-2">
                        <Button
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={() => {
                                onEdit(transaction);
                                onOpenChange(false);
                            }}
                        >
                            <PencilIcon className="w-4 h-4" />
                            {t('viewTransaction.edit')}
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 gap-2"
                            onClick={() => {
                                onDelete(transaction.id);
                                onOpenChange(false);
                            }}
                        >
                            <Trash2Icon className="w-4 h-4" />
                            {t('viewTransaction.delete')}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
