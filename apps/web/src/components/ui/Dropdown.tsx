import React from 'react';

interface DropdownProps {
    label: string;
    value: string | null | undefined;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder = 'Select an option',
    disabled = false,
    className = '',
}) => {
    const selectValue = value || '';

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                {label}
            </label>
            <div className="relative">
                <select
                    value={selectValue}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`
            w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700
            rounded-lg text-gray-900 dark:text-white appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary
            focus:border-transparent transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-600'}
          `}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};
