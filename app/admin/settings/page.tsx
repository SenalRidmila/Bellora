// src/app/admin/settings/page.tsx
"use client";

import Link from "next/link";
import { Image, Grid, ArrowRight } from "lucide-react";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Banner Management",
      description: "Manage homepage banners and promotional images",
      icon: Image,
      href: "/admin/settings/banners",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Category Management",
      description: "Add, edit, and delete product categories",
      icon: Grid,
      href: "/admin/settings/categories",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-stone-900">Settings</h1>
        <p className="text-stone-500 mt-1">Manage website settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <div className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg transition cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${section.color} rounded-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#B98E75] transition">
                        {section.title}
                      </h3>
                      <p className="text-sm text-stone-500 mt-1">{section.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-stone-400 group-hover:text-[#B98E75] transition" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
