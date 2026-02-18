import ContributorsDirectory from "@/components/features/contributor/ContributorsDirectory";
import { getContributors } from "@/lib/api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontributor",
  description: "Daftar kontributor penulis MyMaiyah.id",
};

export default async function KontributorPage() {
  let contributors: any[] = [];

  try {
    contributors = await getContributors();
  } catch (error) {
    console.error("Failed to fetch contributors:", error);
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 pb-20 overflow-x-hidden">
      <section className="w-full max-w-6xl mx-auto px-4 pt-24 md:pt-28 overflow-x-hidden">
        <header className="mb-8 border-b border-gray-200 dark:border-white/10 pb-5">
          <h1 className="text-3xl md:text-5xl font-black font-serif text-gray-900 dark:text-white">
            Kontributor
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300">
            Daftar penulis yang memiliki artikel terbit di MyMaiyah.id.
          </p>
        </header>

        {contributors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/15 p-8 text-center text-gray-500">
            Belum ada kontributor yang bisa ditampilkan.
          </div>
        ) : (
          <ContributorsDirectory contributors={contributors} />
        )}
      </section>
    </main>
  );
}
