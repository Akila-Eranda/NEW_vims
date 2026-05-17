const dashboardService = require('../service/dashboard.service');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

/**
 * Get comprehensive dashboard statistics
 * @route GET /dashboard/stats
 * @returns {Object} Dashboard statistics including revenue, orders, customers, inventory
 */
const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  
  return res.status(httpStatus.OK).send({
    status: 'success',
    data: stats
  });
});

/**
 * Get sales analytics with charts data
 * @route GET /dashboard/analytics
 * @returns {Object} Analytics data for charts including sales trends, top products, best customers
 */
const getAnalytics = catchAsync(async (req, res) => {
  const analytics = await dashboardService.getAnalyticsData();
  
  return res.status(httpStatus.OK).send({
    status: 'success',
    data: analytics
  });
});

/**
 * Get top selling products
 * @route GET /dashboard/top-products
 * @returns {Object} Top selling products with sales data
 */
const getTopProducts = catchAsync(async (req, res) => {
  const { limit = 10 } = req.query;
  const topProducts = await dashboardService.getTopProducts(parseInt(limit));
  
  return res.status(httpStatus.OK).send({
    status: 'success',
    data: topProducts
  });
});

/**
 * Get best customers
 * @route GET /dashboard/best-customers  
 * @returns {Object} Best customers with purchase data
 */
const getBestCustomers = catchAsync(async (req, res) => {
  const { limit = 10 } = req.query;
  const bestCustomers = await dashboardService.getBestCustomers(parseInt(limit));
  
  return res.status(httpStatus.OK).send({
    status: 'success',
    data: bestCustomers
  });
});

/**
 * Get daily revenue for last 30 days
 * @route GET /dashboard/daily-revenue
 * @returns {Object} Daily revenue data with totals and averages
 */
const getDailyRevenue = catchAsync(async (req, res) => {
  const dailyRevenue = await dashboardService.getDailyRevenue();
  
  return res.status(httpStatus.OK).send({
    status: 'success',
    data: dailyRevenue
  });
});

module.exports = {
  getDashboardStats,
  getAnalytics,
  getTopProducts,
  getBestCustomers,
  getDailyRevenue
};
