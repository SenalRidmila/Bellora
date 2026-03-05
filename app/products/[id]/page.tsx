"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, ShoppingBag, Heart, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  addToGuestCart,
  isInGuestWishlist,
  toggleGuestWishlist,
} from "@/lib/guestStorage";

interface Product {
  id: string;
  name: string;
  price: string | number;
  discountPrice?: string | number | null;
  description: string;
  images: string[];
  category: string;
  status: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  // Wishlist status check
  useEffect(() => {
    if (!product) return;
    if (session?.user?.id) {
      const check = async () => {
        try {
          const res = await fetch(`/api/wishlist?userId=${session.user.id}`);
          if (res.ok) {
            const items = await res.json();
            setIsInWishlist(items.some((item: any) => item.productId === product.id));
          }
        } catch {}
      };
      check();
    } else {
      // Guest: localStorage check
      setIsInWishlist(isInGuestWishlist(product.id));
    }
  }, [session, product]);

  const handleWishlist = async () => {
    if (!session?.user?.id) {
      // Guest: localStorage toggle
      const added = toggleGuestWishlist({
        productId: product!.id,
        name: product!.name,
        price: Number(product!.price),
        discountPrice: product!.discountPrice ? Number(product!.discountPrice) : null,
        images: product!.images,
        category: product!.category,
      });
      setIsInWishlist(added);
      return;
    }
    setWishlistLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, productId: product!.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsInWishlist(data.added);
      }
    } catch {}
    finally { setWishlistLoading(false); }
  };

  const handleAddToCart = async () => {
    if (!session?.user?.id) {
      // Guest: localStorage save
      addToGuestCart({
        productId: product!.id,
        quantity: 1,
        name: product!.name,
        price: Number(product!.price),
        discountPrice: product!.discountPrice ? Number(product!.discountPrice) : null,
        images: product!.images,
        category: product!.category,
      });
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 2500);
      return;
    }
    setCartLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, productId: product!.id, quantity: 1 }),
      });
      if (res.ok) {
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2500);
      }
    } catch {}
    finally { setCartLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#B98E75]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-stone-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 pt-6 sm:pt-10">
      <div className="container max-w-6xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          
          {/* LEFT: IMAGES */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden relative">
              <img 
                src={product.images[selectedImage] || "/placeholder.jpg"} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discountPrice && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#B98E75] text-white text-xs font-bold px-2 sm:px-3 py-1 uppercase tracking-wider">
                  Sale
                </span>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-[#B98E75]" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
            
            <div>
              <p className="text-[#B98E75] text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">
                {product.category}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl">
              {product.discountPrice ? (
                <>
                  <span className="font-bold text-[#B98E75]">Rs. {Number(product.discountPrice).toLocaleString()}</span>
                  <span className="text-stone-400 line-through text-base sm:text-lg">Rs. {Number(product.price).toLocaleString()}</span>
                </>
              ) : (
                <span className="font-bold text-stone-900">Rs. {Number(product.price).toLocaleString()}</span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-stone text-stone-600 leading-relaxed text-sm sm:text-base">
              <p>{product.description}</p>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className={`flex-1 text-white h-12 sm:h-14 uppercase tracking-widest text-xs font-bold gap-2 rounded-none transition-all ${
                    cartAdded
                      ? "bg-green-600 hover:bg-green-600"
                      : "bg-stone-900 hover:bg-[#B98E75]"
                  }`}
                >
                  {cartLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : cartAdded ? (
                    <><Check className="h-4 w-4" /> Added!</>
                  ) : (
                    <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
                  )}
                </Button>
                <Button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  variant="outline"
                  className={`sm:flex-none h-12 sm:h-14 sm:w-14 rounded-none transition-all ${
                    isInWishlist
                      ? "border-[#B98E75] text-[#B98E75] bg-[#B98E75]/5"
                      : "border-stone-300 hover:text-[#B98E75] hover:border-[#B98E75]"
                  }`}
                  title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  {wishlistLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className={`h-5 w-5 transition-all ${isInWishlist ? "fill-[#B98E75] text-[#B98E75]" : ""}`} />
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-stone-500 uppercase tracking-wider font-bold">
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" /> In Stock & Ready to Ship
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}