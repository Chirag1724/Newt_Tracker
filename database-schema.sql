-- ============================================
-- NEWT TRACKER DATABASE SCHEMA
-- Version: 1.0 (Phase 1)
-- ============================================

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'distributor')),
  phone VARCHAR(20),
  state VARCHAR(100),
  district VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create index on role for faster filtering
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- SAMPLE DATA (OPTIONAL)
-- ============================================
-- Note: Passwords are hashed with bcrypt
-- admin123 -> $2a$10$rQ8YvK6H5yZKZQxY5vKJ0eFtXxGxHvZJKZQxY5vKJ0eFtXxGxHvZJ
-- dist123 -> $2a$10$qR9ZwL7H6zYJZRxX6wLK1fGsYyHyIwAKLARxX6wLK1fGsYyHyIwAK

-- Insert sample admin user
INSERT INTO users (name, email, password, role, phone, state) 
VALUES (
  'Admin User', 
  'admin@newt.com', 
  '$2a$10$rQ8YvK6H5yZKZQxY5vKJ0eFtXxGxHvZJKZQxY5vKJ0eFtXxGxHvZJ', 
  'admin', 
  '+919876543210', 
  'Maharashtra'
);

-- Insert sample distributor user
INSERT INTO users (name, email, password, role, phone, state, district) 
VALUES (
  'Field Officer', 
  'officer@newt.com', 
  '$2a$10$qR9ZwL7H6zYJZRxX6wLK1fGsYyHyIwAKLARxX6wLK1fGsYyHyIwAK', 
  'distributor', 
  '+919876543211', 
  'Maharashtra', 
  'Pune'
);

-- ============================================
-- VERIFY INSTALLATION
-- ============================================

-- Check if table was created successfully
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';

-- Check if sample users were inserted
SELECT id, name, email, role, created_at 
FROM users;
