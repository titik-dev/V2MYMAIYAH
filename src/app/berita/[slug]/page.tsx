import { getPostBySlug } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: "Berita Tidak Ditemukan",
        };
    }

    // Bersihkan excerpt dari HTML tags untuk description
    const cleanExcerpt = post.excerpt?.replace(/<[^>]+>/g, '') || `Berita lengkap ${post.title} di MyMaiyah.id`;

    return {
        title: post.title,
        description: cleanExcerpt.slice(0, 160),
        openGraph: {
            title: post.title,
            description: cleanExcerpt.slice(0, 160), // Batasi 160 karakter
            url: `https://mymaiyah.id/berita/${slug}`,
            images: [
                {
                    url: post.featuredImage?.node?.sourceUrl || "http://assets.mymaiyah.id/wp-content/uploads/2025/12/LOGO-MYMAIYAH.png",
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            type: "article",
            publishedTime: post.date,
            authors: [post.author?.node?.name || "Redaksi"],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: cleanExcerpt.slice(0, 160),
            images: [post.featuredImage?.node?.sourceUrl || "http://assets.mymaiyah.id/wp-content/uploads/2025/12/LOGO-MYMAIYAH.png"],
        },
    };
}

export default async function PostPage(props: Props) {
    const params = await props.params;
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    const category = post.categories?.edges[0]?.node;

    return (
        <main className="min-h-screen pb-20 bg-white dark:bg-gray-950">
            {/* Hero Image */}
            <div className="relative w-full aspect-video md:aspect-[21/9] lg:h-[60vh]">
                {post.featuredImage?.node?.sourceUrl ? (
                    <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400">No Image Available</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20">
                    <div className="container mx-auto">
                        {/* Category Label */}
                        {category && (
                            <Link
                                href={`/category/${category.slug}`}
                                className="inline-block px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-white bg-[var(--color-maiyah-red)] rounded-full hover:bg-red-700 transition-colors"
                            >
                                {category.name}
                            </Link>
                        )}

                        <h1 className="text-2xl md:text-5xl lg:text-5xl font-black font-serif text-white leading-tight mb-4 drop-shadow-md">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 text-gray-200 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden relative border border-white/20">
                                    {post.author?.node?.avatar?.url ? (
                                        <Image
                                            src={post.author.node.avatar.url}
                                            alt={post.author.node.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[var(--color-maiyah-blue)] text-white text-xs font-bold">
                                            {post.author?.node?.name?.charAt(0) || "A"}
                                        </div>
                                    )}
                                </div>
                                <span>{post.author?.node?.name || "Redaksi"}</span>
                            </div>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <time>{new Date(post.date).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</time>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <article className="container mx-auto px-4 md:px-0 -mt-6 relative z-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-xl shadow-xl md:shadow-none p-6 md:p-0 md:bg-transparent md:dark:bg-transparent md:max-w-3xl mx-auto">
                    {/* Post Content */}
                    <div
                        className="prose prose-lg dark:prose-invert prose-red max-w-none font-serif leading-relaxed text-gray-800 dark:text-gray-200 prose-img:rounded-xl prose-headings:font-black prose-a:text-[var(--color-maiyah-blue)]"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags / Share (Placeholder) */}
                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm font-bold">Bagikan:</span>
                            {/* Add Share Buttons here later */}
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 hover:text-[var(--color-maiyah-blue)]">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </button>
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 hover:text-[var(--color-maiyah-blue)]">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </main>
    )
}
