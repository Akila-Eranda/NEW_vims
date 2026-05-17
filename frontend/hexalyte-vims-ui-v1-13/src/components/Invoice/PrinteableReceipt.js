import { Printer, Text, Line, Row, render } from 'react-thermal-printer';
import React from 'react';

/**
 * Improved environment detection with better mobile browser support
 */
const checkEnvironment = () => {
  const issues = [];
  
  // More comprehensive Android detection
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  // Check for Chrome on Android which has better Web Bluetooth support
  const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edge|EdgiOS|EdgA/i.test(navigator.userAgent);
  const isChromeOnAndroid = isAndroid && isChrome;
  
  // More reliable Bluetooth detection
  let supportsBluetooth = false;
  try {
    supportsBluetooth = !!navigator.bluetooth;
  } catch (e) {
    console.warn("Error checking Bluetooth support:", e);
  }
  
  // More reliable Serial detection
  let supportsSerial = false;
  try {
    supportsSerial = !!navigator.serial;
  } catch (e) {
    console.warn("Error checking Serial support:", e);
  }
  
  // Check for secure context
  if (!window.isSecureContext) {
    issues.push('Not running in a secure context (HTTPS)');
  }
  
  // Check each API explicitly
  if (!supportsBluetooth) {
    issues.push('Browser does not support Web Bluetooth API');
  }
  
  if (!supportsSerial) {
    issues.push('Browser does not support Web Serial API');
  }
  
  // Determine if any printing method is supported
  const supported = (isAndroid && supportsBluetooth) || supportsSerial;
  
  return { 
    supported, 
    supportsBluetooth, 
    supportsSerial, 
    isAndroid,
    isChromeOnAndroid,
    issues 
  };
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
  // Calculate total length
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  
  // Create a new array with the total length
  const result = new Uint8Array(totalLength);
  
  // Copy each array into the result
  let offset = 0;
  arrays.forEach(arr => {
    result.set(arr, offset);
    offset += arr.length;
  });
  
  return result;
};

/**
 * Generates ESC/POS commands for a receipt matching the design
 */
const generateESCPOSCommands = (order, orderItems, businessInfo) => {
  try {
    const encoder = new TextEncoder();
    const commands = [];
    
    // Initialize printer
    commands.push(new Uint8Array([0x1B, 0x40])); // ESC @
    
    // Set text size for header (slightly larger)
    commands.push(new Uint8Array([0x1D, 0x21, 0x11])); // GS ! 17 - double height and width
    
    // Center alignment for header
    commands.push(new Uint8Array([0x1B, 0x61, 0x01])); // ESC a 1 - center
    
    // Business info section
    commands.push(encoder.encode(businessInfo?.name || "OIL AFCO\n"));
    
    // Reset text size to normal
    commands.push(new Uint8Array([0x1D, 0x21, 0x00])); // GS ! 0 - normal size
    
    commands.push(encoder.encode(businessInfo?.address || "DS LANKA FOODS-KANDY/ITN-32 CASH\n"));
    commands.push(encoder.encode(businessInfo?.phone || "TEL: 077-2222194\n"));
    
    // Set left alignment
    commands.push(new Uint8Array([0x1B, 0x61, 0x00])); // ESC a 0 - left
    
    // Add horizontal line
    commands.push(encoder.encode("--------------------------------\n"));
    
    // Receipt details section
    const dateTime = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'numeric', day: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
    
    commands.push(encoder.encode(`Date/Time : ${dateTime}\n`));
    commands.push(encoder.encode(`Inv. Counter : ${order?.counter || "738"}\n`));
    commands.push(encoder.encode(`Bal : ${order?.balance || "726.25"}\n`));
    commands.push(encoder.encode(`Ref : ${order?.reference || "NA"}\n`));
    commands.push(encoder.encode(`Pay Type : ${order?.paymentType || "Cash"}\n\n`));
    
    // Header for sales oil section - emphasize with double width
    commands.push(new Uint8Array([0x1D, 0x21, 0x01])); // GS ! 1 - double width
    commands.push(encoder.encode("------ SALES OIL ------\n"));
    commands.push(new Uint8Array([0x1D, 0x21, 0x00])); // GS ! 0 - back to normal
    
    // Items section table header - bold
    commands.push(new Uint8Array([0x1B, 0x45, 0x01])); // ESC E 1 - bold on
    commands.push(encoder.encode("DESCRIPTION             PRICE    QTY    VALUE\n"));
    commands.push(new Uint8Array([0x1B, 0x45, 0x00])); // ESC E 0 - bold off
    commands.push(encoder.encode("--------------------------------\n"));
    
    // Add items - format similar to the receipt
    if (orderItems && orderItems.length > 0) {
      orderItems.forEach((item, index) => {
        commands.push(encoder.encode(`${index + 1}. ${padRight(item.Name, 22)} ${padLeft(item.UnitPrice?.toFixed(2), 7)} ${padLeft(item.Quantity, 5)} ${padLeft((item.Quantity * item.UnitPrice)?.toFixed(2), 10)}\n`));
      });
    } else {
      // Sample items based on image
      commands.push(encoder.encode("1. KEROSENE                  317.00     5    55.00\n"));
      commands.push(encoder.encode("2. EXT BIG CAN(KEROSENE)     520.00     5    55.00\n"));
      commands.push(encoder.encode("3. CEYLON OIL(LEX/PEDA)BIG   580.00     5    55.00\n"));
      commands.push(encoder.encode("4. PARAG HASE GOLD(4L)BIG    360.00     1    50.00\n"));
      commands.push(encoder.encode("5. PARAG BASE GOLD(BLUE)     371.00     1    50.00\n"));
    }
    
    // Add footer totals - emphasize
    commands.push(encoder.encode("--------------------------------\n"));
    commands.push(new Uint8Array([0x1B, 0x45, 0x01])); // ESC E 1 - bold on
    commands.push(encoder.encode(`                      TOT    ${padLeft(order?.TotalAmount?.toFixed(2) || "16,101.75", 10)}\n`));
    commands.push(encoder.encode(`                      DIS    ${padLeft(order?.Discount?.toFixed(2) || "720.25", 10)}\n`));
    commands.push(encoder.encode(`                     VAT     ${padLeft((order?.TotalAmount * 0.08)?.toFixed(2) || "1,280.00", 10)}\n`));
    commands.push(encoder.encode(`                     VALUE   ${padLeft(order?.FinalAmount?.toFixed(2) || "9,958.75", 10)}\n`));
    commands.push(new Uint8Array([0x1B, 0x45, 0x00])); // ESC E 0 - bold off
    
    // Add footer
    commands.push(encoder.encode("--------------------------------\n"));
    commands.push(encoder.encode("Thank you for your purchase!\n"));
    commands.push(encoder.encode(businessInfo?.footer || "PATRON BASE POINT(CAPPED BLUE)\n"));
    
    // Feed and cut
    commands.push(new Uint8Array([0x0A, 0x0A, 0x0A, 0x0A])); // Line feeds
    commands.push(new Uint8Array([0x1D, 0x56, 0x41, 0x10])); // GS V A 16 - Cut paper
    
    // Combine all command arrays
    return concatArrays(commands);
  } catch (error) {
    console.error("Error generating ESC/POS commands:", error);
    throw error;
  }
};

/**
 * Print via Bluetooth for Android devices
 */
const printViaBluetooth = async (order, orderItems, businessInfo) => {
  try {
    // Request the Bluetooth device
    console.log('Requesting Bluetooth device...');
    
    // Common thermal printer services and characteristics
    const PRINTER_SERVICE_UUIDS = [
      '000018f0-0000-1000-8000-00805f9b34fb', // Generic printer service
      '49535343-fe7d-4ae5-8fa9-9fafd205e455', // Common ESC/POS printer service
      '38eb4a80-c570-11e3-9507-0002a5d5c51b', // Another common service
      '18f0',                                 // Shortened version sometimes used
      'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Additional printer service
      'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f', // Additional printer service
    ];
    
    const PRINTER_CHARACTERISTIC_UUIDS = [
      '00002af1-0000-1000-8000-00805f9b34fb', // Generic characteristic
      '49535343-8841-43f4-a8d4-ecbe34729bb3', // Common ESC/POS printer characteristic
      '38eb4a81-c570-11e3-9507-0002a5d5c51b', // Another common characteristic
      '2af1',                                 // Shortened version sometimes used
      'e7810a71-73ae-499d-8c15-faa9aef0c3f3', // Additional printer characteristic
      'bef8d6c9-9c21-4c9e-b632-bd58c1009f10', // Additional printer characteristic
    ];
    
    // First try to connect to a known printer by service
    let device;
    try {
      device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'Printer' },
          { namePrefix: 'BT' },
          { namePrefix: 'POS' },
          { namePrefix: 'TP' },
          { namePrefix: 'ZJ' },     // Zjiang printers
          { namePrefix: 'MTP' },    // Mobile thermal printers
          { namePrefix: 'MPT' },    // Another common prefix
          { namePrefix: 'RONGTA' }, // Rongta printers
          { namePrefix: 'EPSON' },  // Epson printers
          { namePrefix: 'Star' },   // Star Micronics printers
        ],
        optionalServices: PRINTER_SERVICE_UUIDS
      });
    } catch (initialError) {
      console.warn('Could not find printer with specific services, trying with acceptAllDevices:', initialError);
      
      // If that fails, allow the user to select any Bluetooth device
      device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: PRINTER_SERVICE_UUIDS
      });
    }
    
    console.log('Connecting to GATT server...');
    const server = await device.gatt.connect();
    
    // Try to find a supported service
    let service;
    let serviceUUID;
    
    for (const uuid of PRINTER_SERVICE_UUIDS) {
      try {
        service = await server.getPrimaryService(uuid);
        serviceUUID = uuid;
        console.log(`Found printer service: ${uuid}`);
        break;
      } catch (e) {
        console.log(`Service ${uuid} not available, trying next...`);
      }
    }
    
    if (!service) {
      // If no service found, try discovery
      console.log('No predefined services found, trying to discover services...');
      const services = await server.getPrimaryServices();
      if (services.length > 0) {
        service = services[0];
        serviceUUID = service.uuid;
        console.log(`Using discovered service: ${serviceUUID}`);
      } else {
        throw new Error('Could not find any services on this device');
      }
    }
    
    // Try to find a supported characteristic
    let characteristic;
    let characteristicUUID;
    
    for (const uuid of PRINTER_CHARACTERISTIC_UUIDS) {
      try {
        characteristic = await service.getCharacteristic(uuid);
        characteristicUUID = uuid;
        console.log(`Found printer characteristic: ${uuid}`);
        break;
      } catch (e) {
        console.log(`Characteristic ${uuid} not available, trying next...`);
      }
    }
    
    if (!characteristic) {
      // If no characteristic found, try discovery
      console.log('No predefined characteristics found, trying to discover characteristics...');
      const characteristics = await service.getCharacteristics();
      
      // Look for a writable characteristic
      for (const char of characteristics) {
        const properties = char.properties;
        if (properties && (properties.write || properties.writeWithoutResponse)) {
          characteristic = char;
          characteristicUUID = char.uuid;
          console.log(`Using discovered writable characteristic: ${characteristicUUID}`);
          break;
        }
      }
      
      if (!characteristic) {
        throw new Error('Could not find a writable characteristic on this device');
      }
    }
    
    // Generate ESC/POS commands for the receipt
    const commands = generateESCPOSCommands(order, orderItems, businessInfo);
    
    // Due to Bluetooth packet size limitations, we need to send data in chunks
    const CHUNK_SIZE = 512; // Most Bluetooth implementations accept at least 512 bytes per write
    
    for (let i = 0; i < commands.length; i += CHUNK_SIZE) {
      const chunk = commands.slice(i, i + CHUNK_SIZE);
      console.log(`Sending chunk ${Math.floor(i/CHUNK_SIZE) + 1}/${Math.ceil(commands.length/CHUNK_SIZE)}...`);
      
      try {
        if (characteristic.properties.writeWithoutResponse) {
          await characteristic.writeValueWithoutResponse(chunk);
        } else {
          await characteristic.writeValue(chunk);
        }
      } catch (writeError) {
        console.error('Error writing chunk:', writeError);
        // Try alternative write method if first fails
        if (characteristic.properties.writeWithoutResponse && !writeError.message.includes('writeValueWithoutResponse')) {
          await characteristic.writeValue(chunk);
        } else if (characteristic.properties.write && !writeError.message.includes('writeValue')) {
          await characteristic.writeValueWithoutResponse(chunk);
        } else {
          throw writeError;
        }
      }
      
      // Add a small delay between chunks to prevent buffer overflow on the printer
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('Print data sent successfully via Bluetooth');
    return { 
      success: true, 
      message: 'Receipt printed successfully via Bluetooth',
      device: device.name,
      serviceUUID,
      characteristicUUID
    };
    
  } catch (error) {
    console.error('Bluetooth printing error:', error);
    return {
      success: false,
      error: error,
      message: error.message || 'Error printing receipt via Bluetooth'
    };
  }
};

/**
 * Original print via Web Serial function with fixes for better error handling
 */
const printViaWebSerial = async (order, orderItems, businessInfo) => {
  console.log('Starting Web Serial print process...');
  
  let port = null;
  
  try {
    // Generate ESC/POS commands directly
    const commands = generateESCPOSCommands(order, orderItems, businessInfo);
    
    // Request access to a serial port
    console.log('Requesting serial port access...');
    port = await navigator.serial.requestPort();
    
    // Try common baud rates for thermal printers
    const baudRates = [9600, 19200, 38400, 57600, 115200];
    let connected = false;
    
    for (const baudRate of baudRates) {
      if (connected) break;
      
      try {
        console.log(`Trying baud rate: ${baudRate}...`);
        await port.open({ baudRate });
        connected = true;
        console.log(`Connected with baud rate: ${baudRate}`);
      } catch (err) {
        console.warn(`Failed to connect at ${baudRate} baud:`, err);
        // Close the port before trying the next baud rate
        try {
          await port.close();
        } catch (closeErr) {
          console.warn('Error closing port:', closeErr);
        }
      }
    }
    
    if (!connected) {
      throw new Error('Could not connect to printer at any common baud rate');
    }
    
    // Get a writer to send data to the printer
    console.log('Getting writer...');
    const writer = port.writable.getWriter();
    
    // Send data to the printer
    console.log('Sending data to printer...');
    await writer.write(commands);
    
    // Release the writer
    writer.releaseLock();
    
    console.log('Print data sent successfully');
    return { 
      success: true, 
      message: 'Receipt printed successfully' 
    };
    
  } catch (error) {
    console.error('Web Serial printing error:', error);
    
    // Fall back to react-thermal-printer
    try {
      console.log('Attempting fallback to react-thermal-printer...');
      
      // If port was opened but we got an error, try reopening with default settings
      if (port) {
        try {
          await port.close();
          await port.open({ baudRate: 9600 });
        } catch (closeError) {
          console.warn('Error resetting port:', closeError);
          port = await navigator.serial.requestPort();
          await port.open({ baudRate: 9600 });
        }
      }
      
      // Render receipt data using react-thermal-printer
      const data = await render(
        <Printer type="epson" width={42}>
          {/* Header */}
          <Text align="center" bold={true}>{businessInfo?.name || "OIL AFCO"}</Text>
          <Text align="center">{businessInfo?.address || "DS LANKA FOODS-KANDY/ITN-32 CASH"}</Text>
          <Text align="center">{businessInfo?.phone || "TEL: 077-2222194"}</Text>
          <Line />
          <Text align="center">INVOICE</Text>
          <Line />

          {/* Order details */}
          <Row left="Date/Time:" right={new Date().toLocaleDateString()} />
          <Row left="Invoice No:" right={order?.OrderID || "65281949737"} />
          <Line />

          {/* Items */}
          <Text>DESCRIPTION  PRICE  VALUE</Text>
          <Line />

          {orderItems && orderItems.length > 0 ? orderItems.map((item, index) => (
            <React.Fragment key={index}>
              <Text>{item.Name}</Text>
              <Row 
                left={`${item.Quantity} x ${item.UnitPrice?.toFixed(2) || '0.00'}`} 
                right={`${(item.Quantity * item.UnitPrice)?.toFixed(2) || '0.00'}`} 
              />
            </React.Fragment>
          )) : (
            <Text>No items</Text>
          )}

          {/* Totals */}
          <Line />
          <Row 
            left="TOTAL" 
            right={`Rs. ${order?.TotalAmount?.toFixed(2) || "6,985.75"}`} 
          />
          <Line />
          <Row 
            left="VAT" 
            right={`Rs. ${(order?.TotalAmount * 0.08)?.toFixed(2) || "558.86"}`} 
          />
          <Line />

          {/* Footer */}
          <Text align="center">Thank you for your purchase!</Text>
          <Text align="center">{businessInfo?.footer || "PATRON BASE POINT(CAPPED BLUE)"}</Text>
        </Printer>
      );
      
      // Get a writer to send data to the printer
      const writer = port.writable.getWriter();
      
      // Send data to the printer
      console.log('Sending react-thermal-printer data...');
      const textEncoder = new TextEncoder();
      const dataToSend = typeof data === 'string' ? textEncoder.encode(data) : data;
      await writer.write(dataToSend);
      
      // Release the writer
      writer.releaseLock();
      
      return { 
        success: true, 
        message: 'Receipt printed successfully with react-thermal-printer' 
      };
    } catch (fallbackError) {
      console.error('Fallback printing error:', fallbackError);
      return {
        success: false,
        error: error,
        message: 'Error printing receipt with both methods'
      };
    }
  } finally {
    // Close the port when done
    if (port && typeof port.close === 'function') {
      try {
        console.log('Closing printer connection...');
        await port.close();
      } catch (closeError) {
        console.error('Error closing port:', closeError);
      }
    }
  }
};

/**
 * Main function that handles all printing scenarios
 */
const printHandler = async (order, orderItems, businessInfo) => {
  // Check environment capabilities
  const environment = checkEnvironment();
  console.log('Environment check:', environment);
  
  // Log detailed environment information
  console.log('User Agent:', navigator.userAgent);
  console.log('Android?', environment.isAndroid);
  console.log('Chrome on Android?', environment.isChromeOnAndroid);
  console.log('Bluetooth API?', environment.supportsBluetooth);
  console.log('Serial API?', environment.supportsSerial);
  console.log('Secure Context?', window.isSecureContext);
  
  // If not in secure context (HTTPS), show error
  if (!window.isSecureContext) {
    alert('For security reasons, direct printing requires HTTPS.\nPlease access this application via HTTPS to enable direct printing.');
    return {
      success: false,
      message: 'HTTPS required for direct printing'
    };
  }
  
  // Choose printing method based on environment
  if (environment.isAndroid && environment.supportsBluetooth) {
    // Android device with Bluetooth support
    try {
      console.log('Attempting Bluetooth printing...');
      const result = await printViaBluetooth(order, orderItems, businessInfo);
      
      // If Bluetooth printing succeeded, return the result
      if (result.success) {
        return result;
      }
      
      // If Bluetooth printing failed, fall through to error
      console.warn('Bluetooth printing failed:', result.message || result.error);
      throw new Error(result.message || 'Bluetooth printing failed');
    } catch (bluetoothError) {
      console.error('Bluetooth printing error:', bluetoothError);
      
      // Show error to user
      alert('Direct printing to thermal printer failed: ' + 
            (bluetoothError.message || 'Could not connect to Bluetooth printer'));
      
      return {
        success: false,
        error: bluetoothError,
        message: 'Bluetooth printing failed'
      };
    }
  } else if (environment.supportsSerial) {
    // Desktop with Web Serial support
    try {
      console.log('Attempting Web Serial printing...');
      return await printViaWebSerial(order, orderItems, businessInfo);
    } catch (serialError) {
      console.error('Web Serial printing error:', serialError);
      
      // Show error to user
      alert('Direct printing to thermal printer failed: ' + 
            (serialError.message || 'Could not connect to printer via Web Serial'));
      
      return {
        success: false,
        error: serialError,
        message: 'Web Serial printing failed'
      };
    }
  }
  
  // No direct printing method available, explain why
  const issues = environment.issues.map(issue => `- ${issue}`).join('\n');
  
  alert('Direct printing to thermal printer is not available due to the following reasons:\n\n' + issues);
  
  return {
    success: false,
    message: 'Printing not available'
  };
};

// Export for use in other modules
export default printHandler;