
"use client";

import { MessageSquare, Send, X, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim()
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Add placeholder for assistant message
            const assistantId = (Date.now() + 1).toString();
            let assistantContent = "";
            setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                assistantContent += text;

                setMessages(prev => prev.map(msg =>
                    msg.id === assistantId
                        ? { ...msg, content: assistantContent }
                        : msg
                ));
            }
        } catch (error) {
            console.error("Chat error:", error);
            // Optionally add error feedback to UI
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 pointer-events-auto origin-bottom-right"
                    >
                        <Card className="w-[350px] sm:w-[380px] h-[500px] flex flex-col shadow-2xl border-border/10 backdrop-blur-xl bg-background/80 overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">AI Assistant</span>
                                        <span className="text-[10px] text-muted-foreground">Always here to help</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-background/20 rounded-full"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden bg-background/50">
                                <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent" ref={scrollRef}>
                                    <div className="flex flex-col gap-4">
                                        {messages.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-full mt-10 text-center opacity-50 space-y-2">
                                                <Bot className="h-12 w-12 mb-2 text-muted-foreground/30" />
                                                <p className="text-sm font-medium">How can I help you today?</p>
                                                <p className="text-xs text-muted-foreground text-balance">Ask me about your expenses or creating a new transaction.</p>
                                            </div>
                                        )}
                                        {messages.map((m) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={m.id}
                                                className={cn(
                                                    "flex w-max max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                                    m.role === "user"
                                                        ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                                                        : "bg-muted/80 backdrop-blur-sm rounded-bl-sm"
                                                )}
                                            >
                                                {m.content}
                                            </motion.div>
                                        ))}
                                        {isLoading && messages[messages.length - 1]?.role === "user" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex w-max max-w-[80%] items-center gap-2 rounded-2xl rounded-bl-sm px-4 py-3 text-sm bg-muted/80 backdrop-blur-sm"
                                            >
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-3 border-t border-border/50 bg-background/50 backdrop-blur-sm">
                                <form onSubmit={handleFormSubmit} className="flex w-full items-center gap-2">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-background/50 focus-visible:ring-primary/20 transition-all border-zinc-200 dark:border-zinc-800"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="shrink-0 rounded-full shadow-md bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                                        disabled={isLoading || !input.trim()}
                                    >
                                        <Send className="h-4 w-4" />
                                        <span className="sr-only">Send</span>
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                layout
                className="pointer-events-auto"
            >
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="h-14 w-14 rounded-full shadow-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                        onClick={() => setIsOpen(true)}
                    >
                        <MessageSquare className="h-7 w-7" />
                        <span className="sr-only">Open Chat</span>
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
}

