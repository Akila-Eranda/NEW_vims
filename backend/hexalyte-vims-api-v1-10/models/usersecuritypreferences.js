'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserSecurityPreferences extends Model {
    static associate(models) {
      // Define association with User model
      UserSecurityPreferences.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  UserSecurityPreferences.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    pin_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    biometric_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_first_login: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    pin_failed_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    pin_lockout_until: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // TEMPORARILY DISABLED: device_id field - table doesn't have this column yet
    // device_id: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserSecurityPreferences',
    tableName: 'user_security_preferences',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      }
      // TEMPORARILY DISABLED: device_id index - column doesn't exist yet
      // {
      //   fields: ['device_id']
      // }
    ]
  });

  return UserSecurityPreferences;
};