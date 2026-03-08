const express = require("express");
const router = express.Router();

const { saveTrip, getTrips } = require("../controllers/tripController");

router.post("/trip", saveTrip);

router.get("/trips/:userId", getTrips);

module.exports = router;


/*POST 
{
  "user_id": "e8cc2883-d681-47cb-8214-09c732c20528",
  "trip_name": "Morning Ride",

  "start": [-123.2620, 44.5646],
  "end": [-122.6765, 45.5231],

  "start_name": "Home",
  "end_name": "University",

  "mode": "bike",
  "distance_km": 4.1,
  "duration_minutes": 16,
  "route_co2_kg": 0,

  "coordinates": [
    [-123.2620,44.5646],
    [-123.2615,44.5650]
  ],

  "segments": []
}

*/

/*GET 
[
 {
  "id": "uuid",
  "trip_name": "Morning Ride",

  "start_name": "Home",
  "end_name": "University",

  "start": [-123.2620, 44.5646],
  "end": [-122.6765, 45.5231],

  "mode": "bike",
  "distance_km": 4.1,
  "duration_minutes": 16,
  "route_co2_kg": 0,

  "route": {
    "type": "LineString",
    "coordinates": [...]
  },

  "segments": [...],
  "created_at": "2026-03-06T09:20:00Z"
 }
]
*/