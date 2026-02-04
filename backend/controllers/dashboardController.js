const db = require('../config/db');

/**
 * Get admin dashboard statistics
 * GET /api/dashboard/admin
 */
const getAdminDashboard = async (req, res) => {
    try {
        const { from_date, to_date } = req.query;

        let dateFilter = '';
        const params = [];
        let paramIndex = 1;

        if (from_date && to_date) {
            dateFilter = `WHERE created_at >= $${paramIndex} AND created_at <= $${paramIndex + 1}`;
            params.push(from_date, to_date + ' 23:59:59');
            paramIndex += 2;
        }

        // Total users stats
        const userStats = await db.query(
            'SELECT COUNT(*) as total_distributors FROM users WHERE role = \'distributor\''
        );

        // Meeting stats
        const meetingStats = await db.query(`
            SELECT 
                COUNT(*) as total_meetings,
                COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as today_meetings,
                COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_meetings,
                COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as month_meetings
            FROM meetings
            ${dateFilter}
        `, params);

        // Sales stats with B2C/B2B breakdown
        const salesStats = await db.query(`
            SELECT 
                COUNT(*) as total_sales,
                SUM(amount) as total_revenue,
                SUM(CASE WHEN sale_type = 'B2C' THEN amount ELSE 0 END) as b2c_revenue,
                SUM(CASE WHEN sale_type = 'B2B' THEN amount ELSE 0 END) as b2b_revenue,
                COUNT(CASE WHEN sale_type = 'B2C' THEN 1 END) as b2c_count,
                COUNT(CASE WHEN sale_type = 'B2B' THEN 1 END) as b2b_count,
                SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN amount ELSE 0 END) as month_revenue
            FROM sales
            ${dateFilter}
        `, params);

        // Sample distribution stats
        const sampleStats = await db.query(`
            SELECT 
                COUNT(*) as total_distributions,
                SUM(quantity) as total_samples
            FROM sample_distributions
            ${dateFilter}
        `, params);

        // State-wise activity breakdown
        const stateStats = await db.query(`
            SELECT 
                u.state,
                COUNT(DISTINCT u.id) as distributors,
                COUNT(m.id) as meetings,
                COALESCE(SUM(s.amount), 0) as sales
            FROM users u
            LEFT JOIN meetings m ON u.id = m.user_id
            LEFT JOIN sales s ON u.id = s.user_id
            WHERE u.role = 'distributor'
            GROUP BY u.state
            ORDER BY meetings DESC
        `);

        // Top performers
        const topPerformers = await db.query(`
            SELECT 
                u.id,
                u.name,
                u.state,
                u.district,
                COUNT(DISTINCT m.id) as meetings,
                COUNT(DISTINCT s.id) as sales,
                COALESCE(SUM(s.amount), 0) as revenue
            FROM users u
            LEFT JOIN meetings m ON u.id = m.user_id AND m.created_at >= CURRENT_DATE - INTERVAL '30 days'
            LEFT JOIN sales s ON u.id = s.user_id AND s.created_at >= CURRENT_DATE - INTERVAL '30 days'
            WHERE u.role = 'distributor'
            GROUP BY u.id, u.name, u.state, u.district
            ORDER BY revenue DESC
            LIMIT 5
        `);

        // Recent activities (combined from meetings and sales)
        const recentActivities = await db.query(`
            (
                SELECT 
                    'meeting' as type,
                    m.id,
                    u.name as user_name,
                    CASE 
                        WHEN m.meeting_type = 'one-on-one' THEN 'Met with ' || m.person_name || ' (' || m.category || ')'
                        ELSE 'Group meeting at ' || m.village_name || ' (' || m.attendee_count || ' attendees)'
                    END as description,
                    m.location_address as location,
                    m.created_at as timestamp
                FROM meetings m
                JOIN users u ON m.user_id = u.id
            )
            UNION ALL
            (
                SELECT 
                    'sale' as type,
                    s.id,
                    u.name as user_name,
                    'Sold ' || s.product_sku || ' (' || s.sale_type || ') - ₹' || s.amount as description,
                    s.location_address as location,
                    s.created_at as timestamp
                FROM sales s
                JOIN users u ON s.user_id = u.id
            )
            ORDER BY timestamp DESC
            LIMIT 20
        `);

        // Sales trend (last 30 days)
        const salesTrend = await db.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as sales_count,
                SUM(amount) as revenue
            FROM sales
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // Meetings trend (last 30 days)
        const meetingsTrend = await db.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count,
                COUNT(CASE WHEN meeting_type = 'one-on-one' THEN 1 END) as one_on_one,
                COUNT(CASE WHEN meeting_type = 'group' THEN 1 END) as group_count
            FROM meetings
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        res.json({
            success: true,
            stats: {
                total_distributors: parseInt(userStats.rows[0].total_distributors),
                total_meetings: parseInt(meetingStats.rows[0].total_meetings),
                today_meetings: parseInt(meetingStats.rows[0].today_meetings),
                week_meetings: parseInt(meetingStats.rows[0].week_meetings),
                month_meetings: parseInt(meetingStats.rows[0].month_meetings),
                total_sales: parseInt(salesStats.rows[0].total_sales),
                total_revenue: parseFloat(salesStats.rows[0].total_revenue || 0),
                month_revenue: parseFloat(salesStats.rows[0].month_revenue || 0),
                b2c_revenue: parseFloat(salesStats.rows[0].b2c_revenue || 0),
                b2b_revenue: parseFloat(salesStats.rows[0].b2b_revenue || 0),
                b2c_count: parseInt(salesStats.rows[0].b2c_count),
                b2b_count: parseInt(salesStats.rows[0].b2b_count),
                total_samples: parseInt(sampleStats.rows[0].total_samples || 0),
                total_distributions: parseInt(sampleStats.rows[0].total_distributions || 0)
            },
            state_stats: stateStats.rows,
            top_performers: topPerformers.rows,
            recent_activities: recentActivities.rows,
            sales_trend: salesTrend.rows,
            meetings_trend: meetingsTrend.rows
        });
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
        const user_id = req.user.id;

        // Meeting stats
        const meetingStats = await db.query(`
            SELECT 
                COUNT(*) as total_meetings,
                COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as today_meetings,
                COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_meetings,
                COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as month_meetings
            FROM meetings
            WHERE user_id = $1
        `, [user_id]);

        // Sales stats
        const salesStats = await db.query(`
            SELECT 
                COUNT(*) as total_sales,
                SUM(amount) as total_revenue,
                SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN amount ELSE 0 END) as month_revenue,
                AVG(amount) as avg_sale_value,
                SUM(CASE WHEN sale_type = 'B2C' THEN amount ELSE 0 END) as b2c_revenue,
                SUM(CASE WHEN sale_type = 'B2B' THEN amount ELSE 0 END) as b2b_revenue
            FROM sales
            WHERE user_id = $1
        `, [user_id]);

        // Sample distribution stats
        const sampleStats = await db.query(`
            SELECT 
                COUNT(*) as total_distributions,
                SUM(quantity) as total_samples
            FROM sample_distributions
            WHERE user_id = $1
        `, [user_id]);

        // Recent activities
        const recentActivities = await db.query(`
            (
                SELECT 
                    'meeting' as type,
                    id,
                    CASE 
                        WHEN meeting_type = 'one-on-one' THEN 'Met with ' || person_name || ' (' || category || ')'
                        ELSE 'Group meeting at ' || village_name || ' (' || attendee_count || ' attendees)'
                    END as description,
                    location_address as location,
                    created_at as timestamp
                FROM meetings
                WHERE user_id = $1
            )
            UNION ALL
            (
                SELECT 
                    'sale' as type,
                    id,
                    'Sold ' || product_sku || ' (' || sale_type || ') - ₹' || amount as description,
                    location_address as location,
                    created_at as timestamp
                FROM sales
                WHERE user_id = $1
            )
            UNION ALL
            (
                SELECT 
                    'sample' as type,
                    id,
                    'Distributed ' || quantity || ' samples to ' || recipient_name as description,
                    location_address as location,
                    created_at as timestamp
                FROM sample_distributions
                WHERE user_id = $1
            )
            ORDER BY timestamp DESC
            LIMIT 10
        `, [user_id]);

        // Weekly performance
        const weeklyPerformance = await db.query(`
            SELECT 
                TO_CHAR(created_at, 'Day') as day,
                COUNT(*) as meetings,
                0 as sales
            FROM meetings
            WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
            ORDER BY EXTRACT(DOW FROM created_at)
        `, [user_id]);

        const weeklySales = await db.query(`
            SELECT 
                TO_CHAR(created_at, 'Day') as day,
                SUM(amount) as sales
            FROM sales
            WHERE user_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
            ORDER BY EXTRACT(DOW FROM created_at)
        `, [user_id]);

        res.json({
            success: true,
            stats: {
                total_meetings: parseInt(meetingStats.rows[0].total_meetings),
                today_meetings: parseInt(meetingStats.rows[0].today_meetings),
                week_meetings: parseInt(meetingStats.rows[0].week_meetings),
                month_meetings: parseInt(meetingStats.rows[0].month_meetings),
                total_sales: parseInt(salesStats.rows[0].total_sales || 0),
                total_revenue: parseFloat(salesStats.rows[0].total_revenue || 0),
                month_revenue: parseFloat(salesStats.rows[0].month_revenue || 0),
                avg_sale_value: parseFloat(salesStats.rows[0].avg_sale_value || 0),
                b2c_revenue: parseFloat(salesStats.rows[0].b2c_revenue || 0),
                b2b_revenue: parseFloat(salesStats.rows[0].b2b_revenue || 0),
                total_samples: parseInt(sampleStats.rows[0].total_samples || 0),
                total_distributions: parseInt(sampleStats.rows[0].total_distributions || 0)
            },
            recent_activities: recentActivities.rows,
            weekly_meetings: weeklyPerformance.rows,
            weekly_sales: weeklySales.rows
        });
    } catch (error) {
        console.error('Distributor dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching distributor dashboard data.'
        });
    }
};

/**
 * Get detailed analytics (Admin only)
 * GET /api/dashboard/analytics
 */
const getAnalytics = async (req, res) => {
    try {
        // This is admin-only data, role check is done in middleware

        // Get product performance
        const productPerformance = await db.query(`
            SELECT 
                product_sku,
                COUNT(*) as sale_count,
                SUM(quantity) as total_quantity,
                SUM(amount) as total_revenue,
                AVG(amount) as avg_price
            FROM sales
            WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
            GROUP BY product_sku
            ORDER BY total_revenue DESC
            LIMIT 10
        `);

        // Get meeting categories breakdown
        const meetingCategories = await db.query(`
            SELECT 
                category,
                COUNT(*) as count,
                AVG(business_potential) as avg_potential
            FROM meetings
            WHERE meeting_type = 'one-on-one' 
                AND category IS NOT NULL
                AND created_at >= CURRENT_DATE - INTERVAL '90 days'
            GROUP BY category
            ORDER BY count DESC
        `);

        // Monthly comparison (current vs previous month)
        const monthlyComparison = await db.query(`
            SELECT 
                SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END) as current_month_sales,
                SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' 
                    AND created_at < DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END) as previous_month_sales
            FROM sales
        `);

        res.json({
            success: true,
            product_performance: productPerformance.rows.map(p => ({
                ...p,
                sale_count: parseInt(p.sale_count),
                total_quantity: parseInt(p.total_quantity),
                total_revenue: parseFloat(p.total_revenue || 0),
                avg_price: parseFloat(p.avg_price || 0)
            })),
            meeting_categories: meetingCategories.rows.map(m => ({
                ...m,
                count: parseInt(m.count),
                avg_potential: parseFloat(m.avg_potential || 0)
            })),
            monthly_comparison: {
                current_month_sales: parseFloat(monthlyComparison.rows[0].current_month_sales || 0),
                previous_month_sales: parseFloat(monthlyComparison.rows[0].previous_month_sales || 0)
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching analytics data.'
        });
    }
};

module.exports = {
    getAdminDashboard,
    getDistributorDashboard,
    getAnalytics
};
