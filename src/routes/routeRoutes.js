const express = require("express");
const router = express.Router();
const { handleRouteRequest } = require("../controllers/routeController");

router.post("/routes", handleRouteRequest);

module.exports = router;