const axios = require("axios");

async function getRoute(profile, start, end) {
  const response = await axios.post(
    `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
    {
      coordinates: [start, end]
    },
    {
      headers: {
        Authorization: process.env.ORS_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );
//   console.log(response.data.routes[0]);
    return response.data;
}

module.exports = { getRoute };