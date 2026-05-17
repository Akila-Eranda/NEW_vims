// Final B4 Thermal Printer Function for Ashoka Rubber Industries
// Supports ESC/POS commands for B4 size thermal printing via Web Serial API

class AshokaRubberThermalPrinter {
    constructor() {
        this.port = null;
        this.isConnected = false;

        // Company Information
        this.companyInfo = {
            companyName: "Ashoka Rubber Industries",
            businessType: "DEALERS IN RADIATOR HOSE, AIR CLEANER HOSE, OIL HOSE AND POWER STEERING HOSE",
            address: "No. 89, Ruwanpura, Hapugasthalawa",
            phone: "0776 272 994, 0779 626 642",
            email: "info@ashokarubber.lk"
        };

        // ESC/POS Commands
        this.ESC = '\x1B';
        this.GS = '\x1D';
        this.FS = '\x1C';

        this.commands = {
            INIT: this.ESC + '@',           // Initialize printer
            ALIGN_LEFT: this.ESC + 'a0',    // Align left
            ALIGN_CENTER: this.ESC + 'a1',  // Align center
            ALIGN_RIGHT: this.ESC + 'a2',   // Align right
            BOLD_ON: this.ESC + 'E1',       // Bold on
            BOLD_OFF: this.ESC + 'E0',      // Bold off
            SIZE_NORMAL: this.GS + '!0',    // Normal size
            SIZE_DOUBLE: this.GS + '!17',   // Double width and height
            SIZE_WIDE: this.GS + '!16',     // Double width
            SIZE_TALL: this.GS + '!1',      // Double height
            UNDERLINE_ON: this.ESC + '-1',  // Underline on
            UNDERLINE_OFF: this.ESC + '-0', // Underline off
            CUT_PAPER: this.GS + 'V1',      // Cut paper
            NEWLINE: '\n',
            FEED_LINES: this.ESC + 'd',     // Feed n lines
            SET_LINE_SPACING: this.ESC + '3', // Set line spacing
            RESET_LINE_SPACING: this.ESC + '2', // Reset to default line spacing
            DOUBLE_STRIKE_ON: this.ESC + 'G1',
            DOUBLE_STRIKE_OFF: this.ESC + 'G0',
            EMPHASIZED_ON: this.ESC + 'E1',
            EMPHASIZED_OFF: this.ESC + 'E0'
        };
    }

    // Connect to thermal printer
    async connect() {
        try {
            if (!('serial' in navigator)) {
                throw new Error('Web Serial API not supported in this browser. Please use Chrome, Edge, or Opera.');
            }

            this.port = await navigator.serial.requestPort();
            await this.port.open({
                baudRate: 9600,
                dataBits: 8,
                stopBits: 1,
                parity: 'none',
                flowControl: 'none'
            });

            this.isConnected = true;
            console.log('Connected to thermal printer');
            return true;
        } catch (error) {
            console.error('Connection failed:', error.message);
            throw new Error(`Failed to connect to printer: ${error.message}`);
        }
    }

    // Disconnect from printer
    async disconnect() {
        if (this.port) {
            try {
                await this.port.close();
            } catch (error) {
                console.warn('Error during disconnect:', error.message);
            }
            this.port = null;
            this.isConnected = false;
            console.log('Disconnected from printer');
        }
    }

    // Send data to printer
    async sendToPrinter(data) {
        if (!this.port || !this.isConnected) {
            throw new Error('No printer connected. Please connect first.');
        }

        try {
            const writer = this.port.writable.getWriter();
            const encoder = new TextEncoder();
            await writer.write(encoder.encode(data));
            writer.releaseLock();
            console.log('Print job sent successfully');
            return true;
        } catch (error) {
            console.error('Print failed:', error.message);
            throw new Error(`Print failed: ${error.message}`);
        }
    }

    // Format text to fit B4 thermal printer width (80 characters)
    formatLine(left, right = '', width = 80) {
        const availableSpace = width - left.length - right.length;
        const padding = availableSpace > 0 ? ' '.repeat(availableSpace) : '';
        return (left + padding + right).substring(0, width) + '\n';
    }

    // Create separator line
    createSeparator(char = '-', width = 80) {
        return char.repeat(width) + '\n';
    }

    // Center text in given width
    centerText(text, width = 80) {
        const padding = Math.max(0, Math.floor((width - text.length) / 2));
        return ' '.repeat(padding) + text + '\n';
    }

    // Generate sales order number
    generateOrderNumber() {
        const timestamp = Date.now().toString();
        return `SO-${timestamp.slice(-8)}`;
    }

    // Format currency
    formatCurrency(amount) {
        return `Rs.${parseFloat(amount).toFixed(2)}`;
    }

    // Print sales order from JSON data
    async printSalesOrder(orderData) {
        if (!this.isConnected) {
            throw new Error('Please connect to printer first');
        }

        try {
            // Calculate totals
            const subtotal = orderData.orderItems.reduce((sum, item) => {
                return sum + (parseFloat(item.UnitPrice) * item.Quantity);
            }, 0);

            const taxRate = 0.10; // 10% tax
            const taxAmount = subtotal * taxRate;
            const total = subtotal + taxAmount;

            // Generate order details
            const orderNumber = this.generateOrderNumber();
            const currentDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            let printData = '';

            // Initialize printer
            printData += this.commands.INIT;
            printData += this.commands.RESET_LINE_SPACING;

            // Header Section
            printData += this.commands.ALIGN_CENTER + this.commands.BOLD_ON;
            printData += this.centerText('SALES ORDER', 80);
            printData += this.commands.SIZE_DOUBLE;
            printData += this.centerText(this.companyInfo.companyName, 80);
            printData += this.commands.SIZE_NORMAL + this.commands.BOLD_ON;
            printData += this.centerText(this.companyInfo.businessType, 80);
            printData += this.commands.BOLD_OFF;
            printData += this.centerText(this.companyInfo.address, 80);
            printData += this.centerText(`Tel: ${this.companyInfo.phone}`, 80);
            printData += this.centerText(`Email: ${this.companyInfo.email}`, 80);
            printData += this.commands.NEWLINE;

            // Separator
            printData += this.commands.ALIGN_LEFT;
            printData += this.createSeparator('=', 80);

            // Sales Order Details Section
            printData += this.commands.BOLD_ON;
            printData += this.formatLine('SALES ORDER DETAILS', '', 80);
            printData += this.commands.BOLD_OFF;
            printData += this.createSeparator('-', 80);

            printData += this.formatLine(`Order Number: ${orderNumber}`, `Date: ${currentDate}`, 80);
            printData += this.formatLine(`Customer: ${orderData.customerInfo.Name}`, `Order ID: ${orderData.orderItems[0]?.OrderId || 'N/A'}`, 80);
            printData += this.commands.NEWLINE;

            // Customer Information Section
            printData += this.commands.BOLD_ON;
            printData += this.formatLine('CUSTOMER INFORMATION:', '', 80);
            printData += this.commands.BOLD_OFF;
            printData += this.formatLine(orderData.customerInfo.Name, '', 80);

            // Include company name if available
            if (orderData.customerInfo.CompanyName && orderData.customerInfo.CompanyName.trim()) {
                printData += this.formatLine(orderData.customerInfo.CompanyName, '', 80);
            }

            printData += this.formatLine(orderData.customerAddress.Street, '', 80);
            printData += this.formatLine(`${orderData.customerAddress.City}, ${orderData.customerAddress.PostalCode}`, '', 80);

            if (orderData.customerAddress.Country) {
                printData += this.formatLine(orderData.customerAddress.Country, '', 80);
            }

            printData += this.formatLine(`Phone: ${orderData.customerInfo.Phone}`, '', 80);

            if (orderData.customerInfo.Email) {
                printData += this.formatLine(`Email: ${orderData.customerInfo.Email}`, '', 80);
            }

            printData += this.commands.NEWLINE;

            // Items Section
            printData += this.createSeparator('=', 80);
            printData += this.commands.BOLD_ON;
            printData += this.formatLine('ITEMS ORDERED', '', 80);
            printData += this.commands.BOLD_OFF;
            printData += this.createSeparator('-', 80);

            // Items Header
            printData += this.commands.BOLD_ON;
            printData += this.formatLine('DESCRIPTION', 'QTY    UNIT PRICE    TOTAL', 80);
            printData += this.commands.BOLD_OFF;
            printData += this.createSeparator('-', 80);

            // Items List
            orderData.orderItems.forEach((item, index) => {
                const itemTotal = parseFloat(item.UnitPrice) * item.Quantity;
                const description = item.product.Name;
                const quantity = item.Quantity.toString().padStart(3);
                const unitPrice = this.formatCurrency(item.UnitPrice).padStart(12);
                const totalPrice = this.formatCurrency(itemTotal).padStart(12);

                printData += this.formatLine(description, '', 80);
                printData += this.formatLine('', `${quantity}    ${unitPrice}    ${totalPrice}`, 80);

                // Include product description if available and meaningful
                if (item.product.Description &&
                    item.product.Description !== 'Desc' &&
                    item.product.Description.trim() !== '') {
                    printData += this.formatLine(`  ${item.product.Description}`, '', 80);
                }

                printData += this.commands.NEWLINE;
            });

            // Totals Section
            printData += this.createSeparator('-', 80);
            printData += this.commands.ALIGN_RIGHT;
            printData += this.formatLine('', `Subtotal: ${this.formatCurrency(subtotal)}`, 80);
            printData += this.formatLine('', `Tax (10%): ${this.formatCurrency(taxAmount)}`, 80);
            printData += this.createSeparator('-', 80);
            printData += this.commands.BOLD_ON + this.commands.SIZE_WIDE;
            printData += this.formatLine('', `TOTAL: ${this.formatCurrency(total)}`, 80);
            printData += this.commands.SIZE_NORMAL + this.commands.BOLD_OFF;
            printData += this.createSeparator('=', 80);

            // Terms and Conditions
            printData += this.commands.ALIGN_LEFT;
            printData += this.commands.BOLD_ON;
            printData += this.formatLine('TERMS & CONDITIONS:', '', 80);
            printData += this.commands.BOLD_OFF;
            printData += this.createSeparator('-', 80);
            printData += this.formatLine('- Payment due within 30 days of delivery', '', 80);
            printData += this.formatLine('- All products subject to quality inspection', '', 80);
            printData += this.formatLine('- Prices valid for 7 days from order date', '', 80);
            printData += this.formatLine('- Delivery charges may apply for remote areas', '', 80);
            printData += this.commands.NEWLINE;

            // Footer Section
            printData += this.createSeparator('=', 80);
            printData += this.commands.ALIGN_CENTER;
            printData += this.commands.BOLD_ON;
            printData += this.centerText('THANK YOU FOR YOUR BUSINESS!', 80);
            printData += this.commands.BOLD_OFF;
            printData += this.commands.NEWLINE;

            printData += this.centerText('For inquiries and support:', 80);
            printData += this.centerText(this.companyInfo.phone, 80);
            printData += this.centerText(this.companyInfo.email, 80);
            printData += this.commands.NEWLINE;

            printData += this.centerText(`Printed on: ${new Date().toLocaleString()}`, 80);
            printData += this.centerText('Ashoka Rubber Industries - Your Trusted Partner', 80);

            // Final spacing and cut
            printData += this.commands.NEWLINE + this.commands.NEWLINE;
            printData += this.commands.CUT_PAPER;

            // Send to printer
            await this.sendToPrinter(printData);
            return {
                success: true,
                orderNumber: orderNumber,
                total: total,
                itemCount: orderData.orderItems.length
            };

        } catch (error) {
            console.error('Print operation failed:', error);
            throw new Error(`Failed to print sales order: ${error.message}`);
        }
    }

    // Test printer connection
    async testPrint() {
        if (!this.isConnected) {
            throw new Error('Please connect to printer first');
        }

        const testData = this.commands.INIT +
            this.commands.ALIGN_CENTER +
            this.commands.BOLD_ON +
            'TEST PRINT\n' +
            this.commands.BOLD_OFF +
            'Ashoka Rubber Industries\n' +
            'Thermal Printer Connected Successfully\n' +
            new Date().toLocaleString() + '\n\n' +
            this.commands.CUT_PAPER;

        await this.sendToPrinter(testData);
        return true;
    }
}

// Convenience function for easy usage
async function printThermalSalesOrder(orderData) {
    const printer = new AshokaRubberThermalPrinter();

    try {
        // Connect to printer
        console.log('Connecting to thermal printer...');
        await printer.connect();

        // Print the sales order
        console.log('Printing sales order...');
        const result = await printer.printSalesOrder(orderData);

        console.log('Sales order printed successfully!');
        console.log(`Order Number: ${result.orderNumber}`);
        console.log(`Total Amount: Rs.${result.total.toFixed(2)}`);
        console.log(`Items: ${result.itemCount}`);

        return result;

    } catch (error) {
        console.log('Printing failed:', error.message);
    } finally {
        // Optional: Keep connection open for multiple prints
        // await printer.disconnect();
    }
}

// Example usage:
/*
const orderData = {
  customerInfo: {
    Name: "John Doe",
    CompanyName: "ABC Motors Ltd",
    Phone: "0771234567",
    Email: "john@abcmotors.lk"
  },
  customerAddress: {
    Street: "123 Main Street",
    City: "Colombo",
    PostalCode: "00100",
    Country: "Sri Lanka"
  },
  orderItems: [
    {
      OrderId: 1001,
      ProductID: 1,
      Quantity: 5,
      UnitPrice: "2500",
      product: {
        Name: "Radiator Hose - Honda Civic",
        Description: "High quality rubber radiator hose"
      }
    }
  ]
};

// To print:
printAshokaRubberSalesOrder(orderData)
  .then(result => console.log('Print completed:', result))
  .catch(error => console.error('Print failed:', error));
*/

// Export for module use
// if (typeof module !== 'undefined' && module.exports) {
//   module.exports = { AshokaRubberThermalPrinter, printAshokaRubberSalesOrder };
// }

module.exports = { printThermalSalesOrder }