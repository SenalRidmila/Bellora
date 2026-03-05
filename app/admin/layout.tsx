// src/app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ClipboardList,
  ShieldX,
} from "lucide-react";

const ADMIN_EMAIL = "senalridmila2@gmail.com";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.email !== ADMIN_EMAIL) {
      router.replace("/");
    }
  }, [session, status, router]);

  // Show nothing while loading or if not admin
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B98E75]" />
      </div>
    );
  }

  if (!session || session.user?.email !== ADMIN_EMAIL) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center space-y-3">
          <ShieldX className="h-12 w-12 text-red-400 mx-auto" />
          <p className="text-stone-600 font-medium">Access Denied</p>
        </div>
      </div>
    );
  }
  // Check if link is active
  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  // Common styling for active and inactive links
  const linkStyle = (path: string) => 
    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition ${
      isActive(path) 
        ? "bg-[#B98E75] text-white"  // Active page color
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white" // Other pages
    }`;

  return (
    <div className="flex min-h-screen bg-stone-50">
      
      {/* 1. ADMIN SIDEBAR */}
      <aside className="w-64 bg-zinc-900 text-white hidden md:flex flex-col fixed h-full left-0 top-0 overflow-y-auto">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center border-b border-zinc-800 shrink-0">
          <h2 className="font-serif text-2xl tracking-wider text-white">BELLORA</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4 px-4 font-semibold">Menu</p>
          
          {/* Dashboard */}
          <Link href="/admin" className={linkStyle("/admin")}>
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>

          {/* Products */}
          <Link href="/admin/products" className={linkStyle("/admin/products")}>
            <Package className="h-5 w-5" />
            Products
          </Link>

          {/* Orders */}
          <Link href="/admin/orders" className={linkStyle("/admin/orders")}>
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>

          {/* Customers */}
          <Link href="/admin/customers" className={linkStyle("/admin/customers")}>
            <Users className="h-5 w-5" />
            Customers
          </Link>

          {/* Custom Orders Link */}
          <Link href="/admin/custom-orders" className={linkStyle("/admin/custom-orders")}>
            <ClipboardList className="h-5 w-5" />
            Custom Orders
          </Link>

          {/* Settings */}
          <Link href="/admin/settings" className={linkStyle("/admin/settings")}>
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-zinc-800 mt-auto">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-400 hover:bg-zinc-800/50 rounded-lg transition">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}