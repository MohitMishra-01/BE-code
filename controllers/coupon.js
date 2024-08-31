const Coupon = require('../models/coupon');
const User = require('../models/User');

// Create a new coupon
const createCoupon = async (req, res) => {
  const { code, discountPercentage, maxDiscountValue, expirationDate, description, minSpend } = req.body;

  try {
    const newCoupon = new Coupon({
      code,
      discountPercentage,
      maxDiscountValue,
      expirationDate,
      description,
      minSpend
    });

    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific coupon
const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a coupon
const updateCoupon = async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(updatedCoupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a coupon
const deleteCoupon = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const useCoupon = async (req, res) => {
  const { userId, couponCode, totalSpend } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: 'Coupon is not active' });
    }

    if (coupon.usedBy.includes(userId)) {
      return res.status(400).json({ message: 'Coupon already used by this user' });
    }

    if (new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (totalSpend < coupon.minSpend) {
      return res.status(400).json({ message: `Minimum spend of $${coupon.minSpend} is required to use this coupon` });
    }

    // Calculate discount
    const discount = Math.min((totalSpend * coupon.discountPercentage) / 100, coupon.maxDiscountValue);

    // Update usedBy array
    // coupon.usedBy.push(userId);
    await coupon.save();

    res.status(200).json({
      message: 'Coupon used successfully',
      discount,
      discountPercentage: coupon.discountPercentage,
      maxDiscountValue: coupon.maxDiscountValue 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  useCoupon
};
