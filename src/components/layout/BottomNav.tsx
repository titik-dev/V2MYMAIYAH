"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Mapped Icons from "MyMaiyah-Redesign"
const customIcons: Record<string, string> = {
    "Selasar": "/assets/redesign/Icon-1.webp",
    "Esai": "/assets/redesign/Icon-2.webp",
    "Home": "/assets/redesign/Logo Mim ICON.webp",
    "Mukaddimah": "/assets/redesign/Icon-3.webp",
    "Cerita Simpul": "/assets/redesign/CNun.webp",
};

export default function BottomNav() {
    const pathname = usePathname();

    // Hardcoded Structure based on Design Reference
    // Labels: Selasar, Esai, (Center Logo), Mukaddimah, Cerita Simpul
    const navItems = [
        { label: "Selasar", url: "/category/selasar", icon: customIcons["Selasar"] },
        { label: "Esai", url: "/category/esai", icon: customIcons["Esai"] },
        { label: "Home", url: "/", icon: customIcons["Home"], isCenter: true },
        { label: "Mukaddimah", url: "/category/mukaddimah", icon: customIcons["Mukaddimah"] },
        { label: "Cerita Simpul", url: "/category/cerita-simpul", icon: customIcons["Cerita Simpul"] },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100]">
            {/* Gradient Fade for smooth content transition underneath */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent pointer-events-none -z-10" />

            {/* Main Bar */}
            <div className="bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/5 pb-safe-area shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
                <div className="grid grid-cols-5 h-[76px] items-center px-2">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url || ""));

                        if (item.isCenter) {
                            return (
                                <div key={index} className="relative -top-6 flex justify-center">
                                    <Link
                                        href={item.url || "/"}
                                        className="
                                            relative w-16 h-16 rounded-full 
                                            bg-gradient-to-b from-gray-800 to-gray-950 
                                            border-2 border-[var(--color-maiyah-red)] 
                                            shadow-[0_0_15px_rgba(226,28,35,0.4)] 
                                            flex items-center justify-center 
                                            transform transition-transform duration-300 hover:scale-105 active:scale-95
                                            group
                                        "
                                    >
                                        <Image
                                            src={item.icon || ""}
                                            alt={item.label}
                                            width={36}
                                            height={36}
                                            className="object-contain drop-shadow-md group-hover:rotate-3 transition-transform"
                                        />
                                    </Link>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                href={item.url || "#"}
                                className="flex flex-col items-center justify-center py-2 group"
                            >
                                {/* Fixed Height Icon Container to enforce text baseline alignment */}
                                <div className="h-7 flex items-center justify-center mb-0.5 w-full">
                                    <div className={`relative transition-all duration-500 ${isActive ? "scale-110" : "scale-100"}`}>
                                        <Image
                                            src={item.icon || ""}
                                            alt={item.label}
                                            width={22}
                                            height={22}
                                            className={`
                                                object-contain transition-all duration-500 max-h-[22px] w-auto
                                                ${isActive ? "grayscale-0 brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "grayscale opacity-50 group-hover:opacity-80 group-hover:grayscale-[0.5]"}
                                            `}
                                        />
                                    </div>
                                </div>

                                <span className={`
                                    text-[9px] font-medium tracking-tight whitespace-nowrap transition-colors duration-300
                                    ${isActive ? "text-white font-semibold" : "text-gray-500 group-hover:text-gray-300"}
                                `}>
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
