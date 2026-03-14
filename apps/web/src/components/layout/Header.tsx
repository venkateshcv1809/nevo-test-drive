import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Header: React.FC = () => {
    return (
        <header className="bg-white dark:bg-gray-900 border-b border-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-primary"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10.5 2.5a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5v1.5h3v-1.5zM4.5 4a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-11zM3 8.5A1.5 1.5 0 014.5 7h11A1.5 1.5 0 0117 8.5v6a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 14.5v-6zM6 12a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-xl font-bold text-primary">Nevo</h1>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                EV Test Drive Booking
                            </p>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};
