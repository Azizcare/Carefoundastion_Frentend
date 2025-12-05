import api from '../utils/api';

// Donation Service
export const donationService = {
  // Get all donations
  getDonations: async (params = {}) => {
    try {
      const response = await api.get('/donations', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single donation
  getDonation: async (id) => {
    try {
      const response = await api.get(`/donations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create donation
  createDonation: async (donationData) => {
    try {
      // Convert campaignId to campaign if needed (backend expects 'campaign' field)
      const data = {
        ...donationData,
        campaign: donationData.campaign || donationData.campaignId
      };
      // Remove campaignId if campaign is set
      if (data.campaign) {
        delete data.campaignId;
      }
      const response = await api.post('/donations', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create test donation (without payment gateway)
  createTestDonation: async (donationData) => {
    try {
      // Convert campaignId to campaign if needed (backend expects 'campaign' field)
      const data = {
        ...donationData,
        campaign: donationData.campaign || donationData.campaignId
      };
      // Remove campaignId if campaign is set
      if (data.campaign) {
        delete data.campaignId;
      }
      const response = await api.post('/donations/test', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get donation receipt
  getDonationReceipt: async (id) => {
    try {
      const response = await api.get(`/donations/${id}/receipt`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Request donation refund
  requestRefund: async (id, reason) => {
    try {
      const response = await api.post(`/donations/${id}/refund`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get donation statistics
  getDonationStats: async () => {
    try {
      const response = await api.get('/donations/stats/overview');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user donations
  getUserDonations: async (params = {}) => {
    try {
      const response = await api.get('/users/donations', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
