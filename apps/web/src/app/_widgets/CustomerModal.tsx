'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../../components/ui/Modal';
import { CustomerForm } from '../../components/booking/CustomerForm';
import { useNevoStore } from '../../stores/nevoStore';
import { useCreateBooking } from '../../hooks/useBookings';

export const CustomerModal = () => {
    const router = useRouter();
    const createBookingMutation = useCreateBooking();

    const {
        loading,
        setLoading,
        error,
        setError,
        showCustomerModal,
        setShowCustomerModal,
        customerName,
        customerEmail,
        customerPhone,
        setCustomerName,
        setCustomerEmail,
        setCustomerPhone,
        // Selection Data for the API payload
        selectedVehicleType,
        selectedLocationId,
        selectedDateTime, // This is the ISO string from the API
    } = useNevoStore();

    const handleClose = useCallback(() => {
        // Prevent closing while the API request is in flight
        if (!loading) {
            setShowCustomerModal(false);
            setError(null);
        }
    }, [loading, setShowCustomerModal, setError]);

    const handleBookingSubmit = useCallback(async () => {
        // 1. Final validation check
        if (!selectedVehicleType || !selectedLocationId || !selectedDateTime) {
            setError('Selection data is missing. Please restart the process.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 2. Trigger the API Mutation
            const result = await createBookingMutation.mutateAsync({
                vehicleType: selectedVehicleType,
                location: selectedLocationId,
                requestedIso: selectedDateTime,
                customerName: customerName || '',
                customerEmail: customerEmail || '',
                customerPhone: customerPhone || '',
            });

            // 3. Handle Success
            if (result.success && result.bookingId) {
                setShowCustomerModal(false);
                // Redirect to the dynamic success page we built earlier
                router.push(`/booked/${result.bookingId}`);
            } else {
                setError(result.message || 'Booking failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Booking Submission Error:', err);
            setError(err?.response?.data?.message || 'A server error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [
        selectedVehicleType,
        selectedLocationId,
        selectedDateTime,
        customerName,
        customerEmail,
        customerPhone,
        createBookingMutation,
        router,
        setLoading,
        setError,
        setShowCustomerModal,
    ]);

    return (
        <Modal
            isOpen={showCustomerModal}
            onClose={handleClose}
            title="Confirm Your Test Drive"
            size="md"
        >
            <div className="space-y-6">
                {/* Optional: Add a small summary here so they see what they are booking */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 text-sm">
                    <p className="font-semibold text-blue-800 dark:text-blue-300">
                        Booking Summary:
                    </p>
                    <p className="text-blue-700 dark:text-blue-400">
                        {selectedVehicleType} •{' '}
                        {selectedDateTime ? new Date(selectedDateTime).toLocaleString() : ''}
                    </p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <CustomerForm
                    customerInfo={{
                        name: customerName || '',
                        email: customerEmail || '',
                        phone: customerPhone || '',
                    }}
                    onNameChange={setCustomerName}
                    onEmailChange={setCustomerEmail}
                    onPhoneChange={setCustomerPhone}
                    onSubmit={handleBookingSubmit}
                    onCancel={handleClose}
                    loading={loading}
                />
            </div>
        </Modal>
    );
};
