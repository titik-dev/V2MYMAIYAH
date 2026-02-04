import Link from 'next/link';
import Image from 'next/image';
import { getGlobalMenu, getGlobalNavigation } from '@/lib/api';
import MobileMenu from './MobileMenu';
import CategoryPills from '@/components/layout/CategoryPills';

export default async function Header() {
    let globalNav = null;
    let fallbackMenu = [];

    try {
        globalNav = await getGlobalNavigation();
        // Fallback if user hasn't set up the new structure yet
        if (!globalNav) {
            fallbackMenu = await getGlobalMenu();
        }
    } catch (error) {
        console.error("Header Menu Error", error);
    }

    // Unified Menu Source: Gunakan 'mobileDrawerItems' sebagai sumber kebenaran tunggal (Single Source of Truth)
    // agar menu Desktop (Pills) dan Mobile (Burger) isinya 100% SAMA persis.
    const menuSource = globalNav?.mobileDrawerItems || fallbackMenu;

    // Pass to both components
    const desktopItems = menuSource;
    const mobileItems = menuSource;

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5 shadow-sm transition-colors duration-300">
                <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6 h-[60px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative h-10 w-48 transition-opacity group-hover:opacity-80">
                            <Image
                                src="https://assets.mymaiyah.id/wp-content/uploads/2026/01/LOGO-MYMAIYAH-White.webp"
                                alt="MyMaiyah.id - Mandiri, Otentik, Berdaulat"
                                fill
                                className="object-contain object-left"
                                priority
                                sizes="(max-width: 768px) 150px, 200px"
                            />
                        </div>
                    </Link>

                    {/* Desktop Main Navigation (Restored) */}
                    <div className="hidden md:flex items-center gap-6 mr-6">
                        {desktopItems.map((item: any, idx: number) => {
                            const hasSubmenu = item.subMenuItems && item.subMenuItems.length > 0;
                            return (
                                <div key={idx} className="relative group">
                                    <Link
                                        href={item.url || "#"}
                                        className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[var(--color-maiyah-blue)] transition-colors uppercase tracking-wide flex items-center gap-1"
                                    >
                                        {item.label}
                                        {hasSubmenu && (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </Link>

                                    {/* Simple Desktop Dropdown */}
                                    {hasSubmenu && (
                                        <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 dark:border-white/10 z-50">
                                            {item.subMenuItems.map((sub: any, sIdx: number) => (
                                                <Link
                                                    key={sIdx}
                                                    href={sub.url}
                                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[var(--color-maiyah-blue)]"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop Utility Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative">
                            <SearchForm />
                        </div>
                        <div className="w-px h-6 bg-gray-200 dark:bg-white/10"></div>
                        <Link href="/login" className="text-sm font-bold text-[var(--color-maiyah-blue)] hover:underline">
                            Login
                        </Link>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex md:hidden items-center gap-4">
                        <MobileMenu menuItems={mobileItems} />
                    </div>
                </nav>
            </header>

            {/* Horizontal Category Navigation (Mobile Only Swipe Menu) */}
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
                className="pl-3 pr-10 py-2 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-full border border-gray-200 dark:border-white/10 focus:border-[var(--color-maiyah-blue)] focus:ring-1 focus:ring-[var(--color-maiyah-blue)] text-xs w-32 focus:w-60 transition-all duration-300 outline-none placeholder-gray-400"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-[var(--color-maiyah-red)] text-white rounded-full hover:bg-red-700 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
            </button>
        </form>
    )
}
