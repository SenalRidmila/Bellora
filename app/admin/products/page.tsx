// src/app/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Tag, Search, Filter, Ban, CheckCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  status: string;
  images: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE FUNCTION
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
        alert("Product deleted successfully!");
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  // TOGGLE STATUS
  const toggleStatus = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const newStatus = product.status === "Active" ? "SoldOut" : "Active";

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setProducts(
          products.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Products</h1>
          <p className="text-stone-500 mt-1">Manage your collection, inventory and prices.</p>
        </div>
        
        {/* Add New Product Button */}
        <Link href="/admin/products/new">
          <button className="bg-stone-900 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-stone-800 transition shadow-lg">
            <Plus className="h-5 w-5" />
            Add New Product
          </button>
        </Link>
      </div>

      {/* --- FILTERS BAR (Optional) --- */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B98E75]"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50">
          <Filter className="h-5 w-5" />
          Filter
        </button>
      </div>

      {/* --- PRODUCTS TABLE --- */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-stone-400">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <p>No products found. Add your first product!</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-medium border-b border-stone-200">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50/50 transition">
                  
                  {/* 1. Product Image & Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-12 bg-stone-200 rounded overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-stone-400 text-xs">No Image</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-stone-900">{product.name}</h3>
                        <p className="text-xs text-stone-400 mt-0.5">ID: {product.id}</p>
                        {product.discountPrice && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full mt-1">
                            <Tag className="h-3 w-3" /> ON SALE
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 2. Category */}
                  <td className="px-6 py-4 text-stone-600 text-sm">{product.category}</td>

                  {/* 3. Price */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      {product.discountPrice ? (
                        <>
                          <span className="text-stone-900 font-bold">Rs. {product.discountPrice.toLocaleString()}</span>
                          <span className="text-stone-400 text-xs line-through">Rs. {product.price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-stone-900 font-medium">Rs. {product.price.toLocaleString()}</span>
                      )}
                    </div>
                  </td>

                  {/* 4. Status (Click to Toggle) */}
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(product.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        product.status === "Active" 
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      }`}
                    >
                      {product.status === "Active" ? (
                        <><CheckCircle className="h-3.5 w-3.5" /> In Stock</>
                      ) : (
                        <><Ban className="h-3.5 w-3.5" /> Sold Out</>
                      )}
                    </button>
                  </td>

                  {/* 5. Stock */}
                  <td className="px-6 py-4 text-center text-sm text-stone-600">
                    {product.stock} units
                  </td>

                  {/* 6. Actions (Edit & Delete) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      
                      {/* --- EDIT BUTTON FIX --- */}
                      <Link href={`/admin/products/${product.id}`}>
                        <button className="p-2 text-stone-500 hover:text-[#B98E75] hover:bg-stone-100 rounded-lg transition" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Link>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" 
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}