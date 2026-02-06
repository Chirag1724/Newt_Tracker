'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import MeetingDetailModal from '@/components/MeetingDetailModal';
import SaleDetailModal from '@/components/SaleDetailModal';
import SampleDetailModal from '@/components/SampleDetailModal';
import { StatCardSkeleton, CardSkeleton } from '@/components/LoadingSkeletons';
import React, { memo } from 'react';

// Memoized Charts for performance
const SalesTrendChart = memo(({ data }) => (
    <div className="card-premium h-[320px] md:h-auto overflow-hidden">
        <h3 className="font-heading text-lg md:text-2xl font-bold text-slate-900 mb-2 md:mb-6">
            Sales Trend
        </h3>
        <div className="h-[200px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        formatter={(value) => `₹${parseFloat(value).toLocaleString('en-IN')}`}
                        labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN')}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#2D5016" strokeWidth={3} dot={{ r: 4, fill: '#2D5016' }} activeDot={{ r: 6 }} name="Revenue" isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
));

const RevenuePieChart = memo(({ data }) => (
    <div className="card-premium h-[320px] md:h-auto overflow-hidden">
        <h3 className="font-heading text-lg md:text-2xl font-bold text-slate-900 mb-2 md:mb-6">
            Revenue Source
        </h3>
        <div className="h-[200px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        isAnimationActive={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        formatter={(value) => `₹${parseFloat(value).toLocaleString('en-IN')}`}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
));

const MeetingsTrendChart = memo(({ data }) => (
    <div className="card-premium h-[320px] md:h-auto overflow-hidden">
        <h3 className="font-heading text-lg md:text-2xl font-bold text-slate-900 mb-2 md:mb-6">
            Activity Trend
        </h3>
        <div className="h-[200px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN')}
                    />
                    <Bar dataKey="one_on_one" stackId="a" fill="#2D5016" radius={[4, 4, 0, 0]} name="One-on-One" isAnimationActive={false} />
                    <Bar dataKey="group_count" stackId="a" fill="#FF8C42" radius={[4, 4, 0, 0]} name="Group" isAnimationActive={false} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
));

SalesTrendChart.displayName = 'SalesTrendChart';
RevenuePieChart.displayName = 'RevenuePieChart';
MeetingsTrendChart.displayName = 'MeetingsTrendChart';

const COLORS = ['#2D5016', '#FF8C42', '#8B4513', '#4F46E5', '#10B981'];

export default function AdminDashboard() {
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
            const response = await api.get('/dashboard/admin');
            setDashboardData(response.data);
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <DashboardLayout role="admin">
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

    // Prepare chart data memoized
    const salesTypeData = React.useMemo(() => dashboardData?.stats ? [
        { name: 'B2C', value: parseFloat(dashboardData.stats.b2c_revenue || 0) },
        { name: 'B2B', value: parseFloat(dashboardData.stats.b2b_revenue || 0) }
    ] : [], [dashboardData?.stats]);

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header - Premium Header */}
                    <div className="mb-6 md:mb-10 animate-fadeIn">
                        <div className="flex items-center gap-2 text-primary opacity-60 mb-2">
                            <span className="w-6 md:w-8 h-[2px] bg-current rounded-full"></span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Admin Control Center</span>
                        </div>
                        <h1 className="font-heading text-3xl md:text-6xl font-black text-slate-900 mb-2 tracking-tighter leading-none">
                            Welcome, {user?.name.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-slate-500 text-xs md:text-xl font-medium max-w-2xl leading-relaxed">
                            A real-time snapshot of your entire operations.
                        </p>
                    </div>

                    {/* Stats Cards Section - Responsive Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>

                    {!loading && dashboardData && (
                        <>
                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10">
                                <SalesTrendChart data={dashboardData.sales_trend} />
                                <RevenuePieChart data={salesTypeData} />
                                <MeetingsTrendChart data={dashboardData.meetings_trend} />

                                {/* Top Performers - Premium List */}
                                <div className="card-premium">
                                    <div className="flex items-center justify-between mb-6 md:mb-8">
                                        <h3 className="font-heading text-xl md:text-2xl font-bold text-slate-900">Top Performers</h3>
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
                                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="space-y-3 md:space-y-4">
                                        {dashboardData.top_performers && dashboardData.top_performers.slice(0, 5).map((performer, index) => (
                                            <div key={performer.id} className="flex items-center justify-between p-3 md:p-4 bg-slate-50/50 rounded-2xl md:rounded-3xl hover:bg-slate-100/50 transition-all duration-300 border border-transparent hover:border-slate-200">
                                                <div className="flex items-center space-x-3 md:space-x-4">
                                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold shadow-lg text-xs md:text-base ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 scale-110' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-600' : 'bg-slate-200 text-slate-400 shadow-none'}`}>
                                                        {index + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-slate-900 text-xs md:text-sm truncate">{performer.name}</p>
                                                        <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-wider">{performer.state}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-black text-primary text-xs md:text-sm">₹{parseFloat(performer.revenue || 0).toLocaleString('en-IN')}</p>
                                                    <p className="text-[8px] md:text-[10px] text-slate-400 font-bold">{performer.sales} Sales</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* State Stats Table - Responsive Container */}
                            <div className="card-premium overflow-hidden">
                                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-8 px-2">Regional Performance Breakdown</h3>
                                <div className="overflow-x-auto -mx-2">
                                    <table className="w-full text-left border-separate border-spacing-y-2">
                                        <thead>
                                            <tr className="text-slate-400 text-xs font-black uppercase tracking-widest">
                                                <th className="py-4 px-6 font-black">State</th>
                                                <th className="py-4 px-6 text-center">Distributors</th>
                                                <th className="py-4 px-6 text-center">Meetings</th>
                                                <th className="py-4 px-6 text-right">Revenue Generated</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboardData.state_stats && dashboardData.state_stats.map(state => (
                                                <tr key={state.state} className="group hover:bg-slate-50/80 transition-all">
                                                    <td className="py-4 px-6 rounded-l-3xl bg-slate-50/50 group-hover:bg-transparent font-black text-slate-900">{state.state}</td>
                                                    <td className="py-4 px-6 text-center bg-slate-50/50 group-hover:bg-transparent text-slate-600 font-bold">{state.distributors}</td>
                                                    <td className="py-4 px-6 text-center bg-slate-50/50 group-hover:bg-transparent text-slate-600 font-bold">{state.meetings}</td>
                                                    <td className="py-4 px-6 rounded-r-3xl bg-slate-50/50 group-hover:bg-transparent text-right font-black text-primary tracking-tight">
                                                        ₹{parseFloat(state.sales || 0).toLocaleString('en-IN')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recent Activity List - Premium Design */}
                            <div className="card-premium">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-heading text-2xl font-bold text-dark">Recent Team Activity</h3>
                                    <span className="bg-primary/5 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Live Updates</span>
                                </div>
                                <div className="space-y-4">
                                    {dashboardData.recent_activities && dashboardData.recent_activities.slice(0, 10).map((activity) => (
                                        <div
                                            key={`${activity.type}-${activity.id}`}
                                            onClick={() => {
                                                setSelectedItem(activity);
                                                setItemType(activity.type);
                                            }}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-smooth cursor-pointer border-2 border-transparent hover:border-primary/20"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${activity.type === 'meeting' ? 'bg-primary' : activity.type === 'sale' ? 'bg-secondary' : 'bg-accent'}`}>
                                                    {activity.type === 'meeting' ? 'M' : activity.type === 'sale' ? 'S' : 'P'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-dark">{activity.description}</p>
                                                    <p className="text-xs text-gray-500 font-semibold">
                                                        {activity.user_name} • {activity.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-bold">
                                                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-semibold">
                                                    {new Date(activity.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {loading && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <CardSkeleton />
                            <CardSkeleton />
                        </div>
                    )}
                </div>
            </div>

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
        </DashboardLayout>
    );
}
