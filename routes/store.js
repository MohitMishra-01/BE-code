const express = require("express");
const protect = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const {storeDetails, getStatus } = require("../controllers/storeDetails");

router = express.Router();

router.put(
    "/storeUpdate/:email",
    protect,
    verifyAdmin,
    storeDetails
  );
router.get(
    "/storeStatus",
    getStatus
  );

module.exports = router;