import api from '../utils/api';

// Coupon Service
export const couponService = {
  // Get all coupons
  getCoupons: async (params = {}) => {
    try {
      const response = await api.get('/coupons', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single coupon
  getCoupon: async (id) => {
    try {
      const response = await api.get(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create coupon
  createCoupon: async (couponData) => {
    try {
      const response = await api.post('/coupons', couponData);
      return response.data;
    } catch (error) {
      const payload = error.response?.data || {};
      const message = payload.message || error.message || 'Failed to create coupon';
      throw { ...payload, message };
    }
  },

  // Update coupon
  updateCoupon: async (id, couponData) => {
    try {
      const response = await api.put(`/coupons/${id}`, couponData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete coupon
  deleteCoupon: async (id) => {
    try {
      const response = await api.delete(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Redeem coupon
  redeemCoupon: async (id, redemptionData) => {
    try {
      const response = await api.post(`/coupons/${id}/redeem`, redemptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get coupon by code
  getCouponByCode: async (code) => {
    try {
      const response = await api.get(`/coupons/code/${encodeURIComponent(code)}`);
      return response.data;
    } catch (error) {
      // If backend returned structured error, throw it directly
      if (error.response?.data && error.response.data.status === 'error') {
        throw error.response.data;
      }
      
      // If it's a network error (no response), create a structured error
      if (error.request && !error.response) {
        throw {
          status: 'error',
          message: 'Network error. Please check your connection and try again.'
        };
      }
      
      // If there's a response but no structured data, create error from status
      if (error.response) {
        throw {
          status: 'error',
          message: error.response.data?.message || `Request failed with status ${error.response.status}`
        };
      }
      
      // For any other error, create a structured error
      throw {
        status: 'error',
        message: error.message || 'Failed to validate coupon code'
      };
    }
  },

  // Get user's coupons
  getUserCoupons: async (params = {}) => {
    try {
      const response = await api.get('/coupons/my-coupons', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get my coupons (alias for getUserCoupons)
  getMyCoupons: async (params = {}) => {
    try {
      const response = await api.get('/coupons/my-coupons', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get coupon analytics
  getCouponAnalytics: async (id) => {
    try {
      const response = await api.get(`/coupons/${id}/analytics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get coupon packages
  getPackages: async () => {
    try {
      const response = await api.get('/coupons/packages');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get coupons by category
  getCouponsByCategory: async (category) => {
    try {
      const response = await api.get('/coupons', { 
        params: { category, limit: 12 } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send coupon via WhatsApp, Email, SMS
  // New format: sendCoupon(id, { recipient, methods, partnerId })
  // Old format (backward compatible): sendCoupon(id, recipient, methods)
  sendCoupon: async (id, sendDataOrRecipient, methods) => {
    try {
      // Check if new format (object with recipient property) or old format (recipient object, methods separately)
      const payload = sendDataOrRecipient.recipient 
        ? sendDataOrRecipient // New format: { recipient, methods, partnerId }
        : { recipient: sendDataOrRecipient, methods }; // Old format: (id, recipient, methods)
      
      const response = await api.post(`/coupons/${id}/send`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add coupon to vendor wallet
  addCouponToWallet: async (id, vendorId) => {
    try {
      const response = await api.post(`/coupons/${id}/add-to-wallet`, {
        vendorId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Assign coupon to beneficiary (donor/admin)
  assignCoupon: async (id, assignmentData) => {
    try {
      const response = await api.post(`/coupons/${id}/assign`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Settle coupon after redemption
  settleCoupon: async (id, settlementData) => {
    try {
      const response = await api.post(`/coupons/${id}/settle`, settlementData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reject or cancel coupon
  rejectCoupon: async (id, reasonData) => {
    try {
      const response = await api.post(`/coupons/${id}/reject`, reasonData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  purchaseCoupons: async (payload) => {
    try {
      const response = await api.post('/coupons/purchase', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Validate coupon
  validateCoupon: async (code) => {
    try {
      const response = await api.post('/coupons/validate', { code });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
