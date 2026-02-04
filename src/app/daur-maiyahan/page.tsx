import { getAgendas } from "@/lib/api";
import CalendarWidget from "@/components/features/agenda/CalendarWidget";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Daur Maiyahan - Kalender Agenda",
    description: "Jadwal lengkap acara Maiyah, Sinau Bareng, dan kegiatan simpul Maiyah di seluruh dunia.",
};

export default async function DaurMaiyahanPage() {
    let agendas = [];
    try {
        agendas = await getAgendas();
    } catch (error) {
        console.error("Failed to fetch agendas:", error);
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Header / Hero */}
            <section className="bg-white dark:bg-gray-950 pt-24 pb-12 px-6 text-center border-b border-gray-100 dark:border-white/5">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Daur Maiyahan
                </h1>
                <p className="max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
                    Menelusuri jejak waktu dan ruang, merajut silaturahmi dalam setiap simpul pertemuan Maiyah.
                </p>
            </section>

            {/* Calendar Section */}
            <section className="container mx-auto px-4 -mt-8 relative z-10">
                <CalendarWidget agendas={agendas} />
            </section>

            {/* Additional Info / Legend (Optional) */}
            <section className="container mx-auto px-4 mt-12 text-center">
                <div className="inline-flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[var(--color-maiyah-blue)]"></span>
                        Agenda Tersedia
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[var(--color-maiyah-red)]"></span>
                        Hari Dipilih
                    </span>
                </div>
            </section>
        </main>
    );
}
