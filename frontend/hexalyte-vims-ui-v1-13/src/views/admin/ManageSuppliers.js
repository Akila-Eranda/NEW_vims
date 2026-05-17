// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import SuppplierMenu from "../../components/Menus/SupplierMenu";
// import SupllierAddModal from "components/Modal/SupplierAddModel";
// import Swal from "sweetalert2";
// import CategoryEditModal from "components/Modal/CategoryEditModel";
// import checkToken from "../../api/checkToken";
// import handleUserLogout from "../../api/logout";
// import { useAuth } from "../../context/AuthContext";
// import { useHistory } from "react-router-dom";

// function ManageSuppliers() {

//     const BASE_URL = process.env.REACT_APP_BASE_URL;

//     const [supplier, setSupplier] = useState([]);
//     const [openSupplierModal, setSuppplierAddModal] = useState(false);


//     const { setAuth } = useAuth();
//     const history = useHistory();

//     async function loadSupplierData() {
//         try {
//             const supplierData = await axios.get(`${BASE_URL}supplier`, { withCredentials: true });
//             // console.log(supplierData);
//             setSupplier(() => [...supplierData.data.suppliers]);
//         } catch (error) {

//             if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
//                 sessionStorage.clear()
//                 history.push('/auth/login')
//             }

//             console.log(error);
//         }

//     }

//     async function addSupplier(supplierData) {

//         try {
//             const res = await axios.post(`${BASE_URL}supplier`, supplierData, { withCredentials: true });
//             console.log(res);
//             if (res.status === 201) {
//                 Swal.fire({
//                     title: "Success",
//                     text: "Supplier Added Success",
//                     icon: "success"
//                 })
//                 loadSupplierData();
//                 setSuppplierAddModal(false);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     async function deleteSupplier(supplierRow) {
//         try {
//             Swal.fire({
//                 title: "Confirm Delete",
//                 text: `Are you sure to delete the Supplier: ${supplierRow.Name} ?`,
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#3085d6",
//                 cancelButtonColor: "#d33",
//                 confirmButtonText: "Yes, delete it!",
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     async function deleteSupplierRequest(supplier) {
//                         try {
//                             const deleteReq = await axios.delete(
//                                 `${BASE_URL}supplier/${supplier.SupplierID}`, { withCredentials: true }
//                             );
//                             // console.log(deleteReq);

//                             if (deleteReq.status === 200) {
//                                 loadSupplierData();
//                             }
//                         } catch (error) {
//                             console.log(error);
//                         }
//                     }

//                     deleteSupplierRequest(supplierRow);
//                     loadSupplierData();
//                 }
//             });
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     useEffect(() => {

//         if (!checkToken()) {
//             handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
//             return
//         }

//         loadSupplierData();
//     }, []);

//     const customStyles = {
//         headRow: {
//             style: {
//                 border: 'none',
//             },
//         },
//         headCells: {
//             style: {
//                 color: '#202124',
//                 fontSize: '14px',
//             },
//         },
//         rows: {
//             highlightOnHoverStyle: {
//                 backgroundColor: 'rgb(219, 234, 254)',
//                 borderBottomColor: '#FFFFFF',
//                 outline: '1px solid #FFFFFF',
//             },
//         },
//         pagination: {
//             style: {
//                 border: 'none',
//             },
//         },
//     };

//     const columns = [

//         {
//             name: 'Name',
//             selector: row => row.Name,
//             sortable: true,
//             // grow: 2,
//             style: {
//                 color: '#202124',
//                 fontSize: '14px',
//                 fontWeight: 500,
//             },
//         },
//         {
//             name: 'Contact Name',
//             selector: row => row.ContactName,
//             sortable: true,
//             style: {
//                 color: 'rgba(0,0,0,.54)',
//             },
//         },
//         // {
//         //     name: 'Contact Title',
//         //     selector: row => row.ContactTitle,
//         //     sortable: true,
//         //     style: {
//         //         color: 'rgba(0,0,0,.54)',
//         //     },
//         // },
//         {
//             name: 'Phone',
//             selector: row => row.Phone,
//             sortable: true,
//             style: {
//                 color: 'rgba(0,0,0,.54)',
//             },
//         },
//         {
//             name: 'Email',
//             selector: row => row.Email,
//             sortable: true,
//             style: {
//                 color: 'rgba(0,0,0,.54)',
//             },
//         },
//         {
//             name: 'Address',
//             selector: row => row.Address,
//             sortable: true,
//             style: {
//                 color: 'rgba(0,0,0,.54)',
//             },
//         },

//         {
//             cell: row => <SuppplierMenu
//                 deleteSupplier={deleteSupplier}
//                 //   editCategory={setOpenCatgoeyUpdateModal} 
//                 row={row} />,
//             allowOverFlow: true,
//             button: true,
//             width: '56px',
//         },
//     ];




//     return (
//         <>
//             <div className="w-full h-full p-4 relative">
//                 <h2 className="text-3xl font-bold mb-6">Manage Suppliers</h2>

//                 <div className="my-7">
//                     <div className="flex justify-items-end">
//                         <button
//                             className="bg-blue-400 px-8 py-2 rounded text-black font-medium"
//                             onClick={() => setSuppplierAddModal(() => true)}
//                         >
//                             Add New Supplier
//                         </button>
//                     </div>
//                 </div>

//                 <DataTable
//                     columns={columns}
//                     data={supplier}
//                     customStyles={customStyles}
//                     highlightOnHover
//                     pointerOnHover
//                     pagination
//                 />
//             </div>
//             {openSupplierModal ? (
//                 <>
//                     <SupllierAddModal setOpenModal={setSuppplierAddModal}
//                         addSupplier={addSupplier}
//                     />
//                 </>
//             ) : null}
//         </>
//     )
// }

// export default ManageSuppliers

import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import SuppplierMenu from "../../components/Menus/SupplierMenu";
import SupllierAddModal from "components/Modal/SupplierAddModel";
import SupplierEditModal from "components/Modal/SupplierEditModel"
import Swal from "sweetalert2";
import checkToken from "../../api/checkToken";
import handleUserLogout from "../../api/logout";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { createAxiosInstance } from "api/axiosInstance";
import SupplierInfoModal from "components/Modal/SupplierInfoModal";

function ManageSuppliers() {
  // const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [supplier, setSupplier] = useState([]);
  const [openSupplierModal, setSuppplierAddModal] = useState(false);
  const [openSupplierEditModal, setSuppplierEditModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [openSupplierInfoModal, setOpenSupplierInfoModal] = useState(null)

  const { setAuth } = useAuth();
  const history = useHistory();


  async function loadSupplierData() {
    try {
      setIsLoading(true);
      // const supplierData = await axios.get(`${BASE_URL}supplier`, { withCredentials: true });
      // setSupplier(() => [...supplierData.data.suppliers]);

      const api = createAxiosInstance()
      const supplierData = await api.get('supplier')

      setSupplier(() => supplierData.data.suppliers.filter(supplier => supplier.isActive !== false));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
      //   sessionStorage.clear();
      //   history.push('/auth/login');
      // }
      if (error.status === 404 && error.response.data.message === "no supplier found") {
        console.log("no supplier found");
      } else {
        console.log(error)
      }
    }
  }

  async function addSupplier(supplierData) {
    try {
      // const res = await axios.post(`${BASE_URL}supplier`, supplierData, { withCredentials: true });

      const api = createAxiosInstance()
      const res = await api.post('supplier', supplierData)

      if (res.status === 201) {
        Swal.fire({
          title: "Success",
          text: "Supplier added successfully",
          icon: "success"
        });
        loadSupplierData();
        setSuppplierAddModal(false);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Failed to add supplier",
        icon: "error"
      });
    }
  }

  async function editSupplier(supplierData) {

    const updatedData = {
      Name: supplierData.Name,
      CompanyName: supplierData.CompanyName,
      Phone: supplierData.Phone,
      Email: supplierData.Email,
      Address: supplierData.Address,

    }

    // const res = await axios.put(`${BASE_URL}supplier/${supplierData.SupplierID}`, updatedData, { withCredentials: true });

    const api = createAxiosInstance()
    const res = await api.put(`supplier/${supplierData.SupplierID}`, updatedData)

    if (res.status === 200) {
      setSuppplierEditModal(() => null);
      Swal.fire({
        title: "Success",
        text: "Supplier Details Updated successfully",
        icon: "success"
      })
      loadSupplierData();
    } else {
      Swal.fire({
        title: "Error",
        text: "Supplier Details Update Failed",
        icon: "error"
      })
    }
    // console.log(res)

  }

  async function deleteSupplier(supplierRow) {
    try {
      Swal.fire({
        title: "Confirm Delete",
        text: `Are you sure you want to delete the supplier: ${supplierRow.Name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          async function deleteSupplierRequest(supplier) {
            try {

              // const productsRes = await axios.get(`${BASE_URL}product`, {withCredentials: true})
              // if (productsRes.status === 200) {

              //   const allProducts = productsRes.data.allProducts;

              //   if(allProducts.find(product => product.SupplierID === supplier.SupplierID)){
              //     Swal.fire({
              //       title: 'Warning',
              //       text: 'Cannot Delete Supplier. Products from supplier exists',
              //       icon: 'warning'
              //     })
              //     return
              //   }

              // }

              // const deleteReq = await axios.delete(
              //   `${BASE_URL}supplier/${supplier.SupplierID}`, { withCredentials: true }
              // );

              const api = createAxiosInstance()
              const deleteReq = await api.delete(`supplier/${supplier.SupplierID}`)

              if (deleteReq.status === 200) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Supplier has been deleted successfully",
                  icon: "success"
                });
                loadSupplierData();
              }
            } catch (error) {
              console.log(error);
              Swal.fire({
                title: "Error",
                text: "Failed to delete supplier",
                icon: "error"
              });
            }
          }

          deleteSupplierRequest(supplierRow);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Filter suppliers based on search query
  const filteredSuppliers = supplier.filter(sup => {
    const matchesSearch =
      (sup.Name && sup.Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sup.CompanyName && sup.CompanyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sup.Phone && sup.Phone.includes(searchQuery)) ||
      (sup.Email && sup.Email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sup.Address && sup.Address.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  useEffect(() => {
    // if (!checkToken()) {
    //   handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
    //   return;
    // }

    loadSupplierData();
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
      name: "Supplier",
      cell: row => (
        <div className="flex items-center py-2">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {row.Name ? row.Name.charAt(0) : 'S'}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{row.Name}</div>
            <div className="text-gray-500">{row.CompanyName}</div>
          </div>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => a.Name.localeCompare(b.Name),
      grow: 2,
    },
    {
      name: "Contact",
      cell: row => (
        <div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-gray-600">{row.Phone}</span>
          </div>
          <div className="flex items-center mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-600 text-sm">{row.Email}</span>
          </div>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => a.Phone.localeCompare(b.Phone),
      grow: 2,
    },
    {
      name: "Address",
      cell: row => (
        <div className="py-1 px-3 bg-gray-100 rounded-md text-gray-700 text-sm max-w-xs truncate">
          {row.Address}
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => a.Address.localeCompare(b.Address),
      grow: 2,
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex space-x-2">
          <button
            className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
            title="Edit Supplier"
            onClick={() => setSuppplierEditModal(() => row)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              deleteSupplier(row);
            }}
            title="Delete Supplier"
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
              <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product suppliers and vendors
              </p>
            </div>
            <button
              onClick={() => setSuppplierAddModal(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Supplier
            </button>
          </div>

          {/* Search Bar */}
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
                  placeholder="Search suppliers by name, contact, email, or address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={loadSupplierData}
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
            {/* Supplier Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Suppliers</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">{supplier.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">With Email</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {supplier.filter(sup => sup.Email && sup.Email.trim() !== "").length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
                    <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">With Phone</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {supplier.filter(sup => sup.Phone && sup.Phone.trim() !== "").length}
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
              data={filteredSuppliers}
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
                  <p className="mt-4 text-lg font-medium text-gray-500">No suppliers found</p>
                  <p className="mt-1 text-sm text-gray-400">Try adjusting your search or add a new supplier</p>
                </div>
              }
              onRowClicked={(row) => setOpenSupplierInfoModal(row)}
            />
          </div>


        </div>
      </div>

      {openSupplierModal && (
        <SupllierAddModal
          setOpenModal={setSuppplierAddModal}
          addSupplier={addSupplier}
        />
      )}
      {
        openSupplierEditModal && (
          <SupplierEditModal
            setOpenModal={setSuppplierEditModal}
            editSupplier={editSupplier}
            supplierInfo={openSupplierEditModal}
          />
        )
      }
      {
        openSupplierInfoModal && (
          <SupplierInfoModal
            setOpenModal={setOpenSupplierInfoModal}
            supplier={openSupplierInfoModal}
          />
        )
      }
    </>
  );
}

export default ManageSuppliers;