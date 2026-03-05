// src/app/wishlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getGuestWishlist,
  clearGuestWishlist,
  removeFromGuestWishlist,
  GuestWishlistItem,
} from "@/lib/guestStorage";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice: number | null;
    images: string[];
    category: string;
  };
}

const guestToWishlistItem = (g: GuestWishlistItem): WishlistItem => ({
  id: g.productId,
  product: {
    id: g.productId,
    name: g.name,
    price: g.price,
    discountPrice: g.discountPrice,
    images: g.images,
    category: g.category,
  },
});

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/wishlist?userId=${session.user.id}`);
      const data = await res.json();
      setWishlistItems(data);
    } catch {
      console.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      // Guest: load from localStorage
      setWishlistItems(getGuestWishlist().map(guestToWishlistItem));
      setLoading(false);
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      // Sync any guest wishlist items first, then fetch
      const guestList = getGuestWishlist();
      if (guestList.length > 0) {
        Promise.all(
          guestList.map((item) =>
            fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: session.user.id, productId: item.productId }),
            })
          )
        ).then(() => {
          clearGuestWishlist();
          fetchWishlist();
        });
      } else {
        fetchWishlist();
      }
    }
  }, [status, session?.user?.id]);

  // Remove Item
  const removeItem = async (productId: string) => {
    if (!session?.user?.id) {
      // Guest: remove from localStorage
      removeFromGuestWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, productId }),
      });
      setWishlistItems((prev) => prev.filter((item) => item.product.id !== productId));
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#B98E75]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Header */}
      <div className="bg-stone-50 py-12 sm:py-16 text-center mb-8 sm:mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-2 px-4">My Wishlist</h1>
        <p className="text-stone-500 text-xs sm:text-sm px-4">Your curated collection of favorites.</p>
      </div>

      <div className="container max-w-6xl mx-auto px-4">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 sm:py-20 border border-dashed border-stone-200 rounded-xl mx-4">
            <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-stone-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-serif text-stone-900 mb-2">Your wishlist is empty</h3>
            <p className="text-sm sm:text-base text-stone-500 mb-4 sm:mb-6 px-4">Explore our collections and save your favorites here.</p>
            <Link href="/collections">
              <Button className="bg-stone-900 text-white hover:bg-[#B98E75]">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {wishlistItems.map((item) => {
              const product = item.product;
              return (
                <div key={item.id} className="group relative">
                  
                  {/* Image */}
                  <div className="aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden relative mb-4">
                    <img 
                      src={product.images[0] || "/placeholder.jpg"} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => removeItem(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-stone-500 hover:text-red-500 hover:bg-white transition shadow-sm"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="text-center space-y-2">
                    <h3 className="font-serif text-lg text-stone-900">{product.name}</h3>
                    <p className="text-sm font-bold text-[#B98E75]">Rs. {Number(product.price).toLocaleString()}</p>
                    
                    <div className="pt-2">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" className="w-full border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-all text-xs uppercase font-bold tracking-wider">
                          View Product
                        </Button>
                      </Link>
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