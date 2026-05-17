/*eslint-disable*/
// import React from "react";
// import { Link, useHistory } from "react-router-dom";

// import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
// import UserDropdown from "components/Dropdowns/UserDropdown.js";
// import axios from "axios";
// import { useAuth } from "context/AuthContext";


// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function Sidebar() {
//   const [collapseShow, setCollapseShow] = React.useState("hidden");

//   // const {userLogout} = useAuth();

//   const history = useHistory();

//   async function userLogout() {

//     // const token = sessionStorage.getItem("tokens");
//     // if (!token) {
//     //   history.push("/auth/admin");
//     //   return;
//     // }

//     try {
//       const response = await axios.post(`${BASE_URL}auth/logout`, {}, { withCredentials: true });
//       sessionStorage.removeItem('user');
//       history.push("/auth/login");
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   return (
//     <>
//       <nav
//         className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
//         <div
//           className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
//           {/* Toggler */}
//           <button
//             className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
//             type="button"
//             onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
//           >
//             <i className="fas fa-bars"></i>
//           </button>
//           {/* Brand */}
//           <Link
//             className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
//             to="/"
//           >
//             Hexa - VIMS
//           </Link>
//           {/* User */}
//           <ul className="md:hidden items-center flex flex-wrap list-none">
//             <li className="inline-block relative">
//               <NotificationDropdown />
//             </li>
//             <li className="inline-block relative">
//               <UserDropdown />
//             </li>
//           </ul>
//           {/* Collapse */}
//           <div
//             className={
//               "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
//               collapseShow
//             }
//           >
//             {/* Collapse header */}
//             <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
//               <div className="flex flex-wrap">
//                 <div className="w-6/12">
//                   <Link
//                     className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
//                     to="/"
//                   >
//                     Hexa - VIMS
//                   </Link>
//                 </div>
//                 <div className="w-6/12 flex justify-end">
//                   <button
//                     type="button"
//                     className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
//                     onClick={() => setCollapseShow("hidden")}
//                   >
//                     <i className="fas fa-times"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>
//             {/* Form */}
//             <form className="mt-6 mb-4 md:hidden">
//               <div className="mb-3 pt-0">
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   className="px-3 py-2 h-12 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
//                 />
//               </div>
//             </form>

//             {/* Divider */}
//             {/* <hr className="my-4 md:min-w-full" /> */}
//             {/* Heading */}
//             {/* <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
//               Admin Layout Pages
//             </h6> */}
//             {/* Navigation */}

//             <ul className="md:flex-col md:min-w-full flex flex-col list-none">
//               <li className="items-center">
//                 <Link
//                   className={
//                     "text-xs uppercase py-3 font-bold block " +
//                     (window.location.href.indexOf("/admin/dashboard") !== -1
//                       ? "text-lightBlue-500 hover:text-lightBlue-600"
//                       : "text-blueGray-700 hover:text-blueGray-500")
//                   }
//                   to="/admin/dashboard"
//                 >
//                   <i
//                     className={
//                       "fas fa-tv mr-2 text-sm " +
//                       (window.location.href.indexOf("/admin/dashboard") !== -1
//                         ? "opacity-75"
//                         : "text-blueGray-300")
//                     }
//                   ></i>{" "}
//                   Dashboard
//                 </Link>
//               </li>

//               {/* <li className="items-center">
//                 <Link
//                   className={
//                     "text-xs uppercase py-3 font-bold block " +
//                     (window.location.href.indexOf("/admin/settings") !== -1
//                       ? "text-lightBlue-500 hover:text-lightBlue-600"
//                       : "text-blueGray-700 hover:text-blueGray-500")
//                   }
//                   to="/admin/settings"
//                 >
//                   <i
//                     className={
//                       "fas fa-tools mr-2 text-sm " +
//                       (window.location.href.indexOf("/admin/settings") !== -1
//                         ? "opacity-75"
//                         : "text-blueGray-300")
//                     }
//                   ></i>{" "}
//                   Settings
//                 </Link>
//               </li> */}

//               {/* <li className="items-center">
//                 <Link
//                   className={
//                     "text-xs uppercase py-3 font-bold block " +
//                     (window.location.href.indexOf("/admin/tables") !== -1
//                       ? "text-lightBlue-500 hover:text-lightBlue-600"
//                       : "text-blueGray-700 hover:text-blueGray-500")
//                   }
//                   to="/admin/tables"
//                 >
//                   <i
//                     className={
//                       "fas fa-table mr-2 text-sm " +
//                       (window.location.href.indexOf("/admin/tables") !== -1
//                         ? "opacity-75"
//                         : "text-blueGray-300")
//                     }
//                   ></i>{" "}
//                   Tables
//                 </Link>
//               </li> */}

//               {/* <li className="items-center">
//                 <Link
//                   className={
//                     "text-xs uppercase py-3 font-bold block " +
//                     (window.location.href.indexOf("/admin/maps") !== -1
//                       ? "text-lightBlue-500 hover:text-lightBlue-600"
//                       : "text-blueGray-700 hover:text-blueGray-500")
//                   }
//                   to="/admin/maps"
//                 >
//                   <i
//                     className={
//                       "fas fa-map-marked mr-2 text-sm " +
//                       (window.location.href.indexOf("/admin/maps") !== -1
//                         ? "opacity-75"
//                         : "text-blueGray-300")
//                     }
//                   ></i>{" "}
//                   Maps
//                 </Link>
//               </li> */}
//             </ul>

//             {/* Divider */}
//             <hr className="my-4 md:min-w-full" />
//             {/* Heading */}
//             <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
//               Orders
//             </h6>
//             {/* Navigation */}

//             <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
//               {/* <li className="items-center">
//                 <Link
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   to="/admin/manage-orders"
//                 >
//                   <i className="fas fa-box-open text-blueGray-400 mr-2 text-sm"></i>{" "}
//                   Manage Orders
//                 </Link>
//               </li> */}


//               <li className="items-center">
//                 <Link
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   to="/admin/sales-orders"
//                 >
//                   <i className="fas fa-cash-register text-blueGray-300 mr-2 text-sm"></i>{" "}
//                   Sales Orders
//                 </Link>
//               </li>
//               <li className="items-center">
//                 <Link
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   to="/admin/purchase-orders"
//                 >
//                   <i className="fas fa-money-bill text-blueGray-300 mr-2 text-sm"></i>{" "}
//                   Purchase Orders
//                 </Link>
//               </li>

//               <li className="items-center">
//                 <Link
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   to="/admin/track-orders"
//                 >
//                   <i className="fas fa-bullseye text-blueGray-300 mr-2 text-sm"></i>{" "}
//                   Track Orders
//                 </Link>
//               </li>

//             </ul>

//             {/* Divider */}
//             <hr className="my-4 md:min-w-full" />
//             {/* Heading */}
//             <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
//               Products
//             </h6>
//             {/* Navigation */}

//             <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
//               <li className="items-center">
//                 <Link
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   to="/admin/manage-products"
//                 >
//                   <i className="fas fa-box text-blueGray-400 mr-2 text-sm"></i>{" "}
//                   Manage Products
//                 </Link>
//               </li>

//               <li className="items-center">
//                 <Link
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   to="/admin/manage-categories"
//                 >
//                   <i className="fas fa-filter text-blueGray-400 mr-2 text-sm"></i>{" "}
//                   Manage Categories
//                 </Link>
//               </li>
//             </ul>

//             {/* Divider */}
//             <hr className="my-4 md:min-w-full" />
//             {/* Heading */}
//             <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
//               Inventory
//             </h6>
//             {/* Navigation */}
//             <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
//               {/* <li className="inline-flex">
//                 <a
//                   href="https://www.creative-tim.com/learning-lab/tailwind/react/colors/notus"
//                   target="_blank"
//                   className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold"
//                 >
//                   <i className="fas fa-paint-brush mr-2 text-blueGray-300 text-base"></i>
//                   Styles
//                 </a>
//               </li> */}

//               <li className="items-center">
//                 <Link
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   to="/admin/manage-inventory"
//                 >
//                   <i className="fas fa-boxes text-blueGray-400 mr-2 text-sm"></i>{" "}
//                   Manage Inventory
//                 </Link>
//               </li>

//               <li className="items-center">
//                 <Link
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   to="/admin/manage-warehouses"
//                 >
//                   <i className="fas fa-warehouse text-blueGray-400 mr-2 text-sm"></i>{" "}
//                   Manage Warehouses
//                 </Link>
//               </li>

//               {/* <li className="inline-flex">
//                 <a
//                   href="https://www.creative-tim.com/learning-lab/tailwind/react/alerts/notus"
//                   target="_blank"
//                   className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold"
//                 >
//                   <i className="fab fa-css3-alt mr-2 text-blueGray-300 text-base"></i>
//                   CSS Components
//                 </a>
//               </li> */}

//               {/* <li className="inline-flex">
//                 <a
//                   href="https://www.creative-tim.com/learning-lab/tailwind/angular/overview/notus"
//                   target="_blank"
//                   className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold"
//                 >
//                   <i className="fab fa-angular mr-2 text-blueGray-300 text-base"></i>
//                   Angular
//                 </a>
//               </li> */}

//               {/* <li className="inline-flex">
//                 <a
//                   href="https://www.creative-tim.com/learning-lab/tailwind/js/overview/notus"
//                   target="_blank"
//                   className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold"
//                 >
//                   <i className="fab fa-js-square mr-2 text-blueGray-300 text-base"></i>
//                   Javascript
//                 </a>
//               </li> */}

//               {/* <li className="inline-flex">
//                 <a
//                   href="https://www.creative-tim.com/learning-lab/tailwind/nextjs/overview/notus"
//                   target="_blank"
//                   className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold"
//                 >
//                   <i className="fab fa-react mr-2 text-blueGray-300 text-base"></i>
//                   NextJS
//                 </a>
//               </li> */}

//               {/* <li className="inline-flex">
//                 <a
//                   href="https://www.creative-tim.com/learning-lab/tailwind/react/overview/notus"
//                   target="_blank"
//                   className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold"
//                 >
//                   <i className="fab fa-react mr-2 text-blueGray-300 text-base"></i>
//                   React
//                 </a>
//               </li> */}

//               {/* <li className="inline-flex">
//                 <a
//                   href="https://www.creative-tim.com/learning-lab/tailwind/svelte/overview/notus"
//                   target="_blank"
//                   className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold"
//                 >
//                   <i className="fas fa-link mr-2 text-blueGray-300 text-base"></i>
//                   Svelte
//                 </a>
//               </li> */}

//               {/* <li className="inline-flex">
//                 <a
//                   href="https://www.creative-tim.com/learning-lab/tailwind/vue/overview/notus"
//                   target="_blank"
//                   className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold"
//                 >
//                   <i className="fab fa-vuejs mr-2 text-blueGray-300 text-base"></i>
//                   VueJS
//                 </a>
//               </li> */}
//             </ul>

//             <hr className="my-4 md:min-w-full" />

//             <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
//               People
//             </h6>

//             <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
//               <li className="items-center">
//                 <Link
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   to="/admin/manage-users"
//                 >
//                   <i className="fas fa-user-lock text-blueGray-400 mr-2 text-sm"></i>{" "}
//                   Manage Users
//                 </Link>
//               </li>
//               <li className="items-center">
//                 <Link
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   to="/admin/manage-customers"
//                 >
//                   <i className="fas fa-user-tag text-blueGray-400 mr-2 text-sm"></i>{" "}
//                   Manage Customers
//                 </Link>
//               </li>
//               <li className="items-center">
//                 <Link
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   to="/admin/manage-suppliers"
//                 >
//                   <i className="fas fa-user-friends text-blueGray-400 mr-2 text-sm"></i>{" "}
//                   Manage Suppliers
//                 </Link>
//               </li>
//             </ul>

//             <hr className="my-4 md:min-w-full" />

//             <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
//               <li className="items-center">
//                 <button
//                   className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
//                   onClick={() => userLogout()}
//                 >
//                   <i className="fas fa-arrow-left text-blueGray-400 mr-2 text-sm"></i>{" "}
//                   Log Out
//                 </button>
//               </li>
//             </ul>

//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "context/AuthContext";

// You can keep these imports if needed
import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { getStoredTokens } from "auth/tokenService";

const BASE_URL = "https://api.vims.hexalyte.com/v1/";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const history = useHistory();
  const location = useLocation();

  // Close sidebar when route changes (especially on mobile)
  useEffect(() => {
    setCollapseShow("hidden");
  }, [location.pathname]);

  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    function handleClickOutside(event) {
      const sidebar = document.getElementById("main-sidebar");
      if (sidebar && !sidebar.contains(event.target) && window.innerWidth < 768) {
        setCollapseShow("hidden");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function userLogout() {
    try {
      const response = await axios.post(`${BASE_URL}auth/logout`);
      localStorage.removeItem('user');
      history.push("/auth/login");
    } catch (error) {
      console.log(error);
    }
  }

  // Helper function to determine if a link is active
  const isActive = (path) => {
    return location.pathname.indexOf(path) !== -1;
  };

  const [currUserRole, setCurrUserRole] = useState(null);

  useEffect(() => {
    // const sessionUser = JSON.parse(sessionStorage.getItem('user'))?.user;
    // if (sessionUser) {
    //   setCurrUserRole(sessionUser.role);
    // }

    const sessionUser = getStoredTokens()
    // console.log(sessionUser.user.role)

    if (sessionUser) {
      setCurrUserRole(() => sessionUser.user.role)
    }

  },);

  return (
    <>
      <nav
        id="main-sidebar"
        className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-gradient-to-b from-indigo-900 to-blue-800 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-0 transition-all duration-300"
      >
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-white md:hidden px-5 py-2 text-xl leading-none bg-transparent rounded-md hover:bg-blue-700 transition-colors duration-200"
            type="button"
            onClick={() => setCollapseShow("bg-blue-900 m-2 py-3 px-6")}
            aria-label="Toggle navigation menu"
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* Brand */}
          <div className="w-full flex justify-center py-6 border-b border-blue-700">
            <label
              className="text-center text-white mr-0 inline-block whitespace-nowrap text-xl font-bold px-0"
            >
              <i className="fas fa-cubes mr-2"></i>
              ARI
            </label>
          </div>

          {/* User Avatar */}
          <div className="hidden md:flex w-full justify-center my-6">
            {/* <div className="w-20 h-20 rounded-full bg-blue-600 border-4 border-blue-400 flex items-center justify-center shadow-lg"> */}
            {/* <i className="fas fa-user text-2xl text-white opacity-70"></i> */}
            {/* </div> */}
          </div>

          {/* User (mobile only) */}
          <ul className="md:hidden items-center flex flex-wrap list-none px-4">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>

          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-0 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded-lg transition-all duration-300 " +
              collapseShow
            }
          >
            {/* Collapse header (mobile only) */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-blue-700">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-white mr-0 inline-block whitespace-nowrap text-base font-bold p-4 px-4"
                    to="/"
                  >
                    <i className="fas fa-cubes mr-2"></i>
                    Hexa - VIMS
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-white md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded-md hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => setCollapseShow("hidden")}
                    aria-label="Close menu"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Search form */}
            {/* <div className="px-4 pt-2 pb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="fas fa-search text-blue-300"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full bg-blue-800 text-white placeholder-blue-300 rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>
            </div> */}

            {/* Navigation Sections */}
            <div className="px-4 py-2">
              <SidebarSection title="">
                <SidebarItem
                  to="/admin/dashboard"
                  text="Dashboard"
                  icon="fas fa-chart-line"
                  isActive={isActive("/admin/dashboard")}
                />
              </SidebarSection>

              <SidebarSection title="Orders">
                <SidebarItem
                  to="/admin/sales-orders"
                  text="Sales Orders"
                  icon="fas fa-cash-register"
                  isActive={isActive("/admin/sales-orders")}
                />
                <SidebarItem
                  to="/admin/purchase-orders"
                  text="Purchase Orders"
                  icon="fas fa-money-bill"
                  isActive={isActive("/admin/purchase-orders")}
                />
                <SidebarItem
                  to="/admin/track-orders"
                  text="Track Orders"
                  icon="fas fa-bullseye"
                  isActive={isActive("/admin/track-orders")}
                />
                <SidebarItem
                  to="/admin/discounts"
                  text="Discounts"
                  icon="fas fa-percent"
                  isActive={isActive("/admin/discounts")}
                />

                <SidebarItem
                  to="/admin/order-history"
                  text="Order History"
                  icon="fas fa-history"
                  isActive={isActive("/admin/order-history")}
                />

                <SidebarItem
                  to="/admin/return-orders"
                  text="Return Orders"
                  icon="fas fa-history"
                  isActive={isActive("/admin/return-orders")}
                />
              </SidebarSection>

              <SidebarSection title="Products">
                <SidebarItem
                  to="/admin/manage-products"
                  text="Manage Products"
                  icon="fas fa-box"
                  isActive={isActive("/admin/manage-products")}
                />
                <SidebarItem
                  to="/admin/manage-categories"
                  text="Manage Categories"
                  icon="fas fa-filter"
                  isActive={isActive("/admin/manage-categories")}
                />
              </SidebarSection>

              <SidebarSection title="Inventory">
                <SidebarItem
                  to="/admin/manage-inventory"
                  text="Manage Inventory"
                  icon="fas fa-boxes"
                  isActive={isActive("/admin/manage-inventory")}
                />
                <SidebarItem
                  to="/admin/manage-warehouses"
                  text="Manage Warehouses"
                  icon="fas fa-warehouse"
                  isActive={isActive("/admin/manage-warehouses")}
                />
                <SidebarItem
                  to="/admin/warehouse-stock-transfer"
                  text="Warehouses Stock Transfer"
                  icon="fas fa-warehouse"
                  isActive={isActive("/admin/warehouse-stock-transfer")}
                />
              </SidebarSection>

              <SidebarSection title="People">

                {currUserRole === "admin" && (
                  <SidebarItem
                    to="/admin/manage-users"
                    text="Manage Users"
                    icon="fas fa-user-lock"
                    isActive={isActive("/admin/manage-users")}
                  />
                )}
                <SidebarItem
                  to="/admin/manage-customers"
                  text="Manage Customers"
                  icon="fas fa-user-tag"
                  isActive={isActive("/admin/manage-customers")}
                />
                <SidebarItem
                  to="/admin/manage-suppliers"
                  text="Manage Suppliers"
                  icon="fas fa-user-friends"
                  isActive={isActive("/admin/manage-suppliers")}
                />
              </SidebarSection>

              <SidebarSection title="Reports">
                <SidebarItem
                  to="/admin/reports"
                  text="Reports"
                  icon="fas fa-file-alt"
                  isActive={isActive("/admin/reports")}
                />
              </SidebarSection>

            </div>

            {/* Logout Button */}
            <div className="px-4 mt-auto mb-4">
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg transition-all duration-200 hover:bg-red-700 shadow-md hover:shadow-lg"
                onClick={userLogout}
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

// Helper components for cleaner structure
function SidebarSection({ title, children }) {
  return (
    <>
      {title && (
        <>
          <div className="mt-6 mb-2">
            <div className="flex items-center">
              <div className="h-0.5 flex-grow bg-blue-700 opacity-30"></div>
              <h6 className="mx-2 text-blue-300 text-xs uppercase font-bold tracking-wider">
                {title}
              </h6>
              <div className="h-0.5 flex-grow bg-blue-700 opacity-30"></div>
            </div>
          </div>
        </>
      )}
      <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4 space-y-1">
        {children}
      </ul>
    </>
  );
}

function SidebarItem({ to, text, icon, isActive }) {
  return (
    <li className="items-center">
      <Link
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
          ? "text-white bg-blue-600 shadow-md"
          : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
          }`}
        to={to}
      >
        <div className={`w-8 h-8 mr-3 flex items-center justify-center rounded-md ${isActive
          ? "bg-blue-500 text-white"
          : "bg-blue-800/50 text-blue-300"
          }`}>
          <i className={icon}></i>
        </div>
        <span>{text}</span>
        {isActive && <i className="fas fa-chevron-right ml-auto text-xs opacity-70"></i>}
      </Link>
    </li>
  );
}