import React from "react";
import {
  SlidersHorizontal,
  MessageSquare,
  MonitorPlay,
  Crosshair,
  QrCode,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  Cpu
} from "lucide-react";

export function Features() {
  const featureList = [
    {
      title: "Kontrol Slide Next / Previous",
      category: "Free & Pro",
      isFree: true,
      icon: <SlidersHorizontal className="w-6 h-6 text-emerald-400" />,
      desc: "Kendalikan perpindahan slide presentasi dengan tombol navigasi instan. Operator atau pembicara dapat memindahkan halaman secara sinkron tanpa jeda."
    },
    {
      title: "Pesan Operator ke Mimbar",
      category: "Free & Pro",
      isFree: true,
      icon: <MessageSquare className="w-6 h-6 text-emerald-400" />,
      desc: "Kirim pesan teks rahasia, instruksi waktu (cue), atau pengumuman dari operator ke layar mimbar tanpa terlihat oleh audiens di proyektor utama."
    },
    {
      title: "Ultra Low-Latency Screen Mirroring",
      category: "Fitur Pro",
      isFree: false,
      icon: <MonitorPlay className="w-6 h-6 text-cyan-400" />,
      desc: "Tampilkan mirror tampilan presentasi, EasyWorship, PowerPoint, atau layar penuh operator ke tablet mimbar secara langsung via WebRTC berkecepatan tinggi."
    },
    {
      title: "Laser Pointer Interaktif Panggung",
      category: "Fitur Pro",
      isFree: false,
      icon: <Crosshair className="w-6 h-6 text-indigo-400" />,
      desc: "Pembicara atau Worship Leader dapat menyentuh layar tablet mimbar untuk menyorot poin penting dengan laser virtual merah, hijau, atau biru secara real-time."
    },
    {
      title: "OS Native Laser Overlay di Proyektor",
      category: "Fitur Pro",
      isFree: false,
      icon: <Cpu className="w-6 h-6 text-violet-400" />,
      desc: "Titik laser dari tablet mimbar diteruskan langsung ke layer native Windows di atas layar proyektor utama tanpa mengganggu aplikasi presentasi yang sedang jalan."
    },
    {
      title: "Stage Keep-Awake & QR Auto-Connect",
      category: "Fitur Pro",
      isFree: false,
      icon: <QrCode className="w-6 h-6 text-amber-400" />,
      desc: "Cukup scan QR code dari HP / tablet mimbar untuk langsung tersambung. Fitur NoSleep memastikan layar panggung tidak pernah mati atau mengunci sendiri."
    }
  ];

  return (
    <section id="fitur" className="py-20 bg-slate-950/60 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Fitur Komprehensif</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dirancang Khusus untuk Ibadah, Seminar, & Acara Akbar
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Mimbar Connect menghilangkan kebingungan komunikasi antara tim audio-visual di ruang operator dengan penceramah di atas panggung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl glass-card transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 flex flex-col justify-between ${
                !item.isFree ? "relative overflow-hidden group" : ""
              }`}
            >
              {!item.isFree && (
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />
              )}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      item.isFree
                        ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                        : "bg-indigo-950/90 text-cyan-400 border border-indigo-700/70"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{item.isFree ? "Tersedia Gratis Selamanya" : "Memerlukan Lisensi Pro"}</span>
                <span className="font-semibold text-slate-300">{item.isFree ? "Versi Standar" : "Lisensi 1 PC"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
