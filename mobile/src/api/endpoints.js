import apiClient from './client';

export const authAPI = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  register: (name, email, password) =>
    apiClient.post('/auth/register', { name, email, password }),

  verifyOTP: (email, otp) =>
    apiClient.post('/auth/verify-otp', { email, otp }),

  resendOTP: (email) =>
    apiClient.post('/auth/resend-otp', { email }),

  completeOnboarding: (data) =>
    apiClient.post('/auth/onboarding/complete', data),

  updateProviderSettings: (provider, apiKey) =>
    apiClient.patch('/auth/provider-settings', { provider, apiKey }),
};

export const decisionsAPI = {
  getRecommendation: (type) =>
    apiClient.get(`/decisions/recommend?type=${type}`),

  getHistory: (limit = 10) =>
    apiClient.get(`/decisions/history?limit=${limit}`),
};

export const feedbackAPI = {
  submitFeedback: (decisionId, rating, comment) =>
    apiClient.post('/feedback', { decisionId, rating, comment }),
};

export const userAPI = {
  getStats: () =>
    apiClient.get('/user/stats'),

  getWeather: (city) =>
    apiClient.get(`/weather?city=${city}`),
};
