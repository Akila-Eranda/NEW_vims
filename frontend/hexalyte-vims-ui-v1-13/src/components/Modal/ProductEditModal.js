// import React, { useState } from "react";

// function ProductEditModal({ setOpenModal, prodInfo, editProduct }) {
//   const [productData, setProductData] = useState({
//     ProductID: prodInfo.ProductID,
//     Name: prodInfo.Name,
//     Description: prodInfo.Description,
//     UnitPrice: prodInfo.UnitPrice,
//     QuantityInStock: prodInfo.QuantityInStock,
//     SupplierID: prodInfo.SupplierID,
//     CategoryID: prodInfo.CategoryID,
//   });

//   const handleChange = (e) => {
//     setProductData((p) => ({ ...p, [e.target.name]: e.target.value }));
//   };

//   return (
//     <>
//       <div
//         className="justify-center pt-80 md:pt-0 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
//         // onClick={() => setShowModal(false)}
//       >
//         <div className="relative w-4/5 md:w-3/5 my-6 mx-auto max-w-6xll">
//           {/*content*/}
//           <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none px-5">
//             {/*header*/}
//             <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
//               <h3 className="text-3xl font-semibold">
//                 Product Name: {prodInfo.Name}
//               </h3>
//               <button
//                 className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
//                 // onClick={() => setShowModal(false)}
//               >
//                 <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
//                   ×
//                 </span>
//               </button>
//             </div>
//             {/*body*/}
//             <div className="relative p-6 flex-auto">
//               <form className="space-y-4">
//                 <div>
//                   <label htmlFor="" className="font-bold block my-2" >Product Name </label>
//                   <input
//                     type="text"
//                     name="Name"
//                     value={productData.Name}
//                     onChange={(e) => handleChange(e)}
//                     required
//                     className="w-full border-2 border-gray-200 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                     placeholder="Enter Product Name"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="" className="font-bold block my-2" >Product Description </label>
//                   {/* <input
//                     type="text"
//                     name="Name"
//                     value={productData.Description}
//                     onChange={handleChange}
//                     required
//                   /> */}
//                   <textarea
//                     name="Description"
//                     value={productData.Description}
//                     onChange={(e) => handleChange(e)}
//                     required
//                     className="w-full border-gray-200 border-2 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                     placeholder="Enter Product Description"
//                   ></textarea>
//                 </div>
//                 <div className="w-full flex flex-col md:flex-row gap-2 md:justify-between"  >
//                   <div className="w-3/5">
//                     <label htmlFor="" className="font-bold block my-2" >Buying Price (LKR) </label>
//                     <input
//                         type="text"
//                         name="UnitPrice"
//                         value={productData.UnitPrice}
//                         onChange={(e) => handleChange(e)}
//                         required
//                         className="w-full border-gray-200 border-2 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                         placeholder="Enter Unit Price (LKR)"
//                     />
//                   </div>
//                   <div className="w-3/5">
//                     <label htmlFor="" className="font-bold block my-2" >Selling Price (LKR) </label>
//                     <input
//                         type="text"
//                         name="UnitPrice"
//                         value={productData.UnitPrice}
//                         onChange={(e) => handleChange(e)}
//                         required
//                         className="w-full border-gray-200 border-2 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                         placeholder="Enter Unit Price (LKR)"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="" className="font-bold block my-2" >Quantity </label>
//                     <input
//                         type="text"
//                         name="QuantityInStock"
//                         value={productData.QuantityInStock}
//                         onChange={(e) => handleChange(e)}
//                         required
//                         className="w-full border-gray-200 border-2 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                         placeholder="Enter Unit Price"
//                     />
//                   </div>
//                 </div>


//                 <div className="w-full flex flex-col md:flex-row gap-2" >
//                   <div className="w-full">
//                     <label htmlFor="" className="font-bold block my-2" >Supplier </label>
//                     <select
//                       name="SupplierID"
//                       id=""
//                       value={productData.SupplierID}
//                       onChange={(e) => handleChange(e)}
//                       className="w-full border-gray-200 border-2 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                     >
//                       <option value="0">Select Supplier</option>
//                       <option value="12">SUPPLIER 1</option>
//                       <option value="13">SUPPLIER 2</option>
//                       <option value="14">SUPPLIER 3</option>
//                     </select>
//                   </div>
//                   <div className="w-full"  >
//                     <label htmlFor="" className="font-bold border-gray-200 block my-2" >Category </label>
//                     <select
//                       name="CategoryID"
//                       id=""
//                       value={productData.CategoryID}
//                       onChange={(e) => handleChange(e)}
//                       className="w-full border-2 border-gray-200 placeholder-opacity-50 outline-0 rounded p-2 focus:border-blue-400 focus:border-2 transition-all delay-200"
//                     >
//                       <option value="0">Select Category</option>
//                       <option value="11">CATEGORY 1</option>
//                       <option value="12">CATEGORY 2</option>
//                     </select>
//                   </div>
//                 </div>
//               </form>
//             </div>
//             {/*footer*/}
//             <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
//               <button
//                 className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                 type="button"
//                 onClick={() => setOpenModal(() => null)}
//               >
//                 Close
//               </button>
//               <button
//                 className="bg-emerald-500  text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                 type="button"
//                 onClick={() => editProduct(productData)}
//               >
//                 Update Product Info
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//     </>
//   );
// }

// export default ProductEditModal;


import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // You may need to install this package
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function ProductEditModal({ setOpenModal, prodInfo, editProduct }) {

  const [suppliers, setSuppliers] = useState([])
  const [categories, setCategories] = useState([])

  // const [productData, setProductData] = useState({
  //   ProductID: prodInfo.ProductID,
  //   Name: prodInfo.Name,
  //   Description: prodInfo.Description,
  //   UnitPrice: prodInfo.UnitPrice,
  //   SellingPrice: prodInfo.SellingPrice || prodInfo.UnitPrice, // Fallback if not available
  //   QuantityInStock: prodInfo.QuantityInStock,
  //   SupplierID: prodInfo.SupplierID,
  //   CategoryID: prodInfo.CategoryID,
  // });

  const [productData, setProductData] = useState([]);

  const handleChange = (e) => {
    setProductData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  async function fetchCategories() {
    try {
      const api = createAxiosInstance();
      const categoryRes = await api.get(`category`);
      // const categoryRes = await axios.get(`${BASE_URL}category`, { withCredentials: true });
      if (categoryRes.status === 200) {
        setCategories(() => categoryRes.data.allCategory);
      }
    } catch (error) {

      if (error.status === 404 && error.response.data.message === "No Categories Found") {
        console.log("No Categories Found");
      } else {
        console.log(error)
      }

    }
  }

  async function fetchSuppliers() {
    try {
      const api = createAxiosInstance();
      const supplierRs = await api.get(`supplier`);
      // const supplierRs = await axios.get(`${BASE_URL}supplier`, { withCredentials: true });
      if (supplierRs.status === 200) {
        setSuppliers(() => supplierRs.data.suppliers);
      }
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "no supplier found") {
        console.log("no supplier found");
      } else {
        console.log(error)
      }
    }
  }

  async function fetchProduct() {
    try {
      const api = createAxiosInstance();
      const productRes = await api.get(`product/${prodInfo.ProductID}`);
      // const productRes = await axios.get(`${BASE_URL}product/${prodInfo.ProductID}`, { withCredentials: true });
      if (productRes.status === 200) {
        setProductData(() => productRes.data.product)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchSuppliers()
    fetchProduct()
  }, [])

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-4">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Product: {prodInfo.Name}
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
              <form className="space-y-6">
                {/* Product Info Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Product Information
                  </h4>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="Name"
                        value={productData.Name || ""}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                        placeholder="Enter Product Name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="Description"
                        value={productData.Description || ""}
                        onChange={handleChange}
                        className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                        placeholder="Enter Product Description"
                        rows="3"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pricing & Stock Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buying Price (LKR) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          name="BuyingPrice"
                          value={productData.BuyingPrice || 0.00}
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
                          value={productData.SellingPrice || 0.00}
                          onChange={handleChange}
                          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                          placeholder="Enter Selling Price"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity in Stock <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          name="QuantityInStock"
                          value={productData.QuantityInStock || 0}
                          onChange={handleChange}
                          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                          placeholder="Enter Quantity"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Classification Section */}
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
                          value={productData.CategoryID || 0}
                          onChange={handleChange}
                          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white"
                          required
                        >
                          <option value="0">Select Category</option>
                          {
                            categories.map((category, index) => (
                              <option value={category.CategoryID} key={index}> {category.Name} </option>
                            ))
                          }
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
                          value={productData.SupplierID || 0}
                          onChange={handleChange}
                          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white"
                          required
                        >
                          <option value="0">Select Supplier</option>

                          {
                            suppliers.map((supplier, index) => (
                              <option value={supplier.SupplierID} key={index}> {supplier.Name} </option>
                            ))
                          }

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
              </form>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                onClick={() => editProduct(productData)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Update Product
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ProductEditModal;