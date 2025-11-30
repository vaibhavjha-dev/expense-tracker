"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/lib/context";
import { CATEGORIES, Transaction, TransactionType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface EditTransactionDialogProps {
    transaction: Transaction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditTransactionDialog({
    transaction,
    open,
    onOpenChange,
}: EditTransactionDialogProps) {
    const t = useTranslations('Dashboard.addTransaction');
    const tEdit = useTranslations('Dashboard.editTransaction');
    const { editTransaction } = useTransactions();

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState<TransactionType>("expense");
    const [date, setDate] = useState("");

    useEffect(() => {
        if (transaction) {
            setAmount(transaction.amount.toString());
            setDescription(transaction.description);
            setCategory(transaction.category);
            setType(transaction.type);
            // Format date to YYYY-MM-DD for input type="date"
            const d = new Date(transaction.date);
            setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
        }
    }, [transaction]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!transaction) return;

        if (!amount || !description || !category) {
            toast.error(t('error'));
            return;
        }

        editTransaction(transaction.id, {
            amount: parseFloat(amount),
            description,
            category,
            type,
            date: new Date(date + "T00:00").toISOString(),
        });

        toast.success(tEdit('success'));
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{tEdit('title')}</DialogTitle>
                </DialogHeader>
                <Tabs
                    defaultValue="expense"
                    value={type}
                    onValueChange={(v) => setType(v as TransactionType)}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger
                            value="income"
                            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 dark:data-[state=active]:text-white"
                        >
                            {t('income')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="expense"
                            className="data-[state=active]:bg-red-500 data-[state=active]:text-white dark:data-[state=active]:bg-red-500 dark:data-[state=active]:text-white"
                        >
                            {t('expense')}
                        </TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-date">{t('date')}</Label>
                                <Input
                                    id="edit-date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-amount">{t('amount')}</Label>
                                <Input
                                    id="edit-amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">{t('description')}</Label>
                            <Input
                                id="edit-description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. Grocery, Salary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-category">{t('category')}</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('selectCategory')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES[type].map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full">
                            {tEdit('save')}
                        </Button>
                    </form>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
