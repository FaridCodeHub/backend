// const express = require("express");
// const router = express.Router();

// const { saveTrip, getTrips } = require("../controllers/tripController");

// router.post("/trip", saveTrip);

// router.get("/trips/:userId", getTrips);

// module.exports = router;

const express = require("express");
const router = express.Router();

const { saveTrip, getTrips } = require("../controllers/tripController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/trip", authenticateToken, saveTrip);

router.get("/trips/:userId", authenticateToken, getTrips);

module.exports = router;
