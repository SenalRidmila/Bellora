"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Package, Truck, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string | null;
  selectedSize: string | null;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/orders");
    }
  }, [status, router]);

  // Fetch Orders
  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  // Get status icon and color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PENDING":
        return { icon: <Package className="h-5 w-5" />, color: "text-yellow-600", bg: "bg-yellow-50", label: "Pending" };
      case "PROCESSING":
        return { icon: <Loader2 className="h-5 w-5 animate-spin" />, color: "text-blue-600", bg: "bg-blue-50", label: "Processing" };
      case "SHIPPED":
        return { icon: <Truck className="h-5 w-5" />, color: "text-purple-600", bg: "bg-purple-50", label: "Shipped" };
      case "DELIVERED":
        return { icon: <CheckCircle className="h-5 w-5" />, color: "text-green-600", bg: "bg-green-50", label: "Delivered" };
      case "CANCELLED":
        return { icon: <XCircle className="h-5 w-5" />, color: "text-red-600", bg: "bg-red-50", label: "Cancelled" };
      default:
        return { icon: <Package className="h-5 w-5" />, color: "text-gray-600", bg: "bg-gray-50", label: status };
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#B98E75]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 text-stone-600 hover:text-[#B98E75]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="font-serif text-4xl text-stone-800 mb-2">My Orders</h1>
          <p className="text-stone-600">Track and view your order history</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-12 text-center">
            <Package className="h-16 w-16 text-stone-300 mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-stone-800 mb-2">No Orders Yet</h2>
            <p className="text-stone-600 mb-6">You haven't placed any orders yet</p>
            <Link href="/collections">
              <Button className="bg-[#B98E75] hover:bg-[#A67D66] text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusDisplay = getStatusDisplay(order.status);
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-stone-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-stone-500">Order ID</p>
                      <p className="font-mono text-sm text-stone-800">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">Order Date</p>
                      <p className="text-sm text-stone-800">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-500 mb-1">Status</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusDisplay.bg}`}>
                        <span className={statusDisplay.color}>{statusDisplay.icon}</span>
                        <span className={`text-sm font-medium ${statusDisplay.color}`}>
                          {statusDisplay.label}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">Total Amount</p>
                      <p className="text-lg font-bold text-[#B98E75]">
                        Rs. {Number(order.totalAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h3 className="font-serif text-lg text-stone-800 mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-stone-100 last:border-0">
                          {/* Product Image */}
                          <Link href={`/products/${item.product.id}`}>
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 hover:opacity-75 transition-opacity">
                              <img
                                src={item.productImage || item.product.images[0] || "/placeholder.png"}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <Link href={`/products/${item.product.id}`}>
                              <h4 className="font-medium text-stone-800 hover:text-[#B98E75] transition-colors">
                                {item.productName}
                              </h4>
                            </Link>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-stone-600">
                              <span>Quantity: {item.quantity}</span>
                              {item.selectedSize && (
                                <>
                                  <span className="text-stone-300">•</span>
                                  <span>Size: {item.selectedSize}</span>
                                </>
                              )}
                            </div>
                            <p className="text-sm font-medium text-stone-800 mt-2">
                              Rs. {Number(item.price).toLocaleString()} × {item.quantity}
                            </p>
                          </div>

                          {/* Item Subtotal */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm text-stone-500">Subtotal</p>
                            <p className="font-bold text-stone-800">
                              Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Details */}
                    <Separator className="my-6" />
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-stone-800 mb-3">Shipping Address</h4>
                        <div className="text-sm text-stone-600 space-y-1">
                          <p className="font-medium text-stone-800">{order.customerName}</p>
                          <p>{order.address}</p>
                          <p>{order.phone}</p>
                          <p>{order.email}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-stone-800 mb-3">Payment Status</h4>
                        <div className="text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full ${
                            order.paymentStatus === "PAID" 
                              ? "bg-green-50 text-green-700" 
                              : "bg-yellow-50 text-yellow-700"
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
