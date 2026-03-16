'use client';

import React from 'react';
import { Button } from '../../../../components/ui/Button';
import { useBookingStore } from '../../../../stores/bookingStore';

export const NavigationActions = () => {
    const {
        currentStep,
        setStep,
        selectedDates,
        selectedVehicle,
        selectedLocation,
        selectedTimeSlotWithDate,
    } = useBookingStore();

    const isContinueDisabled = () => {
        if (currentStep === 'date') {
            return !selectedVehicle || !selectedLocation || selectedDates.length === 0;
        }
        return !selectedTimeSlotWithDate;
    };

    const handleContinue = () => {
        if (currentStep === 'date') {
            setStep('time');
        } else {
            console.log('Proceeding to checkout...');
        }
    };

    return (
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800 mt-8">
            <div className="min-w-[100px]">
                {currentStep === 'time' && (
                    <Button variant="secondary" onClick={() => setStep('date')}>
                        Back
                    </Button>
                )}
            </div>

            <Button
                variant="primary"
                onClick={handleContinue}
                disabled={isContinueDisabled()}
                className="min-w-[200px]"
            >
                {currentStep === 'date' ? 'See Available Time' : 'Confirm Selection'}
            </Button>
        </div>
    );
};
