"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

interface MobileMenuProps {
    menuItems: any[];
}

export default function MobileMenu({ menuItems = [] }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const toggleExpand = (label: string) => {
        setExpandedItems(prev =>
            prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
        );
    };

    const menuContent = (
        <>
            {/* Backdrop & Close Button Area */}
            <div
                className={`fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={() => setIsOpen(false)}
            >
                {/* Close Button pplaced on the backdrop (right side) */}
                <button
                    className="absolute top-6 right-6 text-white/70 hover:text-white p-2 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Sidebar Drawer (Left Side) */}
            {/* Sidebar Drawer (Left Side) */}
            <div
                className={`fixed top-0 left-0 z-[100] h-full w-[85%] max-w-[300px] bg-[#005baa] shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 1. Top Search Bar */}
                <div className="p-6 pb-2">
                    <form action="/pencarian" method="GET" className="relative group">
                        <input
                            type="text"
                            name="q"
                            placeholder="Cari..."
                            className="w-full pl-5 pr-10 py-2.5 bg-[#004a8f] text-white placeholder-blue-200/70 border-none rounded-full text-sm focus:ring-2 focus:ring-white/20 outline-none transition-all shadow-inner"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* 2. Menu List */}
                <div className="flex-1 overflow-y-auto px-4 py-2">
                    <nav className="flex flex-col space-y-1">
                        {/* Static Home Link */}
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 text-base font-bold text-white hover:text-white/80 transition-colors"
                        >
                            Beranda
                        </Link>

                        {/* Dynamic Menu Items */}
                        {menuItems?.map((item: any, index: number) => {
                            const hasSubmenu = item.subMenuItems && item.subMenuItems.length > 0;
                            const isExpanded = expandedItems.includes(item.label);

                            return (
                                <div key={index} className="flex flex-col">
                                    <div
                                        className="flex items-center justify-between px-4 py-3 cursor-pointer group"
                                        onClick={() => hasSubmenu && toggleExpand(item.label)}
                                    >
                                        <Link
                                            href={item.url || "#"}
                                            onClick={(e) => {
                                                if (!item.url || item.url === "#") e.preventDefault();
                                                else setIsOpen(false);
                                            }}
                                            className="flex-1 text-base font-bold text-white hover:text-white/80"
                                        >
                                            {item.label}
                                        </Link>

                                        {hasSubmenu && (
                                            <button
                                                className="p-1 text-white hover:text-white/80 transform transition-transform duration-200"
                                                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                            >
                                                <ChevronDownIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Submenu */}
                                    {hasSubmenu && (
                                        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                                            <div className="flex flex-col pl-8 pb-2 space-y-1">
                                                {item.subMenuItems.map((sub: any, subIndex: number) => (
                                                    <Link
                                                        key={subIndex}
                                                        href={sub.url || "#"}
                                                        onClick={() => setIsOpen(false)}
                                                        className="py-2 text-sm text-blue-100 hover:text-white font-medium block"
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 text-base font-bold text-white hover:text-white/80 transition-colors mt-2"
                        >
                            Masuk Akun
                        </Link>
                    </nav>
                </div>

                {/* 3. Bottom Logo Section */}
                <div className="p-8 pb-10 flex items-end justify-center">
                    <div className="relative h-16 w-48">
                        <Image
                            src="/assets/redesign/LOGO MYMAIYAH White.webp"
                            alt="Masyarakat Negeri Maiyah"
                            fill
                            sizes="192px"
                            className="object-contain object-bottom"
                        />
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="md:hidden flex items-center gap-4">
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 group outline-none"
                aria-label="Open Menu"
            >
                <div className="flex flex-col gap-1.5 items-end">
                    <span className="w-6 h-0.5 bg-gray-900 dark:bg-gray-300 group-hover:bg-gray-700 dark:group-hover:bg-white transition-all duration-300 group-hover:w-8"></span>
                    <span className="w-4 h-0.5 bg-gray-900 dark:bg-gray-300 group-hover:bg-gray-700 dark:group-hover:bg-white transition-all duration-300 delay-75 group-hover:w-8"></span>
                    <span className="w-6 h-0.5 bg-gray-900 dark:bg-gray-300 group-hover:bg-gray-700 dark:group-hover:bg-white transition-all duration-300 delay-100 group-hover:w-8"></span>
                </div>
            </button>

            {mounted && createPortal(menuContent, document.body)}
        </div>
    );
}

