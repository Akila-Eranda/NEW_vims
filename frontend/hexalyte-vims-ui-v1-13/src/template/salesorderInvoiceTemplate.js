function generateSalesOrderInvoice(orderInfo) {

    return (`
        <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Invoice</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.4/dist/tailwind.min.css" rel="stylesheet">
        <style>
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body class="p-8 bg-white text-gray-800">
        <div class="max-w-3xl mx-auto border p-6 rounded shadow">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h1 class="text-2xl font-bold">Sales Invoice</h1>
              <p class="text-sm">Invoice #: ${invoiceNumber}</p>
              <p class="text-sm">Order #: ${orderNumber}</p>
              <p class="text-sm">Date: ${orderDate}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold">${company.name}</p>
              <p class="text-sm">${company.address}</p>
              <p class="text-sm">${company.location}</p>
            </div>
          </div>

          <div class="mb-4">
            <p><strong>Bill To:</strong> ${customer.name}</p>
            <p>${customer.address}</p>
            <p>${customer.location}</p>
          </div>

          <table class="w-full text-sm border-t border-b border-gray-300 mb-4">
            <thead>
              <tr class="text-left border-b">
                <th class="py-2">Item</th>
                <th class="py-2">Qty</th>
                <th class="py-2">Price</th>
                <th class="py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <div class="text-right space-y-1">
            <p><strong>Subtotal:</strong> LKR ${subtotal.toLocaleString()}</p>
            <p><strong>Tax:</strong> LKR ${tax.toLocaleString()}</p>
            <p class="text-xl font-bold mt-2">Total: LKR ${total.toLocaleString()}</p>
          </div>

          <p class="text-center text-xs mt-8 text-gray-500">Thank you for your business!</p>
        </div>
      </body>
      </html>
        `)

}