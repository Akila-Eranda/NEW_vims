// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { useHistory } from "react-router-dom";
// import checkToken from "../../api/checkToken";
// import handleUserLogout from "../../api/logout";
// import axios from "axios";
// import { createAxiosInstance } from "api/axiosInstance";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { Package, AlertTriangle, Warehouse, BarChart3 } from 'lucide-react';

// // const BASE_URL = process.env.REACT_APP_BASE_URL;

// function Reports() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeReport, setActiveReport] = useState("profit");
//   const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
//   const [selectedWarehouse, setSelectedWarehouse] = useState("all");
//   const [warehouses, setWarehouses] = useState([]);
//   const [error, setError] = useState(null);
//   const [reportData, setReportData] = useState([]);

//   const [productSalesData, setProductSalesData] = useState([])
//   const [totalDiscounts, setTotalDiscounts] = useState([])

//   const [stockReportData, setStockReportData] = useState([])

//   const { setAuth } = useAuth();
//   const history = useHistory();

//   // Report types with descriptions
//   const reportTypes = [
//     {
//       id: "stock",
//       name: "Stock Report",
//       description:
//         "Current stock levels, low stock alerts, and inventory valuation",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//           />
//         </svg>
//       ),
//     },
//     // {
//     //     id: "movement",
//     //     name: "Inventory Movement",
//     //     description: "Track inventory receipts, transfers, and issues over time",
//     //     icon: (
//     //         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
//     //         </svg>
//     //     )
//     // },
//     // {
//     //     id: "turnover",
//     //     name: "Inventory Turnover",
//     //     description: "Analysis of inventory turnover rates by product and warehouse",
//     //     icon: (
//     //         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//     //         </svg>
//     //     )
//     // },
//     {
//       id: "profit",
//       name: "Sales & Earnings",
//       description:
//         "Space utilization, capacity analysis, and efficiency metrics",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//           />
//         </svg>
//       ),
//     },
//     // {
//     //     id: "forecast",
//     //     name: "Demand Forecast",
//     //     description: "Predictive analysis for inventory needs based on historical data",
//     //     icon: (
//     //         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//     //         </svg>
//     //     )
//     // }
//   ];

//   async function loadWarehouses() {
//     try {
//       // const warehouseLocations = await axios.get(`${BASE_URL}location`, { withCredentials: true });
//       const api = createAxiosInstance();
//       const warehouseLocations = await api.get(`location`);
//       setWarehouses(() => [...warehouseLocations.data.locations]);
//     } catch (error) {
//       if (
//         error.status === 404 &&
//         error.response.data.message === "no location found"
//       ) {
//         console.log("no location found");
//       } else {
//         console.log(error);
//       }

//       if (
//         error.status === 500 &&
//         error.response?.data?.error.includes("Please authenticate")
//       ) {
//         sessionStorage.clear();
//         history.push("/auth/login");
//       }
//     }
//   }

//   // async function fetchStockReportData() {
//   //   setIsLoading(true);
//   //   setError(null);
//   //   try {
//   //     const params = {
//   //       startDate: dateRange.startDate,
//   //       endDate: dateRange.endDate,
//   //       locationId: selectedWarehouse === "all" ? undefined : selectedWarehouse,
//   //     };

//   //     console.log("Feting stock data with params: ", params);

//   //     // const response = await axios.get(
//   //     //     `${BASE_URL}productstorage`,{
//   //     //     params,
//   //     //     withCredentials : true,
//   //     // });

//   //     const api = createAxiosInstance();
//   //     const response = await api.get("productstorage", { params });

//   //     let stockData = response.data;
//   //     console.log("Final Stock Report Data: ", stockData);
//   //     setReportData(stockData);

//   //     if (dateRange.startDate && dateRange.endDate) {
//   //       console.log("Feting stock data with params: ", params);

//   //       // const transactionResponse = await axios.get(`${BASE_URL}transaction`,
//   //       //     {
//   //       //         params,
//   //       //         withCredentials: true,
//   //       //     }
//   //       // );
//   //       // const transactions = transactionResponse.data;
//   //       // console.log("Transaction Data:", transactions);

//   //       //                     stockData = stockData.map((item) => {
//   //       //                         const relevantTransactions = transactions.filter(
//   //       //                             (t) =>
//   //       //                                 t.productId === item.productId &&
//   //       //                             t.locationId === item.locationId &&
//   //       //                             new Date(t.date) >= new Date(dateRange.startDate) &&
//   //       //                             new Date(t.date) <= new Date(dateRange.endDate)
//   //       //                         );
//   //       //                         console.log(`Relevant transactions for product ${item.productId}:`, relevantTransactions);
//   //       //                         const stockAdujstment = relevantTransactions.reduce((acc, t) => {
//   //       //                             if(t.transactionType === "RECEIPT"){
//   //       //                                 return acc + t.quantity;
//   //       //                             }else if(t.transactionType === "ISSUE" || t.transactionType === "TRANSFER_OUT"){
//   //       //                                 return acc - t.quantity;
//   //       //                             }
//   //       //                             return acc;
//   //       //                         },0);
//   //       // console.log(`Stock adjustment for product ${item.productId}:`, stockAdujstment);
//   //       //                         return {
//   //       //                             ...item,
//   //       //                             currentStock: item.Quantity + stockAdujstment,
//   //       //                             belowReorder: item.Quantity + stockAdujstment < (item.reorderLevel || 0),
//   //       //                         };
//   //       //                     });
//   //     }
//   //     console.log("Final Stock Report Data:", stockData);
//   //     setReportData(stockData);
//   //   } catch (error) {
//   //     if (
//   //       error.response?.status === 500 &&
//   //       error.response?.data?.error.includes("Please Authenticate")
//   //     ) {
//   //       handleUserLogout()
//   //         .then(() => setAuth(false))
//   //         .then(() => history.push("/auth/login"));
//   //     } else {
//   //       setError("Failed to generate stock report. Please try again");
//   //     }
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // }
//   async function fetchStockReportData() {
//     setIsLoading(true);
//     setError(null);

//     // try {
//     //   const locationId =
//     //     selectedWarehouse === "all" ? "all" : selectedWarehouse;
//     //   console.log("Fetching stock report for locationId:", locationId); // Debug selected warehouse
//     //   const api = createAxiosInstance();
//     //   const response = await api.get(`productstorage/report/warehouse/${locationId}`, {
//     //     headers: { "Cache-Control": "no-cache" },
//     //   });

//     //   console.log("API Response:", JSON.stringify(response.data, null, 2)); // Pretty-print response
//     //   const stockData = Array.isArray(response.data?.data)
//     //     ? response.data.data
//     //     : [];
//     //   console.log("Final Stock Report Data:", stockData);
//     //   setReportData(stockData);
//     //   if (stockData.length === 0) {
//     //     setError(
//     //       `No stock data found for warehouse ${locationId === "all" ? "all" : locationId
//     //       }.`
//     //     );
//     //   }
//     // } catch (error) {
//     //   console.error("Error fetching stock report:", error);
//     //   if (
//     //     error.response?.status === 500 &&
//     //     error.response?.data?.error?.includes("Please Authenticate")
//     //   ) {
//     //     handleUserLogout()
//     //       .then(() => setAuth(false))
//     //       .then(() => history.push("/auth/login"));
//     //   } else {
//     //     setError(
//     //       error.response?.data?.message || "Failed to generate stock report."
//     //     );
//     //     setReportData([]);
//     //   }
//     // } finally {
//     //   setIsLoading(false);
//     // }

//     try {

//       if (selectedWarehouse === "all") {
//         setError("Select a warehouse")
//         setIsLoading(false)
//         return
//       }

//       const api = createAxiosInstance()
//       const response = await api.get(`productstorage/report/warehouse/${selectedWarehouse}`)

//       if (response.status === 200) {
//         console.log(response.data.data)
//         setStockReportData(response.data.data)
//       }

//       setIsLoading(false)

//     } catch (error) {
//       console.log(error)
//     }

//   }

//   async function fetchProfitReportData() {
//     try {

//       const api = createAxiosInstance()
//       const profitDataRes = await api.get(`salesorder/report/sales?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)

//       if (profitDataRes.status === 200) {
//         setProductSalesData(profitDataRes.data.productSalesData)
//         setTotalDiscounts(profitDataRes.data.totalDiscounts)
//       }

//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleGenerateReport = async () => {
//     setIsLoading(true);

//     // // Simulate API call for report generation
//     // setTimeout(() => {
//     // Here you would typically handle the response and display the report

//     if (activeReport === "profit") {
//       fetchProfitReportData()
//     } else if (activeReport === "stock") {
//       fetchStockReportData()
//     }

//     setIsLoading(false);
//     // }, 1500);

//     if (activeReport === "profit") {
//       if (!dateRange.startDate || !dateRange.endDate) {
//         setError("Please Select a vaild date range");
//         return;
//       }
//     }


//     if (new Date(dateRange.endDate) < new Date(dateRange.startDate)) {
//       setError("End date cannot be before start date");
//       return;
//     }
//     // fetchStockReportData();
//     // fetchProfitReportData()
//   };

//   // const handleExport = (format) => {
//   //   // if (format === "pdf" && reportData.length > 0) {
//   //   //     // handlePrintStockReport(reportData);
//   //   //     const doc = new jsPDF();
//   //   //     doc.text("Stock Report", 14, 20);
//   //   //     doc.text(`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`, 14, 30);
//   //   //     doc.text(`Warehouse: ${selectedWarehouse === "all" ? "All Warehouses" : warehouses.find(w => w.LocationID === selectedWarehouse)?.WarehouseName || "Unknown"}`, 14, 40);
//   //   //     const tableColumn = [
//   //   //         "Product Name",
//   //   //         "Current Stock",
//   //   //         "Buying Price",
//   //   //         "Selling Price",
//   //   //         "Supplier",
//   //   //         "Below Reorder"
//   //   //     ];
//   //   //     const tableRows = reportData.map(item => [
//   //   //         item.Name || "N/A",
//   //   //         item.currentStock || 0,
//   //   //         item.buyingPrice ? `$${item.buyingPrice.toFixed(2)}` : "N/A",
//   //   //         item.sellingPrice ? `$${item.sellingPrice.toFixed(2)}` : "N/A",
//   //   //         item.supplier || "N/A",
//   //   //         item.belowReorder ? "Yes" : "No"
//   //   //     ]);
//   //   //     doc.autoTable({
//   //   //         head: [tableColumn],
//   //   //         body: tableRows,
//   //   //         startY: 50,
//   //   //         theme: "grid",
//   //   //         headStyles: { fillColor: [66, 139, 202] },
//   //   //         columnStyles: {
//   //   //             0: { cellWidth: 40 },
//   //   //             1: { cellWidth: 30 },
//   //   //             2: { cellWidth: 30 },
//   //   //             3: { cellWidth: 30 },
//   //   //             4: { cellWidth: 40 },
//   //   //             5: { cellWidth: 30 },
//   //   //         },
//   //   //     });
//   //   //     doc.save(`Stock_Report_${new Date().toISOString().split('T')[0]}.pdf`);
//   //   // }
//   // };

//   const handleExport = async (format) => {

//     const generatePDFReport = async (data, totalProfit, totalDiscount, netProfit, fileName) => {
//       const doc = new jsPDF();
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const margin = 20;

//       // Header Section
//       doc.setFontSize(20);
//       doc.setFont(undefined, 'bold');
//       doc.text("Sales Report", margin, 25);

//       doc.setFontSize(12);
//       doc.setFont(undefined, 'normal');
//       doc.setTextColor(100, 100, 100);
//       doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })}`, margin, 35);

//       // Reset text color
//       doc.setTextColor(0, 0, 0);

//       // Table Configuration
//       const tableConfig = {
//         startY: 50,
//         margin: margin,
//         columnWidths: [45, 25, 35, 30, 35],
//         rowHeight: 8,
//         headerHeight: 12
//       };

//       let currentY = tableConfig.startY;

//       // Table Header
//       doc.setFont(undefined, 'bold');
//       doc.setFillColor(52, 58, 64); // Dark gray
//       doc.rect(tableConfig.margin, currentY - 2, pageWidth - (2 * tableConfig.margin), tableConfig.headerHeight, 'F');
//       doc.setTextColor(255, 255, 255);

//       const headers = ["Product Name", "Units", "Sales (LKR)", "COGS (LKR)", "Profit (LKR)"];
//       let xPos = tableConfig.margin + 2;

//       headers.forEach((header, index) => {
//         doc.text(header, xPos, currentY + 6);
//         xPos += tableConfig.columnWidths[index];
//       });

//       currentY += tableConfig.headerHeight + 2;
//       doc.setFont(undefined, 'normal');
//       doc.setTextColor(0, 0, 0);

//       // Table Rows
//       data.forEach((item, index) => {
//         // Alternate row colors
//         if (index % 2 === 0) {
//           doc.setFillColor(248, 249, 250);
//           doc.rect(tableConfig.margin, currentY - 2, pageWidth - (2 * tableConfig.margin), tableConfig.rowHeight, 'F');
//         }

//         xPos = tableConfig.margin + 2;
//         const rowData = [
//           truncateText(item.ProductName || "N/A", 20),
//           (item.UnitsSold || 0).toString(),
//           formatCurrency(item.TotalSales || 0),
//           formatCurrency(item.COGS || 0),
//           formatCurrency(item.Profit || 0)
//         ];

//         rowData.forEach((cell, cellIndex) => {
//           doc.text(cell, xPos, currentY + 4);
//           xPos += tableConfig.columnWidths[cellIndex];
//         });

//         currentY += tableConfig.rowHeight;

//         // Page break if needed
//         if (currentY > 260) {
//           doc.addPage();
//           currentY = 30;
//         }
//       });

//       // Summary Section
//       currentY += 20;
//       doc.setDrawColor(200, 200, 200);
//       doc.line(tableConfig.margin, currentY, pageWidth - tableConfig.margin, currentY);

//       currentY += 15;
//       doc.setFontSize(16);
//       doc.setFont(undefined, 'bold');
//       doc.text("Financial Summary", tableConfig.margin, currentY);

//       currentY += 15;
//       doc.setFontSize(12);
//       doc.setFont(undefined, 'normal');

//       const summaryData = [
//         { label: "Total Profit:", value: totalProfit, color: [0, 128, 0] },
//         { label: "Total Discounts:", value: -totalDiscount, color: [255, 0, 0] },
//         { label: "Net Profit:", value: netProfit, color: [0, 0, 0], bold: true }
//       ];

//       summaryData.forEach((item, index) => {
//         doc.setTextColor(...item.color);
//         if (item.bold) doc.setFont(undefined, 'bold');

//         doc.text(item.label, tableConfig.margin, currentY);
//         doc.text(`${formatCurrency(Math.abs(item.value))} LKR`, tableConfig.margin + 100, currentY);

//         if (item.bold) doc.setFont(undefined, 'normal');
//         currentY += 10;
//       });

//       doc.save(`${fileName}.pdf`);
//     };

//     // CSV Report Generation
//     const generateCSVReport = (data, totalProfit, totalDiscount, netProfit, fileName) => {
//       const csvRows = [
//         // Header
//         ["Product Name", "Units Sold", "Total Sales (LKR)", "COGS (LKR)", "Profit (LKR)"],

//         // Data rows
//         ...data.map(item => [
//           `"${(item.ProductName || "N/A").replace(/"/g, '""')}"`, // Escape quotes
//           item.UnitsSold || "0",
//           parseFloat(item.TotalSales || 0).toFixed(2),
//           parseFloat(item.COGS || 0).toFixed(2),
//           parseFloat(item.Profit || 0).toFixed(2)
//         ]),

//         // Separator
//         [],

//         // Summary
//         ["FINANCIAL SUMMARY", "", "", "", ""],
//         ["Total Profit", "", "", "", totalProfit.toFixed(2)],
//         ["Total Discounts", "", "", "", (-totalDiscount).toFixed(2)],
//         ["Net Profit", "", "", "", netProfit.toFixed(2)],
//         [],
//         [`"Report generated on ${new Date().toLocaleString()}"`]
//       ];

//       const csvContent = csvRows.map(row => row.join(",")).join("\n");
//       downloadFile(csvContent, `${fileName}.csv`, "text/csv");
//     };

//     // Excel Report Generation
//     const generateExcelReport = (data, totalProfit, totalDiscount, netProfit, fileName) => {
//       // Main data sheet
//       const mainData = data.map(item => ({
//         "Product Name": item.ProductName || "N/A",
//         "Units Sold": parseInt(item.UnitsSold || 0),
//         "Total Sales (LKR)": parseFloat(item.TotalSales || 0),
//         "COGS (LKR)": parseFloat(item.COGS || 0),
//         "Profit (LKR)": parseFloat(item.Profit || 0),
//       }));

//       // Summary data
//       const summaryData = [
//         { "Metric": "Total Profit", "Value (LKR)": totalProfit },
//         { "Metric": "Total Discounts", "Value (LKR)": -totalDiscount },
//         { "Metric": "Net Profit", "Value (LKR)": netProfit },
//         { "Metric": "Report Date", "Value (LKR)": new Date().toLocaleDateString() }
//       ];

//       // Create workbook
//       const wb = XLSX.utils.book_new();

//       // Sales data sheet
//       const ws1 = XLSX.utils.json_to_sheet(mainData);
//       XLSX.utils.book_append_sheet(wb, ws1, "Sales Data");

//       // Summary sheet
//       const ws2 = XLSX.utils.json_to_sheet(summaryData);
//       XLSX.utils.book_append_sheet(wb, ws2, "Summary");

//       // Style the headers (if supported)
//       const range = XLSX.utils.decode_range(ws1['!ref']);
//       for (let C = range.s.c; C <= range.e.c; ++C) {
//         const address = XLSX.utils.encode_cell({ r: 0, c: C });
//         if (!ws1[address]) continue;
//         ws1[address].s = {
//           font: { bold: true },
//           fill: { fgColor: { rgb: "EEEEEE" } }
//         };
//       }

//       XLSX.writeFile(wb, `${fileName}.xlsx`);
//     };

//     // Utility Functions
//     const formatCurrency = (amount) => {
//       return new Intl.NumberFormat('en-LK', {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0
//       }).format(Math.abs(amount));
//     };

//     const truncateText = (text, maxLength) => {
//       return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
//     };

//     const downloadFile = (content, filename, mimeType) => {
//       const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
//       const link = document.createElement("a");

//       if (link.download !== undefined) {
//         const url = URL.createObjectURL(blob);
//         link.setAttribute("href", url);
//         link.setAttribute("download", filename);
//         link.style.visibility = 'hidden';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//       }

//     }

//     if (!productSalesData || productSalesData.length === 0) {
//       setError("No sales data available for export")
//       return
//     }

//     if (productSalesData.length >= 0) {

//       const currentDate = new Date();
//       const dateString = currentDate.toISOString().split("T")[0];
//       const fileName = `Sales_Report_${dateString}`;

//       try {
//         switch (format.toLowerCase()) {
//           case "pdf":
//             await generatePDFReport(productSalesData, totalProfit, totalDiscount, netProfit, fileName);
//             break;

//           case "csv":
//             generateCSVReport(productSalesData, totalProfit, totalDiscount, netProfit, fileName);
//             break;

//           case "excel":
//             generateExcelReport(productSalesData, totalProfit, totalDiscount, netProfit, fileName);
//             break;

//           default:
//             setError("Unsupported export format. Please choose PDF, CSV, or Excel.");
//         }
//       } catch (error) {
//         console.error("Export failed:", error);
//         setError(`Failed to export ${format.toUpperCase()} report. Please try again.`);
//       }

//     };

//   };


//   useEffect(() => {
//     // if (!checkToken()) {
//     //   handleUserLogout()
//     //     .then(() => setAuth(() => false))
//     //     .then(() => history.push("/auth/login"));
//     //   return;
//     // }

//     loadWarehouses();
//   }, []);

//   useEffect(() => {
//     console.log(stockReportData)
//   }, [stockReportData])

//   const totalProfit = productSalesData?.reduce((sum, item) => sum + parseFloat(item.Profit || 0), 0) || 0;
//   const totalDiscount = parseFloat(totalDiscounts?.[0]?.TotalDiscount || 0);
//   const netProfit = totalProfit - totalDiscount;

//   const totalStock = stockReportData.reduce((sum, item) => sum + item.StockQuantity, 0);
//   const outOfStockCount = stockReportData.filter(item => item.IsOutOfStock === "Yes").length;
//   const inStockCount = stockReportData.filter(item => item.IsOutOfStock === "No").length;
//   const totalProducts = stockReportData.length;

//   return (
//     <div className="w-full min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Generate and manage inventory and warehouse reports
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Report Types Sidebar */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">
//               Report Types
//             </h2>
//             <div className="space-y-2">
//               {reportTypes.map((report) => (
//                 <button
//                   key={report.id}
//                   onClick={() => setActiveReport(report.id)}
//                   className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${activeReport === report.id
//                     ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
//                     : "hover:bg-gray-50 text-gray-700"
//                     }`}
//                 >
//                   <div
//                     className={`flex-shrink-0 ${activeReport === report.id
//                       ? "text-blue-600"
//                       : "text-gray-500"
//                       }`}
//                   >
//                     {report.icon}
//                   </div>
//                   <div className="ml-4 text-left">
//                     <h3 className="font-medium">{report.name}</h3>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {report.description}
//                     </p>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Report Configuration */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 {reportTypes.find((r) => r.id === activeReport)?.name} Report
//               </h2>

//               <div className="space-y-6">
//                 {/* Date Range Selection */}
//                 {activeReport === "profit" && <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date Range
//                   </label>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs text-gray-500 mb-1">
//                         Start Date
//                       </label>
//                       <input
//                         type="date"
//                         className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                         value={dateRange.startDate}
//                         onChange={(e) =>
//                           setDateRange({
//                             ...dateRange,
//                             startDate: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs text-gray-500 mb-1">
//                         End Date
//                       </label>
//                       <input
//                         type="date"
//                         className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                         value={dateRange.endDate}
//                         onChange={(e) =>
//                           setDateRange({
//                             ...dateRange,
//                             endDate: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>}

//                 {/* Warehouse Selection */}
//                 {activeReport === "stock" && <div>
//                   <label
//                     htmlFor="warehouse"
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     Warehouse
//                   </label>
//                   <select
//                     id="warehouse"
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                     value={selectedWarehouse}
//                     onChange={(e) => setSelectedWarehouse(e.target.value)}
//                   >
//                     <option value="all">All Warehouses</option>
//                     {warehouses.map((warehouse) => (
//                       <option
//                         key={warehouse.LocationID}
//                         value={warehouse.LocationID}
//                       >
//                         {warehouse.WarehouseName} ({warehouse.Address})
//                       </option>
//                     ))}
//                   </select>
//                 </div>}

//                 {/* Additional Filters - shown based on report type */}
//                 {activeReport === "inventory" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Inventory Filters
//                     </label>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="flex items-center">
//                         <input
//                           id="low-stock"
//                           name="low-stock"
//                           type="checkbox"
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <label
//                           htmlFor="low-stock"
//                           className="ml-2 block text-sm text-gray-700"
//                         >
//                           Show only low stock items
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           id="zero-stock"
//                           name="zero-stock"
//                           type="checkbox"
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <label
//                           htmlFor="zero-stock"
//                           className="ml-2 block text-sm text-gray-700"
//                         >
//                           Include zero stock items
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {activeReport === "movement" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Movement Types
//                     </label>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="flex items-center">
//                         <input
//                           id="receipts"
//                           name="receipts"
//                           type="checkbox"
//                           defaultChecked
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <label
//                           htmlFor="receipts"
//                           className="ml-2 block text-sm text-gray-700"
//                         >
//                           Receipts
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           id="issues"
//                           name="issues"
//                           type="checkbox"
//                           defaultChecked
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <label
//                           htmlFor="issues"
//                           className="ml-2 block text-sm text-gray-700"
//                         >
//                           Issues
//                         </label>
//                       </div>
//                       <div className="flex items-center">
//                         <input
//                           id="transfers"
//                           name="transfers"
//                           type="checkbox"
//                           defaultChecked
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <label
//                           htmlFor="transfers"
//                           className="ml-2 block text-sm text-gray-700"
//                         >
//                           Transfers
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Generate Report Button */}
//                 <div className="pt-4">
//                   <button
//                     type="button"
//                     className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                     onClick={handleGenerateReport}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <svg
//                           className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         Generating Report...
//                       </>
//                     ) : (
//                       <>
//                         <svg
//                           className="-ml-1 mr-2 h-5 w-5"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                           />
//                         </svg>
//                         Generate Report
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Report Preview Area */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Report Preview
//                 </h2>
//                 <div className="flex space-x-2 no-print">
//                   <button
//                     onClick={() => handleExport("pdf")}
//                     className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     title="Export as PDF"
//                     disabled={isLoading || productSalesData.length === 0}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 mr-1"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
//                       />
//                     </svg>
//                     PDF
//                   </button>
//                   <button
//                     onClick={() => handleExport("csv")}
//                     className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     title="Export as CSV"
//                     disabled={isLoading || productSalesData.length === 0}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 mr-1"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                       />
//                     </svg>
//                     CSV
//                   </button>
//                   <button
//                     onClick={() => window.print()}
//                     className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     title="Print Report"
//                     disabled={isLoading || reportData.length === 0}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 mr-1"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
//                       />
//                     </svg>
//                     Print
//                   </button>
//                 </div>
//               </div>

//               {error && (
//                 <div className="mb-4 text-red-600 text-sm">{error}</div>
//               )}

//               {
//                 isLoading ? (
//                   <div className="text-center py-8">
//                     <svg
//                       className="animate-spin mx-auto h-8 w-8 text-blue-500"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     <p className="mt-2 text-gray-600">Loading report...</p>
//                   </div>
//                 ) : productSalesData.length > 0 ? (
//                   <div className="space-y-6">
//                     {/* Sales Data Table */}
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Product Name
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Units Sold
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Total Sales
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               COGS
//                             </th>
//                             <th
//                               scope="col"
//                               className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               Profit
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {productSalesData.map((item, index) => (
//                             <tr key={index}>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {item.ProductName || "N/A"}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {item.UnitsSold || "0"}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {parseFloat(item.TotalSales || 0).toLocaleString()} LKR
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {parseFloat(item.COGS || 0).toLocaleString()} LKR
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {parseFloat(item.Profit || 0).toLocaleString()} LKR
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Summary Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                         <h3 className="text-sm font-medium text-blue-800 mb-1">Total Profit</h3>
//                         <p className="text-2xl font-bold text-blue-900">
//                           {totalProfit.toLocaleString()} LKR
//                         </p>
//                       </div>

//                       <div className="bg-red-50 p-4 rounded-lg border border-red-200">
//                         <h3 className="text-sm font-medium text-red-800 mb-1">Total Discounts</h3>
//                         <p className="text-2xl font-bold text-red-900">
//                           {totalDiscount.toLocaleString()} LKR
//                         </p>
//                       </div>

//                       <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                         <h3 className="text-sm font-medium text-green-800 mb-1">Net Profit</h3>
//                         <p className="text-2xl font-bold text-green-900">
//                           {netProfit.toLocaleString()} LKR
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ) : stockReportData.length > 0 ? (
//                   <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
//                     <div className="mb-8">
//                       <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Report</h1>
//                       <p className="text-gray-600">Current stock levels and warehouse inventory status</p>
//                     </div>

//                     {/* Key Metrics Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0">
//                             <Package className="h-8 w-8 text-blue-600" />
//                           </div>
//                           <div className="ml-4">
//                             <p className="text-sm font-medium text-gray-500">Total Products</p>
//                             <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0">
//                             <BarChart3 className="h-8 w-8 text-green-600" />
//                           </div>
//                           <div className="ml-4">
//                             <p className="text-sm font-medium text-gray-500">Total Stock Units</p>
//                             <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0">
//                             <AlertTriangle className="h-8 w-8 text-red-600" />
//                           </div>
//                           <div className="ml-4">
//                             <p className="text-sm font-medium text-gray-500">Out of Stock</p>
//                             <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0">
//                             <Warehouse className="h-8 w-8 text-purple-600" />
//                           </div>
//                           <div className="ml-4">
//                             <p className="text-sm font-medium text-gray-500">In Stock</p>
//                             <p className="text-2xl font-bold text-gray-900">{inStockCount}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Inventory Table */}
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                       <div className="px-6 py-4 border-b border-gray-200">
//                         <h3 className="text-lg font-medium text-gray-900">Product Inventory Details</h3>
//                         <p className="text-sm text-gray-500">Current stock levels by product and warehouse location</p>
//                       </div>
//                       <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Product Name
//                               </th>
//                               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Warehouse Location
//                               </th>
//                               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Stock Quantity
//                               </th>
//                               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Availability Status
//                               </th>
//                               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Stock Level
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {stockReportData.map((item, index) => (
//                               <tr key={index} className={item.IsOutOfStock === "Yes" ? "bg-red-50" : ""}>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                   {item.ProductName}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                   {item.WarehouseLocation}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
//                                   {item.StockQuantity}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.IsOutOfStock === "Yes"
//                                     ? "bg-red-100 text-red-800"
//                                     : "bg-green-100 text-green-800"
//                                     }`}>
//                                     {item.IsOutOfStock === "Yes" ? "Out of Stock" : "Available"}
//                                   </span>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.StockQuantity === 0
//                                     ? "bg-red-100 text-red-800"
//                                     : item.StockQuantity < 50
//                                       ? "bg-yellow-100 text-yellow-800"
//                                       : "bg-green-100 text-green-800"
//                                     }`}>
//                                     {item.StockQuantity === 0 ? "Empty" :
//                                       item.StockQuantity < 50 ? "Low Stock" : "Good Stock"}
//                                   </span>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>

//                     {/* Stock Status Summary */}
//                     <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//                       <div className="bg-green-50 p-6 rounded-lg border border-green-200">
//                         <h3 className="text-sm font-medium text-green-800 mb-2">Products Available</h3>
//                         <p className="text-3xl font-bold text-green-900">{inStockCount}</p>
//                         {/* <p className="text-sm text-green-600 mt-1">
//                           {((inStockCount / totalProducts) * 100).toFixed(1)}% of total products
//                         </p> */}
//                       </div>

//                       <div className="bg-red-50 p-6 rounded-lg border border-red-200">
//                         <h3 className="text-sm font-medium text-red-800 mb-2">Products Out of Stock</h3>
//                         <p className="text-3xl font-bold text-red-900">{outOfStockCount}</p>
//                         {/* <p className="text-sm text-red-600 mt-1">
//                           {((outOfStockCount / totalProducts) * 100).toFixed(1)}% of total products
//                         </p> */}
//                       </div>

//                       {/* <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
//                         <h3 className="text-sm font-medium text-blue-800 mb-2">Average Stock per Product</h3>
//                         <p className="text-3xl font-bold text-blue-900">
//                           {(totalStock / totalProducts).toFixed(0)}
//                         </p>
//                         <p className="text-sm text-blue-600 mt-1">units per product</p>
//                       </div> */}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center h-64">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-12 w-12 text-gray-300 mb-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={1}
//                         d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                     <p className="text-lg font-medium text-gray-500">
//                       No report generated yet
//                     </p>
//                     <p className="mt-1 text-sm text-gray-400">
//                       Configure your report parameters and click "Generate Report"
//                     </p>
//                   </div>
//                 )
//               }

//             </div>
//           </div>
//         </div>

//         {/* Report Dashboard Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
//                 <svg
//                   className="h-6 w-6 text-blue-600"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-5">
//                 <p className="text-sm font-medium text-gray-500">
//                   Total Reports
//                 </p>
//                 <h3 className="mt-1 text-xl font-semibold text-gray-900">0</h3>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
//                 <svg
//                   className="h-6 w-6 text-green-600"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-5">
//                 <p className="text-sm font-medium text-gray-500">
//                   Total Products
//                 </p>
//                 <h3 className="mt-1 text-xl font-semibold text-gray-900">--</h3>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
//                 <svg
//                   className="h-6 w-6 text-purple-600"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-5">
//                 <p className="text-sm font-medium text-gray-500">
//                   Total Warehouses
//                 </p>
//                 <h3 className="mt-1 text-xl font-semibold text-gray-900">
//                   {warehouses.length}
//                 </h3>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
//                 <svg
//                   className="h-6 w-6 text-yellow-600"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//               <div className="ml-5">
//                 <p className="text-sm font-medium text-gray-500">
//                   Last Generated
//                 </p>
//                 <h3 className="mt-1 text-xl font-semibold text-gray-900">
//                   Never
//                 </h3>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Reports;


// import React, { useState, useEffect } from "react";
// import { Package, AlertTriangle, Warehouse, BarChart3, Download, FileText, Printer, TrendingUp, DollarSign } from 'lucide-react';
// import { createAxiosInstance } from "api/axiosInstance";

// const jsPDF = {
//   default: class MockJsPDF {
//     constructor() {
//       this.internal = { pageSize: { getWidth: () => 210 } };
//     }
//     setFontSize(size) { return this; }
//     setFont(font, style) { return this; }
//     setTextColor(r, g, b) { return this; }
//     setFillColor(r, g, b) { return this; }
//     text(text, x, y) { return this; }
//     rect(x, y, w, h, style) { return this; }
//     line(x1, y1, x2, y2) { return this; }
//     addPage() { return this; }
//     autoTable(config) { return this; }
//     save(filename) {
//       // In real implementation, this would actually save the PDF
//       alert(`PDF would be saved as: ${filename}`);
//       return this;
//     }
//   }
// };

// // Mock data for demonstration
// const mockWarehouses = [
//   { LocationID: 0, WarehouseName: "No Warehouses Found", Address: "" },
// ];

// const mockSalesData = [
//   {
//     ProductName: "Laptop Computer",
//     UnitsSold: 12,
//     TotalSales: 1200000,
//     COGS: 960000,
//     Profit: 240000
//   },
//   {
//     ProductName: "Wireless Mouse",
//     UnitsSold: 45,
//     TotalSales: 225000,
//     COGS: 135000,
//     Profit: 90000
//   },
//   {
//     ProductName: "Keyboard",
//     UnitsSold: 30,
//     TotalSales: 450000,
//     COGS: 300000,
//     Profit: 150000
//   },
//   {
//     ProductName: "Monitor",
//     UnitsSold: 18,
//     TotalSales: 900000,
//     COGS: 630000,
//     Profit: 270000
//   }
// ];

// const mockDiscountData = [{ TotalDiscount: 50000 }];

// function Reports() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeReport, setActiveReport] = useState("profit");
//   const [dateRange, setDateRange] = useState({
//     startDate: "",
//     endDate: ""
//   });
//   const [selectedWarehouse, setSelectedWarehouse] = useState("all");
//   const [warehouses, setWarehouses] = useState(mockWarehouses);
//   const [error, setError] = useState(null);

//   const [productSalesData, setProductSalesData] = useState([]);
//   const [totalDiscounts, setTotalDiscounts] = useState([]);
//   const [stockReportData, setStockReportData] = useState([]);

//   const reportTypes = [
//     {
//       id: "stock",
//       name: "Stock Report",
//       description: "Current stock levels, low stock alerts, and inventory valuation",
//       icon: <Package className="h-6 w-6" />
//     },
//     {
//       id: "profit",
//       name: "Sales & Earnings",
//       description: "Sales performance, profit analysis, and financial metrics",
//       icon: <TrendingUp className="h-6 w-6" />
//     }
//   ];

//   const fetchWarehouses = async () => {
//     try {

//       const api = createAxiosInstance()
//       const warehouses = await api.get('location')

//       if (warehouses.status === 200) {
//         setWarehouses(warehouses.data.locations)
//       }

//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const fetchStockReportData = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       if (selectedWarehouse === "all") {
//         setError("Please select a specific warehouse");
//         setIsLoading(false);
//         return;
//       }

//       // Simulate API call
//       const api = createAxiosInstance()
//       const stockData = await api.get(`productstorage/report/warehouse/${selectedWarehouse}`)

//       if (stockData.status === 200) {
//         setStockReportData(() => stockData.data.data)
//       }

//     } catch (error) {
//       console.log(error);
//       setError("Failed to fetch stock report data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchProfitReportData = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Simulate API call
//       const api = createAxiosInstance()
//       const profitData = await api.get(`salesorder/report/sales?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)

//       if (profitData.status === 200) {
//         setProductSalesData(profitData.data.productSalesData)
//         setTotalDiscounts(profitData.data.totalDiscounts)
//       }

//     } catch (error) {
//       console.log(error);
//       setError("Failed to fetch sales report data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGenerateReport = async () => {
//     setError(null);

//     if (activeReport === "profit") {
//       if (!dateRange.startDate || !dateRange.endDate) {
//         setError("Please select a valid date range");
//         return;
//       }

//       if (new Date(dateRange.endDate) < new Date(dateRange.startDate)) {
//         setError("End date cannot be before start date");
//         return;
//       }

//       await fetchProfitReportData();
//     } else if (activeReport === "stock") {
//       await fetchStockReportData();
//     }
//   };

//   const handleExport = async (format) => {
//     if (activeReport === "profit" && productSalesData.length === 0) {
//       setError("No sales data available for export");
//       return;
//     }

//     if (activeReport === "stock" && stockReportData.length === 0) {
//       setError("No stock data available for export");
//       return;
//     }

//     const currentDate = new Date();
//     const dateString = currentDate.toISOString().split("T")[0];
//     const fileName = `${activeReport === "profit" ? "Sales" : "Stock"}_Report_${dateString}`;

//     try {
//       if (format === "pdf") {
//         generatePDFReport(fileName);
//       } else if (format === "csv") {
//         generateCSVReport(fileName);
//       }
//     } catch (error) {
//       console.error("Export failed:", error);
//       setError(`Failed to export ${format.toUpperCase()} report. Please try again.`);
//     }
//   };

//   const generatePDFReport = (fileName) => {
//     // Initialize jsPDF
//     const doc = new jsPDF.default();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 20;
//     let currentY = 25;

//     if (activeReport === "profit") {
//       // Header
//       doc.setFontSize(20);
//       doc.setFont(undefined, 'bold');
//       doc.text("Sales & Earnings Report", margin, currentY);

//       currentY += 10;
//       doc.setFontSize(12);
//       doc.setFont(undefined, 'normal');
//       doc.setTextColor(100, 100, 100);
//       doc.text(`Period: ${dateRange.startDate} to ${dateRange.endDate}`, margin, currentY);

//       currentY += 8;
//       doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })}`, margin, currentY);

//       currentY += 20;
//       doc.setTextColor(0, 0, 0);

//       // Summary Section
//       doc.setFontSize(14);
//       doc.setFont(undefined, 'bold');
//       doc.text("Financial Summary", margin, currentY);

//       currentY += 15;
//       doc.setFontSize(12);
//       doc.setFont(undefined, 'normal');

//       // Summary boxes
//       const summaryData = [
//         { label: "Total Profit:", value: `${totalProfit.toLocaleString()} LKR`, color: [0, 128, 0] },
//         { label: "Total Discounts:", value: `${totalDiscount.toLocaleString()} LKR`, color: [255, 0, 0] },
//         { label: "Net Profit:", value: `${netProfit.toLocaleString()} LKR`, color: [0, 100, 0] }
//       ];

//       summaryData.forEach((item, index) => {
//         doc.setTextColor(...item.color);
//         doc.text(item.label, margin, currentY);
//         doc.text(item.value, margin + 80, currentY);
//         currentY += 10;
//       });

//       currentY += 10;
//       doc.setTextColor(0, 0, 0);

//       // Sales Data Table
//       const tableColumns = ["Product Name", "Units", "Sales (LKR)", "COGS (LKR)", "Profit (LKR)"];
//       const tableRows = productSalesData.map(item => [
//         (item.ProductName || "N/A").substring(0, 25), // Truncate long names
//         (item.UnitsSold || 0).toString(),
//         parseFloat(item.TotalSales || 0).toLocaleString(),
//         parseFloat(item.COGS || 0).toLocaleString(),
//         parseFloat(item.Profit || 0).toLocaleString()
//       ]);

//       doc.autoTable({
//         head: [tableColumns],
//         body: tableRows,
//         startY: currentY,
//         theme: "grid",
//         headStyles: {
//           fillColor: [66, 139, 202],
//           textColor: [255, 255, 255],
//           fontStyle: 'bold'
//         },
//         alternateRowStyles: { fillColor: [248, 249, 250] },
//         columnStyles: {
//           0: { cellWidth: 50 },
//           1: { cellWidth: 25, halign: 'center' },
//           2: { cellWidth: 35, halign: 'right' },
//           3: { cellWidth: 35, halign: 'right' },
//           4: { cellWidth: 35, halign: 'right', textColor: [0, 128, 0] }
//         },
//         margin: { left: margin, right: margin }
//       });

//     } else if (activeReport === "stock") {
//       // Header
//       doc.setFontSize(20);
//       doc.setFont(undefined, 'bold');
//       doc.text("Inventory Stock Report", margin, currentY);

//       currentY += 10;
//       doc.setFontSize(12);
//       doc.setFont(undefined, 'normal');
//       doc.setTextColor(100, 100, 100);
//       doc.text(`Warehouse: ${warehouses.find(w => w.LocationID == selectedWarehouse)?.WarehouseName || "All Warehouses"}`, margin, currentY);

//       currentY += 8;
//       doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })}`, margin, currentY);

//       currentY += 20;
//       doc.setTextColor(0, 0, 0);

//       // Summary Section
//       doc.setFontSize(14);
//       doc.setFont(undefined, 'bold');
//       doc.text("Inventory Summary", margin, currentY);

//       currentY += 15;
//       doc.setFontSize(12);
//       doc.setFont(undefined, 'normal');

//       // Summary data
//       const stockSummary = [
//         { label: "Total Products:", value: totalProducts.toString() },
//         { label: "Total Stock Units:", value: totalStock.toString() },
//         { label: "Products In Stock:", value: inStockCount.toString() },
//         { label: "Products Out of Stock:", value: outOfStockCount.toString() }
//       ];

//       stockSummary.forEach((item, index) => {
//         const col1X = margin;
//         const col2X = margin + 100;
//         const row = Math.floor(index / 2);
//         const col = index % 2;

//         const x = col === 0 ? col1X : col2X;
//         const y = currentY + (row * 10);

//         doc.text(item.label, x, y);
//         doc.text(item.value, x + 70, y);
//       });

//       currentY += 30;

//       // Stock Data Table
//       const stockColumns = ["Product", "Location", "Qty", "Status", "Level"];
//       const stockRows = stockReportData.map(item => [
//         item.ProductName.substring(0, 30),
//         item.WarehouseLocation.substring(0, 25),
//         item.StockQuantity.toString(),
//         item.IsOutOfStock === "Yes" ? "Out" : "Available",
//         item.StockQuantity === 0 ? "Empty" :
//           item.StockQuantity < 10 ? "Low" : "Good"
//       ]);

//       doc.autoTable({
//         head: [stockColumns],
//         body: stockRows,
//         startY: currentY,
//         theme: "grid",
//         headStyles: {
//           fillColor: [66, 139, 202],
//           textColor: [255, 255, 255],
//           fontStyle: 'bold'
//         },
//         alternateRowStyles: { fillColor: [248, 249, 250] },
//         columnStyles: {
//           0: { cellWidth: 60 },
//           1: { cellWidth: 50 },
//           2: { cellWidth: 20, halign: 'center' },
//           3: { cellWidth: 30, halign: 'center' },
//           4: { cellWidth: 25, halign: 'center' }
//         },
//         margin: { left: margin, right: margin },
//         didParseCell: function (data) {
//           // Color coding for status and level columns
//           if (data.column.index === 3 && data.cell.text[0] === "Out") {
//             data.cell.styles.textColor = [220, 38, 38]; // Red for out of stock
//           }
//           if (data.column.index === 4) {
//             if (data.cell.text[0] === "Empty") {
//               data.cell.styles.textColor = [220, 38, 38]; // Red
//             } else if (data.cell.text[0] === "Low") {
//               data.cell.styles.textColor = [245, 158, 11]; // Orange
//             } else if (data.cell.text[0] === "Good") {
//               data.cell.styles.textColor = [34, 197, 94]; // Green
//             }
//           }
//         }
//       });
//     }

//     // Save the PDF
//     doc.save(`${fileName}.pdf`);
//   };

//   const generateCSVReport = (fileName) => {
//     let csvContent = "";

//     if (activeReport === "profit") {
//       // CSV Headers
//       csvContent = "Product Name,Units Sold,Total Sales (LKR),COGS (LKR),Profit (LKR)\n";

//       // CSV Data
//       productSalesData.forEach(item => {
//         const productName = (item.ProductName || "N/A").replace(/"/g, '""');
//         csvContent += `"${productName}",${item.UnitsSold || 0},${parseFloat(item.TotalSales || 0).toFixed(2)},${parseFloat(item.COGS || 0).toFixed(2)},${parseFloat(item.Profit || 0).toFixed(2)}\n`;
//       });

//       // Summary Section
//       csvContent += "\n";
//       csvContent += "FINANCIAL SUMMARY\n";
//       csvContent += "Metric,Amount (LKR)\n";
//       csvContent += `Total Profit,${totalProfit.toFixed(2)}\n`;
//       csvContent += `Total Discounts,${totalDiscount.toFixed(2)}\n`;
//       csvContent += `Net Profit,${netProfit.toFixed(2)}\n`;
//       csvContent += "\n";
//       csvContent += "REPORT INFORMATION\n";
//       csvContent += "Field,Value\n";
//       csvContent += `Report Date,"${new Date().toLocaleDateString()}"\n`;
//       csvContent += `Date Range,"${dateRange.startDate} to ${dateRange.endDate}"\n`;
//       csvContent += `Report Type,Sales & Earnings\n`;

//     } else if (activeReport === "stock") {
//       // CSV Headers
//       csvContent = "Product Name,Warehouse Location,Stock Quantity,Availability Status,Stock Level\n";

//       // CSV Data
//       stockReportData.forEach(item => {
//         const productName = item.ProductName.replace(/"/g, '""');
//         const warehouseLocation = item.WarehouseLocation.replace(/"/g, '""');
//         const stockLevel = item.StockQuantity === 0 ? "Empty" :
//           item.StockQuantity < 10 ? "Low Stock" : "Good Stock";
//         const availabilityStatus = item.IsOutOfStock === "Yes" ? "Out of Stock" : "Available";

//         csvContent += `"${productName}","${warehouseLocation}",${item.StockQuantity},"${availabilityStatus}","${stockLevel}"\n`;
//       });

//       // Summary Section
//       csvContent += "\n";
//       csvContent += "INVENTORY SUMMARY\n";
//       csvContent += "Metric,Count\n";
//       csvContent += `Total Products,${totalProducts}\n`;
//       csvContent += `Total Stock Units,${totalStock}\n`;
//       csvContent += `Products In Stock,${inStockCount}\n`;
//       csvContent += `Products Out of Stock,${outOfStockCount}\n`;
//       csvContent += `Low Stock Items,${stockReportData.filter(item => item.StockQuantity < 10 && item.StockQuantity > 0).length}\n`;
//       csvContent += "\n";
//       csvContent += "REPORT INFORMATION\n";
//       csvContent += "Field,Value\n";
//       csvContent += `Report Date,"${new Date().toLocaleDateString()}"\n`;
//       csvContent += `Warehouse,"${warehouses.find(w => w.LocationID == selectedWarehouse)?.WarehouseName || "All Warehouses"}"\n`;
//       csvContent += `Report Type,Inventory Stock\n`;
//     }

//     // Create and download CSV file
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");

//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", `${fileName}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } else {
//       // Fallback for browsers that don't support download attribute
//       // window.open(url);
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   // Calculate totals for profit report
//   const totalProfit = productSalesData.reduce((sum, item) => sum + parseFloat(item.Profit || 0), 0);
//   const totalDiscount = parseFloat(totalDiscounts[0]?.TotalDiscount || 0);
//   const netProfit = totalProfit - totalDiscount;

//   // Calculate totals for stock report
//   const totalStock = stockReportData.reduce((sum, item) => sum + item.StockQuantity, 0);
//   const outOfStockCount = stockReportData.filter(item => item.IsOutOfStock === "Yes").length;
//   const inStockCount = stockReportData.filter(item => item.IsOutOfStock === "No").length;
//   const totalProducts = stockReportData.length;

//   useEffect(() => {

//     fetchWarehouses()

//   }, [])

//   return (
//     <div className="w-full min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Generate and manage inventory and sales reports
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Report Types Sidebar */}
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">
//               Report Types
//             </h2>
//             <div className="space-y-2">
//               {reportTypes.map((report) => (
//                 <button
//                   key={report.id}
//                   onClick={() => {
//                     setActiveReport(report.id);
//                     setError(null);
//                     setProductSalesData([]);
//                     setStockReportData([]);
//                   }}
//                   className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${activeReport === report.id
//                     ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
//                     : "hover:bg-gray-50 text-gray-700"
//                     }`}
//                 >
//                   <div className={`flex-shrink-0 ${activeReport === report.id ? "text-blue-600" : "text-gray-500"
//                     }`}>
//                     {report.icon}
//                   </div>
//                   <div className="ml-4 text-left">
//                     <h3 className="font-medium">{report.name}</h3>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {report.description}
//                     </p>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Report Configuration */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 {reportTypes.find((r) => r.id === activeReport)?.name} Configuration
//               </h2>

//               <div className="space-y-6">
//                 {/* Date Range Selection for Profit Report */}
//                 {activeReport === "profit" && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Date Range
//                     </label>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-xs text-gray-500 mb-1">
//                           Start Date
//                         </label>
//                         <input
//                           type="date"
//                           className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                           value={dateRange.startDate}
//                           onChange={(e) =>
//                             setDateRange({
//                               ...dateRange,
//                               startDate: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-500 mb-1">
//                           End Date
//                         </label>
//                         <input
//                           type="date"
//                           className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                           value={dateRange.endDate}
//                           onChange={(e) =>
//                             setDateRange({
//                               ...dateRange,
//                               endDate: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Warehouse Selection for Stock Report */}
//                 {activeReport === "stock" && (
//                   <div>
//                     <label
//                       htmlFor="warehouse"
//                       className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                       Warehouse
//                     </label>
//                     <select
//                       id="warehouse"
//                       className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                       value={selectedWarehouse}
//                       onChange={(e) => setSelectedWarehouse(e.target.value)}
//                     >
//                       <option value="all">Select a warehouse</option>
//                       {warehouses.map((warehouse) => (
//                         <option
//                           key={warehouse.LocationID}
//                           value={warehouse.LocationID}
//                         >
//                           {warehouse.WarehouseName} ({warehouse.Address})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {/* Generate Report Button */}
//                 <div className="pt-4">
//                   <button
//                     type="button"
//                     className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                     onClick={handleGenerateReport}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <svg
//                           className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         Generating Report...
//                       </>
//                     ) : (
//                       <>
//                         <BarChart3 className="-ml-1 mr-2 h-5 w-5" />
//                         Generate Report
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Report Preview Area */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Report Preview
//                 </h2>
//                 {((activeReport === "profit" && productSalesData.length > 0) ||
//                   (activeReport === "stock" && stockReportData.length > 0)) && (
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleExport("pdf")}
//                         className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         title="Export as PDF"
//                       >
//                         <FileText className="h-4 w-4 mr-1" />
//                         PDF
//                       </button>
//                       <button
//                         onClick={() => handleExport("csv")}
//                         className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         title="Export as CSV"
//                       >
//                         <Download className="h-4 w-4 mr-1" />
//                         CSV
//                       </button>
//                       <button
//                         onClick={handlePrint}
//                         className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         title="Print Report"
//                       >
//                         <Printer className="h-4 w-4 mr-1" />
//                         Print
//                       </button>
//                     </div>
//                   )}
//               </div>

//               {error && (
//                 <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
//                   <div className="flex">
//                     <AlertTriangle className="h-5 w-5 text-red-400" />
//                     <div className="ml-3">
//                       <p className="text-sm text-red-800">{error}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {isLoading ? (
//                 <div className="text-center py-8">
//                   <svg
//                     className="animate-spin mx-auto h-8 w-8 text-blue-500"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   <p className="mt-2 text-gray-600">Loading report...</p>
//                 </div>
//               ) : activeReport === "profit" && productSalesData.length > 0 ? (
//                 <div className="space-y-6">
//                   {/* Sales Data Table */}
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Product Name
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Units Sold
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Total Sales
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             COGS
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Profit
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {productSalesData.map((item, index) => (
//                           <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                               {item.ProductName || "N/A"}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                               {item.UnitsSold || "0"}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                               {parseFloat(item.TotalSales || 0).toLocaleString()} LKR
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                               {parseFloat(item.COGS || 0).toLocaleString()} LKR
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
//                               {parseFloat(item.Profit || 0).toLocaleString()} LKR
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Summary Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                       <div className="flex items-center">
//                         <TrendingUp className="h-8 w-8 text-blue-600" />
//                         <div className="ml-3">
//                           <h3 className="text-sm font-medium text-blue-800 mb-1">Total Profit</h3>
//                           <p className="text-2xl font-bold text-blue-900">
//                             {totalProfit.toLocaleString()} LKR
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-red-50 p-4 rounded-lg border border-red-200">
//                       <div className="flex items-center">
//                         <DollarSign className="h-8 w-8 text-red-600" />
//                         <div className="ml-3">
//                           <h3 className="text-sm font-medium text-red-800 mb-1">Total Discounts</h3>
//                           <p className="text-2xl font-bold text-red-900">
//                             {totalDiscount.toLocaleString()} LKR
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                       <div className="flex items-center">
//                         <BarChart3 className="h-8 w-8 text-green-600" />
//                         <div className="ml-3">
//                           <h3 className="text-sm font-medium text-green-800 mb-1">Net Profit</h3>
//                           <p className="text-2xl font-bold text-green-900">
//                             {netProfit.toLocaleString()} LKR
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : activeReport === "stock" && stockReportData.length > 0 ? (
//                 <div className="space-y-6">
//                   {/* Key Metrics Cards */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                       <div className="flex items-center">
//                         <Package className="h-8 w-8 text-blue-600" />
//                         <div className="ml-3">
//                           <p className="text-sm font-medium text-gray-500">Total Products</p>
//                           <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                       <div className="flex items-center">
//                         <BarChart3 className="h-8 w-8 text-green-600" />
//                         <div className="ml-3">
//                           <p className="text-sm font-medium text-gray-500">Total Stock Units</p>
//                           <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                       <div className="flex items-center">
//                         <AlertTriangle className="h-8 w-8 text-red-600" />
//                         <div className="ml-3">
//                           <p className="text-sm font-medium text-gray-500">Out of Stock</p>
//                           <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                       <div className="flex items-center">
//                         <Warehouse className="h-8 w-8 text-purple-600" />
//                         <div className="ml-3">
//                           <p className="text-sm font-medium text-gray-500">In Stock</p>
//                           <p className="text-2xl font-bold text-gray-900">{inStockCount}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Inventory Table */}
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Product Name
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Warehouse Location
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Stock Quantity
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Availability Status
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Stock Level
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {stockReportData.map((item, index) => (
//                           <tr key={index} className={item.IsOutOfStock === "Yes" ? "bg-red-50" : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                               {item.ProductName}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                               {item.WarehouseLocation}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
//                               {item.StockQuantity}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.IsOutOfStock === "Yes"
//                                 ? "bg-red-100 text-red-800"
//                                 : "bg-green-100 text-green-800"
//                                 }`}>
//                                 {item.IsOutOfStock === "Yes" ? "Out of Stock" : "Available"}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.StockQuantity === 0
//                                 ? "bg-red-100 text-red-800"
//                                 : item.StockQuantity < 10
//                                   ? "bg-yellow-100 text-yellow-800"
//                                   : "bg-green-100 text-green-800"
//                                 }`}>
//                                 {item.StockQuantity === 0 ? "Empty" :
//                                   item.StockQuantity < 10 ? "Low Stock" : "Good Stock"}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Stock Status Summary */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="bg-green-50 p-6 rounded-lg border border-green-200">
//                       <h3 className="text-sm font-medium text-green-800 mb-2">Products Available</h3>
//                       <p className="text-3xl font-bold text-green-900">{inStockCount}</p>
//                       <p className="text-sm text-green-600 mt-1">
//                         {totalProducts > 0 ? ((inStockCount / totalProducts) * 100).toFixed(1) : 0}% of total products
//                       </p>
//                     </div>

//                     <div className="bg-red-50 p-6 rounded-lg border border-red-200">
//                       <h3 className="text-sm font-medium text-red-800 mb-2">Products Out of Stock</h3>
//                       <p className="text-3xl font-bold text-red-900">{outOfStockCount}</p>
//                       <p className="text-sm text-red-600 mt-1">
//                         {totalProducts > 0 ? ((outOfStockCount / totalProducts) * 100).toFixed(1) : 0}% of total products
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center h-64">
//                   <BarChart3 className="h-12 w-12 text-gray-300 mb-4" />
//                   <p className="text-lg font-medium text-gray-500">
//                     No report generated yet
//                   </p>
//                   <p className="mt-1 text-sm text-gray-400">
//                     Configure your report parameters and click "Generate Report"
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Report Dashboard Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
//                 <BarChart3 className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="ml-5">
//                 <p className="text-sm font-medium text-gray-500">
//                   Reports Generated
//                 </p>
//                 <h3 className="mt-1 text-xl font-semibold text-gray-900">
//                   {(productSalesData.length > 0 || stockReportData.length > 0) ? 1 : 0}
//                 </h3>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
//                 <Package className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-5">
//                 <p className="text-sm font-medium text-gray-500">
//                   Total Products
//                 </p>
//                 <h3 className="mt-1 text-xl font-semibold text-gray-900">
//                   {stockReportData.length > 0 ? totalProducts : "--"}
//                 </h3>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
//                 <Warehouse className="h-6 w-6 text-purple-600" />
//               </div>
//               <div className="ml-5">
//                 <p className="text-sm font-medium text-gray-500">
//                   Total Warehouses
//                 </p>
//                 <h3 className="mt-1 text-xl font-semibold text-gray-900">
//                   {warehouses.length}
//                 </h3>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
//                 <AlertTriangle className="h-6 w-6 text-yellow-600" />
//               </div>
//               <div className="ml-5">
//                 <p className="text-sm font-medium text-gray-500">
//                   Low Stock Items
//                 </p>
//                 <h3 className="mt-1 text-xl font-semibold text-gray-900">
//                   {stockReportData.length > 0 ? stockReportData.filter(item => item.StockQuantity < 10 && item.StockQuantity > 0).length : "--"}
//                 </h3>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Reports;

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable"
import { Package, AlertTriangle, Warehouse, BarChart3, Download, FileText, Printer, TrendingUp, DollarSign } from 'lucide-react';
import { createAxiosInstance } from "api/axiosInstance";

// Mock data for demonstration
const mockWarehouses = [
  { LocationID: 1, WarehouseName: "Main Warehouse", Address: "123 Main St" },
  { LocationID: 2, WarehouseName: "North Branch", Address: "456 North Ave" },
  { LocationID: 3, WarehouseName: "South Hub", Address: "789 South Rd" }
];

const mockStockData = [
  {
    ProductName: "Laptop Computer",
    WarehouseLocation: "Main Warehouse",
    StockQuantity: 25,
    IsOutOfStock: "No"
  },
  {
    ProductName: "Wireless Mouse",
    WarehouseLocation: "Main Warehouse",
    StockQuantity: 0,
    IsOutOfStock: "Yes"
  },
  {
    ProductName: "Keyboard",
    WarehouseLocation: "Main Warehouse",
    StockQuantity: 15,
    IsOutOfStock: "No"
  },
  {
    ProductName: "Monitor",
    WarehouseLocation: "Main Warehouse",
    StockQuantity: 8,
    IsOutOfStock: "No"
  }
];

const mockSalesData = [
  {
    ProductName: "Laptop Computer",
    UnitsSold: 12,
    TotalSales: 1200000,
    COGS: 960000,
    Profit: 240000
  },
  {
    ProductName: "Wireless Mouse",
    UnitsSold: 45,
    TotalSales: 225000,
    COGS: 135000,
    Profit: 90000
  },
  {
    ProductName: "Keyboard",
    UnitsSold: 30,
    TotalSales: 450000,
    COGS: 300000,
    Profit: 150000
  },
  {
    ProductName: "Monitor",
    UnitsSold: 18,
    TotalSales: 900000,
    COGS: 630000,
    Profit: 270000
  }
];

const mockDiscountData = [{ TotalDiscount: 50000 }];

function Reports() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeReport, setActiveReport] = useState("profit");
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [warehouses, setWarehouses] = useState(mockWarehouses);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);


  const [productSalesData, setProductSalesData] = useState([]);
  const [totalDiscounts, setTotalDiscounts] = useState([]);
  const [stockReportData, setStockReportData] = useState([]);

  async function loadProductData() {
    try {
      const api = createAxiosInstance()
      const productData = await api.get('product')
      setProducts(() => productData.data.allProducts.filter(product => product.isActive !== false));

    } catch (error) {
      if (error.status === 404 && error.response.data.message === "No Products Found") {
        console.log("No Products Found");
      } else {
        console.log(error)
      }

    }

  }

  const reportTypes = [
    {
      id: "stock",
      name: "Stock Report",
      description: "Current stock levels, low stock alerts, and inventory valuation",
      icon: <Package className="h-6 w-6" />
    },
    {
      id: "profit",
      name: "Sales & Earnings",
      description: "Sales performance, profit analysis, and financial metrics",
      icon: <TrendingUp className="h-6 w-6" />
    }
  ];

  const fetchWarehouses = async () => {
    try {

      const api = createAxiosInstance()
      const warehouses = await api.get('location')

      if (warehouses.status === 200) {
        setWarehouses(warehouses.data.locations)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const fetchStockReportData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (selectedWarehouse === "all") {
        setError("Please select a specific warehouse");
        setIsLoading(false);
        return;
      }

      // Simulate API call
      const api = createAxiosInstance()
      const stockData = await api.get(`productstorage/report/warehouse/${selectedWarehouse}`)

      if (stockData.status === 200) {
        setStockReportData(() => stockData.data.data)
      }

    } catch (error) {
      console.log(error);
      setError("Failed to fetch stock report data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfitReportData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      const api = createAxiosInstance()
      const profitData = await api.get(`salesorder/report/sales?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)

      if (profitData.status === 200) {
        setProductSalesData(profitData.data.productSalesData)
        setTotalDiscounts(profitData.data.totalDiscounts)
      }

    } catch (error) {
      console.log(error);
      setError("Failed to fetch sales report data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setError(null);

    if (activeReport === "profit") {
      if (!dateRange.startDate || !dateRange.endDate) {
        setError("Please select a valid date range");
        return;
      }

      if (new Date(dateRange.endDate) < new Date(dateRange.startDate)) {
        setError("End date cannot be before start date");
        return;
      }

      await fetchProfitReportData();
    } else if (activeReport === "stock") {
      await fetchStockReportData();
    }
  };

  const handleExport = async (format) => {
    if (activeReport === "profit" && productSalesData.length === 0) {
      setError("No sales data available for export");
      return;
    }

    if (activeReport === "stock" && stockReportData.length === 0) {
      setError("No stock data available for export");
      return;
    }

    const currentDate = new Date();
    const dateString = currentDate.toISOString().split("T")[0];
    const fileName = `${activeReport === "profit" ? "Sales" : "Stock"}_Report_${dateString}`;

    try {
      if (format === "pdf") {
        await generatePDFReport(fileName);
      } else if (format === "csv") {
        generateCSVReport(fileName);
      }
    } catch (error) {
      console.error("Export failed:", error);
      setError(`Failed to export ${format.toUpperCase()} report. Please try again.`);
    }
  };

  const generatePDFReport = (fileName) => {
    // Initialize jsPDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let currentY = 25;

    if (activeReport === "profit") {

      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: 'Sales Report',
        subject: 'Product Sales Data',
        author: 'Sales Department',
        creator: 'Sales Dashboard'
      });

      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Sales Report', 14, 22);

      // Add generation date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Generated on: ${currentDate}`, 14, 32);

      // Table setup
      const startY = 45;
      const rowHeight = 8;
      const colWidths = [50, 25, 35, 35, 35]; // Column widths
      const colPositions = [14, 64, 89, 124, 159]; // X positions for columns

      // Draw table header
      doc.setFillColor(79, 70, 229); // Blue background
      doc.rect(14, startY, 180, rowHeight, 'F');

      doc.setTextColor(255, 255, 255); // White text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);

      // Header text
      doc.text('Product Name', colPositions[0] + 2, startY + 5);
      doc.text('Units Sold', colPositions[1] + 2, startY + 5);
      doc.text('Total Sales (LKR)', colPositions[2] + 2, startY + 5);
      doc.text('COGS (LKR)', colPositions[3] + 2, startY + 5);
      doc.text('Profit (LKR)', colPositions[4] + 2, startY + 5);

      // Draw table rows
      doc.setTextColor(0, 0, 0); // Black text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      let currentY = startY + rowHeight;

      productSalesData.forEach((item, index) => {
        // Alternate row colors
        if (index % 2 === 1) {
          doc.setFillColor(249, 250, 251); // Light gray
          doc.rect(14, currentY, 180, rowHeight, 'F');
        }

        // Draw cell borders
        doc.setDrawColor(200, 200, 200);
        for (let i = 0; i < colWidths.length; i++) {
          doc.rect(colPositions[i], currentY, colWidths[i], rowHeight);
        }

        // Add text content
        const textY = currentY + 5;
        doc.text(String(item.ProductName || "N/A"), colPositions[0] + 2, textY);
        doc.text(String(item.UnitsSold || "0"), colPositions[1] + 2, textY);
        doc.text(parseFloat(item.TotalSales || 0).toLocaleString(), colPositions[2] + 2, textY);
        doc.text(parseFloat(item.COGS || 0).toLocaleString(), colPositions[3] + 2, textY);
        doc.text(parseFloat(item.Profit || 0).toLocaleString(), colPositions[4] + 2, textY);

        currentY += rowHeight;
      });

      // Draw final table border
      doc.setDrawColor(0, 0, 0);
      doc.rect(14, startY, 180, currentY - startY);

      // Add summary section
      const summaryY = currentY + 20;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Summary', 14, summaryY);

      // Summary boxes
      const boxHeight = 25;
      const boxWidth = 55;
      const boxStartY = summaryY + 10;

      // Total Profit box
      doc.setFillColor(219, 234, 254); // Light blue
      doc.rect(14, boxStartY, boxWidth, boxHeight, 'F');
      doc.setDrawColor(147, 197, 253);
      doc.rect(14, boxStartY, boxWidth, boxHeight);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 64, 175);
      doc.text('Total Profit', 16, boxStartY + 8);
      doc.setFontSize(12);
      doc.text(`${totalProfit.toLocaleString()} LKR`, 16, boxStartY + 18);

      // Total Discounts box
      const box2X = 14 + boxWidth + 5;
      doc.setFillColor(254, 242, 242); // Light red
      doc.rect(box2X, boxStartY, boxWidth, boxHeight, 'F');
      doc.setDrawColor(252, 165, 165);
      doc.rect(box2X, boxStartY, boxWidth, boxHeight);

      doc.setFontSize(10);
      doc.setTextColor(153, 27, 27);
      doc.text('Total Discounts', box2X + 2, boxStartY + 8);
      doc.setFontSize(12);
      doc.text(`${totalDiscount.toLocaleString()} LKR`, box2X + 2, boxStartY + 18);

      // Net Profit box
      const box3X = box2X + boxWidth + 5;
      doc.setFillColor(240, 253, 244); // Light green
      doc.rect(box3X, boxStartY, boxWidth, boxHeight, 'F');
      doc.setDrawColor(134, 239, 172);
      doc.rect(box3X, boxStartY, boxWidth, boxHeight);

      doc.setFontSize(10);
      doc.setTextColor(20, 83, 45);
      doc.text('Net Profit', box3X + 2, boxStartY + 8);
      doc.setFontSize(12);
      doc.text(`${netProfit.toLocaleString()} LKR`, box3X + 2, boxStartY + 18);

      // Add footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text('This report was generated automatically from the sales dashboard.', 14, pageHeight - 10);

      // Save the PDF
      doc.save(`${fileName}.pdf`);

    } else if (activeReport === "stock") {
      // Create new PDF document
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: 'Inventory Report',
        subject: 'Stock and Inventory Data',
        author: 'Inventory Department',
        creator: 'Inventory Dashboard'
      });

      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Inventory Report', 14, 22);

      // Add generation date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Generated on: ${currentDate}`, 14, 32);

      // Key Metrics Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Key Metrics', 14, 45);

      // Key metrics boxes
      const metricsY = 55;
      const boxWidth = 45;
      const boxHeight = 20;
      const spacing = 2;

      // Total Products
      doc.setFillColor(219, 234, 254); // Light blue
      doc.rect(14, metricsY, boxWidth, boxHeight, 'F');
      doc.setDrawColor(147, 197, 253);
      doc.rect(14, metricsY, boxWidth, boxHeight);
      doc.setFontSize(8);
      doc.setTextColor(30, 64, 175);
      doc.text('Total Products', 16, metricsY + 6);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(String(totalProducts), 16, metricsY + 15);

      // Total Stock Units
      const box2X = 14 + boxWidth + spacing;
      doc.setFillColor(240, 253, 244); // Light green
      doc.rect(box2X, metricsY, boxWidth, boxHeight, 'F');
      doc.setDrawColor(134, 239, 172);
      doc.rect(box2X, metricsY, boxWidth, boxHeight);
      doc.setFontSize(8);
      doc.setTextColor(20, 83, 45);
      doc.text('Total Stock Units', box2X + 2, metricsY + 6);
      doc.setFontSize(14);
      doc.text(String(totalStock), box2X + 2, metricsY + 15);

      // Out of Stock
      const box3X = box2X + boxWidth + spacing;
      doc.setFillColor(254, 242, 242); // Light red
      doc.rect(box3X, metricsY, boxWidth, boxHeight, 'F');
      doc.setDrawColor(252, 165, 165);
      doc.rect(box3X, metricsY, boxWidth, boxHeight);
      doc.setFontSize(8);
      doc.setTextColor(153, 27, 27);
      doc.text('Out of Stock', box3X + 2, metricsY + 6);
      doc.setFontSize(14);
      doc.text(String(outOfStockCount), box3X + 2, metricsY + 15);

      // In Stock
      const box4X = box3X + boxWidth + spacing;
      doc.setFillColor(243, 232, 255); // Light purple
      doc.rect(box4X, metricsY, boxWidth, boxHeight, 'F');
      doc.setDrawColor(196, 181, 253);
      doc.rect(box4X, metricsY, boxWidth, boxHeight);
      doc.setFontSize(8);
      doc.setTextColor(91, 33, 182);
      doc.text('In Stock', box4X + 2, metricsY + 6);
      doc.setFontSize(14);
      doc.text(String(inStockCount), box4X + 2, metricsY + 15);

      // Inventory Table
      const tableStartY = metricsY + boxHeight + 15;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Inventory Details', 14, tableStartY);

      // Table setup
      const dataStartY = tableStartY + 10;
      const rowHeight = 8;
      const colWidths = [45, 35, 25, 35, 35]; // Column widths
      const colPositions = [14, 59, 94, 119, 154]; // X positions for columns

      // Draw table header
      doc.setFillColor(79, 70, 229); // Blue background
      doc.rect(14, dataStartY, 175, rowHeight, 'F');

      doc.setTextColor(255, 255, 255); // White text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);

      // Header text
      doc.text('Product Name', colPositions[0] + 2, dataStartY + 5);
      doc.text('Warehouse', colPositions[1] + 2, dataStartY + 5);
      doc.text('Stock Qty', colPositions[2] + 2, dataStartY + 5);
      doc.text('Availability', colPositions[3] + 2, dataStartY + 5);
      doc.text('Stock Level', colPositions[4] + 2, dataStartY + 5);

      // Draw table rows
      doc.setTextColor(0, 0, 0); // Black text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      let currentY = dataStartY + rowHeight;
      let pageHeight = doc.internal.pageSize.height;

      stockReportData.forEach((item, index) => {
        // Check if we need a new page
        if (currentY > pageHeight - 30) {
          doc.addPage();
          currentY = 20;
        }

        // Row background color based on stock status
        if (item.IsOutOfStock === "Yes") {
          doc.setFillColor(254, 242, 242); // Light red for out of stock
          doc.rect(14, currentY, 175, rowHeight, 'F');
        } else if (index % 2 === 1) {
          doc.setFillColor(249, 250, 251); // Light gray for alternate rows
          doc.rect(14, currentY, 175, rowHeight, 'F');
        }

        // Draw cell borders
        doc.setDrawColor(200, 200, 200);
        for (let i = 0; i < colWidths.length; i++) {
          doc.rect(colPositions[i], currentY, colWidths[i], rowHeight);
        }

        // Add text content
        const textY = currentY + 5;

        // Truncate long product names
        let productName = String(item.ProductName || "N/A");
        if (productName.length > 20) {
          productName = productName.substring(0, 17) + "...";
        }

        let warehouse = String(item.WarehouseLocation || "N/A");
        if (warehouse.length > 15) {
          warehouse = warehouse.substring(0, 12) + "...";
        }

        doc.text(productName, colPositions[0] + 1, textY);
        doc.text(warehouse, colPositions[1] + 1, textY);
        doc.text(String(item.StockQuantity || "0"), colPositions[2] + 1, textY);

        // Availability status
        const availability = item.IsOutOfStock === "Yes" ? "Out of Stock" : "Available";
        doc.text(availability, colPositions[3] + 1, textY);

        // Stock level
        const stockLevel = item.StockQuantity === 0 ? "Empty" :
          item.StockQuantity < 10 ? "Low Stock" : "Good Stock";
        doc.text(stockLevel, colPositions[4] + 1, textY);

        currentY += rowHeight;
      });

      // Draw final table border
      doc.setDrawColor(0, 0, 0);
      doc.rect(14, dataStartY, 175, currentY - dataStartY);

      // Stock Status Summary
      const summaryY = currentY + 15;

      // Check if we need a new page for summary
      if (summaryY > pageHeight - 60) {
        doc.addPage();
        currentY = 20;
      } else {
        currentY = summaryY;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Stock Status Summary', 14, currentY);

      const summaryBoxY = currentY + 10;
      const summaryBoxWidth = 85;
      const summaryBoxHeight = 30;

      // Products Available box
      doc.setFillColor(240, 253, 244); // Light green
      doc.rect(14, summaryBoxY, summaryBoxWidth, summaryBoxHeight, 'F');
      doc.setDrawColor(134, 239, 172);
      doc.rect(14, summaryBoxY, summaryBoxWidth, summaryBoxHeight);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 83, 45);
      doc.text('Products Available', 16, summaryBoxY + 8);
      doc.setFontSize(16);
      doc.text(String(inStockCount), 16, summaryBoxY + 18);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const availablePercentage = totalProducts > 0 ? ((inStockCount / totalProducts) * 100).toFixed(1) : 0;
      doc.text(`${availablePercentage}% of total products`, 16, summaryBoxY + 26);

      // Products Out of Stock box
      const summaryBox2X = 14 + summaryBoxWidth + 10;
      doc.setFillColor(254, 242, 242); // Light red
      doc.rect(summaryBox2X, summaryBoxY, summaryBoxWidth, summaryBoxHeight, 'F');
      doc.setDrawColor(252, 165, 165);
      doc.rect(summaryBox2X, summaryBoxY, summaryBoxWidth, summaryBoxHeight);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(153, 27, 27);
      doc.text('Products Out of Stock', summaryBox2X + 2, summaryBoxY + 8);
      doc.setFontSize(16);
      doc.text(String(outOfStockCount), summaryBox2X + 2, summaryBoxY + 18);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const outOfStockPercentage = totalProducts > 0 ? ((outOfStockCount / totalProducts) * 100).toFixed(1) : 0;
      doc.text(`${outOfStockPercentage}% of total products`, summaryBox2X + 2, summaryBoxY + 26);

      // Add footer
      pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text('This inventory report was generated automatically from the inventory dashboard.', 14, pageHeight - 10);

      // Save the PDF
      doc.save(`${fileName}.pdf`)

    }
  };

  const generateCSVReport = (fileName) => {
    let csvContent = "";

    if (activeReport === "profit") {
      // CSV Headers
      csvContent = "Product Name,Units Sold,Total Sales (LKR),COGS (LKR),Profit (LKR)\n";

      // CSV Data
      productSalesData.forEach(item => {
        const productName = (item.ProductName || "N/A").replace(/"/g, '""');
        csvContent += `"${productName}",${item.UnitsSold || 0},${parseFloat(item.TotalSales || 0).toFixed(2)},${parseFloat(item.COGS || 0).toFixed(2)},${parseFloat(item.Profit || 0).toFixed(2)}\n`;
      });

      // Summary Section
      csvContent += "\n";
      csvContent += "FINANCIAL SUMMARY\n";
      csvContent += "Metric,Amount (LKR)\n";
      csvContent += `Total Profit,${totalProfit.toFixed(2)}\n`;
      csvContent += `Total Discounts,${totalDiscount.toFixed(2)}\n`;
      csvContent += `Net Profit,${netProfit.toFixed(2)}\n`;
      csvContent += "\n";
      csvContent += "REPORT INFORMATION\n";
      csvContent += "Field,Value\n";
      csvContent += `Report Date,"${new Date().toLocaleDateString()}"\n`;
      csvContent += `Date Range,"${dateRange.startDate} to ${dateRange.endDate}"\n`;
      csvContent += `Report Type,Sales & Earnings\n`;

    } else if (activeReport === "stock") {
      // CSV Headers
      csvContent = "Product Name,Warehouse Location,Stock Quantity,Availability Status,Stock Level\n";

      // CSV Data
      stockReportData.forEach(item => {
        const productName = item.ProductName.replace(/"/g, '""');
        const warehouseLocation = item.WarehouseLocation.replace(/"/g, '""');
        const stockLevel = item.StockQuantity === 0 ? "Empty" :
          item.StockQuantity < 10 ? "Low Stock" : "Good Stock";
        const availabilityStatus = item.IsOutOfStock === "Yes" ? "Out of Stock" : "Available";

        csvContent += `"${productName}","${warehouseLocation}",${item.StockQuantity},"${availabilityStatus}","${stockLevel}"\n`;
      });

      // Summary Section
      csvContent += "\n";
      csvContent += "INVENTORY SUMMARY\n";
      csvContent += "Metric,Count\n";
      csvContent += `Total Products,${totalProducts}\n`;
      csvContent += `Total Stock Units,${totalStock}\n`;
      csvContent += `Products In Stock,${inStockCount}\n`;
      csvContent += `Products Out of Stock,${outOfStockCount}\n`;
      csvContent += `Low Stock Items,${stockReportData.filter(item => item.StockQuantity < 10 && item.StockQuantity > 0).length}\n`;
      csvContent += "\n";
      csvContent += "REPORT INFORMATION\n";
      csvContent += "Field,Value\n";
      csvContent += `Report Date,"${new Date().toLocaleDateString()}"\n`;
      csvContent += `Warehouse,"${warehouses.find(w => w.LocationID == selectedWarehouse)?.WarehouseName || "All Warehouses"}"\n`;
      csvContent += `Report Type,Inventory Stock\n`;
    }

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Fallback for browsers that don't support download attribute
      // window.open(url);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate totals for profit report
  const totalProfit = productSalesData.reduce((sum, item) => sum + parseFloat(item.Profit || 0), 0);
  const totalDiscount = parseFloat(totalDiscounts[0]?.TotalDiscount || 0);
  const netProfit = totalProfit - totalDiscount;

  // Calculate totals for stock report
  const totalStock = stockReportData.reduce((sum, item) => sum + item.StockQuantity, 0);
  const outOfStockCount = stockReportData.filter(item => item.IsOutOfStock === "Yes").length;
  const inStockCount = stockReportData.filter(item => item.IsOutOfStock === "No").length;
  const totalProducts = stockReportData.length;

  useEffect(() => {
    fetchWarehouses()
    loadProductData()
  }, [])
  const today = new Date().toLocaleDateString('en-CA');
  return (
    <div className="w-full min-h-screen p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generate and manage inventory and sales reports
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">

          {/* Report Dashboard Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">
                    Reports Generated
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {(productSalesData.length > 0 || stockReportData.length > 0) ? 1 : 0}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">
                    Total Products
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {products.length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
                  <Warehouse className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">
                    Total Warehouses
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {warehouses.length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">
                    Low Stock Items
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {stockReportData.length > 0 ? stockReportData.filter(item => item.StockQuantity < 10 && item.StockQuantity > 0).length : "--"}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Types Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Report Types
            </h2>
            <div className="space-y-2">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => {
                    setActiveReport(report.id);
                    setError(null);
                    setProductSalesData([]);
                    setStockReportData([]);
                  }}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${activeReport === report.id
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  <div className={`flex-shrink-0 ${activeReport === report.id ? "text-blue-600" : "text-gray-500"
                    }`}>
                    {report.icon}
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {report.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Report Configuration */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {reportTypes.find((r) => r.id === activeReport)?.name} Configuration
              </h2>

              <div className="space-y-6">
                {/* Date Range Selection for Profit Report */}
                {activeReport === "profit" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={dateRange.startDate}
                          onChange={(e) =>
                            setDateRange({
                              ...dateRange,
                              startDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={dateRange.endDate}
                          onChange={(e) =>
                            setDateRange({
                              ...dateRange,
                              endDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Warehouse Selection for Stock Report */}
                {activeReport === "stock" && (
                  <div>
                    <label
                      htmlFor="warehouse"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Warehouse
                    </label>
                    <select
                      id="warehouse"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={selectedWarehouse}
                      onChange={(e) => setSelectedWarehouse(e.target.value)}
                    >
                      <option value="all">Select a warehouse</option>
                      {warehouses.map((warehouse) => (
                        <option
                          key={warehouse.LocationID}
                          value={warehouse.LocationID}
                        >
                          {warehouse.WarehouseName} ({warehouse.Address})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Generate Report Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGenerateReport}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="-ml-1 mr-2 h-5 w-5" />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Report Preview Area */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Report Preview
                </h2>
                {((activeReport === "profit" && productSalesData.length > 0) ||
                  (activeReport === "stock" && stockReportData.length > 0)) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleExport("pdf")}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Export as PDF"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        PDF
                      </button>
                      <button
                        onClick={() => handleExport("csv")}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Export as CSV"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        CSV
                      </button>
                      <button
                        onClick={handlePrint}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Print Report"
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </button>
                    </div>
                  )}
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-8">
                  <svg
                    className="animate-spin mx-auto h-8 w-8 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="mt-2 text-gray-600">Loading report...</p>
                </div>
              ) : activeReport === "profit" && productSalesData.length > 0 ? (
                <div className="space-y-6">
                  {/* Sales Data Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Units Sold
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Sales
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            COGS
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Profit
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {productSalesData.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.ProductName || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.UnitsSold || "0"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {parseFloat(item.TotalSales || 0).toLocaleString()} LKR
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {parseFloat(item.COGS || 0).toLocaleString()} LKR
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              {parseFloat(item.Profit || 0).toLocaleString()} LKR
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 mb-1">Total Profit</h3>
                          <p className="text-2xl font-bold text-blue-900">
                            {totalProfit.toLocaleString()} LKR
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-red-600" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 mb-1">Total Discounts</h3>
                          <p className="text-2xl font-bold text-red-900">
                            {totalDiscount.toLocaleString()} LKR
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <BarChart3 className="h-8 w-8 text-green-600" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800 mb-1">Net Profit</h3>
                          <p className="text-2xl font-bold text-green-900">
                            {netProfit.toLocaleString()} LKR
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeReport === "stock" && stockReportData.length > 0 ? (
                <div className="space-y-6">
                  {/* Key Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <Package className="h-8 w-8 text-blue-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Total Products</p>
                          <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <BarChart3 className="h-8 w-8 text-green-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Total Stock Units</p>
                          <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                          <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <Warehouse className="h-8 w-8 text-purple-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">In Stock</p>
                          <p className="text-2xl font-bold text-gray-900">{inStockCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inventory Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Warehouse Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock Quantity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Availability Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock Level
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stockReportData.map((item, index) => (
                          <tr key={index} className={item.IsOutOfStock === "Yes" ? "bg-red-50" : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.ProductName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.WarehouseLocation}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                              {item.StockQuantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.IsOutOfStock === "Yes"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                                }`}>
                                {item.IsOutOfStock === "Yes" ? "Out of Stock" : "Available"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.StockQuantity === 0
                                ? "bg-red-100 text-red-800"
                                : item.StockQuantity < 10
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                                }`}>
                                {item.StockQuantity === 0 ? "Empty" :
                                  item.StockQuantity < 10 ? "Low Stock" : "Good Stock"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Stock Status Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h3 className="text-sm font-medium text-green-800 mb-2">Products Available</h3>
                      <p className="text-3xl font-bold text-green-900">{inStockCount}</p>
                      <p className="text-sm text-green-600 mt-1">
                        {totalProducts > 0 ? ((inStockCount / totalProducts) * 100).toFixed(1) : 0}% of total products
                      </p>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                      <h3 className="text-sm font-medium text-red-800 mb-2">Products Out of Stock</h3>
                      <p className="text-3xl font-bold text-red-900">{outOfStockCount}</p>
                      <p className="text-sm text-red-600 mt-1">
                        {totalProducts > 0 ? ((outOfStockCount / totalProducts) * 100).toFixed(1) : 0}% of total products
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center h-64">
                  <BarChart3 className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium text-gray-500">
                    No report generated yet
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Configure your report parameters and click "Generate Report"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default Reports;