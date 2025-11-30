"use client";

import { useTransactions } from "@/lib/context";
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function SummaryCards() {
    const t = useTranslations('Dashboard.summary');
    const { balance, income, expenses } = useTransactions();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("in-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const cards = [
        {
            title: t('balance'),
            amount: balance,
            icon: WalletIcon,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: t('income'),
            amount: income,
            icon: ArrowUpIcon,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: t('expenses'),
            amount: expenses,
            icon: ArrowDownIcon,
            color: "text-red-500",
            bg: "bg-red-500/10",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1 + index * 0.1,
                                }}
                                className={`rounded-full p-2 ${card.bg}`}
                            >
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </motion.div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(card.amount)}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
