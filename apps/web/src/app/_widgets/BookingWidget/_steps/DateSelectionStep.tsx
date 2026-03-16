'use client';
import React, { useMemo } from 'react';
import { Calendar } from '../../../../components/ui/Calendar';
import { useBookingStore } from '../../../../stores/bookingStore';
import { useVehicles } from '../../../../hooks/useVehicles';

export const DateSelectionStep = () => {
    const { data: vehicles } = useVehicles();

    const { selectedVehicle, selectedLocation, selectedDates, toggleDateSelection } =
        useBookingStore();

    const availableDays = useMemo(() => {
        if (selectedVehicle && selectedLocation && vehicles) {
            const vehicleData = vehicles[selectedVehicle];
            const locationData = vehicleData?.locations[selectedLocation];
            return locationData?.availableDays || [];
        }
        return [];
    }, [selectedVehicle, selectedLocation, vehicles]);

    const isCalendarEnabled = selectedVehicle && selectedLocation && availableDays.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <label className="text-md font-semibold text-gray-900 dark:text-white">
                    Select Available Dates
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                    Choose up to 3 dates to compare time slots
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Calendar
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800"
                    isCalendarEnabled={!!isCalendarEnabled}
                    availableDays={availableDays}
                    selectedDates={selectedDates}
                    onDateSelect={toggleDateSelection}
                />
            </div>
        </div>
    );
};
