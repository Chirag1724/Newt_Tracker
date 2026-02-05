'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MeetingDetailModal from '@/components/MeetingDetailModal';
import SaleDetailModal from '@/components/SaleDetailModal';
import SampleDetailModal from '@/components/SampleDetailModal';
import { StatCardSkeleton, CardSkeleton } from '@/components/LoadingSkeletons';
import React, { memo } from 'react';

// Memoized Chart to prevent INP lag during interaction
const PerformanceChart = memo(({ data }) => (
    <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontWeight: 600 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#2D5016" axisLine={false} tickLine={false} tick={{ fill: '#2D5016', fontWeight: 600 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#FF8C42" axisLine={false} tickLine={false} tick={{ fill: '#FF8C42', fontWeight: 600 }} />
                <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                <Bar yAxisId="left" dataKey="meetings" fill="#2D5016" name="Meetings" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar yAxisId="right" dataKey="sales" fill="#FF8C42" name="Sales (₹)" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
        </ResponsiveContainer>
    </div>
));

PerformanceChart.displayName = 'PerformanceChart';

export default function DistributorDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState(null); // 'meeting', 'sale', 'sample'

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/dashboard/distributor');
            const data = response.data;

            // Merge weekly meetings and sales data
            const weeklyData = data.weekly_meetings?.map(meeting => {
                const sale = data.weekly_sales?.find(s => s.day === meeting.day);
                return {
                    day: meeting.day.trim(),
                    meetings: parseInt(meeting.meetings),
                    sales: sale ? parseFloat(sale.sales) : 0
                };
            }) || [];

            setDashboardData({
                ...data,
                weeklyData
            });
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                return;
            }
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <DashboardLayout role="distributor">
                <div className="min-h-screen bg-background flex items-center justify-center p-6">
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-red-700 max-w-lg w-full text-center">
                        <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-bold mb-2">Error Loading Dashboard</h3>
                        <p className="mb-6">{error}</p>
                        <button onClick={fetchDashboardData} className="btn-primary">
                            Try Again
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="distributor">
            <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Hackathon Connectivity & Trust Indicator */}
                    <div className="flex flex-wrap items-center gap-4 mb-6 animate-fadeIn">
                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full flex items-center space-x-2 text-sm font-bold border border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Connected: Rural Optimized</span>
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full flex items-center space-x-2 text-sm font-bold border border-blue-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span>GPS Verification Active</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8 animate-fadeIn">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark mb-2">
                            Hello, {user?.name}! 👋
                        </h1>
                        <p className="text-gray-600 text-lg font-medium">
                            Choose an action below to start
                        </p>
                    </div>

                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                        ) : (
                            <>
                                <StatsCard
                                    title="Meetings Today"
                                    value={dashboardData.stats.today_meetings || 0}
                                    color="primary"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    }
                                />

                                <StatsCard
                                    title="Monthly Sales"
                                    value={`₹${(dashboardData.stats.month_revenue || 0).toLocaleString()}`}
                                    color="green"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                />

                                <StatsCard
                                    title="Total Meetings"
                                    value={dashboardData.stats.total_meetings || 0}
                                    color="secondary"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                />

                                <StatsCard
                                    title="Avg Sale Value"
                                    value={`₹${(dashboardData.stats.avg_sale_value || 0).toLocaleString()}`}
                                    color="blue"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    }
                                />
                            </>
                        )}
                    </div>

                    {/* Quick Action Tiles - Simplified for Low Literacy */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <button
                            onClick={() => router.push('/distributor/log-meeting')}
                            className="flex flex-col items-center justify-center p-8 bg-primary rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 group"
                        >
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <span className="text-white text-2xl font-bold">Log Meeting</span>
                            <span className="text-white/70 font-medium text-sm mt-1 text-center">Record meeting with proof</span>
                        </button>

                        <button
                            onClick={() => router.push('/distributor/track-sales')}
                            className="flex flex-col items-center justify-center p-8 bg-secondary rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 group"
                        >
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-white text-2xl font-bold">Track Sale</span>
                            <span className="text-white/70 font-medium text-sm mt-1 text-center">Confirm product sale</span>
                        </button>

                        <button
                            onClick={() => router.push('/distributor/distribute-sample')}
                            className="flex flex-col items-center justify-center p-8 bg-accent rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 group sm:col-span-2 lg:col-span-1"
                        >
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="text-white text-2xl font-bold">Give Sample</span>
                            <span className="text-white/70 font-medium text-sm mt-1 text-center">Log sample handout</span>
                        </button>
                    </div>

                    {!loading && dashboardData ? (
                        <>
                            {/* Weekly Chart */}
                            <div className="card-premium mb-8">
                                <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                    Your Weekly Performance
                                </h3>
                                <PerformanceChart data={dashboardData.weeklyData} />
                            </div>

                            {/* Recent Activities */}
                            <div className="card-premium">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-heading text-2xl font-bold text-dark">
                                        Your Recent Activity
                                    </h3>
                                    <button onClick={() => router.push('/distributor/meetings')} className="text-sm font-bold text-primary hover:underline">
                                        View All
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {(dashboardData.recent_activities && dashboardData.recent_activities.length > 0) ? (
                                        dashboardData.recent_activities.map((activity) => (
                                            <div
                                                key={`${activity.type}-${activity.id}`}
                                                onClick={() => {
                                                    setSelectedItem(activity);
                                                    setItemType(activity.type);
                                                }}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20"
                                            >
                                                <div className="flex items-center space-x-5">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${activity.type === 'meeting' ? 'bg-primary' : activity.type === 'sale' ? 'bg-secondary' : 'bg-accent'}`}>
                                                        {activity.type === 'meeting' ? 'M' : activity.type === 'sale' ? 'S' : 'P'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-dark text-lg">{activity.description}</p>
                                                        <p className="text-sm text-gray-500 font-semibold">{activity.location}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-700">
                                                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                        {new Date(activity.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 font-bold">No recent activity yet</p>
                                            <p className="text-sm text-gray-400">Your logged meetings and sales will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <CardSkeleton />
                            <CardSkeleton />
                        </div>
                    )}

                    {/* Modals */}
                    {itemType === 'meeting' && (
                        <MeetingDetailModal
                            meeting={selectedItem}
                            onClose={() => { setSelectedItem(null); setItemType(null); }}
                        />
                    )}
                    {itemType === 'sale' && (
                        <SaleDetailModal
                            sale={selectedItem}
                            onClose={() => { setSelectedItem(null); setItemType(null); }}
                        />
                    )}
                    {itemType === 'sample' && (
                        <SampleDetailModal
                            sample={selectedItem}
                            onClose={() => { setSelectedItem(null); setItemType(null); }}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
