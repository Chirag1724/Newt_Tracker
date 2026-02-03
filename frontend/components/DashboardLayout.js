'use client';

import DashboardSidebar from '@/components/DashboardSidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';

export default function DashboardLayout({ children, role }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        const currentUser = getCurrentUser();

        // Check role permission
        if (!currentUser || currentUser.role !== role) {
            router.push('/login');
            return;
        }

        setLoading(false);
    }, [router, role]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebar role={role} />
            <main className="flex-1 md:ml-72">
                {children}
            </main>
        </div>
    );
}
