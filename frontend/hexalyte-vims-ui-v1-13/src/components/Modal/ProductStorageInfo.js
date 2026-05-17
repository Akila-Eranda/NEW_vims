// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// function ProductInfoModal({ inevntoryInfo, setOpenModal }) {

//     const [productData , setProductData] = useState({});
//     const [loactionData, setLoactionData] = useState({});

//     useEffect(() => {
//         const loadProductData = async () => {
//             try {
//                 const response = await axios.get(
//                     `${BASE_URL}product/${inevntoryInfo.ProductID}`, {withCredentials: true}
//                 );
//                 setProductData(response.data.product);
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//         loadProductData();
//     }, []);

//     useEffect(() => {
//         const loadAddressData = async () => {
//             try {
//                 const response = await axios.get(
//                     `${BASE_URL}location/${inevntoryInfo.LocationID}`, {withCredentials: true}
//                 );
//                 // console.log(response)
//                 setLoactionData(response.data.location);
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//         loadAddressData();
//     }, []);

//     return (
//         <>
//             <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 pt-80 md:pt-0 z-50 outline-none focus:outline-none">
//                 <div className="relative w-4/5 md:w-3/5 my-6 mx-auto max-w-6xl">
//                     <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-5">
//                         <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
//                             <h3 className="text-3xl text-center font-semibold">
//                                 Inventory Info
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
//                                             Product ID : {inevntoryInfo.ProductID}
//                                         </label>

//                                     </div>
//                                     <div className="w-full">
//                                         <label htmlFor="ContactName" className=" block my-2">
//                                             Location ID : {inevntoryInfo.LocationID}
//                                         </label>

//                                     </div>
//                                 </div>

//                                 <div className="w-full flex flex-col md:flex-row gap-2">
//                                     <div className="w-full">
//                                         <label htmlFor="Name" className=" block my-2">
//                                             Quentity : {inevntoryInfo.Quantity}
//                                         </label>

//                                     </div>
//                                     <div className="w-full">
//                                         <label htmlFor="ContactName" className=" block my-2">
//                                             Last Update Date : {inevntoryInfo.LastUpdated.slice(0, 10)}
//                                         </label>

//                                     </div>
//                                 </div>

//                                 {/* product infoprmation */}
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
//                                 <div className="mt-5">

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


//                                 </div>



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
import { motion, AnimatePresence } from "framer-motion";
import { createAxiosInstance } from "api/axiosInstance";


function ProductInfoModal({ inevntoryInfo, setOpenModal }) {
  const [productData, setProductData] = useState({});
  const [locationData, setLocationData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch product and location data in parallel
        const api = createAxiosInstance();
        const [productResponse, locationResponse] = await Promise.all([
          api.get(`product/${inevntoryInfo.ProductID}`),
          api.get(`location/${inevntoryInfo.LocationID}`)
        ]);
        // const [productResponse, locationResponse] = await Promise.all([
        //   axios.get(`${BASE_URL}product/${inevntoryInfo.ProductID}`, { withCredentials: true }),
        //   axios.get(`${BASE_URL}location/${inevntoryInfo.LocationID}`, { withCredentials: true })
        // ]);

        setProductData(productResponse.data.product);
        setLocationData(locationResponse.data.location);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [inevntoryInfo.ProductID, inevntoryInfo.LocationID]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Tab button component
  const TabButton = ({ id, label, icon }) => (
    <button
      className={`flex items-center justify-center py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-200 ${
        activeTab === id 
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Product Inventory Details
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
            {/* Product Information Section */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isLoading ? "Loading Product Information..." : `${productData.Name || "Product Information"}`}
              </h4>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Product ID:</span>
                        <span className="text-base font-semibold text-gray-800">{inevntoryInfo.ProductID}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Product Name:</span>
                        <span className="text-base text-gray-800">{productData.Name || "N/A"}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Category ID:</span>
                        <span className="text-base text-gray-800">{productData.CategoryID || "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Selling Price:</span>
                        <span className="text-base font-semibold text-gray-800">
                          {productData.SellingPrice ? `${productData.SellingPrice} LKR` : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Total Stock:</span>
                        <span className="text-base text-gray-800">{productData.QuantityInStock || "N/A"}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-500 w-32">Last Updated:</span>
                        <span className="text-base text-gray-800">
                          {formatDate(inevntoryInfo.LastUpdated)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs for different sections */}
            <div className="mb-6">
              <div className="border-b border-gray-200 mb-4">
                <div className="flex space-x-4">
                  <TabButton 
                    id="inventory" 
                    label="Inventory" 
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    } 
                  />
                  <TabButton 
                    id="location" 
                    label="Warehouse" 
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    } 
                  />
                  <TabButton 
                    id="description" 
                    label="Description" 
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    } 
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === 'inventory' && (
                    <motion.div
                      key="inventory"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white shadow overflow-hidden border-b border-gray-200 rounded-lg"
                    >
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <motion.tr
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inevntoryInfo.LocationID}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inevntoryInfo.ProductID}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{inevntoryInfo.Quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatDate(inevntoryInfo.LastUpdated)}</td>
                          </motion.tr>
                        </tbody>
                      </table>
                    </motion.div>
                  )}

                  {activeTab === 'location' && (
                    <motion.div
                      key="location"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white shadow overflow-hidden border-b border-gray-200 rounded-lg p-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                          <div className="flex items-center mb-3">
                            <span className="text-sm font-medium text-gray-500 w-32">Location ID:</span>
                            <span className="text-base font-semibold text-gray-800">{inevntoryInfo.LocationID}</span>
                          </div>
                          <div className="flex items-center mb-3">
                            <span className="text-sm font-medium text-gray-500 w-32">Warehouse Name:</span>
                            <span className="text-base text-gray-800">{locationData.WarehouseName || "N/A"}</span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center mb-3">
                            <span className="text-sm font-medium text-gray-500 w-32">Address:</span>
                            <span className="text-base text-gray-800">{locationData.Address || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'description' && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white shadow overflow-hidden border-b border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-500 mb-2">Product Description:</div>
                        <div className="text-base text-gray-800 p-4 bg-gray-50 rounded-lg">
                          {productData.Description || "No description available for this product."}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Inventory Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600">Current Stock at this Location:</span>
                <span className="text-base font-bold text-blue-700">{inevntoryInfo.Quantity} units</span>
              </div>
              {!isLoading && (
                <div className="flex justify-between mt-2">
                  <span className="text-sm font-medium text-gray-600">Total Stock Across All Locations:</span>
                  <span className="text-base font-bold text-blue-700">{productData.QuantityInStock || "N/A"} units</span>
                </div>
              )}
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
  );
}

export default ProductInfoModal;