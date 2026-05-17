import React, { useEffect, useRef } from 'react'

function SalesInvoiceIframe({ orderInfo, salesItems }) {

    const iframeRef = useRef(null)

    function handlePrint() {
        const iframe = iframeRef.current
        if (iframe) {
            iframe.contentWindow.focus()
            iframe.contentWindow.print()
        }
    }

    function generateSalesInvoiceHTML() {

        const { OrderID, OrderDate, TotalAmount, Status } = orderInfo

        let itemRows = salesItems.map((salesItem) => (
            `<tr class="border-b">
                <td class="py-2">${salesItem.ProductId}</td>
                <td class="py-2">${salesItem.Quantity}</td>
                <td class="py-2">LKR ${salesItem.UnitPrice.toLocaleString()}</td>
                <td class="py-2">LKR ${(salesItem.Quantity * salesItem.UnitPrice).toLocaleString()}</td>
            </tr>`
        ))

        return `
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
                <p class="text-sm">Order #: ${OrderID}</p>
                <p class="text-sm">Date: ${OrderDate}</p>
              </div>
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
              ${
                itemRows
              }
            </tbody>
          </table>

          <div class="text-right space-y-1">
            <p class="text-xl font-bold mt-2">Total: LKR ${TotalAmount.toLocaleString()}</p>
          </div>

          <p class="text-center text-xs mt-8 text-gray-500">Thank you for your business!</p>
        </div>
      </body>
      </html>
        `

    }

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe) {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(generateSalesInvoiceHTML());
            doc.close();
        }
    }, [orderInfo])

    return (
        <>
            <div className="p-4 space-y-4">
                <button
                    onClick={() => handlePrint()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Print Invoice
                </button>
                <iframe
                    ref={iframeRef}
                    title={`Sales Invoice - ${orderInfo.OrderID}`}
                    className="w-full h-[700px] border rounded"
                />
            </div>
        </>
    )
}

export default SalesInvoiceIframe