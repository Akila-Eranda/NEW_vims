'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salesroutes', {
      RouteID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      RouteName: { type: Sequelize.STRING(100), allowNull: false },
      Area: { type: Sequelize.STRING(200), allowNull: true },
      AssignedRepID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' }
      },
      VisitDay: { type: Sequelize.STRING(50), allowNull: true },
      Notes: { type: Sequelize.TEXT, allowNull: true },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('salesroutes');
  }
};
