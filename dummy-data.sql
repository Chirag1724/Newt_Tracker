-- ============================================
-- NEWT TRACKER - DUMMY DATA FOR TESTING
-- Run this AFTER creating Phase 2 schema
-- ============================================

-- ============================================
-- ADDITIONAL DISTRIBUTORS
-- ============================================
INSERT INTO users (name, email, password, role, phone, state, district) VALUES
('Rajesh Kumar', 'rajesh@newt.com', '$2a$10$qR9ZwL7H6zYJZRxX6wLK1fGsYyHyIwAKLARxX6wLK1fGsYyHyIwAK', 'distributor', '+919876543212', 'Maharashtra', 'Mumbai'),
('Priya Sharma', 'priya@newt.com', '$2a$10$qR9ZwL7H6zYJZRxX6wLK1fGsYyHyIwAKLARxX6wLK1fGsYyHyIwAK', 'distributor', '+919876543213', 'Karnataka', 'Bangalore'),
('Amit Singh', 'amit@newt.com', '$2a$10$qR9ZwL7H6zYJZRxX6wLK1fGsYyHyIwAKLARxX6wLK1fGsYyHyIwAK', 'distributor', '+919876543214', 'Gujarat', 'Ahmedabad'),
('Sunita Patel', 'sunita@newt.com', '$2a$10$qR9ZwL7H6zYJZRxX6wLK1fGsYyHyIwAKLARxX6wLK1fGsYyHyIwAK', 'distributor', '+919876543215', 'Rajasthan', 'Jaipur'),
('Vikram Reddy', 'vikram@newt.com', '$2a$10$qR9ZwL7H6zYJZRxX6wLK1fGsYyHyIwAKLARxX6wLK1fGsYyHyIwAK', 'distributor', '+919876543216', 'Tamil Nadu', 'Chennai'),
('Neha Gupta', 'neha@newt.com', '$2a$10$qR9ZwL7H6zYJZRxX6wLK1fGsYyHyIwAKLARxX6wLK1fGsYyHyIwAK', 'distributor', '+919876543217', 'West Bengal', 'Kolkata'),
('Arjun Mehta', 'arjun@newt.com', '$2a$10$qR9ZwL7H6zYJZRxX6wLK1fGsYyHyIwAKLARxX6wLK1fGsYyHyIwAK', 'distributor', '+919876543218', 'Delhi', 'New Delhi'),
('Pooja Iyer', 'pooja@newt.com', '$2a$10$qR9ZwL7H6zYJZRxX6wLK1fGsYyHyIwAKLARxX6wLK1fGsYyHyIwAK', 'distributor', '+919876543219', 'Kerala', 'Kochi');

-- ============================================
-- MEETINGS DATA (50+ entries)
-- ============================================
-- One-on-one meetings
INSERT INTO meetings (user_id, meeting_type, person_name, category, contact_number, business_potential, latitude, longitude, location_address, photos, notes, created_at) VALUES
(2, 'one-on-one', 'Ramesh Patil', 'Farmer', '+919876501234', 50000.00, 18.5204, 73.8567, 'Pune, Maharashtra', '[]', 'Interested in bulk purchase', NOW() - INTERVAL '1 day'),
(3, 'one-on-one', 'Suresh Agarwal', 'Seller', '+919876501235', 75000.00, 19.0760, 72.8777, 'Mumbai, Maharashtra', '[]', 'Looking for distribution partnership', NOW() - INTERVAL '2 days'),
(4, 'one-on-one', 'Lakshmi Nair', 'Influencer', '+919876501236', 100000.00, 12.9716, 77.5946, 'Bangalore, Karnataka', '[]', 'Can promote to 5000+ farmers', NOW() - INTERVAL '3 days'),
(5, 'one-on-one', 'Mahesh Shah', 'Farmer', '+919876501237', 30000.00, 23.0225, 72.5714, 'Ahmedabad, Gujarat', '[]', 'Small scale farmer, repeat customer', NOW() - INTERVAL '4 days'),
(6, 'one-on-one', 'Radha Krishnan', 'Seller', '+919876501238', 85000.00, 26.9124, 75.7873, 'Jaipur, Rajasthan', '[]', 'Owns 3 retail stores', NOW() - INTERVAL '5 days'),
(7, 'one-on-one', 'Kumar Swamy', 'Farmer', '+919876501239', 45000.00, 13.0827, 80.2707, 'Chennai, Tamil Nadu', '[]', 'Organic farming specialist', NOW() - INTERVAL '6 days'),
(8, 'one-on-one', 'Anita Das', 'Influencer', '+919876501240', 120000.00, 22.5726, 88.3639, 'Kolkata, West Bengal', '[]', 'Agricultural consultant with wide network', NOW() - INTERVAL '7 days'),
(9, 'one-on-one', 'Vijay Khanna', 'Seller', '+919876501241', 65000.00, 28.7041, 77.1025, 'Delhi, India', '[]', 'Distributor for nearby villages', NOW() - INTERVAL '8 days'),
(2, 'one-on-one', 'Sanjay Rao', 'Farmer', '+919876501242', 40000.00, 18.5204, 73.8567, 'Pune, Maharashtra', '[]', 'Crop protection products needed', NOW() - INTERVAL '9 days'),
(3, 'one-on-one', 'Rekha Desai', 'Seller', '+919876501243', 90000.00, 19.0760, 72.8777, 'Mumbai, Maharashtra', '[]', 'Chain of agro shops', NOW() - INTERVAL '10 days'),
(4, 'one-on-one', 'Ganesh Pillai', 'Farmer', '+919876501244', 35000.00, 12.9716, 77.5946, 'Bangalore, Karnataka', '[]', 'Cashew plantation owner', NOW() - INTERVAL '11 days'),
(5, 'one-on-one', 'Kiran Modi', 'Influencer', '+919876501245', 110000.00, 23.0225, 72.5714, 'Ahmedabad, Gujarat', '[]', 'Agricultural YouTuber', NOW() - INTERVAL '12 days'),
(6, 'one-on-one', 'Deepak Singh', 'Farmer', '+919876501246', 55000.00, 26.9124, 75.7873, 'Jaipur, Rajasthan', '[]', 'Wheat and mustard farmer', NOW() - INTERVAL '13 days'),
(7, 'one-on-one', 'Meena Raju', 'Seller', '+919876501247', 70000.00, 13.0827, 80.2707, 'Chennai, Tamil Nadu', '[]', 'Wholesale dealer', NOW() - INTERVAL '14 days'),
(8, 'one-on-one', 'Ravi Banerjee', 'Farmer', '+919876501248', 48000.00, 22.5726, 88.3639, 'Kolkata, West Bengal', '[]', 'Rice paddy cultivation', NOW() - INTERVAL '15 days'),
(9, 'one-on-one', 'Priya Verma', 'Seller', '+919876501249', 95000.00, 28.7041, 77.1025, 'Delhi, India', '[]', 'E-commerce agro platform', NOW() - INTERVAL '16 days'),
(2, 'one-on-one', 'Mohan Joshi', 'Farmer', '+919876501250', 42000.00, 18.5204, 73.8567, 'Pune, Maharashtra', '[]', 'Sugarcane farmer', NOW() - INTERVAL '17 days'),
(3, 'one-on-one', 'Sneha Kulkarni', 'Influencer', '+919876501251', 130000.00, 19.0760, 72.8777, 'Mumbai, Maharashtra', '[]', 'Instagram agro-influencer', NOW() - INTERVAL '18 days'),
(4, 'one-on-one', 'Bhaskar Reddy', 'Farmer', '+919876501252', 38000.00, 12.9716, 77.5946, 'Bangalore, Karnataka', '[]', 'Tomato cultivation', NOW() - INTERVAL '19 days'),
(5, 'one-on-one', 'Nisha Patel', 'Seller', '+919876501253', 88000.00, 23.0225, 72.5714, 'Ahmedabad, Gujarat', '[]', 'Retail chain owner', NOW() - INTERVAL '20 days'),
(6, 'one-on-one', 'Harish Sharma', 'Farmer', '+919876501254', 52000.00, 26.9124, 75.7873, 'Jaipur, Rajasthan', '[]', 'Cotton farmer', NOW() - INTERVAL '21 days'),
(7, 'one-on-one', 'Kavita Murthy', 'Influencer', '+919876501255', 115000.00, 13.0827, 80.2707, 'Chennai, Tamil Nadu', '[]', 'Agricultural blogger', NOW() - INTERVAL '22 days'),
(8, 'one-on-one', 'Sunil Ghosh', 'Farmer', '+919876501256', 46000.00, 22.5726, 88.3639, 'Kolkata, West Bengal', '[]', 'Vegetable farming', NOW() - INTERVAL '23 days'),
(9, 'one-on-one', 'Rita Kapoor', 'Seller', '+919876501257', 92000.00, 28.7041, 77.1025, 'Delhi, India', '[]', 'Agricultural inputs supplier', NOW() - INTERVAL '24 days'),
(2, 'one-on-one', 'Prakash Naik', 'Farmer', '+919876501258', 44000.00, 18.5204, 73.8567, 'Pune, Maharashtra', '[]', 'Fruit orchard owner', NOW() - INTERVAL '25 days');

-- Group meetings
INSERT INTO meetings (user_id, meeting_type, village_name, attendee_count, meeting_topic, latitude, longitude, location_address, photos, notes, created_at) VALUES
(2, 'group', 'Shirdi Village', 45, 'New pest control techniques', 19.7645, 74.4782, 'Shirdi, Maharashtra', '[]', 'Farmers showed great interest', NOW() - INTERVAL '1 day'),
(3, 'group', 'Raigad', 60, 'Organic farming methods', 18.2257, 73.1340, 'Raigad, Maharashtra', '[]', 'Distributed 50 sample packets', NOW() - INTERVAL '3 days'),
(4, 'group', 'Tumkur Village', 38, 'Water conservation strategies', 13.3392, 77.1010, 'Tumkur, Karnataka', '[]', 'Follow-up meeting planned', NOW() - INTERVAL '5 days'),
(5, 'group', 'Anand Village', 52, 'Dairy farming support', 22.5645, 72.9289, 'Anand, Gujarat', '[]', 'Strong demand for cattle feed products', NOW() - INTERVAL '7 days'),
(6, 'group', 'Alwar', 42, 'Crop disease prevention', 27.5530, 76.6346, 'Alwar, Rajasthan', '[]', 'Demonstrated product effectiveness', NOW() - INTERVAL '9 days'),
(7, 'group', 'Thanjavur', 55, 'Rice cultivation best practices', 10.7870, 79.1378, 'Thanjavur, Tamil Nadu', '[]', 'Received bulk order requests', NOW() - INTERVAL '11 days'),
(8, 'group', 'Hooghly', 48, 'Jute farming innovations', 22.9068, 88.3953, 'Hooghly, West Bengal', '[]', 'Arranged product demo', NOW() - INTERVAL '13 days'),
(9, 'group', 'Sonipat', 40, 'Wheat farming techniques', 28.9931, 77.0151, 'Sonipat, Haryana', '[]', 'Farmers requested product trials', NOW() - INTERVAL '15 days'),
(2, 'group', 'Satara', 50, 'Sugarcane pest management', 17.6805, 73.9963, 'Satara, Maharashtra', '[]', 'Great engagement from farmers', NOW() - INTERVAL '17 days'),
(3, 'group', 'Nashik', 65, 'Grape cultivation support', 19.9975, 73.7898, 'Nashik, Maharashtra', '[]', 'Wine grape farmers association meeting', NOW() - INTERVAL '19 days'),
(4, 'group', 'Mysuru', 44, 'Sandalwood preservation', 12.2958, 76.6394, 'Mysuru, Karnataka', '[]', 'Special interest in organic solutions', NOW() - INTERVAL '21 days'),
(5, 'group', 'Vadodara', 58, 'Cotton farming enhancement', 22.3072, 73.1812, 'Vadodara, Gujarat', '[]', 'Farmer cooperative meeting', NOW() - INTERVAL '23 days'),
(6, 'group', 'Udaipur', 36, 'Maize cultivation techniques', 24.5854, 73.7125, 'Udaipur, Rajasthan', '[]', 'Tribal farmers outreach', NOW() - INTERVAL '25 days'),
(7, 'group', 'Madurai', 62, 'Jasmine flower farming', 9.9252, 78.1198, 'Madurai, Tamil Nadu', '[]', 'Flower farmers association', NOW() - INTERVAL '27 days'),
(8, 'group', 'Bardhaman', 46, 'Potato cultivation methods', 23.2552, 87.8618, 'Bardhaman, West Bengal', '[]', 'Cold storage farmers group', NOW() - INTERVAL '29 days');

-- ============================================
-- SALES DATA (30+ entries)
-- ============================================
INSERT INTO sales (user_id, sale_type, product_sku, pack_size, quantity, amount, mode, customer_name, is_repeat_order, latitude, longitude, location_address, created_at) VALUES
-- B2C Sales
(2, 'B2C', 'PEST-001', '500ml', 10, 5000.00, 'Direct', 'Ramesh Patil', TRUE, 18.5204, 73.8567, 'Pune, Maharashtra', NOW() - INTERVAL '1 day'),
(3, 'B2C', 'FERT-002', '1kg', 15, 7500.00, 'Direct', 'Suresh Agarwal', FALSE, 19.0760, 72.8777, 'Mumbai, Maharashtra', NOW() - INTERVAL '2 days'),
(4, 'B2C', 'SEED-003', '10kg', 5, 3000.00, 'Distributor', 'Ganesh Pillai', TRUE, 12.9716, 77.5946, 'Bangalore, Karnataka', NOW() - INTERVAL '3 days'),
(5, 'B2C', 'PEST-001', '250ml', 20, 8000.00, 'Direct', 'Mahesh Shah', FALSE, 23.0225, 72.5714, 'Ahmedabad, Gujarat', NOW() - INTERVAL '4 days'),
(6, 'B2C', 'FERT-004', '5kg', 8, 4000.00, 'Direct', 'Deepak Singh', TRUE, 26.9124, 75.7873, 'Jaipur, Rajasthan', NOW() - INTERVAL '5 days'),
(7, 'B2C', 'SEED-005', '1kg', 25, 12500.00, 'Distributor', 'Kumar Swamy', FALSE, 13.0827, 80.2707, 'Chennai, Tamil Nadu', NOW() - INTERVAL '6 days'),
(8, 'B2C', 'PEST-006', '1L', 12, 7200.00, 'Direct', 'Ravi Banerjee', TRUE, 22.5726, 88.3639, 'Kolkata, West Bengal', NOW() - INTERVAL '7 days'),
(9, 'B2C', 'FERT-002', '2kg', 18, 9000.00, 'Direct', 'Vijay Khanna', FALSE, 28.7041, 77.1025, 'Delhi, India', NOW() - INTERVAL '8 days'),
(2, 'B2C', 'SEED-007', '5kg', 10, 6000.00, 'Distributor', 'Sanjay Rao', TRUE, 18.5204, 73.8567, 'Pune, Maharashtra', NOW() - INTERVAL '9 days'),
(3, 'B2C', 'PEST-001', '500ml', 22, 11000.00, 'Direct', 'Rekha Desai', FALSE, 19.0760, 72.8777, 'Mumbai, Maharashtra', NOW() - INTERVAL '10 days'),
(4, 'B2C', 'FERT-004', '10kg', 6, 3600.00, 'Direct', 'Bhaskar Reddy', TRUE, 12.9716, 77.5946, 'Bangalore, Karnataka', NOW() - INTERVAL '11 days'),
(5, 'B2C', 'SEED-003', '20kg', 4, 2400.00, 'Distributor', 'Kiran Modi', FALSE, 23.0225, 72.5714, 'Ahmedabad, Gujarat', NOW() - INTERVAL '12 days'),
(6, 'B2C', 'PEST-006', '2L', 9, 10800.00, 'Direct', 'Harish Sharma', TRUE, 26.9124, 75.7873, 'Jaipur, Rajasthan', NOW() - INTERVAL '13 days'),
(7, 'B2C', 'FERT-002', '1kg', 30, 15000.00, 'Direct', 'Meena Raju', FALSE, 13.0827, 80.2707, 'Chennai, Tamil Nadu', NOW() - INTERVAL '14 days'),
(8, 'B2C', 'SEED-005', '2kg', 14, 7000.00, 'Distributor', 'Sunil Ghosh', TRUE, 22.5726, 88.3639, 'Kolkata, West Bengal', NOW() - INTERVAL '15 days'),

-- B2B Sales
(2, 'B2B', 'PEST-001', '10L', 5, 150000.00, 'Distributor', 'Green Agro Store', FALSE, 18.5204, 73.8567, 'Pune, Maharashtra', NOW() - INTERVAL '2 days'),
(3, 'B2B', 'FERT-002', '50kg', 10, 250000.00, 'Direct', 'Farm Fresh Supplies', TRUE, 19.0760, 72.8777, 'Mumbai, Maharashtra', NOW() - INTERVAL '4 days'),
(4, 'B2B', 'SEED-003', '100kg', 8, 200000.00, 'Distributor', 'Krishi Kendra Ltd', FALSE, 12.9716, 77.5946, 'Bangalore, Karnataka', NOW() - INTERVAL '6 days'),
(5, 'B2B', 'PEST-006', '20L', 6, 180000.00, 'Direct', 'Gujarat Agro Hub', TRUE, 23.0225, 72.5714, 'Ahmedabad, Gujarat', NOW() - INTERVAL '8 days'),
(6, 'B2B', 'FERT-004', '100kg', 12, 300000.00, 'Distributor', 'Rajasthan Farm Store', FALSE, 26.9124, 75.7873, 'Jaipur, Rajasthan', NOW() - INTERVAL '10 days'),
(7, 'B2B', 'SEED-005', '50kg', 15, 375000.00, 'Direct', 'Tamil Farmers Coop', TRUE, 13.0827, 80.2707, 'Chennai, Tamil Nadu', NOW() - INTERVAL '12 days'),
(8, 'B2B', 'PEST-001', '15L', 8, 240000.00, 'Distributor', 'Bengal Agro Mandi', FALSE, 22.5726, 88.3639, 'Kolkata, West Bengal', NOW() - INTERVAL '14 days'),
(9, 'B2B', 'FERT-002', '200kg', 5, 500000.00, 'Direct', 'Delhi Farm Supplies', TRUE, 28.7041, 77.1025, 'Delhi, India', NOW() - INTERVAL '16 days'),
(2, 'B2B', 'SEED-007', '75kg', 10, 225000.00, 'Distributor', 'Maharashtra Seeds Corp', FALSE, 18.5204, 73.8567, 'Pune, Maharashtra', NOW() - INTERVAL '18 days'),
(3, 'B2B', 'PEST-006', '25L', 7, 210000.00, 'Direct', 'Mumbai Agro Wholesale', TRUE, 19.0760, 72.8777, 'Mumbai, Maharashtra', NOW() - INTERVAL '20 days'),
(4, 'B2B', 'FERT-004', '150kg', 9, 270000.00, 'Distributor', 'Karnataka Farm Mall', FALSE, 12.9716, 77.5946, 'Bangalore, Karnataka', NOW() - INTERVAL '22 days'),
(5, 'B2B', 'SEED-003', '120kg', 11, 330000.00, 'Direct', 'Gujarat Seed Company', TRUE, 23.0225, 72.5714, 'Ahmedabad, Gujarat', NOW() - INTERVAL '24 days'),
(6, 'B2B', 'PEST-001', '30L', 4, 360000.00, 'Distributor', 'Rajasthan Agro Center', FALSE, 26.9124, 75.7873, 'Jaipur, Rajasthan', NOW() - INTERVAL '26 days'),
(7, 'B2B', 'FERT-002', '80kg', 13, 325000.00, 'Direct', 'Chennai Farm Depot', TRUE, 13.0827, 80.2707, 'Chennai, Tamil Nadu', NOW() - INTERVAL '28 days'),
(8, 'B2B', 'SEED-005', '90kg', 6, 270000.00, 'Distributor', 'Kolkata Seed Market', FALSE, 22.5726, 88.3639, 'Kolkata, West Bengal', NOW() - INTERVAL '30 days');

-- ============================================
-- SAMPLE DISTRIBUTIONS DATA (20+ entries)
-- ============================================
INSERT INTO sample_distributions (user_id, quantity, recipient_name, purpose, latitude, longitude, location_address, created_at) VALUES
(2, 10, 'Shirdi Farmers Group', 'Product trial for pest control', 19.7645, 74.4782, 'Shirdi, Maharashtra', NOW() - INTERVAL '1 day'),
(3, 15, 'Raigad Agro Society', 'Fertilizer effectiveness test', 18.2257, 73.1340, 'Raigad, Maharashtra', NOW() - INTERVAL '3 days'),
(4, 8, 'Bangalore Organic Farm', 'Seed quality demonstration', 12.9716, 77.5946, 'Bangalore, Karnataka', NOW() - INTERVAL '5 days'),
(5, 12, 'Ahmedabad Farm Coop', 'New product introduction', 23.0225, 72.5714, 'Ahmedabad, Gujarat', NOW() - INTERVAL '7 days'),
(6, 20, 'Jaipur Agricultural College', 'Educational demonstration', 26.9124, 75.7873, 'Jaipur, Rajasthan', NOW() - INTERVAL '9 days'),
(7, 18, 'Chennai Farmers Association', 'Crop protection samples', 13.0827, 80.2707, 'Chennai, Tamil Nadu', NOW() - INTERVAL '11 days'),
(8, 14, 'Kolkata Horticulture Society', 'Fertilizer testing', 22.5726, 88.3639, 'Kolkata, West Bengal', NOW() - INTERVAL '13 days'),
(9, 16, 'Delhi Organic Growers', 'Seed variety trial', 28.7041, 77.1025, 'Delhi, India', NOW() - INTERVAL '15 days'),
(2, 11, 'Pune Grape Growers', 'Fungicide demonstration', 18.5204, 73.8567, 'Pune, Maharashtra', NOW() - INTERVAL '17 days'),
(3, 13, 'Nashik Wine Farmers', 'Insecticide samples', 19.9975, 73.7898, 'Nashik, Maharashtra', NOW() - INTERVAL '19 days'),
(4, 9, 'Mysore Coffee Estate', 'Pest control trial', 12.2958, 76.6394, 'Mysuru, Karnataka', NOW() - INTERVAL '21 days'),
(5, 17, 'Vadodara Cotton Farmers', 'Growth enhancer samples', 22.3072, 73.1812, 'Vadodara, Gujarat', NOW() - INTERVAL '23 days'),
(6, 15, 'Udaipur Maize Growers', 'Seed treatment demo', 24.5854, 73.7125, 'Udaipur, Rajasthan', NOW() - INTERVAL '25 days'),
(7, 19, 'Madurai Flower Farmers', 'Flowering stimulant test', 9.9252, 78.1198, 'Madurai, Tamil Nadu', NOW() - INTERVAL '27 days'),
(8, 10, 'Bardhaman Potato Farmers', 'Disease prevention samples', 23.2552, 87.8618, 'Bardhaman, West Bengal', NOW() - INTERVAL '29 days'),
(2, 12, 'Satara Sugarcane Society', 'Pest management samples', 17.6805, 73.9963, 'Satara, Maharashtra', NOW() - INTERVAL '31 days'),
(3, 14, 'Thane Vegetable Growers', 'Nutrient supplement samples', 19.2183, 72.9781, 'Thane, Maharashtra', NOW() - INTERVAL '33 days'),
(4, 11, 'Tumkur Ragi Farmers', 'Organic fertilizer trial', 13.3392, 77.1010, 'Tumkur, Karnataka', NOW() - INTERVAL '35 days'),
(5, 16, 'Anand Dairy Farmers', 'Cattle feed supplement samples', 22.5645, 72.9289, 'Anand, Gujarat', NOW() - INTERVAL '37 days'),
(6, 13, 'Alwar Wheat Growers', 'Weed control samples', 27.5530, 76.6346, 'Alwar, Rajasthan', NOW() - INTERVAL '39 days'),
(7, 18, 'Thanjavur Rice Farmers', 'Paddy growth enhancer', 10.7870, 79.1378, 'Thanjavur, Tamil Nadu', NOW() - INTERVAL '41 days'),
(8, 15, 'Hooghly Jute Farmers', 'Jute protection samples', 22.9068, 88.3953, 'Hooghly, West Bengal', NOW() - INTERVAL '43 days');

-- ============================================
-- ACTIVITY LOGS DATA
-- ============================================
INSERT INTO activity_logs (user_id, activity_type, activity_date, distance_traveled, areas_covered, notes) VALUES
(2, 'meeting', CURRENT_DATE - INTERVAL '1 day', 45.5, ARRAY['Pune City', 'Shirdi'], 'Productive day with 2 meetings'),
(3, 'sale', CURRENT_DATE - INTERVAL '2 days', 32.8, ARRAY['Mumbai', 'Thane'], 'Closed 3 B2C sales'),
(4, 'sample', CURRENT_DATE - INTERVAL '3 days', 28.2, ARRAY['Bangalore'], 'Sample distribution at college'),
(5, 'meeting', CURRENT_DATE - INTERVAL '4 days', 50.3, ARRAY['Ahmedabad', 'Anand'], 'Group meeting success'),
(6, 'sale', CURRENT_DATE - INTERVAL '5 days', 38.7, ARRAY['Jaipur'], 'B2B deal finalized'),
(7, 'meeting', CURRENT_DATE - INTERVAL '6 days', 42.1, ARRAY['Chennai', 'Madurai'], 'Flower farmers outreach'),
(8, 'sample', CURRENT_DATE - INTERVAL '7 days', 25.6, ARRAY['Kolkata'], 'Product demo at society'),
(9, 'sale', CURRENT_DATE - INTERVAL '8 days', 35.9, ARRAY['Delhi', 'Sonipat'], 'Multiple small sales'),
(2, 'meeting', CURRENT_DATE - INTERVAL '9 days', 55.4, ARRAY['Satara', 'Pune'], 'Sugarcane farmers meeting'),
(3, 'sale', CURRENT_DATE - INTERVAL '10 days', 29.3, ARRAY['Mumbai'], 'B2B order from retailer');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT 'Total Distributors' AS info, COUNT(*) AS count FROM users WHERE role = 'distributor'
UNION ALL
SELECT 'Total Meetings', COUNT(*) FROM meetings
UNION ALL
SELECT 'One-on-One Meetings', COUNT(*) FROM meetings WHERE meeting_type = 'one-on-one'
UNION ALL
SELECT 'Group Meetings', COUNT(*) FROM meetings WHERE meeting_type = 'group'
UNION ALL
SELECT 'Total Sales', COUNT(*) FROM sales
UNION ALL
SELECT 'B2C Sales', COUNT(*) FROM sales WHERE sale_type = 'B2C'
UNION ALL
SELECT 'B2B Sales', COUNT(*) FROM sales WHERE sale_type = 'B2B'
UNION ALL
SELECT 'Total Samples', COUNT(*) FROM sample_distributions
UNION ALL
SELECT 'Total Activity Logs', COUNT(*) FROM activity_logs;
