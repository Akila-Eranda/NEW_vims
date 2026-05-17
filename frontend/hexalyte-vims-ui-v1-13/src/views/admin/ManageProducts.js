import ProductAddModal from "components/Modal/ProductAddModal";
import ProductEditModal from "components/Modal/ProductEditModal";
import ProductInfoModal from "components/Modal/ProductInfoModal";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import checkToken from "../../api/checkToken";
import { useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import handleUserLogout from "../../api/logout";
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const [openProductUpdateModal, setOpenProductUpdateModal] = useState(null);
  const [openProductAddModal, setProductAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState([]);

  const history = useHistory();
  const { setAuth } = useAuth();

  async function loadProductData() {
    try {
      // const tokenStatus = checkToken();
      setIsLoading(true);

      // const productData = await axios.get(`${BASE_URL}product`, { withCredentials: true });
      // setProducts(() => [...productData.data.allProducts]);
      // setProducts(() => productData.data.allProducts.filter(product => product.isActive !== false));

      const api = createAxiosInstance()
      const productData = await api.get('product')
      setProducts(() => productData.data.allProducts.filter(product => product.isActive !== false));

      // Extract unique categories
      const uniqueCategories = [...new Set(productData.data.allProducts.map(product => product.CategoryID))];
      setCategories(["All", ...uniqueCategories]);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
      //   sessionStorage.clear();
      //   history.push('/auth/login');
      // }

      if (error.status === 404 && error.response.data.message === "No Products Found") {
        console.log("No Products Found");
      } else {
        console.log(error)
      }

    }

  }

  async function deleteProduct(productRow) {
    try {
      Swal.fire({
        title: "Confirm Delete",
        text: `Are you sure to delete the product: ${productRow.Name} (ID: ${productRow.ProductID})?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          async function deleteProductRequest(product) {
            try {
              // const deleteReq = await axios.delete(
              //   `${BASE_URL}product/${product.ProductID}`, { withCredentials: true }
              // );

              const api = createAxiosInstance()
              const deleteReq = await api.delete(`product/${product.ProductID}`)

              if (deleteReq.status === 200) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Product has been deleted successfully",
                  icon: "success",
                });
                loadProductData();
              }
            } catch (error) {
              console.log(error);
              Swal.fire({
                title: "Error",
                text: "Failed to delete product",
                icon: "error",
              });
            }
          }

          deleteProductRequest(productRow);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function addProduct(productData) {
    try {

      if (productData.Name.trim() === "") {
        Swal.fire({
          title: "Warning",
          text: "Name cannot be Empty",
          icon: "warning",
        });
        return
      }

      if (productData.Description.trim() === "") {
        Swal.fire({
          title: "Warning",
          text: "Description cannot be Empty",
          icon: "warning",
        });
        return
      }

      if (Number(productData.BuyingPrice) <= 0) {
        Swal.fire({
          title: "Warning",
          text: "Enter a valid Buying Price",
          icon: "warning",
        });
        return
      }

      if (Number(productData.SellingPrice) <= 0) {
        Swal.fire({
          title: "Warning",
          text: "Enter a valid Selling Price",
          icon: "warning",
        });
        return
      }

      if (Number(productData.CategoryID) === 0) {
        Swal.fire({
          title: "Warning",
          text: "Select a Category",
          icon: "warning",
        });
        return
      }

      if (Number(productData.SupplierID) === 0) {
        Swal.fire({
          title: "Warning",
          text: "Select a Supplier",
          icon: "warning",
        });
        return
      }

      // const res = await axios.post(`${BASE_URL}product`, productData, { withCredentials: true });

      const api = createAxiosInstance()
      const res = await api.post('product', productData)

      if (res.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Product added successfully",
          icon: "success",
        });
        loadProductData();
        setProductAddModal(false);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Failed to add product",
        icon: "error",
      });
    }
  }

  async function editProduct(productData) {
    const updatedData = {
      Name: productData.Name,
      Description: productData.Description,
      SellingPrice: productData.SellingPrice,
      BuyingPrice: productData.BuyingPrice,
      QuantityInStock: productData.QuantityInStock,
      SupplierID: productData.SupplierID,
      CategoryID: productData.CategoryID,
    };

    if (updatedData.Name.trim() === "") {
      Swal.fire({
        title: "Warning",
        text: "Product Name cannot be empty",
        icon: "warning",
      });
      return
    } else if (updatedData.Description.trim() === "") {
      Swal.fire({
        title: "Warning",
        text: "Product Description cannot be empty",
        icon: "warning",
      });
      return
    } else if (updatedData.SellingPrice <= 0) {
      Swal.fire({
        title: "Warning",
        text: "Enter a valid Selling Price",
        icon: "warning",
      });
      return
    } else if (updatedData.BuyingPrice <= 0) {
      Swal.fire({
        title: "Warning",
        text: "Enter a valid Buying Price",
        icon: "warning",
      });
      return
    } else if (updatedData.SupplierID === 0) {
      Swal.fire({
        title: "Warning",
        text: "Select a Supplier",
        icon: "warning",
      });
      return
    } else if (updatedData.CategoryID === 0) {
      Swal.fire({
        title: "Warning",
        text: "Select a Category",
        icon: "warning",
      });
      return
    }

    try {
      // const res = await axios.put(`${BASE_URL}product/${productData.ProductID}`, updatedData, { withCredentials: true });

      const api = createAxiosInstance()
      const res = await api.put(`product/${productData.ProductID}`, updatedData)

      if (res.status === 200) {
        setOpenProductUpdateModal(() => false);
        Swal.fire({
          title: "Success",
          text: "Product details updated successfully",
          icon: "success",
        });
        loadProductData();
      } else {
        Swal.fire({
          title: "Error",
          text: "Product details update failed",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Product details update failed",
        icon: "error",
      });
    }
  }

  // Filter products based on search query and category filter
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      (product.Name && product.Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.Description && product.Description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.ProductID && product.ProductID.toString().includes(searchQuery));

    const matchesCategory = categoryFilter === "All" || product.CategoryID === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    // if (!checkToken()) {
    //   handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
    //   return;
    // }

    loadProductData();

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

  const StockBadge = ({ quantity }) => {
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const columns = [
    {
      name: "ID",
      selector: row => row.ProductID,
      sortable: true,
      width: "80px",
      style: {
        fontWeight: 600,
        color: "#1f2937",
      },
    },
    {
      name: "Product",
      cell: row => (
        <div className="flex items-center py-2">
          <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg border border-indigo-200">
            {row.Name ? row.Name.charAt(0) : 'P'}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{row.Name}</div>
            <div className="text-gray-500 text-sm truncate max-w-xs">{row.Description}</div>
          </div>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => a.Name.localeCompare(b.Name),
      grow: 2,
    },
    {
      name: "Price",
      selector: row => formatPrice(row.SellingPrice),
      sortable: true,
      sortFunction: (a, b) => a.SellingPrice - b.SellingPrice,
      style: {
        fontWeight: 500,
        color: "#1f2937",
      },
    },
    {
      name: "Stock",
      selector: row => <StockBadge quantity={row.QuantityInStock} />,
      sortable: true,
      sortFunction: (a, b) => a.QuantityInStock - b.QuantityInStock,
    },
    {
      name: "Category",
      selector: row => row.category.Name,
      sortable: true,
      style: {
        color: "#6b7280",
      },
    },
    {
      name: "Supplier",
      selector: row => row.supplier.Name,
      sortable: true,
      style: {
        color: "#6b7280",
      },
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex space-x-2">
          <button
            className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              setOpenProductUpdateModal(row);
            }}
            title="Edit Product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              deleteProduct(row);
            }}
            title="Delete Product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
      button: `true`,
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
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product inventory and details
              </p>
            </div>
            <button
              onClick={() => setProductAddModal(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Product
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
                  placeholder="Search products by name, description, or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button
                  onClick={loadProductData}
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

            {/* Product Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">{products.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">In Stock</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {products.filter(product => product.QuantityInStock > 0).length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Low Stock Alert</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {products.filter(product => product.QuantityInStock > 0 && product.QuantityInStock <= 10).length}
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
              data={filteredProducts}
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
                  <p className="mt-4 text-lg font-medium text-gray-500">No products found</p>
                  <p className="mt-1 text-sm text-gray-400">Try adjusting your search or add a new product</p>
                </div>
              }
              onRowClicked={(row) => setOpenModal(row)}
            />
          </div>


        </div>
      </div>

      {openModal && (
        <ProductInfoModal setOpenModal={setOpenModal} prodInfo={openModal} />
      )}

      {openProductUpdateModal && (
        <ProductEditModal
          setOpenModal={setOpenProductUpdateModal}
          prodInfo={openProductUpdateModal}
          editProduct={editProduct}
        />
      )}

      {openProductAddModal && (
        <ProductAddModal setOpenModal={setProductAddModal} addProduct={addProduct} />
      )}
    </>
  );
}

export default ManageProducts;