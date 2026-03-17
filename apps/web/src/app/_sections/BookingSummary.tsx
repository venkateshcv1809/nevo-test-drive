import React from 'react';
import { useNevoStore } from '../../stores/nevoStore';
import { formatReadableDate, formatReadableTime } from '../../lib/util';

export const BookingSummary: React.FC = () => {
    const { selectedVehicleName, selectedLocation, selectedDateTime } = useNevoStore();

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Booking Summary
            </h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Vehicle:</span>
                    <span className="text-gray-900 dark:text-white">
                        {selectedVehicleName ? selectedVehicleName : 'Not selected'}
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
                        {selectedDateTime
                            ? formatReadableDate(new Date(selectedDateTime))
                            : 'Not selected'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time:</span>
                    <span className="text-gray-900 dark:text-white">
                        {selectedDateTime
                            ? formatReadableTime(new Date(selectedDateTime))
                            : 'Not selected'}
                    </span>
                </div>
            </div>
        </div>
    );
};
