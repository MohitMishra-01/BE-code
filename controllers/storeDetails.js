const Store = require("../models/storeDetails");

const storeDetails = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || (status !== 'open' && status !== 'close')) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Invalid status. Provide 'open' or 'closed'"
            });
        }
        
        // Create or update store details in the database
        let store = await Store.findOne();
        if (!store) {
            store = new Store();
        }
        store.status = status;
        await store.save();

        res.status(200).json({
            status: store.status,
            message: `Store is now ${store.status}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to update store status"
        });
    }
};

const getStatus = async (req, res) => {
    try {
        const store = await Store.findOne();
        if (!store) {
            return res.status(404).json({
                error: "Not Found",
                message: "Store details not found"
            });
        }
        res.status(200).json({
            status: store.status,
            message: `Store is currently ${store.status}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to fetch store status"
        });
    }
}

module.exports = {
    storeDetails,
    getStatus
};
