"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HomeIcon,
    HeartIcon,
    NewspaperIcon,
    CalendarIcon,
    PencilSquareIcon,
    DocumentTextIcon,
    BookOpenIcon,
    PhotoIcon,
    VideoCameraIcon,
    UserIcon,
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import {
    HomeIcon as HomeSolid,
    HeartIcon as HeartSolid,
    NewspaperIcon as NewspaperSolid,
    CalendarIcon as CalendarSolid,
    PencilSquareIcon as PencilSquareSolid,
    DocumentTextIcon as DocumentSolid,
    BookOpenIcon as BookSolid,
    PhotoIcon as PhotoSolid,
    VideoCameraIcon as VideoSolid,
    UserIcon as UserSolid,
    MagnifyingGlassIcon as MagnifyingGlassSolid
} from "@heroicons/react/24/solid";

const iconMap: any = {
    home: { outline: HomeIcon, solid: HomeSolid },
    heart: { outline: HeartIcon, solid: HeartSolid },
    newspaper: { outline: NewspaperIcon, solid: NewspaperSolid },
    calendar: { outline: CalendarIcon, solid: CalendarSolid },
    "pencil-square": { outline: PencilSquareIcon, solid: PencilSquareSolid },
    "document-text": { outline: DocumentTextIcon, solid: DocumentSolid },
    "book-open": { outline: BookOpenIcon, solid: BookSolid },
    photo: { outline: PhotoIcon, solid: PhotoSolid },
    "video-camera": { outline: VideoCameraIcon, solid: VideoSolid },
    user: { outline: UserIcon, solid: UserSolid },
    "magnifying-glass": { outline: MagnifyingGlassIcon, solid: MagnifyingGlassSolid },
};

export default function BottomNav({ items }: { items?: any[] }) {
    const pathname = usePathname();

    // Default Fallback Items
    const defaultItems = [
        { label: "Beranda", url: "/", icon: "home" },
        { label: "Maiyah's Wisdom", url: "/category/maiyah-wisdom", icon: "heart" },
        { label: "Kolom Maiyah", url: "/category/kolom-maiyah", icon: "newspaper" },
        { label: "Daur Maiyahan", url: "/daur-maiyahan", icon: "calendar" },
        { label: "Opini", url: "/category/opini", icon: "pencil-square" },
    ];

    const finalItems = (items && items.length > 0) ? items : defaultItems;

    // Safe Tailwind Grid Cols Lookup
    const gridColsMap: Record<number, string> = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
    };

    const colCount = Math.min(finalItems.length, 6);
    const gridClass = gridColsMap[colCount] || "grid-cols-5";

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-white/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe-area">
            <div className={`grid ${gridClass} h-[60px]`}>
                {finalItems.map((item, index) => {
                    const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url || ""));

                    // Resolve Icon
                    const iconKey = item.icon || "document-text";
                    const icons = iconMap[iconKey] || iconMap["document-text"];
                    const Icon = isActive ? icons.solid : icons.outline;

                    return (
                        <Link
                            key={index}
                            href={item.url || "#"}
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
