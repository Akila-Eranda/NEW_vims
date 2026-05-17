const generateESCPOSCommands = (order, orderItems, customerInfo, customerAddress, products) => {
  const encoder = new TextEncoder();
  const commands = [];

  // Initialize printer
  commands.push(new Uint8Array([0x1B, 0x40])); // ESC @

  // Set right alignment for header
  commands.push(new Uint8Array([0x1B, 0x61, 0x02])); // ESC a 2

  // Business info section
  commands.push(encoder.encode(customerInfo?.name || "OIL AFCO\n"));
  commands.push(encoder.encode(customerInfo?.address || "DS LANKA FOODS-KANDY/ITN-32 CASH\n"));
  commands.push(encoder.encode(customerInfo?.phone || "TEL: 077-2222194\n"));

  // Set left alignment
  commands.push(new Uint8Array([0x1B, 0x61, 0x00])); // ESC a 0

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

  // Header for sales oil section
  commands.push(encoder.encode("------ SALES OIL OIL ------\n"));

  // Items section table header
  commands.push(encoder.encode("DESCRIPTION             PRICE    QTY    VALUE\n"));
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

  // Add footer totals
  commands.push(encoder.encode("--------------------------------\n"));
  commands.push(encoder.encode(`                      TOT    ${padLeft(order?.TotalAmount?.toFixed(2) || "16,101.75", 10)}\n`));
  commands.push(encoder.encode(`                      DIS    ${padLeft(order?.Discount?.toFixed(2) || "720.25", 10)}\n`));
  commands.push(encoder.encode(`                     VAT     ${padLeft((order?.TotalAmount * 0.08)?.toFixed(2) || "1,280.00", 10)}\n`));
  commands.push(encoder.encode(`                     VALUE   ${padLeft(order?.FinalAmount?.toFixed(2) || "9,958.75", 10)}\n`));

  // Add footer
  commands.push(encoder.encode("--------------------------------\n"));
  commands.push(encoder.encode("Thank you for your purchase!\n"));
  commands.push(encoder.encode(customerInfo?.footer || "PATRON BASE POINT(CAPPED BLUE)\n"));

  // Feed and cut
  commands.push(new Uint8Array([0x0A, 0x0A, 0x0A, 0x0A])); // Line feeds
  commands.push(new Uint8Array([0x1D, 0x56, 0x41, 0x10])); // GS V A 16 - Cut paper

  // Combine all command arrays
  return concatArrays(commands);
};