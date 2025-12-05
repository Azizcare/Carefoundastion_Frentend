"use client";

import React, { useState } from "react";
import { FaUserPlus, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function PartnerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    partnerFor: "",
    name: "",
    mobile: "",
    email: "",
    address: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Map partnerFor to businessType and category
      const businessType = formData.partnerFor === "0" ? "clinic" : "restaurant";
      const category = formData.partnerFor === "0" ? "medical" : "food";

      const partnerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        businessType,
        category,
        description: formData.message,
        address: formData.address,
        contactPerson: {
          name: formData.name,
          phone: formData.mobile,
          email: formData.email
        }
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/partners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show more user-friendly error messages
        const errorMessage = data.message || 'Failed to submit partner request';
        throw new Error(errorMessage);
      }

      // Show success message based on response
      const successMessage = data.message || "Partner request submitted successfully! We'll contact you soon.";
      toast.success(successMessage);
      
      // Reset form
      setFormData({
        partnerFor: "",
        name: "",
        mobile: "",
        email: "",
        address: "",
        message: ""
      });

    } catch (error) {
      console.error("Partner registration error:", error);
      toast.error(error.message || "Failed to submit partner request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-green-50 to-pink-50 py-16 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-8"
        >
          
          <div className="space-y-3">
            <h5 className="text-green-600 font-semibold uppercase tracking-widest text-sm animate-pulse">
              Become A Partner
            </h5>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
              Join Us in Fighting Hunger and Transform Lives Together!
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 p-4 bg-green-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <FaArrowRight className="text-green-600 text-2xl" />
              <h5 className="text-gray-800 font-medium">You are one Form Away</h5>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 p-4 bg-green-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <FaUserPlus className="text-green-600 text-2xl" />
              <h5 className="text-gray-800 font-medium">Join Our Volunteer Team</h5>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4 mt-6 text-gray-700"
          >
            <p>
              <span className="font-bold text-green-600">Become a Partner in Healthcare:</span><br />
              At Care Foundation Trust™, we provide affordable medical aid to underprivileged communities. 
              Join our mission as a medical professional to make a significant impact.
            </p>
            <p>
              <span className="font-bold text-green-600">Make a Difference as a Food Partner:</span><br />
              Join us in combating hunger! Every meal contributed helps create positive change in our community.
            </p>

            <div className="flex items-center gap-4 mt-4">
              <div className="bg-green-600 p-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <FaUserPlus className="text-white text-2xl" />
              </div>
              <div>
                <h5 className="text-gray-800 font-semibold text-lg flex items-center gap-2">
                  Ready to make a change? It's easy to get started 
                  <FaArrowRight className="text-green-600" />
                </h5>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 transition-all hover:shadow-3xl hover:-translate-y-2 duration-300"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              name="partnerFor"
              value={formData.partnerFor}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition duration-300 hover:scale-105"
            >
              <option value="">Partner For</option>
              <option value="0">Healthcare (Doctor)</option>
              <option value="1">Food (Restaurant)</option>
            </select>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition duration-300 hover:scale-105"
            />

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Contact Number"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition duration-300 hover:scale-105"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email ID"
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition duration-300 hover:scale-105"
            />

            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address Of Operation"
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition duration-300 hover:scale-105 resize-none h-24"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your Message"
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition duration-300 hover:scale-105 resize-none h-24"
            />

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Submitting...' : 'Request Now'} <FaArrowRight className="text-white" />
            </motion.button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}


