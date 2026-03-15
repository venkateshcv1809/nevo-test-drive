'use client';
import React, { Component, ReactNode } from 'react';
import { Button } from './Button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    retryCount: number;
}

export class APIErrorBoundary extends Component<Props, State> {
    private maxRetries = 3;

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            retryCount: 0,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('APIErrorBoundary caught an error:', error, errorInfo);

        // Enhanced API error logging
        this.logApiError(error, errorInfo);
    }

    private logApiError(error: Error, errorInfo: React.ErrorInfo): void {
        const isNetworkError =
            error.message.includes('fetch') ||
            error.message.includes('network') ||
            error.message.includes('Failed to fetch');

        // Console logging only
        console.error('API Error logged:', {
            message: error.message,
            stack: error.stack,
            type: isNetworkError ? 'network' : 'api',
            retryCount: this.state.retryCount,
            componentStack: errorInfo.componentStack,
        });
    }

    handleRetry = () => {
        if (this.state.retryCount < this.maxRetries) {
            this.setState((prevState) => ({
                hasError: false,
                error: null,
                retryCount: prevState.retryCount + 1,
            }));
        }
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default API error UI
            const isNetworkError =
                this.state.error?.message.includes('fetch') ||
                this.state.error?.message.includes('network') ||
                this.state.error?.message.includes('Failed to fetch');

            const canRetry = this.state.retryCount < this.maxRetries;

            return (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
                    <div className="flex items-start">
                        {/* Error Icon */}
                        <div className="flex-shrink-0">
                            {isNetworkError ? (
                                <svg
                                    className="w-5 h-5 text-red-600 dark:text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5 text-red-600 dark:text-red-400"
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
                            )}
                        </div>

                        {/* Error Content */}
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                {isNetworkError ? 'Connection Error' : 'API Error'}
                            </h3>

                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                {isNetworkError ? (
                                    <p>
                                        Unable to connect to our servers. Please check your internet
                                        connection and try again.
                                    </p>
                                ) : (
                                    <p>
                                        Something went wrong while fetching data. Our team has been
                                        notified.
                                    </p>
                                )}
                            </div>

                            {/* Retry Button */}
                            {canRetry && (
                                <div className="mt-3">
                                    <Button
                                        onClick={this.handleRetry}
                                        variant="secondary"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        Retry ({this.maxRetries - this.state.retryCount} attempts
                                        left)
                                    </Button>
                                </div>
                            )}

                            {/* Max retries reached */}
                            {!canRetry && (
                                <div className="mt-3 text-sm text-red-600 dark:text-red-400">
                                    Maximum retry attempts reached. Please refresh the page or
                                    contact support.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
