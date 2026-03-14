'use client';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';

export default function Index() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
            <Header />
            <main className="py-8">
                <Container size="xl">Welcome to Nevo Test Drive!</Container>
            </main>
        </div>
    );
}
