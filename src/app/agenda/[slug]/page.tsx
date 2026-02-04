import { getAgendaBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, MapPinIcon, TagIcon } from "@heroicons/react/24/outline";

export default async function AgendaDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const agenda = await getAgendaBySlug(slug);

    if (!agenda) {
        notFound();
    }

    // Parse date safely
    let formattedDate = agenda.agendaDetails?.tanggalEvent;
    try {
        if (formattedDate) {
            const dateObj = new Date(formattedDate);
            if (!isNaN(dateObj.getTime())) {
                formattedDate = format(dateObj, "EEEE, d MMMM yyyy - HH:mm 'WIB'", { locale: id });
            }
        }
    } catch (e) {
        console.error("Date parsing error", e);
    }

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="bg-slate-900 text-white p-6 md:p-10 relative overflow-hidden min-h-[300px] flex flex-col justify-end">
                    {/* Background Image or Icon */}
                    {agenda.featuredImage?.node?.sourceUrl ? (
                        <>
                            <img
                                src={agenda.featuredImage.node.sourceUrl}
                                alt={agenda.featuredImage.node.altText || agenda.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                        </>
                    ) : (
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                            <CalendarIcon className="w-64 h-64" />
                        </div>
                    )}

                    <div className="relative z-10 mt-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 text-blue-200 text-sm font-medium mb-4 backdrop-blur-sm border border-blue-500/30">
                            <TagIcon className="w-4 h-4" />
                            {agenda.agendaDetails?.jenisAcara || "Agenda Maiyah"}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold font-serif leading-tight mb-6">
                            {agenda.title}
                        </h1>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-slate-300">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-blue-400" />
                                <span>{formattedDate || "Waktu belum ditentukan"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-red-400" />
                                <span>{agenda.agendaDetails?.lokasi || "Lokasi belum ditentukan"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-10">
                    <div
                        className="prose prose-lg max-w-none prose-headings:font-serif prose-a:text-blue-600 hover:prose-a:text-blue-800"
                        dangerouslySetInnerHTML={{ __html: agenda.content }}
                    />

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                        <a
                            href="/daur-maiyahan"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                        >
                            &larr; Kembali ke Kalender
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
