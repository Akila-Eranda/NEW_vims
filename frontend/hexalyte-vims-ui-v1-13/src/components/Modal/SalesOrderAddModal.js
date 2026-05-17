import React, { useEffect, useMemo, useState, useRef } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Link } from "react-router-dom/cjs/react-router-dom";
import handlePrint from "components/Print/handlePrint";
import DiscountDropdown from "components/Dropdowns/DiscountDropdown";
import { createAxiosInstance } from "api/axiosInstance";
import Select from 'react-select';

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// Product Search Dropdown Component
const ProductSearchDropdown = ({
  products,
  selectedStorage,
  salesItem,
  setSalesItem,
  disabled
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter products based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(selectedStorage);
      return;
    }

    const filtered = selectedStorage.filter(storageItem => {
      const product = products.find(p => p.ProductID === storageItem.ProductID);
      if (!product) return false;

      const searchLower = searchTerm.toLowerCase();
      return (
        product.Name.toLowerCase().includes(searchLower) ||
        product.ProductID.toString().includes(searchLower) ||
        (product.SKU && product.SKU.toLowerCase().includes(searchLower))
      );
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedStorage, products]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductSelect = (productId) => {
    setSalesItem(si => ({ ...si, ProductID: productId }));

    // Set the search term to the selected product name
    const product = products.find(p => p.ProductID.toString() === productId);
    if (product) {
      setSearchTerm(product.Name);
    }

    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);

    // If input is cleared, reset the product selection
    if (!value) {
      setSalesItem(si => ({ ...si, ProductID: "0" }));
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const clearSelection = () => {
    setSearchTerm('');
    setSalesItem(si => ({ ...si, ProductID: "0" }));
    inputRef.current?.focus();
  };

  // Get current product name for display
  const selectedProduct = products.find(p => p.ProductID.toString() === salesItem.ProductID);
  const displayValue = selectedProduct ? selectedProduct.Name : searchTerm;

  // Reset search term when salesItem.ProductID changes to "0" from outside
  useEffect(() => {
    if (salesItem.ProductID === "0") {
      setSearchTerm('');
    }
  }, [salesItem.ProductID]);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Product
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
          placeholder={disabled ? "Select warehouse first" : "Search products..."}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={disabled}
          autoComplete="off"
        />

        {/* Clear button */}
        {searchTerm && !disabled && (
          <button
            type="button"
            className="absolute inset-y-0 right-8 flex items-center px-2 text-gray-400 hover:text-gray-600"
            onClick={clearSelection}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((storageItem) => {
              const product = products.find(p => p.ProductID === storageItem.ProductID);
              if (!product) return null;

              return (
                <div
                  key={storageItem.ProductID}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleProductSelect(storageItem.ProductID.toString())}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{product.Name}</div>
                      <div className="text-sm text-gray-500">
                        ID: {product.ProductID} | Stock: {storageItem.Quantity} units
                      </div>
                      {product.SKU && (
                        <div className="text-xs text-gray-400">SKU: {product.SKU}</div>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm font-medium text-green-600">
                        LKR {product.SellingPrice?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {storageItem.Quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-3 text-center text-gray-500">
              {searchTerm ? 'No products found matching your search' : 'No products available'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main SalesOrderAddModal Component
function SalesOrderAddModal({ setOpenAddSalesOrderModal, loadSalesOrders }) {
  const [warehouses, setWarehouses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productStorage, setProductStorage] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesOrder, setSalesOrder] = useState({
    OrderDate: new Date(),
    CustomerID: 0,
    TotalAmount: 0,
    Status: "STORE PICKUP",
    OrderType: "FULFILL",
    LocationID: "0",
    Discount: 0,
    DiscountID: null,
    PaymentStatus: 'UNPAID'
  });

  // console.log(salesOrder);
  const [salesItem, setSalesItem] = useState({
    ProductID: "0",
    SellingPrice: 0,
    Quantity: 0,
  });
  const [salesItems, setSalesItems] = useState([]);
  const [discounts, setDiscounts] = useState([])



  const warehouseOptions = useMemo(() => {
    return warehouses.map((warehouse) => ({
      value: warehouse.LocationID,
      label: warehouse.WarehouseName,
    }));
  }, [warehouses]);


  const customerOptions = useMemo(() => {
    return customers.map((customer) => ({
      value: customer.CustomerID,
      label: customer.Name,
    }));
  }, [customers]);


  function addSalesItem(e) {
    e.preventDefault();

    if (salesItem.ProductID === "0") {
      Swal.fire({
        icon: "warning",
        title: "Select a Product",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
      return;
    } else if (salesItem.Quantity <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Enter a Quantity",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
      return;
    } else if (
      salesItem.Quantity >
      selectedStorage.find((product) => product.ProductID.toString() === salesItem.ProductID).Quantity &&
      salesOrder.OrderType === "FULFILL"
    ) {
      Swal.fire({
        icon: "warning",
        title: "Quantity not available",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
      return;
    } else if (salesItems.find((i) => i.ProductID.toString() === salesItem.ProductID)) {
      if (
        (Number(salesItem.Quantity) +
          Number(salesItems.find((i) => i.ProductID.toString() === salesItem.ProductID).Quantity)) >
        selectedStorage.find((product) => product.ProductID.toString() === salesItem.ProductID).Quantity &&
        salesOrder.OrderType === "FULFILL"
      ) {
        Swal.fire({
          icon: "warning",
          title: "Quantity not available",
          background: "#f8fafc",
          confirmButtonColor: "#3b82f6"
        });
        return;
      }
    }

    const item = {
      ProductID: salesItem.ProductID,
      ProductName: products.find(product => product.ProductID.toString() === salesItem.ProductID).Name,
      Quantity: salesItem.Quantity,
      UnitPrice: salesItem.SellingPrice,
      TotalPrice: salesItem.Quantity * salesItem.SellingPrice
    };

    if (salesItems.find(s => s.ProductID === item.ProductID)) {
      setSalesItems((s) => {
        return s.map((i) =>
          i.ProductID === item.ProductID
            ? {
              ...i,
              Quantity: Number(i.Quantity) + Number(item.Quantity),
              TotalPrice: i.UnitPrice * (Number(i.Quantity) + Number(item.Quantity))
            }
            : i
        );
      });
    } else {
      setSalesItems((s) => [...s, item]);
    }

    setSalesItem(() => ({
      ProductID: "0",
      SellingPrice: 0,
      Quantity: 0,
    }));
  }

  function deleteSalesItem(ProductID) {
    setSalesItems((s) => s.filter((i) => i.ProductID !== ProductID));
  }

  // async function addSalesOrder() {
  //   if (salesItems.length === 0) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "Add at least one product",
  //       icon: "error",
  //       background: "#f8fafc",
  //       confirmButtonColor: "#3b82f6"
  //     });
  //     return;
  //   }

  //   try {
  //     const salesOrderInfo = {
  //       CustomerID: salesOrder.CustomerID,
  //       OrderDate: salesOrder.OrderDate,
  //       TotalAmount: salesOrder.TotalAmount,
  //       Status: salesOrder.Status,
  //       LocationID: salesOrder.LocationID,
  //       Discount: salesOrder.Discount,
  //       PaymentStatus: salesOrder.PaymentStatus,
  //       DiscountID: salesOrder.DiscountID
  //     };

  //     console.log(salesOrderInfo)
  //     const api1 = createAxiosInstance();
  //     const salesOrderRes = await api1.post(`salesorder`, salesOrderInfo);
  //     const salesOrderID = salesOrderRes.data?.newsalesorder?.OrderID;

  //     const salesOrderDetailsAdd = salesItems.map((i) => {
  //       const { Quantity, UnitPrice } = i;
  //       const api = createAxiosInstance();
  //       return api.post(
  //         `salesorderdetails`,
  //         { OrderId: salesOrderID, ProductId: i.ProductID, Quantity, UnitPrice }
  //       );
  //     });

  //     const inventoryTransactionsAdd = salesItems.map((i) => {
  //       const { ProductID, Quantity } = i;
  //       const api = createAxiosInstance();
  //       api.put(
  //         `productstorage/q/${ProductID}/${salesOrder.LocationID}`,
  //         { Quantity, OrderType: "salesOrder", TransactionType: salesOrder.OrderType }
  //       );

  //       api.put(
  //         `product/q/${ProductID}`,
  //         { QuantityInStock: Number(Quantity), OrderType: "salesOrder", TransactionType: salesOrder.OrderType }
  //       );

  //       return api.post(
  //         `transaction`,
  //         {
  //           SalesOrderID: salesOrderID,
  //           ProductID,
  //           Quantity,
  //           TransactionDate: new Date(),
  //           TransactionType: salesOrder.OrderType
  //         }
  //       );
  //     });
  //     const api = createAxiosInstance();
  //     const salesOrderDetailsResponse = await Promise.all(salesOrderDetailsAdd);
  //     const orderStatusHistoryResponse = await api.post(
  //       `orderstatushistory`,
  //       {
  //         NewStatus: salesOrder.Status,
  //         StatusChangeDate: new Date(),
  //         salesorderOrderID: salesOrderID
  //       }
  //     );

  //     loadSalesOrders();

  //     console.log(salesOrderRes)

  //     Swal.fire({
  //       title: "Success",
  //       text: "Sales Order Placed. Do you want to Print an Invoice ?",
  //       icon: "success",
  //       showCancelButton: true,
  //       confirmButtonColor: "#74BF04",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Print Invoice"
  //     }).then((result) => {
  //       if (result.isConfirmed) {

  //         if (salesOrderRes?.data?.newsalesorder) {
  //           handlePrint(salesOrderRes?.data?.newsalesorder)
  //         }

  //       }
  //     });

  //     setOpenAddSalesOrderModal(() => null);

  //   } catch (error) {
  //     console.log(error);
  //     Swal.fire({
  //       title: "Error",
  //       text: "Something went wrong",
  //       icon: "error",
  //       background: "#f8fafc",
  //       confirmButtonColor: "#3b82f6"
  //     });
  //   }
  // }

  async function addSalesOrder() {

    if (salesItems.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Add at least one product",
        icon: "error",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
      return;
    }

    try {

      const newSalesOrder = {
        CustomerID: salesOrder.CustomerID,
        OrderDate: salesOrder.OrderDate,
        Status: salesOrder.Status,
        Discount: salesOrder.Discount,
        DiscountID: salesOrder.DiscountID,
        LocationID: salesOrder.LocationID,
        PaymentStatus: salesOrder.PaymentStatus,
        TotalAmount: salesOrder.TotalAmount,
        TransactionType: salesOrder.OrderType,
        OrderItems: salesItems
      }

      const api = createAxiosInstance()
      const salesOrderRes = await api.post('salesorder', newSalesOrder)

      Swal.fire({
        title: "Success",
        text: "Sales Order Placed. Do you want to Print an Invoice ?",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#74BF04",
        cancelButtonColor: "#d33",
        confirmButtonText: "Print Invoice"
      }).then((result) => {
        if (result.isConfirmed) {

          if (salesOrderRes?.data?.newsalesorder) {
            handlePrint(salesOrderRes?.data?.newsalesorder?.SalesOrder)
          }

        }
      });

      setOpenAddSalesOrderModal(() => null);
      console.log(salesOrderRes)
      loadSalesOrders()

    } catch (error) {
      console.log(error)
      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
    }

  }

  async function fetchProducts() {
    const api = createAxiosInstance();
    try {
      const products = await api.get(`product`);

      if (products.status === 200) {
        setProducts(() => products.data.allProducts.filter(product => product.isActive !== false));
      }
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "No Products Found") {
        console.log("No Products Found");
      } else {
        console.log(error)
      }
    }
  }

  async function fetchWarehouses() {
    try {
      const api = createAxiosInstance();
      const warehousesResp = await api.get(`location`);
      if (warehousesResp.status === 200) {
        setWarehouses(() => warehousesResp.data.locations);
      }
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "no location found") {
        console.log("no location found");
      } else {
        console.log(error)
      }
    }
  }

  async function fetchCustomers() {
    try {
      const api = createAxiosInstance();
      const customersRes = await api.get(`customer`)
      if (customersRes.status === 200) {
        setCustomers(() => customersRes.data.allCustomers.filter(item => item.isActive !== false))
      }
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "No Customers Found") {
        console.log("No Customers Found");
      } else {
        console.log(error)
      }
    }
  }

  async function fetchProductStorages() {
    try {
      const api = createAxiosInstance();
      const productStoragesRes = await api.get(`productstorage`);
      if (productStoragesRes.status === 200) {
        setProductStorage(() => productStoragesRes.data);
      }
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "No Product storages found") {
        console.log("No Product storages found");
      } else {
        console.log(error)
      }
    }
  }

  async function fetchDiscounts() {
    try {
      const api = createAxiosInstance();
      const discountsRes = await api.get(`discounts/sales`)
      if (discountsRes.status === 200) {
        // console.log(discountsRes.data.discounts.filter(discount => discount.isActive === true))
        setDiscounts(() => discountsRes.data.discounts.filter(discount => discount.isActive !== false))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
    fetchProductStorages();
    fetchCustomers();
    fetchDiscounts();
  }, []);

  useEffect(() => {
    setSalesItems(() => []);
    if (salesOrder.LocationID === "0") return;

    fetchProductStorages();
    setSelectedStorage(() => productStorage.filter((ps) => ps.LocationID.toString() === salesOrder.LocationID));
  }, [salesOrder.LocationID]);

  // console.log(selectedStorage)

  useEffect(() => {
    if (salesItem.ProductID === "0") {
      setSalesItem((si) => ({ ...si, SellingPrice: 0 }));
    } else {
      setSalesItem((si) => ({
        ...si,
        SellingPrice: products.find((product) => product.ProductID.toString() === salesItem.ProductID).SellingPrice
      }));
    }
  }, [salesItem.ProductID]);

  useEffect(() => {
    const total = salesItems.reduce((sum, item) => sum + item.TotalPrice, 0) - Number(salesOrder.Discount);
    setSalesOrder((s) => ({ ...s, TotalAmount: total }));
  }, [salesItems, salesOrder.Discount]);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-11/12 lg:w-4/5 my-6 mx-auto max-w-6xl"
        >
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Add Sales Order
              </h3>
              <button
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                onClick={() => setOpenAddSalesOrderModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Content */}
            <div className="p-6">
              {/* Order Info Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Order Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                    <div className="relative">
                      <select
                        className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white"
                        value={salesOrder.LocationID}
                        onChange={(e) => setSalesOrder((s) => ({ ...s, LocationID: e.target.value }))}
                      >
                        <option value="0">Select Warehouse</option>
                        {warehouses.map((warehouse) => (
                          <option key={warehouse.LocationID} value={warehouse.LocationID}>
                            {warehouse.WarehouseName}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg> */}
                      {/* </div>
                    </div>
                  </div> */} 

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                    <div className="relative">
                      <Select
                        options={warehouseOptions} // Array of options for warehouses
                        value={warehouseOptions.find(option => option.value === salesOrder.LocationID)} // Display selected warehouse
                        onChange={(selectedOption) => setSalesOrder((s) => ({ ...s, LocationID: String(selectedOption?.value) }))} className={`w-full ${salesOrder.LocationID === "0" ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Select Warehouse"
                        isSearchable // Allows searching through options
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <div className="relative">
                      <Select
                        options={customerOptions} // Array of options for warehouses
                        value={customerOptions.find(option => option.value === salesOrder.CustomerID)} // Display selected warehouse
                        onChange={(selectedOption) => setSalesOrder((s) => ({ ...s, CustomerID: String(selectedOption?.value) }))} className={`w-full ${salesOrder.CustomerID === "0" ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Select Warehouse"
                        isSearchable // Allows searching through options
                      />
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <div className="relative flex gap-3">
                      <select
                        className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white"
                        value={salesOrder.CustomerID}
                        onChange={(e) => setSalesOrder((s) => ({ ...s, CustomerID: e.target.value }))}
                      >
                        <option value="0">Select Customer</option>
                        {customers.map((customer) => (
                          <option key={customer.CustomerID} value={customer.CustomerID}>
                            {customer.CustomerID} - {customer.Name}
                          </option>
                        ))}
                      </select>

                      <Link
                        className=" w-3/12 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:bg-blue-300"
                        to="manage-customers"
                      >
                        <i className="fas fa-user-plus"></i>
                      </Link>
                    </div>
                  </div> */}

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                    <div className="relative">
                      <select
                        className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                        value={salesOrder.OrderType}
                        onChange={(e) => setSalesOrder((s) => ({ ...s, OrderType: e.target.value }))}
                        disabled={salesOrder.LocationID === "0"}
                      >
                        <option value="FULFILL">FULFILL</option>
                        <option value="RETURN">RETURN</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg> */}
                  {/* </div>
                    </div>
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                    <div className="relative">
                      <select
                        className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                        value={salesOrder.Status}
                        onChange={(e) => setSalesOrder((s) => ({ ...s, Status: e.target.value }))}
                        disabled={salesOrder.LocationID === "0"}
                      >
                        <option value="STORE PICKUP">Store Pickup</option>
                        <option value="TO DELIVER">To Deliver</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg> */}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <div className="relative">
                      <select
                        className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                        value={salesOrder.PaymentStatus}
                        onChange={(e) => setSalesOrder((s) => ({ ...s, PaymentStatus: e.target.value }))}
                        disabled={salesOrder.LocationID === "0"}
                      >
                        <option value="UNPAID">UNPAID</option>
                        <option value="PAID">PAID</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Product Form */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Add Product
                </h4>
                <form onSubmit={addSalesItem} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <ProductSearchDropdown
                        products={products}
                        selectedStorage={selectedStorage}
                        salesItem={salesItem}
                        setSalesItem={setSalesItem}
                        disabled={salesOrder.LocationID === "0"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (LKR)</label>
                      <input
                        type="text"
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-gray-100 read-only:bg-gray-100"
                        value={salesItem.SellingPrice}
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                        placeholder="Enter Quantity"
                        value={salesItem.Quantity}
                        onChange={(e) => setSalesItem((si) => ({ ...si, Quantity: e.target.value }))}
                        disabled={salesOrder.LocationID === "0"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-transparent mb-1">Add</label>
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:bg-blue-300"
                        disabled={salesOrder.LocationID === "0"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Item
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Product List */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Order Items
                </h4>
                <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salesItems.length > 0 ? (
                        salesItems.map((unit, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.ProductID}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.ProductName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{unit.Quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{unit.UnitPrice.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{unit.TotalPrice.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button
                                onClick={() => deleteSalesItem(unit.ProductID)}
                                className="text-red-600 hover:text-red-900 transition duration-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                            No items added yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              {/* <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <label className="block text-sm font-medium text-gray-700 mr-3">Discount (LKR):</label>
                    <input
                      type="number"
                      className="w-40 px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                      value={salesOrder.Discount}
                      onChange={(e) => setSalesOrder((s) => ({ ...s, Discount: e.target.value }))}
                      disabled={salesOrder.LocationID === "0"}
                    />
                  </div>
                  <div className="flex items-center mb-4 md:mb-0">

                    <DiscountDropdown
                      availableDiscounts={[{
                        ID: 1,
                        Name: "Holiday Special",
                        Code: "HOLIDAY10", // optional
                        Type: "percentage", // or "amount"
                        Value: 10, // 10% or 10 LKR
                        Description: "Holiday discount", // optional
                        MinAmount: 1000, // optional minimum purchase amount
                        IsActive: true
                      }]}
                      salesOrder={salesOrder}
                      setSalesOrder={setSalesOrder}
                      disabled={false}
                    />

                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-700 mr-3">Grand Total:</span>
                    <span className="text-xl font-bold text-blue-700">
                      LKR {salesOrder.TotalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div> */}

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex flex-wrap items-end justify-between gap-4">

                  {/* Compact Discount Section - Left Corner */}
                  <div className="flex items-end gap-3">
                    {/* Manual Discount Input */}
                    <div className="flex flex-col">
                      <label className="text-xs font-medium text-gray-600 mb-1">Manual Discount</label>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-28 px-2 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                          value={salesOrder.Discount}
                          onChange={(e) => setSalesOrder((s) => ({ ...s, Discount: e.target.value, DiscountID: null }))}
                          disabled={salesOrder.LocationID === "0"}
                          placeholder="0"
                        />
                        {/* <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">LKR</span> */}
                      </div>
                    </div>

                    {/* Compact OR Divider */}
                    {/* <div className="flex items-center pb-2">
                      <span className="text-xs text-gray-400 font-medium px-2">or</span>
                    </div> */}

                    {/* Compact Predefined Discount Dropdown */}
                    <div className="flex flex-col min-w-[200px]">
                      <DiscountDropdown
                        availableDiscounts={discounts}
                        salesOrder={salesOrder}
                        setSalesOrder={setSalesOrder}
                        disabled={salesOrder.LocationID === "0"}
                      />
                    </div>

                    {/* Active Discount Indicator */}
                    {(salesOrder.DiscountID || (salesOrder.Discount > 0)) && (
                      <div className="flex items-center pb-2">
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {salesOrder.DiscountID ? 'Applied' : `LKR ${parseFloat(salesOrder.Discount).toLocaleString()}`}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Grand Total - Right Side */}
                  <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-sm font-medium text-gray-600 mr-3">Grand Total:</span>
                    <span className="text-lg font-bold text-blue-700">
                      LKR {salesOrder.TotalAmount.toLocaleString()}
                    </span>
                  </div>

                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                onClick={() => setOpenAddSalesOrderModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                onClick={addSalesOrder}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Create Sales Order
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SalesOrderAddModal;