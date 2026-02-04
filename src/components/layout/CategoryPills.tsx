"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryPills({ menuItems = [] }: { menuItems?: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Fallback if no menuItems (e.g. data fetching failed or empty)
    const items = menuItems && menuItems.length > 0
        ? menuItems
        : [
            { label: "Maiyah", url: "/category/maiyah" },
            { label: "Berita", url: "/category/berita" },
        ];

    return (
        <div className="w-full border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-[60px] z-40">
            <div
                ref={scrollRef}
                className="container mx-auto flex items-center px-4 md:px-6 relative"
            >
                {/* 
                   Mobile: Horizontal Scroll 
                   Desktop: Flex Wrap or just Flex with Dropdowns (Overflow Visible)
                */}
                <div className="flex gap-2 w-full overflow-x-auto md:overflow-visible no-scrollbar py-2 md:justify-center">
                    {/* Home Link */}
                    {/* Assuming Home is part of the menu items or implicit */}

                    {/* --- MOBILE VIEW: FLATTENED LIST --- */}
                    <div className="md:hidden w-full max-w-[100vw] overflow-hidden">
                        <div className="flex gap-2 w-full overflow-x-auto no-scrollbar pb-2 px-1 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                            {(() => {
                                // Flatten the menu for mobile
                                const mobileItems: any[] = [];
                                items.forEach(item => {
                                    mobileItems.push(item);
                                    if (item.subMenuItems && item.subMenuItems.length > 0) {
                                        item.subMenuItems.forEach((sub: any) => mobileItems.push(sub));
                                    }
                                });

                                return mobileItems.map((item, idx) => {
                                    const isActive = pathname === item.url;
                                    return (
                                        <Link
                                            key={`mobile-${idx}`}
                                            href={item.url || "#"}
                                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 ${isActive
                                                ? "bg-[var(--color-maiyah-blue)] text-white border-[var(--color-maiyah-blue)] shadow-md shadow-blue-500/20"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-[var(--color-maiyah-red)] hover:text-[var(--color-maiyah-red)] shadow-sm"
                                                }`}
                                        >
                                            {item.label?.toUpperCase()}
                                        </Link>
                                    );
                                });
                            })()}
                        </div>
                    </div>

                    {/* --- DESKTOP VIEW: HIERARCHICAL WITH DROPDOWN --- */}
                    <div className="hidden md:flex gap-2 justify-center w-full">
                        {items.map((item, idx) => {
                            const isActive = pathname === item.url;
                            const hasSubmenu = item.subMenuItems && item.subMenuItems.length > 0;

                            return (
                                <div key={idx} className="relative group flex-shrink-0">
                                    <Link
                                        href={item.url || "#"}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 inline-block ${isActive
                                            ? "bg-[var(--color-maiyah-blue)] text-white border-[var(--color-maiyah-blue)] shadow-md shadow-blue-500/20"
                                            : "bg-white text-gray-700 border-gray-300 hover:border-[var(--color-maiyah-red)] hover:text-[var(--color-maiyah-red)] shadow-sm"
                                            }`}
                                    >
                                        {item.label?.toUpperCase()}
                                    </Link>

                                    {/* Dropdown for Desktop */}
                                    {hasSubmenu && (
                                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top z-50">
                                            {/* Triangle Arrow */}
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-black/5"></div>

                                            <div className="py-2 flex flex-col relative bg-white rounded-lg overflow-hidden">
                                                {item.subMenuItems.map((sub: any, subIdx: number) => (
                                                    <Link
                                                        key={`sub-${subIdx}`}
                                                        href={sub.url || "#"}
                                                        className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-[var(--color-maiyah-blue)] transition-colors text-center"
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
                    </div>
                </div>
            </div>
        </div>
    );
}
