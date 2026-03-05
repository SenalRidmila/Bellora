// src/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  Search, 
  Home, 
  ShoppingBag, 
  X, 
  Loader2, 
  ArrowRight,
  LogOut,
  Package,
  Settings,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetTitle, 
  SheetDescription, 
  SheetClose 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- SEARCH COMPONENT (Internal) ---
function SearchOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch all products initially
  useEffect(() => {
    if (open && products.length === 0) {
      setLoading(true);
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          const active = data.filter((p: any) => p.status === "Active");
          setProducts(active);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load products", err);
          setLoading(false);
        });
    }
  }, [open, products.length]);

  // 2. Filter logic
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredProducts([]);
    } else {
      const lowerQuery = query.toLowerCase();
      const results = products.filter((p) => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery)
      );
      setFilteredProducts(results.slice(0, 5)); 
    }
  }, [query, products]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="h-[400px] sm:h-[500px] w-full p-0 bg-white border-b-0 overflow-hidden flex flex-col">
        <SheetTitle className="sr-only">Search</SheetTitle>
        <SheetDescription className="sr-only">Search for products</SheetDescription>
        
        {/* Search Header */}
        <div className="container max-w-4xl mx-auto px-4 py-6 border-b border-stone-100 flex items-center gap-4">
          <Search className="h-5 w-5 text-stone-400" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search for products, collections..." 
            className="flex-1 text-lg font-serif outline-none placeholder:text-stone-300 text-stone-900 bg-transparent h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5 text-stone-500 hover:text-red-500" />
          </Button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto bg-stone-50/50">
          <div className="container max-w-4xl mx-auto px-4 py-8">
            
            {loading && (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-[#B98E75]" />
              </div>
            )}

            {!loading && query === "" && (
              <div className="text-center py-10 text-stone-400">
                <p className="text-sm">Start typing to search...</p>
              </div>
            )}

            {!loading && query !== "" && filteredProducts.length === 0 && (
              <div className="text-center py-10 text-stone-400">
                <p>No results found for "{query}"</p>
              </div>
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/products/${product.id}`} // කෙලින්ම Product Page එකට Link කළා
                  onClick={() => onOpenChange(false)} // Click කළාම Search එක වැසෙන්න
                  className="flex items-center gap-4 p-3 bg-white border border-stone-100 rounded-lg hover:border-[#B98E75]/30 hover:shadow-md transition cursor-pointer group"
                >
                  <div className="h-16 w-16 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                    <img src={product.images[0] || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-stone-900 truncate group-hover:text-[#B98E75] transition-colors">{product.name}</h4>
                    <p className="text-xs text-stone-500 uppercase tracking-wider">{product.category}</p>
                    <p className="text-sm font-medium text-stone-900 mt-1">Rs. {Number(product.price).toLocaleString()}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-[#B98E75] -translate-x-2 group-hover:translate-x-0 transition-transform opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
            </div>

            {/* View All Link */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-6">
                <Link href="/collections" onClick={() => onOpenChange(false)} className="text-xs font-bold uppercase tracking-widest text-[#B98E75] hover:underline">
                  View All Results
                </Link>
              </div>
            )}

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// --- MAIN NAVBAR COMPONENT ---
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count
  useEffect(() => {
    if (!session?.user?.id) {
      setCartCount(0);
      return;
    }
    
    const fetchCartCount = async () => {
      try {
        const res = await fetch(`/api/cart?userId=${session.user.id}`);
        if (res.ok) {
          const cartItems = await res.json();
          const totalCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartCount(totalCount);
        }
      } catch (error) {
        console.error("Failed to load cart count");
      }
    };
    fetchCartCount();
    
    // Refresh cart count every 5 seconds when on site
    const interval = setInterval(fetchCartCount, 5000);
    return () => clearInterval(interval);
  }, [session]);

  // Navigation Links Data
  const navLinks = [
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Collections", href: "/collections" },
    { name: "Custom Made", href: "/custom-made" },
    { name: "Bridal", href: "/bridal" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Contact Us", href: "/contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Search Overlay Component */}
      <SearchOverlay open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      {/* 1. TOP HEADER (Desktop & Mobile) */}
      <header className="sticky top-0 z-40 w-full border-b border-stone-100 bg-white/95 backdrop-blur-md transition-all">
        <div className="container max-w-7xl mx-auto px-4 h-16 lg:h-20 grid grid-cols-12 items-center">
          
          {/* LEFT SIDE */}
          <div className="col-span-3 lg:col-span-5 flex items-center justify-start lg:justify-end lg:pr-8">
            
            {/* Mobile Hamburger Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="-ml-2 text-stone-600 hover:text-[#B98E75]">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] p-0 bg-white flex flex-col z-50">
                  <div className="p-8 pb-4 flex justify-center border-b border-stone-50">
                    <div className="w-32 h-12 relative flex items-center justify-center">
                       {/* --- LOGO --- */}
                       <img src="/brand-logo.png" alt="Bellora" className="h-full w-auto object-contain"/>
                    </div>
                  </div>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <SheetDescription className="sr-only">Navigation</SheetDescription>
                  
                  <nav className="flex-1 flex flex-col gap-2 p-8 overflow-y-auto">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.name}>
                        <Link 
                          href={link.href} 
                          className={`font-serif text-2xl transition-all duration-300 py-2 border-b border-transparent hover:pl-2 ${
                            isActive(link.href) ? "text-[#B98E75] pl-2" : "text-stone-800 hover:text-[#B98E75]"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="p-8 bg-stone-50">
                    <p className="text-xs text-stone-400 text-center uppercase tracking-widest">© 2026 Bellora Luxury</p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Left Nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.slice(0, 3).map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={`text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${
                    isActive(link.href) ? "text-[#B98E75]" : "text-stone-700 hover:text-[#B98E75]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* CENTER (Brand Logo) */}
          <div className="col-span-6 lg:col-span-2 flex justify-center">
            <Link href="/" className="relative w-32 lg:w-40 h-12 lg:h-16 flex items-center justify-center">
              <img src="/brand-logo.png" alt="Bellora" className="h-full w-auto object-contain"/>
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-span-3 lg:col-span-5 flex items-center justify-end lg:justify-between lg:pl-8">
            
            {/* Desktop Right Nav */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.slice(3).map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={`text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${
                    isActive(link.href) ? "text-[#B98E75]" : "text-stone-700 hover:text-[#B98E75]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-1 lg:gap-2">
              
              {/* SEARCH BUTTON (Desktop) */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden lg:flex text-stone-600 hover:text-[#B98E75] hover:bg-stone-50"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Link href="/wishlist" className="hidden lg:block">
                <Button variant="ghost" size="icon" className="text-stone-600 hover:text-[#B98E75] hover:bg-stone-50">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative text-stone-600 hover:text-[#B98E75] hover:bg-stone-50">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#B98E75] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              {/* Profile Icon with Dropdown (Always visible) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden lg:flex text-stone-600 hover:text-[#B98E75] hover:bg-stone-50">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {status === "loading" ? (
                    <div className="px-2 py-6 flex justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
                    </div>
                  ) : status === "authenticated" && session?.user?.id ? (
                    /* Logged In Dropdown */
                    <>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{session.user.name || 'User'}</p>
                          <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={async (e) => {
                          e.preventDefault();
                          await signOut({ callbackUrl: '/', redirect: true });
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    /* Logged Out Dropdown */
                    <>
                      <DropdownMenuLabel>
                        <p className="text-sm font-medium">Account</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Sign In
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/signup" className="cursor-pointer">
                          <UserCircle className="mr-2 h-4 w-4" />
                          Sign Up
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BOTTOM NAVIGATION BAR (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          
          <Link href="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-[#B98E75]' : 'text-stone-400'}`}>
            <Home className="h-5 w-5" />
            <span className="text-[10px] uppercase font-medium tracking-wide">Home</span>
          </Link>

          {/* SEARCH BUTTON (Mobile Bottom Bar) */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isSearchOpen ? 'text-[#B98E75]' : 'text-stone-400'}`}
          >
            <Search className="h-5 w-5" />
            <span className="text-[10px] uppercase font-medium tracking-wide">Search</span>
          </button>

          <Link href="/wishlist" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/wishlist') ? 'text-[#B98E75]' : 'text-stone-400'}`}>
            <Heart className="h-5 w-5" />
            <span className="text-[10px] uppercase font-medium tracking-wide">Wishlist</span>
          </Link>

          {/* Mobile Account Icon with Dropdown (Always visible) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/account') || isActive('/orders') ? 'text-[#B98E75]' : 'text-stone-400'}`}>
                <UserCircle className="h-5 w-5" />
                <span className="text-[10px] uppercase font-medium tracking-wide">Account</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mb-2">
              {status === "loading" ? (
                <div className="px-2 py-6 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
                </div>
              ) : status === "authenticated" && session?.user?.id ? (
                /* Logged In Dropdown */
                <>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={async (e) => {
                      e.preventDefault();
                      await signOut({ callbackUrl: '/', redirect: true });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                /* Logged Out Dropdown */
                <>
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">Account</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        
        </div>
      </div>
    </>
  );
}