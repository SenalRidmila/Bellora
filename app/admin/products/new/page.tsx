// app/admin/products/new/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    productType: "",
    stock: "",
    status: "Active",
    allowCustomDesign: false,
    sizes: [] as string[],
  });

  // පින්තූරයක් තේරූ විට Base64 එකට convert කරන්න
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImages([...images, base64]);
      };
      reader.readAsDataURL(file);
    }
  };

  // පින්තූරයක් ඉවත් කිරීම
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Input changes handle කරන්න
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Sizes හැසිරවීම
  const toggleSize = (size: string) => {
    if (formData.sizes.includes(size)) {
      setFormData({
        ...formData,
        sizes: formData.sizes.filter((s) => s !== size),
      });
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    }
  };

  // Form Submit කරන්න
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images,
          price: parseFloat(formData.price),
          discountPrice: formData.discountPrice
            ? parseFloat(formData.discountPrice)
            : null,
          stock: parseInt(formData.stock) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const product = await response.json();
      alert(`Product "${product.name}" created successfully! ID: ${product.id}`);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-stone-200"
            >
              <ChevronLeft className="h-5 w-5 text-stone-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-stone-900">Add New Product</h1>
            <p className="text-stone-500 text-sm">Create a new item for your collection</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="ghost" className="text-stone-500">
              Discard
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-stone-900 hover:bg-stone-800 text-white gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (Main Info) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Basic Details */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-800">Product Information</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600">Product Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sapphire Silk Gown"
                className="bg-stone-50 border-stone-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the material, fit, and design details..."
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#B98E75]"
              />
            </div>
          </div>

          {/* 2. Media / Images */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-800">Media</h3>
            
            <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center hover:bg-stone-50 transition cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-stone-100 rounded-full">
                  <Upload className="h-6 w-6 text-stone-400" />
                </div>
                <p className="text-sm font-medium text-stone-600">Click to upload image</p>
                <p className="text-xs text-stone-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Pricing */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-800">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600">Base Price (Rs.) *</label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="bg-stone-50 border-stone-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-600">Discount Price (Optional)</label>
                <Input
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="bg-stone-50 border-stone-200"
                />
              </div>
            </div>
          </div>

          {/* 3.5 Sizes & Custom Design */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-800">Sizes & Customization</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600">Available Sizes</label>
              <div className="flex gap-2 flex-wrap">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      formData.sizes.includes(size)
                        ? "border-[#B98E75] bg-[#B98E75] text-white"
                        : "border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="allowCustomDesign"
                name="allowCustomDesign"
                checked={formData.allowCustomDesign}
                onChange={handleChange}
                className="rounded border-stone-300 text-[#B98E75]"
              />
              <label htmlFor="allowCustomDesign" className="text-sm text-stone-600">
                Allow custom measurements for this product
              </label>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Organization) --- */}
        <div className="space-y-8">
          
          {/* 1. Status */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-800">Status</h3>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#B98E75] outline-none"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="SoldOut">Sold Out</option>
            </select>
          </div>

          {/* 2. Organization / Category */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-800">Organization</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#B98E75] outline-none"
                required
              >
                <option value="">Select Category</option>
                <option value="New Arrivals">New Arrivals</option>
                <option value="Collections">Collections</option>
                <option value="Custom Made">Custom Made</option>
                <option value="Bridal">Bridal</option>
                <option value="Evening Wear">Evening Wear</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600">Product Type</label>
              <Input
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                placeholder="e.g. Gown, Saree, Frock"
                className="bg-stone-50 border-stone-200"
              />
            </div>
          </div>

          {/* 3. Inventory */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-800">Inventory</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600">Stock Quantity</label>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="bg-stone-50 border-stone-200"
              />
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}