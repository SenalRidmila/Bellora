// src/components/Footer.tsx
import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-8">
      <div className="container max-w-6xl mx-auto px-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-12 border-b border-zinc-800">
          
          {/* Column 1: Brand, Contact & Socials */}
          <div className="md:col-span-5 space-y-8">
            {/* Brand Info */}
            <div>
              <h3 className="font-serif text-3xl tracking-tight mb-3 text-white">BELLORA</h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                Experience the epitome of elegance. Crafted for your most memorable moments.
              </p>
            </div>

            {/* Contact Details (New Section) */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group cursor-pointer">
                <Phone className="h-4 w-4 text-[#B98E75]" />
                <span className="text-sm">+94 78 130 4930</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group cursor-pointer">
                <Mail className="h-4 w-4 text-[#B98E75]" />
                <span className="text-sm">belloracloths@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <MapPin className="h-4 w-4 text-[#B98E75]" />
                <span className="text-sm">Colombo, Sri Lanka</span>
              </div>
            </div>

            {/* Social Icons */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <Link href="#" className="bg-zinc-900 p-2.5 rounded-full hover:bg-[#B98E75] hover:text-white transition-all text-zinc-400">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="bg-zinc-900 p-2.5 rounded-full hover:bg-[#B98E75] hover:text-white transition-all text-zinc-400">
                  <Facebook className="h-5 w-5" />
                </Link>
                {/* TikTok SVG */}
                <Link href="#" className="bg-zinc-900 p-2.5 rounded-full hover:bg-[#B98E75] hover:text-white transition-all text-zinc-400 group">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="group-hover:stroke-white"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="md:col-span-3 md:pl-8">
            <h4 className="font-serif text-lg mb-6 text-white">Collections</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/new-arrivals" className="text-zinc-400 hover:text-[#B98E75] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/custom-made" className="text-zinc-400 hover:text-[#B98E75] transition-colors">
                  Custom Made
                </Link>
              </li>
              <li>
                <Link href="/bridal" className="text-zinc-400 hover:text-[#B98E75] transition-colors">
                  Bridal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="md:col-span-4 md:pl-8">
            <h4 className="font-serif text-lg mb-6 text-white">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/size-guide" className="text-zinc-400 hover:text-[#B98E75] transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-[#B98E75] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Copyright Section */}
        <div className="pt-8 text-center text-zinc-600 text-xs uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Bellora Luxury Attire. All rights reserved.
        </div>
      </div>
    </footer>
  );
}