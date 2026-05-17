/**
 * Complete Android Thermal Printer Solution
 * - Works on Android Chrome
 * - Attempts direct Bluetooth printing
 * - Falls back to browser printing if needed
 * - No specific UUIDs or parameters
 * - Single file with everything needed
 */

import React from "react";

// Format a receipt with the given order and items
function formatReceiptText(order, orderItems) {
  let text = '';
  
  // Header
  text += '      OIL AFCO\n';
  text += 'DS LANKA FOODS-KANDY/ITN-32 CASH\n';
  text += '     TEL: 077-2222194\n';
  text += '--------------------------------\n';
  text += '           INVOICE\n';
  text += '--------------------------------\n';
  
  // Order details
  const now = new Date();
  text += `Date: ${now.toLocaleDateString()}\n`;
  text += `Time: ${now.toLocaleTimeString()}\n`;
  text += `Invoice #: ${order?.OrderID || '12345'}\n`;
  
  // Payment info if available
  if (order?.paymentType) {
    text += `Payment: ${order.paymentType}\n`;
  }
  
  text += '--------------------------------\n';
  text += 'ITEM               QTY    PRICE    TOTAL\n';
  text += '--------------------------------\n';
  
  // Items
  if (orderItems && orderItems.length > 0) {
    orderItems.forEach((item, index) => {
      // Item name with index
      text += `${index + 1}. ${item.Name}\n`;
      
      // Align quantities and prices
      const quantity = item.Quantity || 0;
      const price = (item.UnitPrice || 0).toFixed(2);
      const total = (quantity * (item.UnitPrice || 0)).toFixed(2);
      
      // Add spaces for alignment (crude but works)
      text += `                  ${quantity}     ${price}    ${total}\n`;
    });
  } else {
    text += 'No items\n';
  }
  
  // Totals section
  text += '--------------------------------\n';
  
  // Subtotal
  const subtotal = (order?.TotalAmount || 0).toFixed(2);
  text += `SUBTOTAL:                    ${subtotal}\n`;
  
  // Discount if available
  if (order?.Discount) {
    const discount = (order.Discount || 0).toFixed(2);
    text += `DISCOUNT:                    ${discount}\n`;
  }
  
  // VAT/Tax
  const vat = ((order?.TotalAmount || 0) * 0.08).toFixed(2);
  text += `VAT (8%):                    ${vat}\n`;
  
  // Final Total
  text += '--------------------------------\n';
  const total = (order?.TotalAmount || 0).toFixed(2);
  text += `TOTAL:                       ${total}\n`;
  text += '--------------------------------\n';
  
  // Footer
  text += '\n';
  text += '       Thank you for your purchase!\n';
  text += '       PATRON BASE POINT(CAPPED BLUE)\n';
  
  // Add extra lines for paper cutting
  text += '\n\n\n\n';
  
  return text;
}

// Print via browser (fallback method)
function printViaBrowser(receiptText) {
  // Create a popup window
  const printWindow = window.open('', 'Print Receipt', 'height=600,width=300');
  
  if (!printWindow) {
    alert('Please allow pop-ups to print');
    return false;
  }
  
  // Write content to the window
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 0mm;
          }
          body {
            font-family: monospace;
            white-space: pre;
            font-size: 12px;
            line-height: 1.2;
            padding: 0;
            margin: 0;
            width: 80mm;
          }
        </style>
      </head>
      <body>
        ${receiptText}
        <script>
          // Print automatically
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 1000);
          };
        </script>
      </body>
    </html>
  `);
  
  return true;
}

// Main printer function
async function printReceipt(order, orderItems) {
  // Format the receipt text
  const receiptText = formatReceiptText(order, orderItems);
  
  // Check if Bluetooth is available
  if (!navigator.bluetooth) {
    console.log('Bluetooth API not available, using fallback');
    return {
      success: false,
      fallbackPrinted: printViaBrowser(receiptText),
      message: 'Bluetooth not supported in this browser, used fallback'
    };
  }
  
  try {
    // Check Bluetooth availability
    const isBluetoothAvailable = await navigator.bluetooth.getAvailability();
    if (!isBluetoothAvailable) {
      console.log('Bluetooth not available, using fallback');
      alert('Please enable Bluetooth on your device.');
      
      return {
        success: false,
        fallbackPrinted: printViaBrowser(receiptText),
        message: 'Bluetooth not enabled, used fallback'
      };
    }
    
    // Request user to select a Bluetooth device
    console.log('Requesting Bluetooth device...');
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true
    });
    
    console.log('Device selected:', device.name || 'Unnamed device');
    
    // Connect to the device
    console.log('Connecting to GATT server...');
    const server = await device.gatt.connect();
    
    // Get all available services
    console.log('Getting services...');
    const services = await server.getPrimaryServices();
    console.log(`Found ${services.length} services`);
    
    if (services.length === 0) {
      throw new Error('No services found on this device');
    }
    
    // Try to find a writable characteristic in any service
    let foundChar = null;
    
    for (const service of services) {
      try {
        console.log(`Trying service: ${service.uuid}`);
        const characteristics = await service.getCharacteristics();
        
        // Log all characteristics
        for (const char of characteristics) {
          console.log(`  Characteristic: ${char.uuid}`);
          console.log(`    Properties: write=${char.properties.write}, writeWithoutResponse=${char.properties.writeWithoutResponse}`);
          
          // Look for a writable characteristic
          if (char.properties.write || char.properties.writeWithoutResponse) {
            foundChar = char;
            console.log(`  Found writable characteristic: ${char.uuid}`);
            break;
          }
        }
        
        if (foundChar) break;
      } catch (serviceError) {
        console.log(`Error with service ${service.uuid}:, serviceError`);
      }
    }
    
    if (!foundChar) {
      throw new Error('No writable characteristic found');
    }
    
    // Prepare the print data
    console.log('Preparing print data...');
    const encoder = new TextEncoder();
    
    // ESC/POS commands
    const initCommand = new Uint8Array([0x1B, 0x40]); // ESC @ - Initialize printer
    const textData = encoder.encode(receiptText);
    const cutCommand = new Uint8Array([0x1D, 0x56, 0x41, 0x10]); // GS V A 16 - Cut paper
    
    // Helper function to write data in chunks
    async function writeChunks(data) {
      const CHUNK_SIZE = 20; // Small chunks work better for most printers
      
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE);
        console.log(`Sending chunk ${Math.floor(i/CHUNK_SIZE) + 1}/${Math.ceil(data.length/CHUNK_SIZE)}`);
        
        // Use the appropriate write method
        if (foundChar.properties.writeWithoutResponse) {
          await foundChar.writeValueWithoutResponse(chunk);
        } else {
          await foundChar.writeValue(chunk);
        }
        
        // Add a delay between chunks to prevent buffer overflow
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Send the print job in sequence
    console.log('Sending data to printer...');
    
    // 1. Initialize printer
    await writeChunks(initCommand);
    
    // 2. Send the receipt text
    await writeChunks(textData);
    
    // 3. Cut the paper
    await writeChunks(cutCommand);
    
    console.log('Print data sent successfully');
    return {
      success: true,
      message: 'Receipt printed successfully'
    };
    
  } catch (error) {
    console.error('Bluetooth printing error:', error);
    
    // Show error and offer fallback
    const useFallback = window.confirm(`Could not print via Bluetooth:\n${error.message}\n\nWould you like to print via browser instead?`);
    
    if (useFallback) {
      return {
        success: false,
        fallbackPrinted: printViaBrowser(receiptText),
        message: 'Used browser print dialog after Bluetooth error: ' + error.message
      };
    }
    
    return {
      success: false,
      message: 'Printing cancelled: ' + error.message
    };
  }
}

// Example React component that you can use
function PrintReceiptButton({ order, orderItems }) {
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  
  const handlePrint = async () => {
    setIsPrinting(true);
    setStatus('Connecting to printer...');
    
    try {
      const result = await printReceipt(order, orderItems);
      
      if (result.success) {
        setStatus('Printed successfully');
      } else if (result.fallbackPrinted) {
        setStatus('Printed via browser');
      } else {
        setStatus('Print failed: ' + result.message);
      }
    } catch (error) {
      setStatus('Error: ' + error.message);
    } finally {
      setTimeout(() => {
        setIsPrinting(false);
        // Clear status after 3 seconds
        setTimeout(() => setStatus(null), 3000);
      }, 1000);
    }
  };
  
  return React.createElement('div', { style: { position: 'relative' } },
    status && React.createElement('div', {
      style: {
        position: 'absolute',
        top: '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '14px'
      }
    }, status),
    React.createElement('button', {
      onClick: handlePrint,
      disabled: isPrinting,
      style: {
        backgroundColor: isPrinting ? '#cccccc' : '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: isPrinting ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, isPrinting ? 'Printing...' : 'Print Receipt')
  );
}

// For vanilla JS usage (non-React)
function createPrintButton(containerId, order, orderItems) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const button = document.createElement('button');
  button.innerText = 'Print Receipt';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.padding = '10px 15px';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  button.style.fontWeight = 'bold';
  
  const statusDiv = document.createElement('div');
  statusDiv.style.marginTop = '10px';
  statusDiv.style.display = 'none';
  
  container.appendChild(button);
  container.appendChild(statusDiv);
  
  button.addEventListener('click', async () => {
    // Disable button and show status
    button.disabled = true;
    button.style.backgroundColor = '#cccccc';
    button.style.cursor = 'not-allowed';
    button.innerText = 'Printing...';
    
    statusDiv.style.display = 'block';
    statusDiv.innerText = 'Connecting to printer...';
    
    try {
      const result = await printReceipt(order, orderItems);
      
      if (result.success) {
        statusDiv.innerText = 'Printed successfully';
      } else if (result.fallbackPrinted) {
        statusDiv.innerText = 'Printed via browser';
      } else {
        statusDiv.innerText = 'Print failed: ' + result.message;
      }
    } catch (error) {
      statusDiv.innerText = 'Error: ' + error.message;
    } finally {
      // Re-enable button after delay
      setTimeout(() => {
        button.disabled = false;
        button.style.backgroundColor = '#4CAF50';
        button.style.cursor = 'pointer';
        button.innerText = 'Print Receipt';
        
        // Hide status after delay
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 3000);
      }, 1000);
    }
  });
}

// Export functions for usage
// If using in browser directly without a module system, remove this export
export { printReceipt, PrintReceiptButton, createPrintButton };