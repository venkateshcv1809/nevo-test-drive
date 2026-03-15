import { create } from 'zustand';
import { Vehicle, DayAvailability, TimeSlot, CustomerInfo } from '../data/models';

// Booking state interface
interface BookingState {
    // Vehicle selection
    selectedVehicle: Vehicle | null;
    selectedLocation: string | null;
    allVehicles: Vehicle[];

    // Date/time selection
    bookingDate: Date | null;
    selectedDates: Date[];
    selectedTimeSlotWithDate: { date: Date; timeSlot: TimeSlot } | null;
    availability: DayAvailability[];

    // Customer information
    customerInfo: CustomerInfo;

    // UI state
    showCustomerModal: boolean;
    loading: boolean;
    error: string | null;
}

// Store actions
interface BookingActions {
    // Vehicle actions
    setSelectedVehicle: (vehicle: Vehicle | null) => void;
    setSelectedLocation: (location: string | null) => void;
    setAllVehicles: (vehicles: Vehicle[]) => void;
    selectVehicle: (vehicle: Vehicle) => void;
    selectLocation: (location: string) => void;

    // Date/time actions
    setBookingDate: (date: Date | null) => void;
    toggleDateSelection: (date: Date) => void;
    setSelectedTimeSlotWithDate: (timeSlot: { date: Date; timeSlot: TimeSlot } | null) => void;
    setAvailability: (availability: DayAvailability[]) => void;

    // Customer actions
    updateCustomerInfo: (info: Partial<CustomerInfo>) => void;

    // UI actions
    setShowCustomerModal: (show: boolean) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetBooking: () => void;
}

// Create the booking store
export const useBookingStore = create<BookingState & BookingActions>((set, get) => ({
    // Initial state
    selectedVehicle: null,
    selectedLocation: null,
    allVehicles: [],
    bookingDate: null,
    selectedDates: [],
    selectedTimeSlotWithDate: null,
    availability: [],
    customerInfo: {
        name: '',
        email: '',
        phone: '',
    },
    showCustomerModal: false,
    loading: false,
    error: null,

    // Vehicle actions
    setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    setAllVehicles: (vehicles) => set({ allVehicles: vehicles }),

    // Convenience functions
    selectVehicle: (vehicle: Vehicle) => set({ selectedVehicle: vehicle }),
    selectLocation: (location: string) => set({ selectedLocation: location }),

    // Date/time actions
    setBookingDate: (date) => set({ bookingDate: date }),
    toggleDateSelection: (date) => {
        const currentDates = get().selectedDates;
        const isSelected = currentDates.some((d) => d.toDateString() === date.toDateString());
        const currentTimeSlot = get().selectedTimeSlotWithDate;

        if (isSelected) {
            // Remove date from selection
            set({
                selectedDates: currentDates.filter((d) => d.toDateString() !== date.toDateString()),
            });

            // Check if the deselected date had a selected time slot
            if (currentTimeSlot && currentTimeSlot.date.toDateString() === date.toDateString()) {
                console.log('Resetting time slot because date was deselected');
                set({ selectedTimeSlotWithDate: null });
            }
        } else {
            // Add date to selection
            set({
                selectedDates: [...currentDates, date],
            });
        }
    },
    setSelectedTimeSlotWithDate: (timeSlot) => set({ selectedTimeSlotWithDate: timeSlot }),
    setAvailability: (availability) => set({ availability }),

    // Customer actions
    updateCustomerInfo: (info) =>
        set((state) => ({
            customerInfo: { ...state.customerInfo, ...info },
        })),

    // UI actions
    setShowCustomerModal: (show) => set({ showCustomerModal: show }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    // Reset action
    resetBooking: () =>
        set({
            selectedVehicle: null,
            selectedLocation: null,
            allVehicles: [],
            bookingDate: null,
            selectedDates: [],
            selectedTimeSlotWithDate: null,
            availability: [],
            customerInfo: {
                name: '',
                email: '',
                phone: '',
            },
            showCustomerModal: false,
            loading: false,
            error: null,
        }),
}));
