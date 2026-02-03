-- ============================================
-- NEWT TRACKER - FULL DATABASE SCHEMA
-- This script contains all tables for Phase 1 & 2
-- ============================================

-- 1. USERS TABLE (Authentication & Profiles)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'distributor')) NOT NULL,
    phone VARCHAR(20),
    state VARCHAR(50),
    district VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. MEETINGS TABLE (Field Visit Tracking)
CREATE TABLE IF NOT EXISTS meetings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    meeting_type VARCHAR(20) CHECK (meeting_type IN ('one-on-one', 'group')) NOT NULL,
    
    -- One-on-one specific fields
    person_name VARCHAR(100),
    category VARCHAR(50), -- Farmer, Seller, Influencer
    contact_number VARCHAR(20),
    business_potential DECIMAL(12, 2),
    
    -- Group meeting specific fields
    village_name VARCHAR(100),
    attendee_count INTEGER,
    meeting_topic VARCHAR(255),
    
    -- Common fields
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_address TEXT,
    photos JSONB DEFAULT '[]', -- Array of image URLs
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SALES TABLE (Live Sales Tracking)
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    sale_type VARCHAR(10) CHECK (sale_type IN ('B2C', 'B2B')) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    pack_size VARCHAR(20),
    quantity INTEGER NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    mode VARCHAR(50), -- Direct, Distributor, etc.
    customer_name VARCHAR(100),
    is_repeat_order BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SAMPLE DISTRIBUTIONS (Product Trials)
CREATE TABLE IF NOT EXISTS sample_distributions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    purpose TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ACTIVITY LOGS (Daily Reports)
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50), -- meeting, sale, sample, etc.
    activity_date DATE DEFAULT CURRENT_DATE,
    distance_traveled DECIMAL(10, 2), -- in km
    areas_covered TEXT[], -- Array of strings
    notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES for Performance
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_samples_user_id ON sample_distributions(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON meetings(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);

-- TRIGGER for updated_at (PostgreSQL)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
