const db = require('../config/db');

/**
 * Create new meeting
 * POST /api/meetings
 */
const createMeeting = async (req, res) => {
    try {
        const {
            meeting_type,
            person_name,
            category,
            contact_number,
            business_potential,
            village_name,
            attendee_count,
            meeting_topic,
            latitude,
            longitude,
            location_address,
            photos,
            notes
        } = req.body;

        const user_id = req.user.id;

        // Validate meeting type
        if (!['one-on-one', 'group'].includes(meeting_type)) {
            return res.status(400).json({
                success: false,
                message: 'Meeting type must be either "one-on-one" or "group"'
            });
        }

        // Validate one-on-one meeting fields
        if (meeting_type === 'one-on-one' && !person_name) {
            return res.status(400).json({
                success: false,
                message: 'Person name is required for one-on-one meetings'
            });
        }

        // Validate group meeting fields
        if (meeting_type === 'group' && !village_name) {
            return res.status(400).json({
                success: false,
                message: 'Village name is required for group meetings'
            });
        }

        const result = await db.query(
            `INSERT INTO meetings (
                user_id, meeting_type, person_name, category, contact_number,
                business_potential, village_name, attendee_count, meeting_topic,
                latitude, longitude, location_address, photos, notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *`,
            [
                user_id, meeting_type, person_name, category, contact_number,
                business_potential, village_name, attendee_count, meeting_topic,
                latitude, longitude, location_address, JSON.stringify(photos || []), notes
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Meeting logged successfully',
            meeting: result.rows[0]
        });
    } catch (error) {
        console.error('Create meeting error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating meeting'
        });
    }
};

/**
 * Get all meetings with filters
 * GET /api/meetings
 */
const getAllMeetings = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user_role = req.user.role;
        const {
            meeting_type,
            from_date,
            to_date,
            category,
            search,
            state
        } = req.query;

        let query = `
            SELECT m.*, u.name as user_name, u.state, u.district
            FROM meetings m
            JOIN users u ON m.user_id = u.id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        // Role-based filtering
        if (user_role === 'distributor') {
            query += ` AND m.user_id = $${paramIndex}`;
            params.push(user_id);
            paramIndex++;
        }

        // Meeting type filter
        if (meeting_type) {
            query += ` AND m.meeting_type = $${paramIndex}`;
            params.push(meeting_type);
            paramIndex++;
        }

        // Date range filter
        if (from_date) {
            query += ` AND m.created_at >= $${paramIndex}`;
            params.push(from_date);
            paramIndex++;
        }

        if (to_date) {
            query += ` AND m.created_at <= $${paramIndex}`;
            params.push(to_date + ' 23:59:59');
            paramIndex++;
        }

        // Category filter (for one-on-one meetings)
        if (category) {
            query += ` AND m.category = $${paramIndex}`;
            params.push(category);
            paramIndex++;
        }

        // State filter
        if (state) {
            query += ` AND u.state = $${paramIndex}`;
            params.push(state);
            paramIndex++;
        }

        // Search filter
        if (search) {
            query += ` AND (m.person_name ILIKE $${paramIndex} OR m.village_name ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        query += ` ORDER BY m.created_at DESC`;

        const result = await db.query(query, params);

        res.json({
            success: true,
            count: result.rows.length,
            meetings: result.rows
        });
    } catch (error) {
        console.error('Get meetings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching meetings'
        });
    }
};

/**
 * Get single meeting by ID
 * GET /api/meetings/:id
 */
const getMeetingById = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const user_role = req.user.role;

        let query = `
            SELECT m.*, u.name as user_name, u.email, u.phone, u.state, u.district
            FROM meetings m
            JOIN users u ON m.user_id = u.id
            WHERE m.id = $1
        `;
        const params = [id];

        // Distributors can only see their own meetings
        if (user_role === 'distributor') {
            query += ` AND m.user_id = $2`;
            params.push(user_id);
        }

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found or access denied'
            });
        }

        res.json({
            success: true,
            meeting: result.rows[0]
        });
    } catch (error) {
        console.error('Get meeting error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching meeting'
        });
    }
};

/**
 * Update meeting
 * PUT /api/meetings/:id
 */
const updateMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const {
            person_name,
            category,
            contact_number,
            business_potential,
            village_name,
            attendee_count,
            meeting_topic,
            latitude,
            longitude,
            location_address,
            photos,
            notes
        } = req.body;

        // Check if meeting belongs to user
        const checkResult = await db.query(
            'SELECT * FROM meetings WHERE id = $1 AND user_id = $2',
            [id, user_id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found or access denied'
            });
        }

        const result = await db.query(
            `UPDATE meetings 
            SET person_name = COALESCE($1, person_name),
                category = COALESCE($2, category),
                contact_number = COALESCE($3, contact_number),
                business_potential = COALESCE($4, business_potential),
                village_name = COALESCE($5, village_name),
                attendee_count = COALESCE($6, attendee_count),
                meeting_topic = COALESCE($7, meeting_topic),
                latitude = COALESCE($8, latitude),
                longitude = COALESCE($9, longitude),
                location_address = COALESCE($10, location_address),
                photos = COALESCE($11, photos),
                notes = COALESCE($12, notes)
            WHERE id = $13
            RETURNING *`,
            [
                person_name, category, contact_number, business_potential,
                village_name, attendee_count, meeting_topic,
                latitude, longitude, location_address,
                photos ? JSON.stringify(photos) : null, notes, id
            ]
        );

        res.json({
            success: true,
            message: 'Meeting updated successfully',
            meeting: result.rows[0]
        });
    } catch (error) {
        console.error('Update meeting error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating meeting'
        });
    }
};

/**
 * Delete meeting
 * DELETE /api/meetings/:id
 */
const deleteMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const user_role = req.user.role;

        // Check if meeting belongs to user (or is admin)
        let query = 'DELETE FROM meetings WHERE id = $1';
        const params = [id];

        if (user_role === 'distributor') {
            query += ' AND user_id = $2';
            params.push(user_id);
        }

        query += ' RETURNING *';

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found or access denied'
            });
        }

        res.json({
            success: true,
            message: 'Meeting deleted successfully'
        });
    } catch (error) {
        console.error('Delete meeting error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting meeting'
        });
    }
};

module.exports = {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting
};
