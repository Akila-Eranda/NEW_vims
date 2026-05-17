'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class warehouselocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  warehouselocation.hasMany(models.warehousetransfers, {
    foreignKey: 'sourceWarehouseId',
    as: 'sourceTransfers'
  });

  warehouselocation.hasMany(models.warehousetransfers, {
    foreignKey: 'targetWarehouseId',
    as: 'targetTransfers'
  });

  warehouselocation.belongsToMany(models.product, {
    through: models.productstorage,
    foreignKey: 'LocationID'
  });
}
  }
  warehouselocation.init({
    LocationID: {type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    WarehouseName: {
      type:DataTypes.STRING,
    allowNull:false
    },
    Address: {type:DataTypes.STRING,
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'warehouselocation',
    timestamps: true, 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt'

  });
  return warehouselocation;
};