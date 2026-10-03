import React from "react";
import Link from "next/link";
import { Monitor, ShieldCheck, Mail, MessageCircle, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center">
                <Monitor className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-white">
                Mimbar<span className="text-cyan-400">Connect</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Sistem kendali teleprompter & sinkronisasi layar panggung profesional untuk gereja, masjid, auditorium, dan seminar.
            </p>
            <div className="pt-2 flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>support@mimbarconnect.com</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <a href="#fitur" className="hover:text-cyan-400 transition-colors">
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#perbandingan" className="hover:text-cyan-400 transition-colors">
                  Perbandingan Free vs Pro
                </a>
              </li>
              <li>
                <a href="#harga" className="hover:text-cyan-400 transition-colors">
                  Harga & Langganan
                </a>
              </li>
              <li>
                <a href="#panduan" className="hover:text-cyan-400 transition-colors">
                  Dokumentasi API
                </a>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">Pengelola</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin"
                  className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Portal</span>
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Keamanan: 1 PC Hardware Lock</span>
              </li>
              <li>
                <span className="text-slate-400">Status Server: Normal (Operational)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© {new Date().getFullYear()} Mimbar Connect. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Dibuat untuk kelancaran presentasi & ibadah tanpa hambatan.
          </p>
        </div>
      </div>
    </footer>
  );
}
