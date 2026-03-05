// src/app/size-guide/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ruler, Info, ArrowRight, Scissors } from "lucide-react";

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 1. HEADER SECTION (Responsive padding & text) */}
      <div className="bg-stone-100 py-12 md:py-16 text-center px-4">
        <h1 className="font-serif text-3xl md:text-5xl text-stone-900 mb-3 md:mb-4">
          Size Guide
        </h1>
        <p className="text-stone-500 max-w-lg mx-auto text-sm md:text-base tracking-wide">
          Find your perfect fit. All measurements are in inches.
        </p>
      </div>

      <div className="container max-w-5xl mx-auto px-4 mt-8 md:mt-12 space-y-12 md:space-y-16">
        
        {/* 2. SIZE CHART TABLE */}
        <section>
          <div className="flex flex-col md:flex-row items-center gap-2 mb-6 justify-center md:justify-start text-center md:text-left">
            <Ruler className="h-5 w-5 text-[#B98E75]" />
            <h2 className="font-serif text-xl md:text-2xl text-stone-900">Standard Measurements</h2>
          </div>

          {/* Scrollable Container for Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-lg shadow-sm">
            <table className="w-full text-sm text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-stone-900 text-white">
                  <th className="px-4 md:px-6 py-3 md:py-4 font-bold uppercase tracking-wider text-xs md:text-sm">Size</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 font-bold uppercase tracking-wider text-xs md:text-sm">UK Size</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 font-bold uppercase tracking-wider text-xs md:text-sm">Bust (in)</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 font-bold uppercase tracking-wider text-xs md:text-sm">Waist (in)</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 font-bold uppercase tracking-wider text-xs md:text-sm">Hips (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {/* XS */}
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-stone-900">XS</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">6</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">32"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">24"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">34"</td>
                </tr>
                {/* S */}
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-stone-900">S</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">8</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">34"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">26"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">36"</td>
                </tr>
                {/* M */}
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-stone-900">M</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">10</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">36"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">28"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">38"</td>
                </tr>
                {/* L */}
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-stone-900">L</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">12</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">38"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">30"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">40"</td>
                </tr>
                {/* XL */}
                <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-stone-900">XL</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">14</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">40"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">32"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">42"</td>
                </tr>
                 {/* XXL */}
                 <tr className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-stone-900">XXL</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">16</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">42"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">34"</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-stone-600">44"</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Mobile Hint */}
          <p className="text-xs text-stone-400 mt-2 text-center md:hidden italic">
            Swipe left to see more
          </p>
        </section>

        {/* 3. HOW TO MEASURE GUIDE */}
        <section className="bg-stone-50 p-6 md:p-12 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center gap-2 mb-8 justify-center">
            <Info className="h-5 w-5 text-[#B98E75]" />
            <h2 className="font-serif text-xl md:text-2xl text-stone-900">How to Measure</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
            {/* Bust */}
            <div className="text-center space-y-3 bg-white p-6 rounded-xl shadow-sm md:shadow-none md:bg-transparent md:p-0">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-white md:bg-white/50 rounded-full flex items-center justify-center mx-auto shadow-sm text-stone-900 font-bold border border-stone-200">1</div>
              <h3 className="font-bold text-stone-900 uppercase tracking-wide text-sm md:text-base">Bust</h3>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                Measure around the fullest part of your chest, keeping the tape measure horizontal and comfortable.
              </p>
            </div>

            {/* Waist */}
            <div className="text-center space-y-3 bg-white p-6 rounded-xl shadow-sm md:shadow-none md:bg-transparent md:p-0">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-white md:bg-white/50 rounded-full flex items-center justify-center mx-auto shadow-sm text-stone-900 font-bold border border-stone-200">2</div>
              <h3 className="font-bold text-stone-900 uppercase tracking-wide text-sm md:text-base">Waist</h3>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                Measure around the narrowest part of your waistline (usually just above your belly button).
              </p>
            </div>

            {/* Hips */}
            <div className="text-center space-y-3 bg-white p-6 rounded-xl shadow-sm md:shadow-none md:bg-transparent md:p-0">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-white md:bg-white/50 rounded-full flex items-center justify-center mx-auto shadow-sm text-stone-900 font-bold border border-stone-200">3</div>
              <h3 className="font-bold text-stone-900 uppercase tracking-wide text-sm md:text-base">Hips</h3>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                Stand with feet together and measure around the fullest part of your hips.
              </p>
            </div>
          </div>
        </section>

        {/* 4. CUSTOM SIZE CTA */}
        <section className="bg-[#B98E75]/10 border border-[#B98E75]/30 p-8 md:p-12 rounded-2xl text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 md:h-14 md:w-14 bg-[#B98E75] text-white rounded-full flex items-center justify-center shadow-lg">
              <Scissors className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-stone-900">Don't fit in these sizes?</h2>
            <p className="text-stone-600 max-w-lg mx-auto mb-4 text-sm md:text-base px-2">
              We offer bespoke tailoring services. Get your attire stitched exactly to your unique measurements for the perfect fit.
            </p>
            <Link href="/custom-made" className="w-full md:w-auto">
              <Button className="bg-stone-900 text-white hover:bg-[#B98E75] h-12 w-full md:w-auto px-8 uppercase tracking-widest text-xs font-bold gap-2">
                Request Custom Fit <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}