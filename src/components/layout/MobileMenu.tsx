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
            <div
                className={`fixed top-0 left-0 z-[100] h-full w-[85%] max-w-[300px] bg-white dark:bg-gray-950 shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header Logo */}
                <div className="p-6 border-b border-gray-100 dark:border-white/5">
                    <div className="relative h-10 w-40">
                        <Image
                            src="http://assets.mymaiyah.id/wp-content/uploads/2026/01/LOGO-MYMAIYAH.webp"
                            alt="MyMaiyah.id"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                </div>

                {/* Menu List */}
                <div className="flex-1 overflow-y-auto">
                    <nav className="flex flex-col">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 text-base font-medium text-gray-900 dark:text-gray-100 transition-colors flex items-center justify-between"
                        >
                            <span>Beranda</span>
                        </Link>

                        {/* Dynamic Menu Items */}
                        {menuItems?.map((item: any, index: number) => {
                            const hasSubmenu = item.subMenuItems && item.subMenuItems.length > 0;
                            const isExpanded = expandedItems.includes(item.label);

                            return (
                                <div key={index} className="border-b border-gray-100 dark:border-white/5">
                                    <div
                                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => {
                                            if (hasSubmenu) {
                                                toggleExpand(item.label);
                                            } else {
                                                // If no submenu, navigate? But wait, the parent might have a URL too.
                                                // If it has a submenu, usually the parent label toggles the menu, 
                                                // and we might need a separate "Overview" link if the parent itself is a link.
                                                // For now, let's assume clicking parent with submenu toggles it.
                                                // But we should also allow visiting the link if it's set.
                                                // Better UX: Text links to URL (if valid), Arrow toggles submenu.
                                                // Or simple accordion: Row toggles.
                                            }
                                        }}
                                    >
                                        <Link
                                            href={item.url || "#"}
                                            onClick={(e) => {
                                                if (item.url === "#" || !item.url) e.preventDefault();
                                                else setIsOpen(false);
                                            }}
                                            className="flex-1 text-base font-medium text-gray-900 dark:text-gray-100"
                                        >
                                            {item.label}
                                        </Link>

                                        {hasSubmenu && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleExpand(item.label);
                                                }}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                {isExpanded ? (
                                                    <ChevronUpIcon className="w-5 h-5" />
                                                ) : (
                                                    <ChevronDownIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Submenu */}
                                    {hasSubmenu && (
                                        <div className={`bg-gray-50 dark:bg-white/5 overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-0"}`}>
                                            {item.subMenuItems.map((sub: any, subIndex: number) => (
                                                <Link
                                                    key={subIndex}
                                                    href={sub.url || "#"}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block px-8 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-[var(--color-maiyah-blue)] border-l-4 border-transparent hover:border-[var(--color-maiyah-blue)] transition-colors"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 text-base font-medium text-gray-900 dark:text-gray-100 transition-colors flex items-center justify-between"
                        >
                            <span>Masuk Akun</span>
                        </Link>
                    </nav>
                </div>

                {/* Footer Search */}
                <div className="p-6 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5">
                    <form action="/pencarian" method="GET" className="relative group">
                        <input
                            type="text"
                            name="q"
                            placeholder="Cari..."
                            className="w-full pl-4 pr-10 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-sm focus:border-[var(--color-maiyah-blue)] focus:ring-1 focus:ring-[var(--color-maiyah-blue)] outline-none transition-all dark:text-white"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[var(--color-maiyah-blue)]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">MyMaiyah.id</p>
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
                    <span className="w-6 h-0.5 bg-gray-900 dark:bg-white group-hover:w-8 transition-all duration-300"></span>
                    <span className="w-4 h-0.5 bg-gray-900 dark:bg-white group-hover:w-8 transition-all duration-300 delay-75"></span>
                    <span className="w-6 h-0.5 bg-gray-900 dark:bg-white group-hover:w-8 transition-all duration-300 delay-100"></span>
                </div>
            </button>

            {mounted && createPortal(menuContent, document.body)}
        </div>
    );
}

