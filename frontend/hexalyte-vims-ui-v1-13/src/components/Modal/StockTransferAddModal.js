import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { createAxiosInstance } from 'api/axiosInstance';

const ProductSearchDropdown = ({
    products,
    productID,
    setProductID,
    disabled,
    error,
    onWarehouseLoad
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [availableWarehouses, setAvailableWarehouses] = useState([]);
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

    // Handle product selection
    const handleProductSelect = async (selectedProductID) => {
        setProductID(selectedProductID);

        // Set the search term to the selected product name
        const product = products.find(p => p.ProductID.toString() === selectedProductID);
        if (product) {
            setSearchTerm(product.Name);
        }

        setIsOpen(false);

        // After product is selected, load available warehouses
        const warehouses = await loadStockAvailableWarehouses(selectedProductID);
        onWarehouseLoad(warehouses);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsOpen(true);

        if (!value) {
            setProductID("");
            onWarehouseLoad([]); // Clear warehouses when product is cleared
        }
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const clearSelection = () => {
        setSearchTerm('');
        setProductID("");
        onWarehouseLoad([]); // Clear warehouses when selection is cleared
        inputRef.current?.focus();
    };

    const selectedProduct = products.find(p => p.ProductID.toString() === productID);
    const displayValue = selectedProduct ? selectedProduct.Name : searchTerm;

    useEffect(() => {
        if (productID === "") {
            setSearchTerm('');
        }
    }, [productID]);

    async function loadStockAvailableWarehouses(ProductID) {
        try {
            const api = createAxiosInstance();
            const response = await api.get(`productstorage/${ProductID}`);
            
            const warehouseLocationData = response.data.productStorageByProductID.map(storage => ({
                LocationID: storage.LocationID,
                Quantity: storage.Quantity,
                WarehouseName: storage.warehouselocation.WarehouseName
            }));

            setAvailableWarehouses(warehouseLocationData);
            return warehouseLocationData;
        } catch (error) {
            console.error("Error loading available warehouses:", error);
            return [];
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Product <span className="text-red-500">*</span>
            </label>

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    className={`block w-full pl-3 pr-10 py-2.5 text-base border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500`}
                    placeholder={disabled ? "No products available" : "Search products..."}
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

            {/* Error message */}
            {error && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                </div>
            )}

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

const StockTransferAddModal = ({
    products,
    warehouses,
    createTransfer,
    setOpenModal
}) => {
    const [transfers, setTransfers] = useState([
        { 
            productId: '', 
            sourceWarehouseId: '', 
            targetWarehouseId: '', 
            quantity: '', 
            notes: '',
            availableWarehouses: []
        }
    ]);

    const [errors, setErrors] = useState([]);
    const [allWarehouses, setAllWarehouses] = useState([]);

    useEffect(() => {
        async function loadWarehouses() {
            try {
                const api = createAxiosInstance();
                const response = await api.get('location');
                setAllWarehouses(response.data.locations);
            } catch (error) {
                console.log(error);
            }
        }
        loadWarehouses();
    }, []);

    // Add a new empty transfer
    const addTransfer = () => {
        setTransfers(prev => [
            ...prev,
            { 
                productId: '', 
                sourceWarehouseId: '', 
                targetWarehouseId: '', 
                quantity: '', 
                notes: '',
                availableWarehouses: []
            }
        ]);
    };

    // Remove a transfer by index
    const removeTransfer = (index) => {
        if (transfers.length <= 1) return;

        setTransfers(prev => prev.filter((_, i) => i !== index));
        setErrors(prev => prev.filter((_, i) => i !== index));
    };

    // Handle field changes for specific transfer
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        setTransfers(prev => prev.map((transfer, i) =>
            i === index ? { ...transfer, [name]: value } : transfer
        ));

        if (errors[index]?.[name]) {
            setErrors(prev => prev.map((err, i) =>
                i === index ? { ...err, [name]: null } : err
            ));
        }
    };

    // Handle product selection and load available warehouses
    const handleProductSelect = async (index, productId) => {
        try {
            const api = createAxiosInstance();
            const response = await api.get(`productstorage/${productId}`);
            
            const availableWarehouses = response.data.productStorageByProductID.map(storage => ({
                LocationID: storage.LocationID,
                Quantity: storage.Quantity,
                WarehouseName: storage.warehouselocation.WarehouseName
            }));

            setTransfers(prev => prev.map((transfer, i) =>
                i === index ? { 
                    ...transfer, 
                    productId,
                    sourceWarehouseId: '',
                    availableWarehouses 
                } : transfer
            ));

            if (errors[index]?.productId) {
                setErrors(prev => prev.map((err, i) =>
                    i === index ? { ...err, productId: null } : err
                ));
            }
        } catch (error) {
            console.error("Error loading available warehouses:", error);
        }
    };

    // Validate all transfers
    const validateForm = () => {
        const newErrors = transfers.map(transfer => {
            const transferErrors = {};

            if (!transfer.productId) {
                transferErrors.productId = "Please select a product";
            }

            if (!transfer.sourceWarehouseId) {
                transferErrors.sourceWarehouseId = "Please select a source warehouse";
            }

            if (!transfer.targetWarehouseId) {
                transferErrors.targetWarehouseId = "Please select a target warehouse";
            }

            if (transfer.sourceWarehouseId === transfer.targetWarehouseId) {
                transferErrors.targetWarehouseId = "Source and target warehouses must be different";
            }

            if (!transfer.quantity || parseInt(transfer.quantity) <= 0) {
                transferErrors.quantity = "Please enter a valid quantity (greater than 0)";
            } else {
                // Check if quantity exceeds available stock in source warehouse
                const sourceWarehouse = transfer.availableWarehouses.find(
                    w => w.LocationID === transfer.sourceWarehouseId
                );
                if (sourceWarehouse && parseInt(transfer.quantity) > sourceWarehouse.Quantity) {
                    transferErrors.quantity = `Quantity exceeds available stock (${sourceWarehouse.Quantity})`;
                }
            }

            return transferErrors;
        });

        setErrors(newErrors);
        return newErrors.every(err => Object.keys(err).length === 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await createTransfer(transfers);
                setOpenModal(false);
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-11/12 md:w-4/5 my-6 mx-auto max-w-4xl"
                >
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                New Stock Transfer
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
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {transfers.map((transfer, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-lg font-semibold text-gray-700">
                                                Transfer #{index + 1}
                                            </h4>
                                            {transfers.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="text-red-500 hover:text-red-700 flex items-center text-sm"
                                                    onClick={() => removeTransfer(index)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        {/* Product Selection */}
                                        <div className="mb-4">
                                            <ProductSearchDropdown
                                                products={products}
                                                productID={transfer.productId}
                                                setProductID={(id) => handleProductSelect(index, id)}
                                                disabled={false}
                                                error={errors[index]?.productId}
                                                onWarehouseLoad={(warehouses) => {
                                                    setTransfers(prev => prev.map((t, i) => 
                                                        i === index ? { ...t, availableWarehouses: warehouses } : t
                                                    ));
                                                }}
                                            />
                                        </div>

                                        {/* Warehouse Selection */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Source Warehouse <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="sourceWarehouseId"
                                                    className={`block w-full px-3 py-2.5 text-base border ${errors[index]?.sourceWarehouseId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                    value={transfer.sourceWarehouseId}
                                                    onChange={(e) => handleChange(index, e)}
                                                    disabled={!transfer.productId}
                                                >
                                                    <option value="">Select source warehouse</option>
                                                    {transfer.availableWarehouses.map((warehouse) => (
                                                        <option 
                                                            key={warehouse.LocationID} 
                                                            value={warehouse.LocationID}
                                                            disabled={warehouse.Quantity <= 0}
                                                        >
                                                            {warehouse.WarehouseName} (Available: {warehouse.Quantity})
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors[index]?.sourceWarehouseId && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        {errors[index]?.sourceWarehouseId}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Target Warehouse <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="targetWarehouseId"
                                                    className={`block w-full px-3 py-2.5 text-base border ${errors[index]?.targetWarehouseId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                    value={transfer.targetWarehouseId}
                                                    onChange={(e) => handleChange(index, e)}
                                                    disabled={!transfer.productId}
                                                >
                                                    <option value="">Select target warehouse</option>
                                                    {allWarehouses
                                                        .filter(wh => wh.LocationID !== transfer.sourceWarehouseId)
                                                        .map((warehouse) => (
                                                            <option key={warehouse.LocationID} value={warehouse.LocationID}>
                                                                {warehouse.WarehouseName}
                                                            </option>
                                                        ))}
                                                </select>
                                                {errors[index]?.targetWarehouseId && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        {errors[index]?.targetWarehouseId}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Transfer Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Quantity <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    className={`block w-full px-3 py-2.5 text-base border ${errors[index]?.quantity ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                    placeholder="Enter quantity"
                                                    value={transfer.quantity}
                                                    onChange={(e) => handleChange(index, e)}
                                                    min="1"
                                                    disabled={!transfer.sourceWarehouseId}
                                                />
                                                {errors[index]?.quantity && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        {errors[index]?.quantity}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Notes (Optional)
                                                </label>
                                                <textarea
                                                    name="notes"
                                                    className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                    rows="2"
                                                    placeholder="Transfer notes..."
                                                    value={transfer.notes}
                                                    onChange={(e) => handleChange(index, e)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Transfer Button */}
                                <div className="flex justify-center mb-6">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                                        onClick={addTransfer}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Another Transfer
                                    </button>
                                </div>

                                {/* Footer */}
                                <div className="bg-gray-50 pt-4 pb-3 -mx-6 -mb-6 px-6 flex items-center justify-end space-x-3 border-t">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                                        onClick={() => setOpenModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                        Add {transfers.length > 1 ? 'Transfers' : 'Transfer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default StockTransferAddModal;