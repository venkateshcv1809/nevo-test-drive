'use client';
import React, { useMemo, useRef } from 'react';
import { useVehicleAvailability } from '../../hooks/useVehicles';
import { useNevoStore } from '../../stores/nevoStore';
import { formatDate } from '../../lib/util';

export const TimeSlotSelector: React.FC = () => {
    const {
        interestedDates,
        selectedDateTime,
        selectedLocationId,
        selectedVehicleType,
        selectedTimeSlot,
        setSelectedDateTime,
        setSelectedTimeSlot,
    } = useNevoStore();

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const selectedDatesStrings = useMemo(() => {
        return interestedDates.map(formatDate);
    }, [interestedDates]);

    const { data: availabilityData } = useVehicleAvailability(
        selectedVehicleType || null,
        selectedLocationId || null,
        selectedDatesStrings
    );

    const allTimeLabels = useMemo(() => {
        const labels = new Set<string>();
        availabilityData?.forEach((day) => {
            day.timeSlots.forEach((slot) => labels.add(slot.displayTime || slot.time));
        });
        return Array.from(labels).sort();
    }, [availabilityData]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!availabilityData || availabilityData.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 italic">
                Please select dates in the calendar to view available time slots.
            </div>
        );
    }

    return (
        <div className="relative group">
            <div
                ref={scrollContainerRef}
                className="overflow-x-auto pb-4 no-scrollbar"
                style={{ scrollbarWidth: 'none' }}
            >
                <div className="inline-block min-w-full">
                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns: `140px repeat(${allTimeLabels.length}, 110px)`,
                            gap: '0.75rem',
                        }}
                    >
                        <div className="h-12 flex items-center font-bold text-gray-400 sticky left-0 bg-white dark:bg-gray-900 z-10 pr-4 border-b border-gray-100 dark:border-gray-800">
                            Date
                        </div>
                        {allTimeLabels.map((label) => (
                            <div
                                key={label}
                                className="h-12 flex flex-col items-center justify-center border-b border-gray-100 dark:border-gray-800"
                            >
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    {label}
                                </span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                                    45 min
                                </span>
                            </div>
                        ))}

                        {availabilityData?.map((day) => (
                            <React.Fragment key={day.date}>
                                <div className="h-14 flex items-center sticky left-0 bg-white dark:bg-gray-900 z-10 pr-4 font-medium text-gray-900 dark:text-white border-b border-gray-50 dark:border-gray-800">
                                    {new Date(day.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </div>

                                {allTimeLabels.map((label) => {
                                    const slot = day.timeSlots.find(
                                        (s) => (s.displayTime || s.time) === label
                                    );
                                    const isSelected =
                                        selectedTimeSlot?.time === slot?.time &&
                                        selectedDateTime?.split('T')[0] === day.date;

                                    return (
                                        <div
                                            key={`${day.date}-${label}`}
                                            className="h-14 flex items-center justify-center"
                                        >
                                            {slot ? (
                                                <button
                                                    onClick={() => {
                                                        if (slot.available) {
                                                            setSelectedTimeSlot(slot);
                                                            setSelectedDateTime(slot.time);
                                                        }
                                                    }}
                                                    disabled={!slot.available}
                                                    className={`
                                                        w-full py-2 text-[11px] font-bold rounded-lg border transition-all
                                                        ${
                                                            !slot.available
                                                                ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 border-transparent cursor-not-allowed'
                                                                : isSelected
                                                                  ? 'bg-primary text-white border-primary shadow-md scale-105'
                                                                  : 'bg-white dark:bg-gray-900 text-success border-success/30 hover:border-success hover:bg-success/5'
                                                        }
                                                    `}
                                                >
                                                    {slot.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                                                </button>
                                            ) : (
                                                <span className="text-gray-200 dark:text-gray-800">
                                                    —
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-[130px] top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronRightIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

const ChevronLeftIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);
const ChevronRightIcon = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);
