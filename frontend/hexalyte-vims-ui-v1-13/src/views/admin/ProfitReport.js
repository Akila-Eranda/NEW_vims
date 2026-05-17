import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ProfitReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('2023-01-01'); // Updated to current year context (2025) would be '2025-01-01'
  const [endDate, setEndDate] = useState('2023-12-31');    // Updated to '2025-06-14' for today at 10:55 AM +0530, June 14, 2025

  // Fetch report data when dates change
  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  // Fetch report from API
  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/v1/salesorders/profit-report', {
        params: { startDate, endDate },
      });
      setReportData(response.data);
    } catch (err) {
      setError('Failed to fetch profit report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Export report to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Product Name', 'Units Sold', 'Total Sales', 'COGS', 'Profit']],
      body: reportData.map(row => [
        row.ProductName,
        row.UnitsSold,
        `$${row.TotalSales.toFixed(2)}`,
        `$${row.COGS.toFixed(2)}`,
        `$${row.Profit.toFixed(2)}`,
      ]),
      styles: { halign: 'right' }, // Right-align numbers for better readability
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
      },
    });
    doc.text('Profit Report', 14, 10);
    doc.save(`profit-report_${startDate}_to_${endDate}.pdf`);
  };

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

          .date-input {
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

          .profit-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          .profit-table th,
          .profit-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }

          .profit-table th {
            background-color: #f2f2f2;
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
        `}
      </style>

      {/* Render loading or error states */}
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          <h2>Profit Report</h2>
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
            <button onClick={fetchReport} className="refresh-btn">
              Refresh
            </button>
          </div>
          <table className="profit-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Units Sold</th>
                <th>Total Sales ($)</th>
                <th>COGS ($)</th>
                <th>Profit ($)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.ProductName}</td>
                    <td>{row.UnitsSold}</td>
                    <td>${row.TotalSales.toFixed(2)}</td>
                    <td>${row.COGS.toFixed(2)}</td>
                    <td>${row.Profit.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No data available for the selected date range.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button onClick={exportToPDF} className="export-btn" disabled={reportData.length === 0}>
            Export to PDF
          </button>
        </>
      )}
    </div>
  );
};

export default ProfitReport;