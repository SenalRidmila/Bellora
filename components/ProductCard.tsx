// src/components/ProductCard.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ShoppingBag } from "lucide-react";
import {
  addToGuestCart,
  isInGuestWishlist,
  toggleGuestWishlist,
} from "@/lib/guestStorage";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string | number;
    discountPrice?: string | number | null;
    category: string;
    images: string[];
    status?: string;
    createdAt?: string; // දිනය check කරන්න මේක ඕනේ
  };
  hideNewBadge?: boolean; // New Badge එක හංගන්න ඕන නම් true කරන්න
}

export default function ProductCard({ product, hideNewBadge = false }: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Component load වෙද්දි wishlist check
  useEffect(() => {
    if (session?.user?.id) {
      // Logged in: API check
      const checkWishlist = async () => {
        try {
          const res = await fetch(`/api/wishlist?userId=${session.user.id}`);
          if (res.ok) {
            const wishlistItems = await res.json();
            setIsInWishlist(wishlistItems.some((item: any) => item.productId === product.id));
          }
        } catch {}
      };
      checkWishlist();
    } else {
      // Guest: localStorage check
      setIsInWishlist(isInGuestWishlist(product.id));
    }
  }, [product.id, session]);
  
  // දවස් 30 කට වඩා අලුත්ද කියලා බලන function එක
  const isNewItem = () => {
    if (!product.createdAt) return false; 
    const created = new Date(product.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 30; // දවස් 30ට අඩු නම් true
  };

  // Wishlist එකට එකතු කරන්න / Remove කරන්න (Toggle)
  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Guest: localStorage-ෙ save
    if (!session?.user?.id) {
      const added = toggleGuestWishlist({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        images: product.images,
        category: product.category,
      });
      setIsInWishlist(added);
      return;
    }

    setIsLoading(true);

    console.log("🔥 Wishlist button clicked for product:", product.id);
    
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, productId: product.id }),
      });
      
      console.log("📡 API Response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("✅ API Response data:", data);
        // Toggle කරන්න - added නම් true, removed නම් false
        setIsInWishlist(data.added);
      } else {
        console.error("❌ API Error:", await res.text());
      }
    } catch (error) {
      console.error("❌ Error updating wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cart එකට එකතු කරන්න
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Guest: localStorage-ෙ save
    if (!session?.user?.id) {
      addToGuestCart({
        productId: product.id,
        quantity: 1,
        name: product.name,
        price: Number(product.price),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        images: product.images,
        category: product.category,
      });
      setIsAddingToCart(true);
      setTimeout(() => setIsAddingToCart(false), 1200);
      return;
    }

    setIsAddingToCart(true);

    console.log("🛒 Add to cart clicked:", product.id);
    
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: session.user.id, 
          productId: product.id,
          quantity: 1
        }),
      });
      
      console.log("📡 Cart API Response:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Cart Response:", data);
        // Automatically refresh navbar cart count
      } else {
        console.error("❌ Cart Error:", await res.text());
      }
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Badge එක පෙන්වන්නේ: (හංගන්න කියලා නැත්නම්) සහ (අලුත් බඩුවක් නම්) විතරයි
  const showNewBadge = !hideNewBadge && isNewItem();

  return (
    <div className="group cursor-pointer">
      
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-4">
        
        <Link href={`/products/${product.id}`}>
          <Image 
            src={product.images[0] || "/placeholder.jpg"} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            quality={75}
          />
        </Link>

        {/* --- NEW BADGE LOGIC --- */}
        {showNewBadge && (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider px-3 py-1 z-10">
            New
          </span>
        )}
        
        {/* Sale Badge Position Adjustment */}
        {product.discountPrice && (
          <span className={`absolute top-4 bg-[#B98E75] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 z-10 ${showNewBadge ? 'left-16 ml-2' : 'left-4'}`}>
            Sale
          </span>
        )}

        <button 
          onClick={handleWishlistClick}
          disabled={isLoading}
          className={`absolute top-4 right-4 p-2 bg-white rounded-full transition-all hover:scale-110 hover:text-[#B98E75] z-10 disabled:opacity-50 shadow-md ${
            isInWishlist ? 'opacity-100 shadow-lg' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
          }`}
          title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart 
            className={`h-4 w-4 transition-all ${isInWishlist ? 'fill-[#B98E75] text-[#B98E75]' : ''}`} 
          />
        </button>

        {/* Action Buttons */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent flex flex-col gap-2 z-20">
          <Button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-white text-stone-900 hover:bg-stone-100 rounded-none uppercase text-[10px] font-bold tracking-widest h-10 gap-2 disabled:opacity-50"
          >
            <ShoppingCart className="h-3 w-3" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>

          <Link href={`/products/${product.id}`} className="w-full">
            <Button className="w-full bg-[#B98E75] text-white hover:bg-[#a67c63] rounded-none uppercase text-[10px] font-bold tracking-widest h-10 gap-2">
              <ShoppingBag className="h-3 w-3" />
              Buy Now
            </Button>
          </Link>
        </div>
      </div>

      <Link href={`/products/${product.id}`}>
        <div className="text-center space-y-1">
          <p className="text-xs text-stone-500 uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-serif text-lg text-stone-900 group-hover:text-[#B98E75] transition-colors">
            {product.name}
          </h3>
          
          <div className="flex justify-center gap-2 text-sm font-medium text-stone-900">
            {product.discountPrice ? (
              <>
                <span className="text-[#B98E75]">Rs. {Number(product.discountPrice).toLocaleString()}</span>
                <span className="text-stone-400 line-through decoration-1">Rs. {Number(product.price).toLocaleString()}</span>
              </>
            ) : (
              <span>Rs. {Number(product.price).toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>

    </div>
  );
}