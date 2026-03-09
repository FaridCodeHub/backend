const pool = require("../config/db");

// Save Trip
async function saveTrip(req, res) {
  try {

    const {
      user_id,
      trip_name,
      start,
      end,
      start_name,
      end_name,
      mode,
      distance_km,
      duration_minutes,
      route_co2_kg,
      carbon_saved_kg = 0
    } = req.body;

    if (!user_id || !start || !end || !mode || !distance_km || route_co2_kg === undefined) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    if (!Array.isArray(start) || !Array.isArray(end) || start.length !== 2 || end.length !== 2) {
      return res.status(400).json({
        error: "Invalid coordinates"
      });
    }

    const startLng = Number(start[0]);
    const startLat = Number(start[1]);
    const endLng = Number(end[0]);
    const endLat = Number(end[1]);

    if (
      isNaN(startLng) ||
      isNaN(startLat) ||
      isNaN(endLng) ||
      isNaN(endLat)
    ) {
      return res.status(400).json({
        error: "Coordinates must be numbers"
      });
    }

    await pool.query(
      `INSERT INTO trip_history
      (user_id, trip_name,
       start_name, end_name,
       start_point, end_point,
       mode, distance_km,
       duration_minutes, route_co2_kg,
       carbon_saved_kg)
      VALUES
      ($1,$2,$3,$4,
       ST_SetSRID(ST_MakePoint($5,$6),4326),
       ST_SetSRID(ST_MakePoint($7,$8),4326),
       $9,$10,$11,$12,$13)`,
      [
        user_id,
        trip_name,
        start_name,
        end_name,
        startLng,
        startLat,
        endLng,
        endLat,
        mode,
        distance_km,
        duration_minutes,
        route_co2_kg,
        carbon_saved_kg
      ]
    );

    res.json({ message: "Trip saved successfully" });

  } catch (error) {

    console.error("Save Trip Error:", error);

    res.status(500).json({
      error: "Failed to save trip"
    });

  }
}

// Get Trip History
async function getTrips(req, res) {

  try {

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "User ID required"
      });
    }

    const result = await pool.query(
      `SELECT
        id,
        trip_name,
        start_name,
        end_name,

        ARRAY[ST_X(start_point), ST_Y(start_point)] AS start,
        ARRAY[ST_X(end_point), ST_Y(end_point)] AS end,

        mode,
        distance_km,
        duration_minutes,
        route_co2_kg,
        carbon_saved_kg,
        created_at

      FROM trip_history
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [userId]
    );

    const trips = result.rows.map(trip => ({
      ...trip,
      route_co2_kg: Number(trip.route_co2_kg),
      carbon_saved_kg: Number(trip.carbon_saved_kg)
    }));

    res.json(trips);

  } catch (error) {

    console.error("Get Trips Error:", error);

    res.status(500).json({
      error: "Failed to fetch trips"
    });

  }

}

module.exports = {
  saveTrip,
  getTrips
};