import { APIErrorBoundary } from '../../components/ui/APIErrorBoundary';
import { useBookingStore } from '../../stores/bookingStore';
import { BookingWidget } from '../_widgets/BookingWidget';

export default function BookingStage() {
    const { error } = useBookingStore();
    return (
        <>
            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <APIErrorBoundary>
                <BookingWidget />
            </APIErrorBoundary>
        </>
    );
}
