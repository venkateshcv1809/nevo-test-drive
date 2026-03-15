import React from 'react';
import { CustomerInfo } from '../../data/models';
import { Button } from '../ui/Button';

interface CustomerFormProps {
    customerInfo: CustomerInfo;
    onChange: (info: Partial<CustomerInfo>) => void;
    onSubmit: () => void;
    onCancel: () => void;
    loading?: boolean;
    className?: string;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
    customerInfo,
    onChange,
    onSubmit,
    onCancel,
    loading = false,
    className = '',
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    const isFormValid = () => {
        return (
            customerInfo.name.trim().length >= 2 &&
            customerInfo.email.includes('@') &&
            customerInfo.phone.trim().length >= 10
        );
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                    Your Information
                </h3>
                <p className="text-gray-400 text-sm">
                    Please provide your contact details to complete the booking
                </p>
            </div>

            {/* Name Field */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => onChange({ name: e.target.value })}
                    placeholder="John Smith"
                    className={`
            w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary
            focus:border-transparent transition-all duration-200
          `}
                    required
                />
            </div>

            {/* Email Field */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                </label>
                <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => onChange({ email: e.target.value })}
                    placeholder="john.smith@example.com"
                    className={`
            w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary
            focus:border-transparent transition-all duration-200
          `}
                    required
                />
            </div>

            {/* Phone Field */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                </label>
                <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => onChange({ phone: e.target.value })}
                    placeholder="+353 85 123 4567"
                    className={`
            w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary
            focus:border-transparent transition-all duration-200
          `}
                    required
                />
            </div>

            {/* Action Buttons */}
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
                    loading={loading}
                    disabled={!isFormValid()}
                    className="flex-1"
                >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                </Button>
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 space-y-1">
                <p>• We'll send a confirmation email with your booking details</p>
                <p>• Your phone number will only be used for booking-related communications</p>
                <p>• Please arrive 10 minutes before your scheduled time</p>
            </div>
        </form>
    );
};
