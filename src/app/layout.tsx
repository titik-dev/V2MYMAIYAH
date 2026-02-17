import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { getGlobalMenu, getGlobalNavigation, getThemeCustomization } from "@/lib/api"; // Ensure this import is used if we fetch here

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mymaiyah.id'),
  alternates: {
    canonical: './',
  },
  title: {
    default: "MyMaiyah.id - Mandiri, Otentik, Berdaulat",
    template: "%s | MyMaiyah.id",
  },
  description: "MyMaiyah.id: portal Maiyah—berita, esai, tadabbur, foto & video. Dokumentasi dan wacana seputar Cak Nun, KiaiKanjeng, simpul Maiyah.",
  keywords: ["Maiyah", "MyMaiyah", "Cak Nun", "Emha Ainun Nadjib", "KiaiKanjeng", "Kenduri Cinta", "Mocopat Syafaat", "Simpul Maiyah", "Tadabbur", "Maiyah Wisdom"],
  authors: [{ name: "Redaksi MyMaiyah", url: "https://mymaiyah.id" }],
  creator: "MyMaiyah.id",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mymaiyah.id",
    title: "MyMaiyah.id - Mandiri, Otentik, Berdaulat",
    description: "MyMaiyah.id: portal Maiyah—berita, esai, tadabbur, foto & video.",
    siteName: "MyMaiyah.id",
    images: [
      {
        url: "http://localhost/v2maiyah/wp-content/uploads/2025/12/LOGO-MYMAIYAH.png",
        width: 1200,
        height: 630,
        alt: "MyMaiyah.id Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@MyMaiyahID",
    creator: "@MyMaiyahID",
    images: ["http://localhost/v2maiyah/wp-content/uploads/2025/12/LOGO-MYMAIYAH.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

// ... existing imports

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let globalNav = null;
  let themeSettings = null;

  try {
    const [navData, themeData] = await Promise.all([
      getGlobalNavigation(),
      getThemeCustomization()
    ]);
    globalNav = navData;
    themeSettings = themeData;
  } catch (error) {
    console.error("Layout Navigation/Theme Error", error);
  }

  const customCss = themeSettings?.customCss || "";

  const bottomItems = globalNav?.bottomNavItems || [];
  return (
    <html lang="id" className="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[var(--color-maiyah-bg)] text-gray-900 min-h-screen relative flex flex-col overflow-x-hidden w-full`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-86C7QD4XCY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-86C7QD4XCY');
          `}
        </Script>

        {/* Custom CSS Injection */}
        {customCss && (
          <style dangerouslySetInnerHTML={{ __html: customCss }} />
        )}

        <ThemeProvider>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <div className="pb-16 md:pb-0">
            <Footer />
          </div>
          <BottomNav items={bottomItems} />
        </ThemeProvider>
      </body>
    </html>
  );
}
