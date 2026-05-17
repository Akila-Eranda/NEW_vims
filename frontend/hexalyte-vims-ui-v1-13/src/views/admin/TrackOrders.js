// import React, { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import axios from "axios";
// import TrackOrderAddModal from "../../components/Modal/TrackOrderAddModal";
// import checkToken from "../../api/checkToken";
// import handleUserLogout from "../../api/logout";
// import { useAuth } from "../../context/AuthContext";
// import { useHistory } from "react-router-dom";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// function TrackOrders() {

//   const [openTab, setOpenTab] = useState(1);

//   const [data, setData] = useState([]);
//   const [deliveryData, setDeliveryData] = useState([]);

//   const {setAuth} = useAuth();
//   const history = useHistory();

//   const [openProceedDeliveryModal, setOpenProceedDeliveryModal] = useState(null);

//   // const data = [
//   //   {
//   //     OrderID: 1,
//   //     CustomerName: "Avindu",
//   //     OrderDate: "2025-04-05",
//   //     TotalAmount: 10000,
//   //     Status: "IN TRANSIT"
//   //   }
//   // ]

//   const styles = {
//     headCells: {
//       style: {
//         color: "#202124",
//         fontSize: "16px",
//         fontWeight: 500,
//       },
//     },
//     rows: {
//       highlightOnHoverStyle: {
//         backgroundColor: "#F0FDFA",
//         outline: "1px solid #FFFFFF",
//       },
//     },
//   };

//   const deliveryColumns = [
//     {
//       cell: () => <i className="fa fa-box text-lg text-teal-500"></i>,
//       width: "56px", // custom width for icon button
//       style: {
//         borderBottom: "1px solid #FFFFFF",
//         marginBottom: "-1px",
//       },
//     },
//     {
//       name: "Delivery ID",
//       selector: row => row.DeliveryID,
//       sortable: true,
//       // grow: 2,
//       style: {
//         color: "#202124",
//         fontSize: "14px",
//       },
//     },
//     {
//       name: "Order ID",
//       selector: row => row.OrderID,
//       sortable: true,
//       // grow: 2,
//       style: {
//         color: "#202124",
//         fontSize: "14px",
//       },
//     },
//     {
//       name: "Delivery Date",
//       selector: row => row.DeliveryDate.slice(0, 10),
//       sortable: true,
//       // grow: 2,
//       style: {
//         color: "#202124",
//         fontSize: "14px",
//       },
//     },
//     {
//       name: "Delivery Status",
//       selector: row => deliveryStatuses(row.DeliveryStatus),
//       sortable: true,
//       // grow: 2,
//       style: {
//         color: "#202124",
//         fontSize: "14px",
//       },
//     },

//   ];

//   function deliveryStatuses(status) {
//     if (status === "SUBMITTED") {
//       return (
//         <span
//           className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-lightBlue-600 bg-lightBlue-200  last:mr-0 mr-1">
//             SUBMITTED
//         </span>
//       );
//     } else if (status === "PACKED") {
//       return (
//         <span
//           className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-indigo-600 bg-indigo-200  last:mr-0 mr-1">
//           PACKED
//         </span>
//       );
//     } else if (status === "IN PROGRESS") {
//       return (
//         <span
//           className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-amber-600 bg-amber-200  last:mr-0 mr-1">
//           IN PROGRESS
//         </span>
//       );
//     } else if (status === "DELIVERED") {
//       return (
//         <span
//           className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-emerald-600 bg-emerald-200  last:mr-0 mr-1">
//           DELIVERED
//         </span>
//       );
//     } else if (status === "RETURN") {
//       return (
//         <span
//           className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-red-600 bg-red-200  last:mr-0 mr-1">
//           RETURN
//         </span>
//       );
//     }
//   }

//   const columns = [
//     {
//       cell: () => <i className="fa fa-box text-lg text-teal-500"></i>,
//       width: "56px", // custom width for icon button
//       style: {
//         borderBottom: "1px solid #FFFFFF",
//         marginBottom: "-1px",
//       },
//     },
//     {
//       name: "OrderID",
//       selector: row => row.OrderID,
//       sortable: true,
//       // grow: 2,
//       style: {
//         color: "#202124",
//         fontSize: "14px",
//       },
//     },
//     {
//       name: "Customer Name",
//       selector: row => row.CustomerName,
//       sortable: true,
//       // grow: 2,
//       style: {
//         color: "#202124",
//         fontSize: "14px",
//       },
//     },
//     {
//       name: "Total Amount",
//       selector: row => {
//         const amount = Number(row.TotalAmount);
//         return amount.toLocaleString() + " LKR";
//       },
//       sortable: true,
//       // grow: 2,
//       style: {
//         color: "#202124",
//         fontSize: "14px",
//       },
//     },
//     {
//       name: "Status",
//       selector: row => <span
//         className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-teal-600 bg-teal-200 last:mr-0 mr-1">
//   {row.Status}
// </span>,
//       sortable: true,
//       // grow: 2,
//       style: {
//         color: "#202124",
//         fontSize: "14px",
//       },
//     },
//     {
//       cell: (row) => <button
//         className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//         type="button" onClick={() => setOpenProceedDeliveryModal(() => row)}>
//         Proceed to Delivery
//       </button>,
//       // width: '56px', // custom width for icon button
//       style: {
//         borderBottom: "1px solid #FFFFFF",
//         marginBottom: "-1px",
//       },
//     },

//   ];

//   const DeliveryInfo = (props) => {
//     const info = props.data;

//     // console.log(info);

//     const [deliveryInfo, setDeliveryInfo] = useState(info)
//     const [customerInfo, setCustomerInfo] = useState({});
//     const [orderStatusHistory, setOrderStatusHistory] = useState([]);
//     const [deliveryAddress, setDeliveryAddress] = useState({});
//     const [editable, setEditable] = useState(false);

//     async function fetchCustomerInfo() {
//       try {
//         const customerInfoRes = await axios.get(`${BASE_URL}customer/${info.CustomerID}`, { withCredentials: true });

//         if (customerInfoRes.status === 200) {
//           setCustomerInfo(() => customerInfoRes.data.customer);
//         }

//       } catch (error) {

//         if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
//           sessionStorage.clear()
//           history.push('/auth/login')
//         }

//         console.log(error);
//       }
//     }

//     async function fetchDeliveryAddress(){
//       try {
//         const addressRes = await axios.get(`${BASE_URL}customeraddress/${info.DeliveryAddressID}`, { withCredentials: true });
//         if (addressRes.status === 200) {
//           setDeliveryAddress(() => addressRes.data.customerAddress)
//           // console.log(addressRes.data.customerAddress);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     async function fetchOrderStatusHistory() {
//       try {
//         const orderStatusHistoryRes = await axios.get(`${BASE_URL}orderstatushistory`, {withCredentials: true });
//         if (orderStatusHistoryRes.status === 200) {
//          setOrderStatusHistory(() => orderStatusHistoryRes.data.orderstatushistories.filter((orderSH) => orderSH.salesorderOrderID === info.OrderID).reverse() );
//          //  console.log(orderStatusHistoryRes.data.orderstatushistories.filter((orderSH) => orderSH.salesorderOrderID === info.OrderID))
//         }
//       }catch (error) {
//         console.log(error);
//       }
//     }

//     async function updateDeliveryInfo() {

//       try {

//         delete deliveryInfo.DeliveryID
//         delete deliveryInfo.createdAt
//         delete deliveryInfo.updatedAt

//         const updateDeliveryRes = await axios.put(`${BASE_URL}deliverydetails/${info.OrderID}`, deliveryInfo, {withCredentials: true });
//         // console.log(updateDeliveryRes);

//         if (deliveryInfo.DeliveryStatus !== info.DeliveryStatus) {
//           const status = {
//             OldStatus: info.DeliveryStatus,
//             NewStatus: deliveryInfo.DeliveryStatus,
//             StatusChangeDate: new Date(),
//             salesorderOrderID: info.OrderID,
//           }
//           const addOrderStatusHistory = await axios.post(`${BASE_URL}orderstatushistory`, status, {withCredentials: true } );
//         }

//         fetchCustomerInfo();
//         fetchOrderStatusHistory();
//         fetchDeliveryAddress();
//         fetchDeliveryDetails()

//       } catch (error) {
//         console.log(error);
//       }

//       setEditable(() => false)

//     }

//     useEffect(() => {

//       if (!checkToken()) {
//         handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
//         return
//       }

//       fetchCustomerInfo();
//       fetchOrderStatusHistory();
//       fetchDeliveryAddress();
//     }, []);

//     return (
//       <>
//         <div className="p-5">
//           <div className="w-full flex flex-wrap">
//             <div className="w-full m-3 flex justify-between">
//               <div className="w-max">
//                 <label htmlFor="" className="block">Customer Name : <strong>{customerInfo.Name}</strong> </label>
//                 <label htmlFor="" className="block">Tracking Number : <strong>{info.TrackingNumber}</strong> </label>
//               </div>
//               <div className="w-max flex gap-1">
//                 <select
//                   name=""
//                   id=""
//                   className="px-4 pr-10 py-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full"
//                   disabled={!editable}
//                   value={deliveryInfo.DeliveryStatus}
//                   onChange={(e) => setDeliveryInfo((de) => ({...de, DeliveryStatus: e.target.value }))}
//                 >
//                   <option value="SUBMITTED">SUBMITTED</option>
//                   <option value="PACKED">PACKED</option>
//                   <option value="IN PROGRESS">IN PROGRESS</option>
//                   <option value="DELIVERED">DELIVERED</option>
//                   <option value="RETURN">RETURN</option>
//                 </select>
//                 {
//                   !editable &&
//                   <button
//                     className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                     type="button"
//                     onClick={() => setEditable(() => true)}
//                   >
//                     <i className="fa fa-pencil-alt"></i>
//                   </button>
//                 }
//                 {
//                   editable &&
//                   <button
//                     className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                     type="button"
//                     onClick={() => updateDeliveryInfo()}
//                   >
//                     <i className="fa fa-check"></i>
//                   </button>
//                 }
//               </div>
//             </div>
//             <div className="w-full m-3 flex gap-2">
//               <label htmlFor="">Delivery Address :</label>
//               <div className="max-w-sm">
//                 <p>{deliveryAddress.Street}, {deliveryAddress.City}, {deliveryAddress.State}, {deliveryAddress.Country}, {deliveryAddress.PostalCode}</p>
//                 {/*<p>{deliveryAddress.City}</p>*/}
//                 {/*<p>{deliveryAddress.State}</p>*/}
//                 {/*<p>{deliveryAddress.Country}</p>*/}
//                 {/*<p>{deliveryAddress.PostalCode}</p>*/}
//               </div>
//             </div>
//             <div className="w-full mx-3">
//               <label htmlFor="" >Carrier : {info.Carrier} </label>
//             </div>
//             <div className="w-full m-3 gap-3 flex flex-wrap">
//               <div className="w-full sm:w-1/3 md:w-2/8 lg:w-3/12">
//                 <label htmlFor="" className="block mb-2">Delivery Date :</label>
//                 <input
//                   type="date"
//                   className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full"
//                   value={info.DeliveryDate.slice(0, 10)}
//                   readOnly={true}
//                 />
//               </div>
//               <div className="w-full sm:w-1/3 md:w-4/8 lg:w-4/12">
//                 <label htmlFor="" className="block mb-2">Estimated Delivery Date :</label>
//                 <input
//                   type="date"
//                   className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full"
//                   value={deliveryInfo.EstimatedDeliveryDate.slice(0, 10)}
//                   readOnly={!editable}
//                   onChange={(e) => setDeliveryInfo((de) => ({...de, EstimatedDeliveryDate: e.target.value }))}
//                 />
//               </div>
//               <div className="w-full sm:w-1/3 md:w-2/8 lg:w-4/12">
//                 <label htmlFor="" className="block mb-2">Actual Delivery Date :</label>
//                 <input
//                   type="date"
//                   className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative  bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full"
//                   value={deliveryInfo.ActualDeliveryDate.slice(0, 10)}
//                   readOnly={!editable}
//                   onChange={(e) => setDeliveryInfo((de) => ({...de, ActualDeliveryDate: e.target.value }))}
//                 />
//               </div>
//             </div>
//             <div className="w-full m-3">
//               <table className="table-auto w-full">
//                 <thead>
//                 <tr className="text-left">
//                   <th>Status ID</th>
//                   <th>Old Status</th>
//                   <th>New Status</th>
//                   <th>Status Change Date</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {
//                   orderStatusHistory.map((osh) => (
//                     <tr key={osh.StatusID} className="py-5 border-gray-200">
//                       <td>{osh.StatusID}</td>
//                       <td>{osh.OldStatus}</td>
//                       <td>{osh.NewStatus}</td>
//                       <td>{ osh.StatusChangeDate.slice(0, 19).replace("T", " ") }</td>
//                     </tr>
//                   ))
//                 }
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/*<pre>*/}
//           {/*  {JSON.stringify(info, null, 2)}*/}
//           {/*</pre>*/}

//         </div>
//       </>
//     );
//   };

//   async function fetchSalesOrders() {
//     try {
//       const response = await axios.get(`${BASE_URL}salesorder`, { withCredentials: true });

//       if (response.status === 200) {
//         const salesOrders = response.data.salesorders;
//         setData(() => salesOrders.filter((salesOrder) => salesOrder.Status === "TO DELIVER"));
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async function fetchDeliveryDetails() {
//     try {
//       const response = await axios.get(`${BASE_URL}deliverydetails`, { withCredentials: true });
//       if (response.status === 200) {
//         setDeliveryData(() => response.data.allDeliveryDetails);
//       }
//       // console.log(response)
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     fetchSalesOrders();
//     fetchDeliveryDetails();
//   }, []);

//   return (
//     <>
//       <h2 className="text-3xl font-bold my-6">Track Orders</h2>
//       <div className="flex flex-wrap">
//         <div className="w-full">
//           <ul
//             className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row w-full md:w-4/5 lg:w-3/5"
//             role="tablist"
//           >
//             <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
//               <a
//                 className={
//                   "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
//                   (openTab === 1
//                     ? "text-white bg-lightBlue-600"
//                     : "text-lightBlue-600 bg-white")
//                 }
//                 onClick={e => {
//                   e.preventDefault();
//                   setOpenTab(1);
//                 }}
//                 data-toggle="tab"
//                 href="#link1"
//                 role="tablist"
//               >
//                 Add to Delivery &nbsp; <i className="fa fa-truck"></i>
//               </a>
//             </li>
//             <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
//               <a
//                 className={
//                   "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
//                   (openTab === 2
//                     ? "text-white bg-lightBlue-600"
//                     : "text-lightBlue-600 bg-white")
//                 }
//                 onClick={e => {
//                   e.preventDefault();
//                   setOpenTab(2);
//                 }}
//                 data-toggle="tab"
//                 href="#link2"
//                 role="tablist"
//               >
//                 In Transit &nbsp; <i className="fa fa-plane-departure"></i>
//               </a>
//             </li>
//             {/*<li className="-mb-px mr-2 last:mr-0 flex-auto text-center">*/}
//             {/*  <a*/}
//             {/*    className={*/}
//             {/*      "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +*/}
//             {/*      (openTab === 3*/}
//             {/*        ? "text-white bg-lightBlue-600"*/}
//             {/*        : "text-lightBlue-600 bg-white")*/}
//             {/*    }*/}
//             {/*    onClick={e => {*/}
//             {/*      e.preventDefault();*/}
//             {/*      setOpenTab(3);*/}
//             {/*    }}*/}
//             {/*    data-toggle="tab"*/}
//             {/*    href="#link3"*/}
//             {/*    role="tablist"*/}
//             {/*  >*/}
//             {/*    Options*/}
//             {/*  </a>*/}
//             {/*</li>*/}
//           </ul>
//           <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
//             <div className="px-4 py-5 flex-auto">
//               <div className="tab-content tab-space">
//                 <div className={openTab === 1 ? "block" : "hidden"} id="link1">
//                   <DataTable data={data} columns={columns} highlightOnHover pointerOnHover customStyles={styles} />
//                 </div>
//                 <div className={openTab === 2 ? "block" : "hidden"} id="link2">
//                   <DataTable data={deliveryData} columns={deliveryColumns} highlightOnHover pointerOnHover
//                              customStyles={styles} expandableRows={true} pagination expandOnRowClicked={true}
//                              expandableRowsComponent={DeliveryInfo} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {
//         openProceedDeliveryModal &&
//         <TrackOrderAddModal orderInfo={openProceedDeliveryModal} closeModal={setOpenProceedDeliveryModal}
//                             fetchSalesOrders={fetchSalesOrders} fetchDeliveryDetails={fetchDeliveryDetails} />
//       }

//     </>
//   );
// }

// export default TrackOrders;

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import TrackOrderAddModal from "../../components/Modal/TrackOrderAddModal";
import checkToken from "../../api/checkToken";
import handleUserLogout from "../../api/logout";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function TrackOrders() {
  const [openTab, setOpenTab] = useState(1);
  const [data, setData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [openProceedDeliveryModal, setOpenProceedDeliveryModal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { setAuth } = useAuth();
  const history = useHistory();

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

  function deliveryStatuses(status) {
    if (status === "SUBMITTED") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          SUBMITTED
        </span>
      );
    } else if (status === "PACKED") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          PACKED
        </span>
      );
    } else if (status === "IN PROGRESS") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          IN PROGRESS
        </span>
      );
    } else if (status === "DELIVERED") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          DELIVERED
        </span>
      );
    } else if (status === "RETURN") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          RETURN
        </span>
      );
    }
  }

  // Filter data based on search query
  const filteredOrdersData = data.filter(order => {
    const matchesSearch =
      (order.OrderID && order.OrderID.toString().includes(searchQuery)) ||
      (order.CustomerName && order.CustomerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.TotalAmount && order.TotalAmount.toString().includes(searchQuery)) ||
      (order.Status && order.Status.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const filteredDeliveryData = deliveryData.filter(delivery => {
    const matchesSearch =
      (delivery.DeliveryID && delivery.DeliveryID.toString().includes(searchQuery)) ||
      (delivery.OrderID && delivery.OrderID.toString().includes(searchQuery)) ||
      (delivery.DeliveryStatus && delivery.DeliveryStatus.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const deliveryColumns = [
    {
      name: "Delivery ID",
      selector: row => row.DeliveryID,
      sortable: true,
      width: "120px",
      style: {
        fontWeight: 600,
        color: "#1f2937",
      },
    },
    {
      name: "Order ID",
      selector: row => row.OrderID,
      sortable: true,
      width: "120px",
    },
    {
      name: "Tracking",
      cell: row => (
        <div className="py-1 px-3 bg-gray-100 rounded-md text-gray-700 font-medium text-sm">
          {row.TrackingNumber || "N/A"}
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => (a.TrackingNumber || "").localeCompare(b.TrackingNumber || ""),
    },
    {
      name: "Delivery Date",
      selector: row => new Date(row.DeliveryDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      sortable: true,
      sortFunction: (a, b) => new Date(a.DeliveryDate) - new Date(b.DeliveryDate),
    },
    {
      name: "Status",
      selector: row => deliveryStatuses(row.DeliveryStatus),
      sortable: true,
      sortFunction: (a, b) => a.DeliveryStatus.localeCompare(b.DeliveryStatus),
    },
  ];

  const columns = [
    {
      name: "Order ID",
      selector: row => row.OrderID,
      sortable: true,
      width: "120px",
      style: {
        fontWeight: 600,
        color: "#1f2937",
      },
    },
    {
      name: "Customer",
      cell: row => (
        <div className="flex items-center py-2">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
            {row.CustomerName ? row.CustomerName.charAt(0) : 'C'}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{row.CustomerName}</div>
          </div>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => a.CustomerName.localeCompare(b.CustomerName),
      grow: 2,
    },
    {
      name: "Order Date",
      selector: row => new Date(row.OrderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      sortable: true,
      sortFunction: (a, b) => new Date(a.OrderDate) - new Date(b.OrderDate),
    },
    {
      name: "Total Amount",
      selector: row => {
        const amount = Number(row.TotalAmount);
        return (
          <span className="font-semibold text-gray-800">
            {amount.toLocaleString()} LKR
          </span>
        );
      },
      sortable: true,
      sortFunction: (a, b) => Number(a.TotalAmount) - Number(b.TotalAmount),
    },
    {
      name: "Status",
      selector: row => (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
          {row.Status}
        </span>
      ),
      sortable: true,
      sortFunction: (a, b) => a.Status.localeCompare(b.Status),
    },
    {
      name: "Actions",
      cell: row => (
        <button
          onClick={() => setOpenProceedDeliveryModal(row)}
          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          Proceed to Delivery
        </button>
      ),
      button: `true`,
      width: "200px",
    },
  ];

  const DeliveryInfo = (props) => {
    const info = props.data;
    const [deliveryInfo, setDeliveryInfo] = useState(info);
    const [customerInfo, setCustomerInfo] = useState({});
    const [orderStatusHistory, setOrderStatusHistory] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState({});
    const [editable, setEditable] = useState(false);
    const [isSubLoading, setIsSubLoading] = useState(true);

    async function fetchCustomerInfo() {
      try {
        setIsSubLoading(true);
        // const customerInfoRes = await axios.get(`${BASE_URL}customer/${info.CustomerID}`, { withCredentials: true });

        const api = createAxiosInstance()
        const customerInfoRes = await api.get(`customer/${info.CustomerID}`)

        if (customerInfoRes.status === 200) {
          setCustomerInfo(() => customerInfoRes.data.customer);
        }
        setIsSubLoading(false);
      } catch (error) {
        setIsSubLoading(false);
        // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
        //   sessionStorage.clear();
        //   history.push('/auth/login');
        // }
        console.log(error);
      }
    }

    async function fetchDeliveryAddress() {
      try {
        setIsSubLoading(true);
        // const addressRes = await axios.get(`${BASE_URL}customeraddress/${info.DeliveryAddressID}`, { withCredentials: true });

        const api = createAxiosInstance()
        const addressRes = await api.get(`customeraddress/${info.DeliveryAddressID}`)

        if (addressRes.status === 200) {
          setDeliveryAddress(() => addressRes.data.customerAddress);
        }
        setIsSubLoading(false);
      } catch (error) {
        setIsSubLoading(false);
        console.log(error);
      }
    }

    async function fetchOrderStatusHistory() {
      try {
        setIsSubLoading(true);
        // const orderStatusHistoryRes = await axios.get(`${BASE_URL}orderstatushistory`, {withCredentials: true });

        const api = createAxiosInstance()
        const orderStatusHistoryRes = await api.get(`orderstatushistory`)

        if (orderStatusHistoryRes.status === 200) {
          setOrderStatusHistory(() => orderStatusHistoryRes.data.orderstatushistories.filter((orderSH) =>
            orderSH.salesorderOrderID === info.OrderID).reverse());
        }
        setIsSubLoading(false);
      } catch (error) {
        setIsSubLoading(false);
        console.log(error);
      }
    }

    async function updateDeliveryInfo() {
      try {
        setIsSubLoading(true);
        const updateData = { ...deliveryInfo, PaymentStatus: 'NULL' };
        delete updateData.DeliveryID;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        // const updateDeliveryRes = await axios.put(`${BASE_URL}deliverydetails/${info.DeliveryID}`, updateData, {withCredentials: true });

        const api = createAxiosInstance()
        const updateDeliveryRes = await api.put(`deliverydetails/${info.DeliveryID}`, updateData)

        if (deliveryInfo.DeliveryStatus !== info.DeliveryStatus) {
          const status = {
            OldStatus: info.DeliveryStatus,
            NewStatus: deliveryInfo.DeliveryStatus,
            StatusChangeDate: new Date(),
            salesorderOrderID: info.OrderID,
          };
          // await axios.post(`${BASE_URL}orderstatushistory`, status, {withCredentials: true });
          await api.post(`orderstatushistory`, status);
        }

        setIsSubLoading(false);
        Swal.fire({
          title: "Success",
          text: "Delivery information updated successfully",
          icon: "success"
        });

        fetchCustomerInfo();
        fetchOrderStatusHistory();
        fetchDeliveryAddress();
        fetchDeliveryDetails();
      } catch (error) {
        setIsSubLoading(false);
        console.log(error);
        Swal.fire({
          title: "Error",
          text: "Failed to update delivery information",
          icon: "error"
        });
      }

      setEditable(() => false);
    }

    useEffect(() => {
      // if (checkToken()) {
      //   handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
      //   return;
      // }

      fetchCustomerInfo();
      fetchOrderStatusHistory();
      fetchDeliveryAddress();
    }, []);

    return (
      <>
        <div className="p-6 space-y-6 bg-gray-50 rounded-lg">
          {isSubLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-semibold text-gray-900">{customerInfo.Name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Tracking Number:</span>
                    <span className="font-semibold text-gray-900">{info.TrackingNumber || "N/A"}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    disabled={!editable}
                    value={deliveryInfo.DeliveryStatus}
                    onChange={(e) => setDeliveryInfo((de) => ({ ...de, DeliveryStatus: e.target.value }))}
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="PACKED">PACKED</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="RETURN">RETURN</option>
                  </select>

                  {!editable ? (
                    <button
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      onClick={() => setEditable(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                  ) : (
                    <button
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                      onClick={() => updateDeliveryInfo()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Delivery Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Address</div>
                    <p className="text-gray-900">
                      {deliveryAddress.Street}, {deliveryAddress.City}, {deliveryAddress.State}, {deliveryAddress.Country}, {deliveryAddress.PostalCode}
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Carrier</div>
                    <p className="text-gray-900">{info.Carrier || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Delivery Date</div>
                    <input
                      type="date"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={info.DeliveryDate.slice(0, 10)}
                      readOnly={true}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Estimated Delivery Date</div>
                    <input
                      type="date"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={deliveryInfo.EstimatedDeliveryDate.slice(0, 10)}
                      readOnly={!editable}
                      onChange={(e) => setDeliveryInfo((de) => ({ ...de, EstimatedDeliveryDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Actual Delivery Date</div>
                    <input
                      type="date"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={deliveryInfo.ActualDeliveryDate.slice(0, 10)}
                      readOnly={!editable}
                      onChange={(e) => setDeliveryInfo((de) => ({ ...de, ActualDeliveryDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Status History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Old Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Change Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderStatusHistory.length > 0 ? (
                        orderStatusHistory.map((osh) => (
                          <tr key={osh.StatusID} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{osh.StatusID}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{osh.OldStatus}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{osh.NewStatus}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(osh.StatusChangeDate).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No status history available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  async function fetchSalesOrders() {
    try {
      setIsLoading(true);
      // const response = await axios.get(`${BASE_URL}salesorder`, { withCredentials: true });

      const api = createAxiosInstance()
      const response = await api.get('salesorder')

      if (response.status === 200) {
        const salesOrders = response.data.salesorders;
        setData(() => salesOrders.filter((salesOrder) => salesOrder.Status === "TO DELIVER"));
      }
      setIsLoading(false);
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "no sales orders found") {
        console.log("No Sales Orders Found");
      } else {
        console.log(error)
      }
      setIsLoading(false);

      // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
      //   localStorage.clear();
      //   history.push('/auth/login');
      // }
    }
  }

  async function fetchDeliveryDetails() {
    try {
      setIsLoading(true);
      // const response = await axios.get(`${BASE_URL}deliverydetails`, { withCredentials: true });

      const api = createAxiosInstance()
      const response = await api.get('deliverydetails')

      if (response.status === 200) {
        setDeliveryData(() => response.data.allDeliveryDetails);
      }
      setIsLoading(false);
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "No Delivery Details Found") {
        console.log("No Delivery Details Found");
      } else {
        console.log(error)
      }
      setIsLoading(false);

      // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
      //   sessionStorage.clear();
      //   history.push('/auth/login');
      // }
    }
  }

  useEffect(() => {
    // if (!checkToken()) {
    //   handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
    //   return;
    // }

    fetchSalesOrders();
    fetchDeliveryDetails();
  }, []);

  return (
    <>
      <div className="w-full min-h-screen p-6">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Track Orders</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage order deliveries
              </p>
            </div>
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
                  placeholder="Search by order ID, customer, or status"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    fetchSalesOrders();
                    fetchDeliveryDetails();
                  }}
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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Orders to Deliver</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">{data.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Delivered</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {deliveryData.filter(delivery => delivery.DeliveryStatus === "DELIVERED").length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">In Progress</p>
                    <h3 className="mt-1 text-xl font-semibold text-gray-900">
                      {deliveryData.filter(delivery => delivery.DeliveryStatus === "IN PROGRESS").length}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="sm:hidden">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={openTab}
                onChange={(e) => setOpenTab(parseInt(e.target.value))}
              >
                <option value={1}>Add to Delivery</option>
                <option value={2}>In Transit</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    className={`${openTab === 1
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    onClick={() => setOpenTab(1)}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      Add to Delivery
                    </div>
                  </button>
                  <button
                    className={`${openTab === 2
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    onClick={() => setOpenTab(2)}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      In Transit
                    </div>
                  </button>
                </nav>
              </div>
            </div>
          </div>



          

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="p-1">
              {/* Add to Delivery Tab */}
              <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                <DataTable
                  columns={columns}
                  data={filteredOrdersData}
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
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      <p className="mt-4 text-lg font-medium text-gray-500">No orders to deliver</p>
                      <p className="mt-1 text-sm text-gray-400">Try adjusting your search or check back later</p>
                    </div>
                  }
                />
              </div>

              {/* In Transit Tab */}
              <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                <DataTable
                  columns={deliveryColumns}
                  data={filteredDeliveryData}
                  customStyles={customStyles}
                  highlightOnHover
                  pointerOnHover
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                  expandableRows
                  expandOnRowClicked
                  expandableRowsComponent={DeliveryInfo}
                  progressPending={isLoading}
                  progressComponent={
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  }
                  noDataComponent={
                    <div className="flex flex-col items-center justify-center p-10 text-center">
                      <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <p className="mt-4 text-lg font-medium text-gray-500">No deliveries in transit</p>
                      <p className="mt-1 text-sm text-gray-400">Try adjusting your search or check back later</p>
                    </div>
                  }
                />
              </div>
            </div>
          </div>


        </div>
      </div>

      {openProceedDeliveryModal && (
        <TrackOrderAddModal
          orderInfo={openProceedDeliveryModal}
          closeModal={setOpenProceedDeliveryModal}
          fetchSalesOrders={fetchSalesOrders}
          fetchDeliveryDetails={fetchDeliveryDetails}
        />
      )}
    </>
  );
}

export default TrackOrders;