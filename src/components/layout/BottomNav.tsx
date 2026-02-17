"use client";

import Link from "next/link";
import Image from "@/components/ui/AppImage";
import { usePathname } from "next/navigation";

// Mapped Icons from "MyMaiyah-Redesign"
interface BottomNavItem {
    label: string;
    url: string;
    icon?: {
        node: {
            sourceUrl: string;
            altText?: string;
        }
    };
}

interface BottomNavProps {
    items?: BottomNavItem[];
}

export default function BottomNav({ items = [] }: BottomNavProps) {
    const pathname = usePathname();

    // If no items from backend, return null or empty
    if (!items || items.length === 0) return null;

    // Use a robust fallback image if icon is missing
    const fallbackIcon = "/assets/redesign/Logo Mim ICON.webp";

    const centerIndex = items.length === 5 ? 2 : -1;
    const centerItem = centerIndex >= 0 ? items[centerIndex] : null;
    const sortedItems = [...items].sort((a, b) => (b.url?.length || 0) - (a.url?.length || 0));
    const activeItem = sortedItems.find((i) => pathname === i.url) ||
        sortedItems.find((i) => i.url !== "/" && pathname.startsWith(i.url || ""));

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100]">
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none -z-10" />

            <div className="relative bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/5 pb-safe-area shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
                {centerItem && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-20">
                        <Link
                            href={centerItem.url || "/"}
                            className="relative w-[68px] h-[68px] rounded-full bg-[#081428] border-2 border-[var(--color-maiyah-red)] shadow-[0_0_20px_rgba(226,28,35,0.55)] flex items-center justify-center transition-transform duration-300 active:scale-95"
                        >
                            <Image
                                src={centerItem.icon?.node?.sourceUrl || fallbackIcon}
                                alt={centerItem.icon?.node?.altText || centerItem.label}
                                width={34}
                                height={34}
                                className="object-contain"
                            />
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-5 h-[76px] items-end px-2 pb-2">
                    {items.map((item, index) => {
                        const isCenter = index === centerIndex;
                        if (isCenter) {
                            return <div key={index} className="h-full" aria-hidden="true" />;
                        }

                        const isActive = activeItem?.url === item.url;
                        const iconSrc = item.icon?.node?.sourceUrl || fallbackIcon;
                        const altText = item.icon?.node?.altText || item.label;

                        return (
                            <Link
                                key={index}
                                href={item.url || "#"}
                                className="flex flex-col items-center justify-end py-2 group"
                            >
                                <div className="h-7 flex items-center justify-center mb-0.5 w-full">
                                    <div className={`relative transition-all duration-300 ${isActive ? "scale-110" : "scale-100"}`}>
                                        <Image
                                            src={iconSrc}
                                            alt={altText}
                                            width={22}
                                            height={22}
                                            className={`object-contain transition-all duration-300 ${isActive ? "opacity-100" : "opacity-55 group-hover:opacity-80"}`}
                                        />
                                    </div>
                                </div>
                                <span className={`text-[10px] leading-none tracking-tight whitespace-nowrap transition-colors duration-300 ${isActive ? "text-white font-semibold" : "text-gray-400"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
