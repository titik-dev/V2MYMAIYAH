import { CalendarIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface EventCardProps {
    title: string;
    date: string;
    location: string;
    type?: string;
    slug: string;
}

export default function EventCard({ title, date, location, type = "Acara Utama", slug }: EventCardProps) {
    // Parse date string (Y-m-d H:i:s)
    const eventDate = new Date(date);
    const day = format(eventDate, "d", { locale: id });
    const month = format(eventDate, "MMM", { locale: id }); // e.g. Jan, Feb
    const time = format(eventDate, "HH:mm", { locale: id }) + " WIB";
    const dayName = format(eventDate, "EEE", { locale: id }).toUpperCase(); // SEN, SEL

    return (
        <div className="flex bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            {/* Left: Date Badge */}
            <div className="w-20 md:w-24 bg-gray-50 flex flex-col items-center justify-center border-r border-gray-100 flex-shrink-0 group-hover:bg-[var(--color-maiyah-blue)] group-hover:text-white transition-colors">
                <span className="text-2xl md:text-3xl font-bold">{day}</span>
                <span className="text-xs md:text-sm font-medium uppercase">{dayName}</span>
            </div>

            {/* Right: Content */}
            <div className="flex-1 p-4 flex flex-col justify-center">
                <div className="mb-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-blue-50 text-[var(--color-maiyah-blue)] font-bold uppercase tracking-wider">
                        {type}
                    </span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-[var(--color-maiyah-blue)] transition-colors line-clamp-2">
                    <Link href={`/agenda/${slug}`}>
                        {title}
                    </Link>
                </h3>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4" />
                        <span>{time}</span>
                    </div>
                    {location && (
                        <div className="flex items-center gap-1.5">
                            <MapPinIcon className="w-4 h-4" />
                            <span className="line-clamp-1">{location}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
