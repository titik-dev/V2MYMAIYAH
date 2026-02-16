import { getAllPostsForHome, getHomepageData } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import FeaturedSlider from "@/components/features/home/FeaturedSlider";

export default async function Home() {
  let posts: any[] = [];
  let ads = [];
  let specificFeaturedPosts: any[] = [];
  let mode = 'manual';
  let sectionTitles = {
    ceklis: "Ceklis",
    latest: "Berita Terbaru",
    popular: "Berita Terpopuler"
  };

  try {
    const [edges, homepageData] = await Promise.all([
      getAllPostsForHome(),
      getHomepageData()
    ]);

    posts = edges?.edges || [];
    // Manual Sort by Date Descending to override Sticky Posts behavior
    posts.sort((a: any, b: any) => new Date(b.node.date).getTime() - new Date(a.node.date).getTime());
    ads = homepageData.ads || [];
    mode = homepageData?.mode || 'manual';
    sectionTitles = homepageData?.sectionTitles || sectionTitles;

    // Check if ACF returned any Featured Posts
    if (homepageData.featuredPosts && homepageData.featuredPosts.length > 0) {
      // Normalize to match edges structure { node: post }
      specificFeaturedPosts = homepageData.featuredPosts.map((post: any) => ({ node: post }));
      // Also Sort Specific Featured Posts (Date Desc)
      specificFeaturedPosts.sort((a: any, b: any) => new Date(b.node.date).getTime() - new Date(a.node.date).getTime());
    }

  } catch (err) {
    console.error("Home Data Fetch Error", err);
  }

  // Determine displayed posts for slider
  let featuredPosts = [];
  if (specificFeaturedPosts.length > 0) {
    featuredPosts = specificFeaturedPosts;
  } else {
    // Fallback: If no featured posts found/selected, use first 3 latest
    featuredPosts = posts.slice(0, 3);
  }

  // Determine starting index for Latest News Grid based on mode
  let gridStartIndex = 0;
  // Use mode from API response (already fetched)
  // const mode = (await getHomepageData()).mode || 'manual';

  if (mode === 'latest' && featuredPosts.length > 0) {
    gridStartIndex = featuredPosts.length;
  } else if (featuredPosts.length === 0 && specificFeaturedPosts.length === 0) {
    // If fallback was used (slice 0,3), grid starts at 3
    gridStartIndex = 3;
  }

  // Latest Posts Grid
  const latestPosts = posts.slice(gridStartIndex, gridStartIndex + 6);
  // Popular Posts Grid (using remaining posts for now)
  const popularPosts = posts.slice(gridStartIndex + 6, gridStartIndex + 12);

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

  // Debug: Log the titles to server console
  console.log("Homepage Section Titles:", sectionTitles);

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
            <div className="absolute inset-0 opacity-70 select-none pointer-events-none">
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
          <h2 className="text-xl font-bold text-[var(--color-maiyah-blue)]">{sectionTitles.ceklis}</h2>
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
          <h2 className="text-xl font-bold text-[var(--color-maiyah-blue)]">{sectionTitles.latest}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map(({ node }: any) => (
            <article key={node.id} className="group flex md:flex-col gap-4 bg-white rounded-xl p-3 md:p-0 shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-shadow border border-gray-100 md:border-none">
              <div className="relative w-1/3 md:w-full aspect-[4/3] md:aspect-video flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {/* Category Badge Overlay */}
                {node.categories?.edges?.length > 0 && node.categories.edges[0]?.node && (
                  <span className="absolute top-2 left-2 z-20 bg-[var(--color-maiyah-red)] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
                    {node.categories.edges[0].node.name}
                  </span>
                )}
                {node.featuredImage?.node?.sourceUrl ? (
                  <>
                    {/* Blurred Backdrop for Ambiance */}
                    <Image
                      src={node.featuredImage.node.sourceUrl}
                      alt=""
                      fill
                      className="object-cover blur-xl scale-125 opacity-50"
                      sizes="(max-width: 768px) 33vw, 33vw"
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
            <h2 className="text-xl font-bold text-[var(--color-maiyah-blue)]">{sectionTitles.popular}</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularPosts.map(({ node }: any) => (
              <article key={node.id} className="group flex md:flex-col gap-4 bg-white rounded-xl p-3 md:p-0 shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-shadow border border-gray-100 md:border-none">
                {/* Reusing article structure */}
                <div className="relative w-1/3 md:w-full aspect-[4/3] md:aspect-video flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {/* Category Badge Overlay */}
                  {node.categories?.edges?.length > 0 && node.categories.edges[0]?.node && (
                    <span className="absolute top-2 left-2 z-20 bg-[var(--color-maiyah-red)] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
                      {node.categories.edges[0].node.name}
                    </span>
                  )}
                  {node.featuredImage?.node?.sourceUrl ? (
                    <>
                      {/* Blurred Backdrop for Ambiance */}
                      <Image
                        src={node.featuredImage.node.sourceUrl}
                        alt=""
                        fill
                        className="object-cover blur-xl scale-125 opacity-50"
                        sizes="(max-width: 768px) 33vw, 33vw"
                      />
                      {/* Main Image - Fully Visible */}
                      <Image
                        src={node.featuredImage.node.sourceUrl}
                        alt={node.featuredImage.node.altText || node.title}
                        fill
                        className="object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 33vw, 33vw"
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
