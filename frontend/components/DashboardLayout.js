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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Sync check on mount
        const authenticated = isAuthenticated();
        const currentUser = getCurrentUser();

        if (!authenticated || !currentUser || currentUser.role !== role) {
            router.push('/login');
            return;
        }

        setLoading(false);
    }, [router, role]);

    return (
        <div className="flex min-h-screen bg-background pb-24 md:pb-0 relative">
            {/* Background Decorative Effects - Constant position in DOM tree */}
            <div className="fixed inset-0 pointer-events-none -z-10" 
                style={{
                    background: `
                        radial-gradient(circle at top right, rgba(45, 80, 22, 0.05) 0%, transparent 40%),
                        radial-gradient(circle at bottom left, rgba(255, 140, 66, 0.03) 0%, transparent 35%)
                    `
                }}
            />

            {loading ? (
                <>
                    {/* Sidebar Skeleton (Matching aside tag) */}
                    <aside className="hidden md:block fixed left-0 top-0 h-screen w-72 border-r border-gray-100 bg-white p-6 z-[60]">
                        <div className="w-32 h-8 bg-gray-100 rounded-xl mb-12 animate-pulse"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="w-full h-12 bg-gray-50 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    </aside>
                    
                    {/* Main Content Skeleton (Matching main tag and margins) */}
                    <main className="flex-1 md:ml-72 transition-all duration-500">
                        <div className="py-4 md:py-10 px-2 md:px-4">
                            <div className="max-w-7xl mx-auto text-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-gray-400 font-medium">Securing session...</p>
                            </div>
                        </div>
                    </main>
                    <div className="md:hidden" /> {/* Spacer for MobileBottomNav position */}
                </>
            ) : (
                <>
                    <DashboardSidebar
                        role={role}
                        isOpen={isSidebarOpen}
                        setIsOpen={setIsSidebarOpen}
                    />
                    <main className="flex-1 md:ml-72 transition-all duration-500">
                        <div className="py-4 md:py-10 px-2 md:px-4">
                            <div className="max-w-7xl mx-auto space-y-8">
                                {children}
                            </div>
                        </div>
                    </main>
                    <MobileBottomNav
                        role={role}
                        onMenuClick={() => setIsSidebarOpen(true)}
                    />
                </>
            )}
        </div>
    );
}
