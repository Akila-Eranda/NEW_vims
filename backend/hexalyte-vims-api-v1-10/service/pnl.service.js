// service/pnl.service.js
// Profit & Loss Report Service

const db = require('../models');
const { Op } = require('sequelize');

/**
 * Get full P&L Summary for a date range
 * Includes: Revenue, COGS, Gross Profit, Returns, Net Profit, Margin %
 */
const getPnLSummary = async ({ startDate, endDate }) => {
  // ── 1. Revenue from PAID + PARTIAL sales orders ──────────────────────────
  const revenueRows = await db.sequelize.query(
    `
    SELECT
      COALESCE(SUM(so.TotalAmount), 0)            AS TotalRevenue,
      COALESCE(SUM(so.Discount), 0)               AS TotalDiscounts,
      COALESCE(SUM(so.TotalAmount - COALESCE(so.Discount,0)), 0) AS NetRevenue,
      COUNT(so.OrderID)                            AS TotalOrders,
      SUM(CASE WHEN so.PaymentStatus = 'paid'    THEN 1 ELSE 0 END) AS PaidOrders,
      SUM(CASE WHEN so.PaymentStatus = 'unpaid'  THEN 1 ELSE 0 END) AS UnpaidOrders,
      SUM(CASE WHEN so.PaymentStatus = 'partial' THEN 1 ELSE 0 END) AS PartialOrders
    FROM salesorders so
    WHERE so.isActive = 1
      AND DATE(so.OrderDate) BETWEEN :startDate AND :endDate
    `,
    {
      replacements: { startDate, endDate },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  // ── 2. COGS (Cost of Goods Sold) = sum(units_sold × buying_price) ─────────
  const cogsRows = await db.sequelize.query(
    `
    SELECT
      COALESCE(SUM(sod.Quantity * p.BuyingPrice), 0) AS TotalCOGS,
      COALESCE(SUM(sod.Quantity * sod.UnitPrice),  0) AS TotalSalesValue
    FROM salesorderdetails sod
    JOIN salesorders so  ON sod.OrderID  = so.OrderID
    JOIN products   p   ON sod.ProductID = p.ProductID
    WHERE so.isActive = 1
      AND DATE(so.OrderDate) BETWEEN :startDate AND :endDate
    `,
    {
      replacements: { startDate, endDate },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  // ── 3. Return Order Loss ──────────────────────────────────────────────────
  const returnRows = await db.sequelize.query(
    `
    SELECT
      COALESCE(SUM(roi.Quantity * p.BuyingPrice), 0) AS ReturnCOGS,
      COALESCE(SUM(roi.Quantity * roi.UnitPrice),  0) AS ReturnRevenueLoss,
      COUNT(DISTINCT ro.ReturnID)                     AS TotalReturns
    FROM returnorders ro
    JOIN returnorderitems roi ON roi.ReturnID   = ro.ReturnID
    JOIN products         p   ON roi.ProductID  = p.ProductID
    WHERE DATE(ro.ReturnDate) BETWEEN :startDate AND :endDate
    `,
    {
      replacements: { startDate, endDate },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  // ── 4. Purchase Cost (how much we spent on stock) ─────────────────────────
  const purchaseRows = await db.sequelize.query(
    `
    SELECT
      COALESCE(SUM(po.TotalAmount), 0)  AS TotalPurchaseCost,
      COUNT(po.OrderID)                 AS TotalPurchaseOrders
    FROM purchaseorders po
    WHERE DATE(po.OrderDate) BETWEEN :startDate AND :endDate
    `,
    {
      replacements: { startDate, endDate },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  const rev       = revenueRows[0]  || {};
  const cogs      = cogsRows[0]     || {};
  const ret       = returnRows[0]   || {};
  const pur       = purchaseRows[0] || {};

  const totalRevenue      = parseFloat(rev.TotalRevenue)      || 0;
  const totalDiscounts    = parseFloat(rev.TotalDiscounts)    || 0;
  const netRevenue        = parseFloat(rev.NetRevenue)        || 0;
  const totalCOGS         = parseFloat(cogs.TotalCOGS)        || 0;
  const returnRevLoss     = parseFloat(ret.ReturnRevenueLoss) || 0;
  const totalPurchaseCost = parseFloat(pur.TotalPurchaseCost) || 0;

  const grossProfit  = netRevenue - totalCOGS;
  const netProfit    = grossProfit - returnRevLoss;
  const grossMargin  = netRevenue > 0 ? ((grossProfit / netRevenue) * 100) : 0;
  const netMargin    = netRevenue > 0 ? ((netProfit   / netRevenue) * 100) : 0;

  return {
    period:             { startDate, endDate },
    revenue: {
      total:            parseFloat(totalRevenue.toFixed(2)),
      discounts:        parseFloat(totalDiscounts.toFixed(2)),
      net:              parseFloat(netRevenue.toFixed(2)),
      totalOrders:      parseInt(rev.TotalOrders)    || 0,
      paidOrders:       parseInt(rev.PaidOrders)     || 0,
      unpaidOrders:     parseInt(rev.UnpaidOrders)   || 0,
      partialOrders:    parseInt(rev.PartialOrders)  || 0,
    },
    cogs:               parseFloat(totalCOGS.toFixed(2)),
    grossProfit:        parseFloat(grossProfit.toFixed(2)),
    grossMarginPct:     parseFloat(grossMargin.toFixed(2)),
    returns: {
      revenueLoss:      parseFloat(returnRevLoss.toFixed(2)),
      costRecovered:    parseFloat((parseFloat(ret.ReturnCOGS) || 0).toFixed(2)),
      count:            parseInt(ret.TotalReturns) || 0,
    },
    purchaseCost:       parseFloat(totalPurchaseCost.toFixed(2)),
    purchaseOrders:     parseInt(pur.TotalPurchaseOrders) || 0,
    netProfit:          parseFloat(netProfit.toFixed(2)),
    netMarginPct:       parseFloat(netMargin.toFixed(2)),
  };
};

/**
 * Monthly P&L breakdown
 * Returns last N months or all months in a given year
 */
const getMonthlyPnL = async ({ year }) => {
  const targetYear = year || new Date().getFullYear();

  const rows = await db.sequelize.query(
    `
    SELECT
      YEAR(so.OrderDate)                               AS Year,
      MONTH(so.OrderDate)                              AS Month,
      COALESCE(SUM(so.TotalAmount), 0)                 AS Revenue,
      COALESCE(SUM(so.Discount), 0)                    AS Discounts,
      COALESCE(SUM(so.TotalAmount - COALESCE(so.Discount,0)), 0) AS NetRevenue,
      COALESCE(SUM(sod.Quantity * p.BuyingPrice), 0)   AS COGS,
      COUNT(DISTINCT so.OrderID)                       AS OrderCount
    FROM salesorders so
    JOIN salesorderdetails sod ON sod.OrderID  = so.OrderID
    JOIN products          p   ON sod.ProductID = p.ProductID
    WHERE so.isActive = 1
      AND YEAR(so.OrderDate) = :year
    GROUP BY YEAR(so.OrderDate), MONTH(so.OrderDate)
    ORDER BY Month ASC
    `,
    {
      replacements: { year: targetYear },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  // Get returns per month
  const returnRows = await db.sequelize.query(
    `
    SELECT
      MONTH(ro.ReturnDate)                              AS Month,
      COALESCE(SUM(roi.Quantity * roi.UnitPrice), 0)    AS ReturnLoss
    FROM returnorders ro
    JOIN returnorderitems roi ON roi.ReturnID = ro.ReturnID
    WHERE YEAR(ro.ReturnDate) = :year
    GROUP BY MONTH(ro.ReturnDate)
    `,
    {
      replacements: { year: targetYear },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  const returnMap = {};
  returnRows.forEach(r => { returnMap[r.Month] = parseFloat(r.ReturnLoss) || 0; });

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Build full 12-month array (fill zeros where no data)
  const fullYear = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const found = rows.find(r => parseInt(r.Month) === month);
    const netRevenue   = parseFloat(found?.NetRevenue || 0);
    const cogs         = parseFloat(found?.COGS       || 0);
    const returnLoss   = returnMap[month] || 0;
    const grossProfit  = netRevenue - cogs;
    const netProfit    = grossProfit - returnLoss;

    return {
      month,
      monthName:    monthNames[i],
      year:         targetYear,
      revenue:      parseFloat(parseFloat(found?.Revenue   || 0).toFixed(2)),
      discounts:    parseFloat(parseFloat(found?.Discounts || 0).toFixed(2)),
      netRevenue:   parseFloat(netRevenue.toFixed(2)),
      cogs:         parseFloat(cogs.toFixed(2)),
      grossProfit:  parseFloat(grossProfit.toFixed(2)),
      returnLoss:   parseFloat(returnLoss.toFixed(2)),
      netProfit:    parseFloat(netProfit.toFixed(2)),
      margin:       netRevenue > 0 ? parseFloat(((netProfit / netRevenue) * 100).toFixed(2)) : 0,
      orderCount:   parseInt(found?.OrderCount || 0),
    };
  });

  return fullYear;
};

/**
 * Category-wise P&L breakdown
 * Shows which product categories are most profitable
 */
const getCategoryPnL = async ({ startDate, endDate }) => {
  const rows = await db.sequelize.query(
    `
    SELECT
      COALESCE(c.Name, 'Uncategorized')             AS CategoryName,
      COALESCE(SUM(sod.Quantity * sod.UnitPrice), 0) AS Revenue,
      COALESCE(SUM(sod.Quantity * p.BuyingPrice),  0) AS COGS,
      COALESCE(SUM(sod.Quantity * (sod.UnitPrice - p.BuyingPrice)), 0) AS GrossProfit,
      COALESCE(SUM(sod.Quantity), 0)                AS UnitsSold,
      COUNT(DISTINCT so.OrderID)                    AS OrderCount
    FROM salesorderdetails sod
    JOIN salesorders so  ON sod.OrderID   = so.OrderID
    JOIN products    p   ON sod.ProductID = p.ProductID
    LEFT JOIN categories c ON p.CategoryID = c.CategoryID
    WHERE so.isActive = 1
      AND DATE(so.OrderDate) BETWEEN :startDate AND :endDate
    GROUP BY c.CategoryID, c.Name
    ORDER BY GrossProfit DESC
    `,
    {
      replacements: { startDate, endDate },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  return rows.map(r => ({
    categoryName: r.CategoryName,
    revenue:      parseFloat(parseFloat(r.Revenue)     .toFixed(2)),
    cogs:         parseFloat(parseFloat(r.COGS)        .toFixed(2)),
    grossProfit:  parseFloat(parseFloat(r.GrossProfit) .toFixed(2)),
    margin:       parseFloat(r.Revenue) > 0
                    ? parseFloat(((parseFloat(r.GrossProfit) / parseFloat(r.Revenue)) * 100).toFixed(2))
                    : 0,
    unitsSold:    parseFloat(r.UnitsSold),
    orderCount:   parseInt(r.OrderCount),
  }));
};

/**
 * Top profitable products in date range
 */
const getTopProfitableProducts = async ({ startDate, endDate, limit = 10 }) => {
  const rows = await db.sequelize.query(
    `
    SELECT
      p.Name                                          AS ProductName,
      COALESCE(c.Name, 'Uncategorized')               AS CategoryName,
      COALESCE(SUM(sod.Quantity), 0)                  AS UnitsSold,
      COALESCE(SUM(sod.Quantity * sod.UnitPrice),  0) AS Revenue,
      COALESCE(SUM(sod.Quantity * p.BuyingPrice),  0) AS COGS,
      COALESCE(SUM(sod.Quantity * (sod.UnitPrice - p.BuyingPrice)), 0) AS Profit
    FROM salesorderdetails sod
    JOIN salesorders so  ON sod.OrderID   = so.OrderID
    JOIN products    p   ON sod.ProductID = p.ProductID
    LEFT JOIN categories c ON p.CategoryID = c.CategoryID
    WHERE so.isActive = 1
      AND DATE(so.OrderDate) BETWEEN :startDate AND :endDate
    GROUP BY p.ProductID, p.Name, c.Name
    ORDER BY Profit DESC
    LIMIT :lim
    `,
    {
      replacements: { startDate, endDate, lim: parseInt(limit) },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  return rows.map(r => ({
    productName:  r.ProductName,
    categoryName: r.CategoryName,
    unitsSold:    parseFloat(r.UnitsSold),
    revenue:      parseFloat(parseFloat(r.Revenue).toFixed(2)),
    cogs:         parseFloat(parseFloat(r.COGS)   .toFixed(2)),
    profit:       parseFloat(parseFloat(r.Profit) .toFixed(2)),
    margin:       parseFloat(r.Revenue) > 0
                    ? parseFloat(((parseFloat(r.Profit) / parseFloat(r.Revenue)) * 100).toFixed(2))
                    : 0,
  }));
};

/**
 * Daily P&L breakdown
 * Returns per-day: revenue, COGS, gross profit, return loss, net profit, order count
 * Defaults: last 30 days
 */
const getDailyPnL = async ({ startDate, endDate }) => {
  // ── 1. Daily revenue + discounts + orders ─────────────────────
  const rows = await db.sequelize.query(
    `
    SELECT
      DATE(so.OrderDate)                                            AS Day,
      COALESCE(SUM(so.TotalAmount), 0)                             AS Revenue,
      COALESCE(SUM(COALESCE(so.Discount, 0)), 0)                   AS Discounts,
      COALESCE(SUM(so.TotalAmount - COALESCE(so.Discount, 0)), 0)  AS NetRevenue,
      COUNT(so.OrderID)                                             AS OrderCount
    FROM salesorders so
    WHERE so.isActive = 1
      AND DATE(so.OrderDate) BETWEEN :startDate AND :endDate
    GROUP BY DATE(so.OrderDate)
    ORDER BY DATE(so.OrderDate) ASC
    `,
    {
      replacements: { startDate, endDate },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  // ── 2. Daily COGS ──────────────────────────────────────────────
  const cogsRows = await db.sequelize.query(
    `
    SELECT
      DATE(so.OrderDate)                                         AS Day,
      COALESCE(SUM(sod.Quantity * p.BuyingPrice), 0)            AS COGS
    FROM salesorderdetails sod
    JOIN salesorders so ON sod.OrderID  = so.OrderID
    JOIN products   p  ON sod.ProductID = p.ProductID
    WHERE so.isActive = 1
      AND DATE(so.OrderDate) BETWEEN :startDate AND :endDate
    GROUP BY DATE(so.OrderDate)
    `,
    {
      replacements: { startDate, endDate },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  // ── 3. Daily return losses ─────────────────────────────────────
  const returnRows = await db.sequelize.query(
    `
    SELECT
      DATE(ro.ReturnDate)                                        AS Day,
      COALESCE(SUM(roi.Quantity * roi.UnitPrice), 0)            AS ReturnLoss
    FROM returnorders ro
    JOIN returnorderitems roi ON roi.ReturnID  = ro.ReturnID
    WHERE DATE(ro.ReturnDate) BETWEEN :startDate AND :endDate
    GROUP BY DATE(ro.ReturnDate)
    `,
    {
      replacements: { startDate, endDate },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  // Build lookup maps
  const cogsMap   = {};
  cogsRows.forEach(r => { cogsMap[r.Day]   = parseFloat(r.COGS)       || 0; });
  const returnMap = {};
  returnRows.forEach(r => { returnMap[r.Day] = parseFloat(r.ReturnLoss) || 0; });

  // Merge and compute profit fields
  return rows.map(r => {
    const day        = r.Day instanceof Date
      ? r.Day.toISOString().slice(0, 10)
      : String(r.Day).slice(0, 10);
    const revenue    = parseFloat(r.Revenue)    || 0;
    const discounts  = parseFloat(r.Discounts)  || 0;
    const netRevenue = parseFloat(r.NetRevenue) || 0;
    const cogs       = cogsMap[r.Day]   || 0;
    const returnLoss = returnMap[r.Day] || 0;
    const grossProfit = netRevenue - cogs;
    const netProfit   = grossProfit - returnLoss;

    return {
      day,
      revenue:      parseFloat(revenue.toFixed(2)),
      discounts:    parseFloat(discounts.toFixed(2)),
      netRevenue:   parseFloat(netRevenue.toFixed(2)),
      cogs:         parseFloat(cogs.toFixed(2)),
      grossProfit:  parseFloat(grossProfit.toFixed(2)),
      returnLoss:   parseFloat(returnLoss.toFixed(2)),
      netProfit:    parseFloat(netProfit.toFixed(2)),
      margin:       netRevenue > 0
        ? parseFloat(((netProfit / netRevenue) * 100).toFixed(2))
        : 0,
      orderCount:   parseInt(r.OrderCount) || 0,
    };
  });
};

module.exports = {
  getPnLSummary,
  getMonthlyPnL,
  getCategoryPnL,
  getTopProfitableProducts,
  getDailyPnL,
};
