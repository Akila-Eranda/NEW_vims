// Direct MySQL migration script (no Sequelize dependency)
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  let connection;
  try {
    console.log('🔍 Connecting to MySQL database...');
    
    // Database connection config
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || '5Y43HF85KGJ2TZ77',
      database: process.env.DB_NAME || 'hexa_vims_db_development'
    };
    
    console.log(`📡 Connecting to: ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connected to database successfully');
    
    // Check if table already exists
    const [rows] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'user_security_preferences'
    `, [dbConfig.database]);
    
    if (rows[0].count > 0) {
      console.log('⚠️  Table user_security_preferences already exists, skipping creation');
      return;
    }
    
    console.log('🏗️  Creating user_security_preferences table...');
    
    // Create the table
    const createTableSQL = `
      CREATE TABLE user_security_preferences (
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
        
        UNIQUE KEY unique_user_security (user_id),
        INDEX idx_user_security_user_id (user_id),
        INDEX idx_user_security_lockout (is_locked_out, lockout_until),
        
        CONSTRAINT fk_user_security_user_id 
          FOREIGN KEY (user_id) 
          REFERENCES users (id) 
          ON DELETE CASCADE 
          ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createTableSQL);
    console.log('✅ Table user_security_preferences created successfully');
    
    // Insert a default record for admin user (assuming user ID 1 exists)
    try {
      await connection.execute(`
        INSERT IGNORE INTO user_security_preferences 
        (user_id, pin_enabled, biometric_enabled) 
        VALUES (1, false, false)
      `);
      console.log('✅ Added default security preferences for admin user');
    } catch (insertError) {
      console.log('⚠️  Could not add default record (user ID 1 might not exist)');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      console.log('💡 This might be because the users table structure is different than expected');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Database connection refused - make sure MySQL is running');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Access denied - check database credentials');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔒 Database connection closed');
    }
  }
}

console.log('🚀 Starting security preferences table migration...');
runMigration();