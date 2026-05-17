'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product.hasMany(models.inventorytransaction, { foreignKey: 'ProductID' })
      product.belongsTo(models.category, { foreignKey: 'CategoryID', onDelete: 'SET NULL' })
      product.belongsTo(models.supplier, { foreignKey: 'SupplierID', onDelete: 'SET NULL' })
      product.belongsToMany(models.warehouselocation, {
        through: models.productstorage,
        foreignKey: 'ProductID'
      })
      // product.belongsToMany(models.purchaseorder, {
      //   through: models.purchaseorderdetail,
      //   foreignKey: 'ProductID'
      // })
      product.belongsToMany(models.salesorder, {
        through: models.salesorderdetail,
        foreignKey: 'ProductID'
      })
      product.hasMany(models.warehousetransfers, {
        foreignKey: 'ProductID',
        // as: 'transfers'
      });

      product.hasMany(models.returnorderitems, { foreignKey: 'ProductID' })

    }
  }
  product.init({
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Name: DataTypes.STRING(100),
    Description: DataTypes.STRING,
    BuyingPrice: DataTypes.DECIMAL(10, 2),
    SellingPrice: DataTypes.DECIMAL(10, 2),
    QuantityInStock: DataTypes.DECIMAL(10, 2),
    SupplierID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'suppliers',
        key: 'SupplierID'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'categories',
        key: 'CategoryID'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};