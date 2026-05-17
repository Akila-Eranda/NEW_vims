// controller/pnl.controller.js
// Profit & Loss Report Controller

const httpStatus  = require('http-status');
const catchAsync  = require('../utils/catchAsync');
const pnlService  = require('../service/pnl.service');

/**
 * GET /v1/pnl/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Full P&L summary: Revenue, COGS, Gross Profit, Returns, Net Profit
 */
const getPnLSummary = catchAsync(async (req, res) => {
  const {
    startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
    endDate   = new Date().toISOString().slice(0, 10),
  } = req.query;

  const data = await pnlService.getPnLSummary({ startDate, endDate });

  return res.status(httpStatus.OK).send({
    status:  'success',
    message: 'P&L summary retrieved successfully',
    data,
  });
});

/**
 * GET /v1/pnl/monthly?year=2025
 * Monthly breakdown of P&L for a given year (defaults to current year)
 */
const getMonthlyPnL = catchAsync(async (req, res) => {
  const { year } = req.query;

  const data = await pnlService.getMonthlyPnL({ year: year ? parseInt(year) : null });

  return res.status(httpStatus.OK).send({
    status:  'success',
    message: 'Monthly P&L retrieved successfully',
    data,
  });
});

/**
 * GET /v1/pnl/by-category?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Category-wise P&L breakdown
 */
const getCategoryPnL = catchAsync(async (req, res) => {
  const {
    startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
    endDate   = new Date().toISOString().slice(0, 10),
  } = req.query;

  const data = await pnlService.getCategoryPnL({ startDate, endDate });

  return res.status(httpStatus.OK).send({
    status:  'success',
    message: 'Category P&L retrieved successfully',
    data,
  });
});

/**
 * GET /v1/pnl/top-products?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&limit=10
 * Top profitable products
 */
const getTopProfitableProducts = catchAsync(async (req, res) => {
  const {
    startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10),
    endDate   = new Date().toISOString().slice(0, 10),
    limit     = 10,
  } = req.query;

  const data = await pnlService.getTopProfitableProducts({ startDate, endDate, limit });

  return res.status(httpStatus.OK).send({
    status:  'success',
    message: 'Top profitable products retrieved successfully',
    data,
  });
});

/**
 * GET /v1/pnl/daily?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Day-by-day P&L breakdown (defaults to last 30 days)
 */
const getDailyPnL = catchAsync(async (req, res) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const {
    startDate = thirtyDaysAgo.toISOString().slice(0, 10),
    endDate   = today.toISOString().slice(0, 10),
  } = req.query;

  const data = await pnlService.getDailyPnL({ startDate, endDate });

  return res.status(httpStatus.OK).send({
    status:  'success',
    message: 'Daily P&L retrieved successfully',
    data,
  });
});

module.exports = {
  getPnLSummary,
  getMonthlyPnL,
  getCategoryPnL,
  getTopProfitableProducts,
  getDailyPnL,
};
