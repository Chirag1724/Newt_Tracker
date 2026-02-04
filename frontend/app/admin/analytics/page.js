'use client';

import React, { useState, useEffect, memo } from 'react';
import api from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';

const COLORS = ['#2E7D32', '#1565C0', '#f39c12', '#d35400', '#8e44ad', '#2c3e50', '#27ae60', '#2980b9'];

// Memoized Charts
const ProductBarChart = memo(({ data }) => (
    <div className="card-premium">
        <h3 className="text-xl font-bold text-dark mb-6">Product Performance (Revenue)</h3>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="product_sku" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Bar dataKey="total_revenue" radius={[6, 6, 0, 0]}>
                        {data?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
));

const EngagementPieChart = memo(({ data }) => (
    <div className="card-premium">
        <h3 className="text-xl font-bold text-dark mb-6">Engagement by Category</h3>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data?.map(item => ({
                            ...item,
                            count: Number(item.count) || 0
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="count"
                        nameKey="category"
                    >
                        {(data || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        formatter={(value) => [`${value} Meetings`, 'Count']}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-gray-600 font-medium">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
));

ProductBarChart.displayName = 'ProductBarChart';
EngagementPieChart.displayName = 'EngagementPieChart';

export default function AdminAnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await api.get('/dashboard/analytics');
            setData(response.data);
        } catch (err) {
            console.error('Analytics error:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="admin">
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Generating insights...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const { product_performance, meeting_categories, monthly_comparison } = data || {};

    const growth = monthly_comparison?.previous_month_sales > 0
        ? ((monthly_comparison.current_month_sales - monthly_comparison.previous_month_sales) / monthly_comparison.previous_month_sales * 100).toFixed(1)
        : 100;

    return (
        <DashboardLayout role="admin">
            <div className="min-h-screen bg-background py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-dark mb-2">Detailed Analytics</h1>
                        <p className="text-gray-600">Deep dive into business performance and engagement</p>
                    </div>

                    {/* Comparison Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="card-premium">
                            <p className="text-sm text-gray-500 mb-1">Current Month Sales</p>
                            <p className="text-3xl font-bold text-dark">₹{parseFloat(monthly_comparison?.current_month_sales || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="card-premium">
                            <p className="text-sm text-gray-500 mb-1">Previous Month Sales</p>
                            <p className="text-3xl font-bold text-dark">₹{parseFloat(monthly_comparison?.previous_month_sales || 0).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="card-premium">
                            <p className="text-sm text-gray-500 mb-1">Monthly Growth</p>
                            <div className="flex items-center space-x-2">
                                <p className={`text-3xl font-bold ${parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {growth > 0 ? '+' : ''}{growth}%
                                </p>
                                <svg className={`w-6 h-6 ${parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={parseFloat(growth) >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ProductBarChart data={product_performance} />
                        <EngagementPieChart data={meeting_categories} />

                        {/* Detailed Product Table */}
                        <div className="card-premium lg:col-span-2">
                            <h3 className="text-xl font-bold text-dark mb-6">Top Products Ranking</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-4 px-4 font-semibold text-dark">Product SKU</th>
                                            <th className="text-center py-4 px-4 font-semibold text-dark">Sales Count</th>
                                            <th className="text-center py-4 px-4 font-semibold text-dark">Total Units</th>
                                            <th className="text-right py-4 px-4 font-semibold text-dark">Total Revenue</th>
                                            <th className="text-right py-4 px-4 font-semibold text-dark">Avg. Transaction</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product_performance?.map((p, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-smooth">
                                                <td className="py-4 px-4">
                                                    <span className="font-bold text-dark">{p.product_sku}</span>
                                                </td>
                                                <td className="py-4 px-4 text-center text-gray-600">{p.sale_count}</td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                                                        {p.total_quantity}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right font-bold text-primary">
                                                    ₹{parseFloat(p.total_revenue).toLocaleString('en-IN')}
                                                </td>
                                                <td className="py-4 px-4 text-right text-gray-500">
                                                    ₹{parseFloat(p.avg_price).toLocaleString('en-IN')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
