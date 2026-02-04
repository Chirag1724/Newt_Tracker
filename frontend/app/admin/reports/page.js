'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';
import { PageLoader } from '@/components/LoadingSkeletons';
import { exportMeetingsCSV, exportSalesCSV, exportSamplesCSV } from '@/lib/exportUtils';

export default function AdminReportsPage() {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [dateRange, setDateRange] = useState({
        from_date: '',
        to_date: ''
    });

    useEffect(() => {
        // Set default to current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const from = firstDay.toISOString().split('T')[0];
        const to = now.toISOString().split('T')[0];

        if (dateRange.from_date !== from || dateRange.to_date !== to) {
            setDateRange({
                from_date: from,
                to_date: to
            });
        }
    }, []);

    useEffect(() => {
        if (dateRange.from_date && dateRange.to_date) {
            fetchReportData();
        }
    }, [dateRange]);

    const fetchReportData = async () => {
        if (loading && reportData) return; // Prevent duplicate fetches

        try {
            setLoading(true);
            const [dashboardRes, meetingsRes, salesRes, samplesRes] = await Promise.all([
                api.get(`/dashboard/admin?from_date=${dateRange.from_date}&to_date=${dateRange.to_date}`),
                api.get('/meetings'),
                api.get('/sales'),
                api.get('/samples')
            ]);

            setReportData({
                dashboard: dashboardRes.data,
                meetings: meetingsRes.data.meetings || [],
                sales: salesRes.data.sales || [],
                samples: samplesRes.data.samples || []
            });
        } catch (error) {
            console.error('Admin Reports Fetch Error:', error);
            // Don't alert here to avoid spamming the user, just log it
        } finally {
            setLoading(false);
        }
    };

    const generateMonthlyReport = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        setDateRange({
            from_date: firstDay.toISOString().split('T')[0],
            to_date: now.toISOString().split('T')[0]
        });
    };

    const generateWeeklyReport = () => {
        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        setDateRange({
            from_date: weekAgo.toISOString().split('T')[0],
            to_date: now.toISOString().split('T')[0]
        });
    };

    const generateYearlyReport = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), 0, 1);
        setDateRange({
            from_date: firstDay.toISOString().split('T')[0],
            to_date: now.toISOString().split('T')[0]
        });
    };

    if (loading && !reportData) return <PageLoader />;

    const stats = reportData?.dashboard?.stats || {};
    const stateStats = reportData?.dashboard?.state_stats || [];
    const topPerformers = reportData?.dashboard?.top_performers || [];

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-dark mb-2">Reports & Analytics</h1>
                        <p className="text-gray-600">Generate detailed reports and insights</p>
                    </div>

                    {/* Quick Report Buttons */}
                    <div className="card-premium mb-8">
                        <h2 className="text-xl font-bold text-dark mb-4">Quick Reports</h2>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={generateWeeklyReport} className="btn-soft">
                                📅 Last 7 Days
                            </button>
                            <button onClick={generateMonthlyReport} className="btn-soft">
                                📊 This Month
                            </button>
                            <button onClick={generateYearlyReport} className="btn-soft">
                                📈 This Year
                            </button>
                        </div>
                    </div>

                    {/* Custom Date Range */}
                    <div className="card-premium mb-8">
                        <h2 className="text-xl font-bold text-dark mb-4">Custom Date Range</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                                <input
                                    type="date"
                                    value={dateRange.from_date}
                                    onChange={(e) => setDateRange({ ...dateRange, from_date: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                                <input
                                    type="date"
                                    value={dateRange.to_date}
                                    onChange={(e) => setDateRange({ ...dateRange, to_date: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="flex items-end">
                                <button onClick={fetchReportData} className="btn-primary w-full">
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="card-premium bg-gradient-to-br from-green-50 to-green-100">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Meetings</h3>
                            <p className="text-4xl font-bold text-primary">{stats.total_meetings || 0}</p>
                            <p className="text-sm text-gray-600 mt-2">
                                This Week: {stats.week_meetings || 0}
                            </p>
                        </div>
                        <div className="card-premium bg-gradient-to-br from-blue-50 to-blue-100">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Sales</h3>
                            <p className="text-4xl font-bold text-blue-600">{stats.total_sales || 0}</p>
                            <p className="text-sm text-gray-600 mt-2">
                                B2C: {stats.b2c_count || 0} | B2B: {stats.b2b_count || 0}
                            </p>
                        </div>
                        <div className="card-premium bg-gradient-to-br from-orange-50 to-orange-100">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Revenue</h3>
                            <p className="text-4xl font-bold text-orange-600">
                                ₹{parseFloat(stats.total_revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                This Month: ₹{parseFloat(stats.month_revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                        <div className="card-premium bg-gradient-to-br from-purple-50 to-purple-100">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Samples Distributed</h3>
                            <p className="text-4xl font-bold text-purple-600">{stats.total_samples || 0}</p>
                            <p className="text-sm text-gray-600 mt-2">
                                Distributions: {stats.total_distributions || 0}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* State-wise Performance */}
                        <div className="card-premium">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-dark">State-wise Activity</h2>
                                <button className="btn-soft text-sm">
                                    Export
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-2 font-semibold text-dark text-sm">State</th>
                                            <th className="text-center py-3 px-2 font-semibold text-dark text-sm">Distributors</th>
                                            <th className="text-center py-3 px-2 font-semibold text-dark text-sm">Meetings</th>
                                            <th className="text-right py-3 px-2 font-semibold text-dark text-sm">Sales</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stateStats.slice(0, 10).map((state, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-2 font-semibold text-dark text-sm">{state.state}</td>
                                                <td className="py-3 px-2 text-center text-gray-600 text-sm">{state.distributors}</td>
                                                <td className="py-3 px-2 text-center text-gray-600 text-sm">{state.meetings}</td>
                                                <td className="py-3 px-2 text-right font-semibold text-primary text-sm">
                                                    ₹{parseFloat(state.sales || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Performers */}
                        <div className="card-premium">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-dark">Top Performers (Last 30 Days)</h2>
                                <button className="btn-soft text-sm">
                                    Export
                                </button>
                            </div>
                            <div className="space-y-4">
                                {topPerformers.slice(0, 5).map((performer, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-smooth">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 text-white rounded-full flex items-center justify-center font-bold">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-dark">{performer.name}</p>
                                                <p className="text-sm text-gray-600">{performer.state}, {performer.district}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary">
                                                ₹{parseFloat(performer.revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {performer.meetings} meetings • {performer.sales} sales
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Export Options */}
                    <div className="card-premium">
                        <h2 className="text-xl font-bold text-dark mb-6">Export Data</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => reportData?.meetings && exportMeetingsCSV(reportData.meetings)}
                                className="btn-soft flex items-center justify-center gap-2 py-4"
                                disabled={!reportData?.meetings}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export Meetings
                            </button>
                            <button
                                onClick={() => reportData?.sales && exportSalesCSV(reportData.sales)}
                                className="btn-soft flex items-center justify-center gap-2 py-4"
                                disabled={!reportData?.sales}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export Sales
                            </button>
                            <button
                                onClick={() => reportData?.samples && exportSamplesCSV(reportData.samples)}
                                className="btn-soft flex items-center justify-center gap-2 py-4"
                                disabled={!reportData?.samples}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export Samples
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
