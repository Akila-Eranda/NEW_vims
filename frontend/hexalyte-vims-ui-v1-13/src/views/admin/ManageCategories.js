import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import CategoryMenu from "../../components/Menus/CategoryMenu";
import CategiryAddModal from "components/Modal/CategoryAddModel";
import Swal from "sweetalert2";
import CategoryEditModal from "components/Modal/CategoryEditModel";
import checkToken from "../../api/checkToken";
import handleUserLogout from "../../api/logout";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { createAxiosInstance } from "api/axiosInstance";

function ManageCategories() {
  // const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [categories, setCategories] = useState([]);
  const [openCategoryModal, setCategoryAddModal] = useState(false);
  const [openCategoryUpdateModal, setOpenCatgoeyUpdateModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { setAuth } = useAuth();
  const history = useHistory();

  async function loadCategorieData() {
    try {
      setIsLoading(true);
      // const categoryData = await axios.get(`${BASE_URL}category`, { withCredentials: true });
      // setCategories(() => [...categoryData.data.allCategory]);

      const api = createAxiosInstance()
      const categoryData = await api.get('category')

      setCategories(() => categoryData.data.allCategory.filter(category => category.isActive !== false));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
      //   sessionStorage.clear();
      //   history.push('/auth/login');
      // }
      if (error.status === 404 && error.response.data.message === "No Categories Found") {
        console.log("No Categories Found");
      } else {
        console.log(error)
      }
    }
  }

  async function addCategory(categoryData) {
    try {
      // const res = await axios.post(`${BASE_URL}category`, categoryData, { withCredentials: true });

      const api = createAxiosInstance()
      const res = await api.post('category', categoryData)

      if (res.status === 200) {
        if (res.data.newCategory.massege === 'Category id already exists') {
          Swal.fire({
            title: "Error",
            text: "Category ID already exists",
            icon: "error"
          });
        } else {
          Swal.fire({
            title: "Success",
            text: "Category added successfully",
            icon: "success"
          });
          loadCategorieData();
          setCategoryAddModal(false);
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Failed to add category",
        icon: "error"
      });
    }
  }

  async function deleteCategory(categoryRow) {
    try {
      Swal.fire({
        title: "Confirm Delete",
        text: `Are you sure you want to delete the category: ${categoryRow.Name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          async function deleteCategoryRequest(category) {
            try {
              // const deleteReq = await axios.delete(
              //   `${BASE_URL}category/${category.CategoryID}`, { withCredentials: true }
              // );

              const api = createAxiosInstance()
              const deleteReq = await api.delete(`category/${category.CategoryID}`)

              if (deleteReq.status === 200) {
                Swal.fire({
                  title: "Deleted!",
                  text: "Category has been deleted successfully",
                  icon: "success"
                });
                loadCategorieData();
              }
            } catch (error) {
              console.log(error);
              Swal.fire({
                title: "Error",
                text: "Failed to delete category",
                icon: "error"
              });
            }
          }

          deleteCategoryRequest(categoryRow);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function editCategory(categoryData) {
    const updatedData = {
      Name: categoryData.Name,
      Description: categoryData.Description,
    };

    try {
      // const res = await axios.put(`${BASE_URL}category/${categoryData.CategoryID}`, updatedData, { withCredentials: true });

      const api = createAxiosInstance()
      const res = await api.put(`category/${categoryData.CategoryID}`, updatedData)

      if (res.status === 200) {
        setOpenCatgoeyUpdateModal(() => false);
        Swal.fire({
          title: "Success",
          text: "Category details updated successfully",
          icon: "success"
        });
        loadCategorieData();
      } else {
        Swal.fire({
          title: "Error",
          text: "Category details update failed",
          icon: "error"
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Category details update failed",
        icon: "error"
      });
    }
  }

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => {
    const matchesSearch =
      (category.Name && category.Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (category.Description && category.Description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (category.CategoryID && category.CategoryID.toString().includes(searchQuery));

    return matchesSearch;
  });

  useEffect(() => {
    // if (!checkToken()) {
    //   handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
    //   return;
    // }

    loadCategorieData();
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

  // Generate a color for each category based on category ID
  const getCategoryColor = (categoryId) => {
    const colors = [
      { bg: "bg-blue-100", text: "text-blue-800" },
      { bg: "bg-green-100", text: "text-green-800" },
      { bg: "bg-purple-100", text: "text-purple-800" },
      { bg: "bg-yellow-100", text: "text-yellow-800" },
      { bg: "bg-pink-100", text: "text-pink-800" },
      { bg: "bg-indigo-100", text: "text-indigo-800" },
    ];

    const index = categoryId % colors.length;
    return colors[index];
  };

  const columns = [
    {
      name: "ID",
      selector: row => row.CategoryID,
      sortable: true,
      width: "80px",
      style: {
        fontWeight: 600,
        color: "#1f2937",
      },
    },
    {
      name: "Category",
      cell: row => {
        const colorScheme = getCategoryColor(row.CategoryID);
        return (
          <div className="flex items-center py-2">
            <div className={`h-10 w-10 flex-shrink-0 rounded-md ${colorScheme.bg} flex items-center justify-center ${colorScheme.text} font-bold text-lg`}>
              {row.Name ? row.Name.charAt(0) : 'C'}
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900">{row.Name}</div>
            </div>
          </div>
        );
      },
      sortable: true,
      sortFunction: (a, b) => a.Name.localeCompare(b.Name),
      grow: 1,
    },
    {
      name: "Description",
      selector: row => (
        <div className="py-2 text-gray-600">
          {row.Description}
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => a.Description.localeCompare(b.Description),
      grow: 2,
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex space-x-2">
          <button
            className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              setOpenCatgoeyUpdateModal(row);
            }}
            title="Edit Category"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              deleteCategory(row);
            }}
            title="Delete Category"
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
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage product categories and classifications
              </p>
            </div>
            <button
              onClick={() => setCategoryAddModal(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Category
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
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
                  placeholder="Search categories by name or description"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={loadCategorieData}
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

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredCategories}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-500">No categories found</p>
                  <p className="mt-1 text-sm text-gray-400">Try adjusting your search or add a new category</p>
                </div>
              }
            />
          </div>

          {/* Category Summary Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"> */}
          {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Total Categories</p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">{categories.length}</h3>
                </div>
              </div>
            </div> */}

          {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">With Descriptions</p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {categories.filter(category => category.Description && category.Description.trim() !== "").length}
                  </h3>
                </div>
              </div>
            </div> */}

          {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
                  <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Avg. Name Length</p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {categories.length ? Math.round(categories.reduce((sum, cat) => sum + (cat.Name ? cat.Name.length : 0), 0) / categories.length) : 0}
                  </h3>
                </div>
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </div>

      {openCategoryUpdateModal && (
        <CategoryEditModal
          setOpenModal={setOpenCatgoeyUpdateModal}
          categoryInfo={openCategoryUpdateModal}
          editCategory={editCategory}
        />
      )}

      {openCategoryModal && (
        <CategiryAddModal
          setOpenModal={setCategoryAddModal}
          addCategory={addCategory}
        />
      )}
    </>
  );
}

export default ManageCategories;