// src/app/contact/page.tsx
import WhatsAppBtn from "@/components/WhatsAppBtn"; // අපි කලින් හදපු Button එක
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. HEADER */}
      <div className="bg-stone-100 py-20 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">
          Get in Touch
        </h1>
        <p className="text-stone-500 max-w-lg mx-auto text-sm tracking-wide">
          We are here to assist you with your bespoke needs and inquiries.
        </p>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          {/* 2. CONTACT INFO SECTION */}
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl text-stone-900 mb-6">Contact Details</h2>
              <div className="space-y-6">
                
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-stone-50 rounded-full text-[#B98E75]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Phone / WhatsApp</p>
                    <a href="tel:+94781304930" className="text-lg text-stone-900 hover:text-[#B98E75] transition">
                      +94 78 130 4930
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-stone-50 rounded-full text-[#B98E75]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Email</p>
                    <a href="mailto:belloracloths@gmail.com" className="text-lg text-stone-900 hover:text-[#B98E75] transition">
                      belloracloths@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location (Optional Placeholder) */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-stone-50 rounded-full text-[#B98E75]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-lg text-stone-900">
                      Colombo, Sri Lanka
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h2 className="font-serif text-2xl text-stone-900 mb-6">Follow Us</h2>
              <div className="flex gap-4">
                
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" className="h-12 w-12 border border-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition duration-300">
                  <Facebook className="h-5 w-5" />
                </a>

                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" className="h-12 w-12 border border-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition duration-300">
                  <Instagram className="h-5 w-5" />
                </a>

                {/* TikTok (Custom SVG Icon) */}
                <a href="https://tiktok.com" target="_blank" className="h-12 w-12 border border-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:bg-black hover:text-white hover:border-black transition duration-300">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="h-5 w-5"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>

              </div>
            </div>
          </div>

          {/* 3. SIMPLE MESSAGE FORM (Optional but good to have) */}
          <div className="bg-stone-50 p-8 md:p-12 rounded-2xl">
            <h2 className="font-serif text-2xl text-stone-900 mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Name" className="w-full bg-white border border-stone-200 p-4 rounded text-sm focus:outline-none focus:border-[#B98E75]" />
                <input type="email" placeholder="Email" className="w-full bg-white border border-stone-200 p-4 rounded text-sm focus:outline-none focus:border-[#B98E75]" />
              </div>
              <input type="text" placeholder="Subject" className="w-full bg-white border border-stone-200 p-4 rounded text-sm focus:outline-none focus:border-[#B98E75]" />
              <textarea rows={4} placeholder="Your Message" className="w-full bg-white border border-stone-200 p-4 rounded text-sm focus:outline-none focus:border-[#B98E75]"></textarea>
              
              <button className="bg-stone-900 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#B98E75] transition w-full md:w-auto">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* WhatsApp Button Component added here */}
      <WhatsAppBtn />

    </div>
  );
}