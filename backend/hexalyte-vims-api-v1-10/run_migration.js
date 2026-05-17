const { Sequelize } = require('sequelize');

// Database configuration (using the same config as the app)
const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'vims_app',
  username: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  port: process.env.DB_PORT || 3306
});

async function runMigration() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    console.log('🔄 Creating user_security_preferences table...');
    
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS user_security_preferences (
        id int(11) NOT NULL AUTO_INCREMENT,
        user_id int(11) NOT NULL,
        pin_enabled tinyint(1) NOT NULL DEFAULT 0,
        biometric_enabled tinyint(1) NOT NULL DEFAULT 0,
        is_first_login tinyint(1) NOT NULL DEFAULT 1,
        pin_failed_attempts int(11) NOT NULL DEFAULT 0,
        pin_lockout_until datetime DEFAULT NULL,
        device_id varchar(255) DEFAULT NULL COMMENT 'Unique device identifier for security tracking',
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY user_security_preferences_user_id_unique (user_id),
        KEY user_security_preferences_device_id_index (device_id),
        CONSTRAINT user_security_preferences_user_id_foreign 
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ Table created successfully');
    console.log('🔄 Testing table structure...');
    
    const [results] = await sequelize.query("DESCRIBE user_security_preferences");
    console.log('📋 Table structure:', results);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

runMigration();