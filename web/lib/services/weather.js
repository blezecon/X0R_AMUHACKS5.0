import axios from 'axios';

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const weatherCache = new Map();

export async function getWeather(location) {
  if (!WEATHER_API_KEY) {
    console.warn('No weather API key configured');
    return null;
  }

  if (!location) {
    return null;
  }

  // Check cache
  const cacheKey = location.toLowerCase();
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: location,
          appid: WEATHER_API_KEY,
          units: 'metric'
        },
        timeout: 5000
      }
    );

    const weatherData = {
      temp: response.data.main.temp,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      location: response.data.name
    };

    // Cache the result
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now()
    });

    return weatherData;
  } catch (error) {
    console.error('Weather API error:', error.message);
    return null;
  }
}

export function getWeatherContext(weather) {
  if (!weather) return 'neutral';
  
  const temp = weather.temp;
  const condition = weather.condition.toLowerCase();
  
  if (temp > 30) return 'hot';
  if (temp < 10) return 'cold';
  if (condition.includes('rain')) return 'rainy';
  if (condition.includes('cloud')) return 'cloudy';
  if (condition.includes('snow')) return 'cold';
  if (condition.includes('clear')) return 'sunny';
  
  return 'neutral';
}
