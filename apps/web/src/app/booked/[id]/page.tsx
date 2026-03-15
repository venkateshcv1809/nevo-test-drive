'use client';
import React, { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '../../../components/layout/Header';
import { Container } from '../../../components/layout/Container';
import { Button } from '../../../components/ui/Button';
import { QRCode } from '../../../components/ui/QRCode';
import { useBookingStore } from '../../../stores/bookingStore';
import { useBooking, useCancelBooking } from '../../../hooks/useBookings';
import html2canvas from 'html2canvas';

export default function BookingConfirmationPage() {
    const params = useParams();
    const { resetBooking } = useBookingStore();
    const bookingWidgetRef = useRef<HTMLDivElement>(null);

    const bookingId = params.id as string;
    const { data: booking, isLoading: loading, error } = useBooking(bookingId);
    const cancelBookingMutation = useCancelBooking();
    const [downloading, setDownloading] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const downloadWidgetAsImage = async () => {
        if (!bookingWidgetRef.current) return;

        setDownloading(true);
        try {
            // Simpler approach - just wait for QR code to load
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const canvas = await html2canvas(bookingWidgetRef.current, {
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: bookingWidgetRef.current.offsetWidth + 40,
                height: bookingWidgetRef.current.offsetHeight + 40,
                windowWidth: bookingWidgetRef.current.offsetWidth + 40,
                windowHeight: bookingWidgetRef.current.offsetHeight + 40,
                scrollX: -20,
                scrollY: -20,
            });

            const link = document.createElement('a');
            link.download = `booking-${booking?.id}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (error) {
            console.error('Error downloading widget as image:', error);
            // Could add error toast here
        } finally {
            setDownloading(false);
        }
    };

    const handleCancelBooking = async () => {
        setShowCancelModal(true);
    };

    const confirmCancelBooking = async () => {
        try {
            await cancelBookingMutation.mutateAsync(bookingId);
            // Close modal first
            setShowCancelModal(false);
            // Show success message
            setShowSuccessMessage(true);
            // Reset booking and redirect after delay
            setTimeout(() => {
                resetBooking();
                window.location.href = '/';
            }, 2000);
        } catch (error) {
            console.error('Error cancelling booking:', error);
            // Could add error toast here too
        }
    };

    const handleBookAnother = () => {
        // Reset booking store and navigate back to booking
        resetBooking();
        window.location.href = '/';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
                <Header />
                <main className="py-8">
                    <Container size="md">
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="text-center">
                                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-400 dark:text-gray-500">
                                    Loading booking details...
                                </p>
                            </div>
                        </div>
                    </Container>
                </main>
            </div>
        );
    }

    // Check if booking is cancelled
    if (booking && booking.status === 'cancelled') {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
                <Header />
                <main className="py-8">
                    <Container size="md">
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
                                Booking Cancelled
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                This booking has been cancelled and is no longer active.
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Booking ID:{' '}
                                    <span className="font-mono font-semibold">{booking.id}</span>
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Cancelled on:{' '}
                                    {booking.cancelledAt
                                        ? booking.cancelledAt.toLocaleDateString()
                                        : 'Unknown'}
                                </p>
                            </div>
                            <Button
                                variant="primary"
                                onClick={handleBookAnother}
                                className="inline-flex items-center"
                            >
                                <svg
                                    className="w-4 h-4 mr-2 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2v-10M9 12l2 2m0 0l2-2m-2 2h6"
                                    />
                                </svg>
                                Book Another Test Drive
                            </Button>
                        </div>
                    </Container>
                </main>
            </div>
        );
    }

    if (!booking || error) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
                <Header />
                <main className="py-8">
                    <Container size="md">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-red-400 mb-4">
                                {error ? 'Error Loading Booking' : 'Booking Not Found'}
                            </h1>
                            <p className="text-gray-400 dark:text-gray-500 mb-6">
                                {error?.message || "The booking you're looking for doesn't exist."}
                            </p>
                            <Button variant="primary" onClick={handleBookAnother}>
                                Return to Booking
                            </Button>
                        </div>
                    </Container>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
            <Header />
            <main className="py-8">
                <Container size="md">
                    <div className="space-y-8">
                        {/* Success Header */}
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-8 h-8 text-black"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-cyan-400 bg-clip-text text-transparent">
                                Booking Confirmed!
                            </h1>
                            <p className="text-gray-400 dark:text-gray-500">
                                Your EV test drive has been successfully scheduled
                            </p>
                        </div>

                        {/* Combined Booking Details & QR Code Widget */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 relative">
                            {/* Download Button */}
                            <button
                                onClick={downloadWidgetAsImage}
                                disabled={downloading}
                                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Download as image"
                            >
                                {downloading ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                                ) : (
                                    <svg
                                        className="w-4 h-4 mr-2 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                )}
                            </button>

                            <div ref={bookingWidgetRef} className="space-y-6 p-8">
                                {/* Real QR Code at Top */}
                                <div className="text-center">
                                    <div className="inline-block p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                        <QRCode data={booking.id} size={120} />
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                            Booking ID
                                        </span>
                                        <span className="text-gray-900 dark:text-white font-mono text-sm font-semibold">
                                            {booking.id}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                            Vehicle
                                        </span>
                                        <span className="text-gray-900 dark:text-white text-sm font-semibold">
                                            {booking.vehicle.name}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                            Date
                                        </span>
                                        <span className="text-gray-900 dark:text-white text-sm font-semibold">
                                            {booking.date.toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                            Time
                                        </span>
                                        <span className="text-gray-900 dark:text-white text-sm font-semibold">
                                            {booking.startTime} - {booking.endTime}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                            Location
                                        </span>
                                        <span className="text-gray-900 dark:text-white text-sm font-semibold">
                                            {booking.location} Showroom
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                            Customer
                                        </span>
                                        <span className="text-gray-900 dark:text-white text-sm font-semibold">
                                            {booking.customerInfo.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        {' '}
                                        111-1111-1111 | support@nevo-testdrive.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Preparation Checklist */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                What to Bring
                            </h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start">
                                    <svg
                                        className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Valid driver's license</span>
                                </li>
                                <li className="flex items-start">
                                    <svg
                                        className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Credit card for security deposit</span>
                                </li>
                                <li className="flex items-start">
                                    <svg
                                        className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Comfortable driving shoes</span>
                                </li>
                                <li className="flex items-start">
                                    <svg
                                        className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Arrive 10 minutes early</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="secondary"
                                onClick={handleCancelBooking}
                                className="flex-1 inline-flex items-center justify-center"
                                disabled={cancelBookingMutation.isPending}
                            >
                                <svg
                                    className="w-4 h-4 mr-2 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                {cancelBookingMutation.isPending
                                    ? 'Cancelling...'
                                    : 'Cancel Booking'}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleBookAnother}
                                className="flex-1 inline-flex items-center justify-center"
                            >
                                <svg
                                    className="w-4 h-4 mr-2 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2v-10M9 12l2 2m0 0l2-2m-2 2h6"
                                    />
                                </svg>
                                Book Another
                            </Button>
                        </div>

                        {/* Contact Information */}
                        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                            <p>Need help? Contact us at:</p>
                            <p> 111-1111-1111</p>
                            <p> support@nevo-testdrive.com</p>
                        </div>
                    </div>
                </Container>
            </main>

            {/* Cancel Booking Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-6 h-6 text-red-600 dark:text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Cancel Booking
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Are you sure you want to cancel this booking? This action cannot be
                                undone.
                            </p>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="secondary"
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1"
                            >
                                Keep Booking
                            </Button>
                            <Button
                                variant="primary"
                                onClick={confirmCancelBooking}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                disabled={cancelBookingMutation.isPending}
                            >
                                {cancelBookingMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showSuccessMessage && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="font-medium">Booking cancelled successfully</span>
                </div>
            )}
        </div>
    );
}
