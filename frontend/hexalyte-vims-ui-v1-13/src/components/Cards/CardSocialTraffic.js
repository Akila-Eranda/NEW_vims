import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
// Import your existing API functions
// import checkToken from "api/checkToken";
import { createAxiosInstance } from "api/axiosInstance";

export default function CardSocialTraffic() {
  const BASE_URL = "https://api.vims.hexalyte.com/v1/";
  const [salesOrderDetails, setSalesOrderDetails] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  async function fetchSalesOrderDetails() {
    try {
      setLoading(true);
      // Your existing API call code here
      const api = createAxiosInstance();
      const res = await api.get('salesorderdetails');
      console.log(res);
      if (res.status === 200) {
        setSalesOrderDetails(() => res.data.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProducts() {
    try {
      // Your existing API call code here
      const api = createAxiosInstance();
      const res = await api.get('product');
      console.log(res);
      if (res.status === 200) {
        setProducts(() => res.data.allProducts);
      }
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "No Products Found") {
        console.log("No Products Found");
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // if (checkToken()) {
      fetchSalesOrderDetails();
      fetchProducts();
    // } else {
    //   history.push('/auth/login');
    //   return;
    // }
  }, []);

  useEffect(() => {
    const productCount = {};

    salesOrderDetails.forEach(order => {
      const productId = order.ProductID;
      productCount[productId] = (productCount[productId] || 0) + 1;
    });

    const topProductIds = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([productId, count]) => ({ productId: Number(productId), count }));

    setTopProducts(() => [...topProductIds]);
  }, [salesOrderDetails]);

  const getRankBadgeColor = (index) => {
    switch (index) {
      case 0:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Gold
      case 1:
        return 'bg-gray-100 text-gray-800 border-gray-200'; // Silver
      case 2:
        return 'bg-orange-100 text-orange-800 border-orange-200'; // Bronze
      case 3:
        return 'bg-blue-100 text-blue-800 border-blue-200'; // 4th place
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return (
          <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
        );
      case 1:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 2:
        return (
          <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case 3:
        return <span className="text-sm font-semibold text-blue-700">4</span>;
      default:
        return <span className="text-sm font-semibold">#{index + 1}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
              TOP SELLING PRODUCTS
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Best performing products by sales volume
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live data</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-teal-600 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-4 h-4 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : topProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Sales Data</h3>
            <p className="text-sm text-gray-500">No product sales data available at the moment.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((topProduct, index) => {
                const productName = products.find((product) => 
                  product.ProductID.toString() === topProduct.productId.toString()
                )?.Name || 'Unknown Product';

                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank Badge */}
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${getRankBadgeColor(index)}`}>
                        {getRankIcon(index)}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {productName}
                          </h3>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                            ID: {topProduct.productId}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Product ranking based on sales volume
                        </p>
                      </div>
                    </div>

                    {/* Sales Count */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {topProduct.count}
                      </div>
                      <div className="text-xs text-gray-500">
                        items sold
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {topProducts.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Top {topProducts.length} products displayed</span>
            <span>Updated: {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
        </div>
      )}
    </div>
  );
}