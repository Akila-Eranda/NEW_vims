'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.hasMany(models.product, { foreignKey: 'BrandID', as: 'products' });
    }
  }
  Brand.init({
    BrandID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Name: { type: DataTypes.STRING(100), allowNull: false },
    Description: DataTypes.TEXT,
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { sequelize, modelName: 'brand', tableName: 'brands' });
  return Brand;
};
