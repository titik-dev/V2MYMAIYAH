import { searchPosts } from "@/lib/api";
import Link from "next/link";
import Image from "@/components/ui/AppImage";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;
    let posts = [];

    if (q) {
        try {
            const data = await searchPosts(q);
            posts = data?.edges || [];
        } catch (error) {
            console.error("Search API Error", error);
        }
    }

    return (
        <main className="min-h-screen container mx-auto px-4 py-8 pb-24">
            {/* Search Input Section */}
            <div className="max-w-2xl mx-auto mb-10 text-center">
                <span className="text-xs font-bold text-[var(--color-maiyah-red)] uppercase tracking-widest mb-2 block">Pencarian Berita</span>
                <form action="/pencarian" method="GET" className="relative group">
                    <input
                        type="text"
                        name="q"
                        defaultValue={q}
                        placeholder="Ketik kata kunci pencarian..."
                        className="w-full px-6 py-4 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-full text-lg shadow-sm focus:border-[var(--color-maiyah-blue)] focus:ring-0 outline-none transition-all"
                        autoFocus={!q}
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[var(--color-maiyah-blue)] text-white rounded-full hover:bg-blue-700 transition-colors shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </form>
            </div>

            {q && (
                <div className="mb-8 pb-4 border-b border-gray-100 dark:border-white/5">
                    <h1 className="text-2xl md:text-3xl font-bold font-serif">
                        Hasil untuk "{q}"
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Ditemukan {posts.length} artikel.
                    </p>
                </div>
            )}

            {posts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map(({ node }: any) => (
                        <article key={node.id} className="group flex md:flex-col gap-4 bg-white rounded-xl p-3 md:p-0 shadow-sm hover:shadow-md transition-shadow border border-gray-100 md:border-none overflow-hidden">
                            {/* Thumbnail with Smart Blur */}
                            <div className="relative w-1/3 md:w-full aspect-[4/3] md:aspect-video flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                {node.featuredImage?.node?.sourceUrl ? (
                                    <>
                                        {/* Blurred Backdrop */}
                                        <Image
                                            src={node.featuredImage.node.sourceUrl}
                                            alt=""
                                            fill
                                            className="object-cover blur-xl scale-125 opacity-50"
                                        />
                                        {/* Main Image */}
                                        <Image
                                            src={node.featuredImage.node.sourceUrl}
                                            alt={node.featuredImage.node.altText || node.title}
                                            fill
                                            className="object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </>
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-200">
                                        <span className="text-[10px]">No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col md:p-4 md:pt-2 space-y-1">
                                <h3 className="text-sm md:text-lg font-bold font-serif leading-tight text-gray-900 group-hover:text-[var(--color-maiyah-blue)] transition-colors line-clamp-3 md:line-clamp-2">
                                    <Link href={`/berita/${node.slug}`}>
                                        {node.title}
                                    </Link>
                                </h3>
                                <div className="hidden md:block text-sm text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                                <div className="text-[10px] md:text-xs text-gray-400 mt-auto pt-2">
                                    {new Date(node.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                q && (
                    <div className="py-20 text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Tidak ada hasil</h3>
                        <p className="text-gray-500 text-sm mt-1">Coba kata kunci lain atau periksa ejaan Anda.</p>
                    </div>
                )
            )}
        </main>
    );
}
