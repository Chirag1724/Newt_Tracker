/**
 * Get admin dashboard statistics
 * GET /api/dashboard/admin
 */
const getAdminDashboard = async (req, res) => {
    try {
        // For Phase 1, using dummy data
        // In Phase 2, these will come from actual database queries
        const dashboardData = {
            success: true,
            stats: {
                totalMeetings: 847,
                totalSales: 245000,
                totalDistributors: 23,
                activeMeetingsToday: 42
            },
            recentActivities: [
                {
                    id: 1,
                    type: 'meeting',
                    description: 'Meeting completed with ABC Distributors',
                    distributor: 'Rajesh Kumar',
                    location: 'Pune, Maharashtra',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
                },
                {
                    id: 2,
                    type: 'sale',
                    description: 'Sale recorded - ₹15,000',
                    distributor: 'Priya Sharma',
                    location: 'Mumbai, Maharashtra',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
                },
                {
                    id: 3,
                    type: 'new_distributor',
                    description: 'New distributor onboarded',
                    distributor: 'Amit Patel',
                    location: 'Nagpur, Maharashtra',
                    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
                },
                {
                    id: 4,
                    type: 'meeting',
                    description: 'Meeting completed with XYZ Traders',
                    distributor: 'Sneha Desai',
                    location: 'Nashik, Maharashtra',
                    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
                },
                {
                    id: 5,
                    type: 'sale',
                    description: 'Sale recorded - ₹28,500',
                    distributor: 'Vikram Singh',
                    location: 'Aurangabad, Maharashtra',
                    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() // 10 hours ago
                }
            ],
            monthlyData: [
                { month: 'Jan', meetings: 120, sales: 35000 },
                { month: 'Feb', meetings: 145, sales: 42000 },
                { month: 'Mar', meetings: 132, sales: 38000 },
                { month: 'Apr', meetings: 158, sales: 45000 },
                { month: 'May', meetings: 142, sales: 41000 },
                { month: 'Jun', meetings: 150, sales: 44000 }
            ]
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching admin dashboard data.'
        });
    }
};

/**
 * Get distributor dashboard statistics
 * GET /api/dashboard/distributor
 */
const getDistributorDashboard = async (req, res) => {
    try {
        // For Phase 1, using dummy data
        // In Phase 2, these will be filtered by distributor ID
        const dashboardData = {
            success: true,
            stats: {
                meetingsToday: 12,
                monthlySales: 45600,
                totalMeetings: 156,
                averageSaleValue: 2850
            },
            recentActivities: [
                {
                    id: 1,
                    type: 'meeting',
                    description: 'Meeting with Retailer A',
                    location: 'Kothrud, Pune',
                    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
                },
                {
                    id: 2,
                    type: 'sale',
                    description: 'Sale completed - ₹3,200',
                    location: 'Shivaji Nagar, Pune',
                    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
                },
                {
                    id: 3,
                    type: 'meeting',
                    description: 'Follow-up meeting with Retailer B',
                    location: 'Deccan, Pune',
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
                },
                {
                    id: 4,
                    type: 'sale',
                    description: 'Sale completed - ₹5,800',
                    location: 'Baner, Pune',
                    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString() // 7 hours ago
                },
                {
                    id: 5,
                    type: 'meeting',
                    description: 'New prospect meeting',
                    location: 'Wakad, Pune',
                    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString() // 9 hours ago
                }
            ],
            weeklyData: [
                { day: 'Mon', meetings: 8, sales: 6400 },
                { day: 'Tue', meetings: 12, sales: 9200 },
                { day: 'Wed', meetings: 10, sales: 7800 },
                { day: 'Thu', meetings: 15, sales: 11500 },
                { day: 'Fri', meetings: 11, sales: 8900 },
                { day: 'Sat', meetings: 6, sales: 4200 }
            ]
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Distributor dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching distributor dashboard data.'
        });
    }
};

module.exports = {
    getAdminDashboard,
    getDistributorDashboard
};
