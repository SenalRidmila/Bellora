// src/app/admin/customers/page.tsx
"use client";

import { useEffect, useState, Fragment } from "react";
import { Loader2, User, ShoppingBag, DollarSign, ChevronDown, ChevronUp } from "lucide-react";

interface Customer {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

interface CustomerOrder {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: {
    productName: string;
    quantity: number;
  }[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [customerOrders, setCustomerOrders] = useState<{ [key: string]: CustomerOrder[] }>({});
  const [loadingOrders, setLoadingOrders] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (customerId: string) => {
    if (expandedCustomerId === customerId) {
      setExpandedCustomerId(null);
      return;
    }

    setExpandedCustomerId(customerId);

    // Fetch orders if not already loaded
    if (!customerOrders[customerId]) {
      setLoadingOrders(customerId);
      try {
        const res = await fetch(`/api/admin/customers/${customerId}/orders`);
        const data = await res.json();
        setCustomerOrders({ ...customerOrders, [customerId]: data });
      } catch (error) {
        console.error("Error fetching customer orders:", error);
      } finally {
        setLoadingOrders(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700";
      case "SHIPPED":
        return "bg-purple-100 text-purple-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#B98E75] mx-auto" />
          <p className="text-stone-500 mt-2">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-stone-900">Customer Management</h1>
        <p className="text-stone-500 mt-1">View all customers and their orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone-500 text-sm font-medium">Total Customers</span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <User className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-stone-900">{customers.length}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone-500 text-sm font-medium">Total Orders</span>
            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-stone-900">
            {customers.reduce((sum, c) => sum + c.orderCount, 0)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone-500 text-sm font-medium">Total Revenue</span>
            <div className="p-2 bg-[#B98E75]/20 text-[#B98E75] rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-stone-900">
            Rs. {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Customers Table */}
      {customers.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-stone-300 rounded-xl">
          <p className="text-stone-400">No customers found</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4 text-right">Total Spent</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {customers.map((customer) => (
                <Fragment key={customer.id}>
                  {/* Main Customer Row */}
                  <tr 
                    className="hover:bg-stone-50/50 transition cursor-pointer"
                    onClick={() => toggleExpand(customer.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#B98E75] text-white rounded-full flex items-center justify-center font-bold">
                          {customer.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="font-medium text-stone-800">{customer.name || "No name"}</div>
                          <div className="text-xs text-stone-500">ID: {customer.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">{customer.email || "No email"}</td>
                    <td className="px-6 py-4 text-stone-500">{formatDate(customer.createdAt)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        {customer.orderCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-stone-900">
                      Rs. {customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-stone-400 hover:text-[#B98E75]">
                        {expandedCustomerId === customer.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Orders Row */}
                  {expandedCustomerId === customer.id && (
                    <tr className="bg-stone-50/50">
                      <td colSpan={6} className="px-6 py-4">
                        {loadingOrders === customer.id ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-[#B98E75]" />
                          </div>
                        ) : customerOrders[customer.id]?.length === 0 ? (
                          <div className="text-center py-8 text-stone-500">No orders</div>
                        ) : (
                          <div className="bg-white border border-stone-100 rounded-lg p-4">
                            <h4 className="font-bold text-stone-800 mb-3">Order History</h4>
                            <div className="space-y-3">
                              {customerOrders[customer.id]?.map((order) => (
                                <div
                                  key={order.id}
                                  className="flex justify-between items-center p-3 bg-stone-50 rounded-lg border border-stone-100"
                                >
                                  <div className="flex-1">
                                    <div className="font-medium text-stone-900">
                                      #{order.id.slice(-6).toUpperCase()}
                                    </div>
                                    <div className="text-xs text-stone-500 mt-1">
                                      {order.items.map((item, idx) => (
                                        <span key={`${order.id}-item-${idx}`}>
                                          {item.productName} (x{item.quantity})
                                          {idx < order.items.length - 1 && ", "}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-xs text-stone-500">
                                      {formatDate(order.createdAt)}
                                    </span>
                                    <span className={`${getStatusColor(order.status)} px-3 py-1 rounded-full text-[10px] font-bold uppercase`}>
                                      {order.status}
                                    </span>
                                    <span className="font-bold text-stone-900">
                                      Rs. {Number(order.totalAmount).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
