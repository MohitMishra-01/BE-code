const Combo = require("../models/comboProduct")

const createComboFood = async (req, res) => {
    try {
         const newFood = new Combo(req.body);
         const saveFood = await newFood.save();
         res.status(200).json({
            message: "Food Successfully Add",
            success: true,
            data:{
                food: saveFood,
            }
         })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal Server Error",
            success: false,
        });
    }
};

const getComboFoodById = async (req, res) => {
    try {
        const {id} = req.params;
        const foodItems = await Combo.findById(id);

         res.status(200).json({
            message: "Food Details",
            success: true,
            data:{
                food: foodItems,
            }
         })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal Server Error",
            success: false,
        });
    }
};

const getComboAllFoods = async (req, res) => {
    try {
        const {catagory} = req.params;
        console.log(catagory);
        if(catagory === "All"){

            const foodItems = await Combo.find();
    
             res.status(200).json({
                message: "View Food Successfully",
                success: true,
                data:{
                    food: foodItems,
                }
             })
        } else{
            const foodItems = await Combo.find({ category: catagory});

            res.status(200).json({
                message: "View Food Successfully",
                success: true,
                data:{
                    food: foodItems,
                }
             });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal Server Error",
            success: false,
        });
    }
};


const deleteComboProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedProduct = await Combo.findByIdAndDelete(productId);
        // if user not found
        if(!deletedProduct){
            return res.status(404).json({message: "Product not found!"});
        }
        res.status(200).json({message: "Product Deleted Successfully!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateComboProductDetails = async (req, res) => {
    try {
        const { id, img, title, desc, category, prices, extraOptions, productType } = req.body;
        
        // Find the product by ID
        const product = await Combo.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found",
            });
        }

        // Update the product details
        if (img) product.img = img;
        if (title) product.title = title;
        if (desc) product.desc = desc;
        if (category) product.category = category;
        if (prices) product.prices = prices;
        if (productType) product.productType = productType;
        if (extraOptions) product.extraOptions = extraOptions;

        // Save the updated product
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product details updated successfully",
            data: {
                product,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};



module.exports = {createComboFood, getComboFoodById, deleteComboProduct ,getComboAllFoods, updateComboProductDetails}
