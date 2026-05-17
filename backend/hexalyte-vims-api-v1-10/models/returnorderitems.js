'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class returnorderitems extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            returnorderitems.belongsTo(models.returnorders, { foreignKey: 'ReturnID' })
            returnorderitems.belongsTo(models.product, { foreignKey: 'ProductID' })

        }
    }
    returnorderitems.init({

        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },

        ReturnID: {
            type: DataTypes.INTEGER,
            references: {
                model: "returnorders",
                key: "ReturnID"
            },
            allowNull: false
        },

        ProductID: {
            type: DataTypes.INTEGER,
            references: {
                model: "products",
                key: "ProductID"
            }
        },

        Quantity: {
            type: DataTypes.INTEGER
        },

        UnitPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },

        Note: {
            type: DataTypes.TEXT
        }

    }, {
        sequelize,
        modelName: 'returnorderitems',
    });
    return returnorderitems;
};