// const handlePrintSalesOrderTable = (ordersData = []) => {
//     const printWindow = window.open('', '_blank');

//     printWindow.document.write(`
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Sales Order Report</title>
//     <style>
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }

//         body {
//             font-family: 'Arial', sans-serif;
//             font-size: 12px;
//             line-height: 1.4;
//             color: #333;
//             background: white;
//         }

//         .container {
//             max-width: 210mm;
//             margin: 0 auto;
//             padding: 20px;
//         }

//         .header {
//             text-align: center;
//             margin-bottom: 30px;
//             border-bottom: 2px solid #333;
//             padding-bottom: 15px;
//         }

//         .company-name {
//             font-size: 24px;
//             font-weight: bold;
//             color: #2c3e50;
//             margin-bottom: 5px;
//         }

//         .report-title {
//             font-size: 18px;
//             color: #34495e;
//             margin-bottom: 10px;
//         }

//         .report-info {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 20px;
//             font-size: 11px;
//         }

//         .report-date {
//             font-weight: bold;
//         }

//         .summary-section {
//             background: #f8f9fa;
//             padding: 15px;
//             border-radius: 5px;
//             margin-bottom: 25px;
//             border: 1px solid #dee2e6;
//         }

//         .summary-title {
//             font-size: 14px;
//             font-weight: bold;
//             margin-bottom: 10px;
//             color: #2c3e50;
//         }

//         .summary-stats {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
//             gap: 15px;
//         }

//         .stat-item {
//             text-align: center;
//         }

//         .stat-value {
//             font-size: 18px;
//             font-weight: bold;
//             color: #27ae60;
//         }

//         .stat-label {
//             font-size: 11px;
//             color: #7f8c8d;
//             margin-top: 2px;
//         }

//         .table-container {
//             margin-bottom: 30px;
//         }

//         .table-title {
//             font-size: 14px;
//             font-weight: bold;
//             margin-bottom: 10px;
//             color: #2c3e50;
//         }

//         table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 20px;
//             background: white;
//             box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//         }

//         th {
//             background: #34495e;
//             color: white;
//             padding: 12px 8px;
//             text-align: left;
//             font-weight: bold;
//             font-size: 11px;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }

//         td {
//             padding: 10px 8px;
//             border-bottom: 1px solid #dee2e6;
//             font-size: 11px;
//         }

//         tr:nth-child(even) {
//             background: #f8f9fa;
//         }

//         .order-id {
//             font-weight: bold;
//             color: #2980b9;
//         }

//         .amount {
//             text-align: right;
//             font-weight: bold;
//             color: #27ae60;
//         }

//         .status {
//             text-align: center;
//             font-weight: bold;
//             padding: 4px 8px;
//             border-radius: 12px;
//             font-size: 10px;
//         }

//         .status.completed {
//             background: #d4edda;
//             color: #155724;
//         }

//         .status.pending {
//             background: #fff3cd;
//             color: #856404;
//         }

//         .status.cancelled {
//             background: #f8d7da;
//             color: #721c24;
//         }

//         .status.processing {
//             background: #cce7ff;
//             color: #004085;
//         }

//         .footer {
//             margin-top: 40px;
//             padding-top: 20px;
//             border-top: 1px solid #dee2e6;
//             text-align: center;
//             font-size: 10px;
//             color: #6c757d;
//         }

//         .generated-info {
//             margin-top: 10px;
//         }

//         /* Print Styles */
//         @media print {
//             body {
//                 font-size: 10px;
//             }
            
//             .container {
//                 max-width: none;
//                 padding: 10px;
//             }

//             .header {
//                 margin-bottom: 20px;
//             }

//             .summary-section {
//                 margin-bottom: 15px;
//                 padding: 10px;
//             }

//             table {
//                 page-break-inside: avoid;
//             }

//             tr {
//                 page-break-inside: avoid;
//             }

//             .footer {
//                 position: fixed;
//                 bottom: 0;
//                 width: 100%;
//                 margin-top: 0;
//             }
//         }

//         @page {
//             margin: 1cm;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <!-- Header Section -->
//         <div class="header">
//           <div class="company-name">Ashoka Rubber Industries</div>
//           <p style="font-size: 0.75rem"> <strong> DEALERS IN RADIATOR HOSE, AIR CLEANER HOSE, OIL HOSE AND POWER STEARRING HOSE </strong> </p>
//           <p style="font-size: 0.75rem"> No. 89, Ruwanpura, Hapugasthalawa, Tel: 0776 272 994, 0779 626 642 </p>
//           <div class="document-title">Sales Orders Report</div>
//         </div>

//         <!-- Report Information -->
//         <div class="report-info">
//             <div class="report-date">Report Generated: <span id="currentDate"></span></div>
//             <div>Page 1 of 1</div>
//         </div>

//         <!-- Summary Section -->
//         <div class="summary-section">
//             <div class="summary-title">Report Summary</div>
//             <div class="summary-stats" id="summaryStats">
//                 <div class="stat-item">
//                     <div class="stat-value" id="totalOrders">0</div>
//                     <div class="stat-label">Total Orders</div>
//                 </div>
//                 <div class="stat-item">
//                     <div class="stat-value" id="totalRevenue">$0.00</div>
//                     <div class="stat-label">Total Revenue</div>
//                 </div>
//             </div>
//         </div>

//         <!-- Sales Orders Table -->
//         <div class="table-container">
//             <div class="table-title">Sales Orders Details</div>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Order ID</th>
//                         <th>Order Date</th>
//                         <th>Total Amount</th>
//                         <th>Status</th>
//                     </tr>
//                 </thead>
//                 <tbody id="ordersTableBody">
//                     <!-- Orders will be populated dynamically -->
//                 </tbody>
//             </table>
//         </div>

//         <!-- Footer -->
//         <div class="footer">
//             <div>This report contains confidential business information</div>
//             <div class="generated-info">Generated on <span id="footerDate"></span> | Sales Order Management System</div>
//         </div>
//     </div>

//     <script>
//         // Pass data from parent window or use default sample data
//         let filteredOrders = ${JSON.stringify(ordersData)};

//         // Function to format currency
//         function formatCurrency(amount) {
//             return new Intl.NumberFormat('en-US', {
//                 style: 'currency',
//                 currency: 'LKR'
//             }).format(amount);
//         }

//         // Function to format date
//         function formatDate(dateString) {
//             const date = new Date(dateString);
//             return date.toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: '2-digit',
//                 day: '2-digit'
//             });
//         }

//         // Function to get status class and display text
//         function getStatusInfo(status) {
//             const statusMap = {
//                 'completed': { class: 'completed', text: 'Completed' },
//                 'pending': { class: 'pending', text: 'Pending' },
//                 'processing': { class: 'processing', text: 'Processing' },
//                 'cancelled': { class: 'cancelled', text: 'Cancelled' }
//             };
//             return statusMap[status.toLowerCase()] || { class: 'pending', text: status };
//         }

//         // Function to populate the orders table
//         function populateOrdersTable(orders) {
//             const tbody = document.getElementById('ordersTableBody');
//             tbody.innerHTML = '';

//             orders.forEach(order => {
//                 const statusInfo = getStatusInfo(order.Status);
//                 const row = document.createElement('tr');
                
//                 row.innerHTML = \`
//                     <td class="order-id">\${order.OrderID}</td>
//                     <td>\${formatDate(order.OrderDate)}</td>
//                     <td class="amount">\${formatCurrency(order.TotalAmount)}</td>
//                     <td><span class="status \${statusInfo.class}">\${statusInfo.text}</span></td>
//                 \`;
                
//                 tbody.appendChild(row);
//             });
//         }

//         // Function to calculate and update summary statistics
//         function updateSummaryStats(orders) {
//             const totalOrders = orders.length;
//             const totalRevenue = Number(orders.reduce((sum, order) => sum + Number(order.TotalAmount), 0));

//             document.getElementById('totalOrders').textContent = totalOrders;
//             document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
//         }

//         // Function to initialize the report with data
//         function initializeReport(orders = filteredOrders) {
//             populateOrdersTable(orders);
//             updateSummaryStats(orders);
//         }

//         // Set current date
//         const now = new Date();
//         const dateString = now.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
        
//         document.getElementById('currentDate').textContent = dateString;
//         document.getElementById('footerDate').textContent = dateString;

//         // Initialize the report when the page loads
//         document.addEventListener('DOMContentLoaded', function() {
//             initializeReport();
//         });

//         // Auto-print after content loads
//         window.addEventListener('load', function() {
//             setTimeout(() => {
//                 window.print();
//                 // Optionally close after printing
//                 setTimeout(() => {
//                     window.close();
//                 }, 1000);
//             }, 500);
//         });
//     </script>
// </body>
// </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();
// };

// export default handlePrintSalesOrderTable

// const handlePrintSalesOrderTable = (ordersData = []) => {
//     const printWindow = window.open('', '_blank');

//     printWindow.document.write(`
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Sales Order Report</title>
//     <style>
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }

//         body {
//             font-family: 'Arial', sans-serif;
//             font-size: 12px;
//             line-height: 1.4;
//             color: #333;
//             background: white;
//         }

//         .container {
//             max-width: 210mm;
//             margin: 0 auto;
//             padding: 20px;
//         }

//         .header {
//             text-align: center;
//             margin-bottom: 30px;
//             border-bottom: 2px solid #333;
//             padding-bottom: 15px;
//         }

//         .company-name {
//             font-size: 24px;
//             font-weight: bold;
//             color: #2c3e50;
//             margin-bottom: 5px;
//         }

//         .report-title {
//             font-size: 18px;
//             color: #34495e;
//             margin-bottom: 10px;
//         }

//         .report-info {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 20px;
//             font-size: 11px;
//         }

//         .report-date {
//             font-weight: bold;
//         }

//         .summary-section {
//             background: #f8f9fa;
//             padding: 15px;
//             border-radius: 5px;
//             margin-bottom: 25px;
//             border: 1px solid #dee2e6;
//         }

//         .summary-title {
//             font-size: 14px;
//             font-weight: bold;
//             margin-bottom: 10px;
//             color: #2c3e50;
//         }

//         .summary-stats {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
//             gap: 15px;
//         }

//         .stat-item {
//             text-align: center;
//         }

//         .stat-value {
//             font-size: 18px;
//             font-weight: bold;
//             color: #27ae60;
//         }

//         .stat-label {
//             font-size: 11px;
//             color: #7f8c8d;
//             margin-top: 2px;
//         }

//         .table-container {
//             margin-bottom: 30px;
//         }

//         .table-title {
//             font-size: 14px;
//             font-weight: bold;
//             margin-bottom: 10px;
//             color: #2c3e50;
//         }

//         table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 20px;
//             background: white;
//             box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//         }

//         th {
//             background: #34495e;
//             color: white;
//             padding: 12px 8px;
//             text-align: left;
//             font-weight: bold;
//             font-size: 11px;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }

//         td {
//             padding: 10px 8px;
//             border-bottom: 1px solid #dee2e6;
//             font-size: 11px;
//         }

//         tr:nth-child(even) {
//             background: #f8f9fa;
//         }

//         .order-id {
//             font-weight: bold;
//             color: #2980b9;
//         }

//         .amount {
//             text-align: right;
//             font-weight: bold;
//             color: #27ae60;
//         }

//         .status {
//             text-align: center;
//             font-weight: bold;
//             padding: 4px 8px;
//             border-radius: 12px;
//             font-size: 10px;
//         }

//         .status.completed {
//             background: #d4edda;
//             color: #155724;
//         }

//         .status.pending {
//             background: #fff3cd;
//             color: #856404;
//         }

//         .status.cancelled {
//             background: #f8d7da;
//             color: #721c24;
//         }

//         .status.processing {
//             background: #cce7ff;
//             color: #004085;
//         }

//         .payment-status {
//             text-align: center;
//             font-weight: bold;
//             padding: 4px 8px;
//             border-radius: 12px;
//             font-size: 10px;
//         }

//         .payment-status.paid {
//             background: #d1ecf1;
//             color: #0c5460;
//         }

//         .payment-status.unpaid {
//             background: #f5c6cb;
//             color: #721c24;
//         }

//         .footer {
//             margin-top: 40px;
//             padding-top: 20px;
//             border-top: 1px solid #dee2e6;
//             text-align: center;
//             font-size: 10px;
//             color: #6c757d;
//         }

//         .generated-info {
//             margin-top: 10px;
//         }

//         /* Print Styles */
//         @media print {
//             body {
//                 font-size: 10px;
//             }
            
//             .container {
//                 max-width: none;
//                 padding: 10px;
//             }

//             .header {
//                 margin-bottom: 20px;
//             }

//             .summary-section {
//                 margin-bottom: 15px;
//                 padding: 10px;
//             }

//             table {
//                 page-break-inside: avoid;
//             }

//             tr {
//                 page-break-inside: avoid;
//             }

//             .footer {
//                 position: fixed;
//                 bottom: 0;
//                 width: 100%;
//                 margin-top: 0;
//             }
//         }

//         @page {
//             margin: 1cm;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <!-- Header Section -->
//         <div class="header">
//           <div class="company-name">Ashoka Rubber Industries</div>
//           <p style="font-size: 0.75rem"> <strong> DEALERS IN RADIATOR HOSE, AIR CLEANER HOSE, OIL HOSE AND POWER STEARRING HOSE </strong> </p>
//           <p style="font-size: 0.75rem"> No. 89, Ruwanpura, Hapugasthalawa, Tel: 0776 272 994, 0779 626 642 </p>
//           <div class="document-title">Sales Orders Report</div>
//         </div>

//         <!-- Report Information -->
//         <div class="report-info">
//             <div class="report-date">Report Generated: <span id="currentDate"></span></div>
//             <div>Page 1 of 1</div>
//         </div>

//         <!-- Summary Section -->
//         <div class="summary-section">
//             <div class="summary-title">Report Summary</div>
//             <div class="summary-stats" id="summaryStats">
//                 <div class="stat-item">
//                     <div class="stat-value" id="totalOrders">0</div>
//                     <div class="stat-label">Total Orders</div>
//                 </div>
//                 <div class="stat-item">
//                     <div class="stat-value" id="totalRevenue">$0.00</div>
//                     <div class="stat-label">Total Revenue</div>
//                 </div>
//                 <div class="stat-item">
//                     <div class="stat-value" id="paidOrders">0</div>
//                     <div class="stat-label">Paid Orders</div>
//                 </div>
//                 <div class="stat-item">
//                     <div class="stat-value" id="unpaidOrders">0</div>
//                     <div class="stat-label">Unpaid Orders</div>
//                 </div>
//                 <div class="stat-item">
//                     <div class="stat-value" id="paidAmount">$0.00</div>
//                     <div class="stat-label">Paid Amount</div>
//                 </div>
//                 <div class="stat-item">
//                     <div class="stat-value" id="unpaidAmount">$0.00</div>
//                     <div class="stat-label">Outstanding Amount</div>
//                 </div>
//             </div>
//         </div>

//         <!-- Sales Orders Table -->
//         <div class="table-container">
//             <div class="table-title">Sales Orders Details</div>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Order ID</th>
//                         <th>Order Date</th>
//                         <th>Total Amount</th>
//                         <th>Status</th>
//                         <th>Payment Status</th>
//                     </tr>
//                 </thead>
//                 <tbody id="ordersTableBody">
//                     <!-- Orders will be populated dynamically -->
//                 </tbody>
//             </table>
//         </div>

//         <!-- Footer -->
//         <div class="footer">
//             <div>This report contains confidential business information</div>
//             <div class="generated-info">Generated on <span id="footerDate"></span> | Sales Order Management System</div>
//         </div>
//     </div>

//     <script>
//         // Pass data from parent window or use default sample data
//         let filteredOrders = ${JSON.stringify(ordersData)};

//         // Function to format currency
//         function formatCurrency(amount) {
//             return new Intl.NumberFormat('en-US', {
//                 style: 'currency',
//                 currency: 'LKR'
//             }).format(amount);
//         }

//         // Function to format date
//         function formatDate(dateString) {
//             const date = new Date(dateString);
//             return date.toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: '2-digit',
//                 day: '2-digit'
//             });
//         }

//         // Function to get status class and display text
//         function getStatusInfo(status) {
//             const statusMap = {
//                 'completed': { class: 'completed', text: 'Completed' },
//                 'pending': { class: 'pending', text: 'Pending' },
//                 'processing': { class: 'processing', text: 'Processing' },
//                 'cancelled': { class: 'cancelled', text: 'Cancelled' }
//             };
//             return statusMap[status.toLowerCase()] || { class: 'pending', text: status };
//         }

//         // Function to get payment status class and display text
//         function getPaymentStatusInfo(paymentStatus) {
//             const statusMap = {
//                 'paid': { class: 'paid', text: 'PAID' },
//                 'unpaid': { class: 'unpaid', text: 'UNPAID' }
//             };
//             return statusMap[paymentStatus.toLowerCase()] || { class: 'unpaid', text: 'UNPAID' };
//         }

//         // Function to populate the orders table
//         function populateOrdersTable(orders) {
//             const tbody = document.getElementById('ordersTableBody');
//             tbody.innerHTML = '';

//             orders.forEach(order => {
//                 const statusInfo = getStatusInfo(order.Status);
//                 const paymentStatusInfo = getPaymentStatusInfo(order.PaymentStatus || 'unpaid');
//                 const row = document.createElement('tr');
                
//                 row.innerHTML = \`
//                     <td class="order-id">\${order.OrderID}</td>
//                     <td>\${formatDate(order.OrderDate)}</td>
//                     <td class="amount">\${formatCurrency(order.TotalAmount)}</td>
//                     <td><span class="status \${statusInfo.class}">\${statusInfo.text}</span></td>
//                     <td><span class="payment-status \${paymentStatusInfo.class}">\${paymentStatusInfo.text}</span></td>
//                 \`;
                
//                 tbody.appendChild(row);
//             });
//         }

//         // Function to calculate and update summary statistics
//         function updateSummaryStats(orders) {
//             const totalOrders = orders.length;
//             const totalRevenue = Number(orders.reduce((sum, order) => sum + Number(order.TotalAmount), 0));
            
//             // Calculate payment statistics
//             const paidOrders = orders.filter(order => (order.PaymentStatus || '').toLowerCase() === 'paid');
//             const unpaidOrders = orders.filter(order => (order.PaymentStatus || '').toLowerCase() !== 'paid');
            
//             const paidAmount = Number(paidOrders.reduce((sum, order) => sum + Number(order.TotalAmount), 0));
//             const unpaidAmount = Number(unpaidOrders.reduce((sum, order) => sum + Number(order.TotalAmount), 0));

//             document.getElementById('totalOrders').textContent = totalOrders;
//             document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
//             document.getElementById('paidOrders').textContent = paidOrders.length;
//             document.getElementById('unpaidOrders').textContent = unpaidOrders.length;
//             document.getElementById('paidAmount').textContent = formatCurrency(paidAmount);
//             document.getElementById('unpaidAmount').textContent = formatCurrency(unpaidAmount);
//         }

//         // Function to initialize the report with data
//         function initializeReport(orders = filteredOrders) {
//             populateOrdersTable(orders);
//             updateSummaryStats(orders);
//         }

//         // Set current date
//         const now = new Date();
//         const dateString = now.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
        
//         document.getElementById('currentDate').textContent = dateString;
//         document.getElementById('footerDate').textContent = dateString;

//         // Initialize the report when the page loads
//         document.addEventListener('DOMContentLoaded', function() {
//             initializeReport();
//         });

//         // Auto-print after content loads
//         window.addEventListener('load', function() {
//             setTimeout(() => {
//                 window.print();
//                 // Optionally close after printing
//                 setTimeout(() => {
//                     window.close();
//                 }, 1000);
//             }, 500);
//         });
//     </script>
// </body>
// </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();
// };

// export default handlePrintSalesOrderTable;

// const handlePrintSalesOrderTable = (ordersData = []) => {
//     const printWindow = window.open('', '_blank');

//     printWindow.document.write(`
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Sales Order Report</title>
//     <style>
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }

//         body {
//             font-family: 'Arial', sans-serif;
//             font-size: 12px;
//             line-height: 1.4;
//             color: #333;
//             background: white;
//         }

//         .container {
//             max-width: 210mm;
//             margin: 0 auto;
//             padding: 20px;
//         }

//         .header {
//             text-align: center;
//             margin-bottom: 30px;
//             border-bottom: 2px solid #333;
//             padding-bottom: 15px;
//         }

//         .company-name {
//             font-size: 24px;
//             font-weight: bold;
//             color: #2c3e50;
//             margin-bottom: 5px;
//         }

//         .report-title {
//             font-size: 18px;
//             color: #34495e;
//             margin-bottom: 10px;
//         }

//         .report-info {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 20px;
//             font-size: 11px;
//         }

//         .report-date {
//             font-weight: bold;
//         }

//         .summary-section {
//             background: #f8f9fa;
//             padding: 15px;
//             border-radius: 5px;
//             margin-bottom: 25px;
//             border: 1px solid #dee2e6;
//         }

//         .summary-title {
//             font-size: 14px;
//             font-weight: bold;
//             margin-bottom: 10px;
//             color: #2c3e50;
//         }

//         .summary-stats {
//             display: grid;
//             grid-template-columns: repeat(6, 1fr);
//             gap: 10px;
//         }

//         .stat-item {
//             text-align: center;
//         }

//         .stat-value {
//             font-size: 16px;
//             font-weight: bold;
//             color: #27ae60;
//         }

//         .stat-label {
//             font-size: 10px;
//             color: #7f8c8d;
//             margin-top: 2px;
//         }

//         .table-container {
//             margin-bottom: 30px;
//         }

//         .table-title {
//             font-size: 14px;
//             font-weight: bold;
//             margin-bottom: 10px;
//             color: #2c3e50;
//         }

//         table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 20px;
//             background: white;
//             box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//         }

//         th {
//             background: #34495e;
//             color: white;
//             padding: 12px 8px;
//             text-align: left;
//             font-weight: bold;
//             font-size: 11px;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//         }

//         td {
//             padding: 10px 8px;
//             border-bottom: 1px solid #dee2e6;
//             font-size: 11px;
//         }

//         tr:nth-child(even) {
//             background: #f8f9fa;
//         }

//         .order-id {
//             font-weight: bold;
//             color: #2980b9;
//         }

//         .amount {
//             text-align: right;
//             font-weight: bold;
//             color: #27ae60;
//         }

//         .status {
//             text-align: center;
//             font-weight: bold;
//             padding: 4px 8px;
//             border-radius: 12px;
//             font-size: 10px;
//         }

//         .status.completed {
//             background: #d4edda;
//             color: #155724;
//         }

//         .status.pending {
//             background: #fff3cd;
//             color: #856404;
//         }

//         .status.cancelled {
//             background: #f8d7da;
//             color: #721c24;
//         }

//         .status.processing {
//             background: #cce7ff;
//             color: #004085;
//         }

//         .payment-status {
//             text-align: center;
//             font-weight: bold;
//             padding: 4px 8px;
//             border-radius: 12px;
//             font-size: 10px;
//         }

//         .payment-status.paid {
//             background: #d1ecf1;
//             color: #0c5460;
//         }

//         .payment-status.unpaid {
//             background: #f5c6cb;
//             color: #721c24;
//         }

//         .footer {
//             margin-top: 40px;
//             padding-top: 20px;
//             border-top: 1px solid #dee2e6;
//             text-align: center;
//             font-size: 10px;
//             color: #6c757d;
//         }

//         .generated-info {
//             margin-top: 10px;
//         }

//         /* Print Styles */
//         @media print {
//             body {
//                 font-size: 10px;
//             }
            
//             .container {
//                 max-width: none;
//                 padding: 10px;
//             }

//             .header {
//                 margin-bottom: 20px;
//             }

//             .summary-section {
//                 margin-bottom: 15px;
//                 padding: 10px;
//             }

//             table {
//                 page-break-inside: avoid;
//             }

//             tr {
//                 page-break-inside: avoid;
//             }

//             .footer {
//                 position: fixed;
//                 bottom: 0;
//                 width: 100%;
//                 margin-top: 0;
//             }
//         }

//         @page {
//             margin: 1cm;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <!-- Header Section -->
//         <div class="header">
//           <div class="company-name">Ashoka Rubber Industries</div>
//           <p style="font-size: 0.75rem"> <strong> DEALERS IN RADIATOR HOSE, AIR CLEANER HOSE, OIL HOSE AND POWER STEARRING HOSE </strong> </p>
//           <p style="font-size: 0.75rem"> No. 89, Ruwanpura, Hapugasthalawa, Tel: 0776 272 994, 0779 626 642 </p>
//           <div class="document-title">Sales Orders Report</div>
//         </div>

//         <!-- Report Information -->
//         <div class="report-info">
//             <div class="report-date">Report Generated: <span id="currentDate"></span></div>
//             <div>Page 1 of 1</div>
//         </div>

//         <!-- Summary Section -->
//         <div class="summary-section">
//             <div class="summary-title">Report Summary</div>
//             <div class="summary-stats" id="summaryStats">
//                 <div class="stat-item">
//                     <div class="stat-value" id="totalOrders">0</div>
//                     <div class="stat-label">Total Orders</div>
//                 </div>
//                 <div class="stat-item">
//                     <div class="stat-value" id="totalRevenue">$0.00</div>
//                     <div class="stat-label">Total Revenue</div>
//                 </div>
//                 <div class="stat-item">
//                     <div class="stat-value" id="paidOrders">0</div>
//                     <div class="stat-label">Paid Orders</div>
//                 </div>
//                 <div class="stat-item">
//                     <div class="stat-value" id="unpaidOrders">0</div>
//                     <div class="stat-label">Unpaid Orders</div>
//                 </div>
//                 <div class="stat-item">
//                     <div class="stat-value" id="paidAmount">$0.00</div>
//                     <div class="stat-label">Paid Amount</div>
//                 </div>
//                 <div class="stat-item">
//                     <div class="stat-value" id="unpaidAmount">$0.00</div>
//                     <div class="stat-label">Outstanding Amount</div>
//                 </div>
//             </div>
//         </div>

//         <!-- Sales Orders Table -->
//         <div class="table-container">
//             <div class="table-title">Sales Orders Details</div>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Order ID</th>
//                         <th>Order Date</th>
//                         <th>Total Amount</th>
//                         <th>Status</th>
//                         <th>Payment Status</th>
//                     </tr>
//                 </thead>
//                 <tbody id="ordersTableBody">
//                     <!-- Orders will be populated dynamically -->
//                 </tbody>
//             </table>
//         </div>

//         <!-- Footer -->
//         <div class="footer">
//             <div>This report contains confidential business information</div>
//             <div class="generated-info">Generated on <span id="footerDate"></span> | Sales Order Management System</div>
//         </div>
//     </div>

//     <script>
//         // Pass data from parent window or use default sample data
//         let filteredOrders = ${JSON.stringify(ordersData)};

//         // Function to format currency
//         function formatCurrency(amount) {
//             return new Intl.NumberFormat('en-US', {
//                 style: 'currency',
//                 currency: 'LKR'
//             }).format(amount);
//         }

//         // Function to format date
//         function formatDate(dateString) {
//             const date = new Date(dateString);
//             return date.toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: '2-digit',
//                 day: '2-digit'
//             });
//         }

//         // Function to get status class and display text
//         function getStatusInfo(status) {
//             const statusMap = {
//                 'completed': { class: 'completed', text: 'Completed' },
//                 'pending': { class: 'pending', text: 'Pending' },
//                 'processing': { class: 'processing', text: 'Processing' },
//                 'cancelled': { class: 'cancelled', text: 'Cancelled' }
//             };
//             return statusMap[status.toLowerCase()] || { class: 'pending', text: status };
//         }

//         // Function to get payment status class and display text
//         function getPaymentStatusInfo(paymentStatus) {
//             const statusMap = {
//                 'paid': { class: 'paid', text: 'PAID' },
//                 'unpaid': { class: 'unpaid', text: 'UNPAID' }
//             };
//             return statusMap[paymentStatus.toLowerCase()] || { class: 'unpaid', text: 'UNPAID' };
//         }

//         // Function to populate the orders table
//         function populateOrdersTable(orders) {
//             const tbody = document.getElementById('ordersTableBody');
//             tbody.innerHTML = '';

//             orders.forEach(order => {
//                 const statusInfo = getStatusInfo(order.Status);
//                 const paymentStatusInfo = getPaymentStatusInfo(order.PaymentStatus || 'unpaid');
//                 const row = document.createElement('tr');
                
//                 row.innerHTML = \`
//                     <td class="order-id">\${order.OrderID}</td>
//                     <td>\${formatDate(order.OrderDate)}</td>
//                     <td class="amount">\${formatCurrency(order.TotalAmount)}</td>
//                     <td><span class="status \${statusInfo.class}">\${statusInfo.text}</span></td>
//                     <td><span class="payment-status \${paymentStatusInfo.class}">\${paymentStatusInfo.text}</span></td>
//                 \`;
                
//                 tbody.appendChild(row);
//             });
//         }

//         // Function to calculate and update summary statistics
//         function updateSummaryStats(orders) {
//             const totalOrders = orders.length;
//             const totalRevenue = Number(orders.reduce((sum, order) => sum + Number(order.TotalAmount), 0));
            
//             // Calculate payment statistics
//             const paidOrders = orders.filter(order => (order.PaymentStatus || '').toLowerCase() === 'paid');
//             const unpaidOrders = orders.filter(order => (order.PaymentStatus || '').toLowerCase() !== 'paid');
            
//             const paidAmount = Number(paidOrders.reduce((sum, order) => sum + Number(order.TotalAmount), 0));
//             const unpaidAmount = Number(unpaidOrders.reduce((sum, order) => sum + Number(order.TotalAmount), 0));

//             document.getElementById('totalOrders').textContent = totalOrders;
//             document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
//             document.getElementById('paidOrders').textContent = paidOrders.length;
//             document.getElementById('unpaidOrders').textContent = unpaidOrders.length;
//             document.getElementById('paidAmount').textContent = formatCurrency(paidAmount);
//             document.getElementById('unpaidAmount').textContent = formatCurrency(unpaidAmount);
//         }

//         // Function to initialize the report with data
//         function initializeReport(orders = filteredOrders) {
//             populateOrdersTable(orders);
//             updateSummaryStats(orders);
//         }

//         // Set current date
//         const now = new Date();
//         const dateString = now.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
        
//         document.getElementById('currentDate').textContent = dateString;
//         document.getElementById('footerDate').textContent = dateString;

//         // Initialize the report when the page loads
//         document.addEventListener('DOMContentLoaded', function() {
//             initializeReport();
//         });

//         // Auto-print after content loads
//         window.addEventListener('load', function() {
//             setTimeout(() => {
//                 window.print();
//                 // Optionally close after printing
//                 setTimeout(() => {
//                     window.close();
//                 }, 1000);
//             }, 500);
//         });
//     </script>
// </body>
// </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();
// };

// export default handlePrintSalesOrderTable;


// const handlePrintSalesOrderTable = (ordersData = []) => {
//     const printWindow = window.open('', '_blank');

//     printWindow.document.write(`
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Sales Order Report</title>
//     <style>
//         * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//         }

//         body {
//             font-family: 'Arial', sans-serif;
//             font-size: 14px;
//             line-height: 1.4;
//             color: #333;
//             background: #f5f5f5;
//             padding: 20px;
//         }

//         .container {
//             max-width: 800px;
//             margin: 0 auto;
//             background: white;
//             border-radius: 8px;
//             overflow: hidden;
//             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .header {
//             background: #4a7c59;
//             color: white;
//             padding: 30px;
//             text-align: left;
//         }

//         .header h1 {
//             font-size: 36px;
//             font-weight: bold;
//             margin-bottom: 10px;
//             letter-spacing: 2px;
//         }

//         .company-info {
//             font-size: 12px;
//             opacity: 0.9;
//             margin-top: 10px;
//         }

//         .content {
//             padding: 30px;
//         }

//         .invoice-details {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 40px;
//             margin-bottom: 30px;
//         }

//         .detail-section h3 {
//             font-size: 12px;
//             color: #666;
//             margin-bottom: 8px;
//             font-weight: 600;
//             text-transform: uppercase;
//         }

//         .detail-section .value {
//             font-size: 16px;
//             font-weight: 600;
//             color: #333;
//             margin-bottom: 4px;
//         }

//         .detail-section .sub-value {
//             font-size: 12px;
//             color: #666;
//             line-height: 1.3;
//         }

//         .summary-cards {
//             display: grid;
//             grid-template-columns: repeat(4, 1fr);
//             gap: 15px;
//             margin-bottom: 30px;
//             padding: 20px;
//             background-color: #f8f9fa;
//             border-radius: 8px;
//         }

//         .summary-card {
//             text-align: center;
//             padding: 15px;
//             background: white;
//             border-radius: 6px;
//             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
//         }

//         .summary-card .title {
//             font-size: 11px;
//             color: #666;
//             margin-bottom: 8px;
//             text-transform: uppercase;
//             font-weight: 600;
//             letter-spacing: 0.5px;
//         }

//         .summary-card .value {
//             font-size: 18px;
//             font-weight: bold;
//             color: #4a7c59;
//         }

//         .orders-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 30px;
//         }

//         .orders-table th {
//             background-color: #f8f9fa;
//             padding: 12px;
//             text-align: left;
//             font-weight: 600;
//             color: #333;
//             border-bottom: 2px solid #e5e7eb;
//             font-size: 12px;
//             text-transform: uppercase;
//         }

//         .orders-table td {
//             padding: 12px;
//             border-bottom: 1px solid #e5e7eb;
//             font-size: 13px;
//             color: #333;
//         }

//         .orders-table tr:hover {
//             background-color: #f8f9fa;
//         }

//         .order-id {
//             font-weight: bold;
//             color: #4a7c59;
//         }

//         .amount {
//             text-align: right;
//             font-weight: bold;
//             color: #333;
//         }

//         .status-badge {
//             padding: 4px 12px;
//             border-radius: 20px;
//             font-size: 10px;
//             font-weight: 600;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//             text-align: center;
//             display: inline-block;
//         }

//         .status-completed {
//             background-color: #d4edda;
//             color: #155724;
//         }

//         .status-pending {
//             background-color: #fff3cd;
//             color: #856404;
//         }

//         .status-processing {
//             background-color: #cce7ff;
//             color: #004085;
//         }

//         .status-cancelled {
//             background-color: #f8d7da;
//             color: #721c24;
//         }

//         .payment-paid {
//             background-color: #d1ecf1;
//             color: #0c5460;
//         }

//         .payment-unpaid {
//             background-color: #f5c6cb;
//             color: #721c24;
//         }

//         .totals-section {
//             margin-top: 30px;
//             padding: 20px;
//             background-color: #f8f9fa;
//             border-radius: 8px;
//         }

//         .totals-row {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 8px;
//             font-size: 14px;
//             padding: 5px 0;
//         }

//         .totals-row.subtotal {
//             font-weight: 600;
//         }

//         .totals-row.total {
//             margin-top: 10px;
//             padding-top: 10px;
//             border-top: 2px solid #4a7c59;
//             font-weight: bold;
//             font-size: 16px;
//             color: #4a7c59;
//         }

//         .thank-you {
//             margin-top: 30px;
//             text-align: center;
//             padding: 20px;
//         }

//         .thank-you h2 {
//             font-size: 24px;
//             color: #4a7c59;
//             font-weight: bold;
//             margin-bottom: 10px;
//         }

//         .thank-you p {
//             color: #666;
//             font-size: 12px;
//             line-height: 1.5;
//             max-width: 600px;
//             margin: 0 auto;
//         }

//         .footer {
//             margin-top: 30px;
//             padding-top: 20px;
//             border-top: 1px solid #e5e7eb;
//             text-align: center;
//             color: #999;
//             font-size: 10px;
//         }

//         @media print {
//             body { 
//                 background-color: white;
//                 padding: 0;
//             }
//             .container {
//                 box-shadow: none;
//                 max-width: none;
//             }
//             .summary-cards {
//                 grid-template-columns: repeat(4, 1fr);
//             }
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="header">
//             <h1>INVOICE</h1>
//             <div class="company-info">
//                 <strong>Ashoka Rubber Industries</strong><br>
//                 DEALERS IN RADIATOR HOSE, AIR CLEANER HOSE, OIL HOSE AND POWER STEERING HOSE<br>
//                 No. 89, Ruwanpura, Hapugasthalawa<br>
//                 Tel: 0776 272 994, 0779 626 642
//             </div>
//         </div>
        
//         <div class="content">
//             <div class="invoice-details">
//                 <div class="detail-section">
//                     <h3>Report Date</h3>
//                     <div class="value" id="reportDate"></div>
//                 </div>
//                 <div class="detail-section">
//                     <h3>Report Type</h3>
//                     <div class="value">Sales Orders Report</div>
//                     <div class="sub-value">Comprehensive sales analysis</div>
//                 </div>
//             </div>
            
//             <div class="summary-cards">
//                 <div class="summary-card">
//                     <div class="title">Total Orders</div>
//                     <div class="value" id="totalOrders">0</div>
//                 </div>
//                 <div class="summary-card">
//                     <div class="title">Total Revenue</div>
//                     <div class="value" id="totalRevenue">LKR 0.00</div>
//                 </div>
//                 <div class="summary-card">
//                     <div class="title">Paid Orders</div>
//                     <div class="value" id="paidOrders">0</div>
//                 </div>
//                 <div class="summary-card">
//                     <div class="title">Outstanding</div>
//                     <div class="value" id="unpaidAmount">LKR 0.00</div>
//                 </div>
//             </div>
            
//             <table class="orders-table">
//                 <thead>
//                     <tr>
//                         <th>Order ID</th>
//                         <th>Order Date</th>
//                         <th>Total Amount</th>
//                         <th>Status</th>
//                         <th>Payment Status</th>
//                     </tr>
//                 </thead>
//                 <tbody id="ordersTableBody">
//                     <!-- Orders will be populated dynamically -->
//                 </tbody>
//             </table>
            
//             <div class="totals-section">
//                 <div class="totals-row total">
//                     <span>TOTAL</span>
//                     <span id="totalAmount">LKR 0.00</span>
//                 </div>
//             </div>
            
//             <div class="thank-you">
//                 <h2>THANK YOU!</h2>
//                 <p>This report summarizes all sales orders for the specified period. All amounts are calculated based on the order totals and current payment status. For any questions regarding specific orders, please contact our sales department.</p>
//             </div>
            
//             <div class="footer">
//                 <p>Sales Orders Report | Generated on <span id="footerDate"></span></p>
//                 <p>Ashoka Rubber Industries | Professional Sales Management</p>
//             </div>
//         </div>
//     </div>

//     <script>
//         // Pass data from parent window or use default sample data
//         let filteredOrders = ${JSON.stringify(ordersData)};

//         // Function to format currency
//         function formatCurrency(amount) {
//             return new Intl.NumberFormat('en-LK', {
//                 style: 'currency',
//                 currency: 'LKR',
//                 minimumFractionDigits: 2
//             }).format(amount);
//         }

//         // Function to format date
//         function formatDate(dateString) {
//             const date = new Date(dateString);
//             return date.toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: '2-digit',
//                 day: '2-digit'
//             });
//         }

//         // Function to get status class and display text
//         function getStatusInfo(status) {
//             const statusMap = {
//                 'completed': { class: 'status-completed', text: 'Completed' },
//                 'pending': { class: 'status-pending', text: 'Pending' },
//                 'processing': { class: 'status-processing', text: 'Processing' },
//                 'cancelled': { class: 'status-cancelled', text: 'Cancelled' }
//             };
//             return statusMap[status.toLowerCase()] || { class: 'status-pending', text: status };
//         }

//         // Function to get payment status class and display text
//         function getPaymentStatusInfo(paymentStatus) {
//             const statusMap = {
//                 'paid': { class: 'payment-paid', text: 'PAID' },
//                 'unpaid': { class: 'payment-unpaid', text: 'UNPAID' }
//             };
//             return statusMap[paymentStatus.toLowerCase()] || { class: 'payment-unpaid', text: 'UNPAID' };
//         }

//         // Function to populate the orders table
//         function populateOrdersTable(orders) {
//             const tbody = document.getElementById('ordersTableBody');
//             tbody.innerHTML = '';

//             orders.forEach(order => {
//                 const statusInfo = getStatusInfo(order.Status);
//                 const paymentStatusInfo = getPaymentStatusInfo(order.PaymentStatus || 'unpaid');
//                 const row = document.createElement('tr');
                
//                 row.innerHTML = \`
//                     <td class="order-id">\${order.OrderID}</td>
//                     <td>\${formatDate(order.OrderDate)}</td>
//                     <td class="amount">\${formatCurrency(order.TotalAmount)}</td>
//                     <td><span class="status-badge \${statusInfo.class}">\${statusInfo.text}</span></td>
//                     <td><span class="status-badge \${paymentStatusInfo.class}">\${paymentStatusInfo.text}</span></td>
//                 \`;
                
//                 tbody.appendChild(row);
//             });
//         }

//         // Function to calculate and update summary statistics
//         function updateSummaryStats(orders) {
//             const totalOrders = orders.length;
//             const totalRevenue = orders.reduce((sum, order) => sum + Number(order.TotalAmount), 0);
            
//             // Calculate payment statistics
//             const paidOrders = orders.filter(order => (order.PaymentStatus || '').toLowerCase() === 'paid');
//             const unpaidOrders = orders.filter(order => (order.PaymentStatus || '').toLowerCase() !== 'paid');
            
//             const paidAmount = paidOrders.reduce((sum, order) => sum + Number(order.TotalAmount), 0);
//             const unpaidAmount = unpaidOrders.reduce((sum, order) => sum + Number(order.TotalAmount), 0);

//             // Update summary cards
//             document.getElementById('totalOrders').textContent = totalOrders;
//             document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
//             document.getElementById('paidOrders').textContent = paidOrders.length;
//             document.getElementById('unpaidAmount').textContent = formatCurrency(unpaidAmount);

//             // Update totals section
//             const subtotal = totalRevenue;
//             const total = subtotal;

//             document.getElementById('subtotalAmount').textContent = formatCurrency(subtotal);
//             document.getElementById('taxAmount').textContent = formatCurrency(tax);
//             document.getElementById('totalAmount').textContent = formatCurrency(totalRevenue);
//         }

//         // Function to initialize the report with data
//         function initializeReport(orders = filteredOrders) {
//             populateOrdersTable(orders);
//             updateSummaryStats(orders);
//         }

//         // Set current date
//         const now = new Date();
//         const dateString = now.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
        
//         document.getElementById('reportDate').textContent = dateString;
//         document.getElementById('footerDate').textContent = dateString;

//         // Initialize the report when the page loads
//         document.addEventListener('DOMContentLoaded', function() {
//             initializeReport();
//         });

//         // Auto-print after content loads
//         window.addEventListener('load', function() {
//             setTimeout(() => {
//                 window.print();
//                 // Optionally close after printing
//                 setTimeout(() => {
//                     window.close();
//                 }, 1000);
//             }, 500);
//         });
//     </script>
// </body>
// </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();
// };

// export default handlePrintSalesOrderTable;

const handlePrintSalesOrderTable = (ordersData = []) => {
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales Order Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: #4a7c59;
            color: white;
            padding: 30px;
            text-align: left;
        }

        .header h1 {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }

        .company-info {
            font-size: 12px;
            opacity: 0.9;
            margin-top: 10px;
        }

        .content {
            padding: 30px;
        }

        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 30px;
        }

        .detail-section h3 {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .detail-section .value {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }

        .detail-section .sub-value {
            font-size: 12px;
            color: #666;
            line-height: 1.3;
        }

        .summary-cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }

        .summary-card {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .summary-card .title {
            font-size: 11px;
            color: #666;
            margin-bottom: 8px;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .summary-card .value {
            font-size: 18px;
            font-weight: bold;
            color: #4a7c59;
        }

        .orders-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .orders-table th {
            background-color: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #e5e7eb;
            font-size: 12px;
            text-transform: uppercase;
        }

        .orders-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 13px;
            color: #333;
        }

        .orders-table tr:hover {
            background-color: #f8f9fa;
        }

        .order-id {
            font-weight: bold;
            color: #4a7c59;
        }

        .amount {
            text-align: right;
            font-weight: bold;
            color: #333;
        }

        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
            display: inline-block;
        }

        .status-completed {
            background-color: #d4edda;
            color: #155724;
        }

        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }

        .status-processing {
            background-color: #cce7ff;
            color: #004085;
        }

        .status-cancelled {
            background-color: #f8d7da;
            color: #721c24;
        }

        .payment-paid {
            background-color: #d1ecf1;
            color: #0c5460;
        }

        .payment-unpaid {
            background-color: #f5c6cb;
            color: #721c24;
        }

        .totals-section {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }

        .totals-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
            padding: 5px 0;
        }

        .totals-row.total {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #4a7c59;
            font-weight: bold;
            font-size: 16px;
            color: #4a7c59;
        }

        .thank-you {
            margin-top: 30px;
            text-align: center;
            padding: 20px;
        }

        .thank-you h2 {
            font-size: 24px;
            color: #4a7c59;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .thank-you p {
            color: #666;
            font-size: 12px;
            line-height: 1.5;
            max-width: 600px;
            margin: 0 auto;
        }

        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #999;
            font-size: 10px;
        }

        @media print {
            body { 
                background-color: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
                max-width: none;
            }
            .summary-cards {
                grid-template-columns: repeat(4, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>INVOICE</h1>
            <div class="company-info">
                <strong>Ashoka Rubber Industries</strong><br>
                DEALERS IN RADIATOR HOSE, AIR CLEANER HOSE, OIL HOSE AND POWER STEERING HOSE<br>
                No. 89, Ruwanpura, Hapugasthalawa<br>
                Tel: 0776 272 994, 0779 626 642
            </div>
        </div>
        
        <div class="content">
            <div class="invoice-details">
                <div class="detail-section">
                    <h3>Report Date</h3>
                    <div class="value" id="reportDate"></div>
                </div>
                <div class="detail-section">
                    <h3>Report Type</h3>
                    <div class="value">Sales Orders Report</div>
                    <div class="sub-value">Comprehensive sales analysis</div>
                </div>
            </div>
            
            <div class="summary-cards">
                <div class="summary-card">
                    <div class="title">Total Orders</div>
                    <div class="value" id="totalOrders">0</div>
                </div>
                <div class="summary-card">
                    <div class="title">Total Revenue</div>
                    <div class="value" id="totalRevenue">LKR 0.00</div>
                </div>
                <div class="summary-card">
                    <div class="title">Paid Orders</div>
                    <div class="value" id="paidOrders">0</div>
                </div>
                <div class="summary-card">
                    <div class="title">Outstanding</div>
                    <div class="value" id="unpaidAmount">LKR 0.00</div>
                </div>
            </div>
            
            <table class="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Payment Status</th>
                    </tr>
                </thead>
                <tbody id="ordersTableBody">
                    <!-- Orders will be populated dynamically -->
                </tbody>
            </table>
            
            <div class="totals-section">
                <div class="totals-row total">
                    <span>TOTAL</span>
                    <span id="totalAmount">LKR 0.00</span>
                </div>
            </div>
            
            <div class="thank-you">
                <h2>THANK YOU!</h2>
                <p>This report summarizes all sales orders for the specified period. All amounts are calculated based on the order totals and current payment status. For any questions regarding specific orders, please contact our sales department.</p>
            </div>
            
            <div class="footer">
                <p>Sales Orders Report | Generated on <span id="footerDate"></span></p>
                <p>Ashoka Rubber Industries | Professional Sales Management</p>
            </div>
        </div>
    </div>

    <script>
        // Pass data from parent window or use default sample data
        let filteredOrders = ${JSON.stringify(ordersData)};

        // Function to format currency
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-LK', {
                style: 'currency',
                currency: 'LKR',
                minimumFractionDigits: 2
            }).format(amount);
        }

        // Function to format date
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        }

        // Function to get status class and display text
        function getStatusInfo(status) {
            const statusMap = {
                'completed': { class: 'status-completed', text: 'Completed' },
                'pending': { class: 'status-pending', text: 'Pending' },
                'processing': { class: 'status-processing', text: 'Processing' },
                'cancelled': { class: 'status-cancelled', text: 'Cancelled' }
            };
            return statusMap[status.toLowerCase()] || { class: 'status-pending', text: status };
        }

        // Function to get payment status class and display text
        function getPaymentStatusInfo(paymentStatus) {
            const statusMap = {
                'paid': { class: 'payment-paid', text: 'PAID' },
                'unpaid': { class: 'payment-unpaid', text: 'UNPAID' }
            };
            return statusMap[paymentStatus.toLowerCase()] || { class: 'payment-unpaid', text: 'UNPAID' };
        }

        // Function to populate the orders table
        function populateOrdersTable(orders) {
            const tbody = document.getElementById('ordersTableBody');
            tbody.innerHTML = '';

            orders.forEach(order => {
                const statusInfo = getStatusInfo(order.Status);
                const paymentStatusInfo = getPaymentStatusInfo(order.PaymentStatus || 'unpaid');
                const row = document.createElement('tr');
                
                row.innerHTML = \`
                    <td class="order-id">\${order.OrderID}</td>
                    <td>\${formatDate(order.OrderDate)}</td>
                    <td class="amount">\${formatCurrency(order.TotalAmount)}</td>
                    <td><span class="status-badge \${statusInfo.class}">\${statusInfo.text}</span></td>
                    <td><span class="status-badge \${paymentStatusInfo.class}">\${paymentStatusInfo.text}</span></td>
                \`;
                
                tbody.appendChild(row);
            });
        }

        // Function to calculate and update summary statistics
        function updateSummaryStats(orders) {
            const totalOrders = orders.length;
            const totalRevenue = orders.reduce((sum, order) => sum + Number(order.TotalAmount), 0);
            
            // Calculate payment statistics
            const paidOrders = orders.filter(order => (order.PaymentStatus || '').toLowerCase() === 'paid');
            const unpaidOrders = orders.filter(order => (order.PaymentStatus || '').toLowerCase() !== 'paid');
            
            const unpaidAmount = unpaidOrders.reduce((sum, order) => sum + Number(order.TotalAmount), 0);

            // Update summary cards
            document.getElementById('totalOrders').textContent = totalOrders;
            document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
            document.getElementById('paidOrders').textContent = paidOrders.length;
            document.getElementById('unpaidAmount').textContent = formatCurrency(unpaidAmount);

            // Update totals section
            document.getElementById('totalAmount').textContent = formatCurrency(totalRevenue);
        }

        // Function to initialize the report with data
        function initializeReport(orders = filteredOrders) {
            populateOrdersTable(orders);
            updateSummaryStats(orders);
        }

        // Set current date
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('reportDate').textContent = dateString;
        document.getElementById('footerDate').textContent = dateString;

        // Initialize the report when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            initializeReport();
        });

        // Auto-print after content loads
        window.addEventListener('load', function() {
            setTimeout(() => {
                window.print();
                // Optionally close after printing
                setTimeout(() => {
                    window.close();
                }, 1000);
            }, 500);
        });
    </script>
</body>
</html>
    `);

    printWindow.document.close();
    printWindow.focus();
};

export default handlePrintSalesOrderTable;