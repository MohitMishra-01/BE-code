const express = require('express');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/product');
const adminRoutes = require("./routes/admin")
const storeRoutes = require("./routes/store")
const imageRoutes = require('./routes/image')
const stripeRoutes = require('./routes/stripe')
const invoiceRoutes = require('./routes/invoice');
const couponRoutes = require('./routes/coupon')
const comboRoutes = require('./routes/combo')
const sseRoutes = require('./routes/sseRoutes');
const cors = require("cors")

const app = express();
dotenv.config();

// Middleware
app.use(bodyParser.json({ limit: "3mb" }));
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/product', productRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/invoice', invoiceRoutes); 

// Admin Routes
app.use('/api/admin', adminRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/coupon', couponRoutes);
app.use('/api/combo', comboRoutes);

// SSE Route
app.use('/api/sse', sseRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
