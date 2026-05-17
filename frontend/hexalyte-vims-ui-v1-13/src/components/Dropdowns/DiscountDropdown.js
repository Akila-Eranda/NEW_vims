import { useState, useRef, useEffect } from "react";

const DiscountDropdown = ({
    availableDiscounts, // Array of discount objects from database
    salesOrder,
    setSalesOrder,
    disabled
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredDiscounts, setFilteredDiscounts] = useState([]);
    const [discountType, setDiscountType] = useState('percentage'); // 'percentage' or 'amount'
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Helper function to parse discount amount and determine type
    const parseDiscountAmount = (amountString) => {
        const amount = amountString.toString().trim();
        if (amount.includes('%')) {
            return {
                type: 'percentage',
                value: parseFloat(amount.replace('%', '').trim()),
                displayValue: amount
            };
        } else if (amount.includes('LKR')) {
            return {
                type: 'amount',
                value: parseFloat(amount.replace('LKR', '').trim()),
                displayValue: amount
            };
        }
        // Fallback - try to detect by checking if it's a small number (likely percentage)
        const numValue = parseFloat(amount);
        if (numValue <= 100) {
            return {
                type: 'percentage',
                value: numValue,
                displayValue: `${numValue}%`
            };
        } else {
            return {
                type: 'amount',
                value: numValue,
                displayValue: `${numValue} LKR`
            };
        }
    };

    // Filter discounts based on search term and type
    useEffect(() => {
        if (!availableDiscounts || availableDiscounts.length === 0) {
            setFilteredDiscounts([]);
            return;
        }

        const processedDiscounts = availableDiscounts.map(discount => ({
            ...discount,
            parsed: parseDiscountAmount(discount.Amount)
        }));

        if (!searchTerm) {
            const typeFiltered = processedDiscounts.filter(discount =>
                discount.parsed.type === discountType && discount.isActive
            );
            setFilteredDiscounts(typeFiltered);
            return;
        }

        const filtered = processedDiscounts.filter(discount => {
            if (discount.parsed.type !== discountType || !discount.isActive) return false;

            const searchLower = searchTerm.toLowerCase();
            return (
                discount.Amount.toLowerCase().includes(searchLower) ||
                discount.parsed.value.toString().includes(searchLower) ||
                discount.DiscountID.toString().includes(searchLower)
            );
        });

        setFilteredDiscounts(filtered);
    }, [searchTerm, availableDiscounts, discountType]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDiscountSelect = (discount) => {
        // Calculate actual discount amount based on type
        const calculateDiscountAmount = (discountData, orderTotal) => {
            if (discountData.parsed.type === 'percentage') {
                // Calculate percentage of order total
                return (orderTotal * discountData.parsed.value) / 100;
            } else {
                // Fixed amount discount
                return discountData.parsed.value;
            }
        };

        // Get current order total (you may need to adjust this based on your salesOrder structure)
        const orderTotal = salesOrder.TotalAmount;
        const discountAmount = calculateDiscountAmount(discount, orderTotal);

        setSalesOrder(so => ({
            ...so,
            DiscountID: discount.DiscountID,
            Discount:  discountAmount,
            // DiscountType: discount.parsed.type,
            // DiscountValue: discount.parsed.value // Store original percentage/amount value
        }));

        // Set the search term to the selected discount amount
        setSearchTerm(discount.Amount);
        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsOpen(true);

        // If input is cleared, reset the discount selection
        if (!value) {
            setSalesOrder(so => ({
                ...so,
                DiscountID: null,
                Discount: 0,
                DiscountType: null,
                DiscountValue: null
            }));
        }
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleTypeChange = (newType) => {
        setDiscountType(newType);
        // Clear current selection when changing type
        setSearchTerm('');
        setSalesOrder(so => ({
            ...so,
            DiscountID: null,
            Discount: 0,
            DiscountType: null,
            DiscountValue: null
        }));
    };

    const clearSelection = () => {
        setSearchTerm('');
        setSalesOrder(so => ({
            ...so,
            DiscountID: null,
            Discount: 0,
            DiscountType: null,
            DiscountValue: null
        }));
        inputRef.current?.focus();
    };

    // Get current discount amount for display
    const selectedDiscount = availableDiscounts?.find(d => d.DiscountID === salesOrder.DiscountID);
    const displayValue = selectedDiscount ? selectedDiscount.Amount : searchTerm;

    // Recalculate discount when order total changes (for percentage discounts)
    useEffect(() => {
        if (salesOrder.DiscountID && salesOrder.DiscountType === 'percentage' && salesOrder.DiscountValue) {
            const orderTotal = salesOrder.total || salesOrder.subtotal || salesOrder.amount || 0;
            const calculatedDiscountAmount = (orderTotal * salesOrder.DiscountValue) / 100;
            
            // Only update if the calculated amount is different (avoid infinite loops)
            if (orderTotal > 0 && Math.abs((salesOrder.Discount || 0) - calculatedDiscountAmount) > 0.01) {
                setSalesOrder(prevSalesOrder => ({
                    ...prevSalesOrder,
                    Discount: calculatedDiscountAmount
                }));
            }
        }
    }, [salesOrder.total, salesOrder.subtotal, salesOrder.amount, salesOrder.DiscountID, salesOrder.DiscountType, salesOrder.DiscountValue, setSalesOrder]);

    // Reset search term when discount is cleared from outside
    useEffect(() => {
        if (!salesOrder.DiscountID) {
            setSearchTerm('');
        }
    }, [salesOrder.DiscountID]);

    return (
        <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
                Select Discount
            </label>

            <div className="flex items-center gap-2">
                {/* Compact Discount Type Toggle */}
                <div className="flex bg-gray-100 rounded-md p-0.5 flex-shrink-0">
                    <button
                        type="button"
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${discountType === 'percentage'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => handleTypeChange('percentage')}
                        disabled={disabled}
                    >
                        %
                    </button>
                    <button
                        type="button"
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${discountType === 'amount'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                        onClick={() => handleTypeChange('amount')}
                        disabled={disabled}
                    >
                        LKR
                    </button>
                </div>

                {/* Dropdown Input - Inline */}
                <div className="relative flex-1" ref={dropdownRef}>
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            className="block w-full pl-3 pr-10 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md transition duration-200 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder={disabled ? "Disabled" : `Search ${discountType === 'percentage' ? '%' : 'LKR'} discounts...`}
                            value={displayValue}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            disabled={disabled}
                            autoComplete="off"
                        />

                        {/* Clear button */}
                        {searchTerm && !disabled && (
                            <button
                                type="button"
                                className="absolute inset-y-0 right-8 flex items-center px-2 text-gray-400 hover:text-gray-600"
                                onClick={clearSelection}
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}

                        {/* Dropdown arrow */}
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Dropdown menu */}
                    {isOpen && !disabled && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredDiscounts.length > 0 ? (
                                filteredDiscounts.map((discount) => (
                                    <div
                                        key={discount.DiscountID}
                                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        onClick={() => handleDiscountSelect(discount)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">
                                                    Discount #{discount.DiscountID}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {discount.PurchaseOrders && discount.SalesOrders 
                                                        ? 'Valid for Purchase & Sales Orders'
                                                        : discount.PurchaseOrders 
                                                        ? 'Valid for Purchase Orders only'
                                                        : 'Valid for Sales Orders only'
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    Created: {new Date(discount.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="ml-4 text-right">
                                                <div className="text-sm font-medium text-green-600">
                                                    {discount.Amount}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {discount.isActive ? 'Active' : 'Inactive'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-center text-gray-500">
                                    {searchTerm
                                        ? `No ${discountType} discounts found matching your search`
                                        : `No ${discountType} discounts available`
                                    }
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscountDropdown;