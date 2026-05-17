import { useMemo, useState } from "react";
import { Combobox } from "@headlessui/react";

export default function SearchableSalesOrderSelect({
  salesOrders1,
  customers,
  warehouses,
  formData,
  setFormData,
  errors = {},
  label = "Sales Order *",
  placeholder = "Search sales orders…",
}) {
  const [query, setQuery] = useState("");

  // Fast lookup maps
  const customerMap = useMemo(() => {
    const map = {};
    customers?.forEach((c) => {
      // adjust keys to your exact API fields
      map[c.CustomerID] = c.Name || c.CustomerName || c.name || "Unknown";
    });
    return map;
  }, [customers]);

  const warehouseMap = useMemo(() => {
    const map = {};
    warehouses?.forEach((w) => {
      map[w.LocationID] = w.WarehouseName || w.Name || "Unknown";
    });
    return map;
  }, [warehouses]);

  // Build enriched options once
  const options = useMemo(() => {
    return (salesOrders1 || []).map((o) => {
      const customerName = customerMap[o.CustomerID] || "Unknown";
      const locationName = warehouseMap[o.LocationID] || "Unknown";
      const label = `#${o.OrderID} • ${customerName} • ${locationName} • ${o.Status}`;
      return {
        value: String(o.OrderID),
        label,
        _customer: customerName,
        _location: locationName,
        _status: o.Status || "",
      };
    });
  }, [salesOrders1, customerMap, warehouseMap]);

  // Filter by free-text query across useful fields
  const filtered =
    query.trim() === ""
      ? options
      : options.filter((opt) => {
          const q = query.toLowerCase();
          return (
            opt.label.toLowerCase().includes(q) ||
            opt._customer.toLowerCase().includes(q) ||
            opt._location.toLowerCase().includes(q) ||
            opt._status.toLowerCase().includes(q)
          );
        });

  // current selected value
  const selected =
    options.find((o) => o.value === String(formData.SalesOrderID || "")) ||
    null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <Combobox
        value={selected}
        onChange={(opt) => {
          const value = opt?.value ?? "";
          setFormData({ ...formData, SalesOrderID: value });

          // clear field error if present
          if (errors.SalesOrderID) {
            const newErrors = { ...errors };
            delete newErrors.SalesOrderID;
            // If you pass setErrors from parent, use it here. Otherwise remove this.
            // setErrors(newErrors);
          }
        }}
      >
        <div className="relative">
          <Combobox.Input
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.SalesOrderID ? "border-red-300" : "border-gray-300"
            }`}
            displayValue={(opt) => opt?.label || ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
          />

          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg focus:outline-none">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No results
              </div>
            ) : (
              filtered.map((opt) => (
                <Combobox.Option
                  key={opt.value}
                  value={opt}
                  className={({ active }) =>
                    `cursor-pointer select-none px-3 py-2 text-sm ${
                      active ? "bg-blue-50 text-blue-700" : "text-gray-800"
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{opt.label}</span>
                      {selected && (
                        <span className="text-xs text-blue-600">Selected</span>
                      )}
                    </div>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>

      {errors.SalesOrderID && (
        <p className="mt-1 text-sm text-red-600">{errors.SalesOrderID}</p>
      )}
    </div>
  );
}
