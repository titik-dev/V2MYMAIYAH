import { getAllPostsForHome, getHomepageAds, getPostsBySlugs } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import FeaturedSlider from "@/components/features/home/FeaturedSlider";

export default async function Home() {
  let posts: any[] = [];
  let ads = [];
  let specificFeaturedPosts: any[] = [];

  // Specific slugs requested by user
  const targetSlugs = [
    "miraj-terapi-dari-allah",
    "hujan-jeda-dan-orang-orang-yang-tetap-datang",
    "cerita-dari-munkar-kesingsal"
  ];

  try {
    const [edges, adsData, featuredData] = await Promise.all([
      getAllPostsForHome(),
      getHomepageAds(),
      getPostsBySlugs(targetSlugs)
    ]);

    posts = edges?.edges || [];
    ads = adsData;

    // Normalize specific posts to match edges structure { node: ... }
    if (featuredData && featuredData.length > 0) {
      specificFeaturedPosts = featuredData.map(post => ({ node: post }));
    }

  } catch (err) {
    console.error("Home Data Fetch Error", err);
  }

  // Define Featured Posts (Prioritize specific posts, fallback to latest)
  // Ensure we have 3 posts for the grid
  let featuredPosts = [];
  if (specificFeaturedPosts.length > 0) {
    featuredPosts = specificFeaturedPosts;
    // If we found specific posts, we should filter them out from the "Latest" list to avoid duplication if they appear there
    // However, simplified logic: just show them.
  } else {
    featuredPosts = posts.slice(0, 3);
  }

  // Latest posts logic: If we used specific posts, we can just use the normal posts array for latest, 
  // maybe excluding the ones we just showed if we want to be perfect, but standard behavior usually fine.
  // Actually, let's keep it simple. Latest = posts from index 0 if we used specific for featured.
  // Or if we used slice(0,3) for featured, latest starts at 3.

  const latestPosts = specificFeaturedPosts.length > 0 ? posts.slice(0, 6) : posts.slice(3, 9);
  const popularPosts = specificFeaturedPosts.length > 0 ? posts.slice(6, 12) : posts.slice(9, 15);

  // Default Ads Fallback
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
      <h1 className="sr-only">MyMaiyah.id - Portal Berita Maiyah Terkini</h1>

      {/* 
        FEATURED SECTION (3 Columns)
        - Desktop: 3 Columns Grid (Card Style)
        - Mobile: Stacked or Slider (keeping simple stack for now to match structure)
      */}
      <section className="container mx-auto px-4 pt-6 pb-6">
        <FeaturedSlider posts={featuredPosts} />
      </section>

      {/* Video Section (Full Width / Cinema Mode) - Moved Below Featured */}
      <section className="container mx-auto px-4 pb-8">
        <div className="relative w-full rounded-2xl shadow-xl overflow-hidden group bg-black">
          {/* Desktop: Cinema Mode */}
          <div className="relative aspect-[21/25] md:aspect-[21/9] w-full flex items-center justify-center overflow-hidden">
            {/* Blurred Background */}
            <div className="absolute inset-0 opacity-30 select-none pointer-events-none">
              <video
                src="https://mymaiyah.id/72Th%20Mbah%20Nun.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="object-cover w-full h-full blur-xl scale-110"
              />
            </div>

            {/* Main Video */}
            <div className="relative z-10 w-full h-full md:w-auto">
              <video
                src="https://mymaiyah.id/72Th%20Mbah%20Nun.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
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
            const imageUrl = ad.gambar?.node?.sourceUrl || ad.gambar?.sourceUrl || ad.image || "https://placehold.co/600x400?text=Iklan";
            const linkUrl = ad.url || '#';
            const altText = ad.gambar?.node?.altText || ad.gambar?.altText || ad.alt || 'Iklan Maiyah';

            return (
              <Link
                key={index}
                href={linkUrl}
                target="_blank"
                className="group block w-full h-auto shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden bg-white border border-gray-100"
              >
                <Image
                  src={imageUrl}
                  alt={altText}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, 33vw"
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
            <article key={node.id} className="group flex md:flex-col gap-4 bg-white rounded-xl p-3 md:p-0 shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-shadow border border-gray-100 md:border-none">
              <div className="relative w-1/3 md:w-full aspect-[4/3] md:aspect-video flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {node.featuredImage?.node?.sourceUrl ? (
                  <>
                    {/* Blurred Backdrop for Ambiance */}
                    <Image
                      src={node.featuredImage.node.sourceUrl}
                      alt=""
                      fill
                      className="object-cover blur-xl scale-125 opacity-50"
                    />
                    {/* Main Image - Fully Visible */}
                    <Image
                      src={node.featuredImage.node.sourceUrl}
                      alt={node.featuredImage.node.altText || node.title}
                      fill
                      sizes="(max-width: 768px) 33vw, 33vw"
                      className="object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                    />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-200">
                    <span className="text-[10px]">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center md:justify-start space-y-1 md:space-y-2 py-1 md:px-4 md:pb-4">
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
          {/* Same style as Latest News */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-[var(--color-maiyah-red)] rounded-full"></div>
            <h2 className="text-xl font-bold text-[var(--color-maiyah-blue)]">Berita Terpopuler</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularPosts.map(({ node }: any) => (
              <article key={node.id} className="group flex md:flex-col gap-4 bg-white rounded-xl p-3 md:p-0 shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-shadow border border-gray-100 md:border-none">
                {/* Reusing article structure */}
                <div className="relative w-1/3 md:w-full aspect-[4/3] md:aspect-video flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {node.featuredImage?.node?.sourceUrl ? (
                    <>
                      {/* Blurred Backdrop for Ambiance */}
                      <Image
                        src={node.featuredImage.node.sourceUrl}
                        alt=""
                        fill
                        className="object-cover blur-xl scale-125 opacity-50"
                      />
                      {/* Main Image - Fully Visible */}
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
                <div className="flex-1 flex flex-col justify-center md:justify-start space-y-1 md:space-y-2 py-1 md:px-4 md:pb-4">
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
