// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import ProductAddModal from "components/Modal/ProductAddModelV1";
// import { motion } from "framer-motion"; // Import the motion component from framer-motion

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// function OrderAddModal({ setOpenModal, loadPurchaseOrders }) {
//     const [openCategoryModal, setCategoryAddModal] = useState(false);
//     const [products, setProducts] = useState([]);
//     const [errors, setErrors] = useState({});
//     const date = new Date();
//     const [newOrder, setNewOrder] = useState({
//         TotalAmount: "",
//         Status: "",
//         OrderDate: date,
//     });
//     const [locationID, setLocationID] = useState("");
//     const [productID, setProductID] = useState("");
//     const [unitPrice, setUnitPrice] = useState(0);
//     const [quantity, setQuantity] = useState(0);
//     const [orderDetails, setOrderDetails] = useState([]);
//     const [warehouseLocations, setWarehouseLocations] = useState([]);
//     const [transactionType, setTransactionType] = useState("");
//     const [discount, setDiscount] = useState(0);

//     const handleChange = (e) => {
//         setNewOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     const handleTransactionChange = (e) => {
//         setTransactionType(e.target.value);
//     };

//     const handleProductChange = (e) => {
//         setProductID(e.target.value);
//         const selectedProduct = products.find(p => p.ProductID.toString() === e.target.value);
//         if (selectedProduct) {
//             setUnitPrice(selectedProduct.BuyingPrice);
//         } else {
//             setUnitPrice("0");
//         }
//     };

//     const handleLocationChange = (e) => {
//         setLocationID(e.target.value);
//     };

//     const handleDeleteProduct = (index) => {
//         const deletedProduct = orderDetails[index];
//         setOrderDetails(prev => prev.filter((_, i) => i !== index));

//         setNewOrder(prev => ({
//             ...prev,
//             TotalAmount: (parseFloat(prev.TotalAmount || 0) - deletedProduct.TotalPrice).toString()
//         }));
//     };

//     const handleAddProduct = (e) => {
//         e.preventDefault();

//         if (!productID) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Select a Product",
//                 background: "#f8fafc",
//                 confirmButtonColor: "#3b82f6"
//             });
//             return;
//         }
//         if (unitPrice < 1) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Enter a Valid Unit Price",
//                 background: "#f8fafc",
//                 confirmButtonColor: "#3b82f6"
//             });
//             return;
//         }
//         if (quantity < 1) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Enter a Valid Quantity",
//                 background: "#f8fafc",
//                 confirmButtonColor: "#3b82f6"
//             });
//             return;
//         }

//         const selectedProduct = products.find((product) => product.ProductID.toString() === productID);
//         if (!selectedProduct) return;

//         const existingProductIndex = orderDetails.findIndex(item => item.ProductID === productID);

//         if (existingProductIndex !== -1) {
//             setOrderDetails(prev => {
//                 const updatedDetails = [...prev];
//                 const existingProduct = updatedDetails[existingProductIndex];

//                 const updatedQuantity = existingProduct.Quantity + Number(quantity);
//                 const updatedTotalPrice = existingProduct.UnitPrice * updatedQuantity;

//                 updatedDetails[existingProductIndex] = {
//                     ...existingProduct,
//                     Quantity: updatedQuantity,
//                     TotalPrice: updatedTotalPrice
//                 };

//                 return updatedDetails;
//             });

//             setNewOrder(prev => ({
//                 ...prev,
//                 TotalAmount: (parseFloat(prev.TotalAmount || 0) + (unitPrice * quantity)).toString()
//             }));
//         } else {
//             const newProduct = {
//                 ProductID: productID,
//                 ProductName: selectedProduct.Name,
//                 UnitPrice: unitPrice,
//                 Quantity: Number(quantity),
//                 TotalPrice: unitPrice * quantity,
//             };

//             setOrderDetails(prev => [...prev, newProduct]);

//             setNewOrder(prev => ({
//                 ...prev,
//                 TotalAmount: (parseFloat(prev.TotalAmount || 0) + newProduct.TotalPrice).toString()
//             }));
//         }

//         setProductID("");
//         setUnitPrice(0);
//         setQuantity(0);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const validationErrors = {};

//         if (!newOrder.TotalAmount) {
//             validationErrors.TotalAmount = "Total Amount is required";
//         } else if (isNaN(newOrder.TotalAmount) || parseFloat(newOrder.TotalAmount) <= 0) {
//             validationErrors.TotalAmount = "Please enter a valid positive number";
//         }

//         if (!newOrder.Status.trim()) {
//             validationErrors.Status = "Status is required";
//         }

//         if (!locationID.trim()) {
//             validationErrors.locationID = "Location is required";
//         }

//         if (orderDetails.length === 0) {
//             validationErrors.orderDetails = "At least one product is required";
//         }

//         setErrors(validationErrors);

//         if (Object.keys(validationErrors).length === 0) {
//             await addPurchaseOrder();
//         }
//     };

//     async function addPurchaseOrder() {
//         try {
//             try {
//                 if (transactionType === "FULFILL") {
//                     const productStoragePromises = orderDetails.map((detail) => {
//                         return axios.post(`${BASE_URL}productstorage`, {
//                             ProductID: detail.ProductID,
//                             LocationID: locationID,
//                             Quantity: detail.Quantity,
//                             LastUpdated: Date(),
//                         }, { withCredentials: true });
//                     });
//                     await Promise.all(productStoragePromises);
//                 } else {
//                     const updateProductStroragePromises = orderDetails.map((detail) => {
//                         return axios.put(`${BASE_URL}productstorage/q/${detail.ProductID}/${locationID}`, {
//                             Quantity: detail.Quantity,
//                             OrderType: "purchaseOrder",
//                             TransactionType: transactionType,
//                         }, { withCredentials: true });
//                     });
//                     await Promise.all(updateProductStroragePromises);
//                 }

//                 try {
//                     const orderResponse = await axios.post(`${BASE_URL}purchaseorders`, {
//                         TotalAmount: parseFloat(newOrder.TotalAmount),
//                         Status: newOrder.Status,
//                         OrderDate: newOrder.OrderDate
//                     }, { withCredentials: true });

//                     const orderId = orderResponse.data?.purchaseOrder?.OrderID;
//                     const detailsPromises = orderDetails.map((detail) => {
//                         return axios.post(`${BASE_URL}purchaseorderdetail`, {
//                             ProductID: detail.ProductID,
//                             Quantity: detail.Quantity,
//                             UnitPrice: detail.UnitPrice,
//                             OrderID: orderId,
//                         }, { withCredentials: true });
//                     });
//                     await Promise.all(detailsPromises);

//                     await axios.post(`${BASE_URL}orderstatushistory`, {
//                         NewStatus: newOrder.Status,
//                         StatusChangeDate: new Date(),
//                         purchaseorderOrderID: orderId
//                     }, { withCredentials: true });

//                     const inventoryTransactionPromises = orderDetails.map((detail) => {
//                         return axios.post(`${BASE_URL}transaction`, {
//                             PurchaseOrderID: orderId,
//                             ProductID: detail.ProductID,
//                             Quantity: detail.Quantity,
//                             TransactionDate: Date(),
//                             TransactionType: transactionType,
//                         }, { withCredentials: true });
//                     });

//                     await Promise.all(inventoryTransactionPromises);

//                     const productQuentityPromises = orderDetails.map((detail) => {
//                         return axios.put(`${BASE_URL}product/q/${detail.ProductID}`, {
//                             QuantityInStock: detail.Quantity,
//                             OrderType: "purchaseOrder",
//                             TransactionType: transactionType,
//                         }, { withCredentials: true });
//                     });

//                     await Promise.all(productQuentityPromises);

//                     Swal.fire({
//                         title: "Success!",
//                         text: "Purchase order created successfully",
//                         icon: "success",
//                         background: "#f8fafc",
//                         confirmButtonColor: "#3b82f6"
//                     });

//                     loadPurchaseOrders();
//                     setOpenModal(false);

//                 } catch (error) {
//                     console.log(error);
//                     Swal.fire({
//                         title: "Error",
//                         text: `Can't Create Purchase Order. ${error.response.data.message}`,
//                         icon: "error",
//                         background: "#f8fafc",
//                         confirmButtonColor: "#3b82f6"
//                     });
//                 }
//             } catch (error) {
//                 if (error.response.status === 400) {
//                     Swal.fire({
//                         title: "Error",
//                         text: `Invalid Quantity. ${error.response.data.message}`,
//                         icon: "error",
//                         background: "#f8fafc",
//                         confirmButtonColor: "#3b82f6"
//                     });
//                 }
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     async function loadProductData() {
//         try {
//             const productsRes = await axios.get(`${BASE_URL}product`, { withCredentials: true });
//             setProducts(productsRes.data.allProducts.filter(product => product.isActive !== false));
//         } catch (error) {
//             if (error.status === 404 && error.response.data.message === "No Products Found") {
//                 console.log("No Products Found");
//             } else {
//                 console.log(error)
//             }
//         }
//     }

//     useEffect(() => {
//         loadProductData();
//     }, []);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const locationsRes = await axios.get(`${BASE_URL}location`, { withCredentials: true });
//                 setWarehouseLocations(locationsRes.data.locations);
//             } catch (error) {
//                 if (error.status === 404 && error.response.data.message === "no location found") {
//                     console.log("no location found");
//                 } else {
//                     console.log(error)
//                 }
//             }
//         };
//         fetchData();
//     }, []);

//     return (
//         <>
//             <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.3 }}
//                     className="relative w-11/12 lg:w-4/5 my-6 mx-auto max-w-6xl"
//                 >
//                     <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
//                         {/* Header */}
//                         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
//                             <h3 className="text-2xl font-bold text-white flex items-center">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                                 </svg>
//                                 Add Purchase Order
//                             </h3>
//                             <button
//                                 className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
//                                 onClick={() => setOpenModal(false)}
//                             >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             </button>
//                         </div>

//                         {/* Main Content */}
//                         <div className="p-6">
//                             {/* Order Info Section */}
//                             <div className="mb-8">
//                                 <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                     Order Information
//                                 </h4>
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
//                                         <div className="relative">
//                                             <select
//                                                 className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white"
//                                                 value={locationID}
//                                                 onChange={handleLocationChange}
//                                             >
//                                                 <option value="">Select Warehouse</option>
//                                                 {warehouseLocations.map((warehouse) => (
//                                                     <option key={warehouse.LocationID} value={warehouse.LocationID}>
//                                                         {warehouse.WarehouseName}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                         {errors.locationID && (
//                                             <div className="text-red-500 text-xs mt-1">{errors.locationID}</div>
//                                         )}
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
//                                         <div className="relative">
//                                             <select
//                                                 className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
//                                                 value={transactionType}
//                                                 onChange={handleTransactionChange}
//                                                 disabled={!locationID}
//                                             >
//                                                 <option value="">Select Type</option>
//                                                 <option value="FULFILL">FULFILL</option>
//                                                 <option value="RETURN">RETURN</option>
//                                             </select>
//                                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
//                                         <div className="relative">
//                                             <select
//                                                 name="Status"
//                                                 value={newOrder.Status}
//                                                 onChange={handleChange}
//                                                 className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
//                                                 disabled={!locationID}
//                                             >
//                                                 <option value="">Select Status</option>
//                                                 <option value="Pending">Pending</option>
//                                                 <option value="Processing">Processing</option>
//                                                 <option value="Completed">Completed</option>
//                                             </select>
//                                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                         {errors.Status && (
//                                             <div className="text-red-500 text-xs mt-1">{errors.Status}</div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Add Product Form */}
//                             <div className="mb-8">
//                                 <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                     Add Product
//                                 </h4>
//                                 <form onSubmit={handleAddProduct} className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                                         <div className="md:col-span-2">
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
//                                             <div className="relative flex space-x-2">
//                                                 <select
//                                                     className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
//                                                     value={productID}
//                                                     onChange={handleProductChange}
//                                                     disabled={!locationID}
//                                                 >
//                                                     <option value="">Select Product</option>
//                                                     {products.map((product) => (
//                                                         <option key={product.ProductID} value={product.ProductID}>
//                                                             {product.Name}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => setCategoryAddModal(true)}
//                                                     className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                                                 >
//                                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                                                     </svg>
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (LKR)</label>
//                                             <input
//                                                 type="text"
//                                                 name="UnitPrice"
//                                                 value={unitPrice}
//                                                 className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-gray-100 read-only:bg-gray-100"
//                                                 placeholder="Unit Price"
//                                                 readOnly
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
//                                             <input
//                                                 type="number"
//                                                 name="Quantity"
//                                                 value={quantity}
//                                                 onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
//                                                 className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
//                                                 placeholder="Enter Quantity"
//                                                 disabled={!locationID}
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-transparent mb-1">Add</label>
//                                             <button
//                                                 type="submit"
//                                                 className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:bg-blue-300"
//                                                 disabled={!locationID}
//                                             >
//                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                                                 </svg>
//                                                 Add Item
//                                             </button>
//                                         </div>
//                                     </div>
//                                     {errors.orderDetails && (
//                                         <div className="text-red-500 text-xs mt-2">{errors.orderDetails}</div>
//                                     )}
//                                 </form>
//                             </div>

//                             {/* Product List */}
//                             <div className="mb-6">
//                                 <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                                     </svg>
//                                     Order Items
//                                 </h4>
//                                 <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
//                                     <table className="min-w-full divide-y divide-gray-200">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
//                                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
//                                                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                                                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
//                                                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
//                                                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-white divide-y divide-gray-200">
//                                             {orderDetails.length > 0 ? (
//                                                 orderDetails.map((detail, index) => (
//                                                     <motion.tr
//                                                         key={index}
//                                                         initial={{ opacity: 0, y: 10 }}
//                                                         animate={{ opacity: 1, y: 0 }}
//                                                         transition={{ duration: 0.3 }}
//                                                     >
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detail.ProductID}</td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detail.ProductName}</td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{detail.Quantity}</td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{detail.UnitPrice.toLocaleString()}</td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{detail.TotalPrice.toLocaleString()}</td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
//                                                             <button
//                                                                 onClick={() => handleDeleteProduct(index)}
//                                                                 className="text-red-600 hover:text-red-900 transition duration-200"
//                                                             >
//                                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                                                 </svg>
//                                                             </button>
//                                                         </td>
//                                                     </motion.tr>
//                                                 ))
//                                             ) : (
//                                                 <tr>
//                                                     <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
//                                                         No items added yet
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>

//                             {/* Order Summary */}
//                             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//                                     <div className="flex items-center mb-4 md:mb-0">
//                                         <label className="block text-sm font-medium text-gray-700 mr-3">Discount (LKR):</label>
//                                         <input
//                                             type="number"
//                                             className="w-40 px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
//                                             value={discount}
//                                             onChange={(e) => setDiscount(() => e.target.value)}
//                                             disabled={!locationID}
//                                         />
//                                     </div>
//                                     <div className="flex items-center">
//                                         <span className="text-lg font-medium text-gray-700 mr-3">Grand Total:</span>
//                                         <span className="text-xl font-bold text-blue-700">
//                                             LKR {parseFloat(newOrder.TotalAmount || 0).toLocaleString()}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Footer */}
//                         <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
//                             <button
//                                 type="button"
//                                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
//                                 onClick={() => setOpenModal(false)}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="button"
//                                 className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
//                                 onClick={handleSubmit}
//                             >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                                 Create Purchase Order
//                             </button>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>

//             {/* Dimmed background */}
//             {/* Already covered by the bg-black bg-opacity-50 in the parent div */}

//             {openCategoryModal && (
//                 <ProductAddModal setOpenModal={setCategoryAddModal} loadProducts={loadProductData} />
//             )}
//         </>
//     );
// }

// export default OrderAddModal;


import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
import Swal from "sweetalert2";
import ProductAddModal from "components/Modal/ProductAddModelV1";
import { motion } from "framer-motion";
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// Product Search Dropdown Component for Purchase Orders
const ProductSearchDropdown = ({
    products,
    productID,
    setProductID,
    setUnitPrice,
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
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter(product => {
            const searchLower = searchTerm.toLowerCase();
            return (
                product.Name.toLowerCase().includes(searchLower) ||
                product.ProductID.toString().includes(searchLower) ||
                (product.SKU && product.SKU.toLowerCase().includes(searchLower))
            );
        });

        setFilteredProducts(filtered);
    }, [searchTerm, products]);

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

    const handleProductSelect = (selectedProductID) => {
        setProductID(selectedProductID);

        // Set the search term to the selected product name
        const product = products.find(p => p.ProductID.toString() === selectedProductID);
        if (product) {
            setSearchTerm(product.Name);
            setUnitPrice(product.BuyingPrice);
        }

        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsOpen(true);

        // If input is cleared, reset the product selection
        if (!value) {
            setProductID("");
            setUnitPrice(0);
        }
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const clearSelection = () => {
        setSearchTerm('');
        setProductID("");
        setUnitPrice(0);
        inputRef.current?.focus();
    };

    // Get current product name for display
    const selectedProduct = products.find(p => p.ProductID.toString() === productID);
    const displayValue = selectedProduct ? selectedProduct.Name : searchTerm;

    // Reset search term when productID changes to "" from outside
    useEffect(() => {
        if (productID === "") {
            setSearchTerm('');
        }
    }, [productID]);

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
                        filteredProducts.map((product) => (
                            <div
                                key={product.ProductID}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => handleProductSelect(product.ProductID.toString())}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{product.Name}</div>
                                        <div className="text-sm text-gray-500">
                                            ID: {product.ProductID} | Current Stock: {product.QuantityInStock || 0} units
                                        </div>
                                        {product.SKU && (
                                            <div className="text-xs text-gray-400">SKU: {product.SKU}</div>
                                        )}
                                    </div>
                                    <div className="ml-4 text-right">
                                        <div className="text-sm font-medium text-green-600">
                                            LKR {product.BuyingPrice?.toLocaleString() || '0'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Buying Price
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
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

function OrderAddModal({ setOpenModal, loadPurchaseOrders }) {
    const [openCategoryModal, setCategoryAddModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const date = new Date();
    const [newOrder, setNewOrder] = useState({
        TotalAmount: "",
        Status: "Unpaid",
        OrderDate: date,
        Discount: 0,
        NetAmount: 0
    });
    const [locationID, setLocationID] = useState("");
    const [productID, setProductID] = useState("");
    const [unitPrice, setUnitPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [orderDetails, setOrderDetails] = useState([]);
    const [warehouseLocations, setWarehouseLocations] = useState([]);
    const [transactionType, setTransactionType] = useState("");

    const handleChange = (e) => {
        setNewOrder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTransactionChange = (e) => {
        setTransactionType(e.target.value);
    };

    const handleLocationChange = (e) => {
        setLocationID(e.target.value);
    };

    const handleDeleteProduct = (index) => {
        const deletedProduct = orderDetails[index];
        setOrderDetails(prev => prev.filter((_, i) => i !== index));

        setNewOrder(prev => ({
            ...prev,
            TotalAmount: (parseFloat(prev.TotalAmount || 0) - deletedProduct.TotalPrice).toString()
        }));
    };

    const handleAddProduct = (e) => {
        e.preventDefault();

        if (!productID) {
            Swal.fire({
                icon: "warning",
                title: "Select a Product",
                background: "#f8fafc",
                confirmButtonColor: "#3b82f6"
            });
            return;
        }
        if (unitPrice < 1) {
            Swal.fire({
                icon: "warning",
                title: "Enter a Valid Unit Price",
                background: "#f8fafc",
                confirmButtonColor: "#3b82f6"
            });
            return;
        }
        if (quantity < 1) {
            Swal.fire({
                icon: "warning",
                title: "Enter a Valid Quantity",
                background: "#f8fafc",
                confirmButtonColor: "#3b82f6"
            });
            return;
        }

        const selectedProduct = products.find((product) => product.ProductID.toString() === productID);
        if (!selectedProduct) return;

        const existingProductIndex = orderDetails.findIndex(item => item.ProductID === productID);

        if (existingProductIndex !== -1) {
            setOrderDetails(prev => {
                const updatedDetails = [...prev];
                const existingProduct = updatedDetails[existingProductIndex];

                const updatedQuantity = existingProduct.Quantity + Number(quantity);
                const updatedTotalPrice = existingProduct.UnitPrice * updatedQuantity;

                updatedDetails[existingProductIndex] = {
                    ...existingProduct,
                    Quantity: updatedQuantity,
                    TotalPrice: updatedTotalPrice
                };

                return updatedDetails;
            });

            setNewOrder(prev => ({
                ...prev,
                TotalAmount: (parseFloat(prev.TotalAmount || 0) + (unitPrice * quantity)).toString()
            }));
        } else {
            const newProduct = {
                ProductID: productID,
                ProductName: selectedProduct.Name,
                UnitPrice: unitPrice,
                Quantity: Number(quantity),
                TotalPrice: unitPrice * quantity,
            };

            setOrderDetails(prev => [...prev, newProduct]);

            setNewOrder(prev => ({
                ...prev,
                TotalAmount: (parseFloat(prev.TotalAmount || 0) + newProduct.TotalPrice).toString()
            }));
        }

        setProductID("");
        setUnitPrice(0);
        setQuantity(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!newOrder.TotalAmount) {
            validationErrors.TotalAmount = "Total Amount is required";
        } else if (isNaN(newOrder.TotalAmount) || parseFloat(newOrder.TotalAmount) <= 0) {
            validationErrors.TotalAmount = "Please enter a valid positive number";
        }

        if (!newOrder.Status.trim()) {
            validationErrors.Status = "Status is required";
        }

        if (!locationID.trim()) {
            validationErrors.locationID = "Location is required";
        }

        if (orderDetails.length === 0) {
            validationErrors.orderDetails = "At least one product is required";
        }

        if (transactionType.trim() === "") {
            validationErrors.transactionType = "Select a Transaction Type";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            await addPurchaseOrder();
        }
    };

    async function addPurchaseOrder() {
        try {
            try {
                if (transactionType === "FULFILL") {
                    const api = createAxiosInstance();
                    const productStoragePromises = orderDetails.map((detail) => {
                        return api.post(`productstorage`, {
                            ProductID: detail.ProductID,
                            LocationID: locationID,
                            Quantity: detail.Quantity,
                            LastUpdated: Date(),
                        });
                    });
                    // const productStoragePromises = orderDetails.map((detail) => {
                    //     return axios.post(`${BASE_URL}productstorage`, {
                    //         ProductID: detail.ProductID,
                    //         LocationID: locationID,
                    //         Quantity: detail.Quantity,
                    //         LastUpdated: Date(),
                    //     }, { withCredentials: true });
                    // });
                    await Promise.all(productStoragePromises);
                } else {
                    // const updateProductStroragePromises = orderDetails.map((detail) => {
                    //     return axios.put(`${BASE_URL}productstorage/q/${detail.ProductID}/${locationID}`, {
                    //         Quantity: detail.Quantity,
                    //         OrderType: "purchaseOrder",
                    //         TransactionType: transactionType,
                    //     }, { withCredentials: true });
                    // });
                    const api = createAxiosInstance();
                    const updateProductStroragePromises = orderDetails.map((detail) => {
                        return api.put(`productstorage/q/${detail.ProductID}/${locationID}`, {
                            Quantity: detail.Quantity,
                            OrderType: "purchaseOrder",
                            TransactionType: transactionType,
                        });
                    });
                    await Promise.all(updateProductStroragePromises);
                }

                try {
                    const api = createAxiosInstance();
                    // const orderResponse = await axios.post(`${BASE_URL}purchaseorders`, {
                    //     TotalAmount: parseFloat(newOrder.TotalAmount),
                    //     Status: newOrder.Status,
                    //     OrderDate: newOrder.OrderDate,
                    //     Discount: newOrder.Discount,
                    //     NetAmount: Number(newOrder.TotalAmount) - Number(newOrder.Discount)
                    // }, { withCredentials: true });
                    const orderResponse = await api.post(`purchaseorders`, {
                        TotalAmount: parseFloat(newOrder.TotalAmount),
                        Status: newOrder.Status,
                        OrderDate: newOrder.OrderDate,
                        Discount: newOrder.Discount,
                        NetAmount: Number(newOrder.TotalAmount) - Number(newOrder.Discount)
                    });

                    const orderId = orderResponse.data?.purchaseOrder?.OrderID;
                    // const detailsPromises = orderDetails.map((detail) => {
                    //     return axios.post(`${BASE_URL}purchaseorderdetail`, {
                    //         ProductID: detail.ProductID,
                    //         Quantity: detail.Quantity,
                    //         UnitPrice: detail.UnitPrice,
                    //         OrderID: orderId,
                    //     }, { withCredentials: true });
                    // });
                    const detailsPromises = orderDetails.map((detail) => {
                        return api.post(`purchaseorderdetail`, {
                            ProductID: detail.ProductID,
                            Quantity: detail.Quantity,
                            UnitPrice: detail.UnitPrice,
                            OrderID: orderId,
                        });
                    });
                    await Promise.all(detailsPromises);

                    await api.post(`orderstatushistory`, {
                        NewStatus: newOrder.Status,
                        StatusChangeDate: new Date(),
                        purchaseorderOrderID: orderId
                    });

                    const inventoryTransactionPromises = orderDetails.map((detail) => {
                        return api.post(`transaction`, {
                            PurchaseOrderID: orderId,
                            ProductID: detail.ProductID,
                            Quantity: detail.Quantity,
                            TransactionDate: Date(),
                            TransactionType: transactionType,
                        });
                    });

                    await Promise.all(inventoryTransactionPromises);

                    const productQuentityPromises = orderDetails.map((detail) => {
                        return api.put(`product/q/${detail.ProductID}`, {
                            QuantityInStock: detail.Quantity,
                            OrderType: "purchaseOrder",
                            TransactionType: transactionType,
                        });
                    });

                    await Promise.all(productQuentityPromises);

                    Swal.fire({
                        title: "Success!",
                        text: "Purchase order created successfully",
                        icon: "success",
                        background: "#f8fafc",
                        confirmButtonColor: "#74BF04"
                    });

                    loadPurchaseOrders();
                    setOpenModal(false);

                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        title: "Error",
                        text: `Can't Create Purchase Order. ${error.response.data.message}`,
                        icon: "error",
                        background: "#f8fafc",
                        confirmButtonColor: "#3b82f6"
                    });
                }
            } catch (error) {
                if (error.response.status === 400) {
                    Swal.fire({
                        title: "Error",
                        text: `Invalid Quantity. ${error.response.data.message}`,
                        icon: "error",
                        background: "#f8fafc",
                        confirmButtonColor: "#3b82f6"
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function loadProductData() {
        const api = createAxiosInstance();
        try {
            const productsRes = await api.get(`product`);
            if (productsRes.status === 200) {
                setProducts(() => productsRes.data.allProducts.filter(product => product.isActive !== false));
            }
        } catch (error) {
            if (error.status === 404 && error.response.data.message === "No Products Found") {
                console.log("No Products Found");
            } else {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        loadProductData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = createAxiosInstance();
                const locationsRes = await api.get(`location`);
                setWarehouseLocations(locationsRes.data.locations);
            } catch (error) {
                if (error.status === 404 && error.response.data.message === "no location found") {
                    console.log("no location found");
                } else {
                    console.log(error)
                }
            }
        };
        fetchData();
    }, []);

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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Add Purchase Order
                            </h3>
                            <button
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                                onClick={() => setOpenModal(false)}
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                                        <div className="relative">
                                            <select
                                                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white"
                                                value={locationID}
                                                onChange={handleLocationChange}
                                            >
                                                <option value="">Select Warehouse</option>
                                                {warehouseLocations.map((warehouse) => (
                                                    <option key={warehouse.LocationID} value={warehouse.LocationID}>
                                                        {warehouse.WarehouseName}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                </svg> */}
                                            </div>
                                        </div>
                                        {errors.locationID && (
                                            <div className="text-red-500 text-xs mt-1">{errors.locationID}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                                        <div className="relative">
                                            <select
                                                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                                value={transactionType}
                                                onChange={handleTransactionChange}
                                                disabled={!locationID}
                                            >
                                                <option value="">Select Type</option>
                                                <option value="FULFILL">FULFILL</option>
                                                <option value="RETURN">RETURN</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                </svg> */}
                                            </div>
                                        </div>
                                        {errors.transactionType && (
                                            <div className="text-red-500 text-xs mt-1">{errors.transactionType}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                                        <div className="relative">
                                            <select
                                                name="Status"
                                                value={newOrder.Status}
                                                onChange={handleChange}
                                                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                                disabled={!locationID}
                                            >
                                                <option value="Unpaid">Unpaid</option>
                                                <option value="Paid">Paid</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                </svg> */}
                                            </div>
                                        </div>
                                        {errors.Status && (
                                            <div className="text-red-500 text-xs mt-1">{errors.Status}</div>
                                        )}
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
                                <form onSubmit={handleAddProduct} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        <div className="md:col-span-2">
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <ProductSearchDropdown
                                                        products={products}
                                                        productID={productID}
                                                        setProductID={setProductID}
                                                        setUnitPrice={setUnitPrice}
                                                        disabled={!locationID}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setCategoryAddModal(true)}
                                                    className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (LKR)</label>
                                            <input
                                                type="text"
                                                name="UnitPrice"
                                                value={unitPrice}
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-gray-100 read-only:bg-gray-100"
                                                placeholder="Unit Price"
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                            <input
                                                type="number"
                                                name="Quantity"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                                placeholder="Enter Quantity"
                                                disabled={!locationID}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-transparent mb-1">Add</label>
                                            <button
                                                type="submit"
                                                className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:bg-blue-300"
                                                disabled={!locationID}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Add Item
                                            </button>
                                        </div>
                                    </div>
                                    {errors.orderDetails && (
                                        <div className="text-red-500 text-xs mt-2">{errors.orderDetails}</div>
                                    )}
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
                                            {orderDetails.length > 0 ? (
                                                orderDetails.map((detail, index) => (
                                                    <motion.tr
                                                        key={index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detail.ProductID}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detail.ProductName}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{detail.Quantity}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{detail.UnitPrice.toLocaleString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{detail.TotalPrice.toLocaleString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                            <button
                                                                onClick={() => handleDeleteProduct(index)}
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
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div className="flex items-center mb-4 md:mb-0">
                                        <label className="block text-sm font-medium text-gray-700 mr-3">Discount (LKR):</label>
                                        <input
                                            type="number"
                                            className="w-40 px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                            value={newOrder.Discount}
                                            onChange={(e) => setNewOrder((n) => ({ ...n, Discount: e.target.value }))}
                                            disabled={!locationID}
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-lg font-medium text-gray-700 mr-3">Grand Total:</span>
                                        <span className="text-xl font-bold text-blue-700">
                                            LKR {parseFloat(newOrder.TotalAmount - Number(newOrder.Discount) || 0).toLocaleString()}
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
                                onClick={() => setOpenModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                                onClick={handleSubmit}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Create Purchase Order
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {openCategoryModal && (
                <ProductAddModal setOpenModal={setCategoryAddModal} loadProducts={loadProductData} />
            )}
        </>
    );
}

export default OrderAddModal;