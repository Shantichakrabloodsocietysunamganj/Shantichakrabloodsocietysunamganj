-- SCBS Database Schema for Supabase
-- Run this SQL in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Blood Groups Reference Table
CREATE TABLE blood_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(10) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE
);

-- Insert blood groups
INSERT INTO blood_groups (name, code) VALUES 
('A+', 'A_POSITIVE'),
('A-', 'A_NEGATIVE'),
('B+', 'B_POSITIVE'),
('B-', 'B_NEGATIVE'),
('O+', 'O_POSITIVE'),
('O-', 'O_NEGATIVE'),
('AB+', 'AB_POSITIVE'),
('AB-', 'AB_NEGATIVE');

-- Districts Reference Table
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    bn_name VARCHAR(100),
    division VARCHAR(100) NOT NULL
);

-- Insert districts
INSERT INTO districts (name, bn_name, division) VALUES 
('Sunamganj', 'সুনামগঞ্জ', 'Sylhet'),
('Sylhet', 'সিলেট', 'Sylhet'),
('Moulvibazar', 'মৌলভীবাজার', 'Sylhet'),
('Habiganj', 'হবিগঞ্জ', 'Sylhet');

-- Upazilas Reference Table
CREATE TABLE upazilas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    bn_name VARCHAR(100),
    district_id UUID REFERENCES districts(id) ON DELETE CASCADE
);

-- Blood Requests Table
CREATE TABLE blood_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_name VARCHAR(100) NOT NULL,
    patient_age INTEGER NOT NULL CHECK (patient_age > 0 AND patient_age <= 150),
    patient_gender VARCHAR(20) NOT NULL CHECK (patient_gender IN ('male', 'female', 'other')),
    blood_group VARCHAR(10) NOT NULL,
    units_needed INTEGER NOT NULL CHECK (units_needed >= 1 AND units_needed <= 10),
    urgency_level VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (urgency_level IN ('critical', 'urgent', 'normal')),
    hospital_name VARCHAR(200) NOT NULL,
    hospital_address VARCHAR(500) NOT NULL,
    required_date DATE NOT NULL,
    required_time VARCHAR(10),
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    message TEXT,
    prescription_url VARCHAR(500),
    blood_report_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'expired')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for blood_requests
CREATE INDEX idx_blood_requests_status ON blood_requests(status);
CREATE INDEX idx_blood_requests_blood_group ON blood_requests(blood_group);
CREATE INDEX idx_blood_requests_expires_at ON blood_requests(expires_at);
CREATE INDEX idx_blood_requests_created_at ON blood_requests(created_at DESC);

-- Donors Table
CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    blood_group VARCHAR(10) NOT NULL,
    district VARCHAR(100) NOT NULL,
    upazila VARCHAR(100),
    last_donation_date DATE,
    availability VARCHAR(30) NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'temporarily_unavailable')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for donors
CREATE INDEX idx_donors_blood_group ON donors(blood_group);
CREATE INDEX idx_donors_district ON donors(district);
CREATE INDEX idx_donors_availability ON donors(availability);

-- Volunteers Table
CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    district VARCHAR(100) NOT NULL,
    upazila VARCHAR(100),
    skills TEXT[],
    motivation TEXT,
    availability VARCHAR(30) NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'part_time', 'occasional')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for volunteers
CREATE INDEX idx_volunteers_district ON volunteers(district);
CREATE INDEX idx_volunteers_status ON volunteers(status);

-- Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time VARCHAR(10),
    venue VARCHAR(300) NOT NULL,
    venue_map_url VARCHAR(500),
    max_participants INTEGER,
    banner_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for events
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);

-- News Table
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    featured_image VARCHAR(500),
    category VARCHAR(100),
    slug VARCHAR(300) UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for news
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_slug ON news(slug);

-- Contact Messages Table
CREATE TABLE contact (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    reply TEXT,
    replied_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for contact
CREATE INDEX idx_contact_status ON contact(status);

-- Settings Table
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean')),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value, type) VALUES 
('organization_name', 'Shantichakra Blood Society Sunamganj', 'string'),
('tagline', 'Together We Save Lives', 'string'),
('contact_phone', '+880 1792-456922', 'string'),
('contact_email', 'contact@scbs.org', 'string'),
('address', 'জীবধারা বাজার, শান্তিগঞ্জ, সুনামগঞ্জ', 'string'),
('whatsapp_group_url', '', 'string'),
('facebook_group_url', '', 'string'),
('maintenance_mode', 'false', 'boolean');

-- Enable Row Level Security (RLS)
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies
CREATE POLICY "Public can view active blood requests" ON blood_requests
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view available donors" ON donors
    FOR SELECT USING (availability = 'available');

CREATE POLICY "Public can view published events" ON events
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published news" ON news
    FOR SELECT USING (status = 'published');

-- Public Insert Policies
CREATE POLICY "Public can create blood requests" ON blood_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create donors" ON donors
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create volunteers" ON volunteers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create contact messages" ON contact
    FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_blood_requests_updated_at
    BEFORE UPDATE ON blood_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donors_updated_at
    BEFORE UPDATE ON donors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at
    BEFORE UPDATE ON volunteers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
