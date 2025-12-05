import api from '../utils/api';

// Admin Service
export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Campaign Management
  getAllCampaigns: async (params = {}) => {
    try {
      const response = await api.get('/admin/campaigns', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approveCampaign: async (campaignId, verificationNotes = '') => {
    try {
      const response = await api.put(`/admin/campaigns/${campaignId}/approve`, {
        verificationNotes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  rejectCampaign: async (campaignId, rejectionReason) => {
    try {
      const response = await api.put(`/admin/campaigns/${campaignId}/reject`, {
        rejectionReason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCampaignStatus: async (campaignId, status) => {
    try {
      const response = await api.put(`/admin/campaigns/${campaignId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Review campaign (approve/reject)
  reviewCampaign: async (campaignId, endpoint) => {
    try {
      const response = await api.put(`/admin/campaigns/${campaignId}/${endpoint}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // User Management
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUserStatus: async (userId, statusData) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  assignRole: async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/assign-role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Partner Management
  getAllPartners: async (params = {}) => {
    try {
      const response = await api.get('/admin/partners', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approvePartner: async (partnerId, verificationNotes = '') => {
    try {
      const response = await api.put(`/admin/partners/${partnerId}/approve`, {
        verificationNotes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  rejectPartner: async (partnerId, rejectionReason) => {
    try {
      const response = await api.put(`/admin/partners/${partnerId}/reject`, {
        rejectionReason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updatePartner: async (partnerId, data) => {
    try {
      const response = await api.put(`/admin/partners/${partnerId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deletePartner: async (partnerId) => {
    try {
      const response = await api.delete(`/admin/partners/${partnerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Alias for convenience
  getPartners: async (params = {}) => {
    return adminService.getAllPartners(params);
  },

  // Beneficiary Management
  getBeneficiaries: async (params = {}) => {
    try {
      const response = await api.get('/admin/beneficiaries', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Donation Management
  getAllDonations: async (params = {}) => {
    try {
      const response = await api.get('/admin/donations', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Coupon Management
  getAllCoupons: async (params = {}) => {
    try {
      const response = await api.get('/admin/coupons', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createCoupon: async (couponData) => {
    try {
      const response = await api.post('/admin/coupons', couponData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCoupon: async (couponId, couponData) => {
    try {
      const response = await api.put(`/admin/coupons/${couponId}`, couponData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteCoupon: async (couponId) => {
    try {
      const response = await api.delete(`/admin/coupons/${couponId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reports
  getFinancialReports: async (params = {}) => {
    try {
      const response = await api.get('/admin/reports/financial', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Contact Queries Management
  getAllContactQueries: async (params = {}) => {
    try {
      const response = await api.get('/contact', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateQueryStatus: async (queryId, statusData) => {
    try {
      const response = await api.put(`/contact/${queryId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  respondToQuery: async (queryId, message) => {
    try {
      const response = await api.post(`/contact/${queryId}/respond`, { message });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteQuery: async (queryId) => {
    try {
      const response = await api.delete(`/contact/${queryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
