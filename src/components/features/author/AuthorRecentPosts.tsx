import Image from "next/image";
import Link from "next/link";

type Props = {
    posts: any[];
    authorName: string;
};

export default function AuthorRecentPosts({ posts, authorName }: Props) {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="mt-16 pt-10 border-t border-gray-100 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-5 bg-[var(--color-maiyah-red)] rounded-full"></span>
                Tulisan Terbaru dari <span className="text-[var(--color-maiyah-blue)]">{authorName}</span>
            </h3>

            <div className="grid gap-6 md:grid-cols-3">
                {posts.map((post) => (
                    <article key={post.id} className="group flex flex-col gap-3">
                        <Link href={`/berita/${post.slug}`} className="block relative aspect-video rounded-lg overflow-hidden bg-gray-100 w-full shadow-sm group-hover:shadow-md transition-shadow">
                            {post.featuredImage?.node?.sourceUrl ? (
                                <Image
                                    src={post.featuredImage.node.sourceUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                    <span className="text-xs">No Image</span>
                                </div>
                            )}
                        </Link>

                        <div>
                            <h4 className="font-serif font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[var(--color-maiyah-blue)] transition-colors line-clamp-2">
                                <Link href={`/berita/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </h4>
                            <time className="text-[10px] text-gray-500 uppercase font-bold mt-1 block">
                                {new Date(post.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                            </time>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
