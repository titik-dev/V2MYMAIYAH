"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryPills() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const staticMenu = [
        { name: "Maiyah", slug: "maiyah" },
        { name: "Berita", slug: "berita" },
        { name: "Simpul Maiyah", slug: "simpul-maiyah" },
        { name: "Esai", slug: "esai" },
        { name: "Agenda", slug: "agenda" },
    ];

    return (
        <div className="w-full overflow-x-auto no-scrollbar py-2 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-[60px] z-40">
            <div
                ref={scrollRef}
                className="container mx-auto flex items-center gap-2 px-4 whitespace-nowrap"
            >
                {staticMenu.map((item) => {
                    const href = `/category/${item.slug}`;
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={item.slug}
                            href={href}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 ${isActive
                                ? "bg-[var(--color-maiyah-blue)] text-white border-[var(--color-maiyah-blue)] shadow-md shadow-blue-500/20"
                                : "bg-white text-gray-700 border-gray-300 hover:border-[var(--color-maiyah-red)] hover:text-[var(--color-maiyah-red)] shadow-sm"
                                }`}
                        >
                            {item.name.toUpperCase()}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
