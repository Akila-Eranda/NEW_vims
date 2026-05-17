

import DataTable from "react-data-table-component";
import React, { useEffect, useState } from "react";
import checkToken from "../../api/checkToken";
import { useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import StorageAddModal from "components/Modal/ProductStorageAddModal";
import Swal from "sweetalert2";
import InventoryEditModel from "components/Modal/ProductStorageEditModel";
import ProductInfoModal from "components/Modal/ProductStorageInfo";
import handleUserLogout from "api/logout";
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function ManageInventory(props) {
    const [productStorage, setProductStorage] = useState([]);
    const [openModal, setOpenModal] = useState(null);
    const [openProductStorageModal, setProductStorageAddModal] = useState(false);
    const [openInventoryUpdateModal, setOpenInventoryUpdateModal] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [locationFilter, setLocationFilter] = useState("All Locations");
    const [locations, setLocations] = useState(["All"]);

    const history = useHistory();
    const { setAuth } = useAuth();

    async function loadProductStorages() {
        try {
            setIsLoading(true);
            // const tokenStatus = await checkToken();

            // if (!tokenStatus) {
            //     setAuth(() => false);
            //     history.push("/auth/login");
            //     return;
            // }

            // const productStorages = await axios.get(`${BASE_URL}productstorage`, { withCredentials: true });

            const api = createAxiosInstance()
            const productStorages = await api.get('productstorage')

            if (productStorages.status === 200) {
                setProductStorage(() => productStorages.data);

                // Extract unique location IDs
                // const uniqueLocations = [...new Set(productStorages.data.map(item => item.LocationID))];
                // setLocations(["All", ...uniqueLocations]);
            } else {
                console.log(productStorages);
            }

            const warehouses = await api.get('location')
            if (warehouses.status === 200) {
                // setLocations(() => warehouses.data.locations)

                const uniqueLocations = new Set(warehouses.data.locations);
                setLocations(() => ["All Locations", ...uniqueLocations]);

            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            if (error.status === 404) {
                console.log(error.response.data.message);
            }
            // else if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
            //     sessionStorage.clear();
            //     history.push('/auth/login');
            // } 
            else {
                console.log(error);
            }
        }
    }

    async function addProductStorage(StorageData) {
        try {
            // const res = await axios.post(`${BASE_URL}productstorage`, StorageData, { withCredentials: true });

            const api = createAxiosInstance()
            const res = await api.post('productstorage', StorageData)

            if (res.status === 200) {
                if (res.data.newProductStorage.message === 'New inventory record created successfully') {
                    Swal.fire({
                        title: "Success",
                        text: "Inventory added successfully",
                        icon: "success"
                    });
                    loadProductStorages();
                    setProductStorageAddModal(false);
                }

                if (res.data.newProductStorage.message === 'Inventory updated successfully.') {
                    Swal.fire({
                        title: "Success",
                        text: "Inventory updated successfully",
                        icon: "success"
                    });
                    loadProductStorages();
                    setProductStorageAddModal(false);
                }
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "Failed to add inventory",
                icon: "error"
            });
        }
    }

    async function deleteProductStorage(productStorageRow) {
        try {
            const result = await Swal.fire({
                title: "Confirm Delete",
                text: `Are you sure you want to delete this inventory record?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                // const response = await axios.delete(
                //     `${BASE_URL}productstorage/${productStorageRow.ProductID}/${productStorageRow.LocationID}`, 
                //     { withCredentials: true }
                // );

                const api = createAxiosInstance()
                const response = await api.delete(`productstorage/${productStorageRow.ProductID}`)

                if (response.data.deletedProductStorage.status === 'success') {
                    Swal.fire(
                        'Deleted!',
                        'The inventory record has been deleted.',
                        'success'
                    );
                    loadProductStorages();
                }
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Failed to delete inventory record",
                icon: "error"
            });
        }
    }

    async function editInventory(inventoryData) {
        const date = new Date().toISOString();

        const updatedData = {
            Quantity: inventoryData.Quantity,
            LastUpdated: date,
        };

        try {
            // const res = await axios.put(
            //     `${BASE_URL}productstorage/${inventoryData.ProductID}/${inventoryData.LocationID}`, 
            //     updatedData, 
            //     { withCredentials: true }
            // );

            const api = createAxiosInstance()
            const res = await api.put(`productstorage/${inventoryData.ProductID}/${inventoryData.LocationID}`, updatedData)

            if (res.status === 200) {
                setOpenInventoryUpdateModal(() => false);
                Swal.fire({
                    title: "Success",
                    text: "Inventory details updated successfully",
                    icon: "success"
                });
                loadProductStorages();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Inventory details update failed",
                    icon: "error"
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "Inventory details update failed",
                icon: "error"
            });
        }
    }

    // Filter inventory based on search query and location filter
    const filteredInventory = productStorage.filter(item => {
        const matchesSearch =
            item.ProductID.toString().includes(searchQuery) ||
            item.product.Name.toLowerCase().includes(searchQuery.toLowerCase());  // search by product name too

        const matchesLocation = locationFilter === "All Locations" || item.LocationID.toString() === locationFilter;

        return matchesSearch && matchesLocation;
    });

    useEffect(() => {
        // if (!checkToken()) {
        //     handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
        //     return;
        // }

        loadProductStorages();
    }, []);

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

    const QuantityBadge = ({ quantity }) => {
        let badgeClass = "px-3 py-1 rounded-full text-xs font-medium ";

        if (quantity > 50) {
            badgeClass += "bg-green-100 text-green-800";
        } else if (quantity > 10) {
            badgeClass += "bg-yellow-100 text-yellow-800";
        } else if (quantity > 0) {
            badgeClass += "bg-red-100 text-red-800";
        } else {
            badgeClass += "bg-gray-100 text-gray-800";
        }

        return <span className={badgeClass}>{quantity}</span>;
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

    const columns = [
        {
            name: "Product ID",
            selector: row => row.ProductID,
            sortable: true,
            width: "120px",
            style: {
                fontWeight: 600,
                color: "#1f2937",
            },
        },
        {
            name: "Product Name",
            selector: row => row.product.Name,
            sortable: true,
            width: "170px",
            style: {
                fontWeight: 600,
                color: "#1f2937",
            },
        },
        {
            name: "Location",
            selector: row => (
                <div className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-medium">
                    {row.warehouselocation.WarehouseName}
                </div>
            ),
            sortable: true,
            sortFunction: (a, b) => a.LocationID - b.LocationID,
        },
        {
            name: "Quantity",
            selector: row => <QuantityBadge quantity={row.Quantity} />,
            sortable: true,
            sortFunction: (a, b) => a.Quantity - b.Quantity,
        },
        {
            name: "Last Updated",
            selector: row => formatDate(row.LastUpdated),
            sortable: true,
            sortFunction: (a, b) => new Date(a.LastUpdated) - new Date(b.LastUpdated),
            style: {
                color: "#6b7280",
            },
            grow: 1.5,
        },
    ];

    const totalQuantity = Number(
  productStorage.reduce((sum, item) => sum + Number(item.Quantity), 0)
);
    const lowStockItems = productStorage.filter(item => item.Quantity > 0 && item.Quantity <= 10).length;
    const outOfStockItems = productStorage.filter(item => item.Quantity === 0).length;

    return (
        <>
            <div className="w-full min-h-screen p-6">
                <div className="w-full mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage product inventory across warehouse locations
                            </p>
                        </div>
                        {/* <button
                            onClick={() => setProductStorageAddModal(true)}
                            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add To Inventory
                        </button> */}
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="Search by Product ID, Product Name or Location"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex space-x-2">
                                <select
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                >
                                    {locations.map(location => (
                                        <option key={location.LocationID} value={location.LocationID}>
                                            {location === "All Locations" ? "All Locations" : `${location.WarehouseName}`}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={loadProductStorages}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">

                        {/* Inventory Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Total Records</p>
                                        <h3 className="mt-1 text-xl font-semibold text-gray-900">{productStorage.length}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Total Quantity</p>
                                        <h3 className="mt-1 text-xl font-semibold text-gray-900">{totalQuantity}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                                        <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Low Stock</p>
                                        <h3 className="mt-1 text-xl font-semibold text-gray-900">{lowStockItems}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                                        <h3 className="mt-1 text-xl font-semibold text-gray-900">{outOfStockItems}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={filteredInventory}
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
                                    <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <p className="mt-4 text-lg font-medium text-gray-500">No inventory records found</p>
                                    <p className="mt-1 text-sm text-gray-400">Try adjusting your search or add new inventory</p>
                                </div>
                            }
                            onRowClicked={(row) => setOpenModal(row)}
                        />
                    </div>


                </div>
            </div>

            {openModal && (
                <ProductInfoModal setOpenModal={setOpenModal} inevntoryInfo={openModal} />
            )}

            {openInventoryUpdateModal && (
                <InventoryEditModel
                    setOpenModal={setOpenInventoryUpdateModal}
                    inventoryInfo={openInventoryUpdateModal}
                    editInventory={editInventory}
                />
            )}

            {openProductStorageModal && (
                <StorageAddModal setOpenModal={setProductStorageAddModal} addProductStorage={addProductStorage} />
            )}
        </>
    );
}

export default ManageInventory;