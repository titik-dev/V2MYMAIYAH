import Image from "@/components/ui/AppImage";
import { getContributorArchiveBySlug } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const contributor = await getContributorArchiveBySlug(slug);

  if (!contributor) {
    return { title: "Kontributor Tidak Ditemukan" };
  }

  const description =
    stripHtml(contributor.description || "").slice(0, 160) ||
    `Arsip tulisan dari ${contributor.name}`;

  return {
    title: `${contributor.name} - Kontributor`,
    description,
    alternates: {
      canonical: `/kontributor/${slug}`,
    },
  };
}

export default async function ContributorArchivePage({ params }: Props) {
  const { slug } = await params;
  const contributor = await getContributorArchiveBySlug(slug);

  if (!contributor) {
    notFound();
  }

  const posts = contributor.posts?.nodes || [];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 pb-20 overflow-x-hidden">
      <section className="w-full max-w-6xl mx-auto px-4 pt-24 md:pt-28 overflow-x-hidden">
        <Link
          href="/kontributor"
          className="inline-flex items-center rounded-full border border-gray-200 dark:border-white/10 px-3 py-1.5 text-xs md:text-sm font-semibold text-[var(--color-maiyah-blue)] hover:underline mb-4"
        >
          Kembali ke Daftar Kontributor
        </Link>

        <header className="rounded-xl border border-gray-200 dark:border-white/10 p-4 md:p-6 bg-white dark:bg-gray-900 mb-6 md:mb-8 overflow-hidden">
          <div className="flex items-start gap-3 md:gap-4 min-w-0">
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 border border-gray-100 dark:border-white/10 flex-shrink-0">
              {contributor.avatar?.url ? (
                <Image
                  src={contributor.avatar.url}
                  alt={contributor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 64px, 80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                  {contributor.name?.charAt(0) || "?"}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h1 className="text-xl md:text-4xl font-black font-serif text-gray-900 dark:text-white break-words leading-tight">
                {contributor.name}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1 break-all">@{contributor.slug}</p>
              <p className="text-xs md:text-sm mt-2 text-gray-600 dark:text-gray-300">
                {posts.length} tulisan terbaru ditampilkan.
              </p>
            </div>
          </div>

          {contributor.description && (
            <p className="mt-4 text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed break-words">
              {contributor.description}
            </p>
          )}
        </header>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/15 p-8 text-center text-gray-500">
            Kontributor ini belum memiliki tulisan terbit.
          </div>
        ) : (
          <div className="grid gap-4 md:gap-5 md:grid-cols-2">
            {posts.map((post: any) => (
              <article
                key={post.id}
                className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-gray-900 shadow-sm min-w-0"
              >
                <Link href={`/berita/${post.slug}`} className="block">
                  <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800">
                    {post.featuredImage?.node?.sourceUrl ? (
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || stripHtml(post.title)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-3 md:p-4 min-w-0">
                  {post.categories?.edges?.[0]?.node?.name && (
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-maiyah-red)] mb-2">
                      {post.categories.edges[0].node.name}
                    </p>
                  )}

                  <h2 className="text-base md:text-lg font-bold font-serif text-gray-900 dark:text-white leading-snug break-words">
                    <Link href={`/berita/${post.slug}`} className="hover:text-[var(--color-maiyah-blue)] transition-colors">
                      {stripHtml(post.title)}
                    </Link>
                  </h2>

                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 break-words">
                    {stripHtml(post.excerpt || "")}
                  </p>

                  <p className="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {new Date(post.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
