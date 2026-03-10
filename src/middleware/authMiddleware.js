const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {

  try {

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization token required"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Invalid token format"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(403).json({
      error: "Invalid or expired token"
    });

  }

}

module.exports = authenticateToken;