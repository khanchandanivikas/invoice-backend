const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  status: {
    type: String,
    enum: ["paid", "pending"],
    required: true,
  },
  senderStreet: {
    type: String,
    required: true,
  },
  senderCity: {
    type: String,
    required: true,
  },
  senderPostCode: {
    type: Number,
    required: true,
  },
  senderCountry: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  paymentDue: {
    type: String,
    required: true,
  },
  paymentTerms: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  totalBill: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Types.ObjectId,
    ref: "Client",
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
