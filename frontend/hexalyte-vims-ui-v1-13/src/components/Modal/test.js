
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createAxiosInstance } from "api/axiosInstance";

function WarehouseInfoModal({ warehouseInfo, setOpenModal }) {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
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

    console.log(productStorages)

    async function loadProductData() {
        const api = createAxiosInstance();
        try {
            const productsRes = await api.get(`product`);
            setProducts(productsRes.data.allProducts);
        } catch (error) {
            console.error("Failed to load products:", error);
        }
    }

    console.log(products);

    useEffect(() => {
        loadProductData();
    }, []);

    // Calculate total quantity from all products
    const totalQuantity = useMemo(() => {
        return products.reduce((total, product) => total + (product.Quantity || 0), 0);
    }, [products]);

    // Filter and sort products based on search term and sort configuration
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products.filter(product =>
            product.ProductID?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.Name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [products, searchTerm, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return (
                <svg className="w-4 h-4 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }

        return sortConfig.direction === 'asc' ? (
            <svg className="w-4 h-4 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    async function loadProductData() {
        if (!warehouseInfo?.LocationID) {
            setError('No location ID provided');
            setIsLoading(false);
            return;
        }

        const api = createAxiosInstance();
        try {
            setIsLoading(true);
            setError(null);

            const productsRes = await api.get(`productstorage/${warehouseInfo.LocationID}`);

            if (productsRes.data && productsRes.data.productStorageByProductID) {
                setProducts(productsRes.data.productStorageByProductID);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Failed to load products:", error);
            setError(error.response?.data?.message || 'Failed to load warehouse data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadProductData();
    }, [warehouseInfo?.LocationID]);

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const handleOverlayClick = () => {
        setOpenModal(false);
    };

    const handleRetry = () => {
        loadProductData();
    };

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-4 flex items-center justify-center"
                onClick={handleOverlayClick}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative w-full max-w-7xl mx-auto"
                    onClick={handleModalClick}
                >
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
                            <h3 className="text-2xl font-bold text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Warehouse Details & Inventory
                            </h3>
                            <button
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                onClick={() => setOpenModal(false)}
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-6">
                                {/* Order Information Section */}
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Warehouse Information
                                    </h4>
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-start">
                                                    <span className="text-sm font-medium text-gray-500 w-28 flex-shrink-0">Warehouse ID:</span>
                                                    <span className="text-base font-semibold text-gray-800 ml-2">{warehouseInfo.LocationID || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="text-sm font-medium text-gray-500 w-28 flex-shrink-0">Address:</span>
                                                    <span className="text-base font-semibold text-gray-800 ml-2">{warehouseInfo.Address || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-start">
                                                    <span className="text-sm font-medium text-gray-500 w-28 flex-shrink-0">Name:</span>
                                                    <span className="text-base font-semibold text-gray-800 ml-2">{warehouseInfo.WarehouseName || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="text-sm font-medium text-gray-500 w-28 flex-shrink-0">Total Quantity:</span>
                                                    <span className="text-base font-semibold text-blue-600 ml-2 flex items-center">
                                                        {isLoading ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                        ) : (
                                                            <>
                                                                {totalQuantity.toLocaleString()} items
                                                                <svg className="w-4 h-4 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                </svg>
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Products Section */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-gray-700 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Inventory Information
                                            {!isLoading && (
                                                <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    {filteredAndSortedProducts.length} products
                                                </span>
                                            )}
                                        </h4>

                                        {/* Search Bar */}
                                        {/* {!isLoading && !error && (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Search products..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        )} */}
                                    </div>

                                    {/* Loading State */}
                                    {isLoading && (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                                <p className="text-gray-600">Loading warehouse inventory...</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Error State */}
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                                            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Data</h3>
                                            <p className="text-red-600 mb-4">{error}</p>
                                            <button
                                                onClick={handleRetry}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    )}

                                    {/* Products Table */}
                                    {!isLoading && !error && (
                                        <div className="shadow-lg overflow-hidden border border-gray-200 rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                                                            onClick={() => handleSort('ProductID')}
                                                        >
                                                            <div className="flex items-center">
                                                                Product ID
                                                                {getSortIcon('ProductID')}
                                                            </div>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                                                            onClick={() => handleSort('Name')}
                                                        >
                                                            <div className="flex items-center">
                                                                Product Name
                                                                {getSortIcon('Name')}
                                                            </div>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                                                            onClick={() => handleSort('Quantity')}
                                                        >
                                                            <div className="flex items-center justify-end">
                                                                Quantity
                                                                {getSortIcon('Quantity')}
                                                            </div>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                                                            onClick={() => handleSort('LastUpdated')}
                                                        >
                                                            <div className="flex items-center justify-end">
                                                                Last Updated
                                                                {getSortIcon('LastUpdated')}
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    <AnimatePresence>
                                                        {productStorages.length > 0 ? (
                                                            productStorages.map((detail, index) => (
                                                                <motion.tr
                                                                    key={`${detail.ProductID}-${index}`}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -10 }}
                                                                    transition={{ duration: 0.2, delay: index * 0.02 }}
                                                                    className="hover:bg-gray-50 transition-colors duration-150"
                                                                >
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {detail.ProductID || 'N/A'}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {detail.ProductID || 'N/A'}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${detail.Quantity > 100
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : detail.Quantity > 10
                                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                                : 'bg-red-100 text-red-800'
                                                                            }`}>
                                                                            {detail.Quantity?.toLocaleString() || 0}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                                        {formatDate(detail.LastUpdated)}
                                                                    </td>
                                                                </motion.tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="4" className="px-6 py-12 text-center">
                                                                    <div className="text-gray-500">
                                                                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                                        </svg>
                                                                        <p className="text-lg font-medium mb-2">
                                                                            {searchTerm ? 'No matching products found' : 'No products found'}
                                                                        </p>
                                                                        <p className="text-sm">
                                                                            {searchTerm
                                                                                ? 'Try adjusting your search terms'
                                                                                : 'This warehouse currently has no inventory items'
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </AnimatePresence>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t flex-shrink-0">
                            <div className="flex items-center text-sm text-gray-600">
                                {!isLoading && !error && (
                                    <>
                                        <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Showing {filteredAndSortedProducts.length} of {products.length} products
                                    </>
                                )}
                            </div>
                            <div className="flex items-center space-x-3">
                                {!isLoading && !error && products.length > 0 && (
                                    <button
                                        onClick={handleRetry}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Refresh
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                                    onClick={() => setOpenModal(false)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default WarehouseInfoModal;