import React from 'react';
import { Button } from '../ui/Button';

interface CustomerFormProps {
    customerInfo: { name: string; email: string; phone: string };
    onNameChange: (val: string) => void;
    onEmailChange: (val: string) => void;
    onPhoneChange: (val: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    loading: boolean;
}

export const CustomerForm = ({
    customerInfo,
    onNameChange,
    onEmailChange,
    onPhoneChange,
    onSubmit,
    onCancel,
    loading,
}: CustomerFormProps) => {
    const isFormIncomplete = !customerInfo.name || !customerInfo.email || !customerInfo.phone;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="space-y-4"
        >
            <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md dark:bg-gray-800"
                    value={customerInfo.name}
                    onChange={(e) => onNameChange(e.target.value)}
                    disabled={loading}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                    type="email"
                    className="w-full p-2 border rounded-md dark:bg-gray-800"
                    value={customerInfo.email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    disabled={loading}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                    type="tel"
                    className="w-full p-2 border rounded-md dark:bg-gray-800"
                    value={customerInfo.phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    disabled={loading}
                    required
                />
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || isFormIncomplete}
                    className="flex-1"
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </Button>
            </div>
        </form>
    );
};
