'use client';
import React, { useMemo } from 'react';
import { useBookingStore } from '../../../../stores/bookingStore';
import { Dropdown } from '../../../../components/ui/Dropdown';
import { useVehicles } from '../../../../hooks/useVehicles';

export const VehicleSelectors = () => {
    const { data: vehicles, isLoading } = useVehicles();

    const { selectedVehicle, setSelectedVehicle, selectedLocation, setSelectedLocation } =
        useBookingStore();

    const vehicleOptions = useMemo(() => {
        if (!vehicles) return [];
        return Object.entries(vehicles).map(([, data]) => ({
            value: data.vehicleType,
            label: data.vehicleName,
        }));
    }, [vehicles]);

    const locationOptions = useMemo(() => {
        if (!selectedVehicle || !vehicles) return [];

        const vehicleData = vehicles[selectedVehicle];
        if (!vehicleData) return [];

        return Object.entries(vehicleData.locations).map(([, loc]) => ({
            value: loc.locationId,
            label: loc.locationName,
        }));
    }, [selectedVehicle, vehicles]);

    return (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Dropdown
                label="Select Vehicle"
                value={selectedVehicle || ''}
                options={vehicleOptions}
                placeholder="Choose your EV"
                disabled={isLoading}
                onChange={(vehicleType) => {
                    const newData = vehicles?.[vehicleType];
                    if (!newData) return;

                    const isLocationStillValid =
                        selectedLocation && !!newData.locations[selectedLocation];
                    setSelectedVehicle(vehicleType);

                    if (!isLocationStillValid) {
                        setSelectedLocation('');
                    }
                }}
            />

            <Dropdown
                label="Select Location"
                value={selectedLocation || ''}
                options={locationOptions}
                placeholder="Select showroom"
                disabled={!selectedVehicle}
                onChange={setSelectedLocation}
            />
        </div>
    );
};
