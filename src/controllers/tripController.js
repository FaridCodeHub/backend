const pool = require("../config/db");
//Save Search Trip
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
      coordinates,
      segments
    } = req.body;

    if (!user_id || !mode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert coordinates to LINESTRING
    const lineString =
      "LINESTRING(" +
      coordinates.map(c => `${c[0]} ${c[1]}`).join(",") +
      ")";

    await pool.query(
      `INSERT INTO trip_history
      (user_id, trip_name,
       start_name, end_name,
       start_point, end_point,
       mode, distance_km, duration_minutes, route_co2_kg,
       route_geometry, segments)
      VALUES
      ($1,$2,$3,$4,
       ST_SetSRID(ST_MakePoint($5,$6),4326),
       ST_SetSRID(ST_MakePoint($7,$8),4326),
       $9,$10,$11,$12,
       ST_GeomFromText($13,4326),
       $14)`,
      [
        user_id,
        trip_name,
        start_name,
        end_name,
        start[0],
        start[1],
        end[0],
        end[1],
        mode,
        distance_km,
        duration_minutes,
        route_co2_kg,
        lineString,
        JSON.stringify(segments)
      ]
    );

    res.json({ message: "Trip saved successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to save trip" });

  }

}

//Get Trip History
/*
    // ST_AsGeoJSON(start_point)::json AS start,
    // ST_AsGeoJSON(end_point)::json AS end,
*/
async function getTrips(req, res) {

  try {

    const { userId } = req.params;

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

    COALESCE(ST_AsGeoJSON(route_geometry)::json, '{}'::json) AS route,

    segments,
    created_at

    FROM trip_history
    WHERE user_id = $1
    ORDER BY created_at DESC`,
    [userId]
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to fetch trips" });

  }

}

module.exports = {
  saveTrip,
  getTrips
};