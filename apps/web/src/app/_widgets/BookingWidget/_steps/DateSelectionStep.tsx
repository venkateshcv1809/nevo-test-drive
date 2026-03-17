'use client';
import React, { useMemo } from 'react';
import { Calendar } from '../../../../components/ui/Calendar';
import { useVehicles } from '../../../../hooks/useVehicles';
import { useNevoStore } from '../../../../stores/nevoStore';

export const DateSelectionStep = () => {
    const { data: vehicles } = useVehicles();

    const { interestedDates, selectedVehicleType, selectedLocationId, toggleDateSelection } =
        useNevoStore();

    const availableDays = useMemo(() => {
        if (selectedVehicleType && selectedLocationId && vehicles) {
            const vehicleData = vehicles[selectedVehicleType];
            const locationData = vehicleData?.locations[selectedLocationId];
            return locationData?.availableDays || [];
        }
        return [];
    }, [selectedVehicleType, selectedLocationId, vehicles]);

    const isCalendarEnabled = selectedVehicleType && selectedLocationId && availableDays.length > 0;

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
                    selectedDates={interestedDates}
                    onDateSelect={toggleDateSelection}
                />
            </div>
        </div>
    );
};
