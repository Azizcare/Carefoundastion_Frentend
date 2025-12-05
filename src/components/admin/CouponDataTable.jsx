"use client";
import { useState, useEffect } from "react";
import { BiSearch, BiQr } from "react-icons/bi";
import { FiTag, FiCopy, FiSend, FiEye } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import useAdminStore from "@/store/adminStore";
import toast from "react-hot-toast";
import SendCouponModal from "./SendCouponModal";
import CouponDetailsModal from "./CouponDetailsModal";

export default function CouponDataTable() {
  const { coupons, isLoading, getCoupons } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("active");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        await getCoupons({ limit: 100, status: statusFilter });
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to load coupons:", error);
        toast.error("Failed to load coupons");
      }
    };
    fetchCoupons();
  }, [getCoupons, statusFilter]);

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!");
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCoupons.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredCoupons.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Coupon Management
          </h1>
          <p className="text-sm text-gray-600">Manage coupons that appear on the platform</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition focus:outline-none ${
                statusFilter === tab.value
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-green-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading coupons...</p>
          </div>
        ) : (
          <>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-green-500 via-blue-500 to-green-500">
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Coupon Code</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Discount</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Partner</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Expiry Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Usage</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.length > 0 ? (
                    currentEntries.map((coupon, index) => (
                      <tr
                        key={coupon._id}
                        className={`border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiTag className="text-green-600" size={16} />
                            <span className="font-mono font-bold text-gray-900">{coupon.code}</span>
                            <button 
                              onClick={() => copyCouponCode(coupon.code)}
                              className="text-gray-400 hover:text-green-600 transition-colors p-1 hover:bg-green-50 rounded"
                              title="Copy code"
                            >
                              <FiCopy size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            coupon.type === 'discount' ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' :
                            coupon.type === 'cashback' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' :
                            coupon.type === 'free_item' ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' :
                            coupon.type === 'service' ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white' :
                            'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                          }`}>
                            {coupon.type ? coupon.type.charAt(0).toUpperCase() + coupon.type.slice(1).replace('_', ' ') : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-green-600 text-lg">
                            {(() => {
                              if (!coupon.value) return 'N/A';
                              // Check if percentage-based
                              if (coupon.value.isPercentage || coupon.value.percentage) {
                                return `${coupon.value.percentage || 0}%`;
                              }
                              // Check if amount-based
                              if (coupon.value.amount) {
                                if (typeof coupon.value.amount === 'number') {
                                  return `₹${coupon.value.amount.toLocaleString('en-IN')}`;
                                }
                                // For free_item/service, amount is a string description
                                if (typeof coupon.value.amount === 'string') {
                                  return coupon.value.amount;
                                }
                              }
                              return 'N/A';
                            })()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {(() => {
                            // Check if partner exists
                            if (!coupon.partner) {
                              return <span className="text-gray-400 italic">Not Assigned</span>;
                            }
                            
                            // If partner is an object (populated)
                            if (typeof coupon.partner === 'object' && coupon.partner !== null && coupon.partner.name) {
                              return (
                                <span className="font-semibold text-gray-900">
                                  {coupon.partner.name}
                                  {coupon.partner.businessType && (
                                    <span className="text-xs text-gray-500 ml-2">
                                      ({coupon.partner.businessType})
                                    </span>
                                  )}
                                </span>
                              );
                            }
                            
                            // If partner is just an ID (not populated) - this shouldn't happen but handle it
                            if (typeof coupon.partner === 'string' || (coupon.partner._id && !coupon.partner.name)) {
                              return <span className="text-yellow-600 italic">Partner ID</span>;
                            }
                            
                            return <span className="text-gray-400 italic">Not Assigned</span>;
                          })()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {coupon.validity?.endDate 
                            ? new Date(coupon.validity.endDate).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            (() => {
                              const isActive = coupon.status === 'active' && coupon.validity?.isActive;
                              const isValidDate = coupon.validity?.endDate && new Date(coupon.validity.endDate) > new Date();
                              return isActive && isValidDate;
                            })()
                              ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
                              : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                          }`}>
                            {(() => {
                              const isActive = coupon.status === 'active' && coupon.validity?.isActive;
                              const isValidDate = coupon.validity?.endDate && new Date(coupon.validity.endDate) > new Date();
                              return isActive && isValidDate ? 'Active' : 'Inactive';
                            })()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-600 font-medium">
                            <div>Used: <span className="font-bold text-green-600">{coupon.usage?.usedCount || 0}</span></div>
                            {coupon.usage?.maxUses && <div>Max: {coupon.usage.maxUses}</div>}
                            {coupon.usage?.isUnlimited && <div className="text-green-600 font-bold">Unlimited</div>}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedCoupon(coupon);
                                setShowDetailsModal(true);
                              }}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FiEye size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCoupon(coupon);
                                setShowSendModal(true);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Send Coupon"
                            >
                              <FiSend size={16} />
                            </button>
                            {coupon.qrCode?.url && (
                              <button
                                onClick={() => {
                                  setSelectedCoupon(coupon);
                                  setShowQRModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View QR Code"
                              >
                                <BiQr size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => copyCouponCode(coupon.code)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Copy Code"
                            >
                              <FiCopy size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-4 py-12 text-center text-gray-500">
                        <div className="text-4xl mb-2">🎫</div>
                        {isLoading ? 'Loading coupons...' : 'No coupons found'}
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredCoupons.length)} of {filteredCoupons.length} entries
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              {totalPages > 10 && (
                <button
                  onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              )}
            </div>
          </div>
          </>
        )}
      </div>

      {/* Send Coupon Modal */}
      {showSendModal && selectedCoupon && (
        <SendCouponModal
          coupon={selectedCoupon}
          onClose={() => {
            setShowSendModal(false);
            setSelectedCoupon(null);
          }}
          onSuccess={() => {
            getCoupons({ limit: 100 });
          }}
        />
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedCoupon?.qrCode?.url && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">QR Code</h3>
              <button
                onClick={() => {
                  setShowQRModal(false);
                  setSelectedCoupon(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="text-center">
              <img
                src={selectedCoupon.qrCode.url}
                alt="Coupon QR Code"
                className="w-64 h-64 mx-auto border-4 border-green-500 rounded-lg mb-4"
              />
              <p className="font-mono text-lg font-semibold text-gray-900 mb-2">
                {selectedCoupon.code}
              </p>
              <p className="text-sm text-gray-600">{selectedCoupon.title}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedCoupon.code);
                  toast.success('Code copied!');
                }}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Details Modal */}
      {showDetailsModal && selectedCoupon && (
        <CouponDetailsModal
          coupon={selectedCoupon}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedCoupon(null);
          }}
        />
      )}
    </div>
  );
}



