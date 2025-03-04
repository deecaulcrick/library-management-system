const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { User } = require("../models");

// Verify JWT token
exports.verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Add user info to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res
      .status(500)
      .json({ message: "Error verifying token", error: error.message });
  }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Requires admin privileges" });
  }
};

// Check if user is staff or admin
exports.isStaffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "staff")) {
    next();
  } else {
    res.status(403).json({ message: "Requires staff or admin privileges" });
  }
};

// Check if user is the owner of the resource or an admin
exports.isOwnerOrAdmin = (paramName) => {
  return (req, res, next) => {
    const resourceId = req.params[paramName];

    if (
      req.user &&
      (req.user.role === "admin" || req.user.id.toString() === resourceId)
    ) {
      next();
    } else {
      res.status(403).json({ message: "Unauthorized access to this resource" });
    }
  };
};
