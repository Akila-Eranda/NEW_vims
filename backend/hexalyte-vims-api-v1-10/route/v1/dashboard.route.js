const express = require('express');
const router = express.Router();
const dashboardController = require('../../controller/dashboard.controller');
const { auth } = require('../../middleware/auth');

/**
 * @route GET /dashboard/stats
 * @description Get comprehensive dashboard statistics
 * @access Private (requires authentication)
 */
router
  .route('/stats')
  .get(auth(), dashboardController.getDashboardStats);

/**
 * @route GET /dashboard/analytics
 * @description Get analytics data for charts
 * @access Private (requires authentication)
 */
router
  .route('/analytics')
  .get(auth(), dashboardController.getAnalytics);

/**
 * @route GET /dashboard/top-products
 * @description Get top selling products
 * @access Private (requires authentication)
 */
router
  .route('/top-products')
  .get(auth(), dashboardController.getTopProducts);

/**
 * @route GET /dashboard/best-customers
 * @description Get best customers
 * @access Private (requires authentication)
 */
router
  .route('/best-customers')
  .get(auth(), dashboardController.getBestCustomers);

/**
 * @route GET /dashboard/daily-revenue
 * @description Get daily revenue for last 30 days
 * @access Private (requires authentication)
 */
router
  .route('/daily-revenue')
  .get(auth(), dashboardController.getDailyRevenue);

module.exports = router;
