'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesRepTarget extends Model {
    static associate(models) {
      SalesRepTarget.belongsTo(models.user, { foreignKey: 'SalesRepID', as: 'salesRep' });
    }
  }
  SalesRepTarget.init({
    TargetID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    SalesRepID: { type: DataTypes.INTEGER, allowNull: false },
    Month: { type: DataTypes.INTEGER, allowNull: false },
    Year: { type: DataTypes.INTEGER, allowNull: false },
    TargetAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    TargetOrders: { type: DataTypes.INTEGER, defaultValue: 0 },
    CommissionRate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    AchievedAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    AchievedOrders: { type: DataTypes.INTEGER, defaultValue: 0 },
    CommissionEarned: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  }, { sequelize, modelName: 'salesreptarget', tableName: 'salesreptargets' });
  return SalesRepTarget;
};
