import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import WarehouseMenu from "../../components/Menus/WarehouseMenu";
import WarehouseAddModal from "components/Modal/WarehouseAddModel";
import Swal from "sweetalert2";
import WarehouseEditModal from "components/Modal/WarehouseEditModel";
import checkToken from "../../api/checkToken";
import handleUserLogout from "../../api/logout";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { createAxiosInstance } from "api/axiosInstance";
import WarehouseInfoModal from "components/Modal/warehouseInfo";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function ManageWarehouses() {
    const [warehouses, setWarehouses] = useState([]);
    const [openWarehouseModal, setWarehouseAddModal] = useState(false);
    const [openWarehouseUpdateModal, setOpenWarehouseUpdateModal] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(null);


    const { setAuth } = useAuth();
    const history = useHistory();

    async function loadWarehouses() {
        try {
            setIsLoading(true);
            // const warehouseLocations = await axios.get(`${BASE_URL}location`, { withCredentials: true });
            const api = createAxiosInstance();
            const warehouseLocations = await api.get(`location`);
            setWarehouses(() => [...warehouseLocations.data.locations]);
            setIsLoading(false);
        } catch (error) {
            // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
            //     sessionStorage.clear();
            //     history.push('/auth/login');
            // }
            setIsLoading(false);

            if (error.status === 404 && error.response.data.message === "no location found") {
                console.log("no location found");
            } else {
                console.log(error)
            }

        }
    }

    async function addWarehouse(warehouseData) {
        try {
            // const res = await axios.post(`${BASE_URL}location`, warehouseData, { withCredentials: true });
            const api = createAxiosInstance();
            const res = await api.post(`location`, warehouseData);
            if (res.status === 201) {
                Swal.fire({
                    title: "Success",
                    text: "Warehouse Added Successfully",
                    icon: "success"
                });
                loadWarehouses();
                setWarehouseAddModal(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteWarehouse(warehouseRow) {
        try {
            Swal.fire({
                title: "Confirm Delete",
                text: `Are you sure to delete the Warehouse: #${warehouseRow.LocationID} - ${warehouseRow.WarehouseName}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    async function deleteWarehouseRequest(warehouse) {
                        try {
                            // const deleteReq = await axios.delete(
                            //     `${BASE_URL}location/${warehouse.LocationID}`, { withCredentials: true }
                            // );
                            const api = createAxiosInstance();
                            const deleteReq = await api.delete(`location/${warehouse.LocationID}`)

                            if (deleteReq.status === 204) {
                                loadWarehouses();
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Warehouse has been deleted.",
                                    icon: "success"
                                });
                            }
                        } catch (error) {
                            console.log(error);
                            Swal.fire({
                                title: "Error",
                                text: "Failed to delete warehouse.",
                                icon: "error"
                            });
                        }
                    }

                    deleteWarehouseRequest(warehouseRow);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function editWarehouse(warehouseData) {
        const updatedData = {
            WarehouseName: warehouseData.WarehouseName,
            Address: warehouseData.Address,
        };

        try {
            // const res = await axios.put(`${BASE_URL}location/${warehouseData.LocationID}`, updatedData, { withCredentials: true });
            const api = createAxiosInstance();
            const res = await api.put(`location/${warehouseData.LocationID}`, updatedData)
            if (res.status === 200) {
                setOpenWarehouseUpdateModal(() => false);
                Swal.fire({
                    title: "Success",
                    text: "Warehouse Details Updated Successfully",
                    icon: "success"
                });
                loadWarehouses();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Warehouse Details Update Failed",
                    icon: "error"
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "Warehouse Details Update Failed",
                icon: "error"
            });
        }
    }

    // Filter warehouses based on search query
    const filteredWarehouses = warehouses.filter(warehouse =>
        warehouse.LocationID.toString().includes(searchQuery) ||
        (warehouse.WarehouseName && warehouse.WarehouseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (warehouse.Address && warehouse.Address.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    useEffect(() => {
        // if (!checkToken()) {
        //     handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
        //     return;
        // }

        loadWarehouses();
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

    const columns = [
        {
            name: "Location ID",
            selector: row => row.LocationID,
            sortable: true,
            style: {
                fontWeight: 600,
                color: "#1f2937",
            },
        },
        {
            name: "Warehouse Name",
            selector: row => row.WarehouseName,
            sortable: true,
            style: {
                fontWeight: 500,
                color: "#1f2937",
            },
            grow: 2,
        },
        {
            name: "Address",
            selector: row => row.Address,
            sortable: true,
            style: {
                color: "#6b7280",
            },
            grow: 2,
        },
        {
            name: "Actions",
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
                        onClick={() => setOpenWarehouseUpdateModal(row)}
                        title="Edit Warehouse"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button
                        className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteWarehouse(row);
                        }}
                        title="Delete Warehouse"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ),
            button: true,
            width: "120px",
        },
    ];

    return (
        <>
            <div className="w-full min-h-screen p-6">
                <div className="w-full mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage all warehouse locations in one place
                            </p>
                        </div>
                        <button
                            onClick={() => setWarehouseAddModal(true)}
                            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            New Warehouse
                        </button>
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
                                    placeholder="Search warehouses by ID, name or address"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={loadWarehouses}
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

                        {/* Warehouse Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Total Warehouses</p>
                                        <h3 className="mt-1 text-xl font-semibold text-gray-900">{warehouses.length}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Warehouse Locations</p>
                                        <h3 className="mt-1 text-xl font-semibold text-gray-900">
                                            {new Set(warehouses.map(warehouse => warehouse.Address)).size}
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
                            data={filteredWarehouses}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="mt-4 text-lg font-medium text-gray-500">No warehouses found</p>
                                    <p className="mt-1 text-sm text-gray-400">Try adjusting your search or add a new warehouse</p>
                                </div>
                            }
                            onRowClicked={(row) => setOpenModal(row)}
                        />
                    </div>


                </div>
            </div>

            {openWarehouseModal && (
                <WarehouseAddModal setOpenModal={setWarehouseAddModal} addWarehouse={addWarehouse} />
            )}

            {openWarehouseUpdateModal && (
                <WarehouseEditModal
                    setOpenModal={setOpenWarehouseUpdateModal}
                    warehouseInfo={openWarehouseUpdateModal}
                    editWarehouse={editWarehouse}
                />
            )}

            {openModal && (
                <WarehouseInfoModal setOpenModal={setOpenModal} warehouseInfo={openModal} />
            )}
        </>
    );
}

export default ManageWarehouses;