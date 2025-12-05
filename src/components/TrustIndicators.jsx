"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function TrustIndicators() {
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeCampaigns: 0,
    totalDonors: 0,
    livesImpacted: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch real stats from API
    const fetchStats = async () => {
      try {
        // API URL should already include /api based on env config
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/campaigns/stats`);
        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success' && result.data) {
            setStats({
              totalRaised: result.data.totalRaised || 0,
              activeCampaigns: result.data.activeCampaigns || 0,
              totalDonors: result.data.totalDonors || 0,
              livesImpacted: result.data.livesImpacted || 0
            });
            return;
          }
        }
        // Use fallback stats if API fails
        setStats({
          totalRaised: 25000000,
          activeCampaigns: 150,
          totalDonors: 5000,
          livesImpacted: 10000
        });
      } catch (error) {
        console.error('Failed to fetch campaign stats:', error);
        // Use fallback stats on error
        setStats({
          totalRaised: 25000000,
          activeCampaigns: 150,
          totalDonors: 5000,
          livesImpacted: 10000
        });
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const trustStats = [
    {
      icon: "💰",
      count: stats.totalRaised,
      label: "Total Raised",
      prefix: "₹",
      suffix: "+",
      color: "from-green-500 to-emerald-600",
      format: true
    },
    {
      icon: "🎯",
      count: stats.activeCampaigns,
      label: "Active Campaigns",
      prefix: "",
      suffix: "+",
      color: "from-blue-500 to-cyan-600",
      format: false
    },
    {
      icon: "👥",
      count: stats.totalDonors,
      label: "Generous Donors",
      prefix: "",
      suffix: "+",
      color: "from-purple-500 to-pink-600",
      format: false
    },
    {
      icon: "❤️",
      count: stats.livesImpacted,
      label: "Lives Impacted",
      prefix: "",
      suffix: "+",
      color: "from-red-500 to-orange-600",
      format: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-green-50 px-2 relative border-y-2 border-green-400">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-500"></div>
      <div className="max-w-full mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-full mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Impact That Speaks for Itself
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Together, we've created a movement of compassion and change. Here's our collective impact.
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto rounded-full" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onViewportEnter={() => setIsVisible(true)}
              className="relative group"
            >
              <div className={`bg-gradient-to-br ${stat.color} p-1 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-white/50`}>
                <div className="bg-white rounded-2xl p-8 h-full border-2 border-transparent">
                  {/* Icon */}
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>

                  {/* Count */}
                  <div className={`text-4xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.prefix}
                    {isVisible ? (
                      <CountUp
                        end={stat.count}
                        duration={2.5}
                        separator=","
                        formattingFn={stat.format ? formatNumber : undefined}
                      />
                    ) : (
                      0
                    )}
                    {stat.suffix}
                  </div>

                  {/* Label */}
                  <p className="text-gray-700 font-semibold text-lg">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8"
        >
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-white px-6 py-3 rounded-full shadow-lg border-2 border-green-200 hover:border-green-400 transition-all transform hover:scale-105">
            <span className="text-2xl">✓</span>
            <span className="font-bold text-gray-900">0% Platform Fee</span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-white px-6 py-3 rounded-full shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all transform hover:scale-105">
            <span className="text-2xl">🔒</span>
            <span className="font-bold text-gray-900">Secure Payments</span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-white px-6 py-3 rounded-full shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all transform hover:scale-105">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-gray-900">Instant Approval</span>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-white px-6 py-3 rounded-full shadow-lg border-2 border-orange-200 hover:border-orange-400 transition-all transform hover:scale-105">
            <span className="text-2xl">📱</span>
            <span className="font-bold text-gray-900">24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}





