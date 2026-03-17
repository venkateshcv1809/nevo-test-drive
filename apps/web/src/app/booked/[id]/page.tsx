'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '../../../components/layout/Header';
import { Container } from '../../../components/layout/Container';
import { Button } from '../../../components/ui/Button';
import { QRCode } from '../../../components/ui/QRCode';
import { useNevoStore } from '../../../stores/nevoStore';
import { useGetBooking, useCancelBooking } from '../../../hooks/useBookings';
import html2canvas from 'html2canvas';

export default function BookingConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const { resetStore } = useNevoStore();
    const bookingWidgetRef = useRef<HTMLDivElement>(null);

    const bookingId = params.id as string;

    // Using the TanStack Query hooks we built
    const { data: booking, isLoading, error } = useGetBooking(bookingId);
    const cancelBookingMutation = useCancelBooking(bookingId);

    const [downloading, setDownloading] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const downloadWidgetAsImage = async () => {
        if (!bookingWidgetRef.current) return;

        setDownloading(true);
        try {
            // Wait briefly for QR code rendering to stabilize
            await new Promise((resolve) => setTimeout(resolve, 800));

            const canvas = await html2canvas(bookingWidgetRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null, // Keep transparency if needed
            });

            const link = document.createElement('a');
            link.download = `NEVO-Booking-${bookingId}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Download failed:', err);
        } finally {
            setDownloading(false);
        }
    };

    const confirmCancelBooking = async () => {
        try {
            await cancelBookingMutation.mutateAsync();
            setShowCancelModal(false);
            setShowSuccessMessage(true);

            // Short delay to show the success toast before resetting and leaving
            setTimeout(() => {
                resetStore();
                router.push('/');
            }, 2500);
        } catch (err) {
            console.error('Cancellation failed:', err);
        }
    };

    const handleBookAnother = () => {
        resetStore();
        router.push('/');
    };

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-500">Retrieving your reservation...</p>
                </div>
            </div>
        );
    }

    // 2. Error or Not Found State
    if (!booking || error) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Header />
                <Container size="md" className="py-20 text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Booking Not Found</h1>
                    <p className="text-gray-500 mb-8">
                        We couldn't find a reservation with ID: {bookingId}
                    </p>
                    <Button variant="primary" onClick={handleBookAnother}>
                        Return to Home
                    </Button>
                </Container>
            </div>
        );
    }

    // 3. Cancelled State (Status 'DELETED' from our Backend)
    if (booking.status === 'DELETED') {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Header />
                <Container size="md" className="py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                        <svg
                            className="w-10 h-10"
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
                    <h1 className="text-3xl font-bold text-gray-400">Booking Cancelled</h1>
                    <p className="text-gray-500">
                        This test drive reservation is no longer active.
                    </p>
                    <Button variant="primary" onClick={handleBookAnother}>
                        Schedule New Test Drive
                    </Button>
                </Container>
            </div>
        );
    }

    // 4. Main Confirmed State
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white pb-20">
            <Header />
            <main className="py-8">
                <Container size="md">
                    <div className="space-y-8">
                        {/* Status Header */}
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight">
                                Booking Confirmed!
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                See you at the showroom soon.
                            </p>
                        </div>

                        {/* Ticket Widget Container */}
                        <div className="relative group">
                            {/* Download Icon Overlay */}
                            <button
                                onClick={downloadWidgetAsImage}
                                disabled={downloading}
                                className="absolute -top-3 -right-3 z-10 p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-full shadow-xl hover:scale-110 transition-transform disabled:opacity-50"
                                title="Download Ticket"
                            >
                                {downloading ? (
                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <svg
                                        className="w-5 h-5 text-blue-500"
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

                            {/* The Visual Ticket */}
                            <div
                                ref={bookingWidgetRef}
                                className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl"
                            >
                                <div className="p-8 space-y-8">
                                    {/* QR Section */}
                                    <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                                        <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100">
                                            <QRCode data={booking.id} size={140} />
                                        </div>
                                        <span className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">
                                            Ref: {booking.id}
                                        </span>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 gap-y-4 border-t border-dashed border-gray-200 dark:border-gray-700 pt-8">
                                        <DetailRow label="Vehicle" value={booking.vehicle.name} />
                                        <DetailRow
                                            label="Date"
                                            value={new Date(booking.date).toLocaleDateString(
                                                'en-GB',
                                                {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                }
                                            )}
                                        />
                                        <DetailRow
                                            label="Arrival Time"
                                            value={new Date(booking.timeSlot).toLocaleTimeString(
                                                'en-GB',
                                                {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                }
                                            )}
                                        />
                                        <DetailRow
                                            label="Showroom"
                                            value={`${booking.vehicle.location} Branch`}
                                        />
                                        <DetailRow label="Guest" value={booking.customerName} />
                                    </div>
                                </div>

                                {/* Aesthetic Ticket Bottom */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 text-center border-t border-gray-100 dark:border-gray-800">
                                    <p className="text-xs text-gray-400 font-medium">
                                        Please present this QR code upon arrival.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Prep Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                                    Arrival Info
                                </h4>
                                <p className="text-sm text-blue-800/70 dark:text-blue-400/70">
                                    Arrive 10 mins early with a valid Driver's License.
                                </p>
                            </div>
                            <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                                <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">
                                    Support
                                </h4>
                                <p className="text-sm text-purple-800/70 dark:text-purple-400/70">
                                    Need to reschedule? Call +353 (0) 1 111 2222.
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                variant="secondary"
                                onClick={() => setShowCancelModal(true)}
                                className="flex-1 text-red-500 hover:text-red-600"
                                disabled={cancelBookingMutation.isPending}
                            >
                                Cancel Reservation
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleBookAnother}
                                className="flex-1"
                            >
                                Book Another Drive
                            </Button>
                        </div>
                    </div>
                </Container>
            </main>

            {/* Cancel Modal Overlay */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
                        <div className="text-red-500 mx-auto w-12 h-12">
                            <svg
                                className="w-full h-full"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Cancel Booking?</h3>
                            <p className="text-gray-500 text-sm mt-2">
                                This will release the time slot and cannot be undone.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button
                                variant="primary"
                                onClick={confirmCancelBooking}
                                disabled={cancelBookingMutation.isPending}
                                className="bg-red-500 hover:bg-red-600 border-none"
                            >
                                {cancelBookingMutation.isPending
                                    ? 'Processing...'
                                    : 'Yes, Cancel Booking'}
                            </Button>
                            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                                Nevermind, Keep it
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showSuccessMessage && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-[110] animate-bounce">
                    Reservation successfully cancelled.
                </div>
            )}
        </div>
    );
}

// Helper component for ticket rows
function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center group">
            <span className="text-gray-400 text-sm font-medium">{label}</span>
            <span className="text-gray-900 dark:text-white font-bold">{value}</span>
        </div>
    );
}
