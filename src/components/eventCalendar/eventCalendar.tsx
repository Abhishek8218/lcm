'use client';
import React, { useState, useRef, useEffect } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isToday, parse } from 'date-fns';
import {  ChevronLeft, ChevronRight } from 'lucide-react';

import AgendaCard from './agendaModal';

// Define types for agenda items
export type AgendaItem = {
    date: Date;
    caseInfo: {
        caseID: string;
        customer: string;
        tenure: number;
        amount: number;
        paymentHealth: string;
        frequency: string;
        status: string;
    }[];
};

// Main EventCalendar component
const EventCalendar = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 })); // Week starts on Monday
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const scrollRef = useRef<HTMLDivElement>(null);


    // Helper function to parse date strings
    const parseDateFromApi = (dateString: string) => {
        return parse(dateString, 'dd-MM-yyyy', new Date());
    };

    // Sample agenda data
    const demoAgendas: AgendaItem[] = [
        { 
            date: parseDateFromApi('07-10-2024'), 
            caseInfo: [
                { caseID: "123", customer: "John Doe", tenure: 12, amount: 10000, paymentHealth: "Good", frequency: "Monthly", status: "Active" },
                { caseID: "124", customer: "Jane Smith", tenure: 6, amount: 5000, paymentHealth: "Fair", frequency: "Quarterly", status: "Active" }
            ]
        },
        { 
            date: parseDateFromApi('08-10-2024'), 
            caseInfo: [
                { caseID: "125", customer: "Alex Brown", tenure: 10, amount: 8000, paymentHealth: "Poor", frequency: "Monthly", status: "Pending" }
            ]
        },
        { 
            date: parseDateFromApi('18-09-2024'), 
            caseInfo: [
                { caseID: "126", customer: "Chris Green", tenure: 8, amount: 7000, paymentHealth: "Good", frequency: "Annually", status: "Completed" }
            ]
        },
        { 
            date: parseDateFromApi('19-09-2024'), 
            caseInfo: [
                { caseID: "127", customer: "Lisa White", tenure: 5, amount: 3000, paymentHealth: "Good", frequency: "Monthly", status: "Active" }
            ]
        }
    ];

    // Handle week navigation
    const handleWeekChange = (increment: boolean) => {
        setCurrentWeekStart(prevDate => increment ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1));
    };

    // Handle date selection
    const handleDateSelection = (date: Date) => {
        setSelectedDate(date);
        setCurrentWeekStart(startOfWeek(date, { weekStartsOn: 1 }));
    };

    // Preload surrounding weeks
    const preloadWeeks = () => {
        const currentWeek = currentWeekStart;
        const previousWeek = subWeeks(currentWeekStart, 1);
        const nextWeek = addWeeks(currentWeekStart, 1);
        return [previousWeek, currentWeek, nextWeek];
    };

    // Handle horizontal scroll for the week
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

    // Get agendas for the selected date
    const getAgendasForDate = (date: Date) => {
        return demoAgendas.find(agenda => agenda.date.toDateString() === date.toDateString())?.caseInfo || [];
    };

    return (
        <div className="w-full min-h-[100dvh] select-none pt-14">
            <div className="flex justify-between items-center mb-4 bg-main px-4 border-b border-gray-400 pb-4">
            
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

            {/* Weekday labels */}  
            <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs font-medium border-b border-gray-300 pb-1 pt-2 px-[10px]">
                <div className="text-gray-700">MON</div>
                <div className="text-gray-700">TUE</div>
                <div className="text-gray-700">WED</div>
                <div className="text-gray-700">THU</div>
                <div className="text-gray-700">FRI</div>
                <div className="text-gray-700">SAT</div>
                <div className="text-gray-700">SUN</div>
            </div>

            {/* Calendar week view */}  
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

            {/* Pass full agenda data to AgendaModal */}
            <AgendaCard caseInfo={getAgendasForDate(selectedDate)} selectedDate={selectedDate}  />

        </div>
    );
};

export default EventCalendar;
