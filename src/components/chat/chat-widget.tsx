"use client";

import { MessageSquare, Send, X, Bot, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTransactions } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export function ChatWidget({ isOffline = false }: { isOffline?: boolean }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { addTransaction, editTransaction, deleteTransaction, transactions } = useTransactions();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    const formatTransactionMessage = (data: {
        amount: number;
        description: string;
        category: string;
        type: "income" | "expense";
        date?: string;
    }) => {
        const date = data.date
            ? new Date(data.date).toLocaleDateString()
            : new Date().toLocaleDateString();

        return `✅ Transaction Added Successfully\n
        Type: ${data.type === "income" ? "Income" : "Expense"}\n
        Amount: ₹${data.amount}\n
        Category: ${data.category}\n
        Description: ${data.description}\n
        Date: ${date}`;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: input,
        };

        setMessages((m) => [...m, userMessage]);
        setInput("");

        if (isOffline) {
            setMessages((m) => [...m, {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "Chatbot is offline"
            }]);
            return;
        }

        setIsLoading(true);

        const response = await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({
                messages: [...messages, userMessage],
                data: { transactions: transactions.slice(0, 20).map(({ id, amount, description, date, category, type }) => ({ id, amount, description, date, category, type })) }
            }),
        });

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        const assistantId = crypto.randomUUID();
        let fullText = "";

        setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "" }]);

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            fullText += decoder.decode(value, { stream: true });

            setMessages((m) =>
                m.map((msg) =>
                    msg.id === assistantId ? { ...msg, content: fullText } : msg
                )
            );
        }

        // 🔥 COMMAND EXECUTION
        try {
            const json = JSON.parse(fullText);

            if (json.action === "add_transaction") {
                const transaction = {
                    amount: json.data.amount,
                    description: json.data.description,
                    category: json.data.category,
                    type: json.data.type,
                    date: json.data.date
                        ? new Date(json.data.date).toISOString()
                        : new Date().toISOString(),
                };

                addTransaction(transaction);

                toast.success("Transaction added 💸");

                setMessages((m) =>
                    m.map((msg) =>
                        msg.id === assistantId
                            ? {
                                ...msg,
                                content: formatTransactionMessage({
                                    ...json.data,
                                    date: json.data.date,
                                }),
                            }
                            : msg
                    )
                );
            }

            if (json.action === "update_transaction") {
                const transactionToUpdate = transactions.find(t => t.id === json.data.id);

                if (transactionToUpdate) {
                    const updatedTransaction = {
                        ...transactionToUpdate,
                        ...json.data,
                        amount: json.data.amount ?? transactionToUpdate.amount, // Ensure amount is treated as number if updated
                    };

                    // Remove id from the object passed to editTransaction as it takes id as first arg
                    const { id, ...dataToUpdate } = updatedTransaction;

                    editTransaction(id, dataToUpdate);

                    toast.success("Transaction updated 📝");

                    setMessages((m) =>
                        m.map((msg) =>
                            msg.id === assistantId
                                ? {
                                    ...msg,
                                    content: `✅ Transaction Updated Successfully\n
                                    Type: ${dataToUpdate.type === "income" ? "Income" : "Expense"}\n
                                    Amount: ₹${dataToUpdate.amount}\n
                                    Category: ${dataToUpdate.category}\n
                                    Description: ${dataToUpdate.description}\n
                                    Date: ${new Date(dataToUpdate.date).toLocaleDateString()}`
                                }
                                : msg
                        )
                    );
                } else {
                    setMessages((m) =>
                        m.map((msg) =>
                            msg.id === assistantId
                                ? {
                                    ...msg,
                                    content: "❌ Could not find the transaction to update."
                                }
                                : msg
                        )
                    );
                }
            }

            if (json.action === "delete_transaction") {
                const transactionToDelete = transactions.find(t => t.id === json.data.id);

                if (transactionToDelete) {
                    deleteTransaction(json.data.id);

                    toast.success("Transaction deleted 🗑️");

                    setMessages((m) =>
                        m.map((msg) =>
                            msg.id === assistantId
                                ? {
                                    ...msg,
                                    content: `✅ Transaction Deleted Successfully\n
                                    Type: ${transactionToDelete.type === "income" ? "Income" : "Expense"}\n
                                    Amount: ₹${transactionToDelete.amount}\n
                                    Category: ${transactionToDelete.category}\n
                                    Description: ${transactionToDelete.description}`
                                }
                                : msg
                        )
                    );
                } else {
                    setMessages((m) =>
                        m.map((msg) =>
                            msg.id === assistantId
                                ? {
                                    ...msg,
                                    content: "❌ Could not find the transaction to delete."
                                }
                                : msg
                        )
                    );
                }
            }


            if (json.action === "chat") {
                setMessages((m) =>
                    m.map((msg) =>
                        msg.id === assistantId ? { ...msg, content: json.message } : msg
                    )
                );
            }
        } catch {
            // normal chat fallback
        }
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-20 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, originX: 1, originY: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    >
                        <Card className="w-[380px] h-[550px] flex flex-col shadow-2xl border border-white/10 bg-background/80 backdrop-blur-xl overflow-hidden p-0">
                            <CardHeader className="flex flex-row justify-between items-center py-4 px-6 border-b border-border/50 bg-muted/20">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Bot className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">Finance Assistant</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            {isOffline ? (
                                                <>
                                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                                    Offline
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="h-3 w-3 text-yellow-500" />
                                                    Online
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-thin">
                                {messages.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 opacity-70">
                                        <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                                            <Bot className="h-8 w-8 text-primary/50" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">How can I help you?</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Try "Add expense ₹500 for lunch" or "Income ₹50000 salary"
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {messages.map((m) => (
                                    <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted/80 backdrop-blur-sm border border-border/50 rounded-bl-none"
                                                }`}
                                        >
                                            {m.content.split('\n').map((line, i) => (
                                                <div key={i}>{line}</div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-muted/80 backdrop-blur-sm border border-border/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>

                            <CardFooter className="p-4 bg-background/50 backdrop-blur-sm border-t border-border/50">
                                <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your message..."
                                        className="bg-muted/50 border-transparent focus-visible:ring-primary/20 transition-all rounded-full pl-4"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !input.trim()}
                                        size="icon"
                                        className="rounded-full shadow-md shrink-0 transition-transform active:scale-95"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    size="icon"
                    className={`rounded-full h-12 w-12 shadow-xl ring-offset-background transition-all duration-300 ${isOpen
                        ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground rotate-0"
                        : "bg-gradient-to-tr from-primary to-primary/80 hover:shadow-primary/25 rotate-0"
                        }`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="h-12 w-12" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MessageSquare className="h-12 w-12" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </motion.div>
        </div>
    );
}

