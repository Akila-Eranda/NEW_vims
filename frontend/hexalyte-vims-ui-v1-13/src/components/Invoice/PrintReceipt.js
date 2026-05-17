// import { Printer, Text, Line, Row, render } from 'react-thermal-printer';
// import React from 'react';

// /**
//  * Request all permissions needed for printing
//  */
// const requestPermissions = async () => {
//   try {
//     // Check for Bluetooth availability - this will trigger the permission prompt if needed
//     if (navigator.bluetooth) {
//       const isAvailable = await navigator.bluetooth.getAvailability();
//       console.log('Bluetooth available:', isAvailable);

//       // If Bluetooth is not available, we'll return true anyway and use fallback methods
//       if (!isAvailable) {
//         console.warn('Bluetooth not available on this device');
//       }
//     } else {
//       console.warn('Web Bluetooth API not supported');
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error('Error requesting permissions:', error);
//     return false;
//   }
// };

// /**
//  * Show instructions for enabling Bluetooth
//  */
// const showBluetoothInstructions = () => {
//   // Create a modal element
//   const modal = document.createElement('div');
//   modal.style.position = 'fixed';
//   modal.style.top = '0';
//   modal.style.left = '0';
//   modal.style.right = '0';
//   modal.style.bottom = '0';
//   modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
//   modal.style.zIndex = '9999';
//   modal.style.display = 'flex';
//   modal.style.justifyContent = 'center';
//   modal.style.alignItems = 'center';
//   modal.style.fontFamily = 'Arial, sans-serif';

//   // Add instructions content
//   modal.innerHTML = `
//     <div style="background: white; padding: 20px; max-width: 90%; max-height: 90%; overflow-y: auto; border-radius: 8px;">
//       <h2 style="color: #333; margin-top: 0;">Bluetooth Permission Required</h2>
//       <p>To print to a Bluetooth printer, the browser needs Bluetooth permission. Follow these steps:</p>
      
//       <ol style="padding-left: 20px; line-height: 1.5;">
//         <li>Open Browser Settings</li>
//         <li>Go to Settings → Site Settings</li>
//         <li>Look for Bluetooth</li>
//         <li>Make sure it's set to "Ask first"</li>
//         <li>Return to this page and try again</li>
//       </ol>
      
//       <p style="margin-top: 20px;"><strong>Alternative method:</strong></p>
//       <ol style="padding-left: 20px; line-height: 1.5;">
//         <li>Type <code style="background: #f0f0f0; padding: 2px 4px;">chrome://flags</code> in browser address bar</li>
//         <li>Search for "bluetooth"</li>
//         <li>Enable "Web Bluetooth" and "Experimental Web Platform features"</li>
//         <li>Restart browser and try again</li>
//       </ol>
      
//       <div style="margin-top: 30px; display: flex; justify-content: space-between;">
//         <button id="use-fallback-btn" style="padding: 10px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; font-weight: bold;">Use Browser Print Instead</button>
//         <button id="close-instructions-btn" style="padding: 10px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; font-weight: bold;">I'll Try Again</button>
//       </div>
//     </div>
//   `;

//   // Add to body
//   document.body.appendChild(modal);

//   // Return a promise that resolves when user makes a choice
//   return new Promise((resolve) => {
//     document.getElementById('close-instructions-btn').addEventListener('click', () => {
//       document.body.removeChild(modal);
//       resolve('retry');
//     });

//     document.getElementById('use-fallback-btn').addEventListener('click', () => {
//       document.body.removeChild(modal);
//       resolve('fallback');
//     });
//   });
// };

// /**
//  * Checks if the application is running in an environment that supports direct printing
//  */
// const checkEnvironment = () => {
//   const issues = [];
//   const supportsBluetooth = !!navigator.bluetooth;
//   const supportsSerial = !!navigator.serial;

//   // Check if we're in a browser environment
//   if (typeof window === 'undefined' || typeof navigator === 'undefined') {
//     issues.push('Running on a server or deployed environment');
//     return { supported: false, supportsBluetooth: false, supportsSerial: false, issues };
//   }

//   // Check if Web Serial API is supported
//   if (!supportsSerial) {
//     issues.push('Browser does not support Web Serial API');
//   }

//   // Check if Web Bluetooth API is supported
//   if (!supportsBluetooth) {
//     issues.push('Browser does not support Web Bluetooth API');
//   }

//   // Check if running in a secure context (HTTPS)
//   if (!window.isSecureContext) {
//     issues.push('Not running in a secure context (HTTPS)');
//   }

//   // Determine if any printing method is supported
//   const supported = supportsBluetooth || supportsSerial;

//   return {
//     supported,
//     supportsBluetooth,
//     supportsSerial,
//     issues
//   };
// };

// /**
//  * Helper function to pad right with spaces
//  */
// const padRight = (text, length) => {
//   text = String(text || "");
//   return text.padEnd(length);
// };

// /**
//  * Helper function to pad left with spaces
//  */
// const padLeft = (text, length) => {
//   text = String(text || "");
//   return text.padStart(length);
// };

// /**
//  * Helper function to concatenate multiple Uint8Arrays
//  */
// const concatArrays = (arrays) => {
//   // Calculate total length
//   const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);

//   // Create a new array with the total length
//   const result = new Uint8Array(totalLength);

//   // Copy each array into the result
//   let offset = 0;
//   arrays.forEach(arr => {
//     result.set(arr, offset);
//     offset += arr.length;
//   });

//   return result;
// };

// /**
//  * Generates ESC/POS commands for A5 receipt format (148mm x 210mm)
//  */
// const generateESCPOSCommands = (order, orderItems, customerInfo, customerAddress, products) => {
//   const encoder = new TextEncoder();
//   const commands = [];

//   // --- Initialization ---
//   commands.push(new Uint8Array([0x1B, 0x40])); // ESC @ - Initialize printer
  
//   // Set page mode for A5 paper (148mm width ≈ 420 dots at 180 DPI)
//   commands.push(new Uint8Array([0x1B, 0x4C])); // ESC L - Set page mode
//   commands.push(new Uint8Array([0x1D, 0x50, 0xA4, 0x01, 0x68, 0x02])); // Set print area for A5

//   // --- Header Section ---
//   commands.push(new Uint8Array([0x1B, 0x61, 0x01])); // ESC a 1 (center alignment)
//   commands.push(new Uint8Array([0x1B, 0x21, 0x30])); // Large bold text
//   commands.push(encoder.encode("OIL AFCO\n"));
  
//   commands.push(new Uint8Array([0x1B, 0x21, 0x00])); // Normal text size
//   commands.push(encoder.encode("DS LANKA FOODS-KANDY/ITN-32 CASH\n"));
//   commands.push(encoder.encode("TEL: 077-2222194\n\n"));

//   // Invoice title with border
//   commands.push(new Uint8Array([0x1B, 0x21, 0x20])); // Double height
//   commands.push(encoder.encode("════════════════════════════════════════════════════════\n"));
//   commands.push(encoder.encode("                         INVOICE\n"));
//   commands.push(encoder.encode("════════════════════════════════════════════════════════\n\n"));

//   // --- Invoice Details Section ---
//   commands.push(new Uint8Array([0x1B, 0x61, 0x00])); // Left alignment
//   commands.push(new Uint8Array([0x1B, 0x21, 0x00])); // Normal text
  
//   const dateTime = new Date().toLocaleDateString('en-GB', {
//     year: 'numeric', month: '2-digit', day: '2-digit',
//     hour: '2-digit', minute: '2-digit'
//   });
  
//   // Two column layout for invoice details
//   commands.push(encoder.encode(`Invoice No: ${padRight(order?.OrderID || "INV001", 20)} Date: ${dateTime}\n`));
//   commands.push(encoder.encode(`Payment: ${padRight(order?.paymentType || "Cash", 23)} Time: ${new Date().toLocaleTimeString('en-GB', { hour12: false })}\n\n`));

//   // --- Customer Information ---
//   commands.push(new Uint8Array([0x1B, 0x21, 0x08])); // Bold text
//   commands.push(encoder.encode("BILL TO:\n"));
//   commands.push(new Uint8Array([0x1B, 0x21, 0x00])); // Normal text
//   commands.push(encoder.encode(`${customerInfo?.Name || "Walk-in Customer"}\n`));
//   commands.push(encoder.encode(`${customerAddress?.Street || "No address provided"}\n`));
//   commands.push(encoder.encode(`${customerAddress?.Phone || "No phone provided"}\n\n`));

//   // --- Items Table Header ---
//   commands.push(encoder.encode("────────────────────────────────────────────────────────\n"));
//   commands.push(new Uint8Array([0x1B, 0x21, 0x08])); // Bold
//   commands.push(encoder.encode(`${padRight("DESCRIPTION", 30)}${padRight("QTY", 8)}${padRight("UNIT PRICE", 12)}${padLeft("AMOUNT", 10)}\n`));
//   commands.push(new Uint8Array([0x1B, 0x21, 0x00])); // Normal
//   commands.push(encoder.encode("────────────────────────────────────────────────────────\n"));

//   // --- Items List ---
//   if (orderItems && orderItems.length > 0) {
//     orderItems.forEach((item, index) => {
//       const product = products?.find(p => p.ProductID?.toString() === item.ProductId?.toString());
//       const productName = product?.Name || `Product ${item.ProductId || index + 1}`;
//       const quantity = Number(item.Quantity || 0);
//       const unitPrice = Number(item.UnitPrice || 0);
//       const amount = quantity * unitPrice;

//       // Product name (may wrap to multiple lines if long)
//       const maxDescWidth = 30;
//       if (productName.length > maxDescWidth) {
//         // Split long product names
//         const lines = [];
//         for (let i = 0; i < productName.length; i += maxDescWidth) {
//           lines.push(productName.substring(i, i + maxDescWidth));
//         }
//         lines.forEach((line, lineIndex) => {
//           if (lineIndex === 0) {
//             // First line with price info
//             commands.push(encoder.encode(`${padRight(line, 30)}${padRight(quantity.toString(), 8)}${padRight(unitPrice.toFixed(2), 12)}${padLeft(amount.toFixed(2), 10)}\n`));
//           } else {
//             // Continuation lines
//             commands.push(encoder.encode(`${padRight(line, 30)}\n`));
//           }
//         });
//       } else {
//         commands.push(encoder.encode(`${padRight(productName, 30)}${padRight(quantity.toString(), 8)}${padRight(unitPrice.toFixed(2), 12)}${padLeft(amount.toFixed(2), 10)}\n`));
//       }
//     });
//   } else {
//     commands.push(encoder.encode(`${padRight("No items in this order", 30)}${padRight("-", 8)}${padRight("-", 12)}${padLeft("0.00", 10)}\n`));
//   }

//   // --- Totals Section ---
//   commands.push(encoder.encode("────────────────────────────────────────────────────────\n"));
  
//   const subtotal = Number(order?.TotalAmount || 0) + Number(order?.Discount || 0);
//   const discount = Number(order?.Discount || 0);
//   const total = Number(order?.TotalAmount || 0);
  
//   commands.push(encoder.encode(`${padRight("", 50)}${padLeft("SUBTOTAL:", 10)}\n`));
//   commands.push(encoder.encode(`${padRight("", 50)}${padLeft(`Rs. ${subtotal.toFixed(2)}`, 10)}\n`));
  
//   if (discount > 0) {
//     commands.push(encoder.encode(`${padRight("", 50)}${padLeft("DISCOUNT:", 10)}\n`));
//     commands.push(encoder.encode(`${padRight("", 50)}${padLeft(`Rs. ${discount.toFixed(2)}`, 10)}\n`));
//   }
  
//   commands.push(encoder.encode("════════════════════════════════════════════════════════\n"));
//   commands.push(new Uint8Array([0x1B, 0x21, 0x20])); // Double height for total
//   commands.push(encoder.encode(`${padRight("", 40)}${padLeft(`TOTAL: Rs. ${total.toFixed(2)}`, 20)}\n`));
//   commands.push(new Uint8Array([0x1B, 0x21, 0x00])); // Normal text
//   commands.push(encoder.encode("════════════════════════════════════════════════════════\n\n"));

//   // --- Payment Information ---
//   commands.push(encoder.encode(`Payment Method: ${order?.paymentType || "Cash"}\n`));
//   if (order?.paymentType === "Cash") {
//     commands.push(encoder.encode(`Amount Paid: Rs. ${total.toFixed(2)}\n`));
//     commands.push(encoder.encode(`Change: Rs. 0.00\n\n`));
//   }

//   // --- Footer Section ---
//   commands.push(new Uint8Array([0x1B, 0x61, 0x01])); // Center alignment
//   commands.push(encoder.encode("Thank you for your business!\n"));
//   commands.push(encoder.encode(`${customerInfo?.footer || "PATRON BASE POINT(CAPPED BLUE)"}\n\n`));
  
//   // Software info
//   commands.push(encoder.encode("Software by: Hexalyte Technology LTD\n"));
//   commands.push(encoder.encode("Contract: 0703130100\n\n"));
  
//   // Print timestamp
//   commands.push(encoder.encode(`Printed: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}\n`));
//   commands.push(encoder.encode(`Cashier: ${order?.PrintedBy || "System"}\n\n`));

//   // --- End of receipt ---
//   commands.push(new Uint8Array([0x1B, 0x64, 0x05])); // Feed 5 lines
//   commands.push(new Uint8Array([0x1D, 0x56, 0x41, 0x10])); // Full cut

//   return concatArrays(commands);
// };

// /**
//  * Print via Bluetooth for standard devices
//  */
// const printViaBluetooth = async (order, orderItems, customerInfo, customerAddress, products) => {
//   try {
//     // Request the Bluetooth device
//     console.log('Requesting Bluetooth device...');

//     // Common thermal printer services and characteristics
//     const PRINTER_SERVICE_UUIDS = [
//       '00001800-0000-1000-8000-00805f9b34fb', // Generic Access Profile
//       '00001801-0000-1000-8000-00805f9b34fb', // Generic Attribute Profile
//       '0000180a-0000-1000-8000-00805f9b34fb', // Device Information Service
//       '00001812-0000-1000-8000-00805f9b34fb', // Human Interface Device
//       '00000ff0-0000-1000-8000-00805f9b34fb', // Commonly used by ESC/POS printers
//       '49535343-fe7d-4ae5-8fa9-9fafd205e455', // Common ESC/POS printer service
//       '38eb4a80-c570-11e3-9507-0002a5d5c51b'  // Another common service
//     ];

//     const PRINTER_CHARACTERISTIC_UUIDS = [
//       '00002a00-0000-1000-8000-00805f9b34fb', // Device Name
//       '00002a01-0000-1000-8000-00805f9b34fb', // Appearance
//       '00002a24-0000-1000-8000-00805f9b34fb', // Model Number
//       '00002a25-0000-1000-8000-00805f9b34fb', // Serial Number
//       '00002a26-0000-1000-8000-00805f9b34fb', // Firmware Revision
//       '00002a27-0000-1000-8000-00805f9b34fb', // Hardware Revision
//       '00002a28-0000-1000-8000-00805f9b34fb', // Software Revision
//       '00002a29-0000-1000-8000-00805f9b34fb', // Manufacturer Name
//       '00000ff1-0000-1000-8000-00805f9b34fb', // ESC/POS printer write characteristic
//       '00000ff2-0000-1000-8000-00805f9b34fb', // ESC/POS printer read characteristic
//       '49535343-8841-43f4-a8d4-ecbe34729bb3', // Common ESC/POS printer characteristic
//       '38eb4a81-c570-11e3-9507-0002a5d5c51b'  // Another common characteristic
//     ];

//     let device;

//     try {
//       console.log('Requesting any Bluetooth device...');
//       device = await navigator.bluetooth.requestDevice({
//         acceptAllDevices: true,
//         optionalServices: PRINTER_SERVICE_UUIDS
//       });
//     } catch (initialError) {
//       console.error('Failed to request device with acceptAllDevices:', initialError);

//       // If it's a user-initiated cancel, just stop
//       if (initialError.name === 'NotFoundError') {
//         return {
//           success: false,
//           message: 'No Bluetooth device selected'
//         };
//       }

//       // If it's a permission error, show instructions
//       if (initialError.name === 'SecurityError' || initialError.name === 'NotAllowedError') {
//         const choice = await showBluetoothInstructions();
//         if (choice === 'fallback') {
//           throw new Error('User chose to use fallback printing');
//         } else {
//           throw new Error('Bluetooth permission denied. Please try again after enabling permissions.');
//         }
//       }

//       // Fall back to specific filters if that fails
//       console.log('Trying with specific device filters...');
//       device = await navigator.bluetooth.requestDevice({
//         filters: [
//           { namePrefix: 'Printer' },
//           { namePrefix: 'BT' },
//           { namePrefix: 'POS' },
//           { namePrefix: 'TP' },
//           { namePrefix: 'ESP' },
//           { namePrefix: 'RONGTA' }
//         ],
//         optionalServices: PRINTER_SERVICE_UUIDS
//       });
//     }

//     console.log('Device selected:', device.name || 'Unnamed device');
//     console.log('Connecting to GATT server...');
//     const server = await device.gatt.connect();

//     // Get services available on the device
//     const services = await server.getPrimaryServices();
//     console.log('Available services:', services.length);

//     // Try to find a supported service
//     let service;
//     let serviceUUID;

//     // First try to get all services to log them
//     try {
//       for (const availableService of services) {
//         const serviceInfo = availableService.uuid;
//         console.log('Found service:', serviceInfo);
//       }
//     } catch (e) {
//       console.error('Error listing services:', e);
//     }

//     // Now try our known service UUIDs
//     for (const uuid of PRINTER_SERVICE_UUIDS) {
//       try {
//         service = await server.getPrimaryService(uuid);
//         serviceUUID = uuid;
//         console.log(`Found matching printer service: ${uuid}`);
//         break;
//       } catch (e) {
//         console.log(`Service ${uuid} not available, trying next...`);
//       }
//     }

//     if (!service) {
//       // If we couldn't find a known service, try to use the first available service
//       try {
//         if (services.length > 0) {
//           service = services[0];
//           serviceUUID = service.uuid;
//           console.log(`Using first available service: ${serviceUUID}`);
//         } else {
//           throw new Error('No services found on this device');
//         }
//       } catch (e) {
//         throw new Error('Could not find a compatible printer service on this device: ' + e.message);
//       }
//     }

//     // Try to find characteristics on the service
//     const characteristics = await service.getCharacteristics();
//     console.log('Available characteristics:', characteristics.length);

//     // Try to find a supported characteristic
//     let characteristic;
//     let characteristicUUID;

//     // Log all available characteristics
//     try {
//       for (const availableChar of characteristics) {
//         const charInfo = availableChar.uuid;
//         console.log('Found characteristic:', charInfo);

//         // Get characteristic properties
//         console.log('Properties:',
//           availableChar.properties.write ? 'write ' : '',
//           availableChar.properties.writeWithoutResponse ? 'writeWithoutResponse ' : '',
//           availableChar.properties.read ? 'read ' : '',
//           availableChar.properties.notify ? 'notify' : ''
//         );
//       }
//     } catch (e) {
//       console.error('Error listing characteristics:', e);
//     }

//     // First try our known characteristics
//     for (const uuid of PRINTER_CHARACTERISTIC_UUIDS) {
//       try {
//         const tempChar = await service.getCharacteristic(uuid);
//         if (tempChar.properties.write || tempChar.properties.writeWithoutResponse) {
//           characteristic = tempChar;
//           characteristicUUID = uuid;
//           console.log(`Found writable printer characteristic: ${uuid}`);
//           break;
//         } else {
//           console.log(`Characteristic ${uuid} found but not writable`);
//         }
//       } catch (e) {
//         console.log(`Characteristic ${uuid} not available, trying next...`);
//       }
//     }

//     // If we couldn't find a known characteristic, try to use the first available writable characteristic
//     if (!characteristic) {
//       try {
//         for (const availableChar of characteristics) {
//           if (availableChar.properties.write || availableChar.properties.writeWithoutResponse) {
//             characteristic = availableChar;
//             characteristicUUID = availableChar.uuid;
//             console.log(`Using first available writable characteristic: ${characteristicUUID}`);
//             break;
//           }
//         }

//         if (!characteristic) {
//           throw new Error('No writable characteristics found on this device');
//         }
//       } catch (e) {
//         throw new Error('Could not find a compatible printer characteristic: ' + e.message);
//       }
//     }

//     // Generate ESC/POS commands for the receipt
//     const commands = generateESCPOSCommands(order, orderItems, customerInfo, customerAddress, products);

//     // Due to Bluetooth packet size limitations, we need to send data in chunks
//     const CHUNK_SIZE = 512;

//     for (let i = 0; i < commands.length; i += CHUNK_SIZE) {
//       const chunk = commands.slice(i, i + CHUNK_SIZE);
//       console.log(`Sending chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(commands.length / CHUNK_SIZE)}...`);

//       try {
//         if (characteristic.properties.writeWithoutResponse) {
//           await characteristic.writeValueWithoutResponse(chunk);
//         } else {
//           await characteristic.writeValue(chunk);
//         }
//       } catch (writeError) {
//         console.error(`Error writing chunk ${Math.floor(i / CHUNK_SIZE) + 1}:, writeError`);
//         // Continue trying to send remaining chunks
//       }

//       // Add a delay between chunks
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }

//     console.log('Print data sent successfully via Bluetooth');
//     return {
//       success: true,
//       message: 'Receipt printed successfully via Bluetooth',
//       device: device.name || 'Bluetooth device',
//       serviceUUID,
//       characteristicUUID
//     };

//   } catch (error) {
//     console.error('Bluetooth printing error:', error);
//     return {
//       success: false,
//       error: error,
//       message: error.message || 'Error printing receipt via Bluetooth',
//       html: generateReceiptHTML(order, orderItems, customerInfo, customerAddress, products)
//     };
//   }
// };

// /**
//  * Print via Web Serial function with fixes for better error handling
//  */
// const printViaWebSerial = async (order, orderItems, customerInfo, customerAddress, products) => {
//   console.log('Starting Web Serial print process...');

//   let port = null;

//   try {
//     // Render receipt data
//     const data = await render(
//       <Printer type="epson" width={48}>
//         {/* Header */}
//         <Text align="center" bold={true}>
//           {customerInfo?.businessName || "STAR LINE MARKET"}
//         </Text>
//         <Text align="center">
//           {customerInfo?.address || "P.O.Box 20,Panadura,Sri Lanka"}
//         </Text>
//         <Text align="center">
//           {customerInfo?.phone || "Tel: 038-2231427"}
//         </Text>
//         {/* Double line separator */}
//         <Text>================================================</Text>
//         <Text align="center">INVOICE</Text>
//         <Text>================================================</Text>
//         {/* Invoice details */}
//         <Row
//           left={`Inv No:${order?.OrderID || "DMIN3907"}`}
//           right={`Date: ${new Date().toLocaleDateString('en-GB')}`}
//         />
//         <Text>Bill To:</Text>
//         <Text>{customerInfo?.customerName || "S.rubber"}</Text>
//         <Line />
//         {/* Table Header */}
//         <Text>Description              Qty    U/P (Disc)     Amount</Text>
//         <Line />
//         {/* Items */}
//         {Array.isArray(orderItems) && orderItems.length > 0 ? (
//           orderItems.map((item, index) => {
//             const productName = String(item?.ProductId || `P / S Fluid ${item?.size || "225ml"}`);
//             const qty = Number(item?.Quantity || 3);
//             const unitPrice = Number(item?.UnitPrice || 700.00);
//             const total = qty * unitPrice;

//             // Format product name to fit width
//             const displayName = productName.length > 24
//               ? productName.substring(0, 24)
//               : productName.padEnd(24);

//             return (
//               <Text key={index}>
//                 {`${displayName}${qty.toString().padStart(3)}${unitPrice.toFixed(2).padStart(8)} ${total.toFixed(2).padStart(9)}`}
//               </Text>
//             );
//           })
//         ) : (
//           <>
//             <Text>P/S Fluid 225ml            3   700.00  25%  1575.00</Text>
//             <Text>P/S Fluid 350ml            3   950.00  25%  2137.50</Text>
//             <Text>P/S Fluid 500ml            3  1325.00  25%  2981.25</Text>
//           </>
//         )}
//         <Line />
//         {/* Totals */}
//         <Text></Text>
//         <Row
//           left="BILL TOTAL:"
//           right={`Rs ${Number(order?.TotalAmount || 6693.75).toFixed(2)}`}
//         />
//         <Text></Text>
//         <Row
//           left="BILL OUTSTANDING:"
//           right={`Rs ${Number(order?.TotalAmount || 6693.75).toFixed(2)}`}
//         />
//         <Text></Text>
//         <Text></Text>
//         {/* Signature Section */}
//         <Text>-------------------------      -------------------------</Text>
//         <Text>Customer Signature             Salesman Signature</Text>
//         <Text></Text>
//         {/* Print Info */}
//         <Text>
//           Printed On: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB', { hour12: true })}
//         </Text>
//         <Text>Printed By: {order?.PrintedBy || "04D"}</Text>
//         <Text></Text>
//         {/* Bank Details */}
//         <Text>{customerInfo?.bankName || "Sampath Bank"}</Text>
//         <Text>
//           {customerInfo?.accountNumber || "0026-1000-8871"}  {customerInfo?.accountName || "Star Line Marketing"}
//         </Text>
//         <Text></Text>
//         {/* Footer */}
//         <Text align="center">
//           Software by: {customerInfo?.softwareBy || "Hexalyte Technology LTD"}
//         </Text>
//         <Text align="center">
//           Contract: {customerInfo?.contractNumber || "0703130100"}
//         </Text>
//       </Printer>
//     );

//     // Request access to a serial port
//     console.log('Requesting serial port access...');
//     port = await navigator.serial.requestPort();

//     // Open the port
//     console.log('Opening port...');
//     await port.open({ baudRate: 9600 });

//     // Get a writer to send data to the printer
//     console.log('Getting writer...');
//     const writer = port.writable.getWriter();

//     // Send data to the printer
//     console.log('Sending data to printer...');
//     const textEncoder = new TextEncoder();
//     const dataToSend = typeof data === 'string' ? textEncoder.encode(data) : data;
//     await writer.write(dataToSend);

//     // Release the writer
//     writer.releaseLock();

//     console.log('Print data sent successfully');
//     return {
//       success: true,
//       message: 'Receipt printed successfully'
//     };

//   } catch (error) {
//     console.error('Web Serial printing error:', error);
//     return {
//       success: false,
//       error: error,
//       message: error.message || 'Error printing receipt',
//       html: generateReceiptHTML(order, orderItems, customerInfo, customerAddress, products)
//     };
//   } finally {
//     // Close the port when done
//     if (port && typeof port.close === 'function') {
//       try {
//         console.log('Closing printer connection...');
//         await port.close();
//       } catch (closeError) {
//         console.error('Error closing port:', closeError);
//       }
//     }
//   }
// };

// /**
//  * Generates HTML representation of the receipt for fallback printing
//  */
// const generateReceiptHTML = (order, orderItems, customerInfo, customerAddress, products) => {
//   console.log(order);
//   console.log(orderItems);
//   console.log(customerAddress);
//   console.log(products);

//   return `
//     <div style="font-family: Arial, sans-serif; width: 210mm; height: 297mm; margin: 0 auto; padding: 20px; box-sizing: border-box; border: 1px solid #ddd; background-color: #fff; display: flex; flex-direction: column;">
//     <!-- Header -->
//     <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3498db; padding-bottom: 15px; margin-bottom: 20px;">
//       <div>
//         <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">OIL AFCO</div>
//         <div style="color: #7f8c8d;">DS LANKA FOODS-KANDY/ITN-32 CASH</div>
//         <div style="color: #7f8c8d;">TEL: 077-2222194</div>
//       </div>
//       <div style="background-color: #3498db; color: white; padding: 10px 20px; border-radius: 5px; font-size: 22px; font-weight: bold;">INVOICE</div>
//     </div>

//     <!-- Invoice Details -->
//     <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
//       <div style="width: 48%;">
//         <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #3498db;">BILL TO:</div>
//         <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${customerInfo?.Name || "Customer Name"}</div>
//         <div style="margin-bottom: 5px; color: #555;">${customerAddress?.Street || "Customer Address"}</div>
//         <div style="margin-bottom: 5px; color: #555;">${customerAddress?.Phone || "Customer Phone"}</div>
//       </div>
//       <div style="width: 48%; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
//         <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
//           <span style="font-weight: bold; color: #555;">Invoice No:</span>
//           <span>${order?.OrderID || "INV001"}</span>
//         </div>
//         <div style="display: flex; justify-content: space-between;">
//           <span style="font-weight: bold; color: #555;">Date:</span>
//           <span>${new Date().toLocaleDateString()}</span>
//         </div>
//       </div>
//     </div>

//     <!-- Items Table -->
//     <div style="margin-bottom: 20px; flex-grow: 1;">
//       <div style="display: flex; background-color: #3498db; color: white; padding: 10px 15px; font-weight: bold; border-top-left-radius: 5px; border-top-right-radius: 5px;">
//         <div style="width: 45%;">DESCRIPTION</div>
//         <div style="width: 15%; text-align: center;">QTY</div>
//         <div style="width: 20%; text-align: right;">UNIT PRICE</div>
//         <div style="width: 20%; text-align: right;">AMOUNT</div>
//       </div>

//       ${orderItems && orderItems.length > 0 ? orderItems.map((orderItem) => {
//         const product = products?.find((product) => product.ProductID?.toString() === orderItem.ProductId?.toString());
//         const productName = product?.Name || `Product ${orderItem.ProductId}`;
//         const quantity = orderItem.Quantity || 0;
//         const unitPrice = orderItem.UnitPrice || 0;
//         const amount = Number(quantity) * Number(unitPrice);

//         return `<div style="border: 1px solid #ddd; border-top: none;">
//           <div style="display: flex; padding: 10px 15px; border-bottom: 1px solid #eee; background-color: #f9f9f9;">
//             <div style="width: 45%;">${productName}</div>
//             <div style="width: 15%; text-align: center;">${quantity}</div>
//             <div style="width: 20%; text-align: right;">${unitPrice}</div>
//             <div style="width: 20%; text-align: right;">${amount.toFixed(2)}</div>
//           </div>
//         </div>`;
//       }).join('') : '<div style="padding: 10px 15px; text-align: center; color: #666;">No items</div>'}

//     </div>

//     <!-- Summary -->
//     <div style="display: flex; flex-direction: column; align-items: flex-end; margin-bottom: 30px;">
//       <div style="width: 250px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
//         <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
//           <span style="font-weight: bold; color: #555;">Subtotal:</span>
//           <span>${Number(order?.Discount || 0) + Number(order?.TotalAmount || 0)}</span>
//         </div>
//         <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
//           <span style="font-weight: bold; color: #555;">Discount:</span>
//           <span>${order?.Discount || 0}</span>
//         </div>
//         <div style="display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 10px; font-weight: bold; font-size: 16px;">
//           <span>TOTAL:</span>
//           <span>${order?.TotalAmount || 0}</span>
//         </div>
//       </div>
//     </div>

//     <!-- Footer -->
//     <div style="margin-top: auto; border-top: 2px solid #3498db; padding-top: 15px; text-align: center;">
//       <div style="margin-bottom: 5px; color: #555;">Thank you for your business!</div>
//       <div style="color: #7f8c8d; font-size: 12px;">PATRON BASE POINT(CAPPED BLUE)</div>
//       <div style="margin-top: 10px; font-size: 12px; color: #95a5a6;">Powered by Hexalyte Technology</div>
//     </div>
//   </div>
//   `;
// };

// /**
//  * Print using browser print dialog
//  */
// const printViaDialog = (htmlContent) => {
//   // Create a new window
//   const printWindow = window.open('', 'Print Receipt', 'height=600,width=400');

//   if (!printWindow) {
//     alert('Please allow pop-ups to print the receipt');
//     return false;
//   }

//   // Write the receipt content
//   printWindow.document.write(`
//     <html>
//       <head>
//         <title>Receipt</title>
//         <style>
//           body { font-family: monospace; }
//           @media print {
//             body { width: 80mm; margin: 0; padding: 0; }
//             @page { size: 80mm auto; margin: 0mm; }
//           }
//         </style>
//       </head>
//       <body>
//         ${htmlContent}
//         <script>
//           window.onload = function() {
//             window.print();
//             setTimeout(function() { window.close(); }, 500);
//           };
//         </script>
//       </body>
//     </html>
//   `);

//   return true;
// };

// /**
//  * Main function that handles all printing scenarios
//  */
// const printHandler = async (order, orderItems, customerInfo, customerAddress, products) => {
//   // Request necessary permissions
//   try {
//     const permissionsGranted = await requestPermissions();
//     if (!permissionsGranted) {
//       console.warn('Bluetooth permissions may not be granted');
//     }
//   } catch (permissionError) {
//     console.error('Error requesting permissions:', permissionError);
//   }

//   // Check environment capabilities
//   const environment = checkEnvironment();
//   console.log('Environment check:', environment);

//   // Log detailed environment information
//   console.log('User Agent:', navigator.userAgent);
//   console.log('Bluetooth API?', environment.supportsBluetooth);
//   console.log('Serial API?', environment.supportsSerial);
//   console.log('Secure Context?', window.isSecureContext);

//   // If not in secure context (HTTPS), alert the user
//   if (!window.isSecureContext) {
//     alert('For security reasons, direct printing requires HTTPS.\nPlease access this application via HTTPS to enable direct printing.');

//     // Try fallback printing
//     const html = generateReceiptHTML(order, orderItems, customerInfo, customerAddress, products);
//     const printed = printViaDialog(html);

//     return {
//       success: false,
//       message: 'HTTPS required for direct printing',
//       fallbackPrinted: printed
//     };
//   }

//   // Choose printing method based on environment
//   if (environment.supportsBluetooth) {
//     // Device with Bluetooth support
//     try {
//       console.log('Attempting Bluetooth printing...');
//       const result = await printViaBluetooth(order, orderItems, customerInfo, customerAddress, products);

//       // If Bluetooth printing succeeded, return the result
//       if (result.success) {
//         return result;
//       }

//       // If Bluetooth printing failed, fall through to fallback
//       console.warn('Bluetooth printing failed:', result.message || result.error);
//       throw new Error(result.message || 'Bluetooth printing failed');
//     } catch (bluetoothError) {
//       console.error('Bluetooth printing error:', bluetoothError);

//       // Show error to user and offer fallback
//       const useAlternative = window.confirm(
//         'Direct printing to thermal printer failed:\n\n' +
//         (bluetoothError.message || 'Could not connect to Bluetooth printer') + '\n\n' +
//         'Would you like to print using the browser print dialog instead?'
//       );

//       if (useAlternative) {
//         const html = generateReceiptHTML(order, orderItems, customerInfo, customerAddress, products);
//         const printed = printViaDialog(html);

//         return {
//           success: false,
//           fallbackPrinted: printed,
//           error: bluetoothError,
//           message: 'Used browser print dialog after Bluetooth failed'
//         };
//       }

//       return {
//         success: false,
//         error: bluetoothError,
//         message: 'Bluetooth printing failed and user declined fallback'
//       };
//     }
//   } else if (environment.supportsSerial) {
//     // Desktop with Web Serial support
//     try {
//       console.log('Attempting Web Serial printing...');
//       return await printViaWebSerial(order, orderItems, customerInfo, customerAddress, products);
//     } catch (serialError) {
//       console.error('Web Serial printing error:', serialError);

//       // Show error to user and offer fallback
//       const useAlternative = window.confirm(
//         'Direct printing to thermal printer failed:\n\n' +
//         (serialError.message || 'Could not connect to printer via Web Serial') + '\n\n' +
//         'Would you like to print using the browser print dialog instead?'
//       );

//       if (useAlternative) {
//         const html = generateReceiptHTML(order, orderItems, customerInfo, customerAddress, products);
//         const printed = printViaDialog(html);

//         return {
//           success: false,
//           fallbackPrinted: printed,
//           error: serialError,
//           message: 'Used browser print dialog after Web Serial failed'
//         };
//       }

//       return {
//         success: false,
//         error: serialError,
//         message: 'Web Serial printing failed and user declined fallback'
//       };
//     }
//   }

//   // No direct printing method available, explain why and offer fallback
//   const issues = environment.issues.map(issue => - `${issue}`).join('\n');

//   const useAlternative = window.confirm(
//     'Direct printing to thermal printer is not available due to the following reasons:\n\n' +
//     issues + '\n\n' +
//     'Would you like to print using the browser print dialog instead?'
//   );

//   if (useAlternative) {
//     const html = generateReceiptHTML(order, orderItems, customerInfo, customerAddress, products);
//     const printed = printViaDialog(html);

//     return {
//       success: false,
//       fallbackPrinted: printed,
//       message: 'Printed using browser print dialog'
//     };
//   }

//   return {
//     success: false,
//     message: 'Printing cancelled'
//   };
// };

// export default printHandler;

import { Printer, Text, Line, Row, render } from 'react-thermal-printer';
import React from 'react';

/**
 * Check if Web Serial API is supported
 */
const isWebSerialSupported = () => {
  return 'serial' in navigator && window.isSecureContext;
};

/**
 * Helper function to pad right with spaces
 */
const padRight = (text, length) => {
  text = String(text || "");
  return text.padEnd(length);
};

/**
 * Helper function to pad left with spaces
 */
const padLeft = (text, length) => {
  text = String(text || "");
  return text.padStart(length);
};

/**
 * Helper function to concatenate multiple Uint8Arrays
 */
const concatArrays = (arrays) => {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  arrays.forEach(arr => {
    result.set(arr, offset);
    offset += arr.length;
  });
  return result;
};

/**
 * Generates ESC/POS commands for A5 receipt format (148mm x 210mm)
 */
const generateESCPOSCommands = (order, orderItems, customerInfo, customerAddress, products) => {
  const encoder = new TextEncoder();
  const commands = [];

  // --- Initialization ---
  commands.push(new Uint8Array([0x1B, 0x40])); // ESC @ - Initialize printer
  
  // Set page mode for A5 paper (148mm width ≈ 420 dots at 180 DPI)
  commands.push(new Uint8Array([0x1B, 0x4C])); // ESC L - Set page mode
  commands.push(new Uint8Array([0x1D, 0x50, 0xA4, 0x01, 0x68, 0x02])); // Set print area for A5

  // --- Header Section ---
  commands.push(new Uint8Array([0x1B, 0x61, 0x01])); // ESC a 1 (center alignment)
  commands.push(new Uint8Array([0x1B, 0x21, 0x30])); // Large bold text
  commands.push(encoder.encode("OIL AFCO\n"));
  
  commands.push(new Uint8Array([0x1B, 0x21, 0x00])); // Normal text size
  commands.push(encoder.encode("DS LANKA FOODS-KANDY/ITN-32 CASH\n"));
  commands.push(encoder.encode("TEL: 077-2222194\n\n"));

  // Invoice title with border
  commands.push(new Uint8Array([0x1B, 0x21, 0x20])); // Double height
  commands.push(encoder.encode("════════════════════════════════════════════════════════\n"));
  commands.push(encoder.encode("                         INVOICE\n"));
  commands.push(encoder.encode("════════════════════════════════════════════════════════\n\n"));

  // --- Invoice Details Section ---
  commands.push(new Uint8Array([0x1B, 0x61, 0x00])); // Left alignment
  commands.push(new Uint8Array([0x1B, 0x21, 0x00])); // Normal text
  
  const dateTime = new Date().toLocaleDateString('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
  
  // Two column layout for invoice details
  commands.push(encoder.encode(`Invoice No: ${padRight(order?.OrderID || "INV001", 20)} Date: ${dateTime}\n`));
  commands.push(encoder.encode(`Payment: ${padRight(order?.paymentType || "Cash", 23)} Time: ${new Date().toLocaleTimeString('en-GB', { hour12: false })}\n\n`));

  // --- Customer Information ---
  commands.push(new Uint8Array([0x1B, 0x21, 0x08])); // Bold text
  commands.push(encoder.encode("BILL TO:\n"));
  commands.push(new Uint8Array([0x1B, 0x21, 0x00])); // Normal text
  commands.push(encoder.encode(`${customerInfo?.Name || "Walk-in Customer"}\n`));
  commands.push(encoder.encode(`${customerAddress?.Street || "No address provided"}\n`));
  commands.push(encoder.encode(`${customerAddress?.Phone || "No phone provided"}\n\n`));

  // --- Items Table Header ---
  commands.push(encoder.encode("────────────────────────────────────────────────────────\n"));
  commands.push(new Uint8Array([0x1B, 0x21, 0x08])); // Bold
  commands.push(encoder.encode(`${padRight("DESCRIPTION", 30)}${padRight("QTY", 8)}${padRight("UNIT PRICE", 12)}${padLeft("AMOUNT", 10)}\n`));
  commands.push(new Uint8Array([0x1B, 0x21, 0x00])); // Normal
  commands.push(encoder.encode("────────────────────────────────────────────────────────\n"));

  // --- Items List ---
  if (orderItems && orderItems.length > 0) {
    orderItems.forEach((item, index) => {
      const product = products?.find(p => p.ProductID?.toString() === item.ProductId?.toString());
      const productName = product?.Name || `Product ${item.ProductId || index + 1}`;
      const quantity = Number(item.Quantity || 0);
      const unitPrice = Number(item.UnitPrice || 0);
      const amount = quantity * unitPrice;

      // Product name (may wrap to multiple lines if long)
      const maxDescWidth = 30;
      if (productName.length > maxDescWidth) {
        // Split long product names
        const lines = [];
        for (let i = 0; i < productName.length; i += maxDescWidth) {
          lines.push(productName.substring(i, i + maxDescWidth));
        }
        lines.forEach((line, lineIndex) => {
          if (lineIndex === 0) {
            // First line with price info
            commands.push(encoder.encode(`${padRight(line, 30)}${padRight(quantity.toString(), 8)}${padRight(unitPrice.toFixed(2), 12)}${padLeft(amount.toFixed(2), 10)}\n`));
          } else {
            // Continuation lines
            commands.push(encoder.encode(`${padRight(line, 30)}\n`));
          }
        });
      } else {
        commands.push(encoder.encode(`${padRight(productName, 30)}${padRight(quantity.toString(), 8)}${padRight(unitPrice.toFixed(2), 12)}${padLeft(amount.toFixed(2), 10)}\n`));
      }
    });
  } else {
    commands.push(encoder.encode(`${padRight("No items in this order", 30)}${padRight("-", 8)}${padRight("-", 12)}${padLeft("0.00", 10)}\n`));
  }

  // --- Totals Section ---
  commands.push(encoder.encode("────────────────────────────────────────────────────────\n"));
  
  const subtotal = Number(order?.TotalAmount || 0) + Number(order?.Discount || 0);
  const discount = Number(order?.Discount || 0);
  const total = Number(order?.TotalAmount || 0);
  
  commands.push(encoder.encode(`${padRight("", 50)}${padLeft("SUBTOTAL:", 10)}\n`));
  commands.push(encoder.encode(`${padRight("", 50)}${padLeft(`Rs. ${subtotal.toFixed(2)}`, 10)}\n`));
  
  if (discount > 0) {
    commands.push(encoder.encode(`${padRight("", 50)}${padLeft("DISCOUNT:", 10)}\n`));
    commands.push(encoder.encode(`${padRight("", 50)}${padLeft(`Rs. ${discount.toFixed(2)}`, 10)}\n`));
  }
  
  commands.push(encoder.encode("════════════════════════════════════════════════════════\n"));
  commands.push(new Uint8Array([0x1B, 0x21, 0x20])); // Double height for total
  commands.push(encoder.encode(`${padRight("", 40)}${padLeft(`TOTAL: Rs. ${total.toFixed(2)}`, 20)}\n`));
  commands.push(new Uint8Array([0x1B, 0x21, 0x00])); // Normal text
  commands.push(encoder.encode("════════════════════════════════════════════════════════\n\n"));

  // --- Payment Information ---
  commands.push(encoder.encode(`Payment Method: ${order?.paymentType || "Cash"}\n`));
  if (order?.paymentType === "Cash") {
    commands.push(encoder.encode(`Amount Paid: Rs. ${total.toFixed(2)}\n`));
    commands.push(encoder.encode(`Change: Rs. 0.00\n\n`));
  }

  // --- Footer Section ---
  commands.push(new Uint8Array([0x1B, 0x61, 0x01])); // Center alignment
  commands.push(encoder.encode("Thank you for your business!\n"));
  commands.push(encoder.encode(`${customerInfo?.footer || "PATRON BASE POINT(CAPPED BLUE)"}\n\n`));
  
  // Software info
  commands.push(encoder.encode("Software by: Hexalyte Technology LTD\n"));
  commands.push(encoder.encode("Contract: 0703130100\n\n"));
  
  // Print timestamp
  commands.push(encoder.encode(`Printed: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}\n`));
  commands.push(encoder.encode(`Cashier: ${order?.PrintedBy || "System"}\n\n`));

  // --- End of receipt ---
  commands.push(new Uint8Array([0x1B, 0x64, 0x05])); // Feed 5 lines
  commands.push(new Uint8Array([0x1D, 0x56, 0x41, 0x10])); // Full cut

  return concatArrays(commands);
};

/**
 * Get available serial ports (if supported by browser)
 */
const getAvailablePorts = async () => {
  try {
    if (!isWebSerialSupported()) {
      throw new Error('Web Serial API not supported');
    }
    
    return await navigator.serial.getPorts();
  } catch (error) {
    console.error('Error getting available ports:', error);
    return [];
  }
};

/**
 * Request serial port access with user selection
 */
const requestSerialPort = async (filters = []) => {
  try {
    if (!isWebSerialSupported()) {
      throw new Error('Web Serial API not supported. Please use Chrome/Edge and ensure HTTPS.');
    }

    console.log('Requesting serial port access...');
    
    // Common thermal printer vendor IDs and product IDs
    const defaultFilters = [
      // Epson printers
      { usbVendorId: 0x04b8 },
      // Star Micronics
      { usbVendorId: 0x0519 },
      // Citizen Systems
      { usbVendorId: 0x1618 },
      // Bixolon
      { usbVendorId: 0x0419 },
      // Generic USB-to-Serial adapters
      { usbVendorId: 0x067b }, // Prolific
      { usbVendorId: 0x10c4 }, // Silicon Labs
      { usbVendorId: 0x0403 }, // FTDI
      // Allow all devices if no specific filters
      ...(filters.length > 0 ? filters : [])
    ];

    const port = await navigator.serial.requestPort({
      filters: defaultFilters
    });

    console.log('Serial port selected:', port.getInfo());
    return port;
  } catch (error) {
    console.error('Error requesting serial port:', error);
    throw error;
  }
};

/**
 * Open serial port with configuration
 */
const openSerialPort = async (port, options = {}) => {
  try {
    const defaultOptions = {
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      bufferSize: 255,
      flowControl: 'none'
    };

    const config = { ...defaultOptions, ...options };
    console.log('Opening port with config:', config);
    
    await port.open(config);
    console.log('Port opened successfully');
    return true;
  } catch (error) {
    console.error('Error opening port:', error);
    throw error;
  }
};

/**
 * Send data to printer via serial port
 */
const sendDataToSerial = async (port, data, chunkSize = 1024) => {
  try {
    if (!port.writable) {
      throw new Error('Port is not writable');
    }

    const writer = port.writable.getWriter();
    console.log('Sending data to printer...');

    // Send data in chunks to avoid buffer overflow
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      console.log(`Sending chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(data.length / chunkSize)} (${chunk.length} bytes)`);
      
      await writer.write(chunk);
      
      // Small delay between chunks
      if (i + chunkSize < data.length) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    writer.releaseLock();
    console.log('Data sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending data:', error);
    throw error;
  }
};

/**
 * Close serial port
 */
const closeSerialPort = async (port) => {
  try {
    if (port && typeof port.close === 'function') {
      console.log('Closing printer connection...');
      await port.close();
      console.log('Port closed successfully');
    }
  } catch (error) {
    console.error('Error closing port:', error);
  }
};

/**
 * Print via Web Serial with react-thermal-printer rendering
 */
const printViaWebSerialReact = async (order, orderItems, customerInfo, customerAddress, products, options = {}) => {
  console.log('Starting Web Serial print process with React rendering...');
  let port = null;

  try {
    // Render receipt using react-thermal-printer
    const data = await render(
      <Printer type="epson" width={48}>
        {/* Header */}
        <Text align="center" bold={true}>
          {customerInfo?.businessName || "OIL AFCO"}
        </Text>
        <Text align="center">
          {customerInfo?.address || "DS LANKA FOODS-KANDY/ITN-32 CASH"}
        </Text>
        <Text align="center">
          {customerInfo?.phone || "TEL: 077-2222194"}
        </Text>
        <Text>================================================</Text>
        <Text align="center">INVOICE</Text>
        <Text>================================================</Text>
        
        {/* Invoice details */}
        <Row
          left={`Inv No: ${order?.OrderID || "INV001"}`}
          right={`Date: ${new Date().toLocaleDateString('en-GB')}`}
        />
        <Text>Bill To:</Text>
        <Text>{customerInfo?.Name || "Walk-in Customer"}</Text>
        <Text>{customerAddress?.Street || "No address"}</Text>
        <Text>{customerAddress?.Phone || "No phone"}</Text>
        <Line />
        
        {/* Table Header */}
        <Text>Description              Qty    U/P     Amount</Text>
        <Line />
        
        {/* Items */}
        {Array.isArray(orderItems) && orderItems.length > 0 ? (
          orderItems.map((item, index) => {
            const product = products?.find(p => p.ProductID?.toString() === item.ProductId?.toString());
            const productName = product?.Name || `Product ${item.ProductId || index + 1}`;
            const qty = Number(item?.Quantity || 0);
            const price = Number(item?.UnitPrice || 0);
            const total = qty * price;

            return (
              <React.Fragment key={index}>
                <Text>{productName}</Text>
                <Row
                  left={`${qty} x ${price.toFixed(2)}`}
                  right={total.toFixed(2)}
                />
              </React.Fragment>
            );
          })
        ) : (
          <Text>No items in this order</Text>
        )}
        
        <Line />
        
        {/* Totals */}
        <Row
          left="TOTAL:"
          right={`Rs ${Number(order?.TotalAmount || 0).toFixed(2)}`}
        />
        
        {Number(order?.Discount || 0) > 0 && (
          <Row
            left="DISCOUNT:"
            right={`Rs ${Number(order?.Discount || 0).toFixed(2)}`}
          />
        )}
        
        <Line />
        
        {/* Footer */}
        <Text align="center">Thank you for your business!</Text>
        <Text align="center">
          {customerInfo?.footer || "PATRON BASE POINT(CAPPED BLUE)"}
        </Text>
        <Text></Text>
        <Text align="center">Software by: Hexalyte Technology LTD</Text>
        <Text align="center">Contract: 0703130100</Text>
      </Printer>
    );

    // Request and open serial port
    port = await requestSerialPort(options.portFilters);
    await openSerialPort(port, options.serialConfig);

    // Send data to printer
    const textEncoder = new TextEncoder();
    const dataToSend = typeof data === 'string' ? textEncoder.encode(data) : data;
    await sendDataToSerial(port, dataToSend, options.chunkSize);

    return {
      success: true,
      message: 'Receipt printed successfully via Web Serial',
      port: port.getInfo()
    };

  } catch (error) {
    console.error('Web Serial printing error:', error);
    return {
      success: false,
      error: error,
      message: error.message || 'Error printing receipt via Web Serial'
    };
  } finally {
    await closeSerialPort(port);
  }
};

/**
 * Print via Web Serial with ESC/POS commands
 */
const printViaWebSerialESCPOS = async (order, orderItems, customerInfo, customerAddress, products, options = {}) => {
  console.log('Starting Web Serial print process with ESC/POS commands...');
  let port = null;

  try {
    // Generate ESC/POS commands
    const commands = generateESCPOSCommands(order, orderItems, customerInfo, customerAddress, products);

    // Request and open serial port
    port = await requestSerialPort(options.portFilters);
    await openSerialPort(port, options.serialConfig);

    // Send commands to printer
    await sendDataToSerial(port, commands, options.chunkSize);

    return {
      success: true,
      message: 'Receipt printed successfully via Web Serial (ESC/POS)',
      port: port.getInfo()
    };

  } catch (error) {
    console.error('Web Serial ESC/POS printing error:', error);
    return {
      success: false,
      error: error,
      message: error.message || 'Error printing receipt via Web Serial'
    };
  } finally {
    await closeSerialPort(port);
  }
};

/**
 * Main Web Serial printing function
 */
const printViaWebSerial = async (order, orderItems, customerInfo, customerAddress, products, options = {}) => {
  // Check if Web Serial is supported
  if (!isWebSerialSupported()) {
    return {
      success: false,
      message: 'Web Serial API not supported. Please use Chrome/Edge browser with HTTPS.',
      requiresHTTPS: !window.isSecureContext,
      browserSupported: 'serial' in navigator
    };
  }

  const defaultOptions = {
    method: 'escpos', // 'react' or 'escpos'
    serialConfig: {
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: 'none'
    },
    chunkSize: 1024,
    portFilters: [] // Custom USB vendor/product ID filters
  };

  const config = { ...defaultOptions, ...options };

  // Choose printing method
  if (config.method === 'react') {
    return await printViaWebSerialReact(order, orderItems, customerInfo, customerAddress, products, config);
  } else {
    return await printViaWebSerialESCPOS(order, orderItems, customerInfo, customerAddress, products, config);
  }
};

// Export utility functions
export {
  isWebSerialSupported,
  getAvailablePorts,
  requestSerialPort,
  openSerialPort,
  sendDataToSerial,
  closeSerialPort,
  printViaWebSerialReact,
  printViaWebSerialESCPOS,
  generateESCPOSCommands
};

// Export main function as default
export default printViaWebSerial;