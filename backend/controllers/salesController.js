const db = require('../config/db');

/**
 * Create new sale
 * POST /api/sales
 */
const createSale = async (req, res) => {
    try {
        const {
            sale_type,
            product_sku,
            pack_size,
            quantity,
            amount,
            mode,
            customer_name,
            is_repeat_order,
            latitude,
            longitude,
            location_address
        } = req.body;

        const user_id = req.user.id;

        // Validate required fields
        if (!sale_type || !product_sku || !quantity || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Sale type, product SKU, quantity, and amount are required'
            });
        }

        // Validate sale type
        if (!['B2C', 'B2B'].includes(sale_type)) {
            return res.status(400).json({
                success: false,
                message: 'Sale type must be either "B2C" or "B2B"'
            });
        }

        const result = await db.query(
            `INSERT INTO sales (
                user_id, sale_type, product_sku, pack_size, quantity,
                amount, mode, customer_name, is_repeat_order,
                latitude, longitude, location_address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [
                user_id, sale_type, product_sku, pack_size, quantity,
                amount, mode, customer_name, is_repeat_order || false,
                latitude, longitude, location_address
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Sale tracked successfully',
            sale: result.rows[0]
        });
    } catch (error) {
        console.error('Create sale error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating sale'
        });
    }
};

/**
 * Get all sales with filters
 * GET /api/sales
 */
const getAllSales = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user_role = req.user.role;
        const {
            sale_type,
            from_date,
            to_date,
            product_sku,
            search
        } = req.query;

        let query = `
            SELECT s.*, u.name as user_name, u.state, u.district
            FROM sales s
            JOIN users u ON s.user_id = u.id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        // Role-based filtering
        if (user_role === 'distributor') {
            query += ` AND s.user_id = $${paramIndex}`;
            params.push(user_id);
            paramIndex++;
        }

        // Sale type filter
        if (sale_type) {
            query += ` AND s.sale_type = $${paramIndex}`;
            params.push(sale_type);
            paramIndex++;
        }

        // Date range filter
        if (from_date) {
            query += ` AND s.created_at >= $${paramIndex}`;
            params.push(from_date);
            paramIndex++;
        }

        if (to_date) {
            query += ` AND s.created_at <= $${paramIndex}`;
            params.push(to_date + ' 23:59:59');
            paramIndex++;
        }

        // Product SKU filter
        if (product_sku) {
            query += ` AND s.product_sku = $${paramIndex}`;
            params.push(product_sku);
            paramIndex++;
        }

        // Search filter
        if (search) {
            query += ` AND (s.customer_name ILIKE $${paramIndex} OR s.product_sku ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        query += ` ORDER BY s.created_at DESC`;

        const result = await db.query(query, params);

        res.json({
            success: true,
            count: result.rows.length,
            sales: result.rows
        });
    } catch (error) {
        console.error('Get sales error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching sales'
        });
    }
};

/**
 * Get single sale by ID
 * GET /api/sales/:id
 */
const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const user_role = req.user.role;

        let query = `
            SELECT s.*, u.name as user_name, u.email, u.phone, u.state, u.district
            FROM sales s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = $1
        `;
        const params = [id];

        // Distributors can only see their own sales
        if (user_role === 'distributor') {
            query += ` AND s.user_id = $2`;
            params.push(user_id);
        }

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found or access denied'
            });
        }

        res.json({
            success: true,
            sale: result.rows[0]
        });
    } catch (error) {
        console.error('Get sale error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching sale'
        });
    }
};

/**
 * Get sales statistics
 * GET /api/sales/stats
 */
const getSalesStats = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user_role = req.user.role;
        const { from_date, to_date } = req.query;

        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        // Role-based filtering
        if (user_role === 'distributor') {
            whereClause += ` AND user_id = $${paramIndex}`;
            params.push(user_id);
            paramIndex++;
        }

        // Date range filter
        if (from_date) {
            whereClause += ` AND created_at >= $${paramIndex}`;
            params.push(from_date);
            paramIndex++;
        }

        if (to_date) {
            whereClause += ` AND created_at <= $${paramIndex}`;
            params.push(to_date + ' 23:59:59');
            paramIndex++;
        }

        // Get overall stats
        const statsQuery = `
            SELECT
                COUNT(*) as total_sales,
                SUM(amount) as total_revenue,
                AVG(amount) as average_sale,
                SUM(CASE WHEN sale_type = 'B2C' THEN 1 ELSE 0 END) as b2c_count,
                SUM(CASE WHEN sale_type = 'B2B' THEN 1 ELSE 0 END) as b2b_count,
                SUM(CASE WHEN sale_type = 'B2C' THEN amount ELSE 0 END) as b2c_revenue,
                SUM(CASE WHEN sale_type = 'B2B' THEN amount ELSE 0 END) as b2b_revenue,
                SUM(CASE WHEN is_repeat_order = TRUE THEN 1 ELSE 0 END) as repeat_orders
            FROM sales
            ${whereClause}
        `;

        const statsResult = await db.query(statsQuery, params);

        // Get top products
        const topProductsQuery = `
            SELECT
                product_sku,
                COUNT(*) as sales_count,
                SUM(quantity) as total_quantity,
                SUM(amount) as total_revenue
            FROM sales
            ${whereClause}
            GROUP BY product_sku
            ORDER BY total_revenue DESC
            LIMIT 5
        `;

        const topProductsResult = await db.query(topProductsQuery, params);

        // Get sales trend (last 30 days)
        const trendQuery = `
            SELECT
                DATE(created_at) as sale_date,
                COUNT(*) as sales_count,
                SUM(amount) as daily_revenue
            FROM sales
            ${whereClause}
            AND created_at >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY sale_date ASC
        `;

        const trendResult = await db.query(trendQuery, params);

        res.json({
            success: true,
            stats: statsResult.rows[0],
            top_products: topProductsResult.rows,
            sales_trend: trendResult.rows
        });
    } catch (error) {
        console.error('Get sales stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching sales statistics'
        });
    }
};

/**
 * Delete sale
 * DELETE /api/sales/:id
 */
const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const user_role = req.user.role;

        let query = 'DELETE FROM sales WHERE id = $1';
        const params = [id];

        // Distributors can only delete their own sales
        if (user_role === 'distributor') {
            query += ' AND user_id = $2';
            params.push(user_id);
        }

        query += ' RETURNING *';

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found or access denied'
            });
        }

        res.json({
            success: true,
            message: 'Sale deleted successfully'
        });
    } catch (error) {
        console.error('Delete sale error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting sale'
        });
    }
};

module.exports = {
    createSale,
    getAllSales,
    getSaleById,
    getSalesStats,
    deleteSale
};
