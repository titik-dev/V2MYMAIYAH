import { getPostsByCategory } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const stripHtml = (html: string) => {
    if (!html) return "";
    // Remove HTML tags
    let clean = html.replace(/<[^>]*>?/gm, '');
    // Remove potential non-breaking spaces or weird whitespace
    clean = clean.replace(/&nbsp;/g, ' ').trim();
    return clean;
};

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}) {
    const { slug } = await params;
    // Handle nested slugs: take the last segment
    const slugString = Array.isArray(slug) ? slug[slug.length - 1] : slug;

    const category = await getPostsByCategory(slugString);

    if (!category) {
        notFound();
    }

    return (
        <main className="min-h-screen container mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-12 border-b border-gray-200 dark:border-white/10 pb-6">
                <span className="text-xs font-bold text-[var(--color-maiyah-red)] uppercase tracking-[0.2em]">Kategori</span>
                <h1 className="text-4xl md:text-5xl font-black font-serif mt-3 text-[var(--color-maiyah-blue)] capitalize">
                    {category.name}
                </h1>
            </div>

            {/* Post Grid */}
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {category.posts?.edges?.map(({ node }: any) => (
                    <article key={node.id} className="group relative flex flex-col">
                        {/* Image Container */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 rounded-lg">
                            <Link href={`/berita/${node.slug}`} className="block w-full h-full">
                                {node.featuredImage?.node?.sourceUrl ? (
                                    <Image
                                        src={node.featuredImage.node.sourceUrl}
                                        alt={node.featuredImage.node.altText || stripHtml(node.title)}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-200">
                                        <span className="text-xs">No Image</span>
                                    </div>
                                )}
                            </Link>

                            {/* Category Badge Overlay */}
                            {node.categories?.edges?.length > 0 && node.categories.edges[0]?.node && (
                                <span className="absolute top-2 left-2 z-20 bg-[var(--color-maiyah-red)] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
                                    {node.categories.edges[0].node.name}
                                </span>
                            )}
                        </div>

                        {/* Content Box (Overlapping) */}
                        <div className="relative -mt-16 mx-4 bg-white dark:bg-gray-900 p-6 shadow-sm border border-gray-100 dark:border-white/5 rounded-sm transition-transform duration-300 group-hover:-translate-y-1">
                            <div className="mb-3">
                                <Link href={`/berita/${node.slug}`} className="block group-hover:text-[var(--color-maiyah-red)] transition-colors">
                                    {/* SKENARIO BARU: Title WP Merah, Sub Judul Hitam */}
                                    {node.customTitle?.subJudulBawah ? (
                                        <>
                                            {/* Judul WP (Merah Kecil) */}
                                            <div className="text-sm font-serif text-[var(--color-maiyah-red)] mb-1 leading-tight font-bold">
                                                {stripHtml(node.title)}
                                            </div>
                                            {/* Sub Judul (Hitam Besar) */}
                                            <h3 className="text-2xl font-bold font-serif leading-tight text-gray-900 dark:text-white group-hover:text-[var(--color-maiyah-red)] transition-colors uppercase">
                                                {stripHtml(node.customTitle.subJudulBawah)}
                                            </h3>
                                        </>
                                    ) : (
                                        /* Fallback: Judul WP Hitam Besar */
                                        <h3 className="text-2xl font-bold font-serif leading-tight text-gray-900 dark:text-white group-hover:text-[var(--color-maiyah-red)] transition-colors uppercase">
                                            {stripHtml(node.title)}
                                        </h3>
                                    )}
                                </Link>
                            </div>

                            {node.excerpt && (
                                <div
                                    dangerouslySetInnerHTML={{ __html: node.excerpt }}
                                    className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 font-sans leading-relaxed"
                                />
                            )}

                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-auto">
                                {new Date(node.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {(!category.posts?.edges || category.posts.edges.length === 0) && (
                <div className="text-center py-24 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-300 dark:border-white/10">
                    <p className="text-xl text-gray-500 font-serif italic">Belum ada tulisan di kategori ini.</p>
                </div>
            )}
        </main>
    );
}
