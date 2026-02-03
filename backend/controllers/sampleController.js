const db = require('../config/db');

/**
 * Create new sample distribution
 * POST /api/samples
 */
const createSample = async (req, res) => {
    try {
        const {
            quantity,
            recipient_name,
            purpose,
            latitude,
            longitude,
            location_address
        } = req.body;

        const user_id = req.user.id;

        // Validate required fields
        if (!quantity || !recipient_name) {
            return res.status(400).json({
                success: false,
                message: 'Quantity and recipient name are required'
            });
        }

        const result = await db.query(
            `INSERT INTO sample_distributions (
                user_id, quantity, recipient_name, purpose,
                latitude, longitude, location_address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [user_id, quantity, recipient_name, purpose, latitude, longitude, location_address]
        );

        res.status(201).json({
            success: true,
            message: 'Sample distribution logged successfully',
            sample: result.rows[0]
        });
    } catch (error) {
        console.error('Create sample error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating sample distribution'
        });
    }
};

/**
 * Get all sample distributions with filters
 * GET /api/samples
 */
const getAllSamples = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user_role = req.user.role;
        const { from_date, to_date, search } = req.query;

        let query = `
            SELECT s.*, u.name as user_name, u.state, u.district
            FROM sample_distributions s
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

        // Search filter
        if (search) {
            query += ` AND s.recipient_name ILIKE $${paramIndex}`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        query += ` ORDER BY s.created_at DESC`;

        const result = await db.query(query, params);

        // Get total samples distributed
        let statsQuery = `
            SELECT 
                COUNT(*) as total_distributions,
                SUM(quantity) as total_samples
            FROM sample_distributions
            WHERE 1=1
        `;
        const statsParams = [];
        let statsParamIndex = 1;

        if (user_role === 'distributor') {
            statsQuery += ` AND user_id = $${statsParamIndex}`;
            statsParams.push(user_id);
        }

        const statsResult = await db.query(statsQuery, statsParams);

        res.json({
            success: true,
            count: result.rows.length,
            stats: statsResult.rows[0],
            samples: result.rows
        });
    } catch (error) {
        console.error('Get samples error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching sample distributions'
        });
    }
};

/**
 * Get single sample distribution by ID
 * GET /api/samples/:id
 */
const getSampleById = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const user_role = req.user.role;

        let query = `
            SELECT s.*, u.name as user_name, u.email, u.phone, u.state, u.district
            FROM sample_distributions s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = $1
        `;
        const params = [id];

        // Distributors can only see their own samples
        if (user_role === 'distributor') {
            query += ` AND s.user_id = $2`;
            params.push(user_id);
        }

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sample distribution not found or access denied'
            });
        }

        res.json({
            success: true,
            sample: result.rows[0]
        });
    } catch (error) {
        console.error('Get sample error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching sample distribution'
        });
    }
};

/**
 * Delete sample distribution
 * DELETE /api/samples/:id
 */
const deleteSample = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const user_role = req.user.role;

        let query = 'DELETE FROM sample_distributions WHERE id = $1';
        const params = [id];

        // Distributors can only delete their own samples
        if (user_role === 'distributor') {
            query += ' AND user_id = $2';
            params.push(user_id);
        }

        query += ' RETURNING *';

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sample distribution not found or access denied'
            });
        }

        res.json({
            success: true,
            message: 'Sample distribution deleted successfully'
        });
    } catch (error) {
        console.error('Delete sample error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting sample distribution'
        });
    }
};

module.exports = {
    createSample,
    getAllSamples,
    getSampleById,
    deleteSample
};
