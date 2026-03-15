'use client';

import React, { useEffect, useState } from 'react';
import { DayAvailability, Vehicle } from '../../data/models';

interface CalendarViewProps {
    availability: DayAvailability[];
    selectedDates: Date[];
    onDateSelect: (date: Date) => void;
    maxSelections?: number;
    className?: string;
    isCalendarEnabled?: boolean;
    selectedVehicle?: Vehicle | null;
    selectedLocation?: string;
    allVehicles?: Vehicle[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    availability,
    selectedDates,
    onDateSelect,
    maxSelections = 3,
    className = '',
    isCalendarEnabled = false,
    selectedVehicle,
    selectedLocation,
    allVehicles = [],
}) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Detect theme changes
    useEffect(() => {
        const checkTheme = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
        };

        // Check initial theme
        checkTheme();

        // Listen for theme changes
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);
    // Check if date is within booking window
    const isInBookingWindow = (date: Date) => {
        const today = new Date();
        const windowEnd = new Date(today);
        windowEnd.setDate(today.getDate() + 13); // 14 days including today

        // Normalize all dates to midnight for proper comparison
        const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const normalizedWindowEnd = new Date(
            windowEnd.getFullYear(),
            windowEnd.getMonth(),
            windowEnd.getDate()
        );
        const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        return normalizedDate >= normalizedToday && normalizedDate <= normalizedWindowEnd;
    };

    // Get availability status for a date
    const getDayStatus = (date: Date) => {
        const dayAvailability = availability.find(
            (day) => day.date.toDateString() === date.toDateString()
        );

        if (!dayAvailability) return 'unavailable';

        // If no vehicle/location selected, show raw availability from mock data
        if (!selectedVehicle || !selectedLocation) {
            return dayAvailability.status;
        }

        // Check if ANY vehicle of the same type has the selected location
        const vehiclesOfSameType = allVehicles.filter(
            (vehicle) => vehicle.type === selectedVehicle.type
        );
        const isVehicleTypeAtLocation = vehiclesOfSameType.some((vehicle) =>
            vehicle.locations.includes(selectedLocation)
        );
        if (!isVehicleTypeAtLocation) return 'unavailable';

        // Check if there are available time slots for this day
        const availableSlots = dayAvailability.timeSlots.filter((slot) => slot.available);
        if (availableSlots.length === 0) return 'unavailable';

        return dayAvailability.status;
    };

    // Check if a date is selected
    const isDateSelected = (date: Date) => {
        return selectedDates.some((selected) => selected.toDateString() === date.toDateString());
    };

    // Generate continuous calendar days covering current month and next month overlap
    const generateContinuousCalendarDays = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Get first day of current month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

        // Calculate start of first week (Sunday)
        const startOfWeek = new Date(firstDayOfMonth);
        startOfWeek.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

        // Calculate end of 14-day booking window
        const windowEnd = new Date(today);
        windowEnd.setDate(today.getDate() + 13);

        // Ensure we have enough weeks to cover the 14-day window
        let daysNeeded = 42; // Default 6 weeks
        const daysFromStartToWindowEnd = Math.ceil(
            (windowEnd.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysFromStartToWindowEnd > 42) {
            daysNeeded = Math.ceil(daysFromStartToWindowEnd / 7) * 7; // Round up to full weeks
        }

        // Generate calendar days
        const days: Date[] = [];
        const startDate = new Date(startOfWeek);

        for (let i = 0; i < daysNeeded; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date);
        }

        return days;
    };

    // Create custom tile content for continuous calendar
    const renderCustomCalendar = () => {
        const calendarDays = generateContinuousCalendarDays();
        const weekDayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div
                className={`react-calendar-custom ${isDarkMode ? 'react-calendar-dark' : 'react-calendar-light'}`}
            >
                <div
                    className="calendar-container"
                    style={{
                        border: '1px solid',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        borderColor: isDarkMode ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)',
                    }}
                >
                    {/* Week day headers */}
                    <div
                        className="react-calendar__month-view__weekdays calendar-grid"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
                    >
                        {weekDayHeaders.map((day, index) => (
                            <div
                                key={index}
                                style={{
                                    textAlign: 'center',
                                    padding: '0.5rem',
                                    fontWeight: 'medium',
                                    fontSize: '0.875rem',
                                }}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days grid */}
                    <div
                        className="react-calendar__month-view__days calendar-grid"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
                    >
                        {calendarDays.map((date, index) => {
                            const status = getDayStatus(date);
                            const isSelected = isDateSelected(date);
                            const inWindow = isInBookingWindow(date);
                            const isToday = date.toDateString() === new Date().toDateString();
                            const isCurrentMonth = date.getMonth() === new Date().getMonth();
                            const isDisabled =
                                !isCalendarEnabled || status === 'unavailable' || !inWindow;

                            const tileClasses = [
                                'react-calendar__tile',
                                !inWindow ? 'react-calendar__tile--disabled' : '',
                                !isCurrentMonth ? 'react-calendar__tile--neighboringMonth' : '',
                                isSelected ? 'react-calendar__tile--active' : '',
                                isToday && inWindow ? 'react-calendar__tile--now' : '',
                            ]
                                .filter(Boolean)
                                .join(' ');

                            return (
                                <button
                                    key={index}
                                    className={`${tileClasses} calendar-day`}
                                    onClick={() => !isDisabled && handleDateClick(date)}
                                    disabled={isDisabled}
                                    style={{
                                        padding: '0.25rem',
                                        border: '1px solid',
                                        borderRadius: '0.375rem',
                                        height: '80px',
                                        position: 'relative',
                                        backgroundColor: isDarkMode ? 'rgb(17, 24, 39)' : 'white',
                                        borderColor: isDarkMode
                                            ? 'rgb(55, 65, 81)'
                                            : 'rgb(229, 231, 235)',
                                        color: isDarkMode
                                            ? 'rgb(243, 244, 246)'
                                            : 'rgb(17, 24, 39)',
                                        opacity: !inWindow ? 0.3 : !isCurrentMonth ? 0.6 : 1,
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                                            {date.getDate()}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                                            {date.toLocaleDateString('en-US', { month: 'short' })}
                                        </div>
                                        {isToday && (
                                            <div
                                                style={{
                                                    fontSize: '0.625rem',
                                                    color: isDarkMode ? '#60a5fa' : '#2563eb',
                                                    fontWeight: 'medium',
                                                    lineHeight: 1,
                                                }}
                                            >
                                                Today
                                            </div>
                                        )}
                                    </div>

                                    {/* Availability indicator */}
                                    {inWindow &&
                                        isCalendarEnabled &&
                                        (status === 'high' ||
                                            status === 'limited' ||
                                            status === 'booked') && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '2px',
                                                    right: '2px',
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    backgroundColor:
                                                        status === 'high'
                                                            ? '#22c55e'
                                                            : status === 'limited'
                                                              ? '#f59e0b'
                                                              : '#ef4444',
                                                }}
                                            />
                                        )}

                                    {/* Selection indicator */}
                                    {isSelected && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '2px',
                                                right: '2px',
                                                width: '16px',
                                                height: '16px',
                                                backgroundColor: '#3b82f6',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <svg
                                                width="8"
                                                height="8"
                                                fill="white"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Handle date click
    const handleDateClick = (value: Date) => {
        if (!value || !isCalendarEnabled) return;

        const date = value;
        const inWindow = isInBookingWindow(date);
        if (!inWindow) return;

        const status = getDayStatus(date);
        if (status === 'unavailable') return;

        // Check if already selected
        const isSelected = isDateSelected(date);
        if (isSelected) {
            // Deselect
            onDateSelect(date);
        } else if (selectedDates.length < maxSelections) {
            // Select if under limit
            onDateSelect(date);
        }
    };

    return (
        <div className={`calendar-wrapper ${className}`}>
            {renderCustomCalendar()}

            {/* Legend */}
            {isCalendarEnabled && (
                <div className="mt-4 space-y-2">
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-900 dark:text-gray-300">Available</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-gray-900 dark:text-gray-300">Limited</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-gray-900 dark:text-gray-300">Booked</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
