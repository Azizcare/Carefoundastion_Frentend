"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import ImageSlider from "./ImageSlider";

export default function Banner() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [donorInfo, setDonorInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: "",
    address: "",
    message: ""
  });

  const handleDonateClick = () => {
    router.push("/campaigns"); // Browse campaigns to donate
  };

  const handleDonateTimeClick = () => {
    router.push("/volunteer"); // Volunteer registration
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/campaigns?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/campaigns");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonorInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitDonation = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!donorInfo.firstName || !donorInfo.email || !donorInfo.amount) {
      toast.error("Please enter your name, email, and donation amount");
      return;
    }

    // Validate amount
    const amount = parseFloat(donorInfo.amount);
    if (isNaN(amount) || amount < 10) {
      toast.error("Minimum donation amount is ₹10");
      return;
    }

    // Validate phone if provided
    if (donorInfo.phone && !/^\d{10}$/.test(donorInfo.phone)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    // Save donor info with amount to localStorage
    localStorage.setItem('donorInfo', JSON.stringify({
      ...donorInfo,
      amount: parseFloat(donorInfo.amount)
    }));
    
    toast.success("Great! Now select a campaign to donate to");
    
    // Redirect to campaigns page
    router.push("/campaigns");
  };

  return (
    <section className="relative bg-gradient-to-br from-cyan-50 via-white to-green-50 py-20 overflow-hidden px-2 border-t-4 border-b-4 border-gradient-to-r from-green-500 via-blue-500 to-pink-500" style={{ borderTopColor: '#10b981', borderBottomColor: '#ec4899' }}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-pink-500"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-blue-500 to-green-500"></div>
      <div className="max-w-full mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 space-y-6"
        >
          <h5 className="text-lg font-semibold text-cyan-700 tracking-wide uppercase">
            Care Foundation Trust
          </h5>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Need Funds for a Medical Emergency or Social Cause?
          </h1>

          <p className="text-gray-800 text-lg leading-relaxed">
            At <span className="font-semibold text-green-600">Care Foundation Trust</span>, we charge{" "}
            <span className="font-semibold text-green-600">0% platform fees</span>. Every rupee you donate goes directly toward helping people in need — no hidden charges, just pure impact.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns by name, category, or location..."
                className="w-full px-5 py-4 pr-32 rounded-xl border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-800 placeholder-gray-500 shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all flex items-center gap-2"
              >
                <FaSearch />
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={handleDonateTimeClick}
              className="bg-gradient-to-r from-lime-600 to-green-500 hover:from-green-600 hover:to-green-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              Donate Your Time <span className="text-xl">→</span>
            </button>

            <button
              onClick={handleDonateClick}
              className="bg-white border border-gray-300 text-gray-900 font-medium px-6 py-3 rounded-lg shadow-sm hover:bg-gray-100 transition transform hover:scale-105"
            >
              Donate Now
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 w-full relative"
        >
          <div className="relative">
            {/* Image Slider */}
            <ImageSlider autoPlay={true} interval={5000} />
            
            {/* Donation Form Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-white z-20">
                <h2 className="text-3xl font-bold mb-6 border-b-2 border-green-400 pb-2 text-center">
                  Donate Now
                </h2>

                <form onSubmit={handleSubmitDonation} className="w-full max-w-md space-y-4">
                  {/* Donation Amount - Prominent */}
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-bold text-lg">₹</div>
                      <input
                        type="number"
                        name="amount"
                        value={donorInfo.amount}
                        onChange={handleInputChange}
                        placeholder="Enter Amount"
                        min="10"
                        step="1"
                        className="p-3 pl-8 rounded-lg w-full bg-white text-gray-800 focus:ring-2 focus:ring-green-400 outline-none font-semibold text-lg"
                        required
                      />
                    </div>
                    
                    {/* Quick Amount Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {[100, 500, 1000, 2000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDonorInfo(prev => ({ ...prev, amount: amt.toString() }))}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            donorInfo.amount === amt.toString()
                              ? 'bg-green-500 text-white'
                              : 'bg-white/80 text-gray-700 hover:bg-white'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      value={donorInfo.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name *"
                      className="p-3 rounded-lg w-full bg-white/90 text-gray-800 focus:ring-2 focus:ring-green-400 outline-none"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={donorInfo.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="p-3 rounded-lg w-full bg-white/90 text-gray-800 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="email"
                      name="email"
                      value={donorInfo.email}
                      onChange={handleInputChange}
                      placeholder="Email *"
                      className="p-3 rounded-lg w-full bg-white/90 text-gray-800 focus:ring-2 focus:ring-green-400 outline-none"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={donorInfo.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      pattern="[0-9]{10}"
                      title="Enter valid 10-digit mobile number"
                      className="p-3 rounded-lg w-full bg-white/90 text-gray-800 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                  </div>

                  {/* Address */}
                  <input
                    type="text"
                    name="address"
                    value={donorInfo.address}
                    onChange={handleInputChange}
                    placeholder="Address (Optional)"
                    className="p-3 rounded-lg w-full bg-white/90 text-gray-800 focus:ring-2 focus:ring-green-400 outline-none"
                  />

                  {/* Message */}
                  <textarea
                    name="message"
                    value={donorInfo.message}
                    onChange={handleInputChange}
                    placeholder="Message (Optional)"
                    className="p-3 rounded-lg w-full bg-white/90 text-gray-800 h-24 focus:ring-2 focus:ring-green-400 outline-none resize-none"
                  ></textarea>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-lime-600 to-green-500 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-lg shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span>Continue to Select Campaign</span>
                    <span className="text-xl">→</span>
                  </button>
                  
                  <p className="text-xs text-center text-white/80 mt-2">
                    * Required fields | Minimum donation: ₹10
                  </p>
                </form>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}





