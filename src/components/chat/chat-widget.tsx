"use client";

import { MessageSquare, Send, X, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTransactions } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export function ChatWidget() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { addTransaction } = useTransactions();

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

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
        setIsLoading(true);

        const response = await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({
                messages: [...messages, userMessage],
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

        setIsLoading(false);

        // 🔥 COMMAND EXECUTION
        try {
            const json = JSON.parse(fullText);

            if (json.action === "add_transaction") {
                addTransaction({
                    amount: json.data.amount,
                    description: json.data.description,
                    category: json.data.category,
                    type: json.data.type,
                    date: json.data.date
                        ? new Date(json.data.date).toISOString()
                        : new Date().toISOString(),
                });

                toast.success("Transaction added 💸");

                setMessages((m) =>
                    m.map((msg) =>
                        msg.id === assistantId
                            ? { ...msg, content: "✅ Transaction added successfully." }
                            : msg
                    )
                );
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
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <Card className="w-[380px] h-[520px] flex flex-col shadow-xl">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            <span className="font-semibold">AI Assistant</span>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
                            <X />
                        </Button>
                    </CardHeader>

                    <CardContent ref={scrollRef} className="flex-1 overflow-y-auto space-y-3">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === "user"
                                    ? "ml-auto bg-primary text-primary-foreground"
                                    : "bg-muted"
                                    }`}
                            >
                                {m.content}
                            </div>
                        ))}
                    </CardContent>

                    <CardFooter>
                        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Add a transaction..."
                            />
                            <Button type="submit" disabled={isLoading}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}

            {!isOpen && (
                <Button
                    size="icon"
                    className="rounded-full h-14 w-14"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare />
                </Button>
            )}
        </div>
    );
}
