const express = require("express");
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middleware/permissionMiddleware");
const { getDailyReport } = require("../controllers/reportController");

// Middleware untuk menambahkan data user dummy
router.use(authenticateToken);

// Route hanya untuk admin
router.get("/daily", isAdmin, getDailyReport);

module.exports = router;
