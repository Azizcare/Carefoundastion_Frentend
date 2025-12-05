"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { partnerService } from "@/services/partnerService";
import toast from "react-hot-toast";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function HealthPartners() {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const router = useRouter();

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    }
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        const response = await partnerService.getHealthPartners({ limit: 50 });
        setPartners(response.data || []);
      } catch (error) {
        console.error("Failed to fetch health partners:", error);
        setPartners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      handleScroll();
    }, 100);
  }, [partners]);

  // Helper function to get full address
  const getFullAddress = (partner) => {
    if (typeof partner.address === 'object' && partner.address) {
      return `${partner.address.street || ''}, ${partner.address.city || ''}, ${partner.address.state || ''} ${partner.address.pincode || ''}`.trim();
    }
    return partner.address || 'Address not available';
  };

  // Helper function to get image URL
  const getImageUrl = (partner) => {
    if (partner.images && partner.images.length > 0) {
      const primaryImage = partner.images.find(img => img.isPrimary) || partner.images[0];
      return primaryImage.url || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=faces';
    }
    return 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=faces';
  };

  // Helper function to get map link
  const getMapLink = (partner) => {
    const address = getFullAddress(partner);
    return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  };

  // Helper function to get specialization/role from description
  const getSpecialization = (partner) => {
    if (partner.description) {
      // Try to extract specialization from description
      const specMatch = partner.description.match(/Specialization:\s*([^.]+)/i);
      if (specMatch) {
        return specMatch[1].trim();
      }
    }
    return partner.contactPerson?.designation || 'General Physician';
  };

  // Handle book appointment
  const handleBookAppointment = (partner) => {
    if (!partner?._id) {
      toast.error("Unable to open booking for this partner");
      return;
    }

    toast.success(`Opening booking for ${partner.name}`);
    router.push(`/partners/health/book-appointment/${partner._id}`);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-4">
              Our Health Partners
            </h2>
            <p className="text-gray-600 text-lg">No health partners available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-pink-50 to-white px-2 relative border-y-2 border-blue-400">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-pink-500"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-cyan-500 to-blue-500"></div>
      <div className="max-w-full mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Our Health Partners
          </h2>
          <p className="text-gray-600 text-lg mt-3">
            Meet our trusted doctors — always ready to help you stay healthy
          </p>
          <div className="mt-3 w-24 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all border-2 border-gray-200"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-gray-700 text-lg" />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all border-2 border-gray-200"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-gray-700 text-lg" />
            </button>
          )}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-12" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {partners.map((partner, index) => {
            const address = getFullAddress(partner);
            const imageUrl = getImageUrl(partner);
            const mapLink = getMapLink(partner);
            const specialization = getSpecialization(partner);
            const phone = partner.phone || partner.contactPerson?.phone || 'N/A';
            
            return (
              <motion.div
                key={partner._id || partner.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.04 }}
                className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl border-2 border-gray-200 hover:border-blue-400 group"
              >
                
                <div className="relative w-40 h-40 mb-4 rounded-full overflow-hidden shadow-lg ring-4 ring-pink-100">
                  <Image
                    src={imageUrl}
                    alt={partner.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="text-blue-600 font-semibold text-sm mb-1 uppercase tracking-wide">
                  {specialization}
                </p>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {partner.name}
                </h3>

                <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
                  📞 {phone}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  📍 {address}
                </p>

                <div className="flex gap-3 w-full mt-6">
                  <button 
                    onClick={() => handleBookAppointment(partner)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                  >
                    Book Appointment
                  </button>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold text-sm shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all text-center transform hover:scale-105"
                  >
                    View Map
                  </a>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}


