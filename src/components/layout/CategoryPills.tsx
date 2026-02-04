"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryPills({ menuItems = [] }: { menuItems?: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Fallback if no menuItems
    const items = menuItems && menuItems.length > 0
        ? menuItems
        : [
            { label: "Maiyah", url: "/category/maiyah" },
            { label: "Berita", url: "/category/berita" },
        ];

    return (
        // Mobile Only Strip - Dark Theme
        <div className="w-full bg-[#1a1a1a] sticky top-[60px] z-40 block md:hidden shadow-md">
            <div
                ref={scrollRef}
                className="container mx-auto px-4"
            >
                <div className="flex w-full overflow-x-auto no-scrollbar py-3">
                    {/* Flattened List for Mobile */}
                    {(() => {
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
                                    className={`flex-shrink-0 px-4 text-sm font-bold transition-colors whitespace-nowrap ${isActive
                                        ? "text-white border-b-2 border-[#e21c23]"
                                        : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        });
                    })()}
                </div>
            </div>
        </div>
    );
}
