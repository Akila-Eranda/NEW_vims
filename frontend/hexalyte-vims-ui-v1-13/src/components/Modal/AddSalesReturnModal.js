import { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, Trash2, Package, Calendar, User, FileText, AlertCircle, Search } from 'lucide-react';
import { createAxiosInstance } from 'api/axiosInstance';
import { motion } from "framer-motion";
import Select from 'react-select';
import Swal from "sweetalert2";

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

    // Filter products based on search term and selected location storage
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
                    placeholder={disabled ? "Select sales order first" : "Search products..."}
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

const AddSalesReturnModal = ({ isOpen, onClose, fetchReturnOrders }) => {
    const [formData, setFormData] = useState({
        SalesOrderID: '',
        ReturnDate: new Date().toISOString().split('T')[0],
        Reason: '',
        CreatedBy: 1
    });

    const [selectedSalesOrderId, setSelectedSalesOrderId] = useState('');
    const [selectedLocationId, setSelectedLocationId] = useState('');

    // Load Details
    const [salesOrders1, setselesOrders] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [selectedStorage, setSelectedStorage] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [productStorage, setProductStorage] = useState([]);

    // Exchange items state
    const [exchangeItems, setExchangeItems] = useState([]);

    // Sales item for adding to exchange
    const [salesItem, setSalesItem] = useState({
        ProductID: "0",
        Quantity: "",
        SellingPrice: ""
    });

    const [returnItems, setReturnItems] = useState([
        { ProductID: '', Quantity: 1, Note: '' }
    ]);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const api = createAxiosInstance();
    //         const [productRes, warehouseRes, customerRes, SalesOrderRes, productStoragesRes] = await Promise.all([
    //             api.get("product"),
    //             api.get("location"),
    //             api.get("customer"),
    //             api.get("salesorder"),
    //             api.get("productstorage"),
    //         ]);
    //         setProducts(productRes.data.allProducts.filter(p => p.isActive));
    //         setWarehouses(warehouseRes.data.locations);
    //         setCustomers(customerRes.data.allCustomers);
    //         setselesOrders(SalesOrderRes.data.salesorders);
    //         setProductStorage(productStoragesRes.data);
    //     };

    //     fetchData();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            const api = createAxiosInstance();
            try {
                //   isLoadingItems(true);

                const productRes = await api.get("product");
                setProducts(productRes.data.allProducts.filter(product => product.isActive !== false) || []);

                const warehouseRes = await api.get("location");
                setWarehouses(warehouseRes.data.locations || []);

                const customerRes = await api.get("customer");
                setCustomers(customerRes.data.allCustomers || []);

                const salesOrderRes = await api.get("salesorder");
                setselesOrders(salesOrderRes.data.salesorders.filter(order => order.isActive !== false) || []);
                const storageRes = await api.get("productstorage");
                setProductStorage(storageRes.data || []);

            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchData();
    }, []);

    // Filter storage by selected location
    useEffect(() => {
        if (selectedLocationId) {
            const filteredStorage = productStorage.filter(storage =>
                storage.LocationID === parseInt(selectedLocationId)
            );
            setSelectedStorage(filteredStorage);
        } else {
            setSelectedStorage([]);
        }
    }, [selectedLocationId, productStorage]);

    // Update selling price when product is selected
    useEffect(() => {
        if (salesItem.ProductID !== "0") {
            const selectedProduct = products.find(p => p.ProductID.toString() === salesItem.ProductID);
            if (selectedProduct) {
                setSalesItem(prev => ({
                    ...prev,
                    SellingPrice: selectedProduct.SellingPrice || 0
                }));
            }
        } else {
            setSalesItem(prev => ({
                ...prev,
                SellingPrice: ""
            }));
        }
    }, [salesItem.ProductID, products]);

    // Reset items on close
    useEffect(() => {
        if (!isOpen) {
            setOrderItems([]);
            setExchangeItems([]);
            setSalesItem({ ProductID: "0", Quantity: "", SellingPrice: "" });
        }
    }, [isOpen]);

    async function fetchOrderItems(orderId) {
        if (!orderId) {
            setOrderItems([]);
            return;
        }
        try {
            setIsLoadingItems(true);
            const api = createAxiosInstance();
            const res = await api.get(`salesorderdetails/${orderId}`);
            setOrderItems(res?.data?.data || []);
        } catch (err) {
            setOrderItems([]);
        } finally {
            setIsLoadingItems(false);
        }
    }

    const salesOrderOptions = useMemo(() => {
        return salesOrders1.map((order) => {
            const customer = customers.find(c => c.CustomerID === order.CustomerID);
            const location = warehouses.find(c => c.LocationID === order.LocationID);
            const orderDate = new Date(order.OrderDate);
            const formattedDate = orderDate.toLocaleString("en-US", {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
            });
            return {
                value: order.OrderID,
                label: `#${order.OrderID} (Customer - ${customer ? customer.Name : "Unknown"}) (Location - ${location?.WarehouseName || "Unknown"}) (Date - ${formattedDate || "Unknown"})`

            };
        });
    }, [salesOrders1, customers, warehouses]);
    // Add exchange item function
    const addExchangeItem = (e) => {
        e.preventDefault();

        if (!salesItem.ProductID || salesItem.ProductID === "0") {
            alert("Please select a product");
            return;
        }

        if (!salesItem.Quantity || parseInt(salesItem.Quantity) <= 0) {
            alert("Please enter a valid quantity");
            return;
        }

        // Check if product already exists in exchange items
        const existingItemIndex = exchangeItems.findIndex(item =>
            item.ProductID.toString() === salesItem.ProductID
        );

        const selectedProduct = products.find(p => p.ProductID.toString() === salesItem.ProductID);
        const quantity = parseInt(salesItem.Quantity);
        const unitPrice = parseFloat(salesItem.SellingPrice) || 0;
        const totalPrice = quantity * unitPrice;

        const newItem = {
            ProductID: parseInt(salesItem.ProductID),
            ProductName: selectedProduct?.Name || '',
            Quantity: quantity,
            UnitPrice: unitPrice,
            TotalPrice: totalPrice
        };

        if (existingItemIndex >= 0) {
            // Update existing item quantity
            const updatedItems = [...exchangeItems];
            updatedItems[existingItemIndex].Quantity += quantity;
            updatedItems[existingItemIndex].TotalPrice = updatedItems[existingItemIndex].Quantity * unitPrice;
            setExchangeItems(updatedItems);
        } else {
            // Add new item
            setExchangeItems(prev => [...prev, newItem]);
        }

        // Reset form
        setSalesItem({
            ProductID: "0",
            Quantity: "",
            SellingPrice: ""
        });
    };

    // Delete exchange item function
    const deleteExchangeItem = (productId) => {
        setExchangeItems(prev => prev.filter(item => item.ProductID !== productId));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.SalesOrderID) {
            newErrors.SalesOrderID = 'Sales Order is required';
        }

        if (!formData.ReturnDate) {
            newErrors.ReturnDate = 'Return date is required';
        }

        if (!formData.Reason.trim()) {
            newErrors.Reason = 'Reason is required';
        }

        // Validate return items
        returnItems.forEach((item, index) => {
            if (!item.ProductID) {
                newErrors[`item_${index}_product`] = 'Product is required';
            }
            if (!item.Quantity || item.Quantity < 1) {
                newErrors[`item_${index}_quantity`] = 'Quantity must be at least 1';
            }
        });

        // Check for duplicate products
        const productIds = returnItems.map(item => item.ProductID).filter(Boolean);
        const duplicates = productIds.filter((id, index) => productIds.indexOf(id) !== index);
        if (duplicates.length > 0) {
            newErrors.duplicateProducts = 'Cannot have duplicate products';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!validateForm()) {

        //     return;
        // }

        setIsSubmitting(true);

        const submitData = {
            CreatedBy: parseInt(formData.CreatedBy),
            LocationID: parseInt(selectedLocationId),
            Reason: formData.Reason.trim() || '',
            ReturnItems: orderItems
                .filter(item => item.Quantity > 0)
                .map(item => ({
                    ProductID: parseInt(item.ProductID),
                    Quantity: parseInt(item.Quantity),
                    Note: formData.Reason.trim() || ''
                })),
            ExchangeItems: exchangeItems.map(item => ({
                ProductID: parseInt(item.ProductID),
                Quantity: parseInt(item.Quantity),
                UnitPrice: parseFloat(item.UnitPrice)
            }))
        };


        try {
            const api = createAxiosInstance();
            const res = await api.put(`return/salesorder/${selectedSalesOrderId}`, submitData);
            console.log(res)
            if (res.status === 200 && res.data.updatedSalesorder.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Done!",
                    text: res.data?.updatedSalesorder.message || "Return submitted successfully.",
                    confirmButtonColor: "#3085d6",
                }).then(() => {
                    fetchReturnOrders();
                    handleClose();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: res.data.updatedSalesorder.message || "Something went wrong!",
                    confirmButtonColor: "#d33",
                });
            }

        } catch (error) {
            console.error("Error submitting return:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to submit return.",
                confirmButtonColor: "#d33",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            SalesOrderID: '',
            ReturnDate: new Date().toISOString().split('T')[0],
            Reason: '',
            CreatedBy: 1
        });
        setReturnItems([{ ProductID: '', Quantity: 1, Note: '' }]);
        setExchangeItems([]);
        setSalesItem({ ProductID: "0", Quantity: "", SellingPrice: "" });
        setSelectedSalesOrderId('');
        setSelectedLocationId('');
        setOrderItems([]);
        setErrors({});
        setIsSubmitting(false);
        onClose();
    };

    const addReturnItem = () => {
        setReturnItems([...returnItems, { ProductID: '', Quantity: 1, Note: '' }]);
    };

    const removeReturnItem = (index) => {
        if (returnItems.length > 1) {
            const newItems = returnItems.filter((_, i) => i !== index);
            setReturnItems(newItems);
        }
    };

    const updateReturnItem = (index, field, value) => {
        const newItems = [...returnItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setReturnItems(newItems);

        // Clear related errors
        const newErrors = { ...errors };
        delete newErrors[`item_${index}_${field.toLowerCase()}`];
        if (field === 'ProductID') {
            delete newErrors.duplicateProducts;
        }
        setErrors(newErrors);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
                    onClick={handleClose}
                />

                {/* Modal */}
                <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Add Sales Return</h3>
                                <p className="text-sm text-gray-500">Create a new return order for sold items</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
                        {/* Basic Information */}
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-4 h-4 text-gray-600" />
                                <h4 className="font-medium text-gray-900">Return Information</h4>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sales Order *
                                    </label>
                                    <Select
                                        options={salesOrderOptions}
                                        value={salesOrderOptions.find(option => option.value === formData.SalesOrderID)}
                                        onChange={(selectedOption) => {
                                            const selectedId = selectedOption?.value || '';
                                            const selectedOrder = salesOrders1.find(order => order.OrderID === selectedId);
                                            const locationId = selectedOrder?.LocationID || '';

                                            setFormData({ ...formData, SalesOrderID: selectedId });
                                            setSelectedSalesOrderId(selectedId);
                                            setSelectedLocationId(locationId);

                                            const newErrors = { ...errors };
                                            delete newErrors.SalesOrderID;
                                            setErrors(newErrors);

                                            fetchOrderItems(selectedId);
                                        }}
                                        className={`w-full ${errors.SalesOrderID ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="Select Sales Order"
                                        isSearchable
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                minHeight: '42px',
                                                borderColor: errors.SalesOrderID ? '#fca5a5' : '#d1d5db',
                                                '&:hover': {
                                                    borderColor: errors.SalesOrderID ? '#fca5a5' : '#d1d5db'
                                                }
                                            })
                                        }}
                                    />
                                    {errors.SalesOrderID && (
                                        <p className="mt-1 text-sm text-red-600">{errors.SalesOrderID}</p>
                                    )}
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Return *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter reason for return..."
                                    value={formData.Reason}
                                    onChange={(e) => setFormData({ ...formData, Reason: e.target.value })}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.Reason ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                />
                                {errors.Reason && (
                                    <p className="mt-1 text-sm text-red-600">{errors.Reason}</p>
                                )}
                            </div>
                        </div>

                        {/* Return Items */}
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-600" />
                                    <h4 className="font-medium text-gray-900">Order Items (Return)</h4>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {orderItems.length > 0 ? (
                                                orderItems.map((item, index) => {
                                                    const qty = Number(item.Quantity) || 0;
                                                    const unitPrice = Number(item.UnitPrice) || 0;
                                                    const totalPrice = qty * unitPrice;

                                                    const updateQuantity = (newQty) => {
                                                        if (newQty < 0) newQty = 0;
                                                        setOrderItems((prev) =>
                                                            prev.map((it, i) =>
                                                                i === index ? { ...it, Quantity: newQty } : it
                                                            )
                                                        );
                                                    };

                                                    const deleteRow = () => {
                                                        setOrderItems((prev) => prev.filter((_, i) => i !== index));
                                                    };

                                                    return (
                                                        <motion.tr
                                                            key={index}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {item.ProductID}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {item.product?.Name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <button
                                                                        onClick={() => updateQuantity(qty - 1)}
                                                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                                                    >
                                                                        −
                                                                    </button>
                                                                    <input
                                                                        type=""
                                                                        value={qty}
                                                                        onChange={(e) => updateQuantity(Number(e.target.value))}
                                                                        className="w-16 text-center border rounded"
                                                                    />
                                                                    <button
                                                                        onClick={() => updateQuantity(qty + 1)}
                                                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                                {unitPrice.toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                                {totalPrice.toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                                <button
                                                                    onClick={deleteRow}
                                                                    className="text-red-600 hover:text-red-900 transition duration-200"
                                                                >
                                                                    <Trash2 className="h-5 w-5" />
                                                                </button>
                                                            </td>
                                                        </motion.tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                        {isLoadingItems ? 'Loading items...' : 'No items found'}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Exchange Items */}
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-600" />
                                    <h4 className="font-medium text-gray-900">Exchange Items</h4>
                                </div>
                            </div>

                            {/* Add Product Form */}
                            <div className="mb-8">
                                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                    <Plus className="h-5 w-5 mr-2 text-blue-500" />
                                    Add Product for Exchange
                                </h4>
                                <form onSubmit={addExchangeItem} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <ProductSearchDropdown
                                                products={products}
                                                selectedStorage={selectedStorage}
                                                salesItem={salesItem}
                                                setSalesItem={setSalesItem}
                                                disabled={!selectedSalesOrderId}
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
                                                min="1"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-transparent mb-1">Add</label>
                                            <button
                                                type="submit"
                                                className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:bg-blue-300"
                                                disabled={!selectedSalesOrderId || salesItem.ProductID === "0" || !salesItem.Quantity}
                                            >
                                                <Plus className="h-5 w-5 mr-2" />
                                                Add Item
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Exchange Items Table */}
                            <div className="mb-6">
                                <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {exchangeItems.length > 0 ? (
                                                exchangeItems.map((item, index) => (
                                                    <motion.tr
                                                        key={index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ProductID}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ProductName}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.Quantity}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.UnitPrice.toLocaleString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.TotalPrice.toLocaleString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                            <button
                                                                onClick={() => deleteExchangeItem(item.ProductID)}
                                                                className="text-red-600 hover:text-red-900 transition duration-200"
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                        No exchange items added yet
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h5 className="font-medium text-gray-900 mb-2">Return Summary</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Return Items:</span>
                                    <span className="ml-2 font-medium">{orderItems.filter(item => item.Quantity > 0).length}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Exchange Items:</span>
                                    <span className="ml-2 font-medium">{exchangeItems.length}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Return Value:</span>
                                    <span className="ml-2 font-medium text-red-600">
                                        LKR {orderItems.reduce((sum, item) => {
                                            const qty = Number(item.Quantity) || 0;
                                            const price = Number(item.UnitPrice) || 0;
                                            return sum + (qty * price);
                                        }, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Exchange Value:</span>
                                    <span className="ml-2 font-medium text-green-600">
                                        LKR {exchangeItems.reduce((sum, item) => sum + item.TotalPrice, 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Net Balance:</span>
                                    <span className={`font-bold ${(exchangeItems.reduce((sum, item) => sum + item.TotalPrice, 0) -
                                        orderItems.reduce((sum, item) => {
                                            const qty = Number(item.Quantity) || 0;
                                            const price = Number(item.UnitPrice) || 0;
                                            return sum + (qty * price);
                                        }, 0)) >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        LKR {Math.abs(
                                            exchangeItems.reduce((sum, item) => sum + item.TotalPrice, 0) -
                                            orderItems.reduce((sum, item) => {
                                                const qty = Number(item.Quantity) || 0;
                                                const price = Number(item.UnitPrice) || 0;
                                                return sum + (qty * price);
                                            }, 0)
                                        ).toLocaleString()}
                                        {(exchangeItems.reduce((sum, item) => sum + item.TotalPrice, 0) -
                                            orderItems.reduce((sum, item) => {
                                                const qty = Number(item.Quantity) || 0;
                                                const price = Number(item.UnitPrice) || 0;
                                                return sum + (qty * price);
                                            }, 0)) >= 0 ? ' (Customer pays)' : ' (Refund to customer)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || (!orderItems.some(item => item.Quantity > 0) && exchangeItems.length === 0)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                {isSubmitting ? 'Creating...' : 'Create Return'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSalesReturnModal;