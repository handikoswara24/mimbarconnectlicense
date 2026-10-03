"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Monitor, ShieldCheck, Menu, X, Sparkles, ExternalLink } from "lucide-react";

export function Navbar({ onOpenCheckout }: { onOpenCheckout: (plan: "monthly" | "yearly") => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                Mimbar<span className="text-cyan-400">Connect</span>
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 -mt-1 hidden sm:block">Stage & Operator Synchronization</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#fitur" className="hover:text-cyan-400 transition-colors">
            Fitur
          </a>
          <a href="#perbandingan" className="hover:text-cyan-400 transition-colors">
            Free vs Pro
          </a>
          <a href="#harga" className="hover:text-cyan-400 transition-colors">
            Harga Lisensi
          </a>
          <a href="#panduan" className="hover:text-cyan-400 transition-colors">
            Panduan & API
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-800/60 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Admin Portal</span>
          </Link>
          <button
            onClick={() => onOpenCheckout("yearly")}
            className="flex items-center gap-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 px-4 py-2.5 rounded-lg shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Beli Lisensi Pro</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <a
            href="#fitur"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-cyan-400"
          >
            Fitur
          </a>
          <a
            href="#perbandingan"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-cyan-400"
          >
            Free vs Pro
          </a>
          <a
            href="#harga"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-cyan-400"
          >
            Harga Lisensi
          </a>
          <a
            href="#panduan"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-cyan-400"
          >
            Panduan & API
          </a>
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 text-sm text-slate-300 py-2.5 rounded-lg bg-slate-900 border border-slate-800"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckout("yearly");
              }}
              className="w-full text-center text-sm font-semibold text-white py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600"
            >
              Beli Lisensi Pro Sekarang
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
