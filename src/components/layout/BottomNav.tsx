"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HomeIcon,
    DocumentTextIcon,
    BookOpenIcon,
    HeartIcon,
    PhotoIcon,
    VideoCameraIcon
} from "@heroicons/react/24/outline";
import {
    HomeIcon as HomeSolid,
    DocumentTextIcon as DocumentSolid,
    BookOpenIcon as BookSolid,
    HeartIcon as HeartSolid,
    PhotoIcon as PhotoSolid,
    VideoCameraIcon as VideoSolid
} from "@heroicons/react/24/solid";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Beranda", href: "/", icon: HomeIcon, activeIcon: HomeSolid },
        { label: "Tajuk", href: "/category/tajuk", icon: DocumentTextIcon, activeIcon: DocumentSolid },
        { label: "Tadabbur", href: "/category/tadabbur", icon: BookOpenIcon, activeIcon: BookSolid },
        { label: "Maiyah's Wisdom", href: "/category/maiyah-wisdom", icon: HeartIcon, activeIcon: HeartSolid },
        { label: "Foto", href: "/category/foto", icon: PhotoIcon, activeIcon: PhotoSolid },
        { label: "Video", href: "/category/video", icon: VideoCameraIcon, activeIcon: VideoSolid },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-white/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe-area">
            <div className="grid grid-cols-6 h-[60px]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = isActive ? item.activeIcon : item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-start pt-2 space-y-0.5 transition-colors duration-200 px-0.5 ${isActive ? "text-[var(--color-maiyah-blue)]" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                        >
                            <div className="relative">
                                <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                            </div>
                            <span className="text-[8px] font-medium tracking-tight text-center leading-[1.1] w-full break-words max-w-[50px] line-clamp-2">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
