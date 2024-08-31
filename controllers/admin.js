const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/User"); 
const { Order } = require("../models/Order");
require('dotenv').config();


const getAllUsers = async(req, res) => {
    try {
        const user = await User.find({})
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const deleteUser = async(req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        // if user not found
        if(!deletedUser){
            return res.status(404).json({message: "user not found!"});
        }
        res.status(200).json({message: "User Deleted Successfully!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// get admin
const getAdmin = async (req, res) => {
    const email = req.params.email;
    const query = {email: email};
    try {
        const user = await User.findOne(query);
        // console.log(user)
        if(email !== req.decoded.email){
            return res.status(403).send({message: "Forbidden access"})
        }
        let admin = false;
        if(user ){
            admin = user?.role === "admin";
        }
        res.status(200).json({admin})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
  
      // Find the order by ID to get the deliveryType
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).send({
          success: false,
          message: "Order not found",
        });
      }
  
      // Determine which status to update based on the deliveryType
      let updateFields = {};
      if (order.deliveryType === 'Pickup') {
        updateFields.takeaway_status = status;
      } else if (order.deliveryType === 'Delivery') {
        updateFields.delivery_status = status;
      } else {
        return res.status(400).send({
          success: false,
          message: "Invalid delivery type",
        });
      }
  
      // Update the order with the new status
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        updateFields,
        { new: true }
      );
  
      res.json(updatedOrder);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while updating order",
        error,
      });
    }
  };
  
module.exports = {
    getAllUsers,
    deleteUser,
    getAdmin,
    orderStatusController
}