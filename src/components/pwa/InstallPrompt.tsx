"use client";

import { useEffect, useState } from "react";
import { X, Share, PlusSquare, MoreVertical } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);

    useEffect(() => {
        // Check device type
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        const isAndroidDevice = /android/.test(userAgent);

        // Check if already in standalone mode (installed)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;

        if (isStandalone) return;

        if (isIosDevice) {
            setIsIOS(true);
            setTimeout(() => setIsVisible(true), 1000);
        } else if (isAndroidDevice) {
            setIsAndroid(true);
            // Show prompt for Android users as well, in case the native event doesn't fire
            setTimeout(() => setIsVisible(true), 1000);
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            console.log("User accepted the install prompt");
        } else {
            console.log("User dismissed the install prompt");
        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-4 flex flex-col gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
                <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                        <div className="h-10 w-10 bg-transparent rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                            <img src="/icon-192" alt="App Icon" className="h-full w-full object-contain" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Install App</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {isIOS || (isAndroid && !deferredPrompt)
                                    ? "Install Expense Tracker to your home screen"
                                    : "Install Expense Tracker for a better experience"
                                }
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {isIOS ? (
                    <div className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-md">1</span>
                            <span>Tap the <Share className="inline h-4 w-4 mx-1" /> share button</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-md">2</span>
                            <span>Select <span className="font-medium text-zinc-900 dark:text-zinc-200">Add to Home Screen</span> <PlusSquare className="inline h-4 w-4 mx-1" /></span>
                        </div>
                    </div>
                ) : isAndroid && !deferredPrompt ? (
                    <div className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-md">1</span>
                            <span>Tap the <MoreVertical className="inline h-4 w-4 mx-1" /> menu button</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-md">2</span>
                            <span>Select <span className="font-medium text-zinc-900 dark:text-zinc-200">Install App</span> <PlusSquare className="inline h-4 w-4 mx-1" /></span>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={handleClose}
                            className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                        >
                            Not now
                        </button>
                        <button
                            onClick={handleInstallClick}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                        >
                            Install
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
