import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://swiftion.vercel.app/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    const token = await AsyncStorage.getItem('authToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after') || 5;
        console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
        if (global.onRateLimit) {
          global.onRateLimit(`Too many requests. Please try again in ${retryAfter} seconds.`);
        }
      }

      // Handle token expiry
      if (response.status === 401) {
        const data = await response.json().catch(() => ({}));
        if (data.error === 'Session expired' || data.error?.includes('expired')) {
          await AsyncStorage.multiRemove(['authToken', 'userData']);
          if (global.onAuthError) {
            global.onAuthError('Session expired. Please sign in again.');
          }
        }
      }

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', response.status, data);
        throw {
          response: {
            status: response.status,
            data: data,
          },
          message: data.error || 'Request failed',
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;
