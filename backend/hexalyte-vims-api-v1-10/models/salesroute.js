'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class salesroute extends Model {
    static associate(models) {
      salesroute.belongsTo(models.user, { foreignKey: 'AssignedRepID', as: 'salesRep' });
      salesroute.hasMany(models.customer, { foreignKey: 'RouteID', as: 'customers' });
      salesroute.hasMany(models.salesorder, { foreignKey: 'RouteID', as: 'orders' });
    }
  }
  salesroute.init({
    RouteID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    RouteName: { type: DataTypes.STRING(100), allowNull: false },
    Area: { type: DataTypes.STRING(200), allowNull: true },
    AssignedRepID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    },
    VisitDay: { type: DataTypes.STRING(50), allowNull: true },
    Notes: { type: DataTypes.TEXT, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { sequelize, modelName: 'salesroute' });
  return salesroute;
};
