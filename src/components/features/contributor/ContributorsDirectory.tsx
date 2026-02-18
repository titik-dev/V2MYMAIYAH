"use client";

import Image from "@/components/ui/AppImage";
import Link from "next/link";
import { useMemo, useState } from "react";

type Contributor = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  avatar?: { url?: string | null } | null;
};

export default function ContributorsDirectory({
  contributors,
}: {
  contributors: Contributor[];
}) {
  const [keyword, setKeyword] = useState("");
  const [startsWith, setStartsWith] = useState("");

  const filteredContributors = useMemo(() => {
    const text = keyword.trim().toLowerCase();

    return contributors.filter((contributor) => {
      const name = (contributor.name || "").toLowerCase();
      const byText =
        text.length === 0 ||
        name.includes(text) ||
        (contributor.slug || "").toLowerCase().includes(text);
      const byLetter =
        startsWith.length === 0 || name.startsWith(startsWith.toLowerCase());
      return byText && byLetter;
    });
  }, [contributors, keyword, startsWith]);

  return (
    <div className="w-full">
      <div className="mb-5 rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <label className="block">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">
              Cari Nama Kontributor
            </span>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Contoh: abdul, farid, redaksi"
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--color-maiyah-blue)]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">
              Filter Huruf Awal
            </span>
            <input
              type="text"
              value={startsWith}
              onChange={(e) =>
                setStartsWith(
                  e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 1).toUpperCase()
                )
              }
              placeholder="Contoh: A"
              maxLength={1}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--color-maiyah-blue)]"
            />
          </label>
        </div>

        <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">
          Menampilkan <strong>{filteredContributors.length}</strong> dari{" "}
          <strong>{contributors.length}</strong> kontributor.
        </p>
      </div>

      {filteredContributors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/15 p-8 text-center text-gray-500">
          Tidak ada kontributor yang cocok dengan filter.
        </div>
      ) : (
        <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContributors.map((contributor) => (
            <Link
              key={contributor.id}
              href={`/kontributor/${contributor.slug}`}
              className="block rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900 p-4 shadow-sm transition-transform hover:-translate-y-0.5 overflow-hidden"
            >
              <article className="min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 border border-gray-100 dark:border-white/10 flex-shrink-0">
                    {contributor.avatar?.url ? (
                      <Image
                        src={contributor.avatar.url}
                        alt={contributor.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                        {contributor.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900 dark:text-white break-words leading-tight">
                      {contributor.name}
                    </h2>
                    <p className="text-xs text-gray-500 truncate">@{contributor.slug}</p>
                  </div>
                </div>

                {contributor.description && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 break-words leading-relaxed">
                    {contributor.description}
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
