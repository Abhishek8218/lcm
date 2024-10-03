'use client';
import React, { useState, useRef, useEffect } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isToday, parse } from 'date-fns';
import AgendaModal from './agendaModal';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

type AgendaItem = {
    date: Date;
    agendas: { title: string; time?: string; isAllDay?: boolean }[];
};

const EventCalendar = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 })); // Week starts on Monday
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    
    const parseDateFromApi = (dateString: string) => {
        return parse(dateString, 'dd-MM-yyyy', new Date());
    };

    const demoAgendas: AgendaItem[] = [
        { date: parseDateFromApi('15-09-2024'), agendas: [{ title: 'Meeting with John', time: '10:00 AM' }, { title: 'Lunch with client', time: '12:30 PM' }, { title: 'Project deadline', time: 'End of day' }, { title: 'Prepare presentation', time: '3:00 PM' }] },
        { date: parseDateFromApi('16-09-2024'), agendas: [{ title: 'Project deadline', time: 'End of day' }, { title: 'Prepare presentation', time: '3:00 PM' }] },
        { date: parseDateFromApi('17-09-2024'), agendas: [{ title: 'Client presentation', time: '11:00 AM' }] },
        { date: parseDateFromApi('18-09-2024'), agendas: [{ title: 'Review feedback', time: '4:00 PM' }, { title: 'Team building activity', time: '2:00 PM' }] },
        { date: parseDateFromApi('19-09-2024'), agendas: [{ title: 'Weekly review', time: '9:00 AM' }] },
        { date: parseDateFromApi('20-09-2024'), agendas: [{ title: 'Company event', time: '6:00 PM' }, { title: 'Networking session', time: '8:00 PM' }] },
    ];

    const handleWeekChange = (increment: boolean) => {
        setCurrentWeekStart(prevDate => {
            const newDate = increment ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1);
            return newDate;
        });
    };

    const handleDateSelection = (date: Date) => {
        setSelectedDate(date);
        setCurrentWeekStart(startOfWeek(date, { weekStartsOn: 1 })); // Week starts on Monday
    };

    const preloadWeeks = () => {
        const currentWeek = currentWeekStart;
        const previousWeek = subWeeks(currentWeekStart, 1);
        const nextWeek = addWeeks(currentWeekStart, 1);
        return [previousWeek, currentWeek, nextWeek];
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;

            if (scrollLeft === 0) {
                setCurrentWeekStart(prevDate => subWeeks(prevDate, 1));
            } else if (scrollLeft + clientWidth >= scrollRef.current.scrollWidth) {
                setCurrentWeekStart(prevDate => addWeeks(prevDate, 1));
            }
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.clientWidth; // Center the scroll on load
        }
    }, [currentWeekStart]);

    const getAgendasForDate = (date: Date) => {
        return demoAgendas.find(agenda => agenda.date.toDateString() === date.toDateString())?.agendas || [];
    };

    return (
        <div className="w-full min-h-[100dvh] select-none">
            <div className="flex justify-between items-center mb-4 bg-main px-2 border-b border-gray-400 py-4">
                <div className=' hover:bg-blue-500 hover:rounded-full p-2'>
                    <ArrowLeft className="w-6 h-6 text-white" onClick={() => router.push("/")} />
                </div>
                <span className="text-base font-semibold text-white">
                    {format(currentWeekStart, 'MMMM yyyy')}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleWeekChange(false)}
                        className="p-2 text-white hover:bg-blue-500 rounded-full"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button className='text-white' onClick={() => handleDateSelection(new Date())}>Today</button>
                    <button
                        onClick={() => handleWeekChange(true)}
                        className="p-2 text-white hover:bg-blue-500 rounded-full"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>

            {/* Updated Weekday labels starting from Monday */}
            <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs font-medium border-b border-gray-300 pb-1 pt-2 px-[10px]">
                <div className="text-gray-700">MON</div>
                <div className="text-gray-700">TUE</div>
                <div className="text-gray-700">WED</div>
                <div className="text-gray-700">THU</div>
                <div className="text-gray-700">FRI</div>
                <div className="text-gray-700">SAT</div>
                <div className="text-gray-700">SUN</div>
            </div>

            <div
                className="flex overflow-x-auto no-scrollbar"
                ref={scrollRef}
                onScroll={handleScroll}
                style={{ scrollSnapType: 'x mandatory', whiteSpace: 'nowrap' }}
            >
                {preloadWeeks().map((weekStart, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-7 gap-1 min-w-full no-scrollbar mb-4 p-[10px]"
                        style={{ scrollSnapAlign: 'center' }}
                    >
                        {Array.from({ length: 7 }, (_, i) => {
                            const date = addDays(weekStart, i);
                            return (
                                <div
                                    key={i}
                                    className={`p-2 text-center text-[16px] rounded-full cursor-pointer transition duration-150 ${
                                        date.toDateString() === selectedDate.toDateString()
                                            ? 'bg-blue-500 text-white'
                                            : isToday(date)
                                            ? 'bg-blue-200 text-blue-800'
                                            : 'text-black'
                                    }`}
                                    onClick={() => setSelectedDate(date)}
                                >
                                    {date.getDate()}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Use the AgendaModal component */}
            <AgendaModal selectedDate={selectedDate} getAgendasForDate={getAgendasForDate} />
        </div>
    );
};

export default EventCalendar;
