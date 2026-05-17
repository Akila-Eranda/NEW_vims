'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class warehousetransfers extends Model {
        static associate(models) {
            warehousetransfers.belongsTo(models.warehouselocation, {
                foreignKey: 'sourceWarehouseId',
                as: 'sourceWarehouse'
            });

            warehousetransfers.belongsTo(models.warehouselocation, {
                foreignKey: 'targetWarehouseId',
                as: 'targetWarehouse'
            });

            warehousetransfers.belongsTo(models.user, {
                foreignKey: 'transferBy',
                as: 'transferredBy'
            });

            warehousetransfers.belongsTo(models.product, {
                foreignKey: 'ProductID',
                // as: 'transferredBy'
            });
        }
    }

    warehousetransfers.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sourceWarehouseId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        targetWarehouseId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        quantity: {
            type: DataTypes.INTEGER
        },
        transferDate: {
            type: DataTypes.DATE
        },
        transferBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'warehousetransfers',
        tableName: 'warehousetransfers'
    });

    return warehousetransfers;
};
