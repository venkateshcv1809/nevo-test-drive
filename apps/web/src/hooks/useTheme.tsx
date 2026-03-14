'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
            setTheme(savedTheme);
        } else {
            setTheme('dark');
        }
    }, []);

    useEffect(() => {
        // Apply theme to html element and save preference
        const htmlElement = document.documentElement;
        htmlElement.classList.remove('dark', 'light');
        htmlElement.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
