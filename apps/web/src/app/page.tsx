'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import { Modal } from '../components/ui/Modal';
import { CustomerForm } from '../components/booking/CustomerForm';
import { BookingWidget } from '../components/booking/BookingWidget';
import { BookingSummary } from '../components/booking/BookingSummary';
import { APIErrorBoundary } from '../components/ui/APIErrorBoundary';
import { useBookingStore } from '../stores/bookingStore';
import { useCreateBooking, BookingResponse } from '../hooks/useBookings';

export default function Index() {
    const router = useRouter();
    const {
        loading,
        error,
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

    const handleBookingSubmit = React.useCallback(async () => {
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

    const handleBookingCancel = React.useCallback(() => {
        setShowCustomerModal(false);
    }, [setShowCustomerModal]);

    const handleBookingComplete = React.useCallback(() => {
        // This function is currently not used, but kept for future extensibility
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
            <Header />
            <main className="py-8">
                <Container size="xl">
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-bold text-primary bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                                Book Your EV Test Drive
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Experience the future of driving with a personalized test drive
                            </p>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <BookingSummary />
                        <APIErrorBoundary>
                            <BookingWidget onBookingComplete={handleBookingComplete} />
                        </APIErrorBoundary>

                        {/* Customer Details Modal */}
                        <Modal
                            isOpen={showCustomerModal}
                            onClose={handleBookingCancel}
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
                    </div>
                </Container>
            </main>
        </div>
    );
}
