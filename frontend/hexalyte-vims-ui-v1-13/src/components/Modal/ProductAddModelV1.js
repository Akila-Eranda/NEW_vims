// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// function ProductAddModal({ setOpenModal , loadProducts}) {
//   const [categories, setCategories] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);

//   const [newProduct, setNewProduct] = useState({
//     Name: "",
//     Description: "",
//     BuyingPrice: "",
//     SellingPrice: "",
//     QuantityInStock: 0,
//     SupplierID: "",
//     CategoryID: ""
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [categoryRes, supplierRes] = await Promise.all([
//           axios.get(`${BASE_URL}category`, {withCredentials: true}),
//           axios.get(`${BASE_URL}supplier`, { withCredentials: true })
//         ]);

//         setCategories(categoryRes.data.allCategory);
//         setSuppliers(supplierRes.data.suppliers);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {


//       const productDetails = {
//         ...newProduct,
//         BuyingPrice: parseFloat(newProduct.BuyingPrice),
//         SellingPrice: parseFloat(newProduct.SellingPrice),
//       };

//       const res = await axios.post(`${BASE_URL}product`, productDetails, {
//         withCredentials: true
//       });

//       if (res.status === 200) {
//         Swal.fire({
//           title: "Success",
//           text: "Product Added Success",
//           icon: "success"
//         })
//         setOpenModal(false);
//         loadProducts();
//       } else {
//         Swal.fire({
//           title: "Error",
//           text: "Category Added Fail",
//           icon: "error"
//         })
//       }
//       // console.log(res)


//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 pt-80 md:pt-0 z-50 outline-none focus:outline-none">
//         <div className="relative w-4/5 md:w-3/5 my-6 mx-auto max-w-6xl">

//           <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-5">

//             <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
//               <h3 className="text-3xl text-center font-semibold">
//                 Add New Product
//               </h3>
//               <button
//                 className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
//                 onClick={() => setOpenModal(false)}
//                 aria-label="Close"
//               >
//                 <span className="text-black h-6 w-6 text-2xl block">
//                   ×
//                 </span>
//               </button>
//             </div>

//             <div className="relative p-6">


//               <form className="space-y-4" onSubmit={handleSubmit}>
//                 <div>
//                   <label htmlFor="productName" className="font-bold block my-2">
//                     Product Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="productName"
//                     type="text"
//                     name="Name"
//                     value={newProduct.Name}
//                     onChange={handleChange}
//                     required
//                     className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                     placeholder="Enter Product Name"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="productDescription" className="font-bold block my-2">
//                     Product Description
//                   </label>
//                   <textarea
//                     id="productDescription"
//                     name="Description"
//                     value={newProduct.Description}
//                     onChange={handleChange}
//                     className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                     placeholder="Enter Product Description"
//                     rows="3"
//                     required
//                   ></textarea>
//                 </div>

//                 <div className="w-full flex flex-col md:flex-row gap-4">
//                   <div className="w-full md:w-1/2">
//                     <label htmlFor="buyingPrice" className="font-bold block my-2">
//                       Buying Price (LKR)
//                     </label>
//                     <input
//                       id="buyingPrice"
//                       type="number"
//                       min="1"
//                       name="BuyingPrice"
//                       value={newProduct.BuyingPrice}
//                       onChange={handleChange}
//                       className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                       placeholder="Enter Buying Price"
//                       required
//                     />
//                   </div>

//                   <div className="w-full md:w-1/2">
//                     <label htmlFor="sellingPrice" className="font-bold block my-2">
//                       Selling Price (LKR) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       id="sellingPrice"
//                       type="number"
//                       min="1"
//                       name="SellingPrice"
//                       value={newProduct.SellingPrice}
//                       onChange={handleChange}
//                       required
//                       className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                       placeholder="Enter Selling Price"

//                     />
//                   </div>


//                 </div>

//                 <div className="w-full flex flex-col md:flex-row gap-4">
//                   <div className="w-full">
//                     <label htmlFor="supplier" className="font-bold block my-2">
//                       Supplier
//                     </label>
//                     <select
//                       id="supplier"
//                       name="SupplierID"
//                       value={newProduct.SupplierID}
//                       required
//                       onChange={handleChange}
//                       className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                     >
//                       <option value="">Select Supplier</option>
//                       {suppliers.map((supplier) => (
//                         <option key={supplier.SupplierID} value={supplier.SupplierID}>
//                           {supplier.Name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="w-full">
//                     <label htmlFor="category" className="font-bold block my-2">
//                       Category
//                     </label>
//                     <select
//                       id="category"
//                       name="CategoryID"
//                       value={newProduct.CategoryID}
//                       required
//                       onChange={handleChange}
//                       className="w-full border-2 border-gray-300 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                     >
//                       <option value="">Select Category</option>
//                       {categories.map((category) => (
//                         <option key={category.CategoryID} value={category.CategoryID}>
//                           {category.Name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/*footer*/}
//                 <div className="flex items-center justify-end pt-6 border-t border-solid border-blueGray-200 rounded-b">
//                   <button
//                     className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                     type="button"
//                     onClick={() => setOpenModal(false)}

//                   >
//                     Close
//                   </button>
//                   <button
//                     className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-50"
//                     type="submit"

//                   >Add Product
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//     </>
//   );
// }

// export default ProductAddModal;

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // You may need to install this package
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function ProductAddModal({ setOpenModal, loadProducts }) {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [newProduct, setNewProduct] = useState({
    Name: "",
    Description: "",
    BuyingPrice: "",
    SellingPrice: "",
    QuantityInStock: 0,
    SupplierID: "",
    CategoryID: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [categoryRes, supplierRes] = await Promise.all([
        //   axios.get(`${BASE_URL}category`, {withCredentials: true}),
        //   axios.get(`${BASE_URL}supplier`, { withCredentials: true })
        // ]);
        const api = createAxiosInstance();
        const [categoryRes, supplierRes] = await Promise.all([
          api.get(`category`),
          api.get(`supplier`)
        ]);

        setCategories(categoryRes.data.allCategory.filter(category => category.isActive !== false));
        setSuppliers(supplierRes.data.suppliers.filter(supplier => supplier.isActive !== false));
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: "Failed to load data",
          icon: "error",
          background: "#f8fafc",
          confirmButtonColor: "#3b82f6"
        });
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productDetails = {
        ...newProduct,
        BuyingPrice: parseFloat(newProduct.BuyingPrice),
        SellingPrice: parseFloat(newProduct.SellingPrice),
      };

      const api = createAxiosInstance();
      const res = await api.post(`product`, productDetails);
      // const res = await axios.post(`${BASE_URL}product`, productDetails, {
      //   withCredentials: true
      // });

      if (res.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Product Added Successfully",
          icon: "success",
          background: "#f8fafc",
          confirmButtonColor: "#3b82f6"
        });
        setOpenModal(false);
        loadProducts();
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to Add Product",
          icon: "error",
          background: "#f8fafc",
          confirmButtonColor: "#3b82f6"
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-11/12 lg:w-4/5 my-6 mx-auto max-w-3xl"
        >
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Product
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
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Info Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Product Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="Name"
                        value={newProduct.Name}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                        placeholder="Enter Product Name"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="Description"
                        value={newProduct.Description}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                        placeholder="Enter Product Description"
                        rows="3"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pricing Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buying Price (LKR) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          name="BuyingPrice"
                          value={newProduct.BuyingPrice}
                          onChange={handleChange}
                          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                          placeholder="Enter Buying Price"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Selling Price (LKR) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          name="SellingPrice"
                          value={newProduct.SellingPrice}
                          onChange={handleChange}
                          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                          placeholder="Enter Selling Price"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Initial Stock Quantity
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          name="QuantityInStock"
                          value={newProduct.QuantityInStock}
                          onChange={handleChange}
                          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                          placeholder="Enter Initial Stock Quantity"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category & Supplier Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Classification
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="CategoryID"
                          value={newProduct.CategoryID}
                          onChange={handleChange}
                          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.CategoryID} value={category.CategoryID}>
                              {category.Name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="SupplierID"
                          value={newProduct.SupplierID}
                          onChange={handleChange}
                          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white"
                          required
                        >
                          <option value="">Select Supplier</option>
                          {suppliers.map((supplier) => (
                            <option key={supplier.SupplierID} value={supplier.SupplierID}>
                              {supplier.Name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 pt-4 pb-3 mt-6 -mx-6 -mb-6 px-6 flex items-center justify-end space-x-3 border-t">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ProductAddModal;