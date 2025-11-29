"use client";

import { useState } from "react";
import { useTransactions } from "@/lib/context";
import { CATEGORIES, TransactionType } from "@/lib/types";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionForm() {
    const { addTransaction } = useTransactions();
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState<TransactionType>("expense");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !category) {
            toast.error("Please fill in all fields");
            return;
        }

        addTransaction({
            amount: parseFloat(amount),
            description,
            category,
            type,
            date: new Date().toISOString(),
        });

        setAmount("");
        setDescription("");
        setCategory("");
        toast.success("Transaction added successfully");
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Add Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs
                        defaultValue="expense"
                        value={type}
                        onValueChange={(v) => setType(v as TransactionType)}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="income">Income</TabsTrigger>
                            <TabsTrigger value="expense">Expense</TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g. Grocery, Salary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
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
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Transaction
                            </Button>
                        </form>
                    </Tabs>
                </CardContent>
            </Card>
        </motion.div>
    );
}
