// src/app/new-arrivals/page.tsx
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard"; // Reusable Card එක
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  discountPrice: string | null;
  category: string;
  images: string[];
  status: string;
  createdAt: string; // Added date
}

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        
        // Active products only
        const activeProducts = data.filter((p: Product) => p.status === "Active");
        setProducts(activeProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#B98E75]" />
          <p className="text-stone-500 text-sm tracking-widest uppercase">Loading Collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-stone-50 py-16 md:py-24 mb-12">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[#B98E75] text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
            Just Landed
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
            New Arrivals
          </h1>
          <p className="text-stone-500 max-w-xl mx-auto font-light leading-relaxed">
            Explore our latest additions, featuring exquisite fabrics and timeless designs tailored for the modern muse.
          </p>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="container max-w-7xl mx-auto px-4">
        
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400">No new arrivals found at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product) => (
              // මෙන්න අපි New Arrivals පිටුවට විශේෂයෙන් කියනවා "New" badge එක හංගන්න කියලා
              <ProductCard 
                key={product.id} 
                product={product} 
                hideNewBadge={true} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}