const express = require("express");
const router = express.Router();

const {
  saveRoute,
  getSavedRoutes,
  deleteSavedRoute
} = require("../controllers/savedRouteController");

// Save route
router.post("/save-route", saveRoute);

// Get all saved routes of a user
router.get("/saved-routes/:userId", getSavedRoutes);

// Delete saved route
router.delete("/del-saved-route/:id", deleteSavedRoute);

module.exports = router;