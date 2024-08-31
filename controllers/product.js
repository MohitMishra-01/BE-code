const Product = require("../models/Product")

const createFood = async (req, res) => {
    try {
         console.log(req.body);
         const newFood = new Product(req.body);
         const saveFood = newFood.save();
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

const getFoodById = async (req, res) => {
    try {
        const {id} = req.params;
        const foodItems = await Product.findById(id);

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


const getAllFoods = async (req, res) => {
    try {
        const {catagory} = req.params;
        console.log(catagory);
        if(catagory === "All"){

            const foodItems = await Product.find();
    
             res.status(200).json({
                message: "View Food Successfully",
                success: true,
                data:{
                    food: foodItems,
                }
             })
        } else{
            const foodItems = await Product.find({ catagory: catagory});

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

// new work

const updateProductDetails = async (req, res) => {
    try {
        const { id, img, title, desc, catagory, prices, extraOptions, productType } = req.body;
        
        // Find the product by ID
        const product = await Product.findById(id);
        
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
        if (catagory) product.catagory = catagory;
        if (prices) product.prices = prices;
        if (extraOptions) product.extraOptions = extraOptions;
        if (productType) product.productType = productType;

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


const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        // if user not found
        if(!deletedProduct){
            return res.status(404).json({message: "Product not found!"});
        }
        res.status(200).json({message: "Product Deleted Successfully!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


module.exports = {createFood, getAllFoods, getFoodById, updateProductDetails,deleteProduct}












