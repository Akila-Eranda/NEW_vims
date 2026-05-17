import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const StockReport = () => {
  const [stockData, setStockData] = useState([]);
  const [financialData, setFinancialData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('2025-06-01'); // Start of current month
  const [endDate, setEndDate] = useState('2025-06-14'); // Today at 11:02 AM +0530, June 14, 2025
  const [locationId, setLocationId] = useState(''); // Placeholder for location filter

  // Fetch report data when dates or location change
  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, locationId]);

  // Fetch report from API
  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stockResponse, financialResponse] = await Promise.all([
        axios.get('/v1/salesorders/stock-report', {
          params: { startDate, endDate, locationId },
        }),
        axios.get('/v1/salesorders/financial-summary', {
          params: { startDate, endDate },
        }),
      ]);
      setStockData(stockResponse.data);
      setFinancialData(financialResponse.data);
    } catch (err) {
      setError('Failed to fetch report data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Export report to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Stock Report', 14, 10);
    doc.autoTable({
      head: [['Product Name', 'Warehouse Location', 'Stock Quantity', 'Buying Price ($)', 'Selling Price ($)', 'Supplier', 'Is Out of Stock']],
      body: stockData.map(row => [
        row.ProductName,
        row.WarehouseLocation,
        row.StockQuantity,
        row.BuyingPrice ? `$${row.BuyingPrice.toFixed(2)}` : 'N/A',
        row.SellingPrice ? `$${row.SellingPrice.toFixed(2)}` : 'N/A',
        row.Supplier || 'N/A',
        row.IsOutOfStock,
      ]),
      styles: { halign: 'left' },
      columnStyles: {
        2: { halign: 'right' }, // Stock Quantity
        3: { halign: 'right' }, // Buying Price
        4: { halign: 'right' }, // Selling Price
      },
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 2 && data.cell.raw < 5) { // Highlight if below reorder level (e.g., 5)
          doc.setFillColor(255, 165, 0); // Orange background
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
        }
      },
    });
    doc.text('Financial Summary', 14, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
      head: [['Total Paid Amount ($)', 'Total Unpaid Amount ($)', 'Total Amount ($)']],
      body: [[
        financialData.TotalPaidAmount ? `$${financialData.TotalPaidAmount.toFixed(2)}` : '$0.00',
        financialData.TotalUnpaidAmount ? `$${financialData.TotalUnpaidAmount.toFixed(2)}` : '$0.00',
        financialData.TotalAmount ? `$${financialData.TotalAmount.toFixed(2)}` : '$0.00',
      ]],
      styles: { halign: 'right' },
    });
    doc.save(`stock-report_${startDate}_to_${endDate}.pdf`);
  };

  // Render loading or error states
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profit-report-container">
      <style>
        {`
          .profit-report-container {
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
          }

          .filter-section {
            margin-bottom: 20px;
          }

          .date-input, .location-input {
            margin: 0 10px;
            padding: 5px;
          }

          .refresh-btn, .export-btn {
            padding: 8px 16px;
            margin-left: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
          }

          .refresh-btn:hover, .export-btn:hover {
            background-color: #0056b3;
          }

          .export-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }

          .stock-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          .stock-table th,
          .stock-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }

          .stock-table th {
            background-color: #f2f2f2;
          }

          .stock-table td.low-stock {
            background-color: #fff3cd; /* Light yellow for low stock highlight */
          }

          .loading {
            text-align: center;
            font-size: 18px;
            color: #007bff;
          }

          .error {
            text-align: center;
            font-size: 18px;
            color: #dc3545;
          }

          .financial-summary {
            margin-top: 20px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
          }
        `}
      </style>

      <h2>Stock Report</h2>
      <div className="filter-section">
        <label>Start Date: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="date-input"
        />
        <label>End Date: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="date-input"
        />
        <label>Location ID: </label>
        <input
          type="text"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="location-input"
          placeholder="Enter Location ID"
        />
        <button onClick={fetchReport} className="refresh-btn">
          Refresh
        </button>
      </div>
      <div className="financial-summary">
        <h3>Financial Summary</h3>
        <p>Total Paid Amount: ${financialData.TotalPaidAmount?.toFixed(2) || '0.00'}</p>
        <p>Total Unpaid Amount: ${financialData.TotalUnpaidAmount?.toFixed(2) || '0.00'}</p>
        <p>Total Amount: ${financialData.TotalAmount?.toFixed(2) || '0.00'}</p>
      </div>
      <table className="stock-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Warehouse Location</th>
            <th>Stock Quantity</th>
            <th>Buying Price ($)</th>
            <th>Selling Price ($)</th>
            <th>Supplier</th>
            <th>Is Out of Stock</th>
          </tr>
        </thead>
        <tbody>
          {stockData.length > 0 ? (
            stockData.map((row, index) => (
              <tr key={index} className={row.StockQuantity < 5 ? 'low-stock' : ''}>
                <td>{row.ProductName}</td>
                <td>{row.WarehouseLocation}</td>
                <td>{row.StockQuantity}</td>
                <td>{row.BuyingPrice ? `$${row.BuyingPrice.toFixed(2)}` : 'N/A'}</td>
                <td>{row.SellingPrice ? `$${row.SellingPrice.toFixed(2)}` : 'N/A'}</td>
                <td>{row.Supplier || 'N/A'}</td>
                <td>{row.IsOutOfStock}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No data available for the selected date range and location.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={exportToPDF} className="export-btn" disabled={stockData.length === 0}>
        Export to PDF
      </button>
    </div>
  );
};

export default StockReport;