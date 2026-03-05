// src/components/WhatsAppBtn.tsx
"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppBtn() {
  const phoneNumber = "94781304930"; // '+' ලකුණ නැතුව අංකය
  const message = "Hello Bellora! I would like to know more about your products.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative">
        {/* Glowing Effect */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75 group-hover:opacity-100 duration-300"></div>
        
        {/* The Button */}
        <div className="relative bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-xl transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
          <MessageCircle className="h-8 w-8 fill-current" />
        </div>

        {/* Tooltip text (Optional - hover කළාම පේන්න) */}
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Chat with us
        </span>
      </div>
    </a>
  );
}