"use client";
import { useState, useEffect } from "react";
import { couponService } from "@/services/couponService";
import { BiGift, BiTime, BiCheckCircle } from "react-icons/bi";
import { FaTag, FaPercent } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CouponsSection() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        const response = await couponService.getCoupons({
          limit: 6,
          status: 'active',
          isPublic: true
        });
        setCoupons(response.data || []);
      } catch (error) {
        console.error("Failed to load coupons:", error);
        // Silently handle errors - don't show toast for public page
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const formatCouponValue = (coupon) => {
    if (coupon.value?.percentage) {
      return `${coupon.value.percentage}% OFF`;
    }
    if (coupon.value?.amount) {
      return `₹${coupon.value.amount.toLocaleString('en-IN')}`;
    }
    return 'Special Offer';
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const days = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Available Coupons & Offers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Exclusive discounts and offers from our trusted partners
            </p>
          </div>
          <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#9CA3AF #F3F4F6' }}>
            <div className="flex gap-6 min-w-max px-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse flex-shrink-0 w-80">
                  <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (coupons.length === 0) {
    return null; // Don't show section if no coupons
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BiGift className="text-5xl text-green-600" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Available Coupons & Offers
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exclusive discounts and offers from our trusted partners. Redeem these coupons at partner locations.
          </p>
          <div className="mt-4 w-32 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full" />
        </div>

        {/* Coupons Horizontal Scroll */}
        <div className="mb-8">
          <div 
            className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
            style={{ 
              scrollbarWidth: 'thin', 
              scrollbarColor: '#9CA3AF #F3F4F6',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex gap-6 min-w-max">
              {coupons.map((coupon) => {
            const daysRemaining = getDaysRemaining(coupon.validity?.endDate);
            const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

            return (
              <div
                key={coupon._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-green-500 flex-shrink-0 w-80"
              >
                {/* Coupon Header */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FaTag className="text-xl" />
                      <span className="font-bold text-lg">{coupon.code}</span>
                    </div>
                    {coupon.partner && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {coupon.partner.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{coupon.title}</h3>
                </div>

                {/* Coupon Body */}
                <div className="p-6">
                  {/* Value Display */}
                  <div className="text-center mb-4">
                    <div className="inline-block bg-gradient-to-r from-green-100 to-blue-100 rounded-lg px-6 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {coupon.value?.percentage ? (
                          <FaPercent className="text-green-600 text-2xl" />
                        ) : (
                          <BiGift className="text-green-600 text-2xl" />
                        )}
                        <span className="text-3xl font-bold text-green-600">
                          {formatCouponValue(coupon)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {coupon.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {coupon.description}
                    </p>
                  )}

                  {/* Category & Type */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {coupon.category && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {coupon.category.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    )}
                    {coupon.type && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {coupon.type.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>

                  {/* Validity Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BiTime className="text-green-600" />
                      <span>
                        {daysRemaining > 0 ? (
                          <span className={isExpiringSoon ? "text-orange-600 font-semibold" : ""}>
                            {daysRemaining} days remaining
                          </span>
                        ) : (
                          <span className="text-red-600">Expired</span>
                        )}
                      </span>
                    </div>
                    {coupon.usage && !coupon.usage.isUnlimited && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BiCheckCircle className="text-blue-600" />
                        <span>
                          {coupon.usage.maxUses - (coupon.usage.usedCount || 0)} uses left
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Partner Info */}
                  {coupon.partner && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Available at:</p>
                      <p className="font-semibold text-gray-800">{coupon.partner.name}</p>
                      {coupon.partner.businessType && (
                        <p className="text-xs text-gray-600">{coupon.partner.businessType}</p>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    href={`/redeem-coupon?code=${coupon.code}`}
                    className="block w-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-center font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Redeem Now
                  </Link>
                </div>
              </div>
            );
          })}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/coupons"
            className="inline-flex items-center gap-2 bg-white text-green-600 font-semibold py-3 px-8 rounded-lg border-2 border-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <BiGift className="text-xl" />
            View All Coupons
          </Link>
        </div>
      </div>
    </section>
  );
}

