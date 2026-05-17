const db = require("../models");
const Product = db.product;
const Warehouse = db.warehouselocation;
const ProductStorage = db.productstorage;

const getAllProductStorages = async () => {
  const productStorages = await ProductStorage.findAll({
    include: [
      {
        model: Product,
        required: true,
      },
      {
        model: Warehouse,
        required: true,
      },
    ],
  });
  return productStorages;
};

const getProductStorageByProductID = async (productID) => {
  const productStorageByProductID = await ProductStorage.findAll({
    where: { ProductID: productID },
    include: [
      {
        model: Warehouse,
        attributes: ['LocationID', 'WarehouseName'], 
      }
    ],
  });
  return productStorageByProductID;
};

const getProductStorageByLocationID = async (locationID) => {
  const productStorageByLocationID = await ProductStorage.findAll({
    where: { LocationID: locationID },
  });
  return productStorageByLocationID;
};

const getProductStorageByID = async (locationID, productID) => {
  const productStorage = await ProductStorage.findAll({
    where: {
      ProductID: productID,
      LocationID: locationID,
    },
  });
  return productStorage;
};

const addNewProductStorage = async (params) => {
  const { ProductID, LocationID, Quantity, LastUpdated } = params;

  const product = await Product.findByPk(ProductID);
  if (!product) {
    return {
      status: "fail",
      code: 404,
      message: `No Product Found with ProductID: ${ProductID}`,
    };
  }

  const location = await Warehouse.findByPk(LocationID);
  if (!location) {
    return {
      status: "fail",
      code: 404,
      message: `No Location Found with LocationID: ${LocationID}`,
    };
  }

  const existingStorage = await ProductStorage.findOne({
    where: {
      ProductID,
      LocationID,
    },
  });

  const date = Date();
  try {
    if (existingStorage) {
      const newQuantity =
        parseInt(existingStorage.Quantity) + parseInt(Quantity);
      await existingStorage.update({
        Quantity: newQuantity,
        LastUpdated: date,
      });

      return {
        status: "success",
        code: 200,
        data: existingStorage,
        message: `Inventory updated successfully.`,
      };
    } else {
      const newStorage = await ProductStorage.create({
        ProductID,
        LocationID,
        Quantity,
        LastUpdated,
      });
      return {
        status: "success",
        code: 201,
        data: newStorage,
        message: "New inventory record created successfully",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      code: 500,
      message: "Failed to add inventory",
      error: error.message,
    };
  }
};

const updateProductStorageByProductID = async (productID, params) => {
  const { LocationID, Quantity } = params;

  const location = await Warehouse.findByPk(LocationID);
  if (location == null) {
    return `No Location Found with LocationID: ${LocationID}`;
  }

  const updateRow = {
    LocationID,
    Quantity,
  };

  const row = await ProductStorage.update(updateRow, {
    where: { ProductID: productID },
  });
  return row;
};

const updateProductStorage = async (productID, locationID, updateBody) => {
  const { Quantity, LastUpdated } = updateBody;
  const storage = {
    Quantity,
    LastUpdated,
  };
  const row = await ProductStorage.update(storage, {
    where: {
      ProductID: productID,
      LocationID: locationID,
    },
  });

  return row;
};

const updateProductQuantity = async (ProductID, LocationID, params) => {
  const { Quantity, OrderType, TransactionType } = params;

  if (!Quantity || !OrderType || !TransactionType) {
    return null;
  }

  const product = await Product.findByPk(ProductID);
  if (!product) return "no product found";

  const location = await Warehouse.findByPk(LocationID);
  if (!location) return "no location found";

  const currentRow = await ProductStorage.findOne({
    where: {
      ProductID: ProductID,
      LocationID: LocationID,
    },
  });

  if (!currentRow) return "no product storage found";

  const currentQuantity = currentRow.Quantity;

  // return currentRow.Quantity

  if (OrderType === "purchaseOrder" && TransactionType === "FULFILL") {
    const newQuantity = currentQuantity + Number(Quantity);
    const updatedRow = await ProductStorage.update(
      { Quantity: newQuantity, LastUpdated: new Date() },
      { where: { ProductID, LocationID } }
    );
    return updatedRow;
  } else if (OrderType === "purchaseOrder" && TransactionType === "RETURN") {
    if (currentQuantity === 0) return "quantity is zero";
    if (Number(Quantity) > currentQuantity)
      return `Only ${currentQuantity} item(s) is in stock`;
    const newQuantity = currentQuantity - Number(Quantity);
    const updatedRow = await ProductStorage.update(
      { Quantity: newQuantity, LastUpdated: new Date() },
      { where: { ProductID, LocationID } }
    );
    return updatedRow;
  } else if (OrderType === "salesOrder" && TransactionType === "RETURN") {
    const newQuantity = currentQuantity + Number(Quantity);
    const updatedRow = await ProductStorage.update(
      { Quantity: newQuantity, LastUpdated: new Date() },
      { where: { ProductID, LocationID } }
    );
    return updatedRow;
  } else if (OrderType === "salesOrder" && TransactionType === "FULFILL") {
    if (currentQuantity === 0) return "quantity is zero";
    if (Number(Quantity) > currentQuantity)
      return `Only ${currentQuantity} item(s) is in stock`;
    const newQuantity = currentQuantity - Number(Quantity);
    const updatedRow = await ProductStorage.update(
      { Quantity: newQuantity, LastUpdated: new Date() },
      { where: { ProductID, LocationID } }
    );
    return updatedRow;
  }
};

const deleteProductStorage = async (productID, locationID) => {
  try {
    const deletedCount = await ProductStorage.destroy({
      where: {
        ProductID: productID,
        LocationID: locationID,
      },
    });

    if (deletedCount === 0) {
      return {
        status: "fail",
        code: 404,
        message: "No matching product storage record found",
      };
    }
    return {
      status: "success",
      code: 200,
      message: "Product storage record deleted successfully",
    };
  } catch (error) {
    console.error(error);
  }
};

// const getStockReportFunc = async ({locationId}) => {
//   try {
//     const queryStock = `
//        SELECT 
//     p.Name AS ProductName,
//     wl.WarehouseName AS WarehouseLocation,
//     COALESCE(ps.Quantity, 0) AS StockQuantity,
//     CASE 
//         WHEN COALESCE(ps.Quantity, 0) = 0 THEN 'Yes'
//         ELSE 'No'
//     END AS IsOutOfStock
// FROM products p
// LEFT JOIN productstorages ps ON p.ProductId = ps.ProductId
// LEFT JOIN warehouselocations wl ON ps.LocationId = wl.LocationId
// WHERE wl.LocationId = :locationId
// ORDER BY p.Name, wl.WarehouseName;
//         `;
//     const results = await sequelize.query(queryStock, {
//       type: sequelize.QueryTypes.SELECT,
//       replacements: { locationId },
//     });

//     return {
//       success: true,
//       data: results,
//       message: "Stock fetch success",
//     };
//   } catch (error) {
//     console.error("Error fetching stock report", error);
//     return {
//       success: false,
//       data: [],
//       message: "Failed to fetch stock report",
//     };
//   }
// };

const getStockReportFunc = async (locationId) => {
  // try {
  //   let queryStock = `
  //     SELECT 
  //       p.Name AS ProductName,
  //       wl.WarehouseName AS WarehouseLocation,
  //       COALESCE(ps.Quantity, 0) AS StockQuantity,
  //       CASE 
  //         WHEN COALESCE(ps.Quantity, 0) = 0 THEN 'Yes'
  //         ELSE 'No'
  //       END AS IsOutOfStock
  //     FROM products p
  //     LEFT JOIN productstorages ps ON p.ProductId = ps.ProductId
  //     LEFT JOIN warehouselocations wl ON ps.LocationId = wl.LocationId
  //     WHERE 1=1
  //   `;

  //   const replacements = {};

  //   if (locationId && locationId !== "all") {
  //     if (isNaN(parseInt(locationId))) {
  //       throw new Error("Invalid locationId");
  //     }
  //     queryStock += ` AND wl.LocationId = :locationId`;
  //     replacements.locationId = parseInt(locationId);
  //   }

  //   queryStock += ` ORDER BY p.Name, wl.WarehouseName;`;

  //   const results = await sequelize.query(queryStock, {
  //     type: sequelize.QueryTypes.SELECT,
  //     replacements,
  //   });

  //   // Format results (optional, as results already match the expected structure)
  //   const formattedResults = results.map((item) => ({
  //     ProductName: item.ProductName,
  //     WarehouseLocation: item.WarehouseLocation,
  //     StockQuantity: item.StockQuantity,
  //     IsOutOfStock: item.IsOutOfStock,
  //   }));

  //   return {
  //     success: true,
  //     data: formattedResults,
  //     message: formattedResults.length ? "Stock fetch success" : "No stock data found",
  //   };
  // } catch (error) {
  //   console.error("Error fetching stock report:", error.message);
  //   return {
  //     success: false,
  //     data: [],
  //     message: error.message || "Failed to fetch stock report",
  //   };
  // }

  console.log(`productsotage.service: ${locationId}`)

  try {
    let queryStock = `
      SELECT 
        p.Name AS ProductName,
        wl.WarehouseName AS WarehouseLocation,
        COALESCE(ps.Quantity, 0) AS StockQuantity,
        CASE 
          WHEN COALESCE(ps.Quantity, 0) = 0 THEN 'Yes'
          ELSE 'No'
        END AS IsOutOfStock
      FROM products p
      LEFT JOIN productstorages ps ON p.ProductId = ps.ProductId
      LEFT JOIN warehouselocations wl ON ps.LocationId = wl.LocationId
    `;

    const replacements = {};

    if (locationId && locationId !== "all") {
      if (isNaN(parseInt(locationId))) {
        throw new Error("Invalid locationId");
      }
      // Add WHERE clause for location filter
      queryStock += ` WHERE wl.LocationId = :locationId`;
      replacements.locationId = parseInt(locationId);
    }

    queryStock += ` ORDER BY p.Name, wl.WarehouseName;`;

    const results = await db.sequelize.query(queryStock, {
      type: db.sequelize.QueryTypes.SELECT,
      replacements,
    });

    const formattedResults = results.map((item) => ({
      ProductName: item.ProductName,
      WarehouseLocation: item.WarehouseLocation || 'No Location',
      StockQuantity: item.StockQuantity,
      IsOutOfStock: item.IsOutOfStock,
    }));

    return {
      success: true,
      data: formattedResults,
    };
  } catch (error) {
    console.error("Error fetching stock report:", error.message);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch stock report",
    };
  }

};


module.exports = {
  getAllProductStorages,
  getProductStorageByProductID,
  getProductStorageByLocationID,
  updateProductStorageByProductID,
  updateProductQuantity,
  addNewProductStorage,
  deleteProductStorage,
  updateProductStorage,
  getProductStorageByID,
  getStockReportFunc,
};
