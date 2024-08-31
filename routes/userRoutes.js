const express = require("express");
const {registerController, authController, loginController, verifyOTPController, updateUserProfile,getUserByEmail, changePassword, verifyOTP, sendOtp, getUserOrders} = require("../controllers/user");
const protect = require("../middleware/authMiddleware");
router = express.Router();

router.post("/register",registerController)
router.post("/get-user",protect,authController)
router.post("/login",loginController)
router.post("/otpVerify", verifyOTPController)
router.put("/update",updateUserProfile)
router.get("/userDetails/:email",getUserByEmail)
router.post('/sendOtp', sendOtp);
router.post('/verifyOtp', verifyOTP);
router.post('/changePassword', changePassword);
router.get('/orderDetails/:userId', getUserOrders);

module.exports = router;



