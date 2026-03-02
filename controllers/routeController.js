const { getRoute } = require("../services/routeService");
const { getWeather } = require("../services/weatherService");
const { calculateCarbon } = require("../services/carbonService");

async function handleRouteRequest(req, res) {
  try {
    const { start, end, greenPreference = 1 } = req.body;

    if (!start || !end) {
      return res.status(400).json({ error: "Start and end required" });
    }

    const modes = [
      { name: "car", profile: "driving-car" },
      { name: "bike", profile: "cycling-road" },
      { name: "walk", profile: "foot-walking" }
    ];

    const results = [];

    // 🌦 Weather check
    const weather = await getWeather(start[1], start[0]);
    let isRaining = false;

    if (weather && weather.weather && weather.weather.length > 0) {
      isRaining = weather.weather[0].main
        .toLowerCase()
        .includes("rain");
    }

    // Generate routes
    for (const mode of modes) {
      const geojson = await getRoute(mode.profile, start, end);

      const feature = geojson.features[0];
      const summary = feature.properties.summary;
      const segments = feature.properties.segments;

      const distanceKm = summary.distance / 1000;

      const routeData = {
        mode: mode.name,
        distance_km: distanceKm,
        duration_min: summary.duration / 60,
        carbon_kg: calculateCarbon(mode.name, distanceKm),
        coordinates: feature.geometry.coordinates,
        segments: segments
      };

      if (mode.name === "bike" && isRaining) {
        routeData.warning = "Not recommended due to rain";
      }

      results.push(routeData);
    }

    // Find car baseline
    const carRoute = results.find(r => r.mode === "car");

    if (carRoute) {
    results.forEach(route => {
        route.carbon_saved_kg =
        Math.max(0, carRoute.carbon_kg - route.carbon_kg);
    });
    }

    // Normalize + scoring
    const maxCarbon = Math.max(...results.map(r => r.carbon_kg));
    const maxTime = Math.max(...results.map(r => r.duration_min));

    results.forEach(route => {
      const normalizedCarbon =
        maxCarbon === 0 ? 0 : route.carbon_kg / maxCarbon;

      const normalizedTime =
        maxTime === 0 ? 0 : route.duration_min / maxTime;

      route.score =
        (greenPreference * normalizedCarbon) +
        ((1 - greenPreference) * normalizedTime);
    });

    // Sort by smart score
    results.sort((a, b) => a.score - b.score);

    res.json(results);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Route calculation failed" });
  }
}

module.exports = { handleRouteRequest };