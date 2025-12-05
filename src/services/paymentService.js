import api from '../utils/api';

// Payment Service
export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (paymentData) => {
    try {
      const response = await api.post('/payments/create-intent', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Process payment
  processPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/process', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify payment
  verifyPayment: async (paymentId, paymentData) => {
    try {
      const response = await api.post(`/payments/verify/${paymentId}`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment history
  getPaymentHistory: async (params = {}) => {
    try {
      const response = await api.get('/payments/history', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Refund payment
  refundPayment: async (paymentId, refundData) => {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, refundData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payment methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payments/methods');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Razorpay methods
  createRazorpayOrder: async (orderData) => {
    try {
      const response = await api.post('/payments/razorpay/create-order', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  verifyRazorpayPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/razorpay/verify', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Stripe methods
  createStripeIntent: async (intentData) => {
    try {
      const response = await api.post('/payments/stripe/create-intent', intentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  confirmStripePayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/stripe/confirm', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // UPI methods
  processUPIPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/upi/process', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};








