'use client';
import React, { useMemo } from 'react';
import { Dropdown } from '../../../../components/ui/Dropdown';
import { useVehicles } from '../../../../hooks/useVehicles';
import { useNevoStore } from '../../../../stores/nevoStore';

export const VehicleSelectors = () => {
    const { data: vehicles, isLoading } = useVehicles();
    const {
        selectedVehicleType,
        selectedLocationId,
        setSelectedVehicleType,
        setSelectedVehicleName,
        setSelectedLocationId,
        setSelectedLocation,
    } = useNevoStore();

    const vehicleOptions = useMemo(() => {
        if (!vehicles) return [];
        return Object.entries(vehicles).map(([, data]) => ({
            value: data.vehicleType,
            label: data.vehicleName,
        }));
    }, [vehicles]);

    const locationOptions = useMemo(() => {
        if (!selectedVehicleType || !vehicles) return [];

        const vehicleData = vehicles[selectedVehicleType];
        if (!vehicleData) return [];

        return Object.entries(vehicleData.locations).map(([, loc]) => ({
            value: loc.locationId,
            label: loc.locationName,
        }));
    }, [selectedVehicleType, vehicles]);

    return (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Dropdown
                label="Select Vehicle"
                value={selectedVehicleType || ''}
                options={vehicleOptions}
                placeholder="Choose your EV"
                disabled={isLoading}
                onChange={(vehicleType) => {
                    const newData = vehicles?.[vehicleType];
                    if (!newData) return;

                    const isLocationStillValid =
                        selectedLocationId && !!newData.locations[selectedLocationId];
                    setSelectedVehicleType(vehicleType);
                    setSelectedVehicleName(newData.vehicleName);
                    if (!isLocationStillValid) {
                        setSelectedLocationId(null);
                        setSelectedLocation(null);
                    }
                }}
            />

            <Dropdown
                label="Select Location"
                value={selectedLocationId || ''}
                options={locationOptions}
                placeholder="Select showroom"
                disabled={!selectedVehicleType}
                onChange={(locationId) => {
                    setSelectedLocationId(locationId);
                    const location =
                        vehicles?.[selectedVehicleType as string]?.locations[locationId];
                    setSelectedLocation(location?.locationName || null);
                }}
            />
        </div>
    );
};
