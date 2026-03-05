"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Upload, X, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    status: "Active"
  });

  // 1. කලින් දත්ත ලබා ගැනීම (Fetch Existing Data)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        
        if (data) {
          setFormData({
            name: data.name,
            description: data.description || "",
            price: data.price,
            category: data.category,
            stock: data.stock,
            status: data.status
          });
          setImages(data.images || []);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. UPDATE FUNCTION (PUT Request)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: images,
      };

      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT", // මෙතන අපි පාවිච්චි කරන්නේ PUT (Update)
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        alert("Product updated successfully!");
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating product");
    } finally {
      setSaving(false);
    }
  };

  // Image Upload Logic (Add Product page එකේ වගේමයි)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (loading) return <div className="p-8">Loading product details...</div>;

  return (
    <form onSubmit={handleUpdate} className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-stone-200">
              <ChevronLeft className="h-5 w-5 text-stone-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-stone-900">Edit Product</h1>
            <p className="text-stone-500 text-sm">Update product details</p>
          </div>
        </div>
        <Button type="submit" disabled={saving} className="bg-stone-900 text-white gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Updating..." : "Update Product"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-bold text-stone-800">Basic Info</h3>
                <label className="text-xs font-bold text-stone-500">Product Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
                
                <label className="text-xs font-bold text-stone-500">Description</label>
                <Textarea name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-bold text-stone-800">Images</h3>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <div className="flex gap-4 mt-4 flex-wrap">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-red-500 text-white p-1">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
                 <h3 className="font-bold text-stone-800">Price</h3>
                 <Input name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-bold text-stone-800">Settings</h3>
                
                <label className="text-xs font-bold text-stone-500">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" required>
                    <option value="">Select Category</option>
                    <option value="New Arrivals">New Arrivals</option>
                    <option value="Bridal">Bridal</option>
                    <option value="Collections">Collections</option>
                </select>

                <label className="text-xs font-bold text-stone-500">Stock</label>
                <Input name="stock" type="number" value={formData.stock} onChange={handleChange} />

                <label className="text-xs font-bold text-stone-500">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="Active">Active</option>
                    <option value="Sold Out">Sold Out</option>
                </select>
            </div>
        </div>
      </div>
    </form>
  );
}