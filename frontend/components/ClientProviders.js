'use client';

import { useEffect } from 'react';
import { Toaster } from 'sonner';

export default function ClientProviders({ children }) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js').then(function (registration) {
                    console.log('ServiceWorker registration successful');
                }, function (err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }
    }, []);

    return (
        <>
            {children}
            <Toaster position="top-right" richColors closeButton />
        </>
    );
}
