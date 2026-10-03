"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Play, Shield, RefreshCw, Key, Laptop, Code2, AlertTriangle } from "lucide-react";

export function ApiDocumentation() {
  const [activeTab, setActiveTab] = useState<"activate" | "validate" | "disconnect" | "snippet">("activate");
  const [testKey, setTestKey] = useState("MBR-TEST-LOCK-PC99");
  const [testDeviceId, setTestDeviceId] = useState("PC-DESKTOP-STAGE-01");
  const [testDeviceName, setTestDeviceName] = useState("OPERATOR-LAPTOP-MSI");
  const [apiResponse, setApiResponse] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runTestApi = async (endpoint: string, payload: any) => {
    setLoading(true);
    setApiResponse(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setApiResponse({ status: res.status, ok: res.ok, body: data });
    } catch (err: any) {
      setApiResponse({ status: 500, ok: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippet = `// Contoh Integrasi TypeScript / Node.js untuk Desktop App 'mimbar-connect'
// Simpan di: src/lib/licenseClient.ts

const API_BASE = "http://localhost:3000"; // Ganti dengan domain server lisensi Anda

export interface LicenseValidationResult {
  valid: boolean;
  plan?: "monthly" | "yearly";
  features?: string[];
  expiresAt?: string;
  reason?: string;
  message?: string;
}

// 1. Aktivasi / Input License Key (Terkunci pada 1 Device ID)
export async function activateLicense(key: string, deviceId: string, deviceName: string) {
  const res = await fetch(\`\${API_BASE}/api/license/activate\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, deviceId, deviceName, osInfo: navigator.userAgent })
  });
  return await res.json();
}

// 2. Validasi License (Dijalankan saat startup aplikasi & heartbeat)
export async function validateLicense(key: string, deviceId: string): Promise<LicenseValidationResult> {
  const res = await fetch(\`\${API_BASE}/api/license/validate\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, deviceId })
  });
  return await res.json();
}

// 3. Disconnect License (Melepas kunci perangkat agar bisa dipakai di PC lain)
export async function disconnectLicense(key: string, deviceId: string) {
  const res = await fetch(\`\${API_BASE}/api/license/disconnect\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, deviceId })
  });
  return await res.json();
}`;

  return (
    <section id="panduan" className="py-20 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Dokumentasi API Desktop App</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Integrasi API untuk Aplikasi Mimbar Connect
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Endpoint RESTful siap pakai untuk aktivasi kunci, verifikasi berkala, dan pemutusan lisensi (1 PC Device Lock).
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab("activate");
              setApiResponse(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "activate"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>1. POST /api/license/activate</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("validate");
              setApiResponse(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "validate"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>2. POST /api/license/validate</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("disconnect");
              setApiResponse(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "disconnect"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>3. POST /api/license/disconnect</span>
          </button>
          <button
            onClick={() => setActiveTab("snippet")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "snippet"
                ? "bg-indigo-900 text-indigo-200 border border-indigo-700/80 shadow"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Snippet TypeScript</span>
          </button>
        </div>

        {/* Content Box */}
        {activeTab !== "snippet" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/90 rounded-3xl border border-slate-800 p-6">
            {/* Left: Input Sandbox Form */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Test Sandbox Form
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  {activeTab === "activate"
                    ? "POST /api/license/activate"
                    : activeTab === "validate"
                    ? "POST /api/license/validate"
                    : "POST /api/license/disconnect"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">License Key:</label>
                <input
                  type="text"
                  value={testKey}
                  onChange={(e) => setTestKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Demo key: <code className="text-slate-300">MBR-TEST-LOCK-PC99</code> (sudah terkunci) atau <code className="text-slate-300">MBR-DEMO-2026-PRO1</code> (bebas)
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Device Hardware ID (PC ID):
                </label>
                <input
                  type="text"
                  value={testDeviceId}
                  onChange={(e) => setTestDeviceId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {activeTab === "activate" && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Device Name:
                  </label>
                  <input
                    type="text"
                    value={testDeviceName}
                    onChange={(e) => setTestDeviceName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <button
                onClick={() => {
                  if (activeTab === "activate") {
                    runTestApi("/api/license/activate", {
                      key: testKey,
                      deviceId: testDeviceId,
                      deviceName: testDeviceName
                    });
                  } else if (activeTab === "validate") {
                    runTestApi("/api/license/validate", {
                      key: testKey,
                      deviceId: testDeviceId
                    });
                  } else {
                    runTestApi("/api/license/disconnect", {
                      key: testKey,
                      deviceId: testDeviceId
                    });
                  }
                }}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all shadow-md shadow-cyan-600/20"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{loading ? "Mengirim Permintaan..." : "Kirim Request (Test Sekarang)"}</span>
              </button>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Catatan Perilaku 1 PC:</div>
                <p>
                  Jika Anda mencoba mengaktifkan <code className="text-cyan-400">MBR-TEST-LOCK-PC99</code> dengan Device ID yang berbeda (misal: <code>PC-BERBEDA-999</code>), sistem akan otomatis menolak dan meminta untuk Disconnect terlebih dahulu.
                </p>
              </div>
            </div>

            {/* Right: Response Output */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Hasil Respons Server JSON
                </span>
                {apiResponse && (
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                      apiResponse.ok
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : "bg-red-950 text-red-300 border border-red-800"
                    }`}
                  >
                    HTTP {apiResponse.status}
                  </span>
                )}
              </div>

              <div className="flex-1 min-h-[220px] bg-slate-950 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800 text-slate-300 flex flex-col justify-center">
                {apiResponse ? (
                  <pre className="text-emerald-400 whitespace-pre-wrap">
                    {JSON.stringify(apiResponse.body || apiResponse, null, 2)}
                  </pre>
                ) : (
                  <div className="text-center text-slate-400">
                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-300" />
                    <p>Klik tombol "Kirim Request (Test Sekarang)" untuk melihat respons real-time dari API.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Code Snippet Tab */
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Kode TypeScript untuk di-copy ke Desktop App
                </span>
              </div>
              <button
                onClick={() => copyCode(codeSnippet)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800/80 leading-relaxed">
              {codeSnippet}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
