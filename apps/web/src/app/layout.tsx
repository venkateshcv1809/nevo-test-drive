import './global.css';
import { ThemeProvider } from '../hooks/useTheme';

export const metadata = {
    title: 'Nevo Test Drive',
    description: 'Nevo Test Drive - Experience the future of driving',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className="transition-colors duration-300">
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
