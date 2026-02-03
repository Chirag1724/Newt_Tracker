'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#2D5016', '#FF8C42', '#8B4513', '#4F46E5', '#10B981'];

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        fetchDashboardData();
    }, []);

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
            <DashboardLayout role="admin">
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout role="admin">
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="card bg-red-100 border-l-4 border-red-500 text-red-700">
                        <p className="font-semibold">Error</p>
                        <p>{error}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Prepare chart data
    const salesTypeData = dashboardData?.stats ? [
        { name: 'B2C', value: parseFloat(dashboardData.stats.b2c_revenue || 0) },
        { name: 'B2B', value: parseFloat(dashboardData.stats.b2b_revenue || 0) }
    ] : [];

    return (
        <DashboardLayout role="admin">
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
                                    value={dashboardData.stats.total_meetings || 0}
                                    color="primary"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    }
                                />

                                <StatsCard
                                    title="Total Revenue"
                                    value={`₹${parseFloat(dashboardData.stats.total_revenue || 0).toLocaleString('en-IN')}`}
                                    color="green"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                />

                                <StatsCard
                                    title="Total Distributors"
                                    value={dashboardData.stats.total_distributors || 0}
                                    color="secondary"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    }
                                />

                                <StatsCard
                                    title="Today's Meetings"
                                    value={dashboardData.stats.today_meetings || 0}
                                    color="blue"
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    }
                                />
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                {/* Sales Trend Chart */}
                                <div className="card-premium">
                                    <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                        Sales Trend (Last 30 Days)
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={dashboardData.sales_trend || []}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                            />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) => `₹${parseFloat(value).toLocaleString('en-IN')}`}
                                                labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN')}
                                            />
                                            <Legend />
                                            <Line type="monotone" dataKey="revenue" stroke="#2D5016" strokeWidth={3} name="Revenue" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* B2C vs B2B Pie Chart */}
                                <div className="card-premium">
                                    <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                        B2C vs B2B Revenue
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={salesTypeData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry) => `${entry.name}: ₹${entry.value.toLocaleString('en-IN')}`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {salesTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `₹${parseFloat(value).toLocaleString('en-IN')}`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Meetings Trend */}
                                <div className="card-premium">
                                    <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                        Meetings Trend (Last 30 Days)
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={dashboardData.meetings_trend || []}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                            />
                                            <YAxis />
                                            <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN')} />
                                            <Legend />
                                            <Bar dataKey="one_on_one" stackId="a" fill="#2D5016" name="One-on-One" />
                                            <Bar dataKey="group_count" stackId="a" fill="#FF8C42" name="Group" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Top Performers */}
                                <div className="card-premium">
                                    <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                        Top Performers (This Month)
                                    </h3>
                                    <div className="space-y-4">
                                        {dashboardData.top_performers && dashboardData.top_performers.slice(0, 5).map((performer, index) => (
                                            <div key={performer.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-smooth">
                                                <div className="flex-shrink-0">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                                        index === 1 ? 'bg-gray-400' :
                                                            index === 2 ? 'bg-amber-600' :
                                                                'bg-primary'
                                                        }`}>
                                                        {index + 1}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-dark">{performer.name}</p>
                                                    <p className="text-xs text-gray-500">{performer.state} • {performer.district}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-primary">₹{parseFloat(performer.revenue || 0).toLocaleString('en-IN')}</p>
                                                    <p className="text-xs text-gray-500">{performer.sales || 0} sales</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* State-wise Stats */}
                            <div className="card-premium mb-8">
                                <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                    State-wise Activity
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-dark">State</th>
                                                <th className="text-center py-3 px-4 font-semibold text-dark">Distributors</th>
                                                <th className="text-center py-3 px-4 font-semibold text-dark">Meetings</th>
                                                <th className="text-right py-3 px-4 font-semibold text-dark">Sales Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboardData.state_stats && dashboardData.state_stats.map(state => (
                                                <tr key={state.state} className="border-b border-gray-100 hover:bg-gray-50 transition-smooth">
                                                    <td className="py-3 px-4 font-semibold text-dark">{state.state}</td>
                                                    <td className="py-3 px-4 text-center text-gray-600">{state.distributors}</td>
                                                    <td className="py-3 px-4 text-center text-gray-600">{state.meetings}</td>
                                                    <td className="py-3 px-4 text-right font-bold text-primary">
                                                        ₹{parseFloat(state.sales || 0).toLocaleString('en-IN')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recent Activities */}
                            <div className="card-premium">
                                <h3 className="font-heading text-2xl font-bold text-dark mb-6">
                                    Recent Activities
                                </h3>
                                <div className="space-y-4">
                                    {dashboardData.recent_activities && dashboardData.recent_activities.slice(0, 10).map((activity) => (
                                        <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-smooth">
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
                                                <p className="text-sm text-gray-600">
                                                    {activity.user_name} • {activity.location}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(activity.timestamp).toLocaleString('en-IN')}
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
        </DashboardLayout>
    );
}
