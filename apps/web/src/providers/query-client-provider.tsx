'use client';

import {
    QueryClient,
    QueryClientProvider as TanStackQueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 minutes
                        retry: (failureCount, error) => {
                            // Don't retry on 4xx errors
                            if (error instanceof Error && 'status' in error) {
                                const status = (error as { status?: number }).status;
                                if (status && status >= 400 && status < 500) {
                                    return false;
                                }
                            }
                            return failureCount < 3;
                        },
                        refetchOnWindowFocus: false,
                    },
                    mutations: {
                        retry: false,
                    },
                },
            })
    );

    return (
        <TanStackQueryClientProvider client={queryClient}>{children}</TanStackQueryClientProvider>
    );
}
