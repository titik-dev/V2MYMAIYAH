import { getPostsByCategory } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const category = await getPostsByCategory(slug);

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
                                        alt={node.featuredImage.node.altText || node.title}
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

                            {/* Badge Number (overlay on image top-left) */}
                            <div className="absolute top-6 left-6 bg-white text-[var(--color-maiyah-red)] font-bold text-base min-w-[2.5rem] h-10 px-2 flex items-center justify-center shadow-md rounded-sm z-10">
                                {node.databaseId || "#"}
                            </div>
                        </div>

                        {/* Content Box (Overlapping) */}
                        <div className="relative -mt-16 mx-4 bg-white dark:bg-gray-900 p-6 shadow-sm border border-gray-100 dark:border-white/5 rounded-sm transition-transform duration-300 group-hover:-translate-y-1">
                            <h3 className="text-2xl font-bold font-serif leading-tight text-gray-900 dark:text-white mb-3 hover:text-[var(--color-maiyah-red)] transition-colors">
                                <Link href={`/berita/${node.slug}`}>
                                    {node.title}
                                </Link>
                            </h3>

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
