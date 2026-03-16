import { VehicleSelectors } from './_parts/VehicleSelectors';
import { DateSelectionStep } from './_steps/DateSelectionStep';

export const BookingWidget = () => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border...">
            <VehicleSelectors />
            <DateSelectionStep />
        </div>
    );
};
