import axios from "axios";
import Swal from "sweetalert2";
import printHandler from "components/Invoice/PrintReceipt";
import { createAxiosInstance } from "api/axiosInstance";
import { printB4Invoice, printThermalSalesOrder } from "./thermalPrint";

const BASE_URL = "https://api.vims.hexalyte.com/v1/";

async function handlePrint(row) {
  if (!row.CustomerID) {
    Swal.fire({
      title: 'Customer ID Error',
      icon: 'error'
    });
    return;
  }

  const customerID = row.CustomerID;
  const orderID = row.OrderID;

  try {
    // Show loading alert
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // const CustomerInfoRes = await axios.get(`${BASE_URL}customer/${customerID}`, { withCredentials: true });
    // const CustomerAddressRes = await axios.get(`${BASE_URL}customeraddress/${customerID}`, { withCredentials: true });
    // const orderItemsRes = await axios.get(`${BASE_URL}salesorderdetails/${orderID}`, { withCredentials: true });
    // const productsRs = await axios.get(`${BASE_URL}product`, { withCredentials: true });

    const CustomerInfoRes = await createAxiosInstance().get(`customer/${customerID}`)
    const CustomerAddressRes = await createAxiosInstance().get(`customeraddress/${customerID}`)
    const orderItemsRes = await createAxiosInstance().get(`salesorderdetails/${orderID}`)
    const productsRs = await createAxiosInstance().get('product')

    Swal.close();

    // console.log(CustomerInfoRes.data.customer);
    // console.log(CustomerAddressRes.data.customerAddress);
    // console.log(orderItemsRes.data.data);
    // console.log(productsRs.data.allProducts);

    // setCustomerInfo(() => CustomerInfoRes.data.customer)
    // setCustomerAddress(() => CustomerAddressRes.data.customerAddress)
    // setOrderItems(() => orderItemsRes.data.data)

    const customerInfo = CustomerInfoRes.data.customer
    const customerAddress = CustomerAddressRes.data.customerAddress
    const orderItems = orderItemsRes.data.data
    const products = productsRs.data.allProducts

    // printHandler(row, orderItems, customerInfo, customerAddress, products)

    // printHandler(row, orderItems, customerInfo, customerAddress, products)

    // console.log({ customerInfo, customerAddress, orderItems, products })

    printThermalSalesOrder({ customerInfo, customerAddress, orderItems, products })

  } catch (error) {
    Swal.close();
    console.error(error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to fetch data.',
      icon: 'error'
    });
  }
}

export default handlePrint