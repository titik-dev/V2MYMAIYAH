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

const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
};

export default async function PostPage(props: Props) {
    const params = await props.params;
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    const category = post.categories?.edges[0]?.node;

    // Logic for Custom Author vs Default Author
    const hasCustomAuthor = !!post.customAuthor?.nama;
    const authorData = {
        name: hasCustomAuthor ? post.customAuthor.nama : (post.author?.node?.name || "Redaksi"),
        avatar: hasCustomAuthor ? post.customAuthor.foto?.sourceUrl : post.author?.node?.avatar?.url,
        bio: hasCustomAuthor ? post.customAuthor.deskripsi : null,
    };

    return (
        <main className="min-h-screen pb-20 bg-white dark:bg-gray-950">
            {/* 1. Hero Image Section (Clean Visual) */}
            <div className="relative w-full aspect-[4/3] md:aspect-[21/9] lg:h-[70vh] bg-gray-900 overflow-hidden flex items-center justify-center group">
                {post.featuredImage?.node?.sourceUrl ? (
                    <>
                        {/* Ambient Background */}
                        <div className="absolute inset-0 opacity-40 select-none pointer-events-none">
                            <Image
                                src={post.featuredImage.node.sourceUrl}
                                alt="Background Ambience"
                                fill
                                className="object-cover blur-3xl scale-125"
                                priority
                            />
                        </div>

                        {/* Main Image */}
                        <div className="relative w-full h-full z-0 flex items-center justify-center p-4">
                            <Image
                                src={post.featuredImage.node.sourceUrl}
                                alt={post.featuredImage.node.altText || post.title}
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400">No Image Available</span>
                    </div>
                )}
            </div>

            {/* 2. Header Content (Clean Typography Below Image) */}
            <header className="container mx-auto px-4 py-8 md:py-12 text-center max-w-4xl relative z-10">
                {/* Category Label */}
                {category && (
                    <Link
                        href={`/category/${category.slug}`}
                        className="inline-block px-4 py-1.5 mb-6 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white bg-[var(--color-maiyah-red)] rounded-full hover:bg-red-700 transition-colors shadow-sm"
                    >
                        {category.name}
                    </Link>
                )}

                <div className="flex flex-col items-center">
                    {/* SKENARIO BARU:
                        1. Jika ada 'Sub Judul Bawah', maka Judul WP (post.title) jadi KICKER/PREFIX MERAH.
                        2. 'Sub Judul Bawah' jadi JUDUL UTAMA (Hitam Besar).
                    */}

                    {post.customTitle?.subJudulBawah ? (
                        <>
                            {/* Judul WP jadi Merah (di Atas) */}
                            <h2 className="text-xl md:text-2xl font-serif text-[var(--color-maiyah-red)] mb-2 font-bold">
                                {stripHtml(post.title)}
                            </h2>
                            {/* Sub Judul jadi Hitam (di Bawah) */}
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-serif text-gray-900 dark:text-white leading-tight mb-2 uppercase">
                                {stripHtml(post.customTitle.subJudulBawah)}
                            </h1>
                        </>
                    ) : (
                        /* Fallback: Jika tidak ada custom title, Judul WP tetep Hitam Besar */
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-serif text-gray-900 dark:text-white leading-tight mb-4">
                            {stripHtml(post.title)}
                        </h1>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap justify-center items-center gap-4 md:gap-6 text-gray-600 dark:text-gray-300 text-sm font-medium">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative border border-gray-100 shadow-sm">
                            {authorData.avatar ? (
                                <Image
                                    src={authorData.avatar}
                                    alt={authorData.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[var(--color-maiyah-blue)] text-white text-xs font-bold">
                                    {authorData.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-lg tracking-wide">{authorData.name}</span>
                    </div>
                    <span className="hidden md:block w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                    <time className="text-gray-500 dark:text-gray-400 tracking-wide text-xs md:text-sm uppercase font-bold">
                        {new Date(post.date).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                </div>
            </header>

            {/* 3. Article Content */}
            <article className="container mx-auto px-4 md:px-0 relative z-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1 bg-transparent max-w-3xl mx-auto">

                    {/* Custom Author Bio Box (Reference Style) */}
                    {hasCustomAuthor && (
                        <div className="flex items-start gap-4 mb-8 pb-8 border-b border-gray-100">
                            <div className="w-16 h-16 rounded-full overflow-hidden relative flex-shrink-0 bg-gray-100">
                                {authorData.avatar ? (
                                    <Image src={authorData.avatar} alt={authorData.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200" />
                                )}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 leading-tight mb-1">{authorData.name}</h4>
                                {authorData.bio && (
                                    <p className="text-sm text-gray-600 leading-relaxed font-serif">{authorData.bio}</p>
                                )}
                            </div>
                        </div>
                    )}

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
