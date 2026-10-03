"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Key,
  DollarSign,
  Activity,
  LogOut,
  Plus,
  Search,
  Check,
  Copy,
  Trash2,
  RefreshCw,
  Laptop,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  Shield,
  ArrowUpRight,
  Monitor,
  Ban,
  Calendar,
  Save,
  CheckCircle2,
  Loader2,
  Layers,
  ChevronRight
} from "lucide-react";
import { License, PricingSettings, ActivityLog, PlanType } from "@/lib/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"licenses" | "pricing" | "logs">("licenses");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Licenses state
  const [licenses, setLicenses] = useState<License[]>([]);
  const [stats, setStats] = useState<any>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  // Create license modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlan, setNewPlan] = useState<PlanType>("yearly");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newDuration, setNewDuration] = useState("12");
  const [newCustomKey, setNewCustomKey] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Pricing settings state
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

  // Logs state
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Copied indicator
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Check auth & fetch data
  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const authRes = await fetch("/api/admin/me");
      const authData = await authRes.json();
      if (!authData.authenticated) {
        router.push("/admin/login");
        return;
      }
      await Promise.all([loadLicenses(), loadPricing(), loadLogs()]);
    } catch (err) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const loadLicenses = async () => {
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (statusFilter !== "all") query.set("status", statusFilter);
      if (planFilter !== "all") query.set("plan", planFilter);

      const res = await fetch(`/api/admin/licenses?${query.toString()}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.licenses) {
        setLicenses(data.licenses);
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error("Failed to load licenses", err);
    }
  };

  const loadPricing = async () => {
    try {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      if (data.pricing) setPricing(data.pricing);
    } catch (err) {
      console.error("Failed to load pricing", err);
    }
  };

  const loadLogs = async () => {
    try {
      const res = await fetch("/api/admin/logs");
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (err) {
      console.error("Failed to load logs", err);
    }
  };

  useEffect(() => {
    if (!loading) {
      loadLicenses();
    }
  }, [search, statusFilter, planFilter]);

  const showToast = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Create License
  const handleCreateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: newPlan,
          customerName: newName,
          customerEmail: newEmail,
          organization: newOrg,
          durationMonths: newDuration,
          customKey: newCustomKey || undefined,
          notes: newNotes
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat lisensi.");
      }

      showToast("success", `Lisensi ${data.license.key} berhasil dibuat!`);
      setShowCreateModal(false);
      setNewName("");
      setNewEmail("");
      setNewOrg("");
      setNewCustomKey("");
      setNewNotes("");
      loadLicenses();
      loadLogs();
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Force Disconnect / Reset Device
  const handleResetDevice = async (key: string) => {
    if (!confirm(`Lepas ikatan perangkat (PC) untuk kunci lisensi ${key}? Pengguna akan bisa mengaktifkan kunci ini di PC baru.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/licenses/${encodeURIComponent(key)}/reset-device`, {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mereset perangkat.");
      }
      showToast("success", data.message);
      loadLicenses();
      loadLogs();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  // Toggle Revoke Status
  const handleToggleRevoke = async (key: string, currentStatus: string) => {
    const nextStatus = currentStatus === "revoked" ? "active" : "revoked";
    const label = nextStatus === "revoked" ? "mencabut (revoke)" : "mengaktifkan kembali";
    if (!confirm(`Apakah Anda yakin ingin ${label} lisensi ${key}?`)) return;

    try {
      const res = await fetch(`/api/admin/licenses/${encodeURIComponent(key)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengubah status lisensi.");
      }
      showToast("success", `Status lisensi ${key} kini: ${nextStatus.toUpperCase()}`);
      loadLicenses();
      loadLogs();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  // Extend License (Add 1 month or 1 year)
  const handleExtendExpiry = async (license: License, monthsToAdd: number) => {
    const currentExpiry = new Date(license.expiresAt);
    const newExpiry = new Date(Math.max(Date.now(), currentExpiry.getTime()));
    newExpiry.setMonth(newExpiry.getMonth() + monthsToAdd);

    try {
      const res = await fetch(`/api/admin/licenses/${encodeURIComponent(license.key)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expiresAt: newExpiry.toISOString(),
          status: "active"
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperpanjang masa aktif.");
      }
      showToast(
        "success",
        `Masa aktif diperpanjang hingga ${newExpiry.toLocaleDateString("id-ID")}`
      );
      loadLicenses();
      loadLogs();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  // Delete License
  const handleDeleteLicense = async (key: string) => {
    if (!confirm(`Hapus permanen lisensi ${key}? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      const res = await fetch(`/api/admin/licenses/${encodeURIComponent(key)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus lisensi.");
      }
      showToast("success", `Lisensi ${key} telah dihapus.`);
      loadLicenses();
      loadLogs();
    } catch (err: any) {
      showToast("error", err.message);
    }
  };

  // Save Pricing Settings
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan harga.");
      }
      showToast("success", "Pengaturan harga & paket berhasil diperbarui!");
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          <span>Memuat Portal Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="glass-panel border-b border-slate-800 bg-slate-950/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">Mimbar Connect</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Admin Console
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5">License & Subscription Control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors"
            >
              <span>Landing Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div
            className={`p-3.5 rounded-xl border text-xs font-medium shadow-2xl flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-emerald-950 text-emerald-200 border-emerald-700/80"
                : "bg-red-950 text-red-200 border-red-700/80"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab("licenses")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "licenses"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Manajemen Kunci Lisensi ({stats.total || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "pricing"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Pengaturan Harga & Berlangganan</span>
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "logs"
                ? "bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Audit Log Aktivitas ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* ===================== TAB 1: LICENSES ===================== */}
        {activeTab === "licenses" && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl glass-card border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Total Lisensi</span>
                <div className="text-2xl font-black text-white">{stats.total || 0}</div>
                <div className="text-[11px] text-slate-500 mt-1">Semua terbitan sistem</div>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-slate-800">
                <span className="text-xs text-emerald-400 block mb-1">Terkunci di PC (Aktif)</span>
                <div className="text-2xl font-black text-emerald-300">{stats.boundCount || 0}</div>
                <div className="text-[11px] text-slate-500 mt-1">Sedang dipakai di 1 PC</div>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-slate-800">
                <span className="text-xs text-cyan-400 block mb-1">Lisensi Bebas (Unbound)</span>
                <div className="text-2xl font-black text-cyan-300">
                  {Math.max(0, (stats.active || 0) - (stats.boundCount || 0))}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Siap dipakai di PC baru</div>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-slate-800">
                <span className="text-xs text-amber-400 block mb-1">Kedaluwarsa / Revoked</span>
                <div className="text-2xl font-black text-amber-300">
                  {(stats.expiredCount || 0) + (stats.revokedCount || 0)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Perlu perpanjangan</div>
              </div>
            </div>

            {/* Filter Bar & Create Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari key, nama, email, PC..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Active Saja</option>
                  <option value="expired">Expired</option>
                  <option value="revoked">Revoked</option>
                </select>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none hidden md:block"
                >
                  <option value="all">Semua Paket</option>
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Lisensi Baru</span>
              </button>
            </div>

            {/* License Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="py-3.5 px-4">License Key</th>
                      <th className="py-3.5 px-4">Pelanggan / Organisasi</th>
                      <th className="py-3.5 px-4">Paket</th>
                      <th className="py-3.5 px-4">Status Kunci 1 PC</th>
                      <th className="py-3.5 px-4">Masa Berlaku</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {licenses.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          Tidak ada lisensi yang cocok dengan filter pencarian.
                        </td>
                      </tr>
                    ) : (
                      licenses.map((lic) => {
                        const isExpired = new Date(lic.expiresAt) < new Date();
                        const isBound = !!lic.boundDeviceId;

                        return (
                          <tr key={lic.id} className="hover:bg-slate-900/40 transition-colors">
                            {/* Key */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <code className="font-mono font-bold text-cyan-300 text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                  {lic.key}
                                </code>
                                <button
                                  onClick={() => copyKey(lic.key)}
                                  title="Salin Key"
                                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                  {copiedKey === lic.key ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Customer */}
                            <td className="py-4 px-4">
                              <div className="font-semibold text-slate-200">{lic.customerName}</div>
                              <div className="text-[11px] text-slate-400">{lic.customerEmail}</div>
                              {lic.organization && (
                                <div className="text-[10px] text-slate-400 italic">
                                  {lic.organization}
                                </div>
                              )}
                            </td>

                            {/* Plan */}
                            <td className="py-4 px-4">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                  lic.plan === "yearly"
                                    ? "bg-indigo-950 text-cyan-300 border border-indigo-700/80"
                                    : "bg-slate-900 text-slate-300 border border-slate-800"
                                }`}
                              >
                                {lic.plan}
                              </span>
                            </td>

                            {/* 1 PC Bound Device Status */}
                            <td className="py-4 px-4">
                              {isBound ? (
                                <div className="space-y-1">
                                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[11px] font-semibold">
                                    <Laptop className="w-3.5 h-3.5" />
                                    <span>{lic.boundDeviceName || "PC Terhubung"}</span>
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-400 truncate max-w-[160px]" title={lic.boundDeviceId || ""}>
                                    ID: {lic.boundDeviceId}
                                  </div>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                  <RefreshCw className="w-3 h-3 text-slate-400" />
                                  <span>Bebas (Belum Terikat)</span>
                                </span>
                              )}
                            </td>

                            {/* Expiry */}
                            <td className="py-4 px-4">
                              <div className="text-slate-200">
                                {new Date(lic.expiresAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </div>
                              <div
                                className={`text-[10px] ${
                                  isExpired ? "text-red-400 font-bold" : "text-slate-400"
                                }`}
                              >
                                {isExpired
                                  ? "Sudah Berakhir"
                                  : `${Math.ceil(
                                      (new Date(lic.expiresAt).getTime() - Date.now()) /
                                        (1000 * 60 * 60 * 24)
                                    )} hari lagi`}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4 text-center">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  lic.status === "active"
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                    : lic.status === "revoked"
                                    ? "bg-red-950 text-red-400 border border-red-800"
                                    : "bg-amber-950 text-amber-400 border border-amber-800"
                                }`}
                              >
                                {lic.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Reset Device / Force Disconnect */}
                                {isBound && (
                                  <button
                                    onClick={() => handleResetDevice(lic.key)}
                                    title="Disconnect / Lepas Ikatan PC ini agar bisa dipakai di PC lain"
                                    className="p-1.5 rounded-lg bg-indigo-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800/80 transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Reset PC</span>
                                  </button>
                                )}

                                {/* Extend Expiry (+1 Month) */}
                                <button
                                  onClick={() => handleExtendExpiry(lic, 1)}
                                  title="Perpanjang 1 Bulan"
                                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer text-[10px] font-medium"
                                >
                                  +1 Bln
                                </button>

                                {/* Revoke / Activate Toggle */}
                                <button
                                  onClick={() => handleToggleRevoke(lic.key, lic.status)}
                                  title={lic.status === "revoked" ? "Aktifkan Lisensi" : "Bekukan / Revoke Lisensi"}
                                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer text-[10px] ${
                                    lic.status === "revoked"
                                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                      : "bg-amber-950/60 text-amber-300 border-amber-800"
                                  }`}
                                >
                                  <Ban className="w-3 h-3" />
                                </button>

                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteLicense(lic.key)}
                                  title="Hapus Lisensi Permanen"
                                  className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-800/60 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: PRICING SETTINGS ===================== */}
        {activeTab === "pricing" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="rounded-3xl glass-panel border border-slate-800 p-8 shadow-2xl">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Pengaturan Harga Berlangganan</h3>
                  <p className="text-xs text-slate-400">
                    Perubahan harga di sini akan langsung tampil pada Landing Page dan proses Checkout.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePricing} className="space-y-6">
                {/* Monthly Pricing */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                    Paket Berlangganan Bulanan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Harga Jual Bulanan (IDR):
                      </label>
                      <input
                        type="number"
                        required
                        value={pricing.monthlyPrice}
                        onChange={(e) =>
                          setPricing({ ...pricing, monthlyPrice: Number(e.target.value) })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Harga Asli / Coret (IDR):
                      </label>
                      <input
                        type="number"
                        value={pricing.monthlyOriginalPrice}
                        onChange={(e) =>
                          setPricing({
                            ...pricing,
                            monthlyOriginalPrice: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Yearly Pricing */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
                    Paket Berlangganan Tahunan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Harga Jual Tahunan (IDR):
                      </label>
                      <input
                        type="number"
                        required
                        value={pricing.yearlyPrice}
                        onChange={(e) =>
                          setPricing({ ...pricing, yearlyPrice: Number(e.target.value) })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Harga Asli / Coret Tahunan (IDR):
                      </label>
                      <input
                        type="number"
                        value={pricing.yearlyOriginalPrice}
                        onChange={(e) =>
                          setPricing({
                            ...pricing,
                            yearlyOriginalPrice: Number(e.target.value)
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Label Badge Promo (cth: Hemat 2 Bulan):
                    </label>
                    <input
                      type="text"
                      value={pricing.promoBadgeText}
                      onChange={(e) =>
                        setPricing({ ...pricing, promoBadgeText: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Support Contacts */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Kontak Layanan & Support
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Nomor WhatsApp CS (Format: 628xxx):
                      </label>
                      <input
                        type="text"
                        value={pricing.contactWhatsapp}
                        onChange={(e) =>
                          setPricing({ ...pricing, contactWhatsapp: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Email Support:
                      </label>
                      <input
                        type="email"
                        value={pricing.contactEmail}
                        onChange={(e) =>
                          setPricing({ ...pricing, contactEmail: e.target.value })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan Pengaturan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Harga</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: AUDIT LOGS ===================== */}
        {activeTab === "logs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Log Aktivitas & Riwayat Aktivasi Device</h3>
              <button
                onClick={loadLogs}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Segarkan</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="py-3 px-4">Waktu</th>
                      <th className="py-3 px-4">Aksi</th>
                      <th className="py-3 px-4">License Key</th>
                      <th className="py-3 px-4">Perangkat / Device ID</th>
                      <th className="py-3 px-4">Detail</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-500">
                          Belum ada riwayat aktivitas.
                        </td>
                      </tr>
                    ) : (
                      logs.map((lg) => (
                        <tr key={lg.id} className="hover:bg-slate-900/40">
                          <td className="py-3 px-4 text-slate-400">
                            {new Date(lg.timestamp).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-white uppercase text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {lg.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-cyan-300 font-bold">{lg.licenseKey}</td>
                          <td className="py-3 px-4 text-slate-300">
                            {lg.deviceName ? `${lg.deviceName} ` : ""}
                            {lg.deviceId && <span className="text-slate-400 font-normal">({lg.deviceId})</span>}
                          </td>
                          <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{lg.details || "—"}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                lg.status === "success"
                                  ? "bg-emerald-950 text-emerald-400"
                                  : "bg-red-950 text-red-400"
                              }`}
                            >
                              {lg.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===================== MODAL: BUAT LISENSI BARU ===================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl glass-panel border border-slate-700/80 shadow-2xl p-6 sm:p-8 my-8">
            <h3 className="text-xl font-bold text-white mb-1">Terbitkan Lisensi Baru</h3>
            <p className="text-xs text-slate-400 mb-6">
              Lisensi akan otomatis terkunci pada 1 PC saat pertama kali diaktivasi.
            </p>

            <form onSubmit={handleCreateLicense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pilihan Paket:
                </label>
                <select
                  value={newPlan}
                  onChange={(e) => {
                    const p = e.target.value as PlanType;
                    setNewPlan(p);
                    if (p === "monthly") setNewDuration("1");
                    if (p === "yearly") setNewDuration("12");
                    if (p === "lifetime") setNewDuration("1200");
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="monthly">Bulanan (1 Bulan)</option>
                  <option value="yearly">Tahunan (12 Bulan)</option>
                  <option value="lifetime">Seumur Hidup (Lifetime)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Pelanggan / PIC:
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nama pemegang lisensi"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Pelanggan:
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="pelanggan@example.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Organisasi / Lembaga (Opsional):
                </label>
                <input
                  type="text"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="Gereja / Masjid / Perusahaan"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custom Key (Kosongkan untuk acak):
                </label>
                <input
                  type="text"
                  value={newCustomKey}
                  onChange={(e) => setNewCustomKey(e.target.value.toUpperCase())}
                  placeholder="MBR-XXXX-XXXX-XXXX"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catatan Internal (Opsional):
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Catatan pembelian manual atau promosi"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
                >
                  {actionLoading ? "Membuat..." : "Terbitkan Key"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
