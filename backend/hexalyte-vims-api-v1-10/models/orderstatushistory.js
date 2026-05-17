'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderstatushistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      orderstatushistory.belongsTo(models.purchaseorder)
      orderstatushistory.belongsTo(models.salesorder)
    }
  }
  orderstatushistory.init({
    StatusID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    OldStatus: DataTypes.STRING(50),
    NewStatus: DataTypes.STRING(50),
    StatusChangeDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'orderstatushistory',
  });
  return orderstatushistory;
};