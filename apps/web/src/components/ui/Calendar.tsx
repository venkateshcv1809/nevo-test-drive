'use client';

import React, { useEffect, useMemo } from 'react';

interface CalendarProps {
    selectedDates: Date[];
    onDateSelect: (date: Date) => void;
    maxSelections?: number;
    className?: string;
    isCalendarEnabled?: boolean;
    availableDays?: string[];
}

export const Calendar: React.FC<CalendarProps> = ({
    selectedDates,
    onDateSelect,
    maxSelections = 3,
    className = '',
    isCalendarEnabled = false,
    availableDays = [],
}) => {
    useEffect(() => {
        if (isCalendarEnabled && availableDays.length > 0) {
            selectedDates.forEach((date) => {
                const dayName = date
                    .toLocaleDateString('en-US', { weekday: 'short' })
                    .toUpperCase();
                if (!availableDays.includes(dayName)) {
                    onDateSelect(date);
                }
            });
        }
    }, [availableDays, isCalendarEnabled, selectedDates, onDateSelect]);

    const isInBookingWindow = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const windowEnd = new Date(today);
        windowEnd.setDate(today.getDate() + 13);
        const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return target >= today && target <= windowEnd;
    };

    const isDateSelected = (date: Date) =>
        selectedDates.some((s) => s.toDateString() === date.toDateString());

    const calendarDays = useMemo(() => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        start.setDate(start.getDate() - start.getDay());
        return Array.from({ length: 42 }).map((_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    }, []);

    const isAtMax = selectedDates.length >= maxSelections;

    const renderDayTile = (date: Date, index: number) => {
        const isSelected = isDateSelected(date);
        const inWindow = isInBookingWindow(date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const isDayAvailable = availableDays.includes(dayName);

        const isUnavailable = !isDayAvailable || !isCalendarEnabled;
        const isDisabled = !inWindow || (!isSelected && (isUnavailable || isAtMax));

        const getDotColor = () => {
            if (isSelected) return 'bg-white';
            if (isUnavailable || (isAtMax && !isSelected)) return 'bg-red-500';
            return 'bg-green-500';
        };

        return (
            <button
                key={index}
                disabled={isDisabled}
                onClick={() => onDateSelect(date)}
                className={`relative h-20 border rounded-md transition-all flex flex-col items-center justify-center
                    ${isSelected ? 'bg-blue-600 border-blue-700 text-white shadow-md z-10' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100'}
                    ${isDisabled ? 'cursor-not-allowed' : 'hover:border-blue-400'}
                    ${!inWindow ? 'opacity-30' : date.getMonth() !== new Date().getMonth() ? 'opacity-60' : 'opacity-100'}
                `}
            >
                <span className="font-bold text-sm">{date.getDate()}</span>
                <span className="text-[10px] uppercase opacity-70">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                </span>
                {inWindow && (
                    <div
                        className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${getDotColor()}`}
                    />
                )}
            </button>
        );
    };

    return (
        <div className={`calendar-wrapper ${className}`}>
            <div className="border rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                        <div
                            key={d}
                            className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
                        >
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 p-2 gap-2">
                    {calendarDays.map((date, i) => renderDayTile(date, i))}
                </div>

                <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                Available
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                {isAtMax ? 'Limit Reached' : 'Unavailable'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                Selected
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
