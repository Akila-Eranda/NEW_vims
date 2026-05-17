-- User Security Preferences Migration
-- This script creates the user_security_preferences table for Flutter app security features
-- Run this in MySQL console, phpMyAdmin, or any MySQL client

-- Check if table already exists
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN 'Table user_security_preferences already exists!'
    ELSE 'Ready to create user_security_preferences table'
  END AS status
FROM information_schema.tables 
WHERE table_schema = DATABASE() AND table_name = 'user_security_preferences';

-- Create the user_security_preferences table
CREATE TABLE IF NOT EXISTS user_security_preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  pin_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  biometric_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  failed_pin_attempts INT NOT NULL DEFAULT 0,
  last_failed_pin_attempt DATETIME NULL,
  is_locked_out BOOLEAN NOT NULL DEFAULT FALSE,
  lockout_until DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes for performance
  UNIQUE KEY unique_user_security (user_id),
  INDEX idx_user_security_user_id (user_id),
  INDEX idx_user_security_lockout (is_locked_out, lockout_until),

  -- Foreign key constraint
  CONSTRAINT fk_user_security_user_id 
    FOREIGN KEY (user_id) 
    REFERENCES users (id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify table creation
SELECT 'Table user_security_preferences created successfully!' AS result;

-- Insert default security preferences for existing users (optional)
-- Uncomment the line below to add default preferences for all existing users
-- INSERT IGNORE INTO user_security_preferences (user_id, pin_enabled, biometric_enabled) 
-- SELECT id, FALSE, FALSE FROM users;

-- Show final table structure
DESCRIBE user_security_preferences;