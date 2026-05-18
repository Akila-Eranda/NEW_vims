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

const STATUS_STYLE = {
  Paid:      { dot: "bg-green-500",  pill: "bg-green-50 text-green-700 ring-green-200" },
  Pending:   { dot: "bg-yellow-500", pill: "bg-yellow-50 text-yellow-700 ring-yellow-200" },
  Partial:   { dot: "bg-blue-500",   pill: "bg-blue-50 text-blue-700 ring-blue-200" },
  Returned:  { dot: "bg-red-500",    pill: "bg-red-50 text-red-700 ring-red-200" },
  Cancelled: { dot: "bg-gray-400",   pill: "bg-gray-50 text-gray-600 ring-gray-200" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Cancelled;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium ring-1 ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
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

  const hasActiveFilters = activeStatuses.length > 0 || invoiceFilter || customerFilter;
  const resetFilters = () => { setActiveStatuses([]); setInvoiceFilter(""); setCustomerFilter(""); };

  return (
    <div className="w-full min-h-screen bg-white p-6">

      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Sales</h1>
        <p className="text-sm text-gray-400 mt-0.5">View and manage all sales transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Sales",  value: orders.length,  color: "text-violet-600", bg: "bg-violet-50",  iconPath: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
          { label: "Revenue",      value: new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(totalRevenue), color: "text-emerald-600", bg: "bg-emerald-50", iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
          { label: "Paid",         value: paidCount,      color: "text-sky-600",    bg: "bg-sky-50",     iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Returned",     value: returnedCount,  color: "text-rose-600",   bg: "bg-rose-50",    iconPath: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" },
        ].map((c, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
              <svg className={`w-5 h-5 ${c.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={c.iconPath} />
              </svg>
            </div>
            <div className="min-w-0">
              <p className={`text-xl font-bold leading-tight ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-400 truncate">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

        {/* ── Toolbar ── */}
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-2">

          {/* Table / Cards toggle */}
          <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
            {[
              { mode: "table", icon: "M3 10h18M3 14h18M10 4v16M3 4h18v16H3V4z", label: "Table" },
              { mode: "cards", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z", label: "Cards" },
            ].map(({ mode, icon, label }, i) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${i > 0 ? "border-l border-gray-200" : ""} ${viewMode === mode ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
                {label}
              </button>
            ))}
          </div>

          {/* Invoice search */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
            <input value={invoiceFilter} onChange={e => { setInvoiceFilter(e.target.value); setPagination(p => ({ ...p, pageIndex: 0 })); }}
              placeholder="Filter Invoice…" className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 w-40 bg-gray-50 placeholder-gray-400" />
          </div>

          {/* Customer search */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
            </svg>
            <input value={customerFilter} onChange={e => { setCustomerFilter(e.target.value); setPagination(p => ({ ...p, pageIndex: 0 })); }}
              placeholder="Filter Customer…" className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 w-40 bg-gray-50 placeholder-gray-400" />
          </div>

          <div className="flex-1" />

          {/* Reset */}
          {hasActiveFilters && (
            <button onClick={resetFilters} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Reset
            </button>
          )}

          {/* Columns toggle */}
          <div className="relative">
            <button onClick={() => setShowColumnMenu(v => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors bg-white">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
              Columns
            </button>
            {showColumnMenu && (
              <div className="absolute right-0 mt-1.5 z-40 bg-white border border-gray-200 rounded-xl shadow-xl p-3 min-w-max">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Toggle columns</p>
                {table.getAllLeafColumns().filter(c => c.id !== "rowNum" && c.id !== "actions").map(col => (
                  <label key={col.id} className="flex items-center gap-2.5 py-1.5 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                    <input type="checkbox" checked={col.getIsVisible()} onChange={col.getToggleVisibilityHandler()} className="rounded border-gray-300 text-violet-600 focus:ring-violet-400" />
                    <span className="capitalize">{col.id}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export CSV */}
          <button onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
        </div>

        {/* ── Filter chips row ── */}
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2 flex-wrap bg-gray-50/50">
          <span className="text-xs text-gray-400 font-medium">Filter by</span>

          {/* Status dropdown */}
          <div className="relative">
            <button onClick={() => setShowStatusMenu(v => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${activeStatuses.length > 0 ? "border-violet-300 bg-violet-50 text-violet-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
              Status
              {activeStatuses.length > 0 && <span className="ml-0.5 bg-violet-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs leading-none">{activeStatuses.length}</span>}
            </button>
            {showStatusMenu && (
              <div className="absolute left-0 mt-1.5 z-40 bg-white border border-gray-200 rounded-xl shadow-xl p-3 min-w-max">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Status</p>
                {STATUS_OPTIONS.map(s => (
                  <label key={s} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                    <input type="checkbox" checked={activeStatuses.includes(s)} onChange={() => toggleStatus(s)} className="rounded border-gray-300 text-violet-600 focus:ring-violet-400" />
                    <StatusBadge status={s} />
                  </label>
                ))}
                {activeStatuses.length > 0 && <button onClick={() => setActiveStatuses([])} className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium">Clear all</button>}
              </div>
            )}
          </div>

          {/* Active chips */}
          {activeStatuses.map(s => (
            <span key={s} className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-lg text-xs font-medium">
              {s}
              <button onClick={() => removeStatus(s)} className="p-0.5 rounded hover:bg-violet-100 hover:text-violet-900 transition-colors">×</button>
            </span>
          ))}
        </div>

        {/* ── Table view ── */}
        {viewMode === "table" && (
          isLoading ? (
            <div className="flex justify-center items-center h-52">
              <div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l4 4" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700">No records found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search or <button onClick={resetFilters} className="text-violet-500 hover:underline font-medium">filter criteria</button>.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id} className="border-b border-gray-100">
                      {hg.headers.map(h => (
                        <th key={h.id} className="px-4 py-3 text-left bg-gray-50/70 first:pl-5 last:pr-5"
                          style={{ width: h.getSize() !== 150 ? h.getSize() : undefined }}>
                          {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50/60 transition-colors duration-100 group">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3.5 first:pl-5 last:pr-5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* ── Cards view ── */}
        {viewMode === "cards" && (
          <div className="p-5">
            {isLoading ? (
              <div className="flex justify-center items-center h-52">
                <div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-sm font-semibold text-gray-700">No records found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map((o, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{o.InvoiceNumber || `#${o.OrderID}`}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{o.OrderDate ? new Date(o.OrderDate).toLocaleDateString("en-GB") : "—"}</p>
                      </div>
                      <StatusBadge status={o.Status} />
                    </div>
                    <p className="text-xs text-gray-500 mb-3 truncate">{o.customer ? `${o.customer.firstname} ${o.customer.lastname}` : (o.CustomerName || "—")}</p>
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-base font-bold text-gray-900">
                        {new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 0 }).format(parseFloat(o.TotalAmount || o.Total || 0))}
                      </p>
                      <TableActionsRow actions={[
                        { label: "View", onClick: () => {} },
                        { label: "Edit", onClick: () => {} },
                        { label: "Delete", onClick: () => handleDelete(o), variant: "destructive" },
                      ]} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Pagination ── */}
        <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-gray-600">Showing <span className="font-semibold text-gray-900">{from}–{to}</span> of <span className="font-semibold text-gray-900">{totalRows}</span> records</span>
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-1.5">
              Rows per page
              <select value={pageSize} onChange={e => table.setPageSize(Number(e.target.value))}
                className="ml-1 border border-gray-200 rounded-md text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-200 bg-white text-gray-700">
                {[5, 10, 15, 20, 25, 50].map(s => <option key={s}>{s}</option>)}
              </select>
            </span>
          </div>

          <div className="flex items-center gap-0.5">
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              Previous
            </button>
            {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
              const start = Math.max(0, Math.min(pageIndex - 2, table.getPageCount() - 5));
              const pg = start + i;
              return (
                <button key={pg} onClick={() => table.setPageIndex(pg)}
                  className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${pg === pageIndex ? "bg-violet-600 text-white shadow-sm" : "hover:bg-gray-100 text-gray-600"}`}>
                  {pg + 1}
                </button>
              );
            })}
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              Next
            </button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Sales;
