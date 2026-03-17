import { VehicleSelectors } from './_parts/VehicleSelectors';
import { DateSelectionStep } from './_steps/DateSelectionStep';
import { NavigationActions } from './_parts/NavigationActions';
import { TimeSlotSelector } from '../../../components/booking/TimeSlotSelector';
import { useNevoStore } from '../../../stores/nevoStore';

export const BookingWidget = () => {
    const { currentStep } = useNevoStore();
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border...">
            <VehicleSelectors />
            <main className="step-content">
                {currentStep === 'date' ? <DateSelectionStep /> : <TimeSlotSelector />}
            </main>

            <footer>
                <NavigationActions />
            </footer>
        </div>
    );
};
