// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// function TrackOrderAddModal({orderInfo, closeModal, fetchSalesOrders, fetchDeliveryDetails}) {

//   const [deliveryDetails, setDeliveryDetails] = useState({
//     CustomerID: 0,
//     DeliveryAddressID: "",
//     OrderID: orderInfo.OrderID,
//     DeliveryDate: "",
//     DeliveryTimeSlot: "8:00AM - 12:00PM",
//     DeliveryStatus: "SUBMITTED",
//     TrackingNumber: generateTrackingNumber(),
//     Carrier: "",
//     EstimatedDeliveryDate: "",
//     ActualDeliveryDate: ""
//   });

//   const [customers, setCustomers] = useState([]);

//   function generateTrackingNumber(){
//     const num = 1000000 * orderInfo.OrderID + "";
//     return "VIMS" + num.split('').reverse().join('');
//   }

//   function setCustomerInfo(CustomerID){

//     const addressID = customers.find((customer) => customer.CustomerID.toString() === CustomerID)?.CustomerAddressID;

//     setDeliveryDetails((d) => ({...d, CustomerID: CustomerID, DeliveryAddressID: addressID}))

//   }

//   async function fetchCustomers(){
//     try {
//       const response = await axios.get(`${BASE_URL}customer`, {withCredentials: true});
//       // console.log(response);
//       if (response.status === 200){
//         setCustomers((c) => response.data.allCustomers);
//       }
//     }catch(err){
//       console.log(err);
//     }
//   }

//   async function addToDelivery(){

//     if (deliveryDetails.CustomerID === 0){
//       Swal.fire({
//         icon: "warning",
//         title: "Oops",
//         text: "Select a Customer",
//       })
//       return;
//     } else if (deliveryDetails.DeliveryDate === ""){
//       Swal.fire({
//         icon: "warning",
//         title: "Oops",
//         text: "Select a Delivery Date",
//       })
//       return;
//     } else if (deliveryDetails.Carrier.trim() === ""){
//       Swal.fire({
//         icon: "warning",
//         title: "Oops",
//         text: "Enter Carrier Name",
//       })
//       return;
//     }

//     try {
//       const response = await axios.post(`${BASE_URL}deliverydetails`, deliveryDetails, {withCredentials: true});
//       // console.log(response);

//       if (response.status === 200){

//         try {

//           const updated = {...orderInfo, Status: "SUBMITTED"}
//           const { OrderDate, TotalAmount, Status, LocationID} = updated

//           const response = await axios.put(`${BASE_URL}salesorder/${orderInfo.OrderID}`, { OrderDate, TotalAmount, Status, LocationID}, {withCredentials: true} );

//           const addStatusHistory = await axios.post(`${BASE_URL}orderstatushistory`, {OldStatus: "TO DELIVER", NewStatus: "SUBMITTED", StatusChangeDate: new Date(), salesorderOrderID: orderInfo.OrderID }, {withCredentials: true});

//           if (response.status === 200){

//             Swal.fire({
//               icon: "success",
//               title: "Success",
//               text: "Added to delivery",
//             }).then(() => fetchSalesOrders()).then(() => fetchDeliveryDetails()).then(() => closeModal(() => null))

//           }

//         } catch (error) {
//           console.log(error);
//         }

//       }

//     } catch (error) {
//       console.log(error);
//     }

//   }

//   useEffect(() => {
//     fetchCustomers();
//   }, [])

//   return(
//     <>
//       <div
//         className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
//         // onClick={() => setShowModal(false)}
//       >
//         <div className="relative w-4/5 lg:w-3/5 my-6 mx-auto max-w-6xl">
//           {/*content*/}
//           <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
//             {/*header*/}
//             <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
//               <h3 className="text-3xl font-semibold">
//                 Proceed to Delivery | Order ID: {orderInfo.OrderID}
//               </h3>
//               <button
//                 className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
//                 // onClick={() => setShowModal(false)}
//               >
//                     <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
//                       ×
//                     </span>
//               </button>
//             </div>
//             {/*body*/}
//             <div className="relative p-6 flex-auto">
//               <div className="flex flex-wrap md:gap-3">
//                 <div className="w-full md:w-5/12 flex gap-2">
//                   <div className="w-full">
//                     <label htmlFor="" className="font-bold mb-2 block">Select Customer : </label>
//                     <select name="" id=""
//                             className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full"
//                             value={deliveryDetails.CustomerID}
//                             onChange={(e) => setCustomerInfo(e.target.value)}
//                     >
//                       <option value="0">Select Customer</option>
//                       {
//                         customers.map((customer) => (
//                           <option key={customer.CustomerID} value={customer.CustomerID}> {customer.Name} </option>
//                         ))
//                       }
//                     </select>
//                   </div>
//                   <div className="w-auto mt-auto">
//                     <Link to="/admin/manage-customers" >
//                       <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150" type="button">
//                         <i className="fa fa-user-plus"></i>
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//                 <div className="w-full md:w-3/12 flex">
//                   <div className="w-full">
//                     <label htmlFor="" className="font-bold mb-2 block">Delivery Date : </label>
//                     <input type="date" name="" id=""
//                            className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full"
//                            value={deliveryDetails.DeliveryDate}
//                            onChange={(e) => setDeliveryDetails((d) => ({...d, DeliveryDate: e.target.value, EstimatedDeliveryDate: e.target.value, ActualDeliveryDate: e.target.value}))}
//                     />
//                   </div>
//                 </div>
//                 <div className="w-full md:w-3/12 flex gap-2">
//                   <div className="w-full">
//                     <label htmlFor="" className="font-bold mb-2 block">Delivery Time Slot : </label>
//                     <select
//                             name=""
//                             id=""
//                             className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full"
//                             value={deliveryDetails.DeliveryTimeSlot}
//                             onChange={(e) => setDeliveryDetails((d) => ({...d, DeliveryTimeSlot: e.target.value})) }
//                     >
//                       <option value="8:00AM - 12:00PM">8:00AM - 12:00PM</option>
//                       <option value="12:00PM - 5:00PM">12:00PM - 5:00PM</option>
//                       <option value="5:00PM - 9:00PM">5:00PM - 9:00PM</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-wrap mt-3 gap-3">
//                 <div className="w-full md:w-5/12 flex gap-2">
//                   <div className="w-full">
//                     <label htmlFor="" className="font-bold mb-2 block">Carrier Name : </label>
//                     <input type="text" name="" id=""
//                            className="px-3 py-3 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full"
//                            placeholder="Enter carrier name"
//                            value={deliveryDetails.Carrier}
//                            onChange={(e) => setDeliveryDetails((d) => ({...d, Carrier: e.target.value}))}
//                     />
//                   </div>
//                 </div>
//                 <div className="w-full md:w-3/12 flex gap-2">
//                   <div className="w-full">
//                     <label htmlFor="" className="font-bold mb-2 block">Tracking Number : </label>
//                     <input type="text" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" readOnly
//                     value={deliveryDetails.TrackingNumber}/>
//                   </div>
//                   {/*<div className="w-auto mt-auto">*/}
//                   {/*    <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-7 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150" type="button"*/}
//                   {/*    onClick={() => setDeliveryDetails((d) => ({...d, TrackingNumber: generateTrackingNumber()})) } >*/}
//                   {/*      <i className="fa fa-bolt"></i>*/}
//                   {/*    </button>*/}
//                   {/*</div>*/}
//                 </div>

//               </div>
//             </div>
//             {/*footer*/}
//             <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
//               <button
//                 className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                 type="button"
//                 onClick={() => closeModal(() => null)}
//               >
//                 Close
//               </button>
//               <button
//                 className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                 type="button"
//                 onClick={() => addToDelivery()}
//               >
//                 Proceed
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
//     </>
//   )
// }

// export default TrackOrderAddModal;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // You may need to install this package
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function TrackOrderAddModal({ orderInfo, closeModal, fetchSalesOrders, fetchDeliveryDetails }) {
  const [deliveryDetails, setDeliveryDetails] = useState({
    CustomerID: orderInfo.CustomerID,
    DeliveryAddressID: "",
    OrderID: orderInfo.OrderID,
    DeliveryDate: "",
    DeliveryTimeSlot: "8:00AM - 12:00PM",
    DeliveryStatus: "SUBMITTED",
    TrackingNumber: generateTrackingNumber(),
    Carrier: "",
    EstimatedDeliveryDate: "",
    ActualDeliveryDate: ""
  });

  const [customers, setCustomers] = useState([]);

  function generateTrackingNumber() {
    const num = 1000000 * orderInfo.OrderID + "";
    return "VIMS" + num.split('').reverse().join('');
  }

  function setCustomerInfo(CustomerID) {
    const addressID = customers.find((customer) => customer.CustomerID.toString() === CustomerID.toString())?.CustomerAddressID;
    setDeliveryDetails((d) => ({ ...d, CustomerID: CustomerID, DeliveryAddressID: addressID }));
  }

  async function fetchCustomers() {
    try {
      const api = createAxiosInstance();
      const response = await api.get(`customer`);
      if (response.status === 200) {
        setCustomers((c) => response.data.allCustomers);
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load customers",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
    }
  }

  async function addToDelivery() {

    if (deliveryDetails.CustomerID === 0) {
      Swal.fire({
        icon: "warning",
        title: "Select a Customer",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
      return;
    } else if (deliveryDetails.DeliveryAddressID === "" || deliveryDetails.DeliveryAddressID === undefined) {
      Swal.fire({
        icon: "warning",
        title: "Please wait for few seconds",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
      return;
    } else if (deliveryDetails.DeliveryDate === "") {
      Swal.fire({
        icon: "warning",
        title: "Select a Delivery Date",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
      return;
    } else if (deliveryDetails.Carrier.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Enter Carrier Name",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
      return;
    }

    try {
      const api = createAxiosInstance();
      const response = await api.post(`deliverydetails`, deliveryDetails);

      if (response.status === 200) {
        try {
          const updated = { ...orderInfo, Status: "SUBMITTED" };
          const { OrderDate, TotalAmount, Status, LocationID, CustomerID, PaymentStatus } = updated;
          const api = createAxiosInstance();
          const response = await api.put(
            `salesorder/${orderInfo.OrderID}`,
            { OrderDate, TotalAmount, Status, LocationID, CustomerID, PaymentStatus }
          );

          await api.post(
            `orderstatushistory`,
            {
              OldStatus: "TO DELIVER",
              NewStatus: "SUBMITTED",
              StatusChangeDate: new Date(),
              salesorderOrderID: orderInfo.OrderID
            },
            { withCredentials: true }
          );

          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Added to delivery",
              background: "#f8fafc",
              confirmButtonColor: "#3b82f6"
            }).then(() => fetchSalesOrders())
              .then(() => fetchDeliveryDetails())
              .then(() => closeModal(() => null));
          }
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to update order status",
            background: "#f8fafc",
            confirmButtonColor: "#3b82f6"
          });
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add delivery details",
        background: "#f8fafc",
        confirmButtonColor: "#3b82f6"
      });
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setCustomerInfo(orderInfo.CustomerID)
  }, [customers])

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-11/12 lg:w-4/5 my-6 mx-auto max-w-6xl"
        >
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Proceed to Delivery | Order ID: {orderInfo.OrderID}
              </h3>
              <button
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                onClick={() => closeModal(() => null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Content */}
            <div className="p-6">
              {/* Customer Selection Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Information
                </h4>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Customer <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={deliveryDetails.CustomerID}
                        onChange={(e) => setCustomerInfo(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white"
                        disabled={true}
                      >
                        <option value="0">Select Customer</option>
                        {customers.map((customer) => (
                          <option key={customer.CustomerID} value={customer.CustomerID}>
                            {customer.Name}
                          </option>
                        ))}
                      </select>
                      {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </div> */}
                    </div>
                  </div>

                  {/* <div>
                    <Link to="/admin/manage-customers">
                      <button
                        className="flex items-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                        type="button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Customer
                      </button>
                    </Link>
                  </div> */}
                </div>
              </div>

              {/* Delivery Schedule Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Delivery Schedule
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={deliveryDetails.DeliveryDate}
                      onChange={(e) => setDeliveryDetails((d) => ({
                        ...d,
                        DeliveryDate: e.target.value,
                        EstimatedDeliveryDate: e.target.value,
                        ActualDeliveryDate: e.target.value
                      }))}
                      className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Time Slot
                    </label>
                    <div className="relative">
                      <select
                        value={deliveryDetails.DeliveryTimeSlot}
                        onChange={(e) => setDeliveryDetails((d) => ({ ...d, DeliveryTimeSlot: e.target.value }))}
                        className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white"
                      >
                        <option value="8:00AM - 12:00PM">8:00AM - 12:00PM</option>
                        <option value="12:00PM - 5:00PM">12:00PM - 5:00PM</option>
                        <option value="5:00PM - 9:00PM">5:00PM - 9:00PM</option>
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

              {/* Tracking Information Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Tracking Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carrier Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter carrier name"
                      value={deliveryDetails.Carrier}
                      onChange={(e) => setDeliveryDetails((d) => ({ ...d, Carrier: e.target.value }))}
                      className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={deliveryDetails.TrackingNumber}
                      onChange={(e) => setDeliveryDetails((d) => ({ ...d, TrackingNumber: e.target.value }))}
                      className="block w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                onClick={() => closeModal(() => null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                onClick={addToDelivery}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Proceed to Delivery
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default TrackOrderAddModal;