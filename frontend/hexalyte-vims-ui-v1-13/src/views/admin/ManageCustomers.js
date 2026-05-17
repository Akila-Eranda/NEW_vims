import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import CustomerMenu from "../../components/Menus/CustomerMenu";
import CustomerAddModel from "components/Modal/CustomerAddModel";
import Swal from "sweetalert2";
import CustomerEditModal from "components/Modal/CustomerEditModel";
import checkToken from "../../api/checkToken";
import handleUserLogout from "../../api/logout";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { createAxiosInstance } from "api/axiosInstance";
import CustomerInfoModal from "components/Modal/CustomerInfoModal";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [openCustomerModal, setCustomerAddModal] = useState(false);
  const [openCustomerUpdateModal, setOpenCustomerUpdateModal] = useState(null);
  const [openCustomerInfoModal, setOpenCustomerInfoModal] = useState(null)
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { setAuth } = useAuth();
  const history = useHistory();

  async function loadCustomersData() {
    try {
      setIsLoading(true);
      // const customerData = await axios.get(`${BASE_URL}customer`, { withCredentials: true });

      const api = createAxiosInstance()
      const customerData = await api.get('customer')

      setCustomers(() => [...customerData.data.allCustomers]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
      //   sessionStorage.clear();
      //   history.push('/auth/login');
      // }
      if (error.status === 404 && error.response.data.message === "No Customers Found") {
        console.log("No Customers Found");
      } else {
        console.log(error)
      }
    }
  }

  async function addCustomer(addresData, customerData) {
    try {
      // const res = await axios.post(`${BASE_URL}customeraddress`, addresData, { withCredentials: true });

      const api = createAxiosInstance()
      const res = await api.post('customeraddress', addresData)

      if (res.status === 200) {
        const addressId = res.data.newAddress.AddressID;

        const customerWithAddress = {
          ...customerData,
          CustomerAddressID: addressId
        };

        try {
          // const res = await axios.post(`${BASE_URL}customer`, customerWithAddress, { withCredentials: true });

          const api = createAxiosInstance()
          const res = await api.post('customer', customerWithAddress)

          console.log(res)

          if (res.status === 200) {

            Swal.fire({
              title: "Success",
              text: "Customer added successfully",
              icon: "success"
            }).then(() => loadCustomersData()).then(() => setCustomerAddModal(false));

          }
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "Error",
            text: "Failed to add customer",
            icon: "error"
          });
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Failed to add customer address",
        icon: "error"
      });
    }
  }

  async function deleteCustomer(customerRow) {
    try {
      Swal.fire({
        title: `Confirm ${customerRow.isActive ? `Deactivation` : `Activation`}`,
        text: `Are you sure you want to ${customerRow.isActive ? `deactivate` : `active`} the customer: ${customerRow.Name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then((result) => {
        if (result.isConfirmed) {
          async function deleteCustomerRequest(customer) {
            try {
              // const deleteReq = await axios.delete(
              //   `${BASE_URL}customer/${customer.CustomerID}`, { withCredentials: true }
              // );

              const api = createAxiosInstance()
              const deleteReq = await api.delete(`customer/${customer.CustomerID}`)

              if (deleteReq.status === 200) {
                loadCustomersData();
              }
            } catch (error) {
              console.log(error);
              Swal.fire({
                title: "Error",
                text: "Failed to delete customer",
                icon: "error"
              });
            }
          }

          // async function deleteCustomerAddressRequest(customeraddresses) {
          //   try {
          //     // const deleteReq = await axios.delete(
          //     //   `${BASE_URL}customeraddress/${customeraddresses.CustomerAddressID}`, { withCredentials: true }
          //     // );

          //     const api = createAxiosInstance()
          //     const deleteReq = await api.delete(`customeraddress/${customeraddresses.CustomerAddressID}`)

          //     if (deleteReq.status === 200) {
          //       loadCustomersData();
          //     }
          //   } catch (error) {
          //     console.log(error);
          //     Swal.fire({
          //       title: "Error",
          //       text: "Failed to delete customer address",
          //       icon: "error"
          //     });
          //   }
          // }

          deleteCustomerRequest(customerRow);
          // deleteCustomerAddressRequest(customerRow);

          Swal.fire({
            title: `Customer ${customerRow.isActive ? `Deactivated!` : `Activated!`}`,
            icon: "success"
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function editCustomer(customerData) {
    const updatedData = {
      Name: customerData.Name,
      CompanyName: customerData.CompanyName,
      Phone: customerData.Phone,
      Email: customerData.Email,
      Note: customerData.Note
    };

    const updateAddressData = {
      AddressType: customerData.AddressType,
      Street: customerData.Street,
      City: customerData.City,
      State: customerData.State,
      PostalCode: customerData.PostalCode,
      Country: customerData.Country,
    };

    try {
      // const res = await axios.put(`${BASE_URL}customer/${customerData.CustomerID}`, updatedData, { withCredentials: true });
      // await axios.put(`${BASE_URL}customeraddress/${customerData.AddressId}`, updateAddressData, { withCredentials: true });

      const api = createAxiosInstance()
      const res = await api.put(`customer/${customerData.CustomerID}`, updatedData)
      await api.put(`customeraddress/${customerData.AddressId}`, updateAddressData)

      if (res.status === 200) {
        setOpenCustomerUpdateModal(() => false);
        Swal.fire({
          title: "Success",
          text: "Customer details updated successfully",
          icon: "success"
        });
        loadCustomersData();
      } else {
        Swal.fire({
          title: "Error",
          text: "Customer details update failed",
          icon: "error"
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Customer details update failed",
        icon: "error"
      });
    }
  }

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      (customer.Name && customer.Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.ContactName && customer.ContactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.Email && customer.Email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.Phone && customer.Phone.includes(searchQuery)) ||
      (customer.CustomerID && customer.CustomerID.toString().includes(searchQuery));

    return matchesSearch;
  });

  useEffect(() => {
    // if (!checkToken()) {
    //   handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
    //   return;
    // }

    loadCustomersData();
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
      name: "ID",
      selector: row => row.CustomerID,
      sortable: true,
      width: "80px",
      style: {
        fontWeight: 600,
        color: "#1f2937",
      },
    },
    {
      name: "Customer",
      cell: row => (
        <div className="flex items-center py-2">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            {row.Name ? row.Name.charAt(0) : 'C'}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{row.Name}</div>
            <div className="text-gray-500">{row.ContactName}</div>
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
      sortFunction: (a, b) => a.Email.localeCompare(b.Email),
      grow: 2,
    },
    {
      name: "Status",
      cell: row => (

        row.isActive ? <div className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-medium text-sm">
          Active
        </div> : <div className="px-3 py-1 rounded-md bg-red-50 text-red-700 font-medium text-sm">
          Inactive
        </div>

      ),
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex space-x-2">
          <button
            className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              setOpenCustomerUpdateModal(row);
            }}
            title="Edit Customer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          {row.isActive && <button
            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              deleteCustomer(row);
            }}
            title="Delete Customer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          </button>}
          {!row.isActive && <button
            className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              deleteCustomer(row);
            }}
            title="Delete Customer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>}
        </div>
      ),
      button: 'true',
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
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your customers and their information
              </p>
            </div>
            <button
              onClick={() => setCustomerAddModal(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Customer
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
                  placeholder="Search customers by name, contact, email, or phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={loadCustomersData}
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
            {/* Customer Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Customers</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">{customers.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">With Email</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {customers.filter(customer => customer.Email && customer.Email.trim() !== "").length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
                    <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Addresses</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {new Set(customers.map(customer => customer.CustomerAddressID)).size}
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
              data={filteredCustomers}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-500">No customers found</p>
                  <p className="mt-1 text-sm text-gray-400">Try adjusting your search or add a new customer</p>
                </div>
              }
              onRowClicked={(row) => setOpenCustomerInfoModal(row)}
            />
          </div>


        </div>
      </div>

      {openCustomerUpdateModal && (
        <CustomerEditModal
          setOpenModal={setOpenCustomerUpdateModal}
          customerInfo={openCustomerUpdateModal}
          editCustomer={editCustomer}
        />
      )}

      {openCustomerModal && (
        <CustomerAddModel
          setOpenModal={setCustomerAddModal}
          addCustomer={addCustomer}
        />
      )}

      {openCustomerInfoModal && (
        <CustomerInfoModal
          setOpenModal={setOpenCustomerInfoModal}
          customer={openCustomerInfoModal} />
      )}

    </>
  );
}

export default ManageCustomers;