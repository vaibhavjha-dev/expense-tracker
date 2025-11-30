"use client";

import { motion } from "framer-motion";

import { useState } from "react";
import { Transaction } from "@/lib/types";
import { generatePDF } from "@/lib/pdfGenerator";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface DownloadOptionsProps {
    transactions: Transaction[];
    className?: string;
}

export default function DownloadOptions({ transactions, className }: DownloadOptionsProps) {
    const t = useTranslations('Dashboard.download');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleDownload = () => {
        let filtered = transactions;

        // Determine effective dates
        let start = startDate ? new Date(startDate) : null;
        let end = endDate ? new Date(endDate) : new Date();

        if (!start) {
            if (transactions.length > 0) {
                start = transactions.reduce((min, t) => {
                    const d = new Date(t.date);
                    return d < min ? d : min;
                }, new Date(transactions[0].date));
            } else {
                start = new Date(0); // Fallback if no transactions
            }
        }

        // Set times for accurate comparison
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        filtered = transactions.filter((t) => {
            const tDate = new Date(t.date);
            return tDate >= start! && tDate <= end;
        });

        if (filtered.length === 0) {
            toast.error(t('error'));
            return;
        }

        generatePDF(filtered, start.toISOString(), end.toISOString());
        setIsOpen(false);
        toast.success(t('success'));
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className={cn("w-auto", className)}>
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                        }}
                    >
                        <DownloadIcon className="h-4 w-4 sm:mr-2" />
                    </motion.div>
                    <span className="hidden sm:inline">{t('button')}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t('description')}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-date">{t('startDate')}</Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-date">{t('endDate')}</Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleDownload}>{t('submit')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}
