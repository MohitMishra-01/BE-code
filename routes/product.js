const express = require("express");
const protect = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const { createFood, getAllFoods, getFoodById ,updateProductDetails, deleteProduct} = require("../controllers/product");
router = express.Router();

router.post("/addfood/:email",protect, verifyAdmin, createFood) 
router.get("/getAllFood/:catagory", getAllFoods)
router.get("/getFood/:id", getFoodById)
router.put("/productDetails/:email",protect, verifyAdmin, updateProductDetails);
router.delete("/productDelete/:id/:email",protect, verifyAdmin, deleteProduct);

module.exports = router;