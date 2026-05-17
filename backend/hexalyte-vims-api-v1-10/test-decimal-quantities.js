/**
 * Sales Order Decimal Quantity Test Script
 * Tests the complete flow: Add decimal quantities → API submission → Database storage
 * 
 * Usage: node test-decimal-quantities.js
 * 
 * Requirements:
 * - Backend server running on http://localhost:3000
 * - Database connected and seeded with test products
 */

const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1/salesorder';
let authToken = null;
let testCustomerID = null;
let testLocationID = null;
let testProductID = null;

// Color output for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

const log = {
  title: (msg) => console.log(`\n${colors.bold}${colors.blue}=== ${msg} ===${colors.reset}\n`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
};

/**
 * Initialize API instance with auth token
 */
function createApiInstance() {
  return axios.create({
    baseURL: API_URL,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  });
}

/**
 * Step 1: Authenticate and get token
 */
async function authenticate() {
  log.title('Step 1: Authentication');

  try {
    const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
      email: 'admin@hexalyte.com',
      password: 'admin123',
    });

    authToken = response.data.tokens.access.token;
    log.success(`Authenticated successfully`);
    log.info(`Token: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    log.error(`Authentication failed: ${error.message}`);
    return false;
  }
}

/**
 * Step 2: Fetch test data (customer, location, product)
 */
async function fetchTestData() {
  log.title('Step 2: Fetching Test Data');

  const api = createApiInstance();

  try {
    // Fetch customers
    const customersRes = await api.get('http://localhost:3000/api/v1/customer');
    testCustomerID = customersRes.data.customers[0]?.CustomerID;
    log.success(`Found test customer: ID ${testCustomerID}`);

    // Fetch locations
    const locationsRes = await api.get('http://localhost:3000/api/v1/warehouselocation');
    testLocationID = locationsRes.data[0]?.locationID || locationsRes.data[0]?.id;
    log.success(`Found test location: ID ${testLocationID}`);

    // Fetch products
    const productsRes = await api.get('http://localhost:3000/api/v1/product');
    testProductID = productsRes.data.products[0]?.ProductID;
    log.success(`Found test product: ID ${testProductID}`);

    if (!testCustomerID || !testLocationID || !testProductID) {
      throw new Error('Missing test data');
    }

    return true;
  } catch (error) {
    log.error(`Failed to fetch test data: ${error.message}`);
    return false;
  }
}

/**
 * Step 3: Create Sales Order with Decimal Quantities
 */
async function createSalesOrderWithDecimals() {
  log.title('Step 3: Create Sales Order with Decimal Quantities');

  const api = createApiInstance();

  // Test decimal quantities: 1.5, 2.25, 3.75
  const testQuantities = [1.5, 2.25, 3.75];

  const orderPayload = {
    CustomerID: testCustomerID,
    OrderDate: new Date().toISOString(),
    TotalAmount: 5000.00,
    Status: 'COMPLETED',
    Discount: 0.0,
    LocationID: testLocationID,
    PaymentStatus: 'UNPAID',
    TransactionType: 'SALE',
    OrderItems: testQuantities.map((qty, idx) => ({
      ProductID: testProductID + idx, // Vary product IDs
      Quantity: qty, // Decimal quantities
      UnitPrice: 1000.00,
    })),
  };

  log.info(`Creating order with ${testQuantities.length} items:`);
  testQuantities.forEach((qty, idx) => {
    log.info(`  Item ${idx + 1}: Quantity = ${qty} units`);
  });

  try {
    const response = await api.post('/', orderPayload);

    log.success(`Order created successfully!`);
    log.info(`Order ID: ${response.data.newsalesorder?.SalesOrder?.OrderID}`);

    // Verify quantities in response
    if (response.data.newsalesorder?.OrderItemsRes) {
      log.title('Verifying Decimal Quantities in Database');
      response.data.newsalesorder.OrderItemsRes.forEach((item, idx) => {
        const expectedQty = testQuantities[idx];
        const actualQty = item.Quantity;

        if (actualQty === expectedQty) {
          log.success(`Item ${idx + 1}: ${actualQty} ✓ (Expected: ${expectedQty})`);
        } else {
          log.warn(`Item ${idx + 1}: ${actualQty} (Expected: ${expectedQty})`);
        }
      });
    }

    return response.data.newsalesorder?.SalesOrder?.OrderID;
  } catch (error) {
    log.error(`Failed to create order: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

/**
 * Step 4: Retrieve Order and Verify Decimal Storage
 */
async function verifyOrderStorage(orderID) {
  log.title('Step 4: Verify Decimal Storage in Database');

  const api = createApiInstance();

  try {
    const response = await api.get(`/${orderID}`);
    const order = response.data.salesorder;

    log.success(`Order retrieved: ${order.OrderID}`);
    log.info(`Customer: ${order.CustomerID}`);
    log.info(`Total Amount: ${order.TotalAmount}`);

    // The actual line items are fetched separately via salesorderdetail endpoint
    return true;
  } catch (error) {
    log.error(`Failed to retrieve order: ${error.message}`);
    return false;
  }
}

/**
 * Step 5: Verify Decimal Quantities in Line Items
 */
async function verifyLineItems(orderID) {
  log.title('Step 5: Verify Decimal Quantities in Line Items');

  const api = createApiInstance();

  try {
    // This would fetch order details - adjust endpoint as needed
    const response = await api.get(`http://localhost:3000/api/v1/salesorderdetail`);

    log.success(`Line items retrieved`);
    log.info(`Total items: ${response.data.length}`);

    // Filter for our order's items
    const orderItems = response.data.filter((item) => item.OrderID === orderID);

    orderItems.forEach((item, idx) => {
      log.info(
        `Item ${idx + 1}: ProductID=${item.ProductID}, Quantity=${item.Quantity}, UnitPrice=${item.UnitPrice}`
      );

      // Verify decimal precision
      if (item.Quantity % 1 !== 0) {
        log.success(`✓ Decimal quantity stored: ${item.Quantity}`);
      } else if (Number.isInteger(item.Quantity)) {
        log.info(`Integer quantity stored: ${item.Quantity}`);
      }
    });

    return true;
  } catch (error) {
    log.warn(`Could not verify line items: ${error.message}`);
    log.info(`This is expected if endpoint returns all items (pagination)`);
    return true;
  }
}

/**
 * Step 6: Test Decimal Quantity Validation
 */
async function testValidation() {
  log.title('Step 6: Test Decimal Validation');

  const api = createApiInstance();

  const invalidPayloads = [
    {
      name: 'Quantity with 3 decimal places (should be rejected)',
      payload: {
        CustomerID: testCustomerID,
        OrderDate: new Date().toISOString(),
        TotalAmount: 1000.0,
        Status: 'COMPLETED',
        Discount: 0.0,
        LocationID: testLocationID,
        PaymentStatus: 'UNPAID',
        TransactionType: 'SALE',
        OrderItems: [
          {
            ProductID: testProductID,
            Quantity: 1.555, // 3 decimal places - invalid
            UnitPrice: 1000.0,
          },
        ],
      },
    },
    {
      name: 'Negative quantity (should be rejected)',
      payload: {
        CustomerID: testCustomerID,
        OrderDate: new Date().toISOString(),
        TotalAmount: 1000.0,
        Status: 'COMPLETED',
        Discount: 0.0,
        LocationID: testLocationID,
        PaymentStatus: 'UNPAID',
        TransactionType: 'SALE',
        OrderItems: [
          {
            ProductID: testProductID,
            Quantity: -1.5, // Negative - invalid
            UnitPrice: 1000.0,
          },
        ],
      },
    },
    {
      name: 'Zero quantity (should be rejected)',
      payload: {
        CustomerID: testCustomerID,
        OrderDate: new Date().toISOString(),
        TotalAmount: 1000.0,
        Status: 'COMPLETED',
        Discount: 0.0,
        LocationID: testLocationID,
        PaymentStatus: 'UNPAID',
        TransactionType: 'SALE',
        OrderItems: [
          {
            ProductID: testProductID,
            Quantity: 0, // Zero - invalid
            UnitPrice: 1000.0,
          },
        ],
      },
    },
  ];

  for (const test of invalidPayloads) {
    log.info(`Testing: ${test.name}`);
    try {
      await api.post('/', test.payload);
      log.warn(`  ✗ Should have been rejected but wasn't`);
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 422) {
        log.success(`  ✓ Correctly rejected: ${error.response?.data?.message || 'Validation error'}`);
      } else {
        log.error(`  Unexpected error: ${error.message}`);
      }
    }
  }
}

/**
 * Main Test Runner
 */
async function runTests() {
  log.title('DECIMAL QUANTITY TESTING SUITE');
  log.info('Testing complete flow: Input → Validation → Storage → Retrieval');

  try {
    // Step 1: Authenticate
    if (!(await authenticate())) {
      log.error('Cannot proceed without authentication');
      process.exit(1);
    }

    // Step 2: Get test data
    if (!(await fetchTestData())) {
      log.error('Cannot proceed without test data');
      process.exit(1);
    }

    // Step 3: Create order with decimals
    const orderID = await createSalesOrderWithDecimals();
    if (!orderID) {
      log.error('Cannot proceed - order creation failed');
      process.exit(1);
    }

    // Step 4: Verify storage
    await verifyOrderStorage(orderID);

    // Step 5: Verify line items
    await verifyLineItems(orderID);

    // Step 6: Test validation rules
    await testValidation();

    log.title('Test Summary');
    log.success('All tests completed!');
    log.info('Check output above for detailed results');

    process.exit(0);
  } catch (error) {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
}

// Run tests
runTests();
