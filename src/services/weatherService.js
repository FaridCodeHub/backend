const axios = require("axios");

async function getWeather(lat, lon) {
  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        lat,
        lon,
        appid: process.env.WEATHER_API_KEY,
        units: "metric"
      }
    }
  );

  return response.data;
}

module.exports = { getWeather };