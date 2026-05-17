'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      category.hasMany(models.product, { foreignKey: 'CategoryID' });
    }
  }
  category.init({
    CategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true  
    },
    Name: DataTypes.STRING,
    Description: DataTypes.TEXT,
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'category',
  });
  return category;
};