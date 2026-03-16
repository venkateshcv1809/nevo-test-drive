import React from 'react';
import { useBookingStore } from '../../stores/bookingStore';

export const BookingSummary: React.FC = () => {
    const { selectedVehicle, selectedLocation, selectedTimeSlotWithDate } = useBookingStore();

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Booking Summary
            </h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Vehicle:</span>
                    <span className="text-gray-900 dark:text-white">
                        {selectedVehicle ? selectedVehicle.name : 'Not selected'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="text-gray-900 dark:text-white">
                        {selectedLocation || 'Not selected'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="text-gray-900 dark:text-white">
                        {selectedTimeSlotWithDate
                            ? formatDate(selectedTimeSlotWithDate.date)
                            : 'Not selected'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time:</span>
                    <span className="text-gray-900 dark:text-white">
                        {selectedTimeSlotWithDate
                            ? formatTime(selectedTimeSlotWithDate.timeSlot.time)
                            : 'Not selected'}
                    </span>
                </div>
            </div>
        </div>
    );
};
