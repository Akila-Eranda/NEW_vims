import React, { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import { createAxiosInstance } from "api/axiosInstance";
import DataTableColumnHeader from "components/Table/DataTableColumnHeader";
import TableActionsRow from "components/Table/TableActionsRow";

const STATUS_OPTIONS = ["Paid", "Pending", "Partial", "Returned", "Cancelled"];

const StatusBadge = ({ status }) => {
  const map = {
    Paid:      "bg-green-100 text-green-800",
    Pending:   "bg-yellow-100 text-yellow-800",
    Partial:   "bg-blue-100 text-blue-800",
    Returned:  "bg-red-100 text-red-800",
    Cancelled: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status || "—"}
    </span>
  );
};

const columnHelper = createColumnHelper();

function Sales() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const [invoiceFilter, setInvoiceFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [activeStatuses, setActiveStatuses] = useState([]);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  async function loadOrders() {
    try {
      setIsLoading(true);
      const api = createAxiosInstance();
      const res = await api.get("salesorders");
      setOrders(res.data.salesOrders || res.data.orders || []);
    } catch (e) {
      if (e?.response?.status !== 404) console.error(e);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadOrders(); }, []);

  function handleDelete(row) {
    Swal.fire({
      title: "Confirm Delete",
      text: `Delete invoice ${row.InvoiceNumber || row.OrderID}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const api = createAxiosInstance();
          await api.delete(`salesorders/${row.OrderID}`);
          Swal.fire({ title: "Deleted!", icon: "success" });
          loadOrders();
        } catch (e) {
          Swal.fire({ title: "Error", text: "Failed to delete", icon: "error" });
        }
      }
    });
  }

  function exportCSV() {
    if (orders.length === 0) return;
    const headers = ["Invoice", "Date", "Customer", "Total", "Status"];
    const rows = orders.map(o => [
      o.InvoiceNumber || o.OrderID,
      o.OrderDate ? new Date(o.OrderDate).toLocaleDateString() : "",
      o.customer?.firstname ? `${o.customer.firstname} ${o.customer.lastname}` : (o.CustomerName || ""),
      o.TotalAmount || o.Total || 0,
      o.Status || "",
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const toggleStatus = (s) => {
    setActiveStatuses(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
    setPagination(p => ({ ...p, pageIndex: 0 }));
  };

  const removeStatus = (s) => setActiveStatuses(prev => prev.filter(x => x !== s));

  const filteredData = useMemo(() => {
    return orders.filter(o => {
      const invoice = (o.InvoiceNumber || String(o.OrderID) || "").toLowerCase();
      const customer = o.customer
        ? `${o.customer.firstname} ${o.customer.lastname}`.toLowerCase()
        : (o.CustomerName || "").toLowerCase();
      const matchInvoice = invoice.includes(invoiceFilter.toLowerCase());
      const matchCustomer = customer.includes(customerFilter.toLowerCase());
      const matchStatus = activeStatuses.length === 0 || activeStatuses.includes(o.Status);
      return matchInvoice && matchCustomer && matchStatus;
    });
  }, [orders, invoiceFilter, customerFilter, activeStatuses]);

  const columns = useMemo(() => [
    columnHelper.display({
      id: "rowNum",
      header: "#",
      size: 50,
      enableSorting: false,
      cell: info => (
        <span className="text-gray-400 text-sm">
          {info.table.getState().pagination.pageIndex * info.table.getState().pagination.pageSize + info.row.index + 1}
        </span>
      ),
    }),
    columnHelper.accessor(row => row.InvoiceNumber || `#${row.OrderID}`, {
      id: "invoice",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice" />,
      cell: info => (
        <span className="font-semibold text-gray-800 text-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("OrderDate", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: info => (
        <span className="text-gray-600 text-sm">
          {info.getValue() ? new Date(info.getValue()).toLocaleDateString("en-GB") : "—"}
        </span>
      ),
    }),
    columnHelper.accessor(row =>
      row.customer ? `${row.customer.firstname} ${row.customer.lastname}` : (row.CustomerName || "—"),
      {
        id: "customer",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
        cell: info => <span className="text-gray-700 text-sm">{info.getValue()}</span>,
      }
    ),
    columnHelper.accessor(row => parseFloat(row.TotalAmount || row.Total || 0), {
      id: "total",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      cell: info => (
        <span className="font-semibold text-gray-800 text-sm">
          {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 2 }).format(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("Status", {
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      size: 120,
      cell: info => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      size: 50,
      enableSorting: false,
      cell: info => (
        <TableActionsRow
          actions={[
            { label: "View", onClick: () => {} },
            { label: "Edit", onClick: () => {} },
            { label: "Print", onClick: () => {} },
            { label: "Delete", onClick: () => handleDelete(info.row.original), variant: "destructive" },
          ]}
        />
      ),
    }),
  ], [orders]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, pagination, columnVisibility },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Summary stats
  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.TotalAmount || o.Total || 0), 0);
  const paidCount = orders.filter(o => o.Status === "Paid").length;
  const returnedCount = orders.filter(o => o.Status === "Returned").length;

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          View and manage{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">all sales transactions</span>
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Sales", value: orders.length, icon: "bg-purple-100 text-purple-600", iconPath: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
          { label: "Revenue", value: `LKR ${new Intl.NumberFormat("en-LK").format(totalRevenue)}`, icon: "bg-green-100 text-green-600", iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
          { label: "Paid", value: paidCount, icon: "bg-emerald-100 text-emerald-600", iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Returned", value: returnedCount, icon: "bg-pink-100 text-pink-600", iconPath: "M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 2 2 2-2 2 2 2-2 4 2z" },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${card.icon}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={card.iconPath} />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 leading-tight">{card.value}</p>
              <p className="text-xs text-gray-400">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">
          {/* Table / Cards toggle */}
          <div className="flex border border-gray-200 rounded-md overflow-hidden mr-1">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${viewMode === "table" ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 4v16M3 4h18v16H3V4z" />
              </svg>
              Table
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 border-l border-gray-200 transition-colors ${viewMode === "cards" ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Cards
            </button>
          </div>

          {/* Invoice search */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
            <input
              type="text"
              value={invoiceFilter}
              onChange={e => { setInvoiceFilter(e.target.value); setPagination(p => ({ ...p, pageIndex: 0 })); }}
              placeholder="Filter Invoice..."
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-44"
            />
          </div>

          {/* Customer search */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
            <input
              type="text"
              value={customerFilter}
              onChange={e => { setCustomerFilter(e.target.value); setPagination(p => ({ ...p, pageIndex: 0 })); }}
              placeholder="Filter Customer..."
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-44"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Columns toggle */}
          <div className="relative">
            <button
              onClick={() => setShowColumnMenu(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Columns
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </button>
            {showColumnMenu && (
              <div className="absolute right-0 mt-1 z-30 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-max">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Toggle Columns</p>
                {table.getAllLeafColumns().filter(c => c.id !== "rowNum" && c.id !== "actions").map(column => (
                  <label key={column.id} className="flex items-center gap-2 py-1 cursor-pointer text-sm text-gray-700">
                    <input type="checkbox" checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} className="rounded border-gray-300 text-blue-600" />
                    {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Filter chips row */}
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-400 mr-1">Filter by</span>

          {/* Status filter button */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(v => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-xs font-medium transition-colors ${
                activeStatuses.length > 0
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : "border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Status
              {activeStatuses.length > 0 && (
                <span className="bg-blue-500 text-white rounded-full h-3.5 w-3.5 flex items-center justify-center text-xs leading-none">{activeStatuses.length}</span>
              )}
            </button>
            {showStatusMenu && (
              <div className="absolute left-0 mt-1 z-30 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-max">
                {STATUS_OPTIONS.map(s => (
                  <label key={s} className="flex items-center gap-2 py-1 cursor-pointer text-sm text-gray-700">
                    <input type="checkbox" checked={activeStatuses.includes(s)} onChange={() => toggleStatus(s)} className="rounded border-gray-300 text-blue-600" />
                    <StatusBadge status={s} />
                  </label>
                ))}
                {activeStatuses.length > 0 && (
                  <button onClick={() => setActiveStatuses([])} className="mt-2 text-xs text-red-500 hover:text-red-700">Clear all</button>
                )}
              </div>
            )}
          </div>

          {/* Active filter chips */}
          {activeStatuses.map(s => (
            <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
              {s}
              <button onClick={() => removeStatus(s)} className="hover:text-red-500 ml-0.5">×</button>
            </span>
          ))}

          {(activeStatuses.length > 0 || invoiceFilter || customerFilter) && (
            <button
              onClick={() => { setActiveStatuses([]); setInvoiceFilter(""); setCustomerFilter(""); }}
              className="text-xs text-red-400 hover:text-red-600 ml-1"
            >
              Reset all
            </button>
          )}
        </div>

        {/* Table view */}
        {viewMode === "table" && (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : table.getRowModel().rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-orange-500">No records found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try adjusting your search or{" "}
                  <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => { setActiveStatuses([]); setInvoiceFilter(""); setCustomerFilter(""); }}>
                    filter criteria
                  </span>.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    {table.getHeaderGroups().map(hg => (
                      <tr key={hg.id} className="border-b border-gray-100 bg-white">
                        {hg.headers.map(header => (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left"
                            style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                          >
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map(row => (
                      <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-100">
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-4 py-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Cards view */}
        {viewMode === "cards" && (
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-sm font-semibold text-orange-500">No records found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map((o, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800 text-sm">{o.InvoiceNumber || `#${o.OrderID}`}</span>
                      <StatusBadge status={o.Status} />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {o.customer ? `${o.customer.firstname} ${o.customer.lastname}` : (o.CustomerName || "—")}
                    </p>
                    <p className="text-xs text-gray-400">
                      {o.OrderDate ? new Date(o.OrderDate).toLocaleDateString("en-GB") : "—"}
                    </p>
                    <p className="text-base font-bold text-gray-900 mt-2">
                      {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 2 }).format(parseFloat(o.TotalAmount || o.Total || 0))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Showing {from}–{to} of {totalRows} records</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={e => { table.setPageSize(Number(e.target.value)); }}
              className="border border-gray-200 rounded text-xs px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-300"
            >
              {[5, 10, 15, 20, 25].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-2 py-1 rounded text-xs hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
              ‹ Previous
            </button>
            {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
              const start = Math.max(0, Math.min(pageIndex - 2, table.getPageCount() - 5));
              const pg = start + i;
              return (
                <button
                  key={pg}
                  onClick={() => table.setPageIndex(pg)}
                  className={`w-7 h-7 rounded text-xs font-medium ${pg === pageIndex ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"}`}
                >
                  {pg + 1}
                </button>
              );
            })}
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-2 py-1 rounded text-xs hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
              Next ›
            </button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Sales;
