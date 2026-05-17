// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// function SalesOrderInfoModal({setOpenSalesOrderDetailModal, orderInfo}){

//   const [salesOrder, setSalesOrder] = useState({
//     CustomerName: "",
//     OrderDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
//     TotalAmount: 0,
//     Status: "PENDING",
//   })

//   const [productID, setProductID] = useState("");
//   // const [productName, setProductName] = useState("");
//   const [unitPrice, setUnitPrice] = useState(0);
//   const [quantity, setQuantity] = useState(0);

//   const [salesUnits, setSalesUnits] = useState([
//     // {
//     //   ProductID: 0,
//     //   ProductName: "Test Product 1",
//     //   UnitPrice: 0,
//     //   Quantity: 0,
//     //   TotalPrice: 0,
//     // },
//   ]);

//   function handleAddProduct(e) {
//     e.preventDefault();

//     // console.log(products.find((product) => product.ProductID.toString() === productID).Name);

//     const newProduct = {
//       ProductId: productID,
//       // ProductName: products.find((product) => product.ProductID.toString() === productID).Name,
//       UnitPrice: unitPrice,
//       Quantity: Number(quantity),
//       TotalPrice: unitPrice * quantity,
//     };

//     // console.log(newProduct);

//     // if (salesUnits.find((unit) => unit.ProductID === newProduct.ProductID && unit.UnitPrice === newProduct.UnitPrice)) {
//     //   // console.log("Product already exists");
//     //   // salesUnits.find((unit) => unit.ProductID === newProduct.ProductID && unit.UnitPrice === newProduct.UnitPrice).Quantity += newProduct.Quantity;
//     //   // setSalesUnits((s) => s.find((unit) => unit.ProductID === newProduct.ProductID && unit.UnitPrice === newProduct.UnitPrice).Quantity += newProduct.Quantity) )
//     //
//     //   setSalesUnits((s) => s.map((unit) => {
//     //     if (unit.ProductID === newProduct.ProductID && unit.UnitPrice === newProduct.UnitPrice) {
//     //       return {
//     //         ...unit,
//     //         Quantity: unit.Quantity + newProduct.Quantity,
//     //         TotalPrice: unit.TotalPrice + newProduct.TotalPrice,
//     //       }
//     //     }
//     //   }))
//     //
//     // } else {
//     setSalesUnits(() => [...salesUnits, newProduct]);
//     // }

//     setProductID(() => "");
//     // setProductName(() => "");
//     setUnitPrice(() => 0);
//     setQuantity(() => 0);

//   }

//   function deleteProduct(index) {
//     // alert(`Delete Product at index: ${index}`)
//     setSalesUnits((s) => s.filter((unit, i) => i !== index));
//   }

//   async function addSalesOrder(){
//     try {
//       const response = await axios.post(`${BASE_URL}salesorder`, salesOrder, { withCredentials: true });
//       // console.log(response);
//       if (response.status === 201) {
//         console.log("Sales Order Added Successfully");
//         const OrderId = response.data?.newsalesorder?.OrderID;
//         salesUnits.forEach(async (unit) => {
//           // console.log(OrderID);
//           // console.log(unit);

//           addSalesOrderDetails(unit, OrderId);

//         })

//         setSalesUnits(() => ([]))
//         // loadSalesOrders();
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async function addSalesOrderDetails(salesOrderItem, OrderId) {
//     try {
//       const { ProductId, Quantity, UnitPrice } = salesOrderItem;

//       const response = await axios.post(`${BASE_URL}salesorderdetails`, {OrderId, ProductId, Quantity, UnitPrice}, { withCredentials: true });
//       console.log(response);
//     } catch (error) {
//       console.log(error);
//       return;
//     }
//   }

//   async function fetchProducts() {
//     try {

//       // checkToken();

//       const products = await axios.get(`${BASE_URL}product`, { withCredentials: true });

//       if (products.status === 200) {
//         // setProducts(() => [...products.data.allProducts]);
//       }

//       // console.log(products.data.allProducts);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {

//     const total = salesUnits.reduce((acc, unit) => acc + unit.TotalPrice, 0);
//     setSalesOrder((s) => ({...s, TotalAmount: total}))

//   }, [salesUnits]);

//   return (
//     <>
//       <div
//         className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 pt-80 lg:pt-0 z-50 outline-none focus:outline-none"
//         // onClick={() => setShowModal(false)}
//       >
//         <div className="relative w-4/5 lg:w-3/5 my-6 mx-auto max-w-6xl">
//           {/*content*/}
//           <div
//             className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-5">
//             {/*header*/}
//             <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
//               <h3 className="text-3xl text-center font-semibold">
//                 Sales Order #{orderInfo.OrderID}
//                 {/* {prodInfo.Name} */}
//               </h3>
//               <button
//                 className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
//                 // onClick={() => setShowModal(false)}
//               >
//                 <span
//                   className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
//                   ×
//                 </span>
//               </button>
//             </div>
//             {/*body*/}
//             <div className="relative px-6">
//               <div className="space-y-2">
//                 <div className="w-full flex flex-col md:flex-row gap-2">
//                   <div className="w-full md:w-full">
//                     <label htmlFor="" className="font-bold my-2">Customer Name : </label>
//                     <input
//                       type="text"
//                       className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                       placeholder="Enter Customer Name"
//                       value={salesOrder.CustomerName}
//                       onChange={(e) => setSalesOrder((s) => ({...s, CustomerName: e.target.value}))}
//                       readOnly={true}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="relative p-6">
//               <form className="space-y-4" onSubmit={(e) => handleAddProduct(e)}>
//                 <div className="w-full flex flex-col lg:flex-row gap-2">
//                   <div className="w-full md:w-full">
//                     <label htmlFor="" className="font-bold block my-2">Product : </label>
//                     <select name="" id="" value={productID} onChange={(e) => setProductID(e.target.value)}
//                             className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200">
//                       <option value="">Select Product</option>
//                       {
//                         // products.map((product, index) => (
//                         //   <option key={index} value={product.ProductID}>{product.Name}</option>))
//                       }
//                     </select>
//                   </div>
//                   <div className="w-full md:w-full">
//                     <label htmlFor="" className="font-bold block my-2">Unit Price (LKR) </label>
//                     <input
//                       type="text"
//                       name="UnitPrice"
//                       value={unitPrice}
//                       onChange={(e) => setUnitPrice(e.target.value)}
//                       className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                       placeholder="Enter Unit Price"
//                       readOnly={true}
//                     />
//                   </div>
//                   <div className="w-full md:w-full">
//                     <label htmlFor="" className="font-bold block my-2">Quantity </label>
//                     <input
//                       type="text"
//                       name="QuantityInStock"
//                       value={quantity}
//                       onChange={(e) => setQuantity(e.target.value)}
//                       className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                       placeholder="Enter Quantity"
//                       readOnly={true}
//                     />
//                   </div>
//                   {/*<div className="w-full md:w-full">*/}
//                   {/*  <label htmlFor="" className="font-bold block my-2">&nbsp; </label>*/}
//                   {/*  <button*/}
//                   {/*    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"*/}

//                   {/*    // onClick={() => addProduct(newProduct)}*/}
//                   {/*  >*/}
//                   {/*    Add Item*/}
//                   {/*  </button>*/}
//                   {/*</div>*/}
//                 </div>
//               </form>
//             </div>
//             <div className="relative p-6">
//               <div className="space-y-4">
//                 <div className="w-full flex flex-col md:flex-row gap-2">
//                   <div className="w-full">
//                     <table className="table-auto w-full text-left">
//                       <thead>
//                       <tr>
//                         <th>Product ID</th>
//                         <th>Product Name</th>
//                         <th>Quantity</th>
//                         <th>Unit Price</th>
//                         <th>Total Price</th>
//                         <th>&nbsp;</th>
//                       </tr>
//                       </thead>
//                       <tbody>
//                       {
//                         salesUnits.map((unit, index) => (<tr key={index}>
//                           <td>{unit.ProductId}</td>
//                           <td>{unit.ProductName}</td>
//                           <td className="text-right">{unit.Quantity}</td>
//                           <td className="text-right">{unit.UnitPrice.toLocaleString() }</td>
//                           <td className="text-right">{unit.TotalPrice.toLocaleString() }</td>
//                           <td className="text-right">
//                             <button onClick={() => deleteProduct(index)}><i className="fa fa-trash-alt"></i></button>
//                           </td>
//                         </tr>))
//                       }
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="relative px-6 py-3">
//               <div className="space-y-2">
//                 <div className="w-full flex flex-col md:flex-row gap-2">
//                   <label htmlFor="" className="font-bold my-2">Grand Total (LKR) : </label>
//                   <label htmlFor="" className="font-bold my-2"> { salesOrder.TotalAmount.toLocaleString() }  </label>
//                 </div>
//               </div>
//             </div>
//             {/*footer*/}
//             <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
//               <button
//                 className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                 type="button"
//                 onClick={() => setOpenSalesOrderDetailModal(() => false)}
//               >
//                 Close
//               </button>
//               {/*<button*/}
//               {/*  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"*/}
//               {/*  type="button"*/}
//               {/*  onClick={() => addSalesOrder() }*/}
//               {/*>*/}
//               {/*  Add Sales Order*/}
//               {/*</button>*/}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//     </>
//   );

// }

// export default SalesOrderInfoModal;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // You may need to install this package
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function SalesOrderInfoModal({ setOpenSalesOrderDetailModal, orderInfo, pdfPrint, thermalPrint }) {
  const [salesOrder, setSalesOrder] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(products);

  useEffect(() => {
    const loadSalesOrderData = async () => {
      setIsLoading(true);
      const api = createAxiosInstance();
      try {
        const response = await api.get(
          `salesorderdetails/${orderInfo.OrderID}`
        );
        // console.log(response.data);
        if (response.status === 200) {
          setSalesOrder(() => response.data.data);
        }
      } catch (error) {
        console.error("Failed to load purchase order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSalesOrderData();
  }, [orderInfo.OrderID]);

  async function loadProductData() {
    const api = createAxiosInstance();
    try {
      const productsRes = await api.get(`product`);
      setProducts(productsRes.data.allProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  }

  useEffect(() => {
    loadProductData();
  }, []);

  // Calculate order total
  // const orderTotal = salesOrder.reduce((sum, item) => sum + (item.Quantity * item.UnitPrice), 0);

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Sales Order Details
              </h3>
              <button
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                onClick={() => setOpenSalesOrderDetailModal(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Order Information Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Order Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Order ID: &nbsp; </span>
                        <span className="text-base font-semibold text-gray-800">{orderInfo.OrderID}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Order Date: &nbsp; </span>
                        <span className="text-base text-gray-800">
                          {new Date(orderInfo.OrderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Status: &nbsp; </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${orderInfo.Status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : orderInfo.Status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                          {orderInfo.Status}
                        </span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Total Amount: &nbsp; </span>
                        <span className="text-base font-semibold text-gray-800">
                          {Number(orderInfo.TotalAmount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} LKR
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Product Information
                </h4>

                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {salesOrder.length > 0 ? (
                          salesOrder.map((detail, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detail.ProductID}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {products.find((p) => p.ProductID === detail.ProductID)?.Name || 'Loading...'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{detail.Quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                {Number(detail.UnitPrice).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })} LKR
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                {Number(detail.Quantity * detail.UnitPrice).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })} LKR
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 text-sm text-gray-500 text-center">
                              No products found for this order
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-end">
                  <div className="w-full md:w-1/3">
                    {/* <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Subtotal:</span>
                      <span className="text-sm text-gray-800">
                        {orderTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} LKR
                      </span>
                    </div> */}

                    <div className="flex justify-between py-3">
                      <span className="text-base font-semibold text-gray-700">Grand Total:</span>
                      <span className="text-base font-bold text-blue-700">
                        {Number(orderInfo.TotalAmount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} LKR
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t gap-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              onClick={() => pdfPrint(orderInfo)}
              >
                PDF Print
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              onClick={() => thermalPrint(orderInfo)}
              >
                Thermal Print
              </button>
              <button
                type="button"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                onClick={() => setOpenSalesOrderDetailModal(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SalesOrderInfoModal;