// const express = require("express");
// const { createCheckoutSession } = require("../controllers/checkoutcontroller")

// const router = express.Router();

// router.post("/create-checkout-session", createCheckoutSession);

// module.exports = router


const express = require("express");
const {createCheckoutSession, handleWebhook, getAllOrders} = require("../controllers/checkoutcontroller"); 
const verifyAdmin = require("../middleware/adminMiddleware");
const protect = require("../middleware/authMiddleware");

router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/webhook", handleWebhook);
router.get("/allOrder/:email",protect,verifyAdmin, getAllOrders);

module.exports = router;