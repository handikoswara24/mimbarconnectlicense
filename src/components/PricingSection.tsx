"use client";

import React, { useState, useEffect } from "react";
import { Check, Sparkles, Shield, ArrowRight, Clock, Laptop, RefreshCw } from "lucide-react";
import { PricingSettings } from "@/lib/types";

interface PricingProps {
  onOpenCheckout: (plan: "monthly" | "yearly") => void;
}

export function PricingSection({ onOpenCheckout }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [pricing, setPricing] = useState<PricingSettings>({
    monthlyPrice: 49000,
    monthlyOriginalPrice: 79000,
    yearlyPrice: 490000,
    yearlyOriginalPrice: 790000,
    currency: "IDR",
    promoBadgeText: "Hemat 2 Bulan",
    contactWhatsapp: "6281234567890",
    contactEmail: "support@mimbarconnect.com"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.pricing) {
          setPricing(data.pricing);
        }
      })
      .catch((err) => console.error("Error fetching pricing:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <section id="harga" className="py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/15 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Investasi Pelayanan Terbaik</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Pilihan Berlangganan Fleksibel
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Dapatkan akses penuh ke fitur canggih Screen Mirroring, Laser Overlay di Layar Proyektor Asli, dan Notifikasi Prioritas.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-slate-800 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Langganan Bulanan
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Langganan Tahunan</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                {pricing.promoBadgeText || "Hemat"}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Card 1: Free Tier */}
          <div className="rounded-3xl glass-card p-8 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                  Starter / Free
                </span>
                <span className="text-xs text-slate-500 font-medium">Bawaan</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Mimbar Standar</h3>
              <p className="text-xs text-slate-400 mb-6">
                Cocok untuk kebutuhan kendali presentasi sederhana & pesan teks dasar.
              </p>

              <div className="mb-6 pb-6 border-b border-slate-800">
                <div className="text-4xl font-extrabold text-white">Rp 0</div>
                <div className="text-xs text-slate-400 mt-1">Gratis selamanya, tanpa kartu kredit</div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Kontrol Slide Next / Previous</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Kirim Pesan Teks Operator ke Mimbar</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Koneksi Wi-Fi Jaringan Lokal</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <span className="w-4 text-center">—</span>
                  <span className="line-through">Screen Mirroring Operator</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <span className="w-4 text-center">—</span>
                  <span className="line-through">Laser Pointer Interaktif Layar</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <span className="w-4 text-center">—</span>
                  <span className="line-through">OS-Level Projector Overlay</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <a
                href="#panduan"
                className="w-full block text-center py-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 transition-colors"
              >
                Gunakan Versi Free
              </a>
            </div>
          </div>

          {/* Card 2: PRO TIER (Featured) */}
          <div className="rounded-3xl glass-panel p-8 border-2 border-cyan-500/70 relative flex flex-col justify-between shadow-2xl shadow-cyan-500/10 scale-100 lg:-translate-y-2 lg:scale-105">
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Paket Paling Populer</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                  {billingCycle === "yearly" ? "Pro Tahunan" : "Pro Bulanan"}
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5" /> Lisensi 1 PC Lock
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Mimbar Connect Pro</h3>
              <p className="text-xs text-slate-400 mb-6">
                Untuk gereja, masjid, auditorium, studio, dan presenter profesional yang butuh kendali panggung penuh.
              </p>

              <div className="mb-6 pb-6 border-b border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">
                    {billingCycle === "yearly"
                      ? formatRupiah(pricing.yearlyPrice)
                      : formatRupiah(pricing.monthlyPrice)}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    {billingCycle === "yearly" ? "/ tahun" : "/ bulan"}
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500 line-through">
                      {formatRupiah(pricing.yearlyOriginalPrice)}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
                      Hemat 2 Bulan (20%)
                    </span>
                  </div>
                )}
                {billingCycle === "monthly" && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500 line-through">
                      {formatRupiah(pricing.monthlyOriginalPrice)}
                    </span>
                    <span className="text-xs text-cyan-400">Harga Promo Pengguna Baru</span>
                  </div>
                )}
              </div>

              <div className="space-y-3.5 text-xs text-slate-200">
                <div className="flex items-center gap-2.5 font-semibold text-cyan-300">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Semua Fitur Free Termasuk</span>
                </div>
                <div className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Ultra Low-Latency Screen Mirroring (WebRTC)</span>
                </div>
                <div className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Laser Pointer Interaktif Layar Panggung</span>
                </div>
                <div className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>OS-Level Laser Overlay di Proyektor Windows</span>
                </div>
                <div className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>QR Code Auto-Discovery (Koneksi Instan)</span>
                </div>
                <div className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Stage Keep-Awake / Anti Sleep Mode</span>
                </div>
                <div className="flex items-center gap-2.5 font-medium text-emerald-300">
                  <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mudah Disconnect & Transfer Lisensi ke PC Baru</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <button
                onClick={() => onOpenCheckout(billingCycle)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <span>Beli Lisensi {billingCycle === "yearly" ? "Tahunan" : "Bulanan"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Aktivasi instan otomatis & panduan setup lengkap
              </p>
            </div>
          </div>

          {/* Card 3: Enterprise / Multi-PC Custom */}
          <div className="rounded-3xl glass-card p-8 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800 text-indigo-300 border border-indigo-900/60">
                  Lembaga / Multi-Ruang
                </span>
                <span className="text-xs text-slate-500 font-medium">Custom</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Multi-Venue</h3>
              <p className="text-xs text-slate-400 mb-6">
                Untuk institusi dengan banyak ruang ibadah, gedung serbaguna, atau kampus dengan &gt;3 PC.
              </p>

              <div className="mb-6 pb-6 border-b border-slate-800">
                <div className="text-3xl font-extrabold text-white">Hubungi Tim</div>
                <div className="text-xs text-slate-400 mt-1">Diskon khusus pembelian &gt;3 PC sekaligus</div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Semua Fitur Pro Lengkap</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multiple Lisensi Bundling</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pelatihan & Pendampingan Setup Operator</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Prioritas Konsultasi via WhatsApp</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Faktur / Invoice Lembaga Resmi</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <a
                href={`https://wa.me/${pricing.contactWhatsapp || "6281234567890"}?text=Halo%20Admin%20Mimbar%20Connect,%20saya%20tertarik%20dengan%20paket%20Multi-Venue`}
                target="_blank"
                rel="noreferrer"
                className="w-full block text-center py-3 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                Konsultasi WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Device Lock Policy Notice */}
        <div className="mt-12 max-w-3xl mx-auto rounded-2xl bg-indigo-950/30 border border-indigo-800/40 p-5 flex items-start gap-4 text-xs text-slate-300">
          <div className="p-2 rounded-lg bg-indigo-900/50 border border-indigo-700/60 text-cyan-400 shrink-0">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-white text-sm">Kebijakan 1 PC Lock & Kemudahan Pindah Perangkat</h4>
            <p className="leading-relaxed text-slate-400">
              Setiap 1 License Key Pro dikhususkan untuk 1 komputer operator utama panggung. 
              Jika Anda perlu mengganti laptop atau memindahkan lisensi ke PC cadangan, Anda tidak perlu membeli lisensi baru! 
              Cukup tekan tombol <span className="text-cyan-400 font-semibold font-mono">"Disconnect Key"</span> di aplikasi, dan lisensi langsung siap diaktifkan di PC baru.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
