"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useCampaignStore from '@/store/campaignStore';
import useAuthStore from '@/store/authStore';
import { paymentService } from '@/services/paymentService';
import { donationService } from '@/services/donationService';
import { couponService } from '@/services/couponService';
import toast from 'react-hot-toast';

export default function DonatePage() {
  const params = useParams();
  const router = useRouter();
  const { currentCampaign: campaign, getCampaign } = useCampaignStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [donationData, setDonationData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('dummy'); // Default to dummy payment for testing
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [couponPackages, setCouponPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [packagesError, setPackagesError] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [couponQuantity, setCouponQuantity] = useState(1);
  const [assignBeneficiary, setAssignBeneficiary] = useState(true);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryPhone, setBeneficiaryPhone] = useState('');
  const [beneficiaryEmail, setBeneficiaryEmail] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [generatedCoupons, setGeneratedCoupons] = useState([]);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast.error('Please login to make a donation');
      router.push(`/login?redirect=/donate/${params.id}`);
      return;
    }

    // Load campaign
    const loadCampaign = async () => {
      if (params.id) {
        try {
          await getCampaign(params.id);
        } catch (error) {
          console.error('Failed to load campaign:', error);
          toast.error('Failed to load campaign');
        }
      }
    };

    loadCampaign();

    // Get donation data from session storage
    const pending = sessionStorage.getItem('pendingDonation');
    if (pending) {
      try {
        setDonationData(JSON.parse(pending));
      } catch (error) {
        console.error('Failed to parse donation data:', error);
        toast.error('Invalid donation data');
        router.push('/campaigns');
      }
    } else {
      toast.error('No donation data found');
      router.push(`/campaigns/${params.id}`);
    }
  }, [params.id, isAuthenticated, user, getCampaign, router]);

  useEffect(() => {
    let isMounted = true;

    const loadPackages = async () => {
      setPackagesLoading(true);
      setPackagesError('');
      try {
        const data = await couponService.getPackages();
        if (!isMounted) return;
        setCouponPackages(data || []);
        if (Array.isArray(data) && data.length) {
          setSelectedPackageId((prev) => prev || data[0].id);
        }
      } catch (error) {
        console.error('Failed to load coupon packages:', error);
        if (!isMounted) return;
        setPackagesError(error?.message || 'Unable to load coupon packages');
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
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const loadStripeScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const selectedPackage = couponPackages.find((pkg) => pkg.id === selectedPackageId);
  const couponTotalAmount = selectedPackage ? (selectedPackage.amount || 0) * couponQuantity : 0;

  const generateCoupons = async (paymentReferences = {}) => {
    if (!selectedPackage) {
      toast.error('Please select a coupon package before generating coupons.');
      return;
    }

    if (couponQuantity < 1) {
      toast.error('Quantity must be at least 1 coupon.');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    try {
      const payload = {
        packageId: selectedPackage.id,
        quantity: couponQuantity,
        beneficiaryName: assignBeneficiary ? beneficiaryName : undefined,
        beneficiaryPhone: assignBeneficiary ? beneficiaryPhone : undefined,
        beneficiaryEmail: assignBeneficiary ? beneficiaryEmail : undefined,
        assignBeneficiary,
        paymentReferences: {
          gateway: paymentReferences.gateway || 'payment',
          transactionId: paymentReferences.transactionId || `PAY-${Date.now()}`,
          gatewayId: paymentReferences.gatewayId,
          gatewayDetails: paymentReferences.gatewayDetails,
          donationId: paymentReferences.donationId
        }
      };

      const response = await couponService.purchaseCoupons(payload);
      setGeneratedCoupons(response.data?.coupons || []);
      setCouponError('');
      toast.success('Coupons generated! Check your dashboard for the codes.');
    } catch (error) {
      const message = error?.message || 'Failed to generate coupons';
      setCouponError(message);
      toast.error(message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);

      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Failed to load Razorpay. Please try again.');
        return;
      }

      // Create order
        const orderResponse = await paymentService.createRazorpayOrder({
        amount: donationData.amount,
        campaignId: donationData.campaignId,
        currency: 'INR'
      });

      const options = {
        key: orderResponse.data.keyId,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        order_id: orderResponse.data.orderId,
        name: 'Care Foundation',
        description: campaign?.title || 'Donation',
        image: '/logo.webp',
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await paymentService.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              campaignId: donationData.campaignId,
              amount: donationData.amount,
              isAnonymous: donationData.isAnonymous,
              message: donationData.message
            });

            // Clear session storage
            sessionStorage.removeItem('pendingDonation');

            await generateCoupons({
              gateway: 'razorpay',
              transactionId: response.razorpay_payment_id,
              gatewayId: response.razorpay_payment_id,
              gatewayDetails: verifyResponse.data,
              donationId: verifyResponse.data?.data?.donationId
            });

            toast.success('Donation successful! Thank you for your support.');
            router.push(`/donation-success?campaignId=${donationData.campaignId}`);
          } catch (error) {
            toast.error('Payment verification failed');
            console.error(error);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#10b981'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      setIsProcessing(true);

      // Load Stripe
      const res = await loadStripeScript();
      if (!res) {
        toast.error('Failed to load Stripe. Please try again.');
        return;
      }

      const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

      // Create payment intent
      const intentResponse = await paymentService.createStripeIntent({
        amount: donationData.amount,
        campaignId: donationData.campaignId,
        currency: 'inr'
      });

      const { error } = await stripe.confirmCardPayment(intentResponse.data.clientSecret, {
        payment_method: {
          card: {
            // This will open Stripe's hosted payment page
          },
          billing_details: {
            name: user?.name,
            email: user?.email
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        // Confirm payment on backend
        const confirmResponse = await paymentService.confirmStripePayment({
          paymentIntentId: intentResponse.data.paymentIntentId,
          campaignId: donationData.campaignId,
          amount: donationData.amount,
          isAnonymous: donationData.isAnonymous,
          message: donationData.message
        });

        await generateCoupons({
          gateway: 'stripe',
          transactionId: intentResponse.data.paymentIntentId,
          gatewayId: intentResponse.data.paymentIntentId,
          gatewayDetails: confirmResponse.data,
          donationId: confirmResponse.data?.data?.donationId
        });

        sessionStorage.removeItem('pendingDonation');
        toast.success('Donation successful!');
        router.push(`/donation-success?campaignId=${donationData.campaignId}`);
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUPIPayment = async () => {
    try {
      if (!upiId) {
        toast.error('Please enter your UPI ID');
        return;
      }

      setIsProcessing(true);

      const response = await paymentService.processUPIPayment({
        upiId: upiId,
        amount: donationData.amount,
        campaignId: donationData.campaignId,
        isAnonymous: donationData.isAnonymous,
        message: donationData.message
      });

      toast.success('UPI payment initiated. Please complete on your UPI app.');
      
      // Show UPI details
      alert(`Please pay ₹${donationData.amount} to UPI ID: ${response.data.upiId}\n\nTransaction ID: ${response.data.transactionId}`);

      await generateCoupons({
        gateway: 'upi',
        transactionId: response.data?.transactionId,
        gatewayDetails: response.data,
        donationId: response.data?.donationId
      });
      
      router.push(`/campaigns/${donationData.campaignId}`);
    } catch (error) {
      toast.error('UPI payment failed');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle dummy/test payment (for testing without payment gateway)
  const handleDummyPayment = async () => {
    try {
      // Check authentication again
      if (!isAuthenticated || !user) {
        toast.error('Please login to make a donation');
        router.push(`/login?redirect=/donate/${params.id}`);
        return;
      }

      if (!donationData || !donationData.campaignId) {
        toast.error('Donation data is missing');
        return;
      }

      setIsProcessing(true);

      console.log('Creating test donation with data:', {
        campaign: donationData.campaignId,
        amount: donationData.amount,
        user: user?._id || user?.id
      });

      // Create test donation directly
      const response = await donationService.createTestDonation({
        campaign: donationData.campaignId,
        amount: donationData.amount,
        isAnonymous: donationData.isAnonymous || false,
        message: donationData.message || '',
        donorDetails: {
          name: user?.name || 'Test Donor',
          email: user?.email || '',
          phone: user?.phone || ''
        }
      });

      console.log('Test donation response:', response);

      const paymentDetails = response.data?.paymentDetails;
      await generateCoupons({
        gateway: paymentDetails?.gateway || 'test',
        transactionId: paymentDetails?.transactionId,
        gatewayId: paymentDetails?.paymentId || paymentDetails?.transactionId,
        gatewayDetails: paymentDetails?.gatewayResponse,
        donationId: response.data?._id
      });

      // Clear session storage
      sessionStorage.removeItem('pendingDonation');

      toast.success('🎉 Dummy donation successful! Thank you for your support.');
      
      // Redirect to success page
      router.push(`/donation-success?campaignId=${donationData.campaignId}&donationId=${response.data?._id || ''}`);
    } catch (error) {
      console.error('Dummy payment error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Dummy donation failed. Please try again.';
      
      // Check if it's authentication error
      if (errorMessage.includes('authentication') || errorMessage.includes('token') || errorMessage.includes('login')) {
        toast.error('Please login to make a donation');
        router.push(`/login?redirect=/donate/${params.id}`);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'dummy') {
      handleDummyPayment();
    } else if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else if (paymentMethod === 'stripe') {
      handleStripePayment();
    } else if (paymentMethod === 'upi') {
      handleUPIPayment();
    }
  };

  if (!donationData || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Donation</h1>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Donating to</p>
                <p className="text-lg font-semibold text-gray-900">{campaign.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{donationData.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Donation Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Donation Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Donor Name:</span>
                <span className="font-semibold">{donationData.isAnonymous ? 'Anonymous' : user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold">{user?.email}</span>
              </div>
              {donationData.message && (
                <div>
                  <span className="text-gray-600">Message:</span>
                  <p className="text-gray-900 mt-1">{donationData.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Coupon Sponsor Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-gray-900">Sponsor a Coupon Package</h2>
              <p className="text-sm text-gray-500">
                Select a package and beneficiary info; coupons are generated after payment.
              </p>
            </div>

            {packagesLoading ? (
              <div className="text-sm text-gray-500">Loading coupon packages...</div>
            ) : packagesError ? (
              <p className="text-sm text-red-500">{packagesError}</p>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {couponPackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`w-full text-left rounded-2xl border p-4 transition ${
                        selectedPackageId === pkg.id
                          ? 'border-green-500 bg-green-50 shadow-inner'
                          : 'border-gray-200 bg-white hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">{pkg.category}</p>
                          <p className="text-lg font-semibold text-gray-900">{pkg.title}</p>
                        </div>
                        <span className="text-green-600 font-semibold text-lg">₹{pkg.amount?.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{pkg.description}</p>
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={couponQuantity}
                      onChange={(e) => setCouponQuantity(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full mt-1 border border-gray-200 rounded-2xl px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Total coupon value</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(couponTotalAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">Assign beneficiary now?</label>
                  <input
                    type="checkbox"
                    checked={assignBeneficiary}
                    onChange={(event) => setAssignBeneficiary(event.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>

                {assignBeneficiary && (
                  <div className="grid gap-3">
                    <input
                      type="text"
                      value={beneficiaryName}
                      onChange={(e) => setBeneficiaryName(e.target.value)}
                      placeholder="Beneficiary name"
                      className="w-full border border-gray-200 rounded-2xl px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500"
                    />
                    <input
                      type="tel"
                      value={beneficiaryPhone}
                      onChange={(e) => setBeneficiaryPhone(e.target.value)}
                      placeholder="Beneficiary mobile"
                      className="w-full border border-gray-200 rounded-2xl px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500"
                    />
                    <input
                      type="email"
                      value={beneficiaryEmail}
                      onChange={(e) => setBeneficiaryEmail(e.target.value)}
                      placeholder="Beneficiary email (optional)"
                      className="w-full border border-gray-200 rounded-2xl px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500"
                    />
                  </div>
                )}

                <p className="text-xs text-gray-500">Coupons will be sent after we receive your payment. You can track them in your dashboard.</p>

                {couponLoading && <p className="text-sm text-blue-600">Generating coupons...</p>}
                {couponError && <p className="text-sm text-red-500">{couponError}</p>}

                {generatedCoupons.length > 0 && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 space-y-2">
                    <p className="font-semibold">Coupons ready to share</p>
                    <div className="flex flex-wrap gap-2">
                      {generatedCoupons.slice(0, 6).map((coupon) => (
                        <span key={coupon._id} className="px-3 py-1 bg-white rounded-full text-xs font-mono border border-gray-200">
                          {coupon.code}
                        </span>
                      ))}
                      {generatedCoupons.length > 6 && (
                        <span className="text-xs text-gray-500">+{generatedCoupons.length - 6} more</span>
                      )}
                    </div>
                    <p className="text-xs text-green-900">
                      View the full list & download QR codes from your{' '}
                      <a href="/dashboard" className="font-semibold text-blue-600 hover:underline">
                        dashboard
                      </a>
                      .
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>
            
            <div className="space-y-3">
              {/* Dummy Payment - For Testing */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-yellow-50"
                     style={{ borderColor: paymentMethod === 'dummy' ? '#10b981' : '#fbbf24' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="dummy"
                  checked={paymentMethod === 'dummy'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">🧪 Dummy Payment (Test Mode)</div>
                  <div className="text-sm text-gray-600">Instant donation for testing - No payment gateway required</div>
                </div>
                <div className="text-2xl">🧪</div>
              </label>

              {/* Razorpay */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     style={{ borderColor: paymentMethod === 'razorpay' ? '#10b981' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Razorpay</div>
                  <div className="text-sm text-gray-600">Credit/Debit Card, Net Banking, UPI, Wallets</div>
                </div>
                <div className="text-2xl">💳</div>
              </label>

              {/* Stripe */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     style={{ borderColor: paymentMethod === 'stripe' ? '#10b981' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Stripe</div>
                  <div className="text-sm text-gray-600">International Cards</div>
                </div>
                <div className="text-2xl">🌍</div>
              </label>

              {/* UPI */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     style={{ borderColor: paymentMethod === 'upi' ? '#10b981' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">UPI</div>
                  <div className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</div>
                </div>
                <div className="text-2xl">📱</div>
              </label>
            </div>

            {/* UPI ID Input */}
            {paymentMethod === 'upi' && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Your UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Pay ₹${donationData.amount.toLocaleString()}`
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              🔒 Your payment is secure and encrypted. We never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}






