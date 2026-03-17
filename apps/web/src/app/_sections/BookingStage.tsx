import { APIErrorBoundary } from '../../components/ui/APIErrorBoundary';
import { BookingWidget } from '../_widgets/BookingWidget';

export default function BookingStage() {
    return (
        <APIErrorBoundary>
            <BookingWidget />
        </APIErrorBoundary>
    );
}
