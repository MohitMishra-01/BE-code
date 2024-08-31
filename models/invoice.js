const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  userId: String,
  products: [{
    quantity: Number,
    productName: String,
    description: String,
  }],
  subtotal: Number,
  total: Number,
  shipping: {
    address: {
      email: String,
      name: String,
      phone: String,
    },
    tax_exempt: String,
    tax_ids: [String],
  },
  delivery_status: String,
  payment_status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;