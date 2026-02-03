'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        const currentUser = getCurrentUser();

        // Check if user is admin
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/login');
            return;
        }

        setUser(currentUser);
        fetchDashboardData();
    }, [router]);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard/admin');
            setDashboardData(response.data);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="card bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p className="font-semibold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fadeIn">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark mb-2">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Here's what's happening with your team today
                    </p>
                </div>

                {/* Stats Cards */}
                {dashboardData && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatsCard
                                title="Total Meetings"
                                value={dashboardData.stats.totalMeetings}
                                color="primary"
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                }
                            />

                            <StatsCard
                                title="Total Sales"
                                value={`₹${dashboardData.stats.totalSales.toLocaleString()}`}
                                color="green"
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            />

                            <StatsCard
                                title="Total Distributors"
                                value={dashboardData.stats.totalDistributors}
                                color="secondary"
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                }
                            />

                            <StatsCard
                                title="Active Today"
                                value={dashboardData.stats.activeMeetingsToday}
                                color="blue"
                                subtitle="meetings"
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                }
                            />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Monthly Performance Chart */}
                            <div className="card">
                                <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                    Monthly Performance
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dashboardData.monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis yAxisId="left" orientation="left" stroke="#2D5016" />
                                        <YAxis yAxisId="right" orientation="right" stroke="#FF8C42" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="meetings" fill="#2D5016" name="Meetings" />
                                        <Bar yAxisId="right" dataKey="sales" fill="#FF8C42" name="Sales (₹)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Trend Chart */}
                            <div className="card">
                                <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                    Sales Trend
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={dashboardData.monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="sales" stroke="#2D5016" strokeWidth={2} name="Sales (₹)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="card">
                            <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                Recent Activities
                            </h3>
                            <div className="space-y-4">
                                {dashboardData.recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-smooth">
                                        <div className={`p-3 rounded-full ${activity.type === 'meeting' ? 'bg-primary' :
                                                activity.type === 'sale' ? 'bg-green-500' :
                                                    'bg-secondary'
                                            }`}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {activity.type === 'meeting' ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                ) : activity.type === 'sale' ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                )}
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-dark">{activity.description}</p>
                                            <p className="text-sm text-gray-600">
                                                {activity.distributor} • {activity.location}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
