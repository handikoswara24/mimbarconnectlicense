"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Copy, Sparkles, ShieldCheck, QrCode, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { PricingSettings } from "@/lib/types";

interface CheckoutModalProps {
  isOpen: boolean;
  initialPlan: "monthly" | "yearly";
  onClose: () => void;
}

export function CheckoutModal({ isOpen, initialPlan, onClose }: CheckoutModalProps) {
  const [plan, setPlan] = useState<"monthly" | "yearly">(initialPlan);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchasedKey, setPurchasedKey] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
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

  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d) => {
        if (d.pricing) setPricing(d.pricing);
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const currentPrice = plan === "yearly" ? pricing.yearlyPrice : pricing.monthlyPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nama lengkap harus diisi.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Alamat email tidak valid.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/license/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          customerName: name,
          customerEmail: email,
          organization,
          paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memproses pembayaran lisensi.");
      }

      setPurchasedKey(data.order);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-slate-700/80 shadow-2xl p-6 sm:p-8 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!purchasedKey ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-indigo-950 text-cyan-400 border border-indigo-800/80">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-xl font-bold text-white">Beli Lisensi Mimbar Connect</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Aktivasi instan otomatis. Key langsung terbit setelah konfirmasi pembayaran.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Plan Choice Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Pilih Paket:</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPlan("monthly")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      plan === "monthly"
                        ? "bg-indigo-950/60 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Bulanan</span>
                      {plan === "monthly" && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="text-sm font-extrabold text-white mt-1">
                      Rp {pricing.monthlyPrice.toLocaleString("id-ID")}
                    </div>
                    <div className="text-[10px] text-slate-400">/ 1 Bulan</div>
                  </div>

                  <div
                    onClick={() => setPlan("yearly")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all relative ${
                      plan === "yearly"
                        ? "bg-indigo-950/60 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Tahunan</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold">
                        HEMAT
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-white mt-1">
                      Rp {pricing.yearlyPrice.toLocaleString("id-ID")}
                    </div>
                    <div className="text-[10px] text-cyan-400">/ 12 Bulan (Hemat 2 Bln)</div>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap / PIC:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Samuel Hutapea / Ahmad Fauzi"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Penerima Key:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email.operator@gmail.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Gereja / Masjid / Organisasi: <span className="text-slate-500">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Contoh: GBI Kasih Karunia / Masjid Al-Falah"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Metode Pembayaran:</label>
                <div className="grid grid-cols-3 gap-2">
                  {["QRIS", "BCA / Mandiri VA", "Transfer Bank"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 px-2 rounded-lg text-[11px] font-medium border text-center transition-all cursor-pointer ${
                        paymentMethod === m
                          ? "bg-cyan-950/80 border-cyan-500 text-cyan-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total Pembayaran:</span>
                  <div className="text-lg font-extrabold text-white">
                    Rp {currentPrice.toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                  Pembayaran Instan Terverifikasi
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menerbitkan Lisensi...</span>
                  </>
                ) : (
                  <>
                    <span>Bayar & Dapatkan Key Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE: SHOW KEY */
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white">Pembelian Berhasil!</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Terima kasih, <strong>{purchasedKey.customerName}</strong>. License Key Pro Anda telah aktif dan siap digunakan.
            </p>

            {/* Generated Key Card */}
            <div className="bg-slate-900 border-2 border-dashed border-cyan-500/80 rounded-2xl p-5 mb-6 text-left relative">
              <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                Kunci Lisensi Anda (1 PC):
              </span>
              <div className="flex items-center justify-between gap-3">
                <code className="text-lg sm:text-xl font-mono font-bold text-white tracking-wider break-all select-all">
                  {purchasedKey.licenseKey}
                </code>
                <button
                  onClick={() => copyToClipboard(purchasedKey.licenseKey)}
                  className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Tersalin!" : "Salin Key"}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <div>
                  Paket: <span className="font-semibold text-white capitalize">{purchasedKey.plan}</span>
                </div>
                <div>
                  Aktif Sampai:{" "}
                  <span className="font-semibold text-white">
                    {new Date(purchasedKey.expiresAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps Guide */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-2 mb-6">
              <div className="font-semibold text-slate-200">Cara Aktivasi di Mimbar Connect Desktop:</div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400">
                <li>Buka aplikasi <span className="text-white font-medium">Mimbar Connect</span> di laptop operator.</li>
                <li>Masuk ke menu <span className="text-white font-medium">Pengaturan / Lisensi Pro</span>.</li>
                <li>Tempel (Paste) kunci lisensi di atas dan klik <span className="text-cyan-400 font-medium">Aktivasi</span>.</li>
              </ol>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup & Selesai
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
