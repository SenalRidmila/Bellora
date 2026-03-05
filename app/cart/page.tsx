// src/app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getGuestCart,
  clearGuestCart,
  removeFromGuestCart,
  updateGuestCartQuantity,
  GuestCartItem,
} from "@/lib/guestStorage";

interface CartItem {
  id: string;
  quantity: number;
  size: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice: number | null;
    images: string[];
    category: string;
  };
}

const guestToCartItem = (g: GuestCartItem): CartItem => ({
  id: g.productId,
  quantity: g.quantity,
  size: null,
  product: {
    id: g.productId,
    name: g.name,
    price: g.price,
    discountPrice: g.discountPrice,
    images: g.images,
    category: g.category,
  },
});

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/cart?userId=${session.user.id}`);
      const data = await res.json();
      setCartItems(data);
    } catch {
      console.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      // Guest: load from localStorage
      setCartItems(getGuestCart().map(guestToCartItem));
      setLoading(false);
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      // Sync any guest items first, then fetch
      const guestCart = getGuestCart();
      if (guestCart.length > 0) {
        Promise.all(
          guestCart.map((item) =>
            fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: session.user.id,
                productId: item.productId,
                quantity: item.quantity,
              }),
            })
          )
        ).then(() => {
          clearGuestCart();
          fetchCart();
        });
      } else {
        fetchCart();
      }
    }
  }, [status, session?.user?.id]);

  // Update Quantity
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    if (!session?.user?.id) {
      updateGuestCartQuantity(itemId, newQuantity);
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
      return;
    }
    try {
      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    } catch {}
  };

  // Remove Item
  const removeItem = async (itemId: string) => {
    if (!session?.user?.id) {
      removeFromGuestCart(itemId);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }
    try {
      await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch {}
  };

  // Calculate Total
  const calculateTotal = () =>
    cartItems.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + Number(price) * item.quantity;
    }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#B98E75]" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <ShoppingBag className="h-16 w-16 text-stone-300 mb-4" />
        <h1 className="font-serif text-2xl text-stone-900 mb-2">Your Cart is Empty</h1>
        <p className="text-stone-500 mb-6 text-center">Add some beautiful items to your cart!</p>
        <Link href="/collections">
          <Button className="bg-[#B98E75] hover:bg-[#a67c63] text-white rounded-none uppercase text-xs font-bold tracking-widest px-8 h-12">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/collections" className="inline-flex items-center gap-2 text-xs sm:text-sm text-stone-600 hover:text-[#B98E75] mb-4">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900">Shopping Cart</h1>
          <p className="text-stone-500 mt-2 text-sm sm:text-base">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cartItems.map((item) => {
              const price = item.product.discountPrice || item.product.price;
              return (
                <div key={item.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-stone-100 flex gap-3 sm:gap-4">
                  
                  {/* Product Image */}
                  <Link href={`/products/${item.product.id}`}>
                    <div className="w-20 sm:w-24 h-28 sm:h-32 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.images[0] || "/placeholder.jpg"} 
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="font-serif text-base sm:text-lg text-stone-900 hover:text-[#B98E75] transition-colors truncate">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider mt-1">
                        {item.product.category}
                      </p>
                      {item.size && (
                        <p className="text-xs sm:text-sm text-stone-600 mt-1 sm:mt-2">Size: {item.size}</p>
                      )}
                      <p className="text-base sm:text-lg font-medium text-stone-900 mt-1 sm:mt-2">
                        Rs. {Number(price).toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls - Mobile Optimized */}
                    <div className="flex items-center justify-between mt-3 sm:mt-4">
                      <div className="flex items-center gap-1 sm:gap-2 border border-stone-200 rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 sm:p-2 hover:bg-stone-50 transition-colors"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <span className="px-2 sm:px-4 font-medium text-sm sm:text-base">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 sm:p-2 hover:bg-stone-50 transition-colors"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 sm:p-2 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total - Hidden on very small screens, shown above on mobile */}
                  <div className="hidden sm:block text-right">
                    <p className="font-medium text-stone-900 text-sm sm:text-base">
                      Rs. {(Number(price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-stone-100 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 mb-4 sm:mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-stone-100">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="text-stone-900">Rs. {calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Shipping</span>
                  <span className="text-stone-900">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-medium mb-6">
                <span className="text-stone-900">Total</span>
                <span className="text-stone-900">Rs. {calculateTotal().toLocaleString()}</span>
              </div>

              <Button className="w-full bg-[#B98E75] hover:bg-[#a67c63] text-white rounded-none uppercase text-xs font-bold tracking-widest h-12 mb-3">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>

              <Link href="/collections">
                <Button variant="outline" className="w-full rounded-none uppercase text-xs font-bold tracking-widest h-12 border-stone-300 hover:bg-stone-50">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
