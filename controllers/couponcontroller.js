const coupons = require('../models/couponmodel'); // Ensure correct path

// Create a new coupon
exports.createCoupon = async (req, res) => {
    try {
        const coupon = new coupons(req.body);
        await coupon.save();
        res.status(201).send({
            message: 'Coupon created successfully',
            data: coupon
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all coupons
exports.getAllCoupons = async (req, res) => {
    try {
        const coupon = await coupons.find();
        res.status(200).send({
            message: 'Coupons retrieved successfully',
            data: coupon
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a coupon by ID
exports.getCouponById = async (req, res) => {
    try {
        const coupon = await coupons.findById(req.params.id);
        if (!coupon) {
            return res.status(404).send({
                message: 'Coupon not found'
            });
        }
        res.status(200).send({
            message: 'Coupon retrieved successfully',
            data: coupon
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a coupon by ID
exports.updateCouponById = async (req, res) => {
    try {
        const coupon = await coupons.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!coupon) {
            return res.status(404).send({
                message: 'Coupon not found'
            });
        }
        res.status(200).send({
            message: 'Coupon updated successfully',
            data: coupon
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a coupon by ID
exports.deleteCouponById = async (req, res) => {
    try {
        const coupon = await coupons.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).send({
                message: 'Coupon not found'
            });
        }
        res.status(200).send({
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
};
