const { Order } = require("../models/Order");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = async (req, res) => {
  const { orderId } = req.params;
  try {
    // Fetch order data from MongoDB for the specified order ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send('Order not found');
    }

    const creationTime = order.createdAt.toLocaleString('en-US', { timeZone: 'America/New_York' });

    // Generate PDF invoice
    const pdfBuffer = await generateInvoicePDF(order, creationTime);

    // Send the PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).send('Error generating invoice');
  }
};

async function generateInvoicePDF(order, creationTime) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Generate PDF content
    doc.fontSize(20).text('Order Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Order ID: ${order._id}`);
    doc.text(`Transaction ID: ${order.transactionId}`);
    doc.text(`Order Creation Time: ${creationTime}`);
    doc.text(`Payment Status: ${order.payment_status}`);

    // Determine the delivery type
    const deliveryType = order.deliveryType || 'Home Delivery';
    doc.text(`Delivery Type: ${deliveryType}`);

    // Conditionally show status based on delivery type
    if (deliveryType === 'Pickup') {
      doc.text(`Takeaway Status: ${order.takeaway_status}`);
    } else {
      doc.text(`Delivery Status: ${order.delivery_status}`);
    }

    doc.text(`Total: $${order.total.toFixed(2)}`);
    doc.moveDown();

    // Conditionally display the address based on the delivery type
    if (deliveryType === 'Pickup') {
      doc.text('Pickup Address:', { underline: true });
      doc.text('179 Sherman Ave');
      doc.text('NY 10034');
      doc.text('New York, NY, United States');
    } else {
      doc.text('Shipping Address:', { underline: true });
      doc.text(`Email: ${order.shipping.email}`);
      doc.text(`Name: ${order.shipping.name}`);
      doc.text(`Address 1: ${order.shipping.address.line1}`);
      doc.text(`Address 2: ${order.shipping.address.line2}`);
      doc.text(`City: ${order.shipping.address.city}`);
      doc.text(`Country: ${order.shipping.address.country}`);
      doc.text(`Zip Code: ${order.shipping.address.postal_code}`);
      doc.text(`State: ${order.shipping.address.state}`);
      doc.text(`Phone: ${order.shipping.phone}`);
    }

    doc.moveDown();

    if (order.products && order.products.length > 0) {
      doc.text('Products:', { underline: true });
      order.products.forEach(product => {
        doc.text(`Name: ${product.productName}`);
        doc.text(`Toppings: ${product.extraTopings}`);
        doc.text(`Quantity: ${product.quantity}`);
        doc.moveDown();
      });
    }

    if (order.combo && order.combo.length > 0) {
      doc.text('Combo Items:', { underline: true });
      order.combo.forEach(combo => {
        doc.text(`Offer Name: ${combo.offerName}`);
        doc.text('Pizzas:');
        combo.pizzas.forEach(pizza => {
          doc.text(`  - Base: ${pizza.title}`);
          doc.text(`    Toppings: ${pizza.toppings}`);
        });
        doc.text(`Added Items: ${combo.addedItems}`);
        doc.text(`Extra Added: ${combo.extraAdded}`);
        doc.moveDown();
      });
    }

    doc.end();
  });
}


module.exports = { generateInvoice };
