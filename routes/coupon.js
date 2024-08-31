const express = require("express")
const protect = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const {createCoupon, getAllCoupons, useCoupon, deleteCoupon, updateCoupon, getCouponById} = require("../controllers/coupon");

router = express.Router();

router.post('/create', createCoupon);

// Get all coupons
router.get('/getAllCoupon', getAllCoupons);

// Get a specific coupon
router.get('/getCoupon/:id', getCouponById);

// Update a coupon
router.put('/update/:id', updateCoupon);

// Delete a coupon
router.delete('/delete/:id', deleteCoupon);

// Use a coupon
router.post('/useCoupon', useCoupon);

module.exports = router;