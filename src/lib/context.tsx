"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Transaction } from "./types";

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, "id">) => void;
    deleteTransaction: (id: string) => void;
    balance: number;
    income: number;
    expenses: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
    undefined
);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem("transactions");
        if (stored) {
            try {
                setTransactions(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse transactions", e);
            }
        }
    }, []);

    // Save to local storage whenever transactions change
    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    const addTransaction = (transaction: Omit<Transaction, "id">) => {
        const newTransaction = {
            ...transaction,
            id: crypto.randomUUID(),
        };
        setTransactions((prev) => [newTransaction, ...prev]);
    };

    const deleteTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expenses;

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                addTransaction,
                deleteTransaction,
                balance,
                income,
                expenses,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error("useTransactions must be used within a TransactionProvider");
    }
    return context;
}
