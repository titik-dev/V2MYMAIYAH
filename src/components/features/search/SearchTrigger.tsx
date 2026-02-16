"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface SearchTriggerProps {
    mode?: "icon" | "full";
}

export default function SearchTrigger({ mode = "icon" }: SearchTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Focus input when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = "";
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            router.push(`/pencarian?q=${encodeURIComponent(query)}`);
        }
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-[100] bg-gray-950/80 backdrop-blur-md flex items-start justify-center pt-24 px-4 transition-all duration-300"
            onClick={() => setIsOpen(false)}
        >
            <div
                className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Header */}
                <form onSubmit={handleSearch} className="relative p-2 border-b border-gray-100 dark:border-white/10 flex items-center">
                    <div className="pl-4 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari berita, esai, atau tokoh..."
                        className="w-full py-4 px-4 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                        autoComplete="off"
                    />
                    <div className="pr-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-xs font-bold text-gray-500 bg-gray-100 dark:bg-white/10 rounded-md hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                        >
                            ESC
                        </button>
                    </div>
                </form>

                {/* Quick Smart Suggestions / Footer */}
                <div className="bg-gray-50 dark:bg-black/20 p-4 text-sm text-gray-500 dark:text-gray-400">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Pencarian Populer</p>
                    <div className="flex flex-wrap gap-2">
                        {["Maiyah", "Cak Nun", "KiaiKanjeng", "Mocopat Syafaat", "Kenduri Cinta"].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => {
                                    setQuery(tag);
                                    setIsOpen(false);
                                    router.push(`/pencarian?q=${encodeURIComponent(tag)}`);
                                }}
                                className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full hover:border-[var(--color-maiyah-blue)] hover:text-[var(--color-maiyah-blue)] transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    {query.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center animate-pulse">
                            <span>Tekan <kbd className="font-sans font-bold px-1 rounded bg-gray-200 dark:bg-white/10">Enter</kbd> untuk mencari</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (mode === "full") {
        return (
            <>
                <button
                    onClick={() => setIsOpen(true)}
                    className="hover:text-[var(--color-maiyah-red)] flex items-center gap-1 font-bold uppercase text-base transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    Cari
                </button>
                {mounted && isOpen && createPortal(modalContent, document.body)}
            </>
        );
    }

    // Icon only mode (Mobile/Header default)
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-1 text-gray-900 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
                aria-label="Cari Berita"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
            {mounted && isOpen && createPortal(modalContent, document.body)}
        </>
    );
}
