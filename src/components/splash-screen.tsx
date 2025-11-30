"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";

export default function SplashScreen({
    children,
}: {
    children: React.ReactNode;
}) {
    const [show, setShow] = useState(true);

    const router = useRouter();

    const pathname = usePathname();

    useEffect(() => {
        // Hide splash screen after 3 seconds
        const timer = setTimeout(() => {
            setShow(false);
            const profile = localStorage.getItem("profile");
            if (!profile && pathname !== "/settings") {
                router.push("/settings");
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [router, pathname]);

    const text = "Expense Tracker";
    const letters = text.split("");

    return (
        <>
            <AnimatePresence mode="wait">
                {show && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <div className="flex flex-col items-center gap-8">
                            {/* Logo with scale animation */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <Logo size={120} />
                            </motion.div>

                            {/* Text with staggered reveal animation */}
                            <div className="flex overflow-hidden">
                                {letters.map((letter, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ y: 40, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.8 + index * 0.05, // Start after logo animation
                                            duration: 0.5,
                                            ease: "backOut",
                                        }}
                                        className="text-4xl font-bold tracking-tighter text-foreground"
                                    >
                                        {letter === " " ? "\u00A0" : letter}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </>
    );
}
