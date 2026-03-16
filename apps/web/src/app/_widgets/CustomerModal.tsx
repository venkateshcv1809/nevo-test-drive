import { useCallback } from 'react';
import { Modal } from '../../components/ui/Modal';
import { CustomerForm } from '../../components/booking/CustomerForm';
import { useBookingStore } from '../../stores/bookingStore';
import { useRouter } from 'next/navigation';
import { useCreateBooking, BookingResponse } from '../../hooks/useBookings';

export const CustomerModal = () => {
    const router = useRouter();
    const {
        loading,
        customerInfo,
        showCustomerModal,
        setLoading,
        setError,
        updateCustomerInfo,
        setShowCustomerModal,
        selectedVehicle,
        selectedLocation,
        selectedTimeSlotWithDate,
    } = useBookingStore();

    const createBookingMutation = useCreateBooking();

    const handleBookingCancel = useCallback(() => {
        setShowCustomerModal(false);
    }, [setShowCustomerModal]);

    const handleBookingSubmit = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (
                !selectedVehicle ||
                !selectedLocation ||
                !selectedTimeSlotWithDate ||
                !customerInfo
            ) {
                setError('Missing booking information. Please try again.');
                return;
            }

            // Create booking via API
            const result: BookingResponse = await createBookingMutation.mutateAsync({
                vehicleType: selectedVehicle.type,
                location: selectedLocation,
                date: selectedTimeSlotWithDate.date.toISOString().split('T')[0],
                timeSlot: selectedTimeSlotWithDate.timeSlot.time,
                customerName: customerInfo.name,
                customerEmail: customerInfo.email,
                customerPhone: customerInfo.phone,
            });

            if (result.success && result.bookingId) {
                // Navigate to confirmation page
                router.push(`/booked/${result.bookingId}`);
            } else {
                setError(result.message || 'Failed to create booking');
            }
        } catch (err) {
            console.error('Booking creation error:', err);
            setError(
                err instanceof Error ? err.message : 'Failed to create booking. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }, [
        selectedVehicle,
        selectedLocation,
        selectedTimeSlotWithDate,
        customerInfo,
        setLoading,
        setError,
        createBookingMutation,
        router,
    ]);

    return (
        <Modal
            isOpen={showCustomerModal}
            onClose={() => setShowCustomerModal(false)}
            title="Complete Your Booking"
            size="md"
        >
            <CustomerForm
                customerInfo={customerInfo}
                onChange={updateCustomerInfo}
                onSubmit={handleBookingSubmit}
                onCancel={handleBookingCancel}
                loading={loading}
            />
        </Modal>
    );
};
