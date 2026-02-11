import Link from 'next/link';
import Image from 'next/image';
import { getGlobalMenu, getGlobalNavigation } from '@/lib/api';
import MobileMenu from './MobileMenu';
import CategoryPills from '@/components/layout/CategoryPills';
import ThemeToggle from '@/components/layout/ThemeToggle';
import SearchTrigger from '@/components/features/search/SearchTrigger';

export default async function Header() {
    let globalNav = null;
    let fallbackMenu = [];

    try {
        globalNav = await getGlobalNavigation();
        if (!globalNav) {
            fallbackMenu = await getGlobalMenu();
        }
    } catch (error) {
        console.error("Header Menu Error", error);
    }

    const menuSource = globalNav?.mobileDrawerItems || fallbackMenu;
    const desktopItems = menuSource;
    const mobileItems = menuSource;

    return (
        <>
            {/* 
              MOBILE HEADER (Dark Theme) 
              - Layout: Hamburger (Left) | Logo (Center) | Moon/Search (Right)
            */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-gray-800 md:hidden h-[60px] flex items-center shadow-sm dark:shadow-lg transition-colors duration-300">
                <nav className="container mx-auto flex items-center justify-between px-4">
                    {/* Left: Mobile Menu (Hamburger) */}
                    <div className="flex items-center text-gray-900 dark:text-white">
                        <MobileMenu menuItems={mobileItems} />
                    </div>

                    {/* Center: Logo (Absolute Center) */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                        <div className="relative h-10 w-32">
                            <Image
                                src="/assets/redesign/LogoMim HZ.webp"
                                alt="MyMaiyah.id"
                                fill
                                sizes="(max-width: 768px) 150px, 300px"
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Right: Dark Mode & Search Icons */}
                    <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                        {/* Functional Theme Toggle */}
                        <ThemeToggle />

                        {/* Search Popup Trigger */}
                        <SearchTrigger mode="icon" />
                    </div>
                </nav>
            </header>


            {/* 
              DESKTOP HEADER (Dark Theme - 3 Logo Layout) 
            */}
            <header className="hidden md:block sticky top-0 z-50 w-full bg-[#1a1a1a] shadow-lg border-b border-gray-800">
                <div className="container mx-auto px-6 py-4">
                    {/* Top Row: 3 Logos */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Left Logo: Masyarakat Maiyah */}
                        <div className="relative h-10 w-40">
                            {/* Logo Changed per request */}
                            <Image
                                src="/assets/redesign/LOGO MYMAIYAH White.webp"
                                alt="MyMaiyah Logo"
                                fill
                                sizes="(max-width: 768px) 150px, 200px"
                                className="object-contain object-left"
                            />
                        </div>

                        {/* Center Logo: MyMaiyah (Main) */}
                        <Link href="/" className="relative h-14 w-60">
                            <Image
                                src="/assets/redesign/Logo Mim HZ.webp"
                                alt="MyMaiyah.id"
                                fill
                                sizes="(max-width: 768px) 200px, 300px"
                                className="object-contain" // Centered by flex parent
                                priority
                            />
                        </Link>

                        {/* Right Logo: MI-MAN */}
                        <div className="relative h-12 w-20">
                            <Image
                                src="/assets/redesign/Logo MI-MAN white2.webp"
                                alt="MI-MAN"
                                fill
                                sizes="100px"
                                className="object-contain object-right"
                            />
                        </div>
                    </div>

                    {/* Bottom Row: Navigation */}
                    <nav className="flex items-center justify-between border-t border-gray-800 pt-3">
                        <div className="flex items-center gap-8 mx-auto">
                            {/* Static "Selasar" - Red Active Style Example */}
                            <Link href="/category/selasar" className="text-base font-bold text-[var(--color-maiyah-red)] uppercase tracking-wide">
                                Selasar
                            </Link>

                            {/* Dynamic Menu Items */}
                            {desktopItems.map((item: any, idx: number) => {
                                const hasSubmenu = item.subMenuItems && item.subMenuItems.length > 0;
                                return (
                                    <div key={idx} className="relative group">
                                        <Link
                                            href={item.url || "#"}
                                            className="text-base font-bold text-white hover:text-[var(--color-maiyah-red)] transition-colors uppercase tracking-wide flex items-center gap-1"
                                        >
                                            {item.label}
                                            {hasSubmenu && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </Link>

                                        {/* Red Dropdown Menu */}
                                        {hasSubmenu && (
                                            <div className="absolute left-0 top-full mt-3 w-56 bg-[var(--color-maiyah-red)] shadow-xl rounded-b-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                {item.subMenuItems.map((sub: any, sIdx: number) => (
                                                    <Link
                                                        key={sIdx}
                                                        href={sub.url}
                                                        className="block px-6 py-2.5 text-sm font-medium text-white hover:bg-black/10 transition-colors border-b border-white/10 last:border-0"
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Utility Links */}
                            <div className="flex items-center gap-4 ml-4">
                                <Link href="#" className="text-white hover:text-[var(--color-maiyah-red)] font-bold uppercase text-base">
                                    Foto
                                </Link>
                                <Link href="#" className="text-white hover:text-[var(--color-maiyah-red)] font-bold uppercase text-base">
                                    Video
                                </Link>
                                {/* Search Popup Trigger - Desktop */}
                                <SearchTrigger mode="full" />
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Horizontal Category Navigation (Mobile Only Swipe Menu) - Now Dark Theme */}
            <CategoryPills menuItems={globalNav?.pillMenuItems || []} />
        </>
    );
}

function SearchForm() {
    return (
        <form action="/pencarian" method="GET" className="flex items-center relative group">
            <input
                type="text"
                name="q"
                placeholder="Cari berita..."
                className="pl-3 pr-10 py-2 bg-gray-50 text-gray-900 rounded-full border border-gray-200 focus:border-[var(--color-maiyah-blue)] focus:ring-1 focus:ring-[var(--color-maiyah-blue)] text-xs w-32 focus:w-60 transition-all duration-300 outline-none placeholder-gray-400"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-[var(--color-maiyah-red)] text-white rounded-full hover:bg-red-700 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
            </button>
        </form>
    )
}
