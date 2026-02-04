import { searchPosts } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

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
            <div className="mb-8 pb-4 border-b border-gray-100 dark:border-white/5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hasil Pencarian</span>
                <h1 className="text-3xl md:text-4xl font-black font-serif mt-2">
                    "{q || 'Semua'}"
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    Ditemukan {posts.length} artikel untuk kata kunci ini.
                </p>
            </div>

            {posts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map(({ node }: any) => (
                        <article key={node.id} className="group flex md:flex-col gap-4 bg-white dark:bg-gray-900/50 rounded-xl p-3 md:p-0 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-white/5 md:border-none overflow-hidden">
                            {/* Thumbnail */}
                            <div className="relative w-1/3 md:w-full aspect-square md:aspect-video flex-shrink-0 overflow-hidden rounded-lg md:rounded-none bg-gray-100 dark:bg-gray-800">
                                {node.featuredImage?.node?.sourceUrl ? (
                                    <Image
                                        src={node.featuredImage.node.sourceUrl}
                                        alt={node.featuredImage.node.altText || node.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        <span className="text-[10px]">No Image</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col md:p-4 space-y-1">
                                <h3 className="text-sm md:text-lg font-bold font-serif leading-tight text-gray-900 dark:text-gray-100 group-hover:text-[var(--color-maiyah-blue)] transition-colors line-clamp-3 md:line-clamp-2">
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
                <div className="py-20 text-center bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Tidak ditemukan</h3>
                    <p className="text-gray-500 text-sm mt-1">Coba kata kunci lain atau periksa ejaan Anda.</p>
                </div>
            )}
        </main>
    );
}
