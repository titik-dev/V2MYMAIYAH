import { getAllPostsForHome, getHomepageAds } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  let posts = [];
  let ads = [];
  try {
    const edges = await getAllPostsForHome();
    posts = edges?.edges || [];
    ads = await getHomepageAds();
  } catch (err) {
    console.error("Home Data Fetch Error", err);
    // The original code had a return here, but the instruction implies removing it for the new error handling flow.
    // If ads fetch also fails, `ads` will remain an empty array, triggering the fallback.
  }

  // Slice posts for different sections
  const latestPosts = posts.slice(0, 6);
  const popularPosts = posts.slice(6, 12);

  // Default Ads Fallback (Jika ACF belum diisi)
  const defaultAds = [
    {
      url: "https://share.google/aZGkwJHCMYylMtWSc",
      image: "https://mymaiyah.id/wp-content/uploads/2025/12/sambung-sedulur.webp",
      alt: "Sambung Sedulur"
    },
    {
      url: "https://www.terusberjalan.id/product/open-pre-order-t-shirt-sangkan-paraning-dumadi",
      image: "https://www.terusberjalan.id/wp-content/uploads/2025/12/MY-MAIYAH.webp",
      alt: "Pre Order T-Shirt"
    },
    {
      url: "https://www.terusberjalan.id/product/ready-stock-kalender-2026-tersedia-kalender-dinding-meja",
      image: "https://www.terusberjalan.id/wp-content/uploads/2025/11/MY-MAIYAH-scaled.png",
      alt: "Kalender 2026"
    }
  ];

  return (
    <main className="min-h-screen pb-20">

      {/* Hero Section (Standalone Video) */}
      <section className="container mx-auto px-4 pt-6 pb-8">
        <div className="relative w-full rounded-2xl shadow-lg overflow-hidden group bg-gray-900">

          {/* Mobile Layout: Full Portrait (Immersive) */}
          <div className="md:hidden aspect-[9/16] relative w-full">
            <video
              src="https://mymaiyah.id/72Th%20Mbah%20Nun.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full"
            />
          </div>

          {/* Desktop Layout: Cinema Mode (Blurred Background + Contain) */}
          <div className="hidden md:flex aspect-[21/9] relative w-full items-center justify-center overflow-hidden">
            {/* Ambient Background (Blurred) */}
            <div className="absolute inset-0 opacity-40 select-none">
              <video
                src="https://mymaiyah.id/72Th%20Mbah%20Nun.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="object-cover w-full h-full blur-xl scale-110"
              />
            </div>

            {/* Main Video (Full Content) */}
            <video
              src="https://mymaiyah.id/72Th%20Mbah%20Nun.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="relative h-full w-auto object-contain shadow-2xl z-10 rounded-lg"
            />
          </div>

        </div>
      </section>

      {/* Ceklis (Ads Section) */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[var(--color-maiyah-red)] rounded-full"></div>
          <h2 className="text-xl font-bold text-[var(--color-maiyah-blue)]">Ceklis</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(ads && ads.length > 0 ? ads : defaultAds).map((ad: any, index: number) => {
            // Normalisasi data (Custom ACF structure vs Default Fallback structure)
            // Support structure: ad.gambar.node.sourceUrl (GraphQL Edge) OR ad.gambar.sourceUrl (Standard) OR ad.image (Fallback)
            const imageUrl = ad.gambar?.node?.sourceUrl || ad.gambar?.sourceUrl || ad.image || "https://placehold.co/600x400?text=Iklan";
            const linkUrl = ad.url || '#';
            const altText = ad.gambar?.node?.altText || ad.gambar?.altText || ad.alt || 'Iklan Maiyah';

            return (
              <Link
                key={index}
                href={linkUrl}
                target="_blank"
                className="group block w-full h-auto shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden bg-gray-50 border border-gray-100"
              >
                <Image
                  src={imageUrl}
                  alt={altText}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}
                  className="group-hover:scale-102 transition-transform duration-500"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest News Grid */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[var(--color-maiyah-red)] rounded-full"></div>
          <h2 className="text-xl font-bold text-[var(--color-maiyah-blue)]">Berita Terbaru</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map(({ node }: any) => (
            <article key={node.id} className="group flex md:flex-col gap-4 bg-white md:bg-transparent rounded-xl p-3 md:p-0 shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-shadow border border-gray-100 md:border-none">
              {/* Thumbnail */}
              <div className="relative w-1/3 md:w-full aspect-[4/3] md:aspect-video flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
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
              <div className="flex-1 flex flex-col justify-center md:justify-start space-y-1 md:space-y-2 py-1">
                {/* Safe Category Check */}
                {node.categories?.edges?.length > 0 && node.categories.edges[0]?.node && (
                  <span className="text-[10px] font-bold text-[var(--color-maiyah-red)] uppercase tracking-wider">
                    {node.categories.edges[0].node.name}
                  </span>
                )}
                <h3 className="text-sm md:text-lg font-bold font-serif leading-snug text-gray-900 group-hover:text-[var(--color-maiyah-blue)] transition-colors line-clamp-3 md:line-clamp-2">
                  <Link href={`/berita/${node.slug}`}>
                    {node.title}
                  </Link>
                </h3>
                <div className="text-[10px] md:text-xs text-gray-500 mt-auto pt-1">
                  {new Date(node.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Popular News Grid */}
      {popularPosts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-[var(--color-maiyah-red)] rounded-full"></div>
            <h2 className="text-xl font-bold text-[var(--color-maiyah-blue)]">Berita Terpopuler</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularPosts.map(({ node }: any) => (
              <article key={node.id} className="group flex md:flex-col gap-4 bg-white md:bg-transparent rounded-xl p-3 md:p-0 shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-shadow border border-gray-100 md:border-none">
                {/* Thumbnail */}
                <div className="relative w-1/3 md:w-full aspect-[4/3] md:aspect-video flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
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
                <div className="flex-1 flex flex-col justify-center md:justify-start space-y-1 md:space-y-2 py-1">
                  {/* Safe Category Check */}
                  {node.categories?.edges?.length > 0 && node.categories.edges[0]?.node && (
                    <span className="text-[10px] font-bold text-[var(--color-maiyah-red)] uppercase tracking-wider">
                      {node.categories.edges[0].node.name}
                    </span>
                  )}
                  <h3 className="text-sm md:text-lg font-bold font-serif leading-snug text-gray-900 group-hover:text-[var(--color-maiyah-blue)] transition-colors line-clamp-3 md:line-clamp-2">
                    <Link href={`/berita/${node.slug}`}>
                      {node.title}
                    </Link>
                  </h3>
                  <div className="text-[10px] md:text-xs text-gray-500 mt-auto pt-1">
                    {new Date(node.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
