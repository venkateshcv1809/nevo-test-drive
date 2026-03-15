import React from 'react';
import { DayAvailability, TimeSlot } from '../../data/models';
import { useBookingStore } from '../../stores/bookingStore';

interface TimeSlotSelectorProps {
    selectedDates: Date[];
    availability: DayAvailability[];
    onTimeSlotSelect: (date: Date, timeSlot: TimeSlot) => void;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
    selectedDates,
    availability,
    onTimeSlotSelect,
}) => {
    const { selectedTimeSlotWithDate, setSelectedTimeSlotWithDate } = useBookingStore();
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const handleSlotClick = (date: Date, timeSlot: TimeSlot) => {
        // Only allow one selection
        if (selectedTimeSlotWithDate) {
            // If clicking the same slot, deselect it
            if (
                selectedTimeSlotWithDate.date.toDateString() === date.toDateString() &&
                selectedTimeSlotWithDate.timeSlot.time === timeSlot.time
            ) {
                setSelectedTimeSlotWithDate(null);
                onTimeSlotSelect(date, { ...timeSlot, available: false });
            } else {
                // Select new slot
                setSelectedTimeSlotWithDate({ date, timeSlot });
                onTimeSlotSelect(date, timeSlot);
            }
        } else {
            // First selection
            setSelectedTimeSlotWithDate({ date, timeSlot });
            onTimeSlotSelect(date, timeSlot);
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    // Sort selected dates in ascending order
    const sortedSelectedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());

    // Get all unique time slots across all dates
    const allTimeSlots = React.useMemo(() => {
        const timeSet = new Set<string>();
        sortedSelectedDates.forEach((date) => {
            const dayAvailability = availability.find(
                (day) => day.date.toDateString() === date.toDateString()
            );
            if (dayAvailability) {
                dayAvailability.timeSlots.forEach((slot) => timeSet.add(slot.time));
            }
        });
        return Array.from(timeSet).sort(); // Sort times chronologically
    }, [sortedSelectedDates, availability]);

    // Get border color based on slot status
    const getBorderColor = (slot: TimeSlot | null, isSelected: boolean) => {
        if (!slot) return 'border-gray-200 dark:border-gray-700';
        if (isSelected) return 'border-blue-500';
        if (!slot.available) return 'border-red-500'; // Booked
        return 'border-green-500'; // Available
    };

    // Get background color based on slot status
    const getBackgroundColor = (slot: TimeSlot | null, isSelected: boolean) => {
        if (!slot) return 'bg-gray-50 dark:bg-gray-800';
        if (isSelected) return 'bg-blue-500 text-white';
        if (!slot.available) return 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed'; // Booked
        return 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700';
    };

    return (
        <div className="space-y-4">
            {sortedSelectedDates.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Please select dates in the calendar to view available time slots
                </div>
            ) : (
                <div className="relative">
                    {/* Scrollable Container - Everything inside */}
                    <div
                        ref={scrollContainerRef}
                        className="overflow-x-auto pb-6"
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        <div className="inline-block min-w-full">
                            <div
                                className="grid"
                                style={{
                                    gridTemplateColumns: `150px repeat(${allTimeSlots.length}, 120px)`,
                                    gap: '1rem',
                                    paddingRight: '2rem',
                                }}
                            >
                                {/* Header Row */}
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 h-12 flex items-center border-b border-gray-100 dark:border-gray-800 sticky left-0 bg-white dark:bg-gray-900 z-10 pr-4">
                                    Date
                                </div>
                                {allTimeSlots.map((time) => (
                                    <div
                                        key={time}
                                        className="text-center h-12 flex items-center justify-center border-b border-gray-100 dark:border-gray-800"
                                    >
                                        <div className="px-3 py-1 text-xs rounded-md border border-transparent">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatTime(time)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                45 min
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Date Rows */}
                                {sortedSelectedDates.map((date) => {
                                    const dayAvailability = availability.find(
                                        (day) => day.date.toDateString() === date.toDateString()
                                    );

                                    if (
                                        !dayAvailability ||
                                        dayAvailability.status === 'unavailable'
                                    ) {
                                        return (
                                            <React.Fragment key={date.toDateString()}>
                                                <div className="font-medium text-gray-900 dark:text-white h-12 flex items-center sticky left-0 bg-white dark:bg-gray-900 z-10 pr-4 border-b border-gray-100 dark:border-gray-800">
                                                    {formatDate(date)}
                                                </div>
                                                {allTimeSlots.map((time) => (
                                                    <div
                                                        key={time}
                                                        className="text-center text-sm text-gray-500 dark:text-gray-400 h-12 flex items-center justify-center"
                                                    >
                                                        No availability
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        );
                                    }

                                    const slotsByTime = dayAvailability.timeSlots.reduce(
                                        (acc, slot) => {
                                            acc[slot.time] = slot;
                                            return acc;
                                        },
                                        {} as Record<string, TimeSlot>
                                    );

                                    return (
                                        <React.Fragment key={date.toDateString()}>
                                            <div className="font-medium text-gray-900 dark:text-white h-12 flex items-center sticky left-0 bg-white dark:bg-gray-900 z-10 pr-4 border-b border-gray-100 dark:border-gray-800">
                                                {formatDate(date)}
                                            </div>
                                            {allTimeSlots.map((time) => {
                                                const slot = slotsByTime[time];
                                                const isSelected =
                                                    selectedTimeSlotWithDate?.date.toDateString() ===
                                                        date.toDateString() &&
                                                    selectedTimeSlotWithDate?.timeSlot.time ===
                                                        time;

                                                return (
                                                    <div
                                                        key={time}
                                                        className="text-center h-12 flex items-center justify-center"
                                                    >
                                                        {slot ? (
                                                            <button
                                                                onClick={() =>
                                                                    slot.available &&
                                                                    handleSlotClick(date, slot)
                                                                }
                                                                disabled={!slot.available}
                                                                className={`
                                  px-3 py-1 text-xs rounded-md border transition-colors whitespace-nowrap
                                  ${getBackgroundColor(slot, isSelected)}
                                  ${getBorderColor(slot, isSelected)}
                                  ${!slot.available ? 'cursor-not-allowed' : 'cursor-pointer'}
                                `}
                                                            >
                                                                {slot.available
                                                                    ? 'Available'
                                                                    : 'Booked'}
                                                            </button>
                                                        ) : (
                                                            <div className="w-full px-2 py-2 text-sm text-center text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-md">
                                                                -
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Scroll Buttons - Outside scrollable container */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-[150px] top-1/2 -translate-y-1/2 -translate-x-2 z-20 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Scroll left"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Scroll right"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};
