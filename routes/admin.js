const express = require("express");
const protect = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const { getAllUsers, deleteUser, getAdmin, orderStatusController } = require("../controllers/admin");

router = express.Router();

router.get("/alluser/:email", protect,verifyAdmin, getAllUsers); 
router.delete("/deleteUser/:id/:email",protect,verifyAdmin, deleteUser); 
router.get("/isAdmin/:email", getAdmin); 
router.put(
    "/order-status/:orderId",
    orderStatusController
  );

module.exports = router;
