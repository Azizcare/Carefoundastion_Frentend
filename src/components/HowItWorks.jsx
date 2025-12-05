"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HowItWorks() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("donor");

  const donorSteps = [
    {
      icon: "🔍",
      title: "Find a Cause",
      description: "Browse campaigns and find a cause that resonates with you",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "💝",
      title: "Make a Donation",
      description: "Contribute securely via UPI, card, or net banking",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "📧",
      title: "Get Receipt",
      description: "Receive instant receipt and updates on campaign progress",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "✨",
      title: "See Impact",
      description: "Track how your donation is making a real difference",
      color: "from-orange-500 to-red-500"
    }
  ];

  const fundraiserSteps = [
    {
      icon: "📝",
      title: "Create Campaign",
      description: "Start your fundraiser with photos, story, and goal amount",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: "✅",
      title: "Get Verified",
      description: "Our team reviews and approves your campaign within 24 hours",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: "📢",
      title: "Share & Promote",
      description: "Share on social media and reach thousands of supporters",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "💰",
      title: "Receive Funds",
      description: "Get donations directly to your account with 0% fees",
      color: "from-orange-500 to-amber-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 px-2 relative border-y-2 border-indigo-400">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>
      <div className="max-w-full mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you want to donate or fundraise, we've made it simple and transparent
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto rounded-full" />
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-12"
        >
          {/* Label */}
          <p className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Choose Your Role:
          </p>
          
          {/* Tabs Container */}
          <div className="bg-white rounded-2xl shadow-xl p-2 inline-flex border-2 border-gray-200 hover:border-green-400 transition-all duration-300">
            <button
              onClick={() => setSelectedTab("donor")}
              className={`px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center gap-3 ${
                selectedTab === "donor"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105"
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50 border-2 border-transparent"
              }`}
            >
              <span className="text-2xl">💝</span>
              <span>For Donors</span>
              {selectedTab === "donor" && (
                <span className="ml-2 text-sm">✓</span>
              )}
            </button>
            <div className="w-px h-8 bg-gray-300 mx-1"></div>
            <button
              onClick={() => setSelectedTab("fundraiser")}
              className={`px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center gap-3 ${
                selectedTab === "fundraiser"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent"
              }`}
            >
              <span className="text-2xl">🚀</span>
              <span>For Fundraisers</span>
              {selectedTab === "fundraiser" && (
                <span className="ml-2 text-sm">✓</span>
              )}
            </button>
          </div>
          
          {/* Helper Text */}
          <p className="text-xs text-gray-500 mt-3 text-center max-w-md">
            {selectedTab === "donor" 
              ? "Learn how to donate and make a difference" 
              : "Learn how to start your own fundraiser campaign"}
          </p>
        </motion.div>

        {/* Steps Grid - For Donors */}
        {selectedTab === "donor" && (
          <motion.div
            key="donor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {donorSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group"
              >
                {/* Connecting Line */}
                {index < donorSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300 -z-10"></div>
                )}

                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 hover:border-green-400 group">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Steps Grid - For Fundraisers */}
        {selectedTab === "fundraiser" && (
          <motion.div
            key="fundraiser"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {fundraiserSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group"
              >
                {/* Connecting Line */}
                {index < fundraiserSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300 -z-10"></div>
                )}

                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 hover:border-blue-400 group">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          {selectedTab === "donor" ? (
            <button
              onClick={() => router.push("/campaigns")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Browse Campaigns & Donate
            </button>
          ) : (
            <button
              onClick={() => router.push("/create-fundraiser")}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Fundraiser
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}

