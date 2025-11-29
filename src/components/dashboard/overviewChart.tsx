"use client";

import { useTransactions } from "@/lib/context";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OverviewChart() {
    const { transactions } = useTransactions();

    const expenseData = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => {
            const existing = acc.find((item) => item.name === t.category);
            if (existing) {
                existing.value += t.amount;
            } else {
                acc.push({ name: t.category, value: t.amount });
            }
            return acc;
        }, [] as { name: string; value: number }[]);

    // Capitalize category names for display
    const formattedData = expenseData.map(item => ({
        ...item,
        name: item.name.charAt(0).toUpperCase() + item.name.slice(1)
    }));

    const COLORS = [
        "#ef4444",
        "#f97316",
        "#f59e0b",
        "#84cc16",
        "#10b981",
        "#06b6d4",
        "#3b82f6",
        "#6366f1",
    ];

    if (formattedData.length === 0) {
        return (
            <Card className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">No expenses to show</p>
            </Card>
        );
    }

    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={formattedData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    borderRadius: "8px",
                                    border: "none",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
