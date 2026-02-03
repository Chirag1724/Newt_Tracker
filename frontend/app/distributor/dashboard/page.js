'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DistributorDashboard() {
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

        // Check if user is distributor
        if (!currentUser || currentUser.role !== 'distributor') {
            router.push('/login');
            return;
        }

        setUser(currentUser);
        fetchDashboardData();
    }, [router]);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard/distributor');
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
                        Hello, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Track your meetings and sales performance
                    </p>
                </div>

                {/* Stats Cards */}
                {dashboardData && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatsCard
                                title="Meetings Today"
                                value={dashboardData.stats.meetingsToday}
                                color="primary"
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                }
                            />

                            <StatsCard
                                title="Monthly Sales"
                                value={`₹${dashboardData.stats.monthlySales.toLocaleString()}`}
                                color="green"
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            />

                            <StatsCard
                                title="Total Meetings"
                                value={dashboardData.stats.totalMeetings}
                                color="secondary"
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            />

                            <StatsCard
                                title="Avg Sale Value"
                                value={`₹${dashboardData.stats.averageSaleValue.toLocaleString()}`}
                                color="blue"
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                }
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <button className="card hover:shadow-2xl transition-smooth bg-gradient-to-r from-primary to-primary/80 text-white p-8">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/20 p-4 rounded-lg">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-heading text-2xl font-bold mb-1">Log Meeting</h3>
                                        <p className="text-white/80">Record a new field meeting</p>
                                    </div>
                                </div>
                            </button>

                            <button className="card hover:shadow-2xl transition-smooth bg-gradient-to-r from-secondary to-secondary/80 text-white p-8">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/20 p-4 rounded-lg">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-heading text-2xl font-bold mb-1">Track Sale</h3>
                                        <p className="text-white/80">Record a new sale</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Weekly Performance Chart */}
                        <div className="card mb-8">
                            <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                Weekly Performance
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dashboardData.weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#2D5016" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#FF8C42" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="meetings" fill="#2D5016" name="Meetings" />
                                    <Bar yAxisId="right" dataKey="sales" fill="#FF8C42" name="Sales (₹)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Recent Activities */}
                        <div className="card">
                            <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                Recent Activities
                            </h3>
                            <div className="space-y-4">
                                {dashboardData.recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-smooth">
                                        <div className={`p-3 rounded-full ${activity.type === 'meeting' ? 'bg-primary' : 'bg-green-500'
                                            }`}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {activity.type === 'meeting' ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                )}
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-dark">{activity.description}</p>
                                            <p className="text-sm text-gray-600">{activity.location}</p>
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
