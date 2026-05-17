const PaymentActionButton = ({ order, updatePaymentStatus, orderType }) => {

    // const currentStatus = order.Status?.toLowerCase() || order.PaymentStatus?.toLowerCase();

    let currentStatus = order.Status?.toLowerCase()

    if (orderType === "SalesOrder") {
        currentStatus = order.PaymentStatus?.toLowerCase();

    }
    
    return (
      <div className="flex space-x-1">
        {currentStatus === "paid" && (
          <button
            className="bg-green-500 text-white rounded px-2 py-1 text-xs hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              updatePaymentStatus(order.OrderID, "paid");
            }}
            title="Mark as Paid"
            disabled
          >
            Paid
          </button>
        )}
        {currentStatus === "unpaid" && (
          <button
            className="bg-red-500 text-white rounded px-2 py-1 text-xs hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              updatePaymentStatus(order, "unpaid");
            }}
            title="Mark as Unpaid"
          >
            Unpaid
          </button>
        )}
      </div>
    );
  };

  export default PaymentActionButton