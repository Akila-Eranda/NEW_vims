'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class returnorders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // returnorders.belongsTo(models.returnorderitems, { foreignKey: 'ReturnID' })
      returnorders.hasMany(models.returnorderitems, { foreignKey: 'ReturnID' });

      returnorders.belongsTo(models.salesorder, { foreignKey: 'SalesOrderID' })
      returnorders.belongsTo(models.purchaseorder, { foreignKey: 'PurchaseOrderID' })
      returnorders.belongsTo(models.user, { foreignKey: 'CreatedBy' });

    }
  }
  returnorders.init({

    ReturnID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    SalesOrderID: {
      type: DataTypes.INTEGER,
      references: {
        model: "salesorders",
        key: "OrderID"
      },
      allowNull: true
    },

    PurchaseOrderID: {
      type: DataTypes.INTEGER,
      references: {
        model: "purchaseorders",
        key: "OrderID"
      },
      allowNull: true
    },

    ReturnDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    Reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    CreatedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },

    TotalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },

    Status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'PENDING'
    },

    LocationID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }

  }, {
    sequelize,
    modelName: 'returnorders',
  });
  return returnorders;
};