'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_security_preferences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pin_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      biometric_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      is_first_login: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      pin_failed_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      pin_lockout_until: {
        type: Sequelize.DATE,
        allowNull: true
      },
      device_id: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Unique device identifier for security tracking'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Add unique constraint to ensure one record per user
    try {
      await queryInterface.addIndex('user_security_preferences', ['user_id'], {
        unique: true,
        name: 'user_security_preferences_user_id_unique'
      });
    } catch (e) {
      // Index may already exist, ignore error
      console.log('Index user_security_preferences_user_id_unique may already exist');
    }

    // Add index for device_id for faster lookups
    try {
      await queryInterface.addIndex('user_security_preferences', ['device_id'], {
        name: 'user_security_preferences_device_id_index'
      });
    } catch (e) {
      // Index may already exist, ignore error
      console.log('Index user_security_preferences_device_id_index may already exist');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_security_preferences');
  }
};