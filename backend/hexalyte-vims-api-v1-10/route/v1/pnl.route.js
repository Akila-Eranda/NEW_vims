// route/v1/pnl.route.js
// Profit & Loss Report Routes

const express       = require('express');
const router        = express.Router();
const pnlController = require('../../controller/pnl.controller');
const { auth }      = require('../../middleware/auth');

/**
 * @route GET /v1/pnl/summary
 * @desc  Full P&L summary (Revenue, COGS, Gross Profit, Returns, Net Profit)
 * @query startDate=YYYY-MM-DD  endDate=YYYY-MM-DD
 * @access Private
 */
router.route('/summary').get(auth(), pnlController.getPnLSummary);

/**
 * @route GET /v1/pnl/monthly
 * @desc  Monthly P&L breakdown for a full year
 * @query year=2025
 * @access Private
 */
router.route('/monthly').get(auth(), pnlController.getMonthlyPnL);

/**
 * @route GET /v1/pnl/by-category
 * @desc  Category-wise P&L breakdown
 * @query startDate=YYYY-MM-DD  endDate=YYYY-MM-DD
 * @access Private
 */
router.route('/by-category').get(auth(), pnlController.getCategoryPnL);

/**
 * @route GET /v1/pnl/top-products
 * @desc  Top profitable products
 * @query startDate=YYYY-MM-DD  endDate=YYYY-MM-DD  limit=10
 * @access Private
 */
router.route('/top-products').get(auth(), pnlController.getTopProfitableProducts);

/**
 * @route GET /v1/pnl/daily
 * @desc  Day-by-day P&L breakdown
 * @query startDate=YYYY-MM-DD  endDate=YYYY-MM-DD
 * @access Private
 */
router.route('/daily').get(auth(), pnlController.getDailyPnL);

module.exports = router;
