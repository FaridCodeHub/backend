const emissionFactors = {
  car: 0.192,      // kg CO2 per km
  bike: 0,
  walk: 0
};

function calculateCarbon(mode, distanceKm) {
  const factor = emissionFactors[mode] ?? 0;
  return distanceKm * factor;
}

module.exports = { calculateCarbon };