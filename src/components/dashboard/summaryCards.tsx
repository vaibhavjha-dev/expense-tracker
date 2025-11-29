"use client";

import { useTransactions } from "@/lib/context";
import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SummaryCards() {
    const { balance, income, expenses } = useTransactions();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const cards = [
        {
            title: "Total Balance",
            amount: balance,
            icon: WalletIcon,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Income",
            amount: income,
            icon: ArrowUpIcon,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Expenses",
            amount: expenses,
            icon: ArrowDownIcon,
            color: "text-red-500",
            bg: "bg-red-500/10",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <div className={`rounded-full p-2 ${card.bg}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
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
