// src/app/custom-made/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Upload, X } from "lucide-react";

export default function CustomMadePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    budget: "",
    description: "",
    // Measurements
    fullLength: "",
    shoulder: "",
    bust: "",
    waist: "",
    hips: "",
    sleeveLength: "",
    armhole: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageBase64 = "";
      if (selectedFile) {
        imageBase64 = await convertToBase64(selectedFile);
      }

      const requestData = {
        ...formData,
        requiredDate: formData.date,
        image: imageBase64,
      };

      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (res.ok) {
        setIsSuccess(true);
        setFormData({
          name: "", email: "", phone: "", date: "", budget: "", description: "",
          fullLength: "", shoulder: "", bust: "", waist: "", hips: "", sleeveLength: "", armhole: ""
        });
        setSelectedFile(null);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION (Responsive Text & Height) */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img src="/hero-3.jpg" alt="Custom Tailoring" className="w-full h-full object-cover" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="text-[#B98E75] tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs font-bold border-b border-[#B98E75] pb-2">
            Bespoke Services
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-white leading-tight">
            Designed Exclusively <br />
            <span className="italic text-[#B98E75]">For You</span>
          </h1>
        </div>
      </section>

      {/* 2. INQUIRY FORM SECTION */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
            
            {/* Left: Info (Sticky on Desktop only) */}
            <div className="space-y-6 relative md:sticky md:top-24 order-1 md:order-1">
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900">Start Your Journey</h2>
              <p className="text-stone-500 leading-relaxed text-sm md:text-base">
                Fill out the form below. Providing measurements is optional but helps us give you a better estimate.
              </p>
              
              <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                <h3 className="font-serif text-lg text-stone-800 mb-2">How to Measure?</h3>
                <ul className="text-sm text-stone-600 space-y-2 list-disc list-inside">
                  <li><strong>Full Length:</strong> Shoulder to floor/desired length.</li>
                  <li><strong>Bust:</strong> Around the fullest part of your chest.</li>
                  <li><strong>Waist:</strong> Around the narrowest part of your waist.</li>
                </ul>
              </div>
            </div>

            {/* Right: Form (Inputs stack on mobile) */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-xl shadow-stone-100 order-2 md:order-2">
              {isSuccess ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in">
                  <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-serif text-2xl text-stone-900">Request Sent!</h3>
                  <p className="text-stone-500 text-sm">We will be in touch shortly.</p>
                  <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-4 w-full md:w-auto">Send Another Request</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b pb-2">Contact Details</h3>
                    {/* Grid changes to 1 column on mobile, 2 on sm/md */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-500 uppercase">Name</label>
                        <Input name="name" required placeholder="Your Name" value={formData.name} onChange={handleChange} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-500 uppercase">Phone</label>
                        <Input name="phone" required placeholder="+94 77..." value={formData.phone} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 uppercase">Email</label>
                      <Input name="email" type="email" required placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b pb-2">Order Info</h3>
                    {/* Grid changes to 1 column on mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-500 uppercase">Required Date</label>
                        <Input name="date" type="date" value={formData.date} onChange={handleChange} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-500 uppercase">Est. Budget (LKR)</label>
                        <Input name="budget" placeholder="e.g. 15,000" value={formData.budget} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 uppercase">Description</label>
                      <Textarea name="description" required placeholder="Describe the style, fabric..." className="min-h-[80px]" value={formData.description} onChange={handleChange} />
                    </div>
                  </div>

                  {/* Measurements (Optional) */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1">
                      Measurements <span className="text-stone-400 font-normal normal-case text-xs">(Optional - in inches)</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {['Full Length', 'Shoulder', 'Bust', 'Waist', 'Hips', 'Sleeve Length', 'Armhole'].map((label) => {
                        let stateKey = label.toLowerCase().replace(/ /g, '');
                         if(label === 'Full Length') stateKey = 'fullLength';
                         if(label === 'Sleeve Length') stateKey = 'sleeveLength';

                        return (
                          <div key={label} className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-500 uppercase truncate block" title={label}>{label}</label>
                            <Input 
                              name={stateKey} 
                              placeholder="0" 
                              value={formData[stateKey as keyof typeof formData]} 
                              onChange={handleChange} 
                              className="h-9 text-sm"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-stone-500 uppercase">Reference Image</label>
                    {!selectedFile ? (
                      <div className="border border-dashed border-stone-300 rounded-lg p-6 text-center cursor-pointer hover:bg-stone-50 transition relative">
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="h-6 w-6 text-stone-400" />
                          <span className="text-xs text-stone-500">Tap to Upload Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg bg-stone-50">
                        <span className="text-xs text-stone-600 truncate max-w-[150px]">{selectedFile.name}</span>
                        <button type="button" onClick={removeFile} className="p-1"><X className="h-5 w-5 text-stone-400" /></button>
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-stone-900 text-white hover:bg-[#B98E75] h-12 uppercase tracking-widest text-xs font-bold">
                    {isSubmitting ? "Sending..." : "Submit Inquiry"}
                  </Button>

                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}