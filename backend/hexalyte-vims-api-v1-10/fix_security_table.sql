-- Fix user_security_preferences table structure
-- This script ensures the table has all required columns and indexes

-- Drop the table if it exists to start fresh
DROP TABLE IF EXISTS `user_security_preferences`;

-- Create table with all required columns
CREATE TABLE `user_security_preferences` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `pin_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `biometric_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `is_first_login` TINYINT(1) NOT NULL DEFAULT 1,
  `pin_failed_attempts` INT NOT NULL DEFAULT 0,
  `pin_lockout_until` DATETIME DEFAULT NULL,
  `device_id` VARCHAR(255) DEFAULT NULL COMMENT 'Unique device identifier for security tracking',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_security_preferences_user_id_unique` (`user_id`),
  KEY `user_security_preferences_device_id_index` (`device_id`),
  CONSTRAINT `user_security_preferences_ibfk_1` 
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default records for existing users
INSERT INTO `user_security_preferences` (`user_id`, `pin_enabled`, `biometric_enabled`, `is_first_login`)
SELECT `id`, 0, 0, 1 
FROM `users` 
WHERE `id` NOT IN (SELECT `user_id` FROM `user_security_preferences` WHERE `id` IS NOT NULL);
