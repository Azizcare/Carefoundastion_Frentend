"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import useDonationStore from "@/store/donationStore";
import VendorWallet from "./VendorWallet";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { FiTrendingUp, FiDollarSign, FiUsers, FiGift, FiActivity, FiAward, FiDownload, FiPlus } from "react-icons/fi";
import { FaWallet, FaReceipt, FaHandHoldingHeart, FaHeart } from "react-icons/fa";
import FundraiserCouponForm from "./FundraiserCouponForm";
import { couponService } from "@/services/couponService";

export default function EnhancedUserDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/users/dashboard");
      console.log("Dashboard API Response:", response.data);
      setDashboardData(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      console.error("Error details:", error.response?.data || error.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user || !dashboardData) return null;

  // Role-based dashboard content
  const renderDashboardContent = () => {
    switch (user.role) {
      case "vendor":
        return <VendorDashboard data={dashboardData} />;
      case "beneficiary":
        return <BeneficiaryDashboard data={dashboardData} />;
      case "donor":
        return <DonorDashboard data={dashboardData} />;
      case "volunteer":
        return <VolunteerDashboard data={dashboardData} />;
      case "fundraiser":
        return <FundraiserDashboard data={dashboardData} />;
      default:
        return <DefaultDashboard data={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2">
      <div className="max-w-full mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 mb-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-green-100">
            {user.role === "vendor" && "Manage your wallet and redeemed coupons"}
            {user.role === "beneficiary" && "Track your received donations and benefits"}
            {user.role === "donor" && "View your donation history and impact"}
            {user.role === "volunteer" && "Check your volunteer activities and certificates"}
            {user.role === "fundraiser" && "Monitor your campaigns and fundraising progress"}
            {!["vendor", "beneficiary", "donor", "volunteer", "fundraiser"].includes(user.role) && "Your personal dashboard"}
          </p>
        </div>

        {/* Role-specific content */}
        {renderDashboardContent()}
      </div>
    </div>
  );
}

// Vendor Dashboard
function VendorDashboard({ data }) {
  return (
    <div className="space-y-6">
      {/* Wallet Section */}
      <VendorWallet />
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Coupons</p>
              <p className="text-2xl font-bold text-gray-900">{data.coupons?.totalCoupons || 0}</p>
            </div>
            <FiGift className="text-3xl text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Redeemed</p>
              <p className="text-2xl font-bold text-gray-900">{data.coupons?.totalRedemptions || 0}</p>
            </div>
            <FaHandHoldingHeart className="text-3xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active</p>
              <p className="text-2xl font-bold text-gray-900">{data.coupons?.activeCoupons || 0}</p>
            </div>
            <FiActivity className="text-3xl text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Beneficiary Dashboard
function BeneficiaryDashboard({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Received</p>
              <p className="text-3xl font-bold">₹{data.donations?.totalDonated?.toLocaleString() || "0"}</p>
            </div>
            <FaReceipt className="text-4xl text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Donations</p>
              <p className="text-3xl font-bold">{data.donations?.donationCount || 0}</p>
            </div>
            <FiUsers className="text-4xl text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Status</p>
              <p className="text-xl font-bold mt-1">{data.user?.isVerified ? "Verified" : "Pending"}</p>
            </div>
            <FiAward className="text-4xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Donations</h3>
        {data.recentActivity?.length > 0 ? (
          <div className="space-y-3">
            {data.recentActivity.map((activity, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-semibold">{activity.campaign?.title || "General Donation"}</p>
                <p className="text-sm text-gray-600">
                  ₹{activity.amount?.toLocaleString()} • {new Date(activity.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
}

// Donor Dashboard
function DonorDashboard({ data }) {
  const router = useRouter();
  const { getUserDonations, userDonations } = useDonationStore();
  const [isLoadingDonations, setIsLoadingDonations] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  useEffect(() => {
    const fetchMyCoupons = async () => {
      try {
        setLoadingCoupons(true);
        const response = await couponService.getMyCoupons({ limit: 5 });
        setCoupons(response.data || []);
      } catch (error) {
        console.error('Failed to load coupons:', error);
      } finally {
        setLoadingCoupons(false);
      }
    };
    fetchMyCoupons();
  }, [showCouponForm]);

  const handleCouponSuccess = () => {
    setShowCouponForm(false);
    toast.success('Coupon issued successfully!');
  };

  useEffect(() => {
    const loadDonations = async () => {
      setIsLoadingDonations(true);
      try {
        const result = await getUserDonations();
        console.log("User Donations Response:", result);
      } catch (error) {
        console.error("Failed to load donations:", error);
        console.error("Error details:", error.response?.data || error.message);
      } finally {
        setIsLoadingDonations(false);
      }
    };
    loadDonations();
  }, [getUserDonations]);

  // Debug logging
  console.log("DonorDashboard - data prop:", data);
  console.log("DonorDashboard - userDonations from store:", userDonations);
  
  // Safely extract donation stats
  const totalDonated = data?.donations?.totalDonated ?? 0;
  const donationCount = data?.donations?.donationCount ?? 0;
  
  // Calculate campaigns supported from recent activity or user donations
  const allCampaignIds = [
    ...(data?.recentActivity || []).map(a => a.campaign?._id || a.campaign).filter(Boolean),
    ...(userDonations || []).map(d => d.campaign?._id || d.campaign).filter(Boolean)
  ];
  const campaignsSupported = new Set(allCampaignIds).size;
  
  // Get recent donations - prefer userDonations from store, fallback to recentActivity
  const recentDonations = (userDonations && userDonations.length > 0) 
    ? userDonations.slice(0, 5) 
    : (data?.recentActivity?.slice(0, 5) || []);
  
  console.log("DonorDashboard - Calculated stats:", {
    totalDonated,
    donationCount,
    campaignsSupported,
    recentDonationsCount: recentDonations.length,
    hasUserDonations: !!userDonations?.length,
    hasRecentActivity: !!data?.recentActivity?.length
  });

  const handleDownloadReport = async (format = 'excel') => {
    try {
      console.log("Downloading report:", { format });
      
      // Use api.get for authentication, but with responseType blob for Excel
      if (format === 'excel') {
        const response = await api.get('/users/donations/report', {
          params: { format: 'excel' },
          responseType: 'blob',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        });

        // Create download link
        const blob = new Blob([response.data], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `my-donations-report-${Date.now()}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        toast.success("Excel report downloaded successfully!");
      } else {
        // PDF - return JSON for now
        const response = await api.get('/users/donations/report', {
          params: { format: 'pdf' }
        });
        console.log("PDF Report Data:", response.data);
        toast.info("PDF format not yet implemented. Data logged to console.");
      }
    } catch (error) {
      console.error("Report download error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to download report";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Donated</p>
              <p className="text-3xl font-bold mt-1">₹{totalDonated.toLocaleString()}</p>
              <p className="text-green-100 text-xs mt-1">Lifetime contribution</p>
            </div>
            <FiDollarSign className="text-5xl text-green-200 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Donations</p>
              <p className="text-3xl font-bold mt-1">{donationCount}</p>
              <p className="text-blue-100 text-xs mt-1">All time donations</p>
            </div>
            <FaHandHoldingHeart className="text-5xl text-blue-200 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Campaigns Supported</p>
              <p className="text-3xl font-bold mt-1">{campaignsSupported}</p>
              <p className="text-purple-100 text-xs mt-1">Unique campaigns</p>
            </div>
            <FiTrendingUp className="text-5xl text-purple-200 opacity-80" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/campaigns")}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <FaHeart className="text-xl" />
            <span>Donate Now</span>
          </button>
          <button
            onClick={() => router.push("/my-donations")}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <FaReceipt className="text-xl" />
            <span>View All Donations</span>
          </button>
          <div className="relative group">
            <button
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FiDownload className="text-xl" />
              <span>Download Report</span>
            </button>
            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 border border-gray-200">
              <button
                onClick={() => handleDownloadReport('pdf')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-t-lg transition-colors text-gray-700 font-medium"
              >
                📄 Download PDF Report
              </button>
              <button
                onClick={() => handleDownloadReport('excel')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-b-lg transition-colors text-gray-700 font-medium"
              >
                📊 Download Excel Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Recent Donations</h3>
          {userDonations?.length > 5 && (
            <button
              onClick={() => router.push("/my-donations")}
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              View All →
            </button>
          )}
        </div>
        {isLoadingDonations ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading donations...</p>
          </div>
        ) : recentDonations.length > 0 ? (
          <div className="space-y-3">
            {recentDonations.map((donation, index) => (
              <div key={donation._id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FaHeart className="text-red-500" />
                      <p className="font-semibold text-gray-900">
                        {donation.campaign?.title || "General Donation"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 ml-8">
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(donation.createdAt || donation.date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Transaction ID:</span>{" "}
                        <span className="font-mono text-xs">
                          {donation.paymentDetails?.transactionId || donation.transactionId || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Beneficiary:</span>{" "}
                        {donation.beneficiary?.name || donation.purpose || "General Support"}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          (donation.status || 'completed') === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {donation.status || 'completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-green-600 text-xl">₹{donation.amount?.toLocaleString()}</p>
                    {donation.status === 'completed' && (
                      <button
                        onClick={() => {
                          const token = localStorage.getItem('token');
                          const url = `${process.env.NEXT_PUBLIC_API_URL}/donations/${donation._id}/receipt?format=pdf&token=${token}`;
                          window.open(url, '_blank');
                        }}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <FiDownload className="inline mr-1" />
                        Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💝</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">No Donations Yet</h4>
            <p className="text-gray-600 mb-6">Start making a difference by donating to a campaign</p>
            <button
              onClick={() => router.push("/campaigns")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Browse Campaigns
            </button>
          </div>
        )}
      </div>

      {/* Issue Coupon Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiGift className="text-green-600" />
            Issue Coupons
          </h2>
          <button
            onClick={() => setShowCouponForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 flex items-center gap-2 transition-all"
          >
            <FiPlus size={20} />
            Issue Coupon
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Issue coupons to beneficiaries or partners as a token of appreciation for their support.
        </p>
        
        {/* My Issued Coupons */}
        {loadingCoupons ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          </div>
        ) : coupons.length > 0 ? (
          <div className="space-y-3">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{coupon.title}</h3>
                    <p className="text-sm text-gray-600">Code: {coupon.code}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {coupon.value?.percentage ? `${coupon.value.percentage}% OFF` : `₹${coupon.value?.amount || '0'}`}
                      {' • '}
                      {coupon.category?.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    coupon.status === 'active' ? 'bg-green-100 text-green-800' :
                    coupon.status === 'redeemed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {coupon.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No coupons issued yet. Click "Issue Coupon" to create one.</p>
        )}
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border border-green-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Average Donation</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{donationCount > 0 ? Math.round(totalDonated / donationCount).toLocaleString() : "0"}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Last Donation</p>
            <p className="text-lg font-semibold text-gray-900">
              {recentDonations[0] 
                ? new Date(recentDonations[0].createdAt || recentDonations[0].date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Coupon Form Modal */}
      {showCouponForm && (
        <FundraiserCouponForm
          onSuccess={handleCouponSuccess}
          onCancel={() => setShowCouponForm(false)}
        />
      )}
    </div>
  );
}

// Volunteer Dashboard
function VolunteerDashboard({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Hours Volunteered</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <FiActivity className="text-4xl text-orange-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Events Attended</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <FiUsers className="text-4xl text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Certificates</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <FiAward className="text-4xl text-blue-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Fundraiser Dashboard
function FundraiserDashboard({ data }) {
  const router = useRouter();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  useEffect(() => {
    const fetchMyCoupons = async () => {
      try {
        setLoadingCoupons(true);
        const response = await couponService.getMyCoupons({ limit: 5 });
        setCoupons(response.data || []);
      } catch (error) {
        console.error('Failed to load coupons:', error);
      } finally {
        setLoadingCoupons(false);
      }
    };
    fetchMyCoupons();
  }, [showCouponForm]);

  const handleCouponSuccess = () => {
    setShowCouponForm(false);
    toast.success('Coupon created successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Raised</p>
              <p className="text-3xl font-bold">₹{data.campaigns?.totalRaised?.toLocaleString() || "0"}</p>
            </div>
            <FiDollarSign className="text-4xl text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Active Campaigns</p>
              <p className="text-3xl font-bold">{data.campaigns?.activeCampaigns || 0}</p>
            </div>
            <FiTrendingUp className="text-4xl text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Campaigns</p>
              <p className="text-3xl font-bold">{data.campaigns?.totalCampaigns || 0}</p>
            </div>
            <FiUsers className="text-4xl text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Pending</p>
              <p className="text-3xl font-bold">{data.campaigns?.pendingCampaigns || 0}</p>
            </div>
            <FiActivity className="text-4xl text-orange-200" />
          </div>
        </div>
      </div>

      {/* Issue Coupon Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiGift className="text-green-600" />
            Issue Coupons to Beneficiaries
          </h2>
          <button
            onClick={() => setShowCouponForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 flex items-center gap-2 transition-all"
          >
            <FiPlus size={20} />
            Issue New Coupon
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Create and issue coupons to beneficiaries. Coupons can be redeemed at partner locations.
        </p>
        
        {/* My Coupons List */}
        {loadingCoupons ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          </div>
        ) : coupons.length > 0 ? (
          <div className="space-y-3">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{coupon.title}</h3>
                    <p className="text-sm text-gray-600">Code: {coupon.code}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {coupon.value?.percentage ? `${coupon.value.percentage}% OFF` : `₹${coupon.value?.amount || '0'}`}
                      {' • '}
                      {coupon.category?.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    coupon.status === 'active' ? 'bg-green-100 text-green-800' :
                    coupon.status === 'redeemed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {coupon.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No coupons issued yet. Click "Issue New Coupon" to create one.</p>
        )}
      </div>

      {/* Coupon Form Modal */}
      {showCouponForm && (
        <FundraiserCouponForm
          onSuccess={handleCouponSuccess}
          onCancel={() => setShowCouponForm(false)}
        />
      )}
    </div>
  );
}

// Default Dashboard
function DefaultDashboard({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Donated</p>
          <p className="text-2xl font-bold text-gray-900">₹{data.donations?.totalDonated?.toLocaleString() || "0"}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Donations</p>
          <p className="text-2xl font-bold text-gray-900">{data.donations?.donationCount || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Coupons</p>
          <p className="text-2xl font-bold text-gray-900">{data.coupons?.totalCoupons || 0}</p>
        </div>
      </div>
    </div>
  );
}

