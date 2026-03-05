// src/app/admin/settings/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // Dummy data for now (replace with API call)
  useEffect(() => {
    // TODO: Fetch categories from API
    setCategories([
      {
        id: "1",
        name: "Dresses",
        slug: "dresses",
        description: "Beautiful dresses for all occasions",
        productCount: 12,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Tops",
        slug: "tops",
        description: "Stylish tops and blouses",
        productCount: 8,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Category name is required!");
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, ...formData }
          : cat
      ));
      alert("Category updated successfully!");
    } else {
      // Add new category
      const category: Category = {
        id: Date.now().toString(),
        ...formData,
        productCount: 0,
        createdAt: new Date().toISOString(),
      };
      setCategories([...categories, category]);
      alert("Category added successfully!");
    }

    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category && category.productCount > 0) {
      alert(`This category has ${category.productCount} products. Remove them first!`);
      return;
    }

    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter(c => c.id !== id));
      alert("Category deleted successfully!");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "" });
    setEditingCategory(null);
    setShowForm(false);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-stone-900">Category Management</h1>
          <p className="text-stone-500 mt-1">Manage product categories</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#B98E75] hover:bg-[#a67c63]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Add/Edit Category Form */}
      {showForm && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-stone-800">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: generateSlug(e.target.value)
                  });
                }}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B98E75]"
                placeholder="Dresses"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B98E75] bg-stone-50"
                placeholder="dresses"
              />
              <p className="text-xs text-stone-500 mt-1">Auto-generated from name</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B98E75]"
                rows={3}
                placeholder="Beautiful dresses for all occasions"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSubmit} className="bg-[#B98E75] hover:bg-[#a67c63]">
                {editingCategory ? "Update" : "Add"}
              </Button>
              <Button onClick={resetForm} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        {categories.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            No categories found. Add a new one!
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Products</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-stone-50/50">
                  <td className="px-6 py-4 font-medium text-stone-900">{category.name}</td>
                  <td className="px-6 py-4 text-stone-600">
                    <code className="bg-stone-100 px-2 py-1 rounded text-xs">{category.slug}</code>
                  </td>
                  <td className="px-6 py-4 text-stone-600 max-w-xs truncate">
                    {category.description || "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {category.productCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-[#B98E75] hover:bg-[#B98E75]/10 rounded transition"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition"
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
