import Image from "next/image";
import Link from "next/link";

type Props = {
    author: {
        name: string;
        avatar?: string;
        bio?: string;
        simpul?: string;
        socialMedia?: { platform: string; url: string }[];
    }
    className?: string;
};

export default function AuthorBio({ author, className = "" }: Props) {
    if (!author) return null;

    // Helper to get icon based on platform (simple text fallback for now, can be upgraded to icons later)
    const getSocialIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('instagram')) return 'IG';
        if (p.includes('facebook')) return 'FB';
        if (p.includes('twitter') || p.includes('x')) return 'X';
        if (p.includes('linkedin')) return 'IN';
        return 'WEB';
    };

    return (
        <div className={`bg-gray-50 dark:bg-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border border-gray-100 dark:border-white/10 ${className}`}>
            {/* Foto Profil */}
            <div className="flex-shrink-0">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md">
                    {author.avatar ? (
                        <Image
                            src={author.avatar}
                            alt={author.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <Image
                            src="https://assets.mymaiyah.id/wp-content/uploads/2026/02/MAIYAH-PIC.jpeg"
                            alt={author.name}
                            fill
                            className="object-cover"
                        />
                    )}
                </div>
            </div>

            {/* Info Penulis */}
            <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                        {author.name}
                    </h3>
                    {author.simpul && (
                        <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-maiyah-blue)] bg-blue-50 dark:bg-blue-900/30 rounded-full">
                            {author.simpul}
                        </span>
                    )}
                </div>

                {author.bio && (
                    <div
                        className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-serif mb-4 line-clamp-3 md:line-clamp-none"
                        dangerouslySetInnerHTML={{ __html: author.bio }}
                    />
                )}

                {/* Social Media Links */}
                {author.socialMedia && author.socialMedia.length > 0 && (
                    <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                        {author.socialMedia.map((social, idx) => (
                            <Link
                                key={idx}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-white/10 text-gray-500 hover:text-white hover:bg-[var(--color-maiyah-red)] transition-all shadow-sm text-xs font-bold"
                                title={social.platform}
                            >
                                {getSocialIcon(social.platform)}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
