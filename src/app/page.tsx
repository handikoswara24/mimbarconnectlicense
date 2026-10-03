"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ComparisonTable } from "@/components/ComparisonTable";
import { PricingSection } from "@/components/PricingSection";
import { ApiDocumentation } from "@/components/ApiDocumentation";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  const handleOpenCheckout = (plan: "monthly" | "yearly") => {
    setSelectedPlan(plan);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar onOpenCheckout={handleOpenCheckout} />
      <main className="flex-1">
        <Hero onOpenCheckout={handleOpenCheckout} />
        <Features />
        <ComparisonTable onOpenCheckout={handleOpenCheckout} />
        <PricingSection onOpenCheckout={handleOpenCheckout} />
        <ApiDocumentation />
      </main>
      <Footer />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        initialPlan={selectedPlan}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </div>
  );
}
