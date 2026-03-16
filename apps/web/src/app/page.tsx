'use client';
import React from 'react';
import { Header } from '../components/layout/Header';
import { Container } from '../components/layout/Container';
import BookingHero from './_sections/BookingHero';
import BookingStage from './_sections/BookingStage';
import { BookingSummary } from './_sections/BookingSummary';
import { CustomerModal } from './_widgets/CustomerModal';

export default function Index() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
            <Header />
            <main className="py-8">
                <Container size="xl">
                    <div className="space-y-8">
                        <BookingHero />
                        <BookingSummary />
                        <BookingStage />
                    </div>
                </Container>
            </main>
            <CustomerModal />
        </div>
    );
}
