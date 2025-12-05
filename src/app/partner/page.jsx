"use client";

import PartnerForm from "@/components/PartnerForm";
import DonationCard from "@/components/DonationCard";

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50">
      <div className="pt-20">
        <PartnerForm />
        <div className="container mx-auto px-6 pb-16">
          <DonationCard />
        </div>
      </div>
    </div>
  );
}

