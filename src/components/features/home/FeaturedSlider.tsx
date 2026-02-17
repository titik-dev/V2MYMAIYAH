"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "@/components/ui/AppImage";

interface FeaturedSliderProps {
    posts: any[];
}

export default function FeaturedSlider({ posts }: FeaturedSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const width = scrollRef.current.clientWidth;
            const index = Math.round(scrollLeft / width);
            // Determine index based on scroll position 
            // Note: This simple calculation works best for single-item visibility (mobile). 
            // For multi-item, it might need adjustment, but for indicators it's okay.
            setActiveIndex(index);
        }
    };

    const scrollTo = (index: number) => {
        if (scrollRef.current) {
            const width = scrollRef.current.clientWidth;
            // Depending on responsive layout, clientWidth might show 1 or 3 items.
            // Ideally we scroll to the exact child position.
            const child = scrollRef.current.children[index] as HTMLElement;
            if (child) {
                scrollRef.current.scrollTo({
                    left: child.offsetLeft,
                    behavior: "smooth",
                });
            }
        }
    };

    if (!posts || posts.length === 0) return null;

    return (
        <div className="relative w-full group">
            {/* Slider Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 md:pb-0 md:overflow-visible md:snap-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {posts.map(({ node }: any, index: number) => (
                    <Link
                        key={node.id}
                        href={`/berita/${node.slug}`}
                        className="
              relative flex-shrink-0 w-full md:w-auto snap-center 
              rounded-2xl overflow-hidden shadow-xl bg-gray-900 block 
              aspect-[3/4] md:aspect-[3/4]
              transform transition-transform duration-300 md:hover:-translate-y-1
            "
                    >
                        {/* Image Layer */}
                        <div className="absolute inset-0 w-full h-full">
                            {node.featuredImage?.node?.sourceUrl ? (
                                <Image
                                    src={node.featuredImage.node.sourceUrl}
                                    alt={node.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority={index === 0}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <Image
                                        src="/assets/redesign/LOGO_NUN_GREY.webp"
                                        alt="No Image"
                                        width={80}
                                        height={80}
                                        className="opacity-30 grayscale"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Gradient Overlay - Adjusted Height */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--color-maiyah-blue)] from-40% via-[var(--color-maiyah-blue)]/90 via-50% to-transparent" />

                        {/* Content Layer */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                            {/* Category Tag */}
                            <div className="mb-2 md:mb-3">
                                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] md:text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                                    {node.categories?.edges[0]?.node?.name || "Berita"}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl md:text-2xl font-bold leading-tight text-white mb-2 drop-shadow-sm font-serif line-clamp-3">
                                {node.title}
                            </h2>

                            {/* Meta Date */}
                            <div className="flex items-center gap-2 text-xs md:text-sm text-blue-100 font-medium mt-1">
                                <span>
                                    {new Date(node.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>

                            {/* Decorative Dots/Pagination (Visual only for card aesthetic if needed) */}
                        </div>

                        {/* Top Icons Overlay */}
                        <div className="absolute top-4 left-4 w-10 h-10 z-10 opacity-90">
                            <Image src="/assets/redesign/CNun.webp" alt="Author" fill sizes="40px" className="object-contain drop-shadow-lg" />
                        </div>
                        <div className="absolute top-4 right-4 w-6 h-6 z-10 opacity-90">
                            <Image src="/assets/redesign/Logo Mim ICON.webp" alt="Logo" fill sizes="24px" className="object-contain drop-shadow-lg brightness-0 invert" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mobile Pagination Dots (Only visible on slider mode/mobile) */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 md:hidden">
                {posts.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === i ? "bg-[var(--color-maiyah-blue)] w-4" : "bg-gray-300"
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
