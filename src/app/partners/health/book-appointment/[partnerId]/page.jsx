"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import { partnerService } from "@/services/partnerService";
import { couponService } from "@/services/couponService";
import useAuthStore from "@/store/authStore";

const getImageUrl = (partner) => {
  if (partner?.images?.length) {
    const primary = partner.images.find((img) => img.isPrimary) || partner.images[0];
    return primary.url;
  }
  return "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80";
};

const getFullAddress = (partner) => {
  if (partner?.address) {
    const { street, city, state, pincode, country } = partner.address;
    return [street, city, state, pincode, country].filter(Boolean).join(", ");
  }
  return "Address not available";
};

const formatCurrency = (value) => {
  if (typeof value !== "number") return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(value);
};

export default function PartnerBookingPage({ params }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const partnerId = resolvedParams?.partnerId;
  const { isAuthenticated } = useAuthStore();
  const [partner, setPartner] = useState(null);
  const [partnerLoading, setPartnerLoading] = useState(true);
  const [partnerError, setPartnerError] = useState("");
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [assignBeneficiary, setAssignBeneficiary] = useState(true);
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryPhone, setBeneficiaryPhone] = useState("");
  const [beneficiaryEmail, setBeneficiaryEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCoupons, setCreatedCoupons] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadPartner = async () => {
      if (!partnerId) return;
      setPartnerLoading(true);
      setPartnerError("");
      try {
        const response = await partnerService.getPartner(partnerId);
        const data = response.data || response.partner || response;
        if (isMounted) {
          setPartner(data);
        }
      } catch (error) {
        console.error("Failed to load partner:", error);
        if (isMounted) {
          setPartnerError("Unable to load partner details");
        }
      } finally {
        if (isMounted) {
          setPartnerLoading(false);
        }
      }
    };

    loadPartner();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPackages = async () => {
      setPackagesLoading(true);
      try {
        const data = await couponService.getPackages();
        const filtered = Array.isArray(data)
          ? data.filter((pkg) => pkg.category?.toLowerCase() === "medical")
          : [];
        if (isMounted) {
          setPackages(filtered);
          if (filtered.length) {
            setSelectedPackageId((current) => current || filtered[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load coupon packages:", error);
        toast.error("Unable to load coupon packages right now");
      } finally {
        if (isMounted) {
          setPackagesLoading(false);
        }
      }
    };

    loadPackages();

    return () => {
      isMounted = false;
    };
  }, [partnerId]);

  const activePackage = useMemo(
    () => packages.find((pkg) => pkg.id === selectedPackageId),
    [packages, selectedPackageId]
  );

  const totalAmount = activePackage ? activePackage.amount * quantity : 0;

  const phone = partner?.phone || partner?.contactPerson?.phone || "N/A";
  const fullAddress = getFullAddress(partner);
  const mapLink = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;
  const imageUrl = getImageUrl(partner);

  const handlePurchase = async () => {
    if (!activePackage) {
      toast.error("Please select a coupon package");
      return;
    }

    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to purchase coupons");
      router.push(`/login?redirect=/partners/health/book-appointment/${partnerId}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await couponService.purchaseCoupons({
        packageId: activePackage.id,
        quantity,
        partnerId: partner?._id,
        beneficiaryName: assignBeneficiary ? beneficiaryName : undefined,
        beneficiaryPhone: assignBeneficiary ? beneficiaryPhone : undefined,
        beneficiaryEmail: assignBeneficiary ? beneficiaryEmail : undefined,
        assignBeneficiary,
        paymentReferences: {
          gateway: "coupon",
          transactionId: `HEAL-${partner?._id || "PARTNER"}-${Date.now()}`
        }
      });

      setCreatedCoupons(response.data?.coupons || []);
      toast.success(response.message || "Coupons generated successfully");
    } catch (error) {
      console.error("Coupon purchase failed:", error);
      toast.error(error?.message || "Failed to generate coupons");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (partnerLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500" />
      </section>
    );
  }

  if (!partner || partnerError) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <div className="text-center max-w-md space-y-3">
          <p className="text-xl font-semibold text-gray-800">Partner not found</p>
          <p className="text-sm text-gray-500">{partnerError || "We could not locate the partner right now."}</p>
          <Link
            href="/partners"
            className="inline-flex px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition"
          >
            Browse Partners
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-16">
      <div className="max-w-6xl mx-auto space-y-12 px-4">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <div className="overflow-hidden rounded-[32px] shadow-2xl relative h-96">
            <Image
              src={imageUrl}
              alt={partner.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>
          <div className="rounded-[32px] bg-white shadow-2xl p-10 flex flex-col gap-4 border border-gray-100">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Health Partner</p>
            <h1 className="text-4xl font-extrabold text-gray-900">Book Your Appointment with {partner.name}</h1>
            <p className="text-gray-600 text-lg">{partner.description}</p>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FaPhoneAlt className="text-green-500" />
              <span>Call / WhatsApp: {phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FaMapMarkerAlt className="text-blue-500" />
              <span>{fullAddress}</span>
            </div>
            <div className="flex gap-3 flex-wrap mt-4">
              <a
                href={phone.replace(/\D/g, "") ? `tel:${phone.replace(/\D/g, "")}` : "#"}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-2xl font-semibold transition hover:from-green-600 hover:to-green-700 text-center"
              >
                Call Now
              </a>
              <Link
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-2xl font-semibold text-center transition hover:from-blue-600 hover:to-indigo-700"
              >
                View on Google Maps
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-[32px] shadow-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="text-lg font-semibold text-gray-800">{partner.contactPerson?.designation || "Doctor"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Days</p>
                <p className="text-lg font-semibold text-gray-800">
                  {Object.entries(partner.operatingHours || {})
                    .filter(([, hours]) => hours.isOpen)
                    .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
                    .join(", ") || "By appointment"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Consultation Fee</p>
                <p className="text-lg font-semibold text-gray-800">
                  ₹{partner.services?.[0]?.price?.toLocaleString("en-IN") || "0"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">NGO Support</p>
                <p className="text-lg font-semibold text-gray-800">₹200 (included)</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl bg-blue-50/70 border border-blue-100 p-6 text-sm text-gray-600">
              <p className="font-semibold text-gray-800 mb-2">How it works</p>
              {partner.services?.slice(0, 3).map((service, idx) => (
                <p key={service.name || idx} className="mb-1">
                  • <span className="font-semibold text-gray-900">{service.name}</span> – {service.description || "Special care"}
                </p>
              ))}
              <p className="text-xs text-gray-500 mt-3">
                After clicking “Book Appointment”, our team will connect within a few minutes to confirm the slot.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 p-8 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sponsor a Health Coupon</h3>
              <p className="text-sm text-gray-600">Donate for diagnostics, medicines, and compassionate care.</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-500">Select Package</label>
              <div className="mt-2 space-y-2">
                {packagesLoading ? (
                  <div className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
                ) : (
                  packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`w-full text-left px-4 py-3 border rounded-2xl transition ${
                        selectedPackageId === pkg.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white hover:border-green-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">{pkg.title}</span>
                        <span className="text-green-600 font-semibold">{formatCurrency(pkg.amount)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{pkg.description}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-500">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setQuantity(value < 1 ? 1 : value);
                }}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-gray-700">Assign beneficiary now?</label>
              <input
                type="checkbox"
                checked={assignBeneficiary}
                onChange={(event) => setAssignBeneficiary(event.target.checked)}
                className="form-checkbox h-5 w-5 text-green-500"
              />
            </div>

            {assignBeneficiary && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="Beneficiary name"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:border-green-500"
                />
                <input
                  type="tel"
                  value={beneficiaryPhone}
                  onChange={(e) => setBeneficiaryPhone(e.target.value)}
                  placeholder="Beneficiary mobile"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:border-green-500"
                />
                <input
                  type="email"
                  value={beneficiaryEmail}
                  onChange={(e) => setBeneficiaryEmail(e.target.value)}
                  placeholder="Beneficiary email (optional)"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:border-green-500"
                />
              </div>
            )}

            <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-600 space-y-2">
              <p>
                Total: <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
              </p>
              <p>
                Validity: <span className="font-semibold text-gray-900">{activePackage?.validityDays ?? "-"} days</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handlePurchase}
              disabled={isSubmitting || packagesLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-2xl font-semibold transition hover:from-green-600 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Generating coupons..." : `Generate ${quantity} coupon${quantity > 1 ? "s" : ""}`}
            </button>

            {createdCoupons.length > 0 && (
              <div className="bg-green-50/80 border border-green-200 rounded-2xl p-4 text-sm text-green-800 space-y-3">
                <p className="font-semibold">Coupons ready to share</p>
                <div className="grid gap-2">
                  {createdCoupons.slice(0, 5).map((coupon) => (
                    <p key={coupon._id} className="bg-white px-3 py-2 rounded-2xl text-xs font-mono text-gray-700">
                      {coupon.code}
                    </p>
                  ))}
                  {createdCoupons.length > 5 && (
                    <p className="text-xs text-gray-500">{createdCoupons.length - 5} more coupons generated</p>
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  View all coupons and track assignments from your{" "}
                  <Link href="/dashboard" className="font-semibold text-green-600 hover:underline">
                    dashboard
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 p-8 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gray-900">Need help before you book?</h3>
          <p className="text-gray-600">
            Chat with our care team or drop an e-mail at{" "}
            <Link href="mailto:carefoundationtrust@gmail.com" className="text-green-600 font-semibold">
              carefoundationtrust@gmail.com
            </Link>
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${phone.replace(/\D/g, "")}`}
              className="px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold border border-green-200"
              target="_blank"
              rel="noreferrer"
            >
              Message on WhatsApp
            </a>
            <a
              href={mapLink}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold border border-blue-200"
            >
              Open Map
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

