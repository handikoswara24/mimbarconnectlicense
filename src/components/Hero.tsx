"use client";

import React, { useState, useEffect } from "react";
import {
  Monitor,
  Tv,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Send,
  Crosshair,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Zap
} from "lucide-react";

export function Hero({ onOpenCheckout }: { onOpenCheckout: (plan: "monthly" | "yearly") => void }) {
  // Interactive Simulator State
  const [slideNumber, setSlideNumber] = useState(3);
  const [activeMessage, setActiveMessage] = useState("Waktu tersisa 5 menit lagi untuk sesi khotbah / presentasi.");
  const [inputMsg, setInputMsg] = useState("");
  const [laserPos, setLaserPos] = useState({ x: 55, y: 40 });
  const [isLaserActive, setIsLaserActive] = useState(true);
  const [simTime, setSimTime] = useState("10:45:20");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSimTime(now.toLocaleTimeString("id-ID", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setActiveMessage(inputMsg);
    setInputMsg("");
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/15 to-purple-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/90 border border-slate-700/60 text-slate-300 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Versi Resmi Desktop & Web Hub</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-950/70 border border-indigo-700/60 text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fitur Pro: Mirroring Layar + Laser OS Interaktif</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
            Kendali Panggung & Mimbar Modern{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              Tanpa Hambatan & Bebas Latensi
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Hubungkan laptop operator audio-visual dengan tablet mimbar penceramah / pembicara. 
            Mulai dari kontrol slide & pesan teks gratis, hingga mirror layar langsung dan laser pointer interaktif Pro.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenCheckout("yearly")}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-indigo-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Dapatkan Lisensi Pro Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#perbandingan"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-all"
            >
              <span>Pelajari Fitur Free vs Pro</span>
            </a>
          </div>

          <div className="mt-5 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Lisensi Kunci = 1 PC Aman
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fleksibel Disconnect & Pindah PC
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Aktivasi Instan Otomatis
            </span>
          </div>
        </div>

        {/* INTERACTIVE DUAL SIMULATOR (Operator Desk <-> Mimbar Podium Screen) */}
        <div className="mt-8 relative max-w-5xl mx-auto rounded-2xl glass-panel p-2 sm:p-4 border border-slate-800/90 shadow-2xl">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 mb-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-slate-400">Simulasi Interaktif: Mimbar Connect in Action</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-cyan-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Koneksi WebSocket Aktif
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Operator View Mockup */}
            <div className="lg:col-span-6 bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Tampilan Operator</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                    Mode Kendali
                  </span>
                </div>

                {/* Slide Control Section (Free Feature) */}
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 mb-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 font-medium">Navigasi Slide Presentasi:</span>
                    <span className="text-cyan-400 font-mono font-semibold">Slide #{slideNumber} dari 24</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSlideNumber(Math.max(1, slideNumber - 1))}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev Slide</span>
                    </button>
                    <button
                      onClick={() => setSlideNumber(slideNumber + 1)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      <span>Next Slide</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Send Prompt Message (Free Feature) */}
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 mb-3">
                  <span className="text-xs text-slate-400 block mb-1.5 font-medium">Kirim Pesan Cepat ke Mimbar:</span>
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputMsg}
                      onChange={(e) => setInputMsg(e.target.value)}
                      placeholder="Ketik pesan untuk pembicara..."
                      className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Kirim</span>
                    </button>
                  </form>
                </div>

                {/* Laser Pointer Switch (Pro Feature) */}
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-300">OS Virtual Laser Pointer</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">PRO</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Sorotan laser tertampil di layar mimbar & proyektor</p>
                  </div>
                  <button
                    onClick={() => setIsLaserActive(!isLaserActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isLaserActive
                        ? "bg-red-500/20 text-red-400 border border-red-500/40"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isLaserActive ? "Laser ON" : "Laser OFF"}
                  </button>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Perangkat: PC-OPERATOR-WIN11</span>
                <span className="text-emerald-400 font-mono">Status: Connected</span>
              </div>
            </div>

            {/* Right: Mimbar Stage Display Mockup */}
            <div className="lg:col-span-6 bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
              {/* Header on Mimbar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Layar Panggung / Mimbar</span>
                </div>
                <div className="font-mono text-base font-bold text-cyan-400 tracking-wider">
                  {simTime}
                </div>
              </div>

              {/* Main Stage Simulation Area */}
              <div
                className="relative my-3 min-h-[170px] bg-slate-900/60 rounded-xl border border-dashed border-slate-800 p-4 flex flex-col items-center justify-center cursor-crosshair group overflow-hidden"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setLaserPos({ x, y });
                }}
              >
                {/* Mirror Screen simulation background */}
                <div className="text-center select-none pointer-events-none">
                  <div className="inline-block px-3 py-1 rounded bg-slate-800/70 border border-slate-700/60 text-[11px] text-slate-300 font-semibold mb-2">
                    MIRROR LAYAR PROYEKTOR • SLIDE {slideNumber}
                  </div>
                  <p className="text-base font-bold text-white mb-1">
                    Tema: Menembus Batas Pelayanan Digital
                  </p>
                  <p className="text-xs text-slate-400">
                    Arahkan kursor mouse ke kotak ini untuk menggerakkan Laser Pointer!
                  </p>
                </div>

                {/* Laser Dot Point */}
                {isLaserActive && (
                  <div
                    className="absolute pointer-events-none transition-all duration-75 ease-out"
                    style={{
                      left: `${laserPos.x}%`,
                      top: `${laserPos.y}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-ping opacity-75" />
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_15px_#ef4444] border-2 border-white absolute inset-0 m-auto" />
                    </div>
                  </div>
                )}
              </div>

              {/* Live Operator Message Banner on Stage */}
              <div className="bg-amber-950/40 border border-amber-600/40 rounded-lg p-2.5 text-xs text-amber-200 flex items-start gap-2 animate-pulse">
                <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase">
                  Pesan Operator
                </span>
                <span className="font-medium text-amber-100 flex-1">{activeMessage}</span>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Tablet Mimbar (iPad / Android / Monitor)</span>
                <span className="text-cyan-400">Keep-Awake Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
