'use client';

import React from 'react';
import { Button } from '../../../../components/ui/Button';
import { useNevoStore } from '../../../../stores/nevoStore';

export const NavigationActions = () => {
    const {
        currentStep,
        interestedDates,
        selectedVehicleType,
        selectedLocationId,
        selectedDateTime,
        setCurrentStep,
        setShowCustomerModal,
    } = useNevoStore();

    const isContinueDisabled = () => {
        if (currentStep === 'date') {
            return !selectedVehicleType || !selectedLocationId || interestedDates.length === 0;
        }
        return !selectedDateTime;
    };

    const handleContinue = () => {
        if (currentStep === 'date') {
            setCurrentStep('time');
        } else {
            if (selectedDateTime) {
                setShowCustomerModal(true);
            }
        }
    };

    return (
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800 mt-8">
            <div className="min-w-[100px]">
                {currentStep === 'time' && (
                    <Button variant="secondary" onClick={() => setCurrentStep('date')}>
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
                {currentStep === 'date' ? 'Select Time' : 'Confirm Selection'}
            </Button>
        </div>
    );
};
