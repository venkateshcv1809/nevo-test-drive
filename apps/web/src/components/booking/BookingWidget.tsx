import React from 'react';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { CalendarView } from '../ui/CalendarView';
import { TimeSlotSelector } from './TimeSlotSelector';
import { useBookingStore } from '../../stores/bookingStore';
import { DayAvailability, TimeSlot } from '../../data/models';
import { useVehicles, useVehicleAvailability } from '../../hooks/useBookings';

type BookingStep = 'dates' | 'time';

interface BookingWidgetProps {
    initialStep?: BookingStep;
    onBookingComplete?: () => void;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
    initialStep = 'dates',
    onBookingComplete,
}) => {
    const [currentStep, setCurrentStep] = React.useState<BookingStep>(initialStep);

    const {
        availability,
        selectedVehicle,
        selectedLocation,
        selectedDates,
        selectVehicle,
        selectLocation,
        toggleDateSelection,
        setAvailability,
        selectedTimeSlotWithDate,
        setSelectedTimeSlotWithDate,
        setShowCustomerModal,
    } = useBookingStore();

    // API hooks using centralized hooks
    const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();

    // Only call availability API when proceeding to time slot step
    const shouldCallAvailabilityAPI =
        currentStep === 'time' && selectedDates.length > 0 && selectedVehicle && selectedLocation;
    const selectedDatesStrings = selectedDates.map(
        (date) => date.toLocaleDateString('en-CA') // en-CA gives YYYY-MM-DD format
    );
    const { data: availabilityData } = useVehicleAvailability(
        shouldCallAvailabilityAPI ? selectedVehicle?.type || '' : '',
        shouldCallAvailabilityAPI ? selectedLocation || '' : '',
        shouldCallAvailabilityAPI ? selectedDatesStrings : []
    );

    // Update availability when API data changes
    React.useEffect(() => {
        if (availabilityData && Array.isArray(availabilityData)) {
            // Convert API response to DayAvailability format
            const convertedAvailability: DayAvailability[] = availabilityData.map((day: any) => ({
                date: new Date(day.date),
                availableSlots: day.timeSlots.filter((slot: any) => slot.available).length,
                totalSlots: day.timeSlots.length,
                status:
                    day.timeSlots.filter((slot: any) => slot.available).length === 0
                        ? 'booked'
                        : day.timeSlots.filter((slot: any) => slot.available).length <= 3
                          ? 'limited'
                          : 'high',
                timeSlots: day.timeSlots.map((slot: any) => ({
                    time: slot.time,
                    available: slot.available,
                    vehicleId: slot.available ? undefined : undefined,
                })),
            }));

            setAvailability(convertedAvailability);
        } else {
            setAvailability([]);
        }
    }, [availabilityData, setAvailability]);

    // Memoize derived data to prevent multiple API calls
    const vehicleOptions = React.useMemo(
        () =>
            vehicles?.map((vehicleType) => ({
                value: vehicleType.type,
                label: vehicleType.name,
            })) || [],
        [vehicles]
    );

    // Get locations for selected vehicle type
    const locationOptions = React.useMemo(() => {
        if (!selectedVehicle || !vehicles) return [];

        const vehicleGroup = vehicles.find((v) => v.type === selectedVehicle.type);
        return (
            vehicleGroup?.locations.map((location) => ({
                value: location.location,
                label: location.location.charAt(0).toUpperCase() + location.location.slice(1),
                availableDays: location.availableDays,
            })) || []
        );
    }, [selectedVehicle, vehicles]);

    // Get available days for selected vehicle and location
    const availableDays = React.useMemo(() => {
        // Use vehicles data for available days (day names like 'mon', 'tue', etc.)
        if (selectedVehicle && selectedLocation && vehicles) {
            const vehicleGroup = vehicles.find((v) => v.type === selectedVehicle.type);
            const locationData = vehicleGroup?.locations.find(
                (l) => l.location === selectedLocation
            );
            const days = locationData?.availableDays || [];
            return days;
        }

        return [];
    }, [selectedVehicle, selectedLocation, vehicles]);

    const allVehicles = React.useMemo(() => {
        if (!vehicles) return [];

        // Flatten all vehicles from locations
        return vehicles.flatMap((v) =>
            v.locations.map((location) => ({
                id: location.vehicleIds[0] || `${v.type}_${location.location}`,
                type: v.type,
                name: v.name,
                locations: [location.location],
            }))
        );
    }, [vehicles]);

    const isCalendarEnabled = selectedVehicle && selectedLocation && availableDays.length > 0;

    const handleTimeSlotSelect = (date: Date, timeSlot: TimeSlot) => {
        setSelectedTimeSlotWithDate({ date, timeSlot });
    };

    const handleContinue = () => {
        if (currentStep === 'dates') {
            // Check if selected dates are available before proceeding
            if (selectedDates.length > 0 && availability.length > 0) {
                const unavailableDates = selectedDates.filter((selectedDate) => {
                    const availabilityForDate = availability.find(
                        (day: DayAvailability) =>
                            day.date.toDateString() === selectedDate.toDateString()
                    );
                    return !availabilityForDate || availabilityForDate.status === 'unavailable';
                });

                if (unavailableDates.length > 0) {
                    // Remove unavailable dates
                    unavailableDates.forEach((date) => {
                        toggleDateSelection(date);
                    });

                    // Don't proceed if all dates were removed
                    if (selectedDates.length === unavailableDates.length) {
                        // Could add error handling here
                        return;
                    }
                }
            }

            setCurrentStep('time');
        } else if (currentStep === 'time') {
            // If time slot is selected, show customer modal
            if (selectedTimeSlotWithDate) {
                setShowCustomerModal(true);
            } else {
                onBookingComplete?.();
            }
        }
    };

    const handleBack = () => {
        if (currentStep === 'time') {
            setCurrentStep('dates');
        }
    };

    const getStepTitle = () => {
        return currentStep === 'dates' ? 'Book Your EV Test Drive' : 'Select Your Time Slot';
    };

    const getContinueText = () => {
        if (currentStep === 'dates') return 'Continue';
        return `Proceed to Booking ${selectedTimeSlotWithDate && '✓'}`;
    };

    const getContinueDisabled = () => {
        if (currentStep === 'dates')
            return !selectedVehicle || !selectedLocation || selectedDates.length === 0;
        return !selectedTimeSlotWithDate;
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {getStepTitle()}
            </h2>

            {/* Vehicle and Location Selection */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Dropdown
                    label="Select Vehicle"
                    value={selectedVehicle?.type || ''}
                    onChange={(vehicleType) => {
                        // Find vehicle group from API data
                        const vehicleGroup = vehicles?.find((v) => v.type === vehicleType);
                        if (vehicleGroup && vehicleGroup.locations.length > 0) {
                            // Create a vehicle object compatible with the store
                            selectVehicle({
                                id:
                                    vehicleGroup.locations[0].vehicleIds[0] ||
                                    `${vehicleType}_default`,
                                type: vehicleGroup.type,
                                name: vehicleGroup.name,
                                locations: vehicleGroup.locations.map((l) => l.location),
                            });
                        }
                    }}
                    options={vehicleOptions}
                    placeholder="Choose your EV"
                    disabled={vehiclesLoading}
                />

                <Dropdown
                    label="Select Location"
                    value={selectedLocation}
                    onChange={selectLocation}
                    options={locationOptions}
                    placeholder="Select showroom"
                    disabled={!selectedVehicle}
                />
            </div>

            {/* Main Content */}
            <div className="space-y-4 mb-8">
                {currentStep === 'dates' && (
                    <>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Select Available Dates
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Choose up to 3 dates to compare time slots in parallel
                            </div>
                        </div>

                        {!isCalendarEnabled && (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                Please select a vehicle and location to view available dates
                            </div>
                        )}

                        <CalendarView
                            availability={availability}
                            selectedDates={selectedDates}
                            onDateSelect={toggleDateSelection}
                            isCalendarEnabled={!!isCalendarEnabled}
                            selectedVehicle={selectedVehicle}
                            selectedLocation={selectedLocation || undefined}
                            availableDays={availableDays}
                            allVehicles={allVehicles}
                            className="bg-white dark:bg-gray-900 rounded-lg"
                        />
                    </>
                )}

                {currentStep === 'time' && (
                    <>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Showing time slots for your selected dates. Choose one slot to proceed.
                        </div>

                        <TimeSlotSelector
                            selectedDates={selectedDates}
                            availability={availability}
                            onTimeSlotSelect={handleTimeSlotSelect}
                        />
                    </>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <div>
                    {currentStep === 'time' && (
                        <Button variant="secondary" onClick={handleBack}>
                            ← Back to Calendar
                        </Button>
                    )}
                </div>

                <div>
                    <Button
                        variant="primary"
                        onClick={handleContinue}
                        disabled={getContinueDisabled()}
                    >
                        {getContinueText()}
                    </Button>
                </div>
            </div>
        </div>
    );
};
