const Stripe = require("stripe");
const { Order } = require("../models/Order");
require("dotenv").config();
const zlib = require('zlib');
const { sendNewOrder } = require('./sseController');
const Coupon = require('../models/coupon');
const stripe = Stripe(process.env.STRIPE_KEY);
const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


const createCheckoutSession = async (req, res) => {
  try {
    const { comboData, cartData, amount, userData, deliveryType, couponCode } = req.body.data;
    console.log("that is combodata", comboData);
    console.log("Delivery Type:", deliveryType); // Log delivery type for debugging

    const compressedCartData = zlib.gzipSync(JSON.stringify(cartData)).toString('base64');

    let customerMetadata = {
      userId: userData.userId,
      cartData: compressedCartData,
      deliveryType: deliveryType.type || "unknown",
      couponCode: couponCode || null
    };

    // Check if comboData is not empty
    if (comboData && Object.keys(comboData).length > 0) {
      const compressedComboData = zlib.gzipSync(JSON.stringify(comboData)).toString('base64');
      customerMetadata.comboData = compressedComboData;
    }

    const customer = await stripe.customers.create({
      metadata: customerMetadata,
    });

    const unitAmount = Math.round(amount.total * 100);

    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Total Amount",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        }
      ],
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      phone_number_collection: {
        enabled: true,
      },
      mode: "payment",
      customer: customer.id,
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    // Send the URL of the checkout session to the client
    res.send({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};



const createOrder = async (customer, data) => {
  const { userId, couponCode } = customer.metadata;
  try {
    // Decompress cartData from customer metadata
    const decompressedCartData = zlib.gunzipSync(Buffer.from(customer.metadata.cartData, 'base64')).toString();
    const Items = JSON.parse(decompressedCartData);

    // Map cart items
    const products = Items.map((item) => {
      const toppingNames = item.toppings.length > 0 ? item.toppings.map(topping => topping.text) : ["No description"];
      return {
        productId: item.id,
        productName: item.name,
        extraTopings: toppingNames.join(', '),
        quantity: item.qty,
        imageUrl: item.img,
      };
    });

    // Check if comboData exists in customer metadata
    let combo = null;
    if (customer.metadata.comboData) {
      const decompressedComboData = zlib.gunzipSync(Buffer.from(customer.metadata.comboData, 'base64')).toString();
      const comboItems = JSON.parse(decompressedComboData);

      // Handle combo items as an object
      combo = {
        offerName: comboItems.offerName || "No offer name",
        pizzas: Array.isArray(comboItems.pizza) ? comboItems.pizza.map(pizza => ({
          title: pizza.title || "No title",
          toppings: Array.isArray(pizza.toppings) ? pizza.toppings.join(', ') : "No toppings",
        })) : [],
        addedItems: Array.isArray(comboItems.addedItems) ? comboItems.addedItems.join(', ') : "No added items",
        extraAdded: comboItems.extraAdded,
        totalAmount: comboItems.totalAmount || 0,
      };
    }

     // Update the coupon usage
     if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });

      coupon.usedBy.push(userId);
      await coupon.save();
    }


    // Create and save a new order
    const newOrder = new Order({
      userId: customer.metadata.userId,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      products,
      combo, // Will be null if comboData was empty
      subtotal: data.amount_subtotal / 100,
      total: data.amount_total / 100,
      shipping: data.customer_details,
      payment_status: data.payment_status,
      transactionId: data.payment_intent,
      deliveryType: customer.metadata.deliveryType || "unknown"
    });

    const savedOrder = await newOrder.save;
    console.log("Processed Order:", savedOrder);

    
    // Emit SSE event
    sendNewOrder(savedOrder);

    // Send SMS notification
    const phoneNumber = data.customer_details.phone; 

    let deliveryType = customer.metadata.deliveryType;

    if (deliveryType === 'Pickup') {
        messageBody = `Dear Customer, your order (ID: ${savedOrder._id}) at Inwood Pizza will be ready for pickup in a few minutes. Thank you for choosing us! We look forward to seeing you soon.`;
    } else if (deliveryType === 'Delivery') {
        messageBody = `Dear Customer, your order (ID: ${savedOrder._id}) at Inwood Pizza is on its way and will arrive shortly. Thank you for choosing us! Enjoy your meal!`;
    } else {
        messageBody = `Dear Customer, your order (ID: ${savedOrder._id}) at Inwood Pizza has been confirmed. Thank you for choosing us!`;
    }

    await twilioClient.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
    });
    

  } catch (error) {
    console.log("Error in createOrder:", error);
  }
};




const handleWebhook = async (req, res) => {
  try {
    let data;
    let eventType;

    let webhookSecret;
    //webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (error) {
        console.log(`⚠  Webhook signature verification failed:  ${error}`);
        return res.sendStatus(400);
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            await createOrder(customer, data);
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => console.log(error.message));
    }

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      success: false,
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
      // const orderItems = await Order.find();
      const orderItems = await Order.find().sort({ createdAt: -1 });

       res.status(200).json({
          message: "View Order Successfully",
          success: true,
          data:{
              order: orderItems,
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

module.exports = { createCheckoutSession, createOrder, handleWebhook, getAllOrders};
