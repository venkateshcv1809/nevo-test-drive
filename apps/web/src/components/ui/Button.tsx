import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            children,
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClasses =
            'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 w-full sm:w-auto';

        const variantClasses = {
            primary:
                'bg-primary text-white hover:opacity-90 focus:ring-primary shadow-lg shadow-primary/25',
            secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
            success:
                'bg-success text-black hover:opacity-90 focus:ring-success shadow-lg shadow-success/25',
            warning:
                'bg-warning text-black hover:opacity-90 focus:ring-warning shadow-lg shadow-warning/25',
            error: 'bg-error text-white hover:opacity-90 focus:ring-error shadow-lg shadow-error/25',
        };

        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base sm:px-5 py-2.5 sm:text-lg',
            lg: 'px-6 py-3 text-lg sm:px-8 py-4 sm:text-xl',
        };

        const classes = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${className}
    `.trim();

        return (
            <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
                {loading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
