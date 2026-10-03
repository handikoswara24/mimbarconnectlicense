import React from "react";
import { Check, X, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";

export function ComparisonTable({ onOpenCheckout }: { onOpenCheckout: (plan: "monthly" | "yearly") => void }) {
  const comparisonItems = [
    {
      feature: "Kontrol Navigasi Slide (Next / Previous)",
      desc: "Tombol ganti slide dari mimbar ke operator dan sebaliknya",
      free: true,
      pro: true
    },
    {
      feature: "Kirim Pesan Teks Standar Operator ke Mimbar",
      desc: "Instruksi teks ringkas / cue panggung ke layar mimbar",
      free: true,
      pro: true
    },
    {
      feature: "Koneksi Jaringan Lokal (Wi-Fi / LAN)",
      desc: "Komunikasi antar perangkat dalam 1 router lokal",
      free: true,
      pro: true
    },
    {
      feature: "Ultra Low-Latency Screen Mirroring",
      desc: "Menampilkan layar PowerPoint/ProPresenter langsung di tablet mimbar",
      free: false,
      pro: true
    },
    {
      feature: "Laser Pointer Interaktif Layar Panggung",
      desc: "Menggambar sorotan laser langsung dari sentuhan layar tablet mimbar",
      free: false,
      pro: true
    },
    {
      feature: "OS-Level Native Laser Overlay (Proyektor Panggung)",
      desc: "Laser tampil otomatis di atas tampilan proyektor Windows yang sedang aktif",
      free: false,
      pro: true
    },
    {
      feature: "Stage Keep-Awake / Anti Sleep (NoSleep)",
      desc: "Mencegah tablet mimbar tertidur atau mati otomatis di tengah ibadah",
      free: false,
      pro: true
    },
    {
      feature: "QR Code Auto-Discovery",
      desc: "Koneksi otomatis tanpa perlu mengetik IP address secara manual",
      free: false,
      pro: true
    },
    {
      feature: "Kustomisasi Durasi Pesan & Peringatan Mendesak",
      desc: "Pesan kedip / broadcast mendesak dengan pengaturan waktu fleksibel",
      free: false,
      pro: true
    },
    {
      feature: "Lisensi 1 PC dengan Fitur Transfer Fleksibel (Disconnect)",
      desc: "Kunci aman di 1 PC, bisa dipindahkan ke laptop lain kapan saja via Disconnect",
      free: false,
      pro: true
    },
    {
      feature: "Dukungan Teknis Prioritas & Update Aplikasi Otomatis",
      desc: "Update rilis terbaru dan bantuan setup teknis dari tim pengembang",
      free: false,
      pro: true
    }
  ];

  return (
    <section id="perbandingan" className="py-20 bg-slate-900/40 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Matriks Perbandingan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Pilih Paket Sesuai Kebutuhan Acara Anda
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Gunakan versi Free untuk kebutuhan dasar, atau upgrade ke Pro untuk performa visual panggung profesional.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="py-5 px-6 text-sm font-semibold text-slate-300 w-1/2">
                    Fitur & Kemampuan
                  </th>
                  <th className="py-5 px-6 text-center text-sm font-bold text-slate-300 w-1/4">
                    <div className="text-slate-300 text-base">Free Plan</div>
                    <div className="text-xs text-slate-400 font-normal mt-0.5">Rp 0 (Selamanya)</div>
                  </th>
                  <th className="py-5 px-6 text-center text-sm font-bold text-cyan-400 w-1/4 bg-cyan-950/30 border-l border-r border-cyan-800/30">
                    <div className="flex items-center justify-center gap-1.5 text-base">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Pro Plan</span>
                    </div>
                    <div className="text-xs text-cyan-300/80 font-normal mt-0.5">Bulanan / Tahunan</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-sm">
                {comparisonItems.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-200">{item.feature}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {item.free ? (
                        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-slate-600 border border-slate-800">
                          <X className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center bg-cyan-950/20 border-l border-r border-cyan-800/30">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900/60 border-t border-slate-800">
                  <td className="py-5 px-6 text-xs text-slate-400">
                    *Lisensi Pro hanya aktif pada 1 PC dalam satu waktu. Fitur Disconnect tersedia untuk memindahkan lisensi ke PC lain.
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className="inline-block px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300">
                      Gratis Bawaan
                    </span>
                  </td>
                  <td className="py-5 px-6 text-center bg-cyan-950/30 border-l border-r border-cyan-800/30">
                    <button
                      onClick={() => onOpenCheckout("yearly")}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-cyan-500/20 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Upgrade ke Pro</span>
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
