import React from 'react';
import { format } from 'date-fns';

type AgendaItem = {
    title: string;
    time?: string;
    isAllDay?: boolean;  // Optional property to indicate all-day tasks
};

interface AgendaModalProps {
    selectedDate: Date;
    getAgendasForDate: (date: Date) => AgendaItem[];
}

const AgendaModal: React.FC<AgendaModalProps> = ({ selectedDate, getAgendasForDate }) => {
    const agendas = getAgendasForDate(selectedDate);

    // Sort agendas: All-day tasks first, then by time, then end-of-day tasks
    const sortedAgendas = agendas.sort((a, b) => {
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;

        if (a.time && b.time) {
            if (a.time === 'End of day' && b.time !== 'End of day') return 1;
            if (a.time !== 'End of day' && b.time === 'End of day') return -1;
            return a.time.localeCompare(b.time);
        }

        if (a.time) return -1;
        if (b.time) return 1;
        return 0;
    });

    return (
        <div className="inset-0 flex flex-col items-center justify-center z-50 mt-1 " >
                <h3 className="font-medium text-base mb-2 bg-gray-100  p-2 w-full border-y border-gray-400 text-center">
                  {format(selectedDate, 'MMMM dd, yyyy')}
                </h3>
            <div className="bg-white shadow-lg rounded-lg py-2  w-full min-h-[65vh] max-h-[350px] overflow-scroll custom-scrollbar">
                <div className="space-y-1 px-1">
                    {sortedAgendas.length > 0 ? (
                        sortedAgendas.map((agenda, index) => (
                            <div
                                key={index}
                                className="h-16  border-b border-gray-200 rounded px-2 flex flex-row justify-between items-center"
                            >
                                <div className="font-medium text-sm">{agenda.title}</div>
                                {agenda.time && <div className="text-gray-600 text-sm"> {agenda.time}</div>}
                            </div>
                        ))
                    ) : (
                        <div className="h-16 bg-gray-100 border border-gray-200 rounded p-2 text-center text-gray-500">
                            No agendas for this day
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgendaModal;
