const express = require("express");
const protect = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const { getAllUsers, deleteUser, getAdmin, orderStatusController } = require("../controllers/admin");

router = express.Router();

router.get("/alluser/:email", protect,verifyAdmin, getAllUsers); //verifyAdmin, protect,
router.delete("/deleteUser/:id/:email",protect,verifyAdmin, deleteUser); //verifyAdmin, protect,
router.get("/isAdmin/:email", getAdmin); // verifyAdmin,  protect,
router.put(
    "/order-status/:orderId",
    // requireSignIn,
    // isAdmin,
    orderStatusController
  );

module.exports = router;