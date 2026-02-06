'use client';

import DashboardSidebar from '@/components/DashboardSidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';

export default function DashboardLayout({ children, role }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            <div className="flex min-h-screen bg-background">
                {/* Sidebar Skeleton (Immediate render to prevent CLS) */}
                <div className="hidden md:block w-72 h-screen border-r border-gray-100 bg-white p-6">
                    <div className="w-32 h-8 bg-gray-100 rounded-xl mb-12 animate-pulse"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="w-full h-12 bg-gray-50 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
                {/* Main Content Skeleton */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-400 font-medium">Securing session...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] pb-24 md:pb-0">
            <DashboardSidebar
                role={role}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <main className="flex-1 md:ml-72 transition-all duration-500">
                <div className="p-4 md:p-10">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </div>
            </main>
            <MobileBottomNav
                role={role}
                onMenuClick={() => setIsSidebarOpen(true)}
            />
        </div>
    );
}
