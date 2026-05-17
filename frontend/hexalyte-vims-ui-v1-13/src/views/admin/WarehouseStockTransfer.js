import React, { useState, useEffect } from 'react';
import { Package, ArrowRight, Clock, User, Building, Search, RefreshCw, Plus, Edit3, Eye, Warehouse, TrendingUp } from 'lucide-react';
import DataTable from "react-data-table-component";
import { createAxiosInstance } from "api/axiosInstance";
import StockTransferAddModal from "components/Modal/StockTransferAddModal";
import Swal from "sweetalert2";
import { getStoredTokens } from 'auth/tokenService';


function WarehouseStockTransfer() {
    const [transfers, setTransfers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [productStorage, setproductStorage] = useState([]);
    const [products, setProducts] = useState([]);
    const [openAddTransferModal, setOpenAddTransferModal] = useState(false);
    // const [openEditTransferModal, setOpenEditTransferModal] = useState(null);
    // const [openViewModal, setOpenViewModal] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [warehouseFilter, setWarehouseFilter] = useState("All");



    async function loadStockTransferData() {
        try {
            setIsLoading(true);
            const api = createAxiosInstance();
            const stockTransferData = await api.get('transfer');
            setTransfers(stockTransferData.data.transfers);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }

    async function loadWarehouses() {
        try {
            const api = createAxiosInstance();
            const response = await api.get('location');
            // console.log(response)
            setWarehouses(response.data.locations);
        } catch (error) {
            console.log(error);
        }
    }

    async function loadProductStorage() {
        try {
            const api = createAxiosInstance();
            const response = await api.get('productstorage');
            // console.log(response.data)
            setproductStorage(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    // console.log(warehouses);

    async function loadProducts() {
        try {
            const api = createAxiosInstance();
            const response = await api.get('product');
            setProducts(response.data.allProducts.filter(pro => pro.isActive !== false));
            // console.log(response)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadStockTransferData();
        loadWarehouses();
        loadProducts();
        loadProductStorage();
    }, []);

    const StatusBadge = ({ status }) => {
        let badgeClass = "px-3 py-1 rounded-full text-xs font-medium ";

        switch (status.toLowerCase()) {
            case "completed":
                badgeClass += "bg-green-100 text-green-800";
                break;
            case "pending":
                badgeClass += "bg-yellow-100 text-yellow-800";
                break;
            case "in transit":
                badgeClass += "bg-blue-100 text-blue-800";
                break;
            case "cancelled":
                badgeClass += "bg-red-100 text-red-800";
                break;
            default:
                badgeClass += "bg-gray-100 text-gray-800";
        }

        return <span className={badgeClass}>{status}</span>;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    // async function createTransfer(transfers) {
    //     const userid = getStoredTokens();
    //     const finalTransfers = transfers.map(item => ({
    //         ProductID: item.productId,
    //         sourceWarehouseId: item.sourceWarehouseId,
    //         targetWarehouseId: item.targetWarehouseId,
    //         quantity: Number(item.quantity),
    //         notes: item.notes || '',
    //         transferBy: userid.user.id
    //     }));

    //     const api = createAxiosInstance();
    //     const res = await api.post('transfer/bulk', finalTransfers);
    //     console.log(res)

    // }

    async function createTransfer(transfers) {
        const userid = getStoredTokens();
        const finalTransfers = transfers.map(item => ({
            ProductID: Number(item.productId),
            sourceWarehouseId: Number(item.sourceWarehouseId),
            targetWarehouseId: Number(item.targetWarehouseId),
            quantity: Number(item.quantity),
            notes: item.notes || '',
            transferBy: userid.user.id
        }));

        // console.log(finalTransfers);

        const api = createAxiosInstance();
        try {
            const res = await api.post('transfer/bulk', finalTransfers);
            // console.log(res)
            if (res.status === 200 || res.status === 201) {
                Swal.fire({
                    title: "Success",
                    text: `Stock Transfer Successfully`,
                    icon: "success"
                });
                loadStockTransferData();
                setOpenAddTransferModal(false);
            }

        } catch (err) {
            console.log(err.response.data)
            Swal.fire({
                title: "Error",
                text: err.response?.data?.error || err.message || "Failed to create transfer",
                icon: "error"
            });
        }
    }


    // async function createTransfer(transferData) {
    //     try {
    //         const {
    //             sourceWarehouseId,
    //             targetWarehouseId,
    //             notes,
    //             items
    //         } = transferData;
    //         console.log(transferData)
    //         // Basic validation
    //         if (!sourceWarehouseId || !targetWarehouseId) {
    //             throw new Error("Missing required fields");
    //         }

    //         if (sourceWarehouseId === targetWarehouseId) {
    //             throw new Error("Source and target warehouses must be different");
    //         }

    //         // Get user ID
    //         const userid = getStoredTokens();

    //         // Build payload for bulk transfer
    //         const transfers = items.map(item => ({
    //             ProductID: item.productId,
    //             sourceWarehouseId,
    //             targetWarehouseId,
    //             quantity: Number(item.quantity),
    //             notes: notes || '',
    //             transferBy: userid.user.id
    //         }));

    //         // API call
    //         const api = createAxiosInstance();
    //         const res = await api.post('transfer/bulk', transfers);
    //         console.log(res)
    //         if (res.status === 200 || res.status === 201) {
    //             Swal.fire({
    //                 title: "Success",
    //                 text: `Transferred ${items.length} product(s) successfully`,
    //                 icon: "success"
    //             });
    //             loadStockTransferData();
    //             setOpenAddTransferModal(false);
    //         }

    //     } catch (error) {
    //         console.error("Bulk transfer error:", error);
    //         Swal.fire({
    //             title: "Error",
    //             text: error.response?.data?.error || error.message || "Failed to create bulk transfer",
    //             icon: "error"
    //         });
    //     }
    // }




    // async function createTransfer(transferData) {
    //     try {
    //         const {
    //             productId,
    //             sourceWarehouseId,
    //             targetWarehouseId,
    //             quantity,
    //             notes
    //         } = transferData;

    //         if (!productId || !sourceWarehouseId || !targetWarehouseId || !quantity) {
    //             throw new Error("Missing required fields");
    //         }

    //         if (sourceWarehouseId === targetWarehouseId) {
    //             throw new Error("Source and target warehouses must be different");
    //         }

    //         const userid = getStoredTokens();
    //         // // console.log(userid.user.id);
    //         // setUserId(userid.user.id)
    //         // console.log(userId)

    //         const payload = {
    //             ProductID: productId,
    //             sourceWarehouseId: sourceWarehouseId,
    //             targetWarehouseId: targetWarehouseId,
    //             quantity: Number(quantity),
    //             notes: notes || '',
    //             transferBy: userid.user.id 
    //         };

    //         const api = createAxiosInstance();
    //         const res = await api.post('transfer', payload);
    //         console.log(res);
    //         console.log(payload)

    //         if (res.status === 200 || res.status === 201) {
    //             Swal.fire({
    //                 title: "Success",
    //                 text: "Transfer created successfully",
    //                 icon: "success"
    //             });
    //             loadStockTransferData();
    //             setOpenAddTransferModal(false);
    //         }
    //     } catch (error) {
    //         console.error("Transfer creation error:", error);
    //         Swal.fire({
    //             title: "Error",
    //             text: error.response?.data?.error || error.message || "Failed to create transfer",
    //             icon: "error"
    //         });
    //     }
    // }


    const filteredTransfers = transfers.filter(transfer => {
        const matchesSearch =
            transfer.id.toString().includes(searchQuery) ||
            (transfer.product?.Name && transfer.product.Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (transfer.sourceWarehouse?.WarehouseName && transfer.sourceWarehouse.WarehouseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (transfer.targetWarehouse?.WarehouseName && transfer.targetWarehouse.WarehouseName.toLowerCase().includes(searchQuery.toLowerCase()));

        // Since your API response doesn't show a status field, we'll skip status filtering
        const matchesStatus = statusFilter === "All"; // || transfer.status === statusFilter;

        const matchesWarehouse = warehouseFilter === "All" ||
            (transfer.sourceWarehouse?.WarehouseName === warehouseFilter) ||
            (transfer.targetWarehouse?.WarehouseName === warehouseFilter);

        return matchesSearch && matchesStatus && matchesWarehouse;
    });

    const transferStatuses = ["All", "Pending", "In Transit", "Completed", "Cancelled"];
    const warehouseOptions = ["All", ...warehouses.map(w => w.WarehouseName)];

    // DataTable custom styles
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "#f9fafb",
                borderRadius: "8px 8px 0 0",
                border: "none",
                minHeight: "56px",
            },
        },
        headCells: {
            style: {
                color: "#4b5563",
                fontSize: "14px",
                fontWeight: "600",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
        rows: {
            style: {
                fontSize: "14px",
                minHeight: "60px",
                borderBottom: "1px solid #f3f4f6",
                "&:last-of-type": {
                    borderBottom: "none",
                },
            },
            highlightOnHoverStyle: {
                backgroundColor: "#f3f4f6",
                cursor: "pointer",
                transitionDuration: "0.15s",
                transitionProperty: "background-color",
                borderBottomColor: "#f3f4f6",
                outlineColor: "transparent",
            },
        },
        pagination: {
            style: {
                border: "none",
                backgroundColor: "#fff",
                borderRadius: "0 0 8px 8px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            },
        },
    };

    // DataTable columns
    const columns = [
        {
            name: "Transfer ID",
            selector: row => row.id,
            sortable: true,
            width: "120px",
            cell: row => (
                <div className="text-sm font-medium text-gray-900">{row.id}</div>
            ),
        },
        {
            name: "Product",
            cell: row => (
                <div className="flex items-center py-2">
                    <div className="h-8 w-8 flex-shrink-0 rounded bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs">
                        {row.product?.Name?.charAt(0) || 'P'}
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                            {row.product?.Name || 'Unknown Product'}
                        </div>
                        <div className="text-sm text-gray-500">
                            {row.product?.ProductID || 'N/A'}
                        </div>
                    </div>
                </div>
            ),
            sortable: true,
            sortFunction: (a, b) => (a.product?.Name || '').localeCompare(b.product?.Name || ''),
            grow: 1,
        },
        {
            name: "Transfer Route",
            cell: row => (
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                        <Warehouse className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                            {row.sourceWarehouse?.WarehouseName || 'Unknown'}
                        </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <div className="flex items-center space-x-1">
                        <Warehouse className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                            {row.targetWarehouse?.WarehouseName || 'Unknown'}
                        </span>
                    </div>
                </div>
            ),
            grow: 1,
        },
        {
            name: "Quantity",
            selector: row => row.quantity,
            sortable: true,
            style: {
                fontWeight: 500,
                color: "#1f2937",
            },
        },
        {
            name: "Transfer Date",
            selector: row => formatDate(row.transferDate),
            sortable: true,
            sortFunction: (a, b) => new Date(a.transferDate) - new Date(b.transferDate),
            cell: row => (
                <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDate(row.transferDate)}
                </div>
            ),
        },
        // {
        //     name: "Actions",
        //     cell: row => (
        //         <div className="flex space-x-2">
        //             <button
        //                 className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors duration-200"
        //                 onClick={(e) => {
        //                     e.stopPropagation();
        //                     setOpenViewModal(row);
        //                 }}
        //                 title="View Transfer"
        //             >
        //                 <Eye className="h-5 w-5" />
        //             </button>
        //             <button
        //                 className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors duration-200"
        //                 onClick={(e) => {
        //                     e.stopPropagation();
        //                     setOpenEditTransferModal(row);
        //                 }}
        //                 title="Edit Transfer"
        //             >
        //                 <Edit3 className="h-5 w-5" />
        //             </button>
        //         </div>
        //     ),
        //     button: true,
        //     width: "100px",
        // },
    ];


    return (
        <>
            <div className="w-full min-h-screen p-6">
                <div className="w-full mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Stock Transfers</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage inventory transfers between warehouses
                            </p>
                        </div>
                        <button
                            onClick={() => setOpenAddTransferModal(true)}
                            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <Plus className="-ml-1 mr-2 h-5 w-5" />
                            New Transfer
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Search transfers by ID, product, or warehouse"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex space-x-2">

                                {/* <select
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    value={warehouseFilter}
                                    onChange={(e) => setWarehouseFilter(e.target.value)}
                                >
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map(warehouse => (
                                        <option key={warehouse.LocationID} value={warehouse.LocationID}>{warehouse.WarehouseName}</option>
                                    ))}
                                </select> */}
                                <button
                                    onClick={loadStockTransferData}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <RefreshCw className="-ml-0.5 mr-2 h-4 w-4" />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                                        <Package className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Total Transfers</p>
                                        <h3 className="mt-1 text-xl font-semibold text-gray-900">{transfers.length}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                                        <TrendingUp className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Active Transfers</p>
                                        <h3 className="mt-1 text-xl font-semibold text-gray-900">
                                            {transfers.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
                                        <Warehouse className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Warehouses</p>
                                        <h3 className="mt-1 text-xl font-semibold text-gray-900">{warehouses.length}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 rounded-md bg-indigo-100">
                                        <ArrowRight className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">This Month</p>
                                        <h3 className="mt-1 text-xl font-semibold text-gray-900">
                                            {transfers.filter(t => {
                                                const transferDate = new Date(t.transferDate);
                                                const currentDate = new Date();
                                                return transferDate.getMonth() === currentDate.getMonth() &&
                                                    transferDate.getFullYear() === currentDate.getFullYear();
                                            }).length}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={filteredTransfers}
                            customStyles={customStyles}
                            highlightOnHover
                            pointerOnHover
                            pagination
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                            progressPending={isLoading}
                            progressComponent={
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            }
                            noDataComponent={
                                <div className="flex flex-col items-center justify-center p-10 text-center">
                                    <Package className="w-16 h-16 text-gray-300 mb-4" />
                                    <p className="mt-4 text-lg font-medium text-gray-500">No transfers found</p>
                                    <p className="mt-1 text-sm text-gray-400">Try adjusting your search or create a new transfer</p>
                                </div>
                            }
                        // onRowClicked={(row) => setOpenViewModal(row)}
                        />
                    </div>


                </div>
            </div>

            {/* Modals */}
            {/* {openAddTransferModal && <AddTransferModal />} */}
            {openAddTransferModal && (
                <StockTransferAddModal setOpenModal={setOpenAddTransferModal}
                    createTransfer={createTransfer}
                    warehouses={warehouses}
                    products={products}
                    productStorage={productStorage}
                />
            )}
        </>
    );
}

export default WarehouseStockTransfer;