const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 60,
    },
    desc: {
      type: String,
      required: true,
      maxlength: 200,
    },
    img: {
      type: String,
      required: false,
    },
    catagory: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: false,
    },
    prices: {
      type: [
        {
          size: { type: String, required: false },
          price: { type: Number, required: false },
        },
      ],
    },
    extraOptions: {
      type: [
        {
          text: { type: String, required: false },
          price: { type: Number, required: false },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema); 


