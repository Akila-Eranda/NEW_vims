import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // You may need to install this package
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function WarehouseInfoModal({ warehouseInfo, setOpenModal }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [productStorages, setProductStorages] = useState([]);

    async function loadProductStorageData() {
        const api = createAxiosInstance();
        try {
            const res = await api.get(`productstorage`);
            console.log(res)
            const filteredData = res.data.filter(
                (location) => location.LocationID === warehouseInfo.LocationID
            );

            setProductStorages(filteredData);
        } catch (error) {
            console.error("Failed to load products:", error);
        }
    }

    useEffect(() => {
        loadProductStorageData();
    }, []);

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
                                Warehouse Details
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
                                                <span className="text-sm font-medium text-gray-500 w-32">Warehouse ID: &nbsp; </span>
                                                <span className="text-base font-semibold text-gray-800">{warehouseInfo.LocationID}</span>
                                            </div>
                                            <div className="flex items-center mb-3">
                                                <span className="text-sm font-medium text-gray-500 w-32">Address: &nbsp; </span>
                                                <span className="text-base font-semibold text-gray-800">{warehouseInfo.Address}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center mb-3">
                                                <span className="text-sm font-medium text-gray-500 w-32">Name: &nbsp; </span>
                                                <span className="text-base font-semibold text-gray-800">{warehouseInfo.WarehouseName}</span>

                                            </div>
                                            {/* <div className="flex items-center mb-3">
                                                <span className="text-sm font-medium text-gray-500 w-32">Total Quantity: &nbsp; </span>
                                                <span className="text-base font-semibold text-gray-800">{ }</span>

                                            </div> */}
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
                                    Warehouse Inventory Information
                                </h4>


                                <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {productStorages.length > 0 ? (
                                                productStorages.map((detail, index) => (
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
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{detail.Quantity}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                            {new Date(detail.LastUpdated).toLocaleString()}
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

export default WarehouseInfoModal;
