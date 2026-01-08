import React from "react";
import { Users, Handshake, Globe, ExternalLink, ShieldCheck } from "lucide-react";

export default function Collaborations() {
  const partners = [
    {
      name: "Environmental Protection Agency",
      type: "Government Authority",
      role: "Regulatory Oversight",
      status: "Active",
      logo: "🏛️"
    },
    {
      name: "Global Water Institute",
      type: "Research Partner",
      role: "Data Validation",
      status: "Active",
      logo: "🔬"
    },
    {
      name: "Municipal Water Board",
      type: "Local Authority",
      role: "Infrastructure Management",
      status: "Verified",
      logo: "💧"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* 1. HERO HEADER */}
      <div className="bg-[#1e3a8a] rounded-[30px] md:rounded-[50px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="z-10 relative">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2 italic">
            Collaborations
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
            Network Partnerships & Authority Access
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 text-[15rem] font-black text-white/5 italic pointer-events-none select-none">
          JOIN
        </div>
      </div>

      {/* 2. PARTNERS GRID */}
      <section className="space-y-6">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 px-4">
          <span className="h-px w-10 bg-slate-200"></span> Verified Partners
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-[#eff6ff] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {partner.logo}
              </div>
              <h4 className="font-black text-blue-900 text-lg leading-tight mb-2 uppercase tracking-tighter">
                {partner.name}
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">
                {partner.type}
              </p>
              
              <div className="space-y-3 mb-8 border-t border-slate-50 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Role</span>
                  <span className="text-[10px] font-bold text-[#1e3a8a]">{partner.role}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Status</span>
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
                    <ShieldCheck size={12} /> {partner.status}
                  </span>
                </div>
              </div>

              <button className="w-full bg-[#f8fafc] text-[#1e3a8a] py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-[#1e3a8a] hover:text-white transition-all flex items-center justify-center gap-2 border border-slate-100">
                Contact Liaison <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CALL TO ACTION AREA */}
      <div className="bg-white p-12 rounded-[50px] border border-slate-100 text-center space-y-6 shadow-sm">
        <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
          <Handshake size={40} />
        </div>
        <h2 className="text-3xl font-black text-[#1e3a8a] tracking-tighter uppercase">Join the Network</h2>
        <p className="max-w-xl mx-auto text-slate-500 font-medium leading-relaxed">
          Request authority access to provide sensor data or validation services for the regional water monitoring network.
        </p>
        <button className="bg-[#1e3a8a] text-white px-12 py-5 rounded-[25px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-blue-900 transition-all">
          Apply for Partnership
        </button>
      </div>
    </div>
  );
}