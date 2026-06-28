-- ============================================
-- Database Initialization Script
-- ============================================
-- This script runs automatically when PostgreSQL container starts for the first time
-- Add any initial database setup here

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For full-text search

-- Create schemas if needed
-- CREATE SCHEMA IF NOT EXISTS app;

-- Set default search path
-- ALTER DATABASE hiremind SET search_path TO public, app;

-- Print success message
DO $$
BEGIN
  RAISE NOTICE 'Database initialized successfully!';
END $$;
