"use client";

import { useState } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    parseISO
} from "date-fns";
import { id } from "date-fns/locale"; // Indonesian locale
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import EventCard from "./EventCard";

interface AgendaItem {
    id: string;
    title: string;
    slug: string;
    agendaDetails: {
        tanggalEvent: string; // Y-m-d H:i:s
        lokasi: string;
        jenisAcara?: string;
    }
}

export default function CalendarWidget({ agendas = [] }: { agendas?: AgendaItem[] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Calendar Generation Logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"]; // Custom or from date-fns

    // Navigation
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // Filter Agendas
    // 1. For dots on calendar
    const getEventsForDay = (date: Date) => {
        return agendas.filter(agenda => {
            const agendaDate = parseISO(agenda.agendaDetails.tanggalEvent);
            return isSameDay(agendaDate, date);
        });
    };

    // 2. For list below (Selected Date)
    const selectedEvents = agendas.filter(agenda => {
        const agendaDate = parseISO(agenda.agendaDetails.tanggalEvent);
        return isSameDay(agendaDate, selectedDate);
    });

    // 3. Fallback: If no date selected (or no events on selected date), maybe show all events in this month?
    // Let's stick to selected date first, if empty show message.

    return (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header / Top Bar */}
            <div className="bg-[var(--color-maiyah-blue)] p-6 text-white relative overflow-hidden">
                {/* Background Pattern Mock */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-pattern.png')]"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => window.history.back()} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-bold">Kalender Maiyah</h2>
                        <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                            <MagnifyingGlassIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* View Switcher (Mock) */}
                    <div className="flex bg-black/20 rounded-full p-1 mb-6 text-xs font-medium">
                        <button className="flex-1 py-1.5 rounded-full hover:bg-white/10 text-white/70">Hari</button>
                        <button className="flex-1 py-1.5 rounded-full hover:bg-white/10 text-white/70">Minggu</button>
                        <button className="flex-1 py-1.5 bg-white text-[var(--color-maiyah-blue)] shadow-md rounded-full">Bulan</button>
                        <button className="flex-1 py-1.5 rounded-full hover:bg-white/10 text-white/70">Tahun</button>
                    </div>

                    {/* Month Navigator */}
                    <div className="flex items-center justify-between px-4">
                        <button onClick={prevMonth} className="text-white/70 hover:text-white">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold">{format(currentMonth, "MMMM", { locale: id })}</h3>
                            <p className="text-white/60">{format(currentMonth, "yyyy")}</p>
                        </div>
                        <button onClick={nextMonth} className="text-white/70 hover:text-white">
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
                <div className="grid grid-cols-7 mb-4">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-xs font-bold text-gray-400 py-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2">
                    {calendarDays.map((day, idx) => {
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = isSameDay(day, selectedDate);
                        const isToday = isSameDay(day, new Date());
                        const dayEvents = getEventsForDay(day);
                        const hasEvents = dayEvents.length > 0;

                        return (
                            <div key={day.toString()} className="flex flex-col items-center justify-center p-1 relative">
                                <button
                                    onClick={() => setSelectedDate(day)}
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all relative
                                        ${isSelected
                                            ? "bg-[var(--color-maiyah-red)] text-white shadow-lg scale-110"
                                            : isToday
                                                ? "bg-blue-50 text-[var(--color-maiyah-blue)] font-bold border border-blue-100"
                                                : isCurrentMonth
                                                    ? "text-gray-700 hover:bg-gray-50"
                                                    : "text-gray-300 pointer-events-none"
                                        }
                                    `}
                                >
                                    {format(day, "d")}

                                    {/* Event Dot */}
                                    {hasEvents && !isSelected && (
                                        <span className="absolute bottom-1.5 w-1 h-1 bg-[var(--color-maiyah-blue)] rounded-full"></span>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Agenda List */}
            <div className="px-6 pb-8 bg-gray-50/50 min-h-[300px]">
                <h3 className="text-gray-900 font-bold mb-4 mt-2">Agenda Kegiatan</h3>

                <div className="space-y-3">
                    {selectedEvents.length > 0 ? (
                        selectedEvents.map((agenda) => (
                            <EventCard
                                key={agenda.id}
                                title={agenda.title}
                                date={agenda.agendaDetails.tanggalEvent}
                                location={agenda.agendaDetails.lokasi}
                                type={agenda.agendaDetails.jenisAcara || "Acara"}
                                slug={agenda.slug}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-sm">Tidak ada agenda pada tanggal ini.</p>
                            <button
                                onClick={() => setSelectedDate(new Date())}
                                className="mt-2 text-[var(--color-maiyah-blue)] text-xs font-bold hover:underline"
                            >
                                Kembali ke Hari Ini
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
