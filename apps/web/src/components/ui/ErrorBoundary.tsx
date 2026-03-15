'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { APIErrorBoundary } from './APIErrorBoundary';

// Error types for categorization
type ErrorType = 'render' | 'network' | 'permission' | 'unknown';

interface CategorizedError extends Error {
    type?: ErrorType;
    isRecoverable?: boolean;
}

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    navigate?: (path: string) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const categorizedError = this.categorizeError(error);
        console.error('ErrorBoundary caught an error:', categorizedError, errorInfo);

        this.setState({
            error: categorizedError,
            errorInfo,
        });

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(categorizedError, errorInfo);
        }

        // Enhanced error logging
        this.logError(categorizedError, errorInfo);
    }

    private categorizeError(error: Error): CategorizedError {
        const categorizedError = error as CategorizedError;

        // Network errors
        if (error.message.includes('Network Error') || error.message.includes('fetch')) {
            categorizedError.type = 'network';
            categorizedError.isRecoverable = true;
        }
        // Permission errors
        else if (error.message.includes('Permission') || error.message.includes('Unauthorized')) {
            categorizedError.type = 'permission';
            categorizedError.isRecoverable = false;
        }
        // Render errors (default)
        else {
            categorizedError.type = 'render';
            categorizedError.isRecoverable = true;
        }

        return categorizedError;
    }

    private logError(error: CategorizedError, errorInfo: ErrorInfo): void {
        // Console logging only
        console.error('Error logged:', {
            message: error.message,
            stack: error.stack,
            type: error.type,
            isRecoverable: error.isRecoverable,
            componentStack: errorInfo.componentStack,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = () => {
        if (this.props.navigate) {
            this.props.navigate('/');
        } else {
            // Fallback for non-React Router environments
            window.location.href = '/';
        }
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div
                    className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4"
                    role="alert"
                    aria-live="assertive"
                >
                    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                        {/* Error Icon */}
                        <div
                            className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6"
                            aria-hidden="true"
                        >
                            <svg
                                className="w-8 h-8 text-red-600 dark:text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>

                        {/* Error Message */}
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Something went wrong
                        </h1>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We encountered an unexpected error. Don't worry, our team has been
                            notified.
                        </p>

                        {/* Error Details (Development Only) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary
                                    className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-2"
                                    aria-expanded="false"
                                >
                                    Error Details
                                </summary>
                                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-32">
                                    <div className="mb-2">
                                        <strong>Error:</strong> {this.state.error.message}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Type:</strong>{' '}
                                        {(this.state.error as CategorizedError).type || 'unknown'}
                                    </div>
                                    {this.state.error.stack && (
                                        <div>
                                            <strong>Stack:</strong>
                                            <pre className="whitespace-pre-wrap mt-1">
                                                {this.state.error.stack}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={this.handleReset}
                                variant="primary"
                                className="flex items-center justify-center gap-2"
                                aria-label="Try to recover from the error"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Try Again
                            </Button>

                            <Button
                                onClick={this.handleGoHome}
                                variant="secondary"
                                className="flex items-center justify-center gap-2"
                                aria-label="Navigate to home page"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2v-10M10 12l7-7m0 0l-7-7"
                                    />
                                </svg>
                                Go Home
                            </Button>
                        </div>

                        {/* Support Info */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                If this problem persists, please contact our support team.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook for functional components to handle errors
const useErrorHandler = () => {
    const [error, setError] = React.useState<CategorizedError | null>(null);

    const resetError = React.useCallback(() => {
        setError(null);
    }, []);

    const captureError = React.useCallback((error: Error) => {
        const categorizedError = error as CategorizedError;

        // Basic categorization for functional components
        if (error.message.includes('Network Error') || error.message.includes('fetch')) {
            categorizedError.type = 'network';
            categorizedError.isRecoverable = true;
        } else if (error.message.includes('Permission') || error.message.includes('Unauthorized')) {
            categorizedError.type = 'permission';
            categorizedError.isRecoverable = false;
        } else {
            categorizedError.type = 'render';
            categorizedError.isRecoverable = true;
        }

        console.error('Error captured by useErrorHandler:', categorizedError);
        setError(categorizedError);
    }, []);

    // Throw error to be caught by ErrorBoundary
    React.useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    return { captureError, resetError };
};

export { ErrorBoundary, APIErrorBoundary, useErrorHandler };
