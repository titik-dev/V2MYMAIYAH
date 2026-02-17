import Link from 'next/link';
import Image from "@/components/ui/AppImage";
import { getFooterData } from '@/lib/api';
import { getWpMediaUrl } from '@/lib/wp';

export default async function Footer() {
    let footerData = null;
    try {
        footerData = await getFooterData();
    } catch (error) {
        // Suppress Error: This is expected if ACF fields are not yet populated on the backend.
        // We will fall back to default data silently.
        // console.warn("Footer Data Fetch Warning:", error); 
    }

    // Default Fallback
    const description = footerData?.footerDescription || "MyMaiyah.id adalah portal dokumentasi dan wacana seputar Cak Nun, KiaiKanjeng, dan simpul-simpul Maiyah.";
    const copyright = footerData?.footerCopyright || `© ${new Date().getFullYear()} Maiyah News. All rights reserved.`;
    const socialLinks = footerData?.footerSocials || [];
    const logos = footerData?.footerLogos || [
        {
            logoImage: { sourceUrl: getWpMediaUrl("/wp-content/uploads/2025/12/LOGO-MYMAIYAH.png"), altText: "MyMaiyah" },
            logoUrl: "/"
        }
    ];

    // Helper untuk Icon Sosmed
    const getSocialIcon = (platform: string) => {
        switch (platform) {
            case 'facebook': return (
                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
            );
            case 'twitter': return (
                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
            );
            case 'instagram': return (
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
            );
            case 'youtube': return (
                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"></path>
                </svg>
            );
            case 'tiktok': return (
                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.88-2.91 6.31-2.29 1.88-5.76 1.79-8.01-.2-2.31-2.04-2.75-5.59-1.02-8.09 1.25-1.92 3.49-3.04 5.76-3.02V8.9c-1.57.03-3.06.74-4.04 1.96-1.39 1.78-1.5 4.31-.22 6.13.9 1.28 2.45 2.04 4.02 2 1.95.04 3.73-1.09 4.54-2.88.58-1.28.61-2.75.05-4.06l-.04-8.84c-.03-.27-.08-.54-.15-.8z" />
                </svg>
            );
            default: return null;
        }
    }

    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-white/5 pt-12 pb-24 md:pb-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 items-start">

                    {/* Left: Logos & Description */}
                    <div className="w-full lg:w-4/12 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                        {/* Logos Wrapper */}
                        {logos.map((logo: any, idx: number) => {
                            const imgSrc = logo.logoImage?.node?.sourceUrl || logo.logoImage?.sourceUrl || "https://placehold.co/150x50";
                            const darkImgSrc = logo.logoImageDark?.node?.sourceUrl || logo.logoImageDark?.sourceUrl; // Optional Dark Mode Logo
                            const altText = logo.logoImage?.node?.altText || logo.logoImage?.altText || "Maiyah Logo";

                            return (
                                <Link
                                    key={idx}
                                    href={logo.logoUrl || '#'}
                                    className="relative h-10 w-auto hover:opacity-80 transition-opacity"
                                >
                                    {/* 1. Light Mode Image (Always Show Original) */}
                                    <Image
                                        src={imgSrc}
                                        alt={altText}
                                        width={150}
                                        height={50}
                                        className="h-10 w-auto object-contain dark:hidden"
                                    />

                                    {/* 2. Dark Mode Image (Smart Logic) */}
                                    {/* If specific dark logo exists -> Use it (No Filter). 
                                            Else -> Use original logo (With Invert Filter). */}
                                    <Image
                                        src={darkImgSrc || imgSrc}
                                        alt={altText}
                                        width={150}
                                        height={50}
                                        className={`h-10 w-auto object-contain hidden dark:block ${darkImgSrc ? '' : 'brightness-0 invert'
                                            }`}
                                    />
                                </Link>
                            );
                        })}

                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
                            {description}
                        </p>
                    </div>

                    {/* Middle: Dynamic Link Columns */}
                    {footerData?.footerLinkColumns && footerData.footerLinkColumns.length > 0 && (
                        <div className="w-full lg:w-5/12 grid grid-cols-2 sm:grid-cols-2 gap-8 text-center lg:text-left">
                            {footerData.footerLinkColumns.map((col: any, idx: number) => (
                                <div key={idx} className="flex flex-col items-center lg:items-start">
                                    <h4 className="text-[var(--color-maiyah-red)] font-bold text-lg mb-4 relative inline-block">
                                        {col.columnTitle}
                                        <span className="block h-0.5 w-8 bg-gray-200 mt-2 mx-auto lg:mx-0"></span>
                                    </h4>
                                    <ul className="space-y-3">
                                        {col.columnLinks?.map((link: any, lIdx: number) => (
                                            <li key={lIdx}>
                                                <Link
                                                    href={link.url || '#'}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-[var(--color-maiyah-blue)] transition-colors text-sm font-medium"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Right: Socials & Links */}
                    <div className="w-full lg:w-3/12 flex flex-col items-center lg:items-end space-y-6">
                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((soc: any, idx: number) => (
                                <a
                                    key={idx}
                                    href={soc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-[var(--color-maiyah-blue)] hover:text-white transition-all duration-300"
                                >
                                    {getSocialIcon(soc.platform)}
                                </a>
                            ))}
                        </div>

                        {/* Copyright */}
                        <div className="text-xs text-gray-400 text-center lg:text-right">
                            <div dangerouslySetInnerHTML={{ __html: copyright }} />
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
