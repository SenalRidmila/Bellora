// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard"; // අපි හදපු Card එක Import කළා
import { Loader2, ArrowRight } from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  price: string | number;
  discountPrice?: string | number | null;
  category: string;
  images: string[];
  status: string;
}

export default function Home() {
  // Hero Images
  const heroImages = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"];
  const [currentImage, setCurrentImage] = useState(0);
  
  // Product Data State
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Hero Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch Latest Products (API) - optimized with limit
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use limit parameter to fetch only 6 active products
        const res = await fetch("/api/products?status=Active&limit=6");
        const data = await res.json();
          
        setLatestProducts(data);
      } catch (error) {
        console.error("Error fetching home products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- HERO SECTION (මේක කලින් තිබුන එකමයි) --- */}
      <section className="relative h-[90vh] flex items-center justify-center bg-zinc-900 overflow-hidden">
        {heroImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/20 z-10" />
            <Image 
              src={src} 
              alt="Hero" 
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
              quality={85}
            />
          </div>
        ))}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">
          <span className="text-[#B98E75] tracking-[0.3em] uppercase text-sm font-bold border-b border-[#B98E75] pb-2">
            Luxury Attire
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight text-white drop-shadow-xl shadow-black">
            Elegance in <br /> <span className="italic text-amber-50">Every Stitch</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/new-arrivals">
              <Button size="lg" className="bg-white text-black hover:bg-[#B98E75] hover:text-white px-10 py-7 text-sm uppercase tracking-widest rounded-none min-w-[200px] border-0 shadow-lg">
                Shop Latest
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- LATEST COLLECTION SECTION --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#B98E75] text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
                Selected for you
              </span>
              <h2 className="font-serif text-4xl text-stone-900">Latest Collection</h2>
            </div>
            <Link href="/new-arrivals" className="hidden md:flex items-center gap-2 text-stone-500 hover:text-[#B98E75] transition text-sm font-medium uppercase tracking-wider">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#B98E75]" />
            </div>
          )}

          {/* Product Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {latestProducts.map((product) => (
                // මෙන්න අපි හදපු Product Card එක පාවිච්චි කරනවා
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Mobile View All Button */}
          <div className="mt-12 text-center md:hidden">
            <Link href="/new-arrivals">
              <Button variant="outline" className="border-stone-300 text-stone-600 px-8 py-6 rounded-none uppercase tracking-widest text-xs">
                View All Products
              </Button>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}