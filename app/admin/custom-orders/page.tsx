// src/app/admin/custom-orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, Calendar, Mail, Phone, MessageCircle } from "lucide-react";

interface CustomRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  requiredDate: string;
  budget: string;
  description: string;
  image: string | null;
  status: string;
  createdAt: string;
  // අලුත් මිනුම් (Optional)
  fullLength?: string;
  shoulder?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  sleeveLength?: string;
  armhole?: string;
}

export default function CustomOrdersPage() {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/custom-requests");
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    setUpdatingStatus(requestId);
    try {
      const res = await fetch(`/api/custom-requests/${requestId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setRequests(requests.map(req => 
          req.id === requestId ? { ...req, status: newStatus } : req
        ));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const contactCustomer = (phone: string, name: string) => {
    const message = `Hello ${name}, let's discuss your custom order request. - Bellora`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-serif text-stone-900">Custom Inquiries Management</h1>
        <p className="text-stone-500 mt-1">Special orders and measurement requests</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#B98E75]" />
        </div>
      ) : requests.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-stone-300 rounded-xl">
          <p className="text-stone-400">No custom requests yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
              
              {/* Image Preview (If exists) */}
              <div className="w-full md:w-48 h-48 bg-stone-100 rounded-lg flex-shrink-0 overflow-hidden border border-stone-200">
                {req.image ? (
                  <img src={req.image} alt="Reference" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">No Image</div>
                )}
              </div>

              {/* Order Details */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900">{req.name}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-stone-600">
                      <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {req.email}</span>
                      <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {req.phone}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm border-y border-stone-100 py-4">
                  <div>
                    <span className="block text-stone-400 text-xs uppercase font-bold">Required Date</span>
                    <span className="flex items-center gap-2 mt-1"><Calendar className="h-4 w-4 text-[#B98E75]" /> {req.requiredDate || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="block text-stone-400 text-xs uppercase font-bold">Budget</span>
                    <span className="block mt-1 font-medium">{req.budget || "Not specified"}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-stone-400 text-xs uppercase font-bold mb-1">Description</span>
                  <p className="text-stone-700 text-sm leading-relaxed bg-stone-50 p-3 rounded-lg">
                    {req.description}
                  </p>
                </div>

                {/* --- MEASUREMENTS SECTION (NEW) --- */}
                {(req.fullLength || req.shoulder || req.bust || req.waist || req.hips || req.sleeveLength || req.armhole) && (
                  <div className="mt-4 bg-[#FDFBF9] p-4 rounded-lg border border-[#B98E75]/20">
                    <span className="block text-[#B98E75] text-xs uppercase font-bold mb-3 tracking-widest">
                      Customer Measurements (Inches)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 text-xs text-stone-600">
                      {req.fullLength && <div><span className="font-bold text-stone-800">Length:</span> {req.fullLength}"</div>}
                      {req.shoulder && <div><span className="font-bold text-stone-800">Shoulder:</span> {req.shoulder}"</div>}
                      {req.bust && <div><span className="font-bold text-stone-800">Bust:</span> {req.bust}"</div>}
                      {req.waist && <div><span className="font-bold text-stone-800">Waist:</span> {req.waist}"</div>}
                      {req.hips && <div><span className="font-bold text-stone-800">Hips:</span> {req.hips}"</div>}
                      {req.sleeveLength && <div><span className="font-bold text-stone-800">Sleeve:</span> {req.sleeveLength}"</div>}
                      {req.armhole && <div><span className="font-bold text-stone-800">Armhole:</span> {req.armhole}"</div>}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-stone-100">
                  <div className="flex-1">
                    <label className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-2 block">
                      Change Status
                    </label>
                    <select
                      value={req.status}
                      onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                      disabled={updatingStatus === req.id}
                      className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B98E75] disabled:opacity-50"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => contactCustomer(req.phone, req.name)}
                      className="bg-[#25D366] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#20BA5A] transition w-full md:w-auto justify-center"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp කරන්න</span>
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}