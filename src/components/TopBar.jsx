"use client";

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelopeOpen, FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="w-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 px-2 hidden lg:block shadow-md">
      <div className="max-w-full mx-auto flex justify-between items-center h-11">
        
        <div className="flex items-center gap-4 text-sm text-white">
          <a
            href="https://maps.google.com/?q=Bhendi+bazaar+Mumbai+400003"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-green-100 transition-colors font-medium"
          >
            <FaMapMarkerAlt className="text-green-200" /> Bhendi bazaar, Mumbai – 400003
          </a>
          <a
            href="tel:+917304786365"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-green-100 transition-colors font-medium"
          >
            <FaPhoneAlt className="text-green-200" /> +91 7304786365
          </a>
          <a
            href="mailto:contact@carefoundationtrust.org"
            className="flex items-center gap-2 hover:text-green-100 transition-colors font-medium"
          >
            <FaEnvelopeOpen className="text-green-200" /> contact@carefoundationtrust.org
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://twitter.com/carefoundationtrust"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white hover:scale-110 transition-all duration-300 border border-white/30"
          >
            <FaTwitter className="text-sm" />
          </a>
          <a
            href="https://facebook.com/carefoundationtrust"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white hover:scale-110 transition-all duration-300 border border-white/30"
          >
            <FaFacebookF className="text-sm" />
          </a>
          <a
            href="https://linkedin.com/company/carefoundationtrust"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white hover:scale-110 transition-all duration-300 border border-white/30"
          >
            <FaLinkedinIn className="text-sm" />
          </a>
          <a
            href="https://instagram.com/carefoundationtrust"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white hover:scale-110 transition-all duration-300 border border-white/30"
          >
            <FaInstagram className="text-sm" />
          </a>
          <a
            href="https://youtube.com/carefoundationtrust"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white hover:scale-110 transition-all duration-300 border border-white/30"
          >
            <FaYoutube className="text-sm" />
          </a>
        </div>
      </div>
    </div>
  );
}


