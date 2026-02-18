import { getPageByUri } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, "").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const uri = `/${slug.join("/")}/`;
  const page = await getPageByUri(uri);

  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan",
    };
  }

  const description =
    stripHtml(page.content || "").slice(0, 160) ||
    `Informasi ${page.title} di MyMaiyah.id`;

  return {
    title: page.title,
    description,
    alternates: {
      canonical: `/${slug.join("/")}`,
    },
  };
}

export default async function WordPressPage({ params }: Props) {
  const { slug } = await params;
  const uri = `/${slug.join("/")}/`;
  const page = await getPageByUri(uri);

  if (!page || page.status !== "publish") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 pb-20">
      <section className="container mx-auto px-4 pt-24 md:pt-28 max-w-4xl">
        <header className="mb-8 border-b border-gray-200 dark:border-white/10 pb-5">
          <h1 className="text-3xl md:text-5xl font-black font-serif text-gray-900 dark:text-white">
            {stripHtml(page.title)}
          </h1>
        </header>

        <article
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-a:text-[var(--color-maiyah-blue)]"
          dangerouslySetInnerHTML={{ __html: page.content || "" }}
        />
      </section>
    </main>
  );
}
