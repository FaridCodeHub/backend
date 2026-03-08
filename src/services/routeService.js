// const axios = require("axios");

// async function getRoute(profile, start, end) {
//   const response = await axios.post(
//     `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
//     {
//       coordinates: [start, end]
//     },
//     {
//       headers: {
//         Authorization: process.env.ORS_API_KEY,
//         "Content-Type": "application/json"
//       }
//     }
//   );
// //   console.log(response.data.routes[0]);
//     return response.data;
// }

// module.exports = { getRoute };
const axios = require("axios");

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getRoute(profile, start, end, retries = 3) {

  try {

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

    return response.data;

  } catch (error) {

    if (error.response && error.response.status === 429 && retries > 0) {

      console.log("Rate limit hit, retrying...");
      await sleep(1000);

      return getRoute(profile, start, end, retries - 1);
    }

    throw error;
  }

}

module.exports = { getRoute };