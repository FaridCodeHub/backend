// const express = require("express");
// const router = express.Router();

// const {
//   saveRoute,
//   getSavedRoutes,
//   deleteSavedRoute,
//   updateCo2Score
// } = require("../controllers/savedRouteController");

// // Save route
// router.post("/save-route", saveRoute);

// // Get all saved routes of a user
// router.get("/saved-routes/:userId", getSavedRoutes);

// // Delete saved route
// router.delete("/del-saved-route/:id", deleteSavedRoute);

// //Update Last_Co2_Score
// router.patch("/update-co2/:id", updateCo2Score);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  saveRoute,
  getSavedRoutes,
  deleteSavedRoute,
  updateCo2Score
} = require("../controllers/savedRouteController");

const authenticateToken = require("../middleware/authMiddleware");

router.post("/save-route", authenticateToken, saveRoute);

router.get("/saved-routes/:userId", authenticateToken, getSavedRoutes);

router.delete("/del-saved-route/:id", authenticateToken, deleteSavedRoute);

router.patch("/update-co2/:id", authenticateToken, updateCo2Score);

module.exports = router;