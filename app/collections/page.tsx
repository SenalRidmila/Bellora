// src/app/collections/page.tsx
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string | number;
  discountPrice?: string | number | null;
  category: string;
  images: string[];
  status: string;
  createdAt: string; // Added date
}

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        
        const activeProducts = data.filter((p: Product) => p.status === "Active");
        setProducts(activeProducts);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-stone-100 py-12 sm:py-16 text-center mb-8 sm:mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 mb-3 sm:mb-4 px-4">
          All Collections
        </h1>
        <p className="text-stone-500 max-w-lg mx-auto text-xs sm:text-sm tracking-wide px-6">
          Discover our exclusive range of handcrafted luxury attire.
        </p>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="container max-w-7xl mx-auto px-4">
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#B98E75]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="text-sm">No products available in collections yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-x-8 sm:gap-y-12">
            {products.map((product) => (
              // Collections පිටුවේදී hideNewBadge දාලා නෑ, 
              // ඒ නිසා අලුත් බඩු වලට විතරක් "New" වැටෙයි.
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}