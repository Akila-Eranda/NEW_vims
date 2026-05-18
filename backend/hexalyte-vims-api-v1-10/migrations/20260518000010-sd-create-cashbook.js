'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cashbook', {
      EntryID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      EntryDate: { type: Sequelize.DATEONLY, allowNull: false },
      Type: { type: Sequelize.ENUM('Income', 'Expense'), allowNull: false },
      Category: { type: Sequelize.STRING(100) },
      Description: { type: Sequelize.STRING(255), allowNull: false },
      Amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      PaymentMethod: { type: Sequelize.ENUM('Cash', 'Bank', 'Cheque'), defaultValue: 'Cash' },
      Reference: { type: Sequelize.STRING(100) },
      RelatedOrderID: { type: Sequelize.INTEGER },
      RelatedCustomerID: { type: Sequelize.INTEGER },
      RelatedSupplierID: { type: Sequelize.INTEGER },
      CreatedByID: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Commission & Targets for sales reps
    await queryInterface.createTable('salesreptargets', {
      TargetID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      SalesRepID: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      Month: { type: Sequelize.INTEGER, allowNull: false },
      Year: { type: Sequelize.INTEGER, allowNull: false },
      TargetAmount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      TargetOrders: { type: Sequelize.INTEGER, defaultValue: 0 },
      CommissionRate: { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      AchievedAmount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      AchievedOrders: { type: Sequelize.INTEGER, defaultValue: 0 },
      CommissionEarned: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Low stock alerts log
    await queryInterface.createTable('stockalerts', {
      AlertID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      ProductID: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'products', key: 'ProductID' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      CurrentStock: { type: Sequelize.INTEGER },
      ReorderLevel: { type: Sequelize.INTEGER },
      Status: { type: Sequelize.ENUM('Active', 'Resolved'), defaultValue: 'Active' },
      ResolvedAt: { type: Sequelize.DATE },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('stockalerts');
    await queryInterface.dropTable('salesreptargets');
    await queryInterface.dropTable('cashbook');
  }
};
