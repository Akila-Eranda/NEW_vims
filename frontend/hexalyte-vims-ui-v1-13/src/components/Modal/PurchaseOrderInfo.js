// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// function ProductInfoModal({ purchaseOrderInfo, setOpenModal }) {

//     const [purchaseOrder, setPurchaseOrder] = useState([]);
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const loadPurchaseOrderData = async () => {
//             try {
//                 const response = await axios.get(
//                     `${BASE_URL}purchaseorderdetail/${purchaseOrderInfo.OrderID}`, { withCredentials: true }
//                 );
//                 // console.log(response)

//                 setPurchaseOrder(response.data.purchaseOrderDetails);
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//         loadPurchaseOrderData();
//     }, []);
//     // console.log([purchaseOrder.ProductID])


//     // useEffect(() => {
//     //     const loadProductData = async () => {
//     //         try {
//     //             const response = await axios.get(
//     //                 `http://localhost:4444/v1/product/${purchaseOrder.ProductID}`, { withCredentials: true }
//     //             );
//     //             console.log(response)

//     //             // setProduct(response.data.purchaseOrderDetails);
//     //         } catch (error) {
//     //             console.error(error);
//     //         }
//     //     };
//     //     loadProductData();
//     // }, []);

//     async function loadProductData() {
//         try {
//             const productsRes = await axios.get(`${BASE_URL}product`, {withCredentials: true});
//             setProducts(productsRes.data.allProducts);
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     useEffect(() => {
//         loadProductData();
//     }, []);

//     // useEffect(() => {
//     //     const loadAllProductDetails = async () => {
//     //         try {
//     //             const products = purchaseOrder.map(item =>
//     //                 axios.get(
//     //                     `http://localhost:4444/v1/product/${item.ProductID}`,
//     //                     { withCredentials: true }
//     //                 )
//     //             );

//     //             const res = await Promise.all(products);
//     //             // console.log(res);
//     //             const productNames = res.map(response => response.data.product.Name);
//     //             // console.log(productNames)
//     //             const productData = res.map(res => res.data.product);
//     //             setProducts(productData);
//     //         } catch (error) {
//     //             console.error(error);
//     //         }
//     //     };
//     //     loadAllProductDetails();

//     // }, [purchaseOrder]);

//     // console.log(products)

//     // useEffect(() => {
//     //     const loadAddressData = async () => {
//     //         try {
//     //             const response = await axios.get(
//     //                 `http://localhost:4444/v1/location/${purchaseOrderInfo.LocationID}`
//     //             );
//     //             // console.log(response)
//     //             setLoactionData(response.data.location);
//     //         } catch (error) {
//     //             console.error(error);
//     //         }
//     //     };
//     //     loadAddressData();
//     // }, []);

//     return (
//         <>
//             <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 pt-80 md:pt-0 z-50 outline-none focus:outline-none">
//                 <div className="relative w-4/5 md:w-3/5 my-6 mx-auto max-w-6xl">
//                     <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-5">
//                         <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
//                             <h3 className="text-3xl text-center font-semibold">
//                                 Purchase Order Info
//                             </h3>
//                             <button
//                                 className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
//                                 onClick={() => setOpenModal(false)}
//                             >
//                                 ×
//                             </button>
//                         </div>
//                         <div className="relative p-6">
//                             <form className="space-y-4 " >
//                                 <div className="w-full flex flex-col md:flex-row gap-2">
//                                     <div className="w-full">
//                                         <label htmlFor="Name" className=" block my-2">
//                                             Order ID : {purchaseOrderInfo.OrderID}
//                                         </label>

//                                     </div>
//                                     <div className="w-full">
//                                         <label htmlFor="ContactName" className=" block my-2">
//                                             Order Date : {purchaseOrderInfo.OrderDate.slice(0, 10)}
//                                         </label>

//                                     </div>
//                                 </div>

//                                 <div className="w-full flex flex-col md:flex-row gap-2">
//                                     <div className="w-full">
//                                         <label htmlFor="Name" className=" block my-2">
//                                             Total Amount : {purchaseOrderInfo.TotalAmount}
//                                         </label>

//                                     </div>
//                                     <div className="w-full">
//                                         <label htmlFor="ContactName" className=" block my-2">
//                                             Status : {purchaseOrderInfo.Status}
//                                         </label>

//                                     </div>
//                                 </div>
//                                 <h2 className="text-xl font-semibold mb-5">Product Information</h2>

//                                 {/* Order items table */}
//                                 <div className="mt-6">
//                                     <table className="table-auto w-full text-left">
//                                         <thead>
//                                             <tr className="bg-gray-100">
//                                                 <th className="p-2">Product ID</th>
//                                                 <th className="p-2">Product Name</th>
//                                                 <th className="p-2 text-right">Quantity</th>
//                                                 <th className="p-2 text-right">Unit Price</th>
//                                                 <th className="p-2 text-right">Total Price</th>
//                                                 <th className="p-2 text-right"></th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {purchaseOrder.map((detail, index) => (
//                                                 <tr
//                                                     key={index}
//                                                     className="border-b">
//                                                     <td className="p-2">
//                                                         {detail.ProductID}
//                                                     </td>
//                                                     <td className="p-2">
//                                                         {products.find((p) => p.ProductID === detail.ProductID)?.Name}
//                                                     </td>
//                                                     <td className="p-2 text-right">
//                                                         {detail.Quantity}
//                                                     </td>
//                                                     <td className="p-2 text-right">
//                                                         {detail.UnitPrice}
//                                                     </td>
//                                                     <td className="p-2 text-right">
//                                                         {detail.Quantity * detail.UnitPrice}
//                                                     </td>
//                                                     <td className="p-2 text-right">

//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>

//                                 {/* product infoprmation
//                                 <div className="mt-5">

//                                     <h2 className="text-xl font-semibold mb-5">Product Information</h2>

//                                     <div className="w-full flex flex-col md:flex-row gap-2">
//                                         <div className="w-full">
//                                             <label htmlFor="Name" className=" block my-2">
//                                                 Product Name : {productData.Name}
//                                             </label>

//                                         </div>
//                                         <div className="w-full">
//                                             <label htmlFor="ContactName" className=" block my-2">
//                                                 Description : {productData.Description}
//                                             </label>

//                                         </div>
//                                     </div>
//                                     <div className="w-full flex flex-col md:flex-row gap-2">
//                                         <div className="w-full">
//                                             <label htmlFor="Name" className=" block my-2">
//                                                 Unit Price : {productData.UnitPrice}
//                                             </label>

//                                         </div>
//                                         <div className="w-full">
//                                             <label htmlFor="ContactName" className=" block my-2">
//                                                 Quentity : {productData.QuantityInStock}
//                                             </label>

//                                         </div>
//                                     </div>
//                                     <div className="w-full flex flex-col md:flex-row gap-2">
//                                         <div className="w-full">
//                                             <label htmlFor="Name" className="block my-2">
//                                                 Supplier ID : {productData.SupplierID}
//                                             </label>

//                                         </div>
//                                         <div className="w-full">
//                                             <label htmlFor="ContactName" className=" block my-2">
//                                                 Category ID : {productData.CategoryID}
//                                             </label>

//                                         </div>
//                                     </div>

//                                 </div>


//                                 {/* location info  */}
//                                 {/* <div className="mt-5">

//                                     <h2 className="text-xl font-semibold mb-5">Location Information</h2>

//                                     <div className="w-full flex flex-col md:flex-row gap-2">
//                                         <div className="w-full">
//                                             <label htmlFor="Name" className=" block my-2">
//                                                 Location Name : {loactionData.WarehouseName}
//                                             </label>

//                                         </div>
//                                         <div className="w-full">
//                                             <label htmlFor="ContactName" className=" block my-2">
//                                                 Address : {loactionData.Address}
//                                             </label>

//                                         </div>
//                                     </div>


//                                 </div> */}



//                                 <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
//                                     <button
//                                         className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                                         type="button"
//                                         onClick={() => setOpenModal(false)}

//                                     >
//                                         Close
//                                     </button>

//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//         </>
//     );
// }

// export default ProductInfoModal;


import React, { useEffect, useState } from "react";
// import axios from "axios";
import { motion } from "framer-motion"; // You may need to install this package
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function ProductInfoModal({ purchaseOrderInfo, setOpenModal }) {
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPurchaseOrderData = async () => {
      setIsLoading(true);
      try {
        const api = createAxiosInstance();
        const response = await api.get(
          `purchaseorderdetail/${purchaseOrderInfo.OrderID}`
        );
        // const response = await axios.get(
        //   `${BASE_URL}purchaseorderdetail/${purchaseOrderInfo.OrderID}`, 
        //   { withCredentials: true }
        // );
        setPurchaseOrder(response.data.purchaseOrderDetails);
      } catch (error) {
        console.error("Failed to load purchase order details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPurchaseOrderData();
  }, [purchaseOrderInfo.OrderID]);

  async function loadProductData() {
    const api = createAxiosInstance();
    try {
      const productsRes = await api.get(`product`);
      // const productsRes = await axios.get(`${BASE_URL}product`, {withCredentials: true});
      setProducts(productsRes.data.allProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  }

  useEffect(() => {
    loadProductData();
  }, []);

  // Calculate order total
  const orderTotal = purchaseOrder.reduce((sum, item) => sum + (item.Quantity * item.UnitPrice), 0);

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
                Purchase Order Details
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
                        <span className="text-base font-semibold text-gray-800">{purchaseOrderInfo.OrderID}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Order Date: &nbsp; </span>
                        <span className="text-base text-gray-800">
                          {new Date(purchaseOrderInfo.OrderDate).toLocaleDateString('en-US', {
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
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          purchaseOrderInfo.Status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800' 
                            : purchaseOrderInfo.Status === 'PENDING' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {purchaseOrderInfo.Status}
                        </span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Total Amount: &nbsp; </span>
                        <span className="text-base font-semibold text-gray-800">
                          {Number(purchaseOrderInfo.TotalAmount).toLocaleString(undefined, {
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
                        {purchaseOrder.length > 0 ? (
                          purchaseOrder.map((detail, index) => (
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
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Subtotal:</span>
                      <span className="text-sm text-gray-800">
                        {orderTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} LKR
                      </span>
                    </div>
                    
                    <div className="flex justify-between py-3">
                      <span className="text-base font-semibold text-gray-700">Grand Total:</span>
                      <span className="text-base font-bold text-blue-700">
                        {Number(purchaseOrderInfo.TotalAmount).toLocaleString(undefined, {
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
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t">
              <button
                type="button"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                onClick={() => setOpenModal(false)}
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

export default ProductInfoModal;