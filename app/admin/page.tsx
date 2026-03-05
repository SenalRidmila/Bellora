// src/app/admin/page.tsx
"use client";

import Link from "next/link";
import { DollarSign, ShoppingBag, Users, TrendingUp, ClipboardList, ArrowRight, Package } from "lucide-react";
import { useEffect, useState } from "react";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockCount: number;
  todayRevenue: number;
  todayOrders: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    todayRevenue: 0,
    todayOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [customRequestsCount, setCustomRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch("/api/admin/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch recent orders
      const ordersRes = await fetch("/api/admin/recent-orders");
      const ordersData = await ordersRes.json();
      setRecentOrders(ordersData);

      // Fetch custom requests count
      const customRes = await fetch("/api/custom-requests");
      const customData = await customRes.json();
      setCustomRequestsCount(customData.length || 0);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
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
        <div className="text-stone-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      
      {/* --- PAGE HEADER & ACTION BUTTON --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-stone-500 mt-1 sm:mt-2">Welcome to Bellora Admin Panel</p>
        </div>

        <Link href="/admin/custom-orders">
          <button className="bg-[#B98E75] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#a67c63] transition shadow-lg shadow-orange-100 w-full sm:w-auto">
            <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-bold uppercase tracking-wide text-xs">View Custom Orders</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </Link>
      </div>

      {/* 1. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-stone-500 text-xs sm:text-sm font-medium">Total Revenue</span>
            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
            Rs. {stats.totalRevenue.toLocaleString()}
          </h3>
          <span className="text-[10px] sm:text-xs text-green-600 flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" /> Today Rs. {stats.todayRevenue.toLocaleString()}
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-stone-500 text-xs sm:text-sm font-medium">Total Orders</span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">{stats.totalOrders}</h3>
          <span className="text-[10px] sm:text-xs text-stone-400 mt-2 block">
            Pending: {stats.pendingOrders} | Today: {stats.todayOrders}
          </span>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-stone-500 text-sm font-medium">Low Stock</span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-stone-900">{stats.lowStockCount}</h3>
          <span className="text-xs text-amber-600 flex items-center gap-1 mt-2">
            Needs Attention
          </span>
        </div>

        {/* Custom Inquiries Stats */}
        <div className="bg-stone-900 p-6 rounded-xl border border-stone-900 shadow-sm text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-stone-400 text-sm font-medium">Custom Inquiries</span>
            <div className="p-2 bg-stone-800 text-[#B98E75] rounded-lg">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">{customRequestsCount}</h3>
          <span className="text-xs text-stone-400 mt-2 block">Needs Attention</span>
        </div>

      </div>

      {/* 2. RECENT ORDERS TABLE */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-bold text-base sm:text-lg text-stone-800">Recent Orders</h3>
          <Link href="/admin/orders" className="text-[#B98E75] hover:underline text-xs sm:text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="p-6 text-center text-stone-500 text-sm">No orders</div>
          ) : (
            <table className="w-full text-xs sm:text-sm text-left min-w-[600px]">
              <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Order ID</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Customer</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Date</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium">#{order.id.slice(0, 8)}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">{order.customerName}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">{formatDate(order.createdAt)}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`${getStatusColor(order.status)} px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right font-medium">
                      Rs. {Number(order.totalAmount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}