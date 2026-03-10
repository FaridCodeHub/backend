const pool = require("../config/db");

// Save a route
async function saveRoute(req, res) {

  try {

    const {
      user_id,
      start_name,
      end_name,
      start,
      end,
      mode,
      last_co2_score = 0
    } = req.body;

    if (!user_id || !start || !end || !mode) {
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

    const result = await pool.query(
      `INSERT INTO saved_routes
      (user_id,
       start_name,
       end_name,
       start_point,
       end_point,
       mode,
       last_co2_score)
      VALUES
      ($1,$2,$3,
       ST_SetSRID(ST_MakePoint($4,$5),4326),
       ST_SetSRID(ST_MakePoint($6,$7),4326),
       $8,$9)
      ON CONFLICT (user_id, start_point, end_point, mode)
      DO NOTHING
      RETURNING id`,
      [
        user_id,
        start_name,
        end_name,
        startLng,
        startLat,
        endLng,
        endLat,
        mode,
        last_co2_score
      ]
    );

    if (result.rowCount === 0) {
      return res.json({
        message: "Route already saved"
      });
    }

    res.json({
      message: "Route saved successfully"
    });

  } catch (error) {

    console.error("Save Route Error:", error);

    res.status(500).json({
      error: "Failed to save route"
    });

  }

}


// Get saved routes
async function getSavedRoutes(req, res) {

  try {

    const { userId } = req.params;

    const result = await pool.query(
      `SELECT
        id,
        start_name,
        end_name,

        ARRAY[ST_X(start_point), ST_Y(start_point)] AS start,
        ARRAY[ST_X(end_point), ST_Y(end_point)] AS end,

        mode,
        last_co2_score,
        created_at

      FROM saved_routes
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {

    console.error("Get Saved Routes Error:", error);

    res.status(500).json({
      error: "Failed to fetch saved routes"
    });

  }

}


// Delete saved route
async function deleteSavedRoute(req, res) {

  try {

    const { id } = req.params;

    await pool.query(
      `DELETE FROM saved_routes WHERE id = $1`,
      [id]
    );

    res.json({
      message: "Saved route deleted"
    });

  } catch (error) {

    console.error("Delete Route Error:", error);

    res.status(500).json({
      error: "Failed to delete route"
    });

  }

}

// Update Last_Co2_Score
async function updateCo2Score(req, res) {

  try {

    const { id } = req.params;
    const { last_co2_score } = req.body;

    await pool.query(
      `UPDATE saved_routes
       SET last_co2_score = $1
       WHERE id = $2`,
      [last_co2_score, id]
    );

    res.json({
      message: "CO2 score updated"
    });

  } catch (error) {

    console.error("Update CO2 Error:", error);

    res.status(500).json({
      error: "Failed to update CO2"
    });

  }

}

module.exports = {
  saveRoute,
  getSavedRoutes,
  deleteSavedRoute,
  updateCo2Score
};