import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
// import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/admin/Dashboard.js";
// import Maps from "views/admin/Maps.js";
// import Settings from "views/admin/Settings.js";
// import Tables from "views/admin/Tables.js";
// import ManageOrders from "views/admin/ManageOrders";
import TrackOrders from "views/admin/TrackOrders";
import ManageProducts from "views/admin/ManageProducts";
import ManageCategories from "views/admin/ManageCategories";
import SalesOrders from "views/admin/SalesOrders";
import PurchaseOrders from "views/admin/PurchaseOrders";
import ManageInventory from "../views/admin/ManageInventory";
import ManageWarehouses from "../views/admin/ManageWarehouses";
import ManageCustomers from "../views/admin/ManageCustomers";
import ManageUsers from "../views/admin/ManageUsers";
import ManageSuppliers from "views/admin/ManageSuppliers";
import AddSalesOrder from "views/admin/AddSalesOrder";
import Reports from "views/admin/Reports";
import Discounts from "views/admin/Discounts"
import OrderHistory from "views/admin/OrderHistory";
import WarehouseStockTransfer from "views/admin/WarehouseStockTransfer";
import ReturnOrders from "views/admin/ReturnOrders";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 ">
        {/* <AdminNavbar /> */}
        {/* Header */}
        {/* <HeaderStats /> */}
        <div className="px-4 mx-auto w-full">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/sales-orders" exact component={SalesOrders}/>
            <Route path="/admin/sales-orders/:id" exact component={SalesOrders}/>
            <Route path="/admin/purchase-orders" exact component={PurchaseOrders} />
            <Route path="/admin/track-orders" exact component={TrackOrders} />
            <Route path="/admin/return-orders" exact component={ReturnOrders} />
            <Route path="/admin/manage-products" exact component={ManageProducts} />
            <Route path="/admin/manage-categories" exact component={ManageCategories} />
            <Route path="/admin/manage-inventory" exact component={ManageInventory} />
            <Route path="/admin/manage-warehouses" exact component={ManageWarehouses} />
            <Route path="/admin/manage-users" exact component={ManageUsers} />
            <Route path="/admin/manage-customers" exact component={ManageCustomers} />
            <Route path="/admin/manage-suppliers" exact component={ManageSuppliers} />
            <Route path="/admin/warehouse-stock-transfer" exact component={WarehouseStockTransfer} />
            <Route path="/admin/reports" exact component={Reports} />
            <Route path="/admin/discounts" exact component={Discounts} />
            {/* <Route path="/admin/maps" exact component={Maps} />
            <Route path="/admin/settings" exact component={Settings} />
            <Route path="/admin/tables" exact component={Tables} /> */}
            <Route path="/admin/order-history" exact component={OrderHistory} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
