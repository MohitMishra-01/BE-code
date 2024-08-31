const express = require("express");
const protect = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");
const { createComboFood, getComboFoodById ,getComboAllFoods, deleteComboProduct, updateComboProductDetails} = require("../controllers/combo");
router = express.Router();

router.post("/addCombofood", createComboFood)
router.get("/getComboFood/:id", getComboFoodById)
router.get("/allComboFood/:catagory", getComboAllFoods)
router.delete("/comboProductDelete/:id", deleteComboProduct);
router.put("/updateProductDetails", updateComboProductDetails);

module.exports = router;