"use client";

import { useState } from "react";
import { useTransactions } from "@/lib/context";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Sector,
} from "recharts";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

    return (
        <g>
            <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} className="text-sm font-bold">
                {payload.name}
            </text>
            <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#888888" className="text-xs">
                {formatCurrency(value)}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
        </g>
    );
};

const CustomLegend = ({ payload }: any) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 text-sm">
            {payload.map((entry: any, index: number) => (
                <div key={`legend-item-${index}`} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

export default function OverviewChart() {
    const [activeIndex, setActiveIndex] = useState<number | undefined>();
    const t = useTranslations('Dashboard');
    const { transactions, balance } = useTransactions();

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

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
        "#faa160ff",
        "#f50be9ff",
        "#84cc16",
        "#10b981",
        "#06b6d4",
        "#3b82f6",
        "#6366f1",
        "#84ec9aff",
        "#07ffeaff"
    ];

    if (formattedData.length === 0) {
        return (
            <Card className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">{t('chart.noData')}</p>
            </Card>
        );
    }

    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>{t('chart.title')}</CardTitle>
                <CardAction>
                    <div className="text-sm font-medium text-muted-foreground">
                        {t('chart.balance')}: <span className="text-foreground">{formatCurrency(balance)}</span>
                    </div>
                </CardAction>
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
                                // @ts-ignore
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                onMouseEnter={onPieEnter}
                            >
                                {formattedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        strokeWidth={0}
                                    />
                                ))}
                            </Pie>
                            <Legend content={<CustomLegend />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
