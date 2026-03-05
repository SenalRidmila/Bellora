// src/app/admin/settings/banners/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newBanner, setNewBanner] = useState({
    imageUrl: "",
    title: "",
    link: "",
    order: 1,
    isActive: true,
  });

  // Dummy data for now (replace with API call)
  useEffect(() => {
    // TODO: Fetch banners from API
    setBanners([
      {
        id: "1",
        imageUrl: "/banner1.jpg",
        title: "Summer Collection",
        link: "/collections/summer",
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleAddBanner = () => {
    // TODO: Add API call to create banner
    const banner: Banner = {
      id: Date.now().toString(),
      ...newBanner,
      createdAt: new Date().toISOString(),
    };
    
    setBanners([...banners, banner]);
    setNewBanner({ imageUrl: "", title: "", link: "", order: 1, isActive: true });
    setShowAddForm(false);
    alert("Banner added successfully!");
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      setBanners(banners.filter(b => b.id !== id));
      alert("Banner deleted successfully!");
    }
  };

  const toggleActive = (id: string) => {
    setBanners(banners.map(b => 
      b.id === id ? { ...b, isActive: !b.isActive } : b
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Banner Management</h1>
          <p className="text-stone-500 mt-1">Manage homepage banners</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#B98E75] hover:bg-[#a67c63]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Banner
        </Button>
      </div>

      {/* Add Banner Form */}
      {showAddForm && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-stone-800">Add New Banner</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={newBanner.imageUrl}
                onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B98E75]"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newBanner.title}
                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B98E75]"
                placeholder="Summer Collection"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Link (Optional)
              </label>
              <input
                type="text"
                value={newBanner.link}
                onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B98E75]"
                placeholder="/collections/summer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Order
              </label>
              <input
                type="number"
                value={newBanner.order}
                onChange={(e) => setNewBanner({ ...newBanner, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B98E75]"
                min="1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newBanner.isActive}
                onChange={(e) => setNewBanner({ ...newBanner, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm text-stone-700">Set as Active</label>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddBanner} className="bg-[#B98E75] hover:bg-[#a67c63]">
                Add
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Banners List */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        {banners.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            No banners found. Add a new one!
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {banners.map((banner) => (
              <div key={banner.id} className="p-6 flex gap-6 items-center hover:bg-stone-50/50">
                {/* Banner Preview */}
                <div className="w-48 h-28 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
                  {banner.imageUrl ? (
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Banner Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-stone-900">{banner.title}</h3>
                  <p className="text-sm text-stone-500 mt-1">Link: {banner.link || "None"}</p>
                  <p className="text-sm text-stone-500">Order: {banner.order}</p>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      banner.isActive 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(banner.id)}
                    className="p-2 text-stone-500 hover:text-[#B98E75] transition"
                    title={banner.isActive ? "Deactivate" : "Activate"}
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-2 text-red-500 hover:text-red-700 transition"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
