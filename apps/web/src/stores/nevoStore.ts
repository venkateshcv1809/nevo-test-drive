import { create } from 'zustand';
import { TimeSlot } from '@nevo/models';
import { formatDate } from '../lib/util';

type Step = 'date' | 'time';

interface NevoState {
    currentStep: Step;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    error: string | null;
    interestedDates: Date[];
    loading: boolean;
    selectedVehicleType: string | null;
    selectedVehicleName: string | null;
    selectedLocationId: string | null;
    selectedLocation: string | null;
    selectedDateTime: string | null;
    selectedTimeSlot: TimeSlot | null;
    showCustomerModal: boolean;
}

interface NevoActions {
    resetStore: () => void;
    setCurrentStep: (step: Step) => void;
    setCustomerName: (name: string | null) => void;
    setCustomerEmail: (email: string | null) => void;
    setCustomerPhone: (phone: string | null) => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
    setSelectedVehicleType: (vehicleType: string | null) => void;
    setSelectedVehicleName: (vehicleName: string | null) => void;
    setSelectedLocationId: (locationId: string | null) => void;
    setSelectedLocation: (location: string | null) => void;
    setSelectedDateTime: (dateTime: string | null) => void;
    setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void;
    setShowCustomerModal: (show: boolean) => void;
    toggleDateSelection: (date: Date) => void;
}

export const useNevoStore = create<NevoState & NevoActions>((set, get) => ({
    currentStep: 'date',
    customerName: null,
    customerEmail: null,
    customerPhone: null,
    error: null,
    interestedDates: [],
    loading: false,
    selectedVehicleType: null,
    selectedVehicleName: null,
    selectedLocationId: null,
    selectedLocation: null,
    selectedDateTime: null,
    selectedTimeSlot: null,
    showCustomerModal: false,
    setCurrentStep: (step) => set({ currentStep: step }),
    setCustomerName: (name) => set({ customerName: name }),
    setCustomerEmail: (email) => set({ customerEmail: email }),
    setCustomerPhone: (phone) => set({ customerPhone: phone }),
    setError: (error) => set({ error: error }),
    setLoading: (loading) => set({ loading: loading }),
    setSelectedVehicleType: (vehicleType) => set({ selectedVehicleType: vehicleType }),
    setSelectedVehicleName: (vehicleName) => set({ selectedVehicleName: vehicleName }),
    setSelectedLocationId: (locationId) => set({ selectedLocationId: locationId }),
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    setSelectedDateTime: (dateTime) => set({ selectedDateTime: dateTime }),
    setSelectedTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),
    setShowCustomerModal: (show) => set({ showCustomerModal: show }),
    toggleDateSelection: (date) => {
        const currentDates = get().interestedDates;
        const isSelected = currentDates.some((d) => d.toDateString() === date.toDateString());
        const currentTimeSlot = get().selectedDateTime;

        if (isSelected) {
            // Remove date from selection
            set({
                interestedDates: currentDates.filter(
                    (d) => d.toDateString() !== date.toDateString()
                ),
            });
            // Check if the deselected date had a selected time slot
            if (currentTimeSlot && currentTimeSlot.split('T')[0] === formatDate(date)) {
                set({ selectedDateTime: null, selectedTimeSlot: null });
            }
        } else {
            // Add date to selection
            set({
                interestedDates: [...currentDates, date],
            });
        }
    },
    resetStore: () => {
        set({
            currentStep: 'date',
            customerName: null,
            customerEmail: null,
            customerPhone: null,
            error: null,
            interestedDates: [],
            loading: false,
            selectedVehicleType: null,
            selectedVehicleName: null,
            selectedLocationId: null,
            selectedLocation: null,
            selectedDateTime: null,
            selectedTimeSlot: null,
            showCustomerModal: false,
        });
    },
}));
