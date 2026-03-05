// src/app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, MapPin, Phone, Mail, ChevronDown, ChevronUp, Printer } from "lucide-react";

// Types definition based on your new Schema
interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: string; // Decimal comes as string from JSON often
  selectedSize: string;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  totalAmount: string; // Decimal
  status: string; // Enum
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update local state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const printInvoice = (order: Order) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.selectedSize}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${Number(item.price).toLocaleString()}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${(Number(item.price) * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.id.slice(-6).toUpperCase()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BELLORA</h1>
            <h2>Invoice</h2>
            <p>Order #${order.id.slice(-6).toUpperCase()}</p>
            <p>${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div class="info">
            <h3>Customer Details:</h3>
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Address:</strong> ${order.address}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Size</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="total">
            Total Amount: Rs. ${Number(order.totalAmount).toLocaleString()}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  // Helper to format price
  const formatPrice = (amount: string | number) => {
    return `Rs. ${Number(amount).toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "PROCESSING": return "bg-blue-100 text-blue-800";
      case "SHIPPED": return "bg-purple-100 text-purple-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = [
    { value: "PENDING", label: "Pending", color: "yellow" },
    { value: "PROCESSING", label: "Processing", color: "blue" },
    { value: "SHIPPED", label: "Shipped", color: "purple" },
    { value: "DELIVERED", label: "Delivered", color: "green" },
    { value: "CANCELLED", label: "Cancelled", color: "red" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-stone-900">Orders Management</h1>
        <p className="text-stone-500 mt-1">View and manage all orders</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#B98E75]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-stone-300 rounded-xl">
          <p className="text-stone-400">No orders found yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order) => (
                <>
                  {/* Main Order Row */}
                  <tr key={order.id} className="hover:bg-stone-50/50 transition cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <td className="px-6 py-4 font-medium text-stone-900">
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-stone-800">{order.customerName}</div>
                      <div className="text-xs text-stone-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-stone-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-stone-400 hover:text-[#B98E75]">
                        {expandedOrderId === order.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Details Row */}
                  {expandedOrderId === order.id && (
                    <tr className="bg-stone-50/50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white border border-stone-100 rounded-lg shadow-sm">
                            
                            {/* Left: Customer & Shipping Info */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">Shipping Details</h4>
                              <div className="text-sm text-stone-600 space-y-2">
                                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#B98E75]" /> {order.address}</p>
                                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#B98E75]" /> {order.phone}</p>
                                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#B98E75]" /> {order.email}</p>
                              </div>
                              <div className="pt-2">
                                <span className="text-xs font-bold bg-stone-100 px-2 py-1 rounded text-stone-500">
                                  Payment: {order.paymentStatus}
                                </span>
                              </div>
                            </div>

                            {/* Right: Order Items */}
                            <div>
                              <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-3">Items Purchased</h4>
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex justify-between text-sm border-b border-stone-50 pb-2 last:border-0">
                                    <div className="flex items-center gap-2">
                                      <Package className="h-3 w-3 text-stone-400" />
                                      <div>
                                        <span className="text-stone-700 block">{item.productName}</span>
                                        <span className="text-[10px] text-stone-400">Size: {item.selectedSize}</span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-stone-900 font-medium block">{formatPrice(Number(item.price) * item.quantity)}</span>
                                      <span className="text-[10px] text-stone-400">Qty: {item.quantity}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col md:flex-row gap-4 p-4 bg-white border border-stone-100 rounded-lg">
                            <div className="flex-1">
                              <label className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-2 block">
                                Change Status
                              </label>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                disabled={updatingStatus === order.id}
                                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B98E75] disabled:opacity-50"
                              >
                                {statusOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-end">
                              <button
                                onClick={() => printInvoice(order)}
                                className="bg-stone-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-stone-800 transition"
                              >
                                <Printer className="h-4 w-4" />
                                <span>Print Invoice</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}