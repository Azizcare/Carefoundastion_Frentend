"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { couponService } from '@/services/couponService';
import toast from 'react-hot-toast';

export default function RedeemCouponPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const validateCoupon = async (e) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsValidating(true);
    try {
      const code = couponCode.trim().toUpperCase();
      const response = await couponService.getCouponByCode(code);
      
      // Check response structure
      if (response && response.status === 'success' && response.data) {
        // Check if coupon is redeemable
        if (response.data.isRedeemable === false) {
          const reason = response.message || 'Coupon is expired or no longer valid';
          toast.error(reason);
          setCoupon(null);
          return;
        }
        
        setCoupon(response.data);
        toast.success(response.message || 'Coupon is valid!');
      } else if (response && response.status === 'error') {
        // Backend returned error in response
        toast.error(response.message || 'Invalid coupon code');
        setCoupon(null);
      } else {
        toast.error('Invalid coupon code');
        setCoupon(null);
      }
    } catch (error) {
      // Handle error - service always throws structured error {status: 'error', message: '...'}
      let errorMessage = 'Invalid coupon code';
      
      if (error && typeof error === 'object') {
        if (error.status === 'error' && error.message) {
          errorMessage = error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
      setCoupon(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRedeem = async () => {
    if (!user) {
      toast.error('Please login to redeem coupon');
      router.push('/login?redirect=/redeem-coupon');
      return;
    }

    if (!coupon) {
      toast.error('Please validate coupon first');
      return;
    }

    setIsRedeeming(true);
    try {
      await couponService.redeemCoupon(coupon._id, {
        location,
        notes
      });

      toast.success('Coupon redeemed successfully!');
      
      // Reset form
      setCouponCode('');
      setCoupon(null);
      setLocation('');
      setNotes('');
      
      // Redirect or show success page
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Failed to redeem coupon');
      console.error(error);
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Redeem Coupon</h1>
            <p className="text-xl text-gray-600">
              Enter your coupon code to redeem benefits
            </p>
          </div>

          {/* Coupon Validation Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={validateCoupon} className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code (e.g., FOO12345ABC)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-lg font-mono"
                  disabled={isValidating}
                />
                <button
                  type="submit"
                  disabled={isValidating}
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isValidating ? 'Validating...' : 'Validate'}
                </button>
              </div>
            </form>

            {/* Coupon Details */}
            {coupon && (
              <div className="border-t pt-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{coupon.title}</h3>
                      <p className="text-purple-100 mt-1">{coupon.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">
                        {coupon.value?.isPercentage 
                          ? `${coupon.value.percentage}% OFF`
                          : `₹${coupon.value?.amount}`
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-3 font-mono text-center text-lg">
                    {coupon.code}
                  </div>
                </div>

                {/* Coupon Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-900">{coupon.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold text-gray-900">{coupon.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valid Until:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(coupon.validity?.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining Uses:</span>
                    <span className="font-semibold text-green-600">
                      {coupon.remainingUses || 'Unlimited'}
                    </span>
                  </div>
                  {coupon.partner && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Partner:</span>
                      <span className="font-semibold text-gray-900">{coupon.partner.name}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {coupon.description && (
                  <div className="mb-6">
                    <p className="text-gray-700">{coupon.description}</p>
                  </div>
                )}

                {/* QR Code */}
                {coupon.qrCode?.url && (
                  <div className="mb-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Scan QR Code</p>
                    <img
                      src={coupon.qrCode.url}
                      alt="Coupon QR Code"
                      className="w-48 h-48 mx-auto border-4 border-purple-500 rounded-lg"
                    />
                  </div>
                )}

                {/* Terms & Conditions */}
                {coupon.terms && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h4>
                    <p className="text-sm text-gray-700">{coupon.terms}</p>
                  </div>
                )}

                {/* Redemption Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter location where redeeming"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows="3"
                    />
                  </div>

                  <button
                    onClick={handleRedeem}
                    disabled={isRedeeming}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRedeeming ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                        Redeeming...
                      </div>
                    ) : (
                      'Redeem Coupon'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">📌 How to Redeem:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Enter your coupon code above</li>
              <li>Verify the coupon details</li>
              <li>Click "Redeem Coupon" to use it</li>
              <li>Show the confirmation to the partner</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}







